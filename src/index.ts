import { Hono } from "hono"
import { generateKeyPair, SignJWT, exportJWK } from "jose"
import { Login } from "./pages/login"
import { secureHeaders } from "hono/secure-headers"
import { getCookie, setCookie } from "hono/cookie"
import { db } from "./lib/db"
import { clients, exchangeCodes } from "./lib/schema"
import { eq } from "drizzle-orm"
import { generateCode } from "./lib/utils"

const app = new Hono()

app.use(secureHeaders())

const { privateKey, publicKey } = await generateKeyPair("RS256")

// Login
app.get("/login", async c => {
  const { redirect_to } = c.req.query();

  return c.html(Login({ redirect: !!redirect_to, to: redirect_to || "" }))
})

app.post("/login", async c => {
  const formData = await c.req.formData()
  const username = formData.get('username')
  const password = formData.get('password')
  const redirect_to = formData.get('redirect_to')

  if(!username || !password) {
    return c.json({ success: false, error: "Fields missing" })
  }

  if(username === "example" && password == "123") {
    setCookie(c, "session", btoa(`${username}:${password}`))

    if(redirect_to) {
      const { path, client_id, redirect_uri, state } = JSON.parse(decodeURI(redirect_to.toString()))
      return c.redirect(`${path}?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`)
    }

    return c.redirect("/")
  }

  return c.json({ success: false, error: "Invalid credentials" })
})

// Register
app.get("/register", async c => {
  const { redirect_to } = c.req.query();

  return c.html(Login({ redirect: !!redirect_to, to: redirect_to || "" }))
})

// Authorize
app.get("/authorize", async c => {
  const { client_id, redirect_uri, state } = c.req.query();
  const sessionCookie = getCookie(c, "session")

  if(client_id === undefined  || redirect_uri === undefined || state === undefined) {
    // TODO: Change this to a page showing an error.
    return c.json({ success: false, error: "There is data missing" }, 400)
  }

  if(!sessionCookie) {
    const url = new URL(c.req.url)
    const to = { path: url.pathname, client_id, redirect_uri, state }
    return c.redirect(`/login?redirect_to=${encodeURI(JSON.stringify(to))}`)
  }

  // TODO: Check session
  // Get client from DB
  const results = await db.select().from(clients).where(eq(clients.public_id, parseInt(client_id.toString()))).limit(1)

  // Check if there is a result
  if(results.length === 0) {
    // TODO: Same as before, need to show a proper error page.
    return c.json({ success: false, error: "Client not found" }, 400)
  }

  const authorizedClient = results[0]

  // Check if redirect_uri is authorized
  if(!authorizedClient?.redirect_uris?.includes(redirect_uri.toString())) {
    return c.json({ success: false, error: "Redirect URI not authorized" }, 400)
  }

  // Generate code
  const code = generateCode();

  // Publish to DB
  db.insert(exchangeCodes).values({
    code,
    user_id: crypto.randomUUID(), // TODO: Get user from session
    client_id: authorizedClient.id,
    redirect_uri: redirect_uri.toString(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  })

  return c.redirect(`${redirect_uri}?code=${code}&state=${state}`)
})

// Exchange code
app.post("/token", async c => {
  const body = await c.req.parseBody()
  const code = body['code']

  // TODO: Check code & retrieve user from DB

  // Creating a JWT
  const jwt = await new SignJWT({
    sub: 'user_demo',
    email: '',
    aud: 'client:client_id-example',
    "urn:leiuq:roles": ["base", "demo"],
  }).setProtectedHeader({ alg: "RS256" }).setIssuedAt().setIssuer("https://accounts.example.com").setExpirationTime("2h").sign(privateKey)

  // TODO: Create 2 diff. tokens (access & id)
  return c.json({
    access_token: jwt,
    id_token: jwt,
    token_type: 'Bearer',
    expires_in: 7200
  })
})


// DEBUG

app.get("/", async c => {
  const isAuthenticated = getCookie(c, "session") ? true : false;

  return c.html(`
  <html>
    <a href="/authorize?client_id=example&redirect_uri=http://localhost:3000/debug&state=code">Login</a>
    <br />
    ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}
    ${isAuthenticated ? '<br /><a href="/logout">Logout</a>' : ''}
  </html>
  `, 200)
})

app.get("/debug", async c => {
  const q = c.req.queries();
  
  return c.html(`
  <html>
    <pre>${JSON.stringify(q)}</pre>
  </html>
  `, 200)
})

app.get("/logout", async c => {
  setCookie(c, "session", "", { maxAge: 0 })
  return c.redirect("/")
})

// Public key share
app.get("/.well-known/jwks.json", async (c) => {
  const jwk = await exportJWK(publicKey)
  return c.json({ keys: [jwk] })
})

export default app
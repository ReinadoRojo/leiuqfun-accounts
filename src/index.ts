import { Hono } from "hono"
import { html } from "hono/html"
import { generateKeyPair, SignJWT, importJWK, exportJWK } from "jose"
import { Login } from "./pages/login"

const app = new Hono()

const { privateKey, publicKey } = await generateKeyPair("RS256")

// Login
app.get("/authorize", async c => {
  const { client_id, redirect_uri, state } = c.req.query();

  if(client_id === undefined  || redirect_uri === undefined || state === undefined) {
    // TODO: Change this to a page showing an error.
    return c.json({ success: false, error: "There is data missing" }, 400)
  }

  // TODO: Check session
  // TODO: Check client_id on DB and check if data requested is authorized (mainly client_id)

  return c.html(Login({ client_id, client_name: "tomate" }))

  const code = crypto.randomUUID(); // TODO: Expected to be changed.

  return c.redirect(`${redirect_uri}?code=${code}&state=${state}`)
})

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
})

app.get("/", async c => {
  return c.html(`
  <html>
    <a href="/authorize?client_id=example&redirect_uri=http://localhost:3000/debug&state=code">Login</a>
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

// Public key share
app.get("/.well-known/jwks.json", async (c) => {
  const jwk = await exportJWK(publicKey)
  return c.json({ keys: [jwk] })
})

export default app
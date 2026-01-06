import { Index } from "@/pages"
import { Login } from "@/pages/login"
import { Hono } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import { secureHeaders } from "hono/secure-headers"
import { exportJWK, generateKeyPair } from "jose"
import { api } from "./routes/api"
import { dashboard } from "./routes/dashboard"

const app = new Hono()

app.use(secureHeaders())

export const { privateKey, publicKey } = await generateKeyPair("RS256")

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

// DEBUG

app.get("/", async c => {
  const isAuthenticated = getCookie(c, "session") ? true : false;

  return c.html(Index(), 200)
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


// Dashboard routes
app.route('/dashboard', dashboard)

// API routes
app.route('/api', api)

export default app
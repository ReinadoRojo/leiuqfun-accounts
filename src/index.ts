import { Login } from "@/pages/login"
import { Hono } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import { secureHeaders } from "hono/secure-headers"
import { exportJWK, generateKeyPair } from "jose"
import { api } from "@/routes/api"
import { dashboard } from "@/routes/dashboard"

const app = new Hono()

app.use(secureHeaders())

export const { privateKey, publicKey } = await generateKeyPair("RS256")

// DEBUG
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
import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import { getCookie, setCookie } from "hono/cookie"
import { secureHeaders } from "hono/secure-headers"
import { exportJWK, generateKeyPair } from "jose"
import ErrorPage from "./pages/error"
import { admin, api, auth, dashboard } from "./routes"
import { reactRender } from "./routes/common"

const app = new Hono()

app.use(secureHeaders())

app.use(async (c, next) => {
  const authRoutes = ["/auth/login", "/auth/register"];
  const publicRoutes = ["/about", "/contact", "/static", "/api"];

  const sessionCookie = getCookie(c, "session")
  const isAuthenticated = !!sessionCookie
  const path = c.req.path

  // Public Routes (no auth check)
  if(publicRoutes.some(routes => path.startsWith(routes))) {
    return await next()
  }

  // Auth Routes (only if not authenticated)
  if(authRoutes.some(routes => path.startsWith(routes))) {
    if(isAuthenticated) {
      return c.redirect("/")
    }
    return await next()
  }

  // Private Routes (auth check)
  if(!isAuthenticated) {
    return c.redirect(`/auth/login?redirect_to=${encodeURIComponent(c.req.url)}`)
  }

  return await next()
})

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

// Static files
app.use(
  '/static/*',
  serveStatic({
    root: './public',
    rewriteRequestPath(path) {
      return path.replace('/static/', '/')
    },
    onNotFound(path, c) {
      console.log(`Static file not found: ${path}`)
    },
  }),
)

// Layout
app.get(
  '*',
  reactRender
)

// Auth routes
app.route('/auth', auth)

// Dashboard routes
app.route("/", dashboard)

// API routes
app.route('/api', api)

// Admin routes
app.route('/admin', admin)

// 404 Page
app.notFound(c => {
  return c.render(ErrorPage(), { title: "Error!" });
})

export default app
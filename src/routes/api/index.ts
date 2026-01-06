import { privateKey } from "@/.";
import { db } from "@/lib/db";
import { clients, exchangeCodes } from "@/lib/schema";
import { checkExchangeCodes, generateCode } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { SignJWT } from "jose";

const api = new Hono()

// Authorize
api.get("/authorize", async c => {
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
  const results = await db.select().from(clients).where(eq(clients.id, client_id.toString())).limit(1)

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
  await db.insert(exchangeCodes).values({
    code,
    user_id: sessionCookie, // TODO: Get user from session
    client_id: authorizedClient.id,
    redirect_uri: redirect_uri.toString(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  })

  return c.redirect(`${redirect_uri}?code=${code}&state=${state}`)
})

// Exchange code
api.post("/token", async c => {
  const body = await c.req.json()
  const code = body['code']
  const redirect_uri = body['redirect_uri']

  // Check for missing data
  if(!code || !redirect_uri) return c.json({ success: false, error: "Data missing" }, 400)

  const [isValid, errorMessage, exchangeCode] = await checkExchangeCodes({ code, redirect_uri })

  if(!isValid) {
    return c.json({ success: false, error: errorMessage }, 400)
  }

  // Creating a JWT
  const jwt = await new SignJWT({
    sub: exchangeCode.user_id,
    email: exchangeCode.user_id + "@shadow-mail.example.com",
    aud: exchangeCode.client_id,
    "urn:leiuq:roles": ["base", "demo"],
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt().setIssuer("https://accounts.example.com")
    .setExpirationTime("2h")
    .sign(privateKey)

  // TODO: Create 2 diff. tokens (access & id)
  return c.json({
    access_token: jwt,
    id_token: jwt,
    token_type: 'Bearer',
    expires_in: 7200
  })
})

export { api };

import { type Column, eq } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { randomBytes } from "node:crypto";
import { db } from "./db";
import { exchangeCodes } from "./schema";
import { SignJWT } from "jose";

export const generateCode = (): string => {
  const genCode = randomBytes(32).toString("hex");
  return genCode;
};

export const checkExchangeCodes = async ({
  code,
  redirect_uri,
}: {
  code: string;
  redirect_uri: string;
}): Promise<[boolean, string | null, any]> => {
  // Get exchange code from DB
  const results = await db
    .select()
    .from(exchangeCodes)
    .where(eq(exchangeCodes.code, code.toString()))
    .limit(1);

  // Check if there is a result
  if (results.length === 0 || !results[0]) return [false, "Invalid code", null];
  const exchangeCode = results[0];

  try {
    // Check expiration
    if (exchangeCode.expiresAt < new Date())
      return [false, "Code expired", null];

    // Check redirect_uri
    if (exchangeCode.redirect_uri !== redirect_uri.toString())
      return [false, "Redirect URI integrity check failed", null];

    return [true, null, exchangeCode];
  } catch {
    return [false, "Error checking exchange code", null];
  } finally {
    await db.delete(exchangeCodes).where(eq(exchangeCodes.id, exchangeCode.id));
  }
};

export const isPresentOnDb = async ({
  table,
  column,
  value,
}: {
  table: SQLiteTable;
  column: Column;
  value: any;
}) => {
  const results = await db
    .select()
    .from(table)
    .limit(1)
    .where(eq(column, value));
  return results.length > 0;
};

export const sessionJwt = async ({
  userId,
  email,
  audience,
  payload,
  privateKey,
}: {
  userId: string;
  email: string;
  privateKey: any;
  audience?: string;
  payload?: object;
}) => {
  const jwt = await new SignJWT({
    sub: userId,
    email: email,
    aud: audience || "se:accounts",
    ...payload,
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setIssuer("https://accounts.example.com")
    .setExpirationTime("2h")
    .sign(privateKey);

  return jwt;
};

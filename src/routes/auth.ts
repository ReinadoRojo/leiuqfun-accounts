import { db } from "@/lib/db";
import { emails, users } from "@/lib/schema";
import { isPresentOnDb, sessionJwt } from "@/lib/utils";
import { Login } from "@/pages/login";
import { Register } from "@/pages/register";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { privateKey } from "..";

const auth = new Hono();

// Auth routes
// > Views
auth.get("/login", (c) =>
  c.render(
    Login({ next: c.req.query("next"), notice: c.req.query("notice") }),
    { removeSidebar: true, title: "Login" },
  ),
);
auth.get("/register", (c) =>
  c.render(
    Register({ next: c.req.query("next"), notice: c.req.query("notice") }),
    { removeSidebar: true, title: "Register" },
  ),
);

// > Actions (API)
auth.post("/login", async (c) => {
  const body = await c.req.parseBody();
  const { usernameOrEmail, password, next } = body as {
    usernameOrEmail?: string;
    password?: string;
    next?: string;
  };
  const encodedNext = next
    ? `&next=${encodeURIComponent(next.toString())}`
    : "";

  if (!usernameOrEmail || !password) {
    return c.redirect(
      `/auth/login?notice=${encodeURIComponent("Please fill all fields.")}${encodedNext}`,
    );
  }

  // Check if user entered an username or an email
  const isEmail = usernameOrEmail.includes("@");
  let user;
  let email;
  if (isEmail) {
    // Find email record
    // Join with users table to get user
    const emailRecordWithUser = await db
      .select()
      .from(emails)
      .where(eq(emails.emailAddress, usernameOrEmail))
      .innerJoin(users, eq(emails.id, users.primaryEmailAddress))
      .execute();

    if (!emailRecordWithUser[0] || !emailRecordWithUser[0].users) {
      return c.redirect(
        `/auth/login?notice=${encodeURIComponent("Invalid email or password.")}${encodedNext}`,
      );
    }

    user = emailRecordWithUser[0].users;
    email = emailRecordWithUser[0].emails;
  } else {
    // Find user by username
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.username, usernameOrEmail))
      .innerJoin(emails, eq(users.primaryEmailAddress, emails.id))
      .execute();

    if (!userRecord[0]) {
      return c.redirect(
        `/auth/login?notice=${encodeURIComponent("Invalid email or password.")}${encodedNext}`,
      );
    }

    user = userRecord[0].users;
    email = userRecord[0].emails;
  }

  // Verify password
  const passwordIsMatch = await Bun.password.verify(
    password.toString(),
    user.password,
  );

  if (!passwordIsMatch) {
    return c.redirect(
      `/auth/login?notice=${encodeURIComponent("Invalid email or password.")}${encodedNext}`,
    );
  }

  // Check if email is verified
  if (email.verification == null) {
    return c.redirect(
      `/auth/login?notice=${encodeURIComponent("Please, verify your email before loggin in.")}${encodedNext}`,
    );
  }

  // Create session and set cookie
  const sessJwt = await sessionJwt({
    userId: user.id,
    email: email.emailAddress,
    privateKey: privateKey,
  });
  setCookie(c, "session", `${user.id}:${sessJwt}`);

  // Redirect to next or home
  const redirectTo = next ? decodeURIComponent(next.toString()) : "/";
  return c.redirect(redirectTo);
});

auth.post("/register", async (c) => {
  const body = await c.req.parseBody();
  const { username, email, password, next } = body;
  const encodedNext = next
    ? `&next=${encodeURIComponent(next.toString())}`
    : "";

  // Form validation
  const errors = [];
  if (!username || username.toString().length < 3) {
    errors.push("Username must be at least 3 characters long.");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toString())) {
    errors.push("Invalid email address.");
  }

  if (!password || password.toString().length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }

  if (errors.length > 0) {
    return c.redirect(
      `/auth/register?notice=${encodeURIComponent(errors.join(" "))}${encodedNext}`,
    );
  }

  // Check for unique email and username
  const isEmailInUse = await isPresentOnDb({
    table: emails,
    column: emails.emailAddress,
    value: email,
  });
  if (isEmailInUse) {
    return c.redirect(
      `/auth/register?notice=${encodeURIComponent("Email address is already in use.")}${encodedNext}`,
    );
  }

  const isUsernameInUse = await isPresentOnDb({
    table: users,
    column: users.username,
    value: username,
  });
  if (isUsernameInUse) {
    return c.redirect(
      `/auth/register?notice=${encodeURIComponent("Username is already in use.")}${encodedNext}`,
    );
  }

  // Hash password and create user
  const hashedPassword = await Bun.password.hashSync(password!.toString());

  // Create email record
  const emailEntry = await db
    .insert(emails)
    .values({
      emailAddress: email!.toString(),
      verification: null,
    })
    .returning();

  if (emailEntry.length === 0 || !emailEntry[0]) {
    return c.redirect(
      `/auth/register?notice=${encodeURIComponent("Failed to create email record.")}${encodedNext}`,
    );
  }

  // Create user record with data.
  const createdUser = await db
    .insert(users)
    .values({
      username: username!.toString(),
      password: hashedPassword,
      primaryEmailAddress: emailEntry[0].id,
      emailAddresses: [emailEntry[0].id],
    })
    .returning();

  // TODO: Send verification email

  // Send user to login page with a success message
  return c.redirect(
    `/auth/login?notice=${encodeURIComponent("Account created! You need to verify your email before logging in.")}${encodedNext}`,
  );
});

export { auth };

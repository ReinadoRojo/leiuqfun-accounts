import {
  blob,
  index,
  int,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// Clerk like email system.

export const emails = sqliteTable("emails", {
  id: text()
    .primaryKey()
    .$default(() => crypto.randomUUID())
    .notNull(),
  emailAddress: text().unique().notNull(),
  verification: int({ mode: "timestamp_ms" }),
  createdAt: int({ mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
});

export const roles = sqliteTable("roles", {
  id: text()
    .primaryKey()
    .$default(() => crypto.randomUUID())
    .notNull(),
  roleName: text().unique().notNull(),
  rolePermissions: blob({ mode: "json" }).$type<string[]>().notNull(),
  createdAt: int({ mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
});

export const users = sqliteTable(
  "users",
  {
    id: text()
      .primaryKey()
      .$default(() => crypto.randomUUID()),
    username: text().notNull().unique(),
    password: text().notNull(),

    role: text({ mode: "text" }).references(() => roles.id), // FK for ID row on table roles

    emailAddresses: blob({ mode: "json" }).notNull().$type<string[]>(), // List of IDs for table emails
    primaryEmailAddress: text()
      .notNull()
      .references(() => emails.id),

    createdAt: int({ mode: "timestamp_ms" }).$default(() => new Date()),
  },
  (t) => [
    index("idx_users_role").on(t.role),
    uniqueIndex("idx_users_primaryEmailAddress").on(t.primaryEmailAddress),
  ],
);

export const clients = sqliteTable("clients", {
  id: text()
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  public_id: int({ mode: "number" }).unique(),
  name: text(),
  secret: text(),
  redirect_uris: blob({ mode: "json" }).$type<string[]>(),
  createdAt: int({ mode: "timestamp_ms" }).$default(() => new Date()),
});

export const exchangeCodes = sqliteTable("exchange_codes", {
  id: text()
    .primaryKey()
    .$default(() => crypto.randomUUID())
    .notNull(),
  code: text().unique(),
  client_id: text()
    .references(() => clients.id)
    .notNull(),
  user_id: text()
    .references(() => users.id)
    .notNull(),
  redirect_uri: text().notNull(),
  expiresAt: int({ mode: "timestamp_ms" })
    .$default(() => new Date(Date.now() + 5 * 60 * 1000))
    .notNull(),
  createdAt: int({ mode: "timestamp_ms" })
    .$default(() => new Date(Date.now()))
    .notNull(),
});

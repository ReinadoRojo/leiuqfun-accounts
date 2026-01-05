import { blob, index, int, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// Clerk like email system.

export const emails = sqliteTable("emails", { 
    id: text({ mode: 'text' }).$default(() => crypto.randomUUID()),
    emailAddress: text({ mode: 'text' }).unique(),
    verification: int({ mode: 'timestamp_ms' }),
    createdAt: int({ mode: 'timestamp_ms' }).$default(() => new Date()),
});

export const roles = sqliteTable("roles", {
    id: text({ mode: 'text' }).$default(() => crypto.randomUUID()),
    roleName: text({ mode: 'text' }).unique(),
    rolePermissions: blob({ mode: 'json' }).$type<string[]>(),
    createdAt: int({ mode: 'timestamp_ms' }).$default(() => new Date()),
});

export const users = sqliteTable("users", {
    id: text().primaryKey().$default(() => crypto.randomUUID()),
    username: text({ mode: 'text' }),
    password: text({ mode: 'text' }),

    role: text({ mode: "text" }).references(() => roles.id),   // FK for ID row on table roles
    
    emailAddresses: blob({ mode: 'json' }).$type<string[]>(),   // List of IDs for table emails
    primaryEmailAddress: text({ mode: 'text' }).references(() => emails.id),

    createdAt: int({ mode: 'timestamp_ms' }).$default(() => new Date()),
}, (t) => [
    index("idx_users_role").on(t.role),
    uniqueIndex("idx_users_primaryEmailAddress").on(t.primaryEmailAddress),
]);

export const clients = sqliteTable("clients", {
    id: text().primaryKey().$default(() => crypto.randomUUID()),
    public_id: int({ mode: 'number' }).unique(),
    name: text({ mode: 'text' }),
    secret: text({ mode: 'text' }),
    redirect_uris: blob({ mode: 'json' }).$type<string[]>(),
    createdAt: int({ mode: 'timestamp_ms' }).$default(() => new Date()),
});

export const exchangeCodes = sqliteTable("exchange_codes", {
    id: text().primaryKey().$default(() => crypto.randomUUID()),
    code: text({ mode: 'text' }).unique(),
    client_id: text({ mode: 'text' }).references(() => clients.id),
    user_id: text({ mode: 'text' }).references(() => users.id),
    redirect_uri: text({ mode: 'text' }),
    expiresAt: int({ mode: 'timestamp_ms' }),
    createdAt: int({ mode: 'timestamp_ms' }).$default(() => new Date()),
});
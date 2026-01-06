import { db } from "./lib/db";
import { clients, emails, roles, users } from "./lib/schema";


try {
    // Create a client
    const client = await db.insert(clients).values({
        public_id: 0,
        name: "Test Client",
        secret: "supersecret",
        redirect_uris: ["http://localhost:3000/debug"],
    }).returning();

    if(client.length === 0 || !client[0]) {
        throw new Error("Failed to create client");
    }

    // Create a role
    const role = await db.insert(roles).values({
        roleName: "base",
        rolePermissions: ["base:base"]
    }).returning();

    if(role.length === 0 || !role[0]) {
        throw new Error("Failed to create role");
    }

    // Create an email
    const email = await db.insert(emails).values({
        emailAddress: "test@example.com",
        verification: new Date(),
    }).returning();

    console.log("Inserted email:", email);

    if(email.length === 0 || !email[0]) {
        throw new Error("Failed to create email");
    }

    // Create an user
    await db.insert(users).values({
        username: "testuser",
        password: "hashedpassword",
        primaryEmailAddress: email[0].id,
        emailAddresses: [email[0].id],
        role: role[0].id,
    })
} catch (error) {
    console.error("Seeding error:\n", error);
}
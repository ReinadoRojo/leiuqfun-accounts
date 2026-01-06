import { Hono } from "hono";

const admin = new Hono()

// admin.get("/", c => {
//   return c.render((), { title: "admin" });
// });

export { admin };
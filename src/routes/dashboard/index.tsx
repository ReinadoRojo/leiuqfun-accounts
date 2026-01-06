import { reactRenderer } from "@hono/react-renderer";
import { Hono } from "hono";

import DashboardIndex from "@/pages/dashboard/";

const dashboard = new Hono()

dashboard.get(
  '*',
  reactRenderer(({ children, title }) => {
    return (
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <title>{title}</title>
          {/* CDN for styles. TODO: Change it to package so is less heavy on load. (for production) */}
          <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body>
          <main className="container">
            {children}
          </main>
        </body>
      </html>
    )
  }, { stream: true, docType: true })
)

dashboard.get("/", c => {
    return c.render(DashboardIndex(), { title: "Dashboard" });
});

declare module '@hono/react-renderer' {
  interface Props {
    title: string
  }
}


export { dashboard };
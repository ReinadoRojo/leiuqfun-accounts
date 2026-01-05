import { html } from "hono/html";

export const Layout = ({ title, children }: { title: string; children: any }) => {
  return html`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
      </head>
      <body>
        <main class="container">
          ${children}
        </main>
      </body>
    </html>
    `
}
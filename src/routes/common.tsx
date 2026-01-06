import { reactRenderer } from "@hono/react-renderer"

const reactRender = reactRenderer(({ children, title }) => {
    return (
      <html lang="en" data-theme="light-apptheme">
        <head>
          <meta charSet="UTF-8" />
          <title>{title}</title>
          {/* CDN for styles. TODO: Change it to package so is less heavy on load. (for production) */}
          <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          <link href="/static/app.css" rel="stylesheet" type="text/css" />
        </head>
        <body className="bg-base-200 min-h-screen" data-theme="dark-apptheme">
          {children}
        </body>
      </html>
    )
  }, { stream: true })

export { reactRender }
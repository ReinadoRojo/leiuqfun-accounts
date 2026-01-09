import { Sidebar } from "@/components/sidebar"
import { reactRenderer } from "@hono/react-renderer"

const reactRender = reactRenderer(({ children, title, removeSidebar, scripts }) => {
    return (
      <html lang="en" data-theme="dark-apptheme">
        <head>
          <meta charSet="UTF-8" />
          <title>{title}</title>
          {/* CDN for styles. TODO: Change it to package so is less heavy on load. (for production) */}
          <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          <link href="/static/app.css" rel="stylesheet" type="text/css" />
        </head>
        <body className="bg-base-200 min-h-screen" data-theme="dark-apptheme">
          {!removeSidebar && <Sidebar />}
          <main className="h-full w-full pl-28 py-8 pr-12">
            {children}
          </main>
          {scripts && scripts.map((src, index) => (
            <script key={index} src={src}></script>
          ))}
        </body>
      </html>
    )
  }, { stream: true })

declare module '@hono/react-renderer' {
  interface Props {
    title: string
    removeSidebar?: boolean
    scripts?: string[]
  }
}

export { reactRender }
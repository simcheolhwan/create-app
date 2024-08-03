export function makeSrc(dependencies: string[]) {
  return {
    "postcss.config.cjs": () => {
      if (dependencies.includes("@mantine/core")) {
        return `module.exports = {
  plugins: {
    "postcss-preset-mantine": {},
  },
}
`
      }
    },

    "src/main.tsx": () => {
      const imports = [
        dependencies.includes("react-router-dom") &&
          'import { createBrowserRouter, RouterProvider } from "react-router-dom',
        dependencies.includes("@tanstack/react-query") &&
          'import { QueryClient, QueryClientProvider } from "@tanstack/react-query"',
        dependencies.includes("@mantine/core") && 'import { MantineProvider } from "@mantine/core"',
        dependencies.includes("@mantine/core") && 'import "@mantine/core/styles.css"',
        dependencies.includes("react-router-dom")
          ? 'import routes from "./routes"'
          : 'import App from "./app/App"',
        dependencies.includes("@mantine/core") && 'import theme from "./theme"',
      ].filter(Boolean)

      return `import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
${imports.join("\n")}

${dependencies.includes("react-router-dom") ? "const router = createBrowserRouter(routes)" : ""}
${dependencies.includes("@tanstack/react-query") ? "const queryClient = new QueryClient()" : ""}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
${dependencies.includes("@mantine/core") ? '<MantineProvider theme={theme} defaultColorScheme="dark">' : ""}
${dependencies.includes("@tanstack/react-query") ? "QueryClientProvider client={queryClient}>" : ""}
${dependencies.includes("react-router-dom") ? "<RouterProvider router={router} />" : "<App />"}
${dependencies.includes("@tanstack/react-query") ? "QueryClientProvider>" : ""}
${dependencies.includes("@mantine/core") ? "</MantineProvider>" : ""}
  </StrictMode>
)
`
    },

    "src/routes.tsx": () => {
      if (dependencies.includes("react-router-dom")) {
        return `import App from "./app/App"
import Home from "./pages/Home"

const routes = [
  {
    path: "/",
    element: <App />,
    children: [{ index: true, element: <Home /> }],
  },
]

export default routes
`
      }
    },

    "src/theme.ts": () => {
      if (dependencies.includes("@mantine/core")) {
        return `import { createTheme } from "@mantine/core"

const theme = createTheme({})

export default theme
`
      }
    },

    "src/app/App.tsx": () => {
      return `${dependencies.includes("react-router-dom") ? 'import { Outlet } from "react-router-dom"' : ""}

const App = () => {
  return ${dependencies.includes("react-router-dom") ? "<Outlet />" : "null"}
}

export default App
`
    },

    "src/pages/Home.tsx": () => {
      if (dependencies.includes("react-router-dom"))
        return `const Home = () => {
  return null
}

export default Home
`
    },
  }
}

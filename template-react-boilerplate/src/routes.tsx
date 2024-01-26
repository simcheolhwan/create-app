import App from "./app/App"
import Home from "./pages/Home"

const routes = [{ path: "/", element: <App />, children: [{ index: true, element: <Home /> }] }]

export default routes

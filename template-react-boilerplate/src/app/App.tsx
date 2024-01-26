import { AppShell, Container } from "@mantine/core"
import { Outlet } from "react-router-dom"

const App = () => {
  return (
    <AppShell>
      <AppShell.Header></AppShell.Header>

      <AppShell.Main>
        <Container>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default App

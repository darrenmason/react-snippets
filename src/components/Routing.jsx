import {
  Link,
  Outlet,
  RouterProvider,
  createMemoryRouter,
  useLoaderData,
} from 'react-router-dom'

function Layout() {
  return (
    <div className="stack">
      <nav className="row">
        <Link to="/">Overview</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  )
}

function OverviewRoute() {
  return <div className="muted">Route with a simple layout.</div>
}

async function profileLoader() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    name: 'Ada Lovelace',
    title: 'Lead Engineer',
  }
}

function ProfileRoute() {
  const data = useLoaderData()
  return (
    <div className="stack">
      <strong>{data.name}</strong>
      <div className="muted">{data.title}</div>
    </div>
  )
}

const router = createMemoryRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <OverviewRoute /> },
      { path: 'profile', element: <ProfileRoute />, loader: profileLoader },
    ],
  },
])

export default function Routing() {
  return <RouterProvider router={router} />
}


import type { ReactNode } from 'react'

import Navbar from './Navbar'

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">{children}</main>
    </div>
  )
}

export default AppShell

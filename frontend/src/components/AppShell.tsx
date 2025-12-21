import type { ReactNode } from 'react'

import Breadcrumbs from './Breadcrumbs'
import Footer from './Footer'
import Navbar from './Navbar'

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="app-root">
      <Navbar />
      <div className="breadcrumbs-wrap">
        <Breadcrumbs />
      </div>
      <div className="app-shell">
        <main className="page-content">{children}</main>
      </div>
      <Footer />
    </div>
  )
}

export default AppShell

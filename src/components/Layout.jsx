import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  ExternalLink
} from 'lucide-react'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Content Editor', href: '/content', icon: FileText },
    { name: 'Product Manager', href: '/products', icon: Package },
    { name: 'Site Settings', href: '/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      navigate('/login')
    }
  }

  const isActive = (href) => {
    return location.pathname === href
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-bg border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">ZTS_</h1>
            <span className="ml-2 text-xs text-gray-400 font-mono">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(item.href)
                    setSidebarOpen(false)
                  }}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="mr-3 w-5 h-5" />
                  {item.name}
                </a>
              )
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="mt-auto p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center">
                <span className="text-black text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white truncate max-w-[120px]">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-dark-bg border-b border-gray-800">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <a 
                  href="/public-site" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                  <ExternalLink className="w-4 h-4" />
                  View Site
              </a>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

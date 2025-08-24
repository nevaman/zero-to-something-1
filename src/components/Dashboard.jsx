import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, 
  Package, 
  Settings, 
  Edit3, 
  Plus, 
  TrendingUp,
  Clock,
  Users
} from 'lucide-react'
import { contentAPI } from '../lib/supabase'

const Dashboard = () => {
  const [stats, setStats] = useState({
    contentSections: 0,
    productCards: 0,
    lastUpdated: null
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [contentSections, productCards] = await Promise.all([
        contentAPI.getContentSections(),
        contentAPI.getProductCards()
      ])
      
      setStats({
        contentSections: contentSections.length,
        productCards: productCards.length,
        lastUpdated: new Date().toLocaleDateString()
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Edit Content',
      description: 'Update headlines, subtitles, and text content',
      icon: FileText,
      href: '/content',
      color: 'bg-blue-600'
    },
    {
      title: 'Manage Products',
      description: 'Add, edit, or remove product cards',
      icon: Package,
      href: '/products',
      color: 'bg-green-600'
    },
    {
      title: 'Site Settings',
      description: 'Configure global site settings and links',
      icon: Settings,
      href: '/settings',
      color: 'bg-purple-600'
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-800 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to the Zero to Something admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-bg border border-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Content Sections</p>
              <p className="text-2xl font-bold text-white">{stats.contentSections}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-bg border border-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-600 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Product Cards</p>
              <p className="text-2xl font-bold text-white">{stats.productCards}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-bg border border-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-600 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Last Updated</p>
              <p className="text-2xl font-bold text-white">{stats.lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <div
                key={action.title}
                className="bg-dark-bg border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors cursor-pointer group"
                onClick={() => navigate(action.href)}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 ${action.color} rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">{action.title}</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{action.description}</p>
                <div className="mt-4 flex items-center text-accent-blue text-sm font-medium">
                  Get Started
                  <TrendingUp className="w-4 h-4 ml-2" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="bg-dark-bg border border-gray-800 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-400">
              <div className="w-2 h-2 bg-accent-blue rounded-full mr-3"></div>
              <span>Dashboard loaded successfully</span>
              <span className="ml-auto font-mono">Just now</span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Content sections loaded: {stats.contentSections}</span>
              <span className="ml-auto font-mono">Just now</span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Product cards loaded: {stats.productCards}</span>
              <span className="ml-auto font-mono">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

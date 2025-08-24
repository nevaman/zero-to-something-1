import React, { useState, useEffect } from 'react'
import { Save, Settings, Globe, Share2, Calendar, BarChart3 } from 'lucide-react'
import { contentAPI } from '../lib/supabase'

const SiteSettings = () => {
  const [settings, setSettings] = useState([])
  const [editingSettings, setEditingSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await contentAPI.getSiteSettings()
      setSettings(data)
      // Initialize editing state
      const initialEditing = {}
      data.forEach(setting => {
        initialEditing[setting.setting_key] = setting.setting_value
      })
      setEditingSettings(initialEditing)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (settingKey, value) => {
    setEditingSettings(prev => ({ ...prev, [settingKey]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updatePromises = Object.entries(editingSettings).map(([key, value]) =>
        contentAPI.updateSiteSetting(key, value)
      )
      
      await Promise.all(updatePromises)
      
      // Update local state
      setSettings(prev => 
        prev.map(setting => ({
          ...setting,
          setting_value: editingSettings[setting.setting_key]
        }))
      )
      
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getSettingCategory = (key) => {
    if (key.includes('link')) return 'Social Links'
    if (key.includes('cycle')) return 'Current Cycle'
    if (key.includes('title')) return 'Site Information'
    return 'Other'
  }

  const getSettingIcon = (key) => {
    if (key.includes('link')) return Share2
    if (key.includes('cycle')) return Calendar
    if (key.includes('title')) return Globe
    return Settings
  }

  const getSettingType = (setting) => {
    switch (setting.setting_type) {
      case 'number':
        return 'number'
      case 'boolean':
        return 'checkbox'
      default:
        return 'text'
    }
  }

  const renderSettingInput = (setting) => {
    const value = editingSettings[setting.setting_key] || ''
    
    switch (setting.setting_type) {
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value === 'true'}
            onChange={(e) => handleInputChange(setting.setting_key, e.target.checked.toString())}
            className="w-4 h-4 text-accent-blue bg-black border-gray-700 rounded focus:ring-accent-blue focus:ring-2"
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
          />
        )
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(setting.setting_key, e.target.value)}
            className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
            placeholder={`Enter ${setting.setting_key.replace(/_/g, ' ')}`}
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Group settings by category
  const groupedSettings = settings.reduce((acc, setting) => {
    const category = getSettingCategory(setting.setting_key)
    if (!acc[category]) acc[category] = []
    acc[category].push(setting)
    return acc
  }, {})

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Site Settings</h1>
        <p className="text-gray-400">Configure global site settings and social media links</p>
      </div>

      {/* Save Button */}
      <div className="mb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-3 bg-accent-blue text-black font-medium rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-black transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Settings by Category */}
      <div className="space-y-8">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => {
          const Icon = getSettingIcon(categorySettings[0]?.setting_key)
          
          return (
            <div key={category} className="bg-dark-bg border border-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gray-700 rounded-lg mr-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{category}</h2>
                  <p className="text-gray-400">Manage {category.toLowerCase()} settings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categorySettings.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    {renderSettingInput(setting)}
                    <p className="text-xs text-gray-500 font-mono">
                      Type: {setting.setting_type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Settings Summary */}
      <div className="mt-8 bg-dark-bg border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Settings Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-gray-400">
            <span className="font-medium">Total Settings:</span> {settings.length}
          </div>
          <div className="text-gray-400">
            <span className="font-medium">Categories:</span> {Object.keys(groupedSettings).length}
          </div>
          <div className="text-gray-400">
            <span className="font-medium">Last Updated:</span> {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiteSettings

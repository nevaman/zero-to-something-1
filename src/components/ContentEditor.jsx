import React, { useState, useEffect } from 'react'
import { Save, Edit3, Eye, X } from 'lucide-react'
import { contentAPI } from '../lib/supabase'

const ContentEditor = () => {
  const [contentSections, setContentSections] = useState([])
  const [editingSection, setEditingSection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadContentSections()
  }, [])

  const loadContentSections = async () => {
    try {
      const sections = await contentAPI.getContentSections()
      setContentSections(sections)
    } catch (error) {
      console.error('Error loading content sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (section) => {
    setEditingSection({
      ...section,
      originalContent: section.content
    })
  }

  const handleCancel = () => {
    setEditingSection(null)
  }

  const handleSave = async () => {
    if (!editingSection) return

    setSaving(true)
    try {
      await contentAPI.updateContentSection(
        editingSection.section_key,
        editingSection.content
      )
      
      // Update local state
      setContentSections(prev => 
        prev.map(section => 
          section.id === editingSection.id 
            ? { ...section, content: editingSection.content }
            : section
        )
      )
      
      setEditingSection(null)
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Error saving content. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleContentChange = (content) => {
    setEditingSection(prev => ({ ...prev, content }))
  }

  const filteredSections = contentSections.filter(section =>
    section.section_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSectionDisplayName = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getSectionCategory = (key) => {
    if (key.startsWith('hero')) return 'Hero Section'
    if (key.startsWith('protocol')) return 'Protocol Section'
    if (key.startsWith('archive')) return 'Ship Log Section'
    if (key.startsWith('current_cycle')) return 'Current Cycle Section'
    if (key.startsWith('services')) return 'Services Section'
    if (key.startsWith('signal')) return 'Signal Section'
    return 'Other'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-800 rounded"></div>
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
        <h1 className="text-3xl font-bold text-white mb-2">Content Editor</h1>
        <p className="text-gray-400">Edit headlines, subtitles, and text content across the website</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search content sections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
        />
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {filteredSections.map((section) => {
          const isEditing = editingSection?.id === section.id
          const category = getSectionCategory(section.section_key)
          
          return (
            <div
              key={section.id}
              className="bg-dark-bg border border-gray-800 rounded-lg p-6"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {getSectionDisplayName(section.section_key)}
                  </h3>
                  <p className="text-sm text-gray-400">{category}</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => handleEdit(section)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-accent-blue hover:text-white hover:bg-accent-blue/10 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                )}
              </div>

              {/* Content Display/Edit */}
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      value={editingSection.content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue resize-vertical"
                    />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center px-4 py-2 bg-accent-blue text-black font-medium rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-black transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-mono">
                      {section.content_type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-600">
                      Last updated: {new Date(section.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div 
                    className="text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Edit3 className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No content sections found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No content sections available.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentEditor

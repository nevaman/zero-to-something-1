import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Eye,
  Package,
  Calendar,
  Tag
} from 'lucide-react'
import { contentAPI } from '../lib/supabase'

const ProductManager = () => {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await contentAPI.getProductCards()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingProduct({
      title: '',
      description: '',
      status: 'ACTIVE',
      cycle_info: '',
      image_url: '',
      modal_content: '',
      sort_order: products.length + 1
    })
    setShowAddForm(true)
  }

  const handleEdit = (product) => {
    setEditingProduct({ ...product })
    setShowAddForm(false)
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setShowAddForm(false)
  }

  const handleSave = async () => {
    if (!editingProduct) return

    setSaving(true)
    try {
      if (editingProduct.id) {
        // Update existing product
        await contentAPI.updateProductCard(editingProduct.id, editingProduct)
        setProducts(prev => 
          prev.map(p => p.id === editingProduct.id ? editingProduct : p)
        )
      } else {
        // Create new product
        const newProduct = await contentAPI.createProductCard(editingProduct)
        setProducts(prev => [...prev, newProduct])
      }
      
      setEditingProduct(null)
      setShowAddForm(false)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await contentAPI.deleteProductCard(productId)
      setProducts(prev => prev.filter(p => p.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product. Please try again.')
    }
  }

  const handleInputChange = (field, value) => {
    setEditingProduct(prev => ({ ...prev, [field]: value }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-900/50 text-green-400'
      case 'SUNSET': return 'bg-red-900/50 text-red-400'
      case 'PIVOTED': return 'bg-yellow-900/50 text-yellow-400'
      default: return 'bg-gray-900/50 text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Product Manager</h1>
          <p className="text-gray-400">Manage product cards and project information</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-accent-blue text-black font-medium rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-black transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Add/Edit Form */}
      {(editingProduct || showAddForm) && (
        <div className="mb-8 bg-dark-bg border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingProduct?.id ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingProduct?.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                placeholder="Product title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={editingProduct?.status || 'ACTIVE'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
              >
                <option value="ACTIVE">Active</option>
                <option value="SUNSET">Sunset</option>
                <option value="PIVOTED">Pivoted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cycle Info
              </label>
              <input
                type="text"
                value={editingProduct?.cycle_info || ''}
                onChange={(e) => handleInputChange('cycle_info', e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                placeholder="Cycle 01 / Aug 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                value={editingProduct?.sort_order || 1}
                onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                min="1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={editingProduct?.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                placeholder="Brief product description"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={editingProduct?.image_url || ''}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Modal Content
              </label>
              <textarea
                value={editingProduct?.modal_content || ''}
                onChange={(e) => handleInputChange('modal_content', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue resize-vertical"
                placeholder="Detailed content for the product modal..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving || !editingProduct?.title}
              className="flex items-center px-4 py-2 bg-accent-blue text-black font-medium rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-black transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-dark-bg border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
          >
            {/* Product Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{product.title}</h3>
              <span className={`font-mono text-xs px-2 py-1 rounded ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>

            {/* Product Info */}
            <p className="text-gray-400 mb-4">{product.description}</p>
            
            <div className="space-y-2 mb-4">
              {product.cycle_info && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {product.cycle_info}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <Tag className="w-4 h-4 mr-2" />
                Order: {product.sort_order}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-4 border-t border-gray-800">
              <button
                onClick={() => handleEdit(product)}
                className="flex items-center px-3 py-2 text-sm font-medium text-accent-blue hover:text-white hover:bg-accent-blue/10 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:text-white hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Package className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No products yet</h3>
            <p className="text-gray-500">Get started by adding your first product card.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManager

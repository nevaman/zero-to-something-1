import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for content management
export const contentAPI = {
  // Get all content sections
  async getContentSections() {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .order('section_key')
    
    if (error) throw error
    return data
  },

  // Update a content section
  async updateContentSection(sectionKey, content) {
    const { data, error } = await supabase
      .from('content_sections')
      .update({ content })
      .eq('section_key', sectionKey)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Get all product cards
  async getProductCards() {
    const { data, error } = await supabase
      .from('product_cards')
      .select('*')
      .order('sort_order')
    
    if (error) throw error
    return data
  },

  // Create a new product card
  async createProductCard(cardData) {
    const { data, error } = await supabase
      .from('product_cards')
      .insert(cardData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update a product card
  async updateProductCard(id, updates) {
    const { data, error } = await supabase
      .from('product_cards')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete a product card
  async deleteProductCard(id) {
    const { error } = await supabase
      .from('product_cards')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get site settings
  async getSiteSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('setting_key')
    
    if (error) throw error
    return data
  },

  // Update a site setting
  async updateSiteSetting(settingKey, value) {
    const { data, error } = await supabase
      .from('site_settings')
      .update({ setting_value: value })
      .eq('setting_key', settingKey)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

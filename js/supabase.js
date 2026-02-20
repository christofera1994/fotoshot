// Initialize Supabase Client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Supabase helper functions
const SupabaseService = {
  // Services
  async getServices() {
    const { data, error } = await supabaseClient
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createService(service) {
    const { data, error } = await supabaseClient
      .from('services')
      .insert([service]);
    if (error) throw error;
    return data;
  },

  async updateService(id, service) {
    const { data, error } = await supabaseClient
      .from('services')
      .update(service)
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  async deleteService(id) {
    const { data, error } = await supabaseClient
      .from('services')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  // Gallery
  async getGallery() {
    const { data, error } = await supabaseClient
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('images')
      .getPublicUrl(filePath);

    // Insert into gallery table
    const { data: galleryData, error: galleryError } = await supabaseClient
      .from('gallery')
      .insert([{ image_url: publicUrl }])
      .select();

    if (galleryError) throw galleryError;
    return galleryData;
  },

  async deleteGalleryImage(id, imageUrl) {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    // Delete from storage
    const { error: storageError } = await supabaseClient.storage
      .from('images')
      .remove([fileName]);

    if (storageError) throw storageError;

    // Delete from database
    const { data, error } = await supabaseClient
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  },

  // Contacts
  async createContact(contact) {
    const { data, error } = await supabaseClient
      .from('contacts')
      .insert([contact]);
    if (error) throw error;
    return data;
  },

  async getContacts() {
    const { data, error } = await supabaseClient
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Auth
  async signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
  },

  onAuthStateChange(callback) {
    return supabaseClient.auth.onAuthStateChange(callback);
  }
};

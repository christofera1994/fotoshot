# Photoshot - Photography Agency Website

A production-ready photography agency website built with HTML, CSS, JavaScript, and Supabase backend.

## Features

- **Dynamic Services Section**: Fetch and display services from Supabase
- **Dynamic Gallery**: Display images from Supabase Storage
- **Contact Form**: Submit contact messages to Supabase
- **Admin Panel**: Protected admin dashboard with authentication
  - Services CRUD (Create, Read, Update, Delete)
  - Gallery Management (Upload, Delete images)
  - View Contact Messages

## Setup Instructions

### 1. Supabase Configuration

1. Create a Supabase project at https://supabase.com
2. Get your Supabase URL and anon key from Project Settings > API
3. Open `js/config.js` and replace the placeholder values:
   ```javascript
   const SUPABASE_CONFIG = {
     url: "YOUR_SUPABASE_URL",
     anonKey: "YOUR_SUPABASE_ANON_KEY",
   };
   ```

### 2. Database Setup

Create the following tables in your Supabase database:

#### Table: `services`

```sql
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Table: `gallery`

```sql
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Table: `contacts`

```sql
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `images`
3. Set the bucket to **Public** (so images can be accessed)
4. Configure bucket policies to allow:
   - **Upload**: Authenticated users only (for admin)
   - **Read**: Public (for website visitors)

### 4. Authentication Setup

1. Go to Authentication > Settings in Supabase
2. Enable Email authentication
3. Create an admin user:
   - Go to Authentication > Users
   - Click "Add User"
   - Enter email and password
   - Save the credentials for admin login

### 5. Row Level Security (RLS) Policies

Enable RLS and create policies:

#### Services Table

```sql
-- Allow public read access
CREATE POLICY "Public can read services" ON services
  FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated can insert services" ON services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated can update services" ON services
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated can delete services" ON services
  FOR DELETE USING (auth.role() = 'authenticated');
```

#### Gallery Table

```sql
-- Allow public read access
CREATE POLICY "Public can read gallery" ON gallery
  FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated can insert gallery" ON gallery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated can delete gallery" ON gallery
  FOR DELETE USING (auth.role() = 'authenticated');
```

#### Contacts Table

```sql
-- Allow public insert (for contact form)
CREATE POLICY "Public can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read
CREATE POLICY "Authenticated can read contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 6. Storage Policies

For the `images` bucket:

```sql
-- Allow public read access
CREATE POLICY "Public can read images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated can delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
```

### 7. Deploy

1. Upload all files to your web server
2. Ensure the website is accessible via HTTP/HTTPS
3. Test the admin login at `/admin/index.html`
4. Add services and upload images through the admin panel

## File Structure

```
photoshot-production/
├── index.html              # Main website page
├── admin/
│   ├── index.html         # Admin login page
│   ├── dashboard.html     # Admin dashboard
│   ├── admin-auth.js      # Authentication logic
│   └── admin-dashboard.js # Dashboard functionality
├── js/
│   ├── config.js          # Supabase configuration
│   ├── supabase.js        # Supabase service functions
│   └── main.js           # Main website JavaScript
├── css/
│   ├── vendor.css         # Third-party CSS
│   └── style.css         # Main stylesheet
└── images/                # Static images (logo, etc.)
```

## Usage

### Admin Access

1. Navigate to `/admin/index.html`
2. Login with your Supabase admin credentials
3. Manage services, gallery, and view contacts

### Adding Services

1. Login to admin panel
2. Go to Services section
3. Click "Add Service"
4. Fill in title, description, price, and image URL
5. Save

### Uploading Gallery Images

1. Login to admin panel
2. Go to Gallery section
3. Click "Upload Image"
4. Select an image file
5. Upload

### Viewing Contacts

1. Login to admin panel
2. Go to Contacts section
3. View all submitted contact messages

## Notes

- Make sure to replace placeholder image URLs with actual images
- The website uses Bootstrap 5 and Swiper.js for UI components
- All data is stored in Supabase - no local database required
- The admin panel requires authentication via Supabase Auth

## Support

For issues or questions, check the Supabase documentation or contact support.

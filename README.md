# Zero to Something - Content Editable Website

A modern, content-editable website with an admin panel that allows real-time content management without redeployment.

## 🚀 Features

- **Content Management**: Edit headlines, subtitles, and text content through an admin panel
- **Product Management**: Add, edit, and delete product cards dynamically
- **Real-time Updates**: Changes made in the admin panel automatically reflect on the public site
- **Secure Authentication**: JWT-based authentication with Supabase
- **Modern UI**: Beautiful admin interface built with React and Tailwind CSS
- **Responsive Design**: Works seamlessly on all devices

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Public Site   │    │  Admin Panel    │    │   Supabase      │
│   (public-site  │◄──►│   (React.js)    │◄──►│  (Database +   │
│    .html)       │    │                 │    │   Auth + Storage)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd zero-to-something
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Create Admin User

1. Go to Supabase Dashboard > Authentication > Users
2. Create a new user with email/password
3. This user will be your admin account

### 5. Run the Admin Panel

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3000`

### 6. Deploy Public Site

1. Update `public-site.html` with your Supabase credentials
2. Deploy to your hosting provider (Netlify, Vercel, etc.)

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Login.jsx       # Authentication
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── ContentEditor.jsx # Content management
│   │   ├── ProductManager.jsx # Product management
│   │   ├── SiteSettings.jsx # Global settings
│   │   └── Layout.jsx      # Admin layout
│   ├── contexts/
│   │   └── AuthContext.jsx # Authentication context
│   ├── lib/
│   │   └── supabase.js     # Supabase client & API
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── supabase/
│   └── schema.sql          # Database schema
├── public-site.html         # Public website
├── admin.html              # Admin panel entry
├── package.json            # Dependencies
└── README.md               # This file
```

## 🔧 Configuration

### Content Sections

The system automatically manages these content sections:

- **Hero Section**: Main title and subtitle
- **Protocol Section**: 14-day cadence description
- **Archive Section**: Ship log information
- **Current Cycle**: Active project details
- **Services Section**: Capabilities and offerings
- **Signal Section**: Social media and updates

### Product Cards

Manage project cards with:
- Title and description
- Status (Active, Sunset, Pivoted)
- Cycle information
- Modal content
- Sort order

### Site Settings

Global configuration including:
- Site title
- Social media links
- Current cycle information
- Progress tracking

## 🚀 Deployment

### Admin Panel (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Public Site (Netlify)

1. Upload `public-site.html` to Netlify
2. Rename to `index.html`
3. Set up custom domain if needed

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- JWT authentication required for admin access
- Content is publicly readable but only editable by authenticated users

## 📱 Usage

### Admin Panel

1. **Login**: Use your Supabase user credentials
2. **Dashboard**: Overview of content and quick actions
3. **Content Editor**: Edit text content across all sections
4. **Product Manager**: Manage project cards and status
5. **Site Settings**: Configure global settings and links

### Public Site

- Automatically displays content from Supabase
- Real-time updates when content changes
- Responsive design for all devices
- Interactive product modals

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**: Check Supabase credentials and user creation
2. **Content Not Loading**: Verify database schema and RLS policies
3. **Real-time Not Working**: Check Supabase real-time configuration

### Debug Mode

Enable console logging by adding this to your browser console:

```javascript
localStorage.setItem('debug', 'true')
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the Supabase documentation
- Review the code comments
- Open an issue in the repository

## 🔮 Future Enhancements

- Image upload and management
- Content versioning and rollback
- Advanced content scheduling
- Multi-language support
- Analytics and insights
- Team collaboration features

# 📣 RaiseVoice

<div align="center">

![RaiseVoice Banner](https://img.shields.io/badge/🌟_RaiseVoice-Community_Issue_Reporting-8B5CF6?style=for-the-badge)

**100% Anonymous Civic Engagement Platform**

_Empowering citizens to report and track local infrastructure issues without fear of retaliation._

[![License](https://img.shields.io/badge/License-Custom-blue.svg?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

[🚀 Live Demo](#) • [📖 Documentation](#-table-of-contents) • [🐛 Report Bug](https://github.com/mohits2806/raise-voice/issues) • [✨ Request Feature](https://github.com/mohits2806/raise-voice/issues)

</div>

---

## 📖 Table of Contents

- [🌟 What is RaiseVoice?](#-what-is-raisevoice)
- [✨ Key Features](#-key-features)
- [🎥 Screenshots](#-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📋 Prerequisites](#-prerequisites)
- [⚙️ Installation](#️-installation)
- [🔐 Authentication](#-authentication)
- [👑 Admin Features](#-admin-features)
- [🗺️ Map Features](#️-map-features)
- [🎨 Design System](#-design-system)
- [📡 API Documentation](#-api-documentation)
- [🔒 Security](#-security)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [💌 Contact](#-contact)

---

## 🌟 What is RaiseVoice?

**RaiseVoice** is a modern, production-ready civic engagement platform that enables citizens to anonymously report local infrastructure issues such as potholes, water leakage, garbage accumulation, and more. Built with the latest web technologies, it features an interactive map interface, real-time updates, and a comprehensive admin dashboard.

### 🎯 Our Mission

> _"Make community issue reporting accessible, anonymous, and actionable for everyone."_

### 💡 Why RaiseVoice?

- **100% Anonymous** - Your privacy is guaranteed. We never expose personal information.
- **User-Friendly** - Click on a map to report. It's that simple.
- **Real-time Tracking** - See the status of issues from "Open" to "Resolved"
- **Modern Design** - Beautiful, responsive interface with light/dark modes
- **Admin Dashboard** - Authorities can manage and track all issues efficiently

---

## ✨ Key Features

### 🔐 **Anonymous Reporting**

- **Complete Privacy**: User details (name, email) are NEVER shown to anyone, including admins
- **Safe Reporting**: Report issues without fear of retaliation
- **Anonymous by Default**: All reports are automatically anonymized

### 🗺️ **Interactive Map Interface**

- **Click-to-Report**: Simply click anywhere on the map to select location
- **Live Issue Markers**: Color-coded markers (🔴 Open, 🟡 In Progress, 🟢 Resolved)
- **Category Icons**: Emoji-based category indicators (💧 Water, 🛣️ Roads, etc.)
- **Geolocation**: Auto-detect user location with "Go to My Location" button
- **No API Keys**: Uses free OpenStreetMap via Leaflet.js

### 📸 **Rich Media Upload**

- **Multi-Image Support**: Upload up to multiple photos per issue
- **Camera Integration**: Capture photos directly from device camera
- **Cloudinary Storage**: Reliable cloud storage with automatic optimization
- **Image Deletion**: Automatic cleanup when issues are deleted

### 👑 **Comprehensive Admin Dashboard**

- **Issue Management**: View, update status, and manage all reported issues
- **Real-time Statistics**: Track open/in-progress/resolved issues
- **Status Updates**: Mark issues as "In Progress" or "Resolved"
- **Bulk Operations**: Efficient management of multiple issues
- **Responsive Table**: Mobile-friendly admin interface
- **Loading Indicators**: Visual feedback during operations

### 🔐 **Advanced Authentication**

- **Dual Auth Methods**:
  - Email/Password with bcrypt hashing
  - Google OAuth 2.0 integration
- **Forgot Password Flow**:
  - Email-based password reset
  - Secure token generation (1-hour expiration)
  - Beautiful email templates via Resend
- **Session Management**: JWT-based sessions with NextAuth.js v5
- **Role-Based Access**: Separate user and admin roles

### 🎨 **Premium UI/UX**

- **Theme Toggle**:
  - Light Mode: Clean, professional white theme
  - Dark Mode: Premium gradient backgrounds with glassmorphism
- **Smooth Animations**: Fade-ins, slide-ups, scale effects, micro-interactions
- **Responsive Design**: Mobile-first approach, works on all devices
- **Modern Components**: Card-based layouts with theme-aware colors
- **Accessibility**: Keyboard navigation and screen reader support

### 📊 **Issue Management**

- **User Dashboard**: Personal profile showing all your reports
- **Status Tracking**: Monitor progress from reporting to resolution
- **7 Categories**:
  - 💧 Water Supply
  - 🌊 Puddle/Drainage
  - 🛣️ Road Damage
  - 🗑️ Garbage/Waste
  - ⚡ Electricity
  - 💡 Street Light
  - 📝 Other
- **Advanced Filtering**: Filter by category, status, search keywords
- **Creator Controls**: Update status or delete your own issues

### 🛡️ **Security & Performance**

- **CORS Protection**: Whitelist-based origin validation
- **Security Headers**: HSTS, X-Frame-Options, CSP, X-XSS-Protection
- **Input Validation**: Server-side validation with Zod schemas
- **SQL Injection Prevention**: Mongoose ODM with parameterized queries
- **XSS Protection**: Sanitized inputs and outputs
- **Rate Limiting**: Protection against abuse
- **Next.js 16**: Latest framework with Turbopack for blazing fast builds

---

## 🎥 Screenshots

<div align="center">

### 🏠 Home Page - Interactive Map

_Beautiful map interface with real-time issue markers_

### 📝 Issue Reporting Form

_Modern modal with image upload and location picker_

### 👤 User Dashboard

_Personal profile with issue tracking and statistics_

### 👑 Admin Dashboard

_Comprehensive admin panel with status management_

### 🌓 Theme Toggle

_Seamless switch between light and dark modes_

</div>

---

## 🛠️ Tech Stack

### **Frontend**

- ⚛️ **[Next.js 16](https://nextjs.org/)** - React framework with App Router & RSC
- ⚛️ **[React 19](https://react.dev/)** - Latest React with concurrent features
- 📘 **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- 🎨 **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- 🗺️ **[Leaflet.js](https://leafletjs.com/)** - Interactive maps (OpenStreetMap)
- 🎭 **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- 📅 **[date-fns](https://date-fns.org/)** - Modern date utility library

### **Backend**

- 🔌 **Next.js API Routes** - Serverless API endpoints
- 🍃 **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- 📦 **[Mongoose](https://mongoosejs.com/)** - MongoDB ODM
- 🔐 **[NextAuth.js v5](https://next-auth.js.org/)** - Authentication solution
- 🖼️ **[Cloudinary](https://cloudinary.com/)** - Image storage & optimization
- 🔒 **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Password hashing
- 📧 **[Resend](https://resend.com/)** - Email delivery service

### **Development & Build**

- ⚡ **[Turbopack](https://turbo.build/pack)** - Ultra-fast bundler
- 🔍 **[ESLint](https://eslint.org/)** - Code linting
- 🎯 **[Zod](https://zod.dev/)** - TypeScript-first schema validation

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** package manager
- ✅ **MongoDB** account ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - FREE tier)
- ✅ **Cloudinary** account ([Sign up FREE](https://cloudinary.com/))
- ✅ **Resend** account for emails ([Sign up FREE](https://resend.com/))
- ✅ **Google Cloud** account (Optional, for OAuth)

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mohits2806/raise-voice.git
cd raise-voice
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Environment Variables

```bash
cp env.template .env.local
```

Edit `.env.local` with your credentials:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/raisevoice

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here  # Generate: openssl rand -base64 32

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Resend Email
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** 🎉

### 5️⃣ Build for Production

```bash
npm run build
npm start
```

---

## ⚙️ Installation

### 📦 Detailed Setup Guide

#### **MongoDB Atlas** (Database)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a FREE M0 cluster
3. Create a database user
4. Whitelist your IP address (or `0.0.0.0/0` for development)
5. Get connection string: **Connect** → **Connect your application**
6. Replace `<password>` with your database password
7. Add to `MONGODB_URI` in `.env.local`

#### **Cloudinary** (Image Storage)

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to **Dashboard**
3. Copy:
   - Cloud Name
   - API Key
   - API Secret
4. Add to `.env.local`

#### **Resend** (Email Service)

1. Sign up at [Resend](https://resend.com/)
2. Navigate to **API Keys**
3. Create a new API key
4. Copy and add to `RESEND_API_KEY`
5. FREE tier: 100 emails/day, 3,000/month

#### **Google OAuth** (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google+ API**
4. Create **OAuth 2.0 Client ID** credentials
5. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Copy Client ID and Secret to `.env.local`

---

## 🔐 Authentication

### User Authentication Flow

```mermaid
graph LR
    A[User] --> B{Sign In}
    B -->|Email/Password| C[Credentials Auth]
    B -->|Google| D[OAuth 2.0]
    C --> E[JWT Session]
    D --> E
    E --> F[Protected Routes]
```

### Features

- ✅ **Email/Password Registration**

  - Bcrypt password hashing (10 rounds)
  - Email validation
  - Duplicate prevention

- ✅ **Google OAuth Integration**

  - One-click sign-in
  - Automatic account creation
  - Profile picture sync

- ✅ **Forgot Password**

  - Email-based password reset
  - Secure token generation (SHA-256)
  - 1-hour token expiration
  - Beautiful HTML email template
  - Single-use tokens

- ✅ **Session Management**
  - JWT-based sessions
  - 30-day expiration
  - Secure httpOnly cookies
  - CSRF protection

---

## 👑 Admin Features

### Admin Dashboard

Admins have access to a comprehensive dashboard to manage all reported issues:

#### **Key Capabilities**

✅ **View All Issues**

- Paginated table view
- Real-time statistics (Open, In Progress, Resolved)
- Issue details with images
- User information (anonymous to users, visible to admin only for accountability)

✅ **Status Management**

- Update status: Open → In Progress → Resolved
- Loading indicators during updates
- Instant UI feedback

✅ **Issue Details**

- View full description
- See all uploaded images
- Check exact location on map
- View submission timestamp

✅ **Delete Capability**

- Remove inappropriate or duplicate issues
- Automatic Cloudinary image cleanup
- Confirmation prompts for safety

#### **Access Control**

```typescript
// Only admins can access
Role: 'admin' (set in MongoDB user document)
```

To make a user admin:

```javascript
// In MongoDB, update user document:
{
  role: "admin";
}
```

---

## 🗺️ Map Features

### Interactive Map Capabilities

- **🖱️ Click-to-Report**: Click anywhere on the map to pin location
- **📍 Custom Markers**:
  - Red (🔴) - Open issues
  - Yellow (🟡) - In Progress
  - Green (🟢) - Resolved
  - Emoji icons for categories
- **💬 Popup Details**: Click markers to view issue summary
- **🧭 User Location**: GPS-based "Go to My Location" button
- **🎯 Smooth Navigation**: Animated map panning and zooming
- **🗺️ OpenStreetMap**: Free, no API key required
- **📱 Touch-Friendly**: Optimized for mobile devices

---

## 🎨 Design System

### Theme System

#### Light Mode

```css
Background: #FFFFFF (Pure White)
Text: #111827 (Gray-900)
Accent: #3B82F6 (Blue-500)
Cards: Subtle shadows, minimal borders
```

#### Dark Mode

```css
Background: Gradient (Slate-900 → Slate-800)
Text: #F8FAFC (Slate-50)
Accent: #A855F7 (Purple-500)
Cards: Glassmorphism, vibrant glows
```

### Design Principles

- **Consistency**: All components use CSS custom properties
- **Accessibility**: WCAG 2.1 AA compliant color contrast
- **Responsiveness**: Mobile-first with breakpoint system
- **Performance**: Optimized animations with GPU acceleration
- **Modularity**: Reusable `.card`, `.btn-primary` utilities

### Typography

- **Headings**: Outfit font family
- **Body**: Inter font family
- **Sizes**: Responsive with `clamp()` for fluid typography

### Animations

```css
Fade In: 500ms opacity transition
Slide Up: 300ms translateY() with cubic-bezier
Scale In: 200ms transform scale with spring
Pulse: For loading states
Shimmer: Progress indicators
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### **POST** `/api/auth/signup`

Create new user account.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **POST** `/api/auth/forgot-password`

Request password reset email.

**Request:**

```json
{
  "email": "user@example.com"
}
```

#### **POST** `/api/auth/reset-password`

Reset password with token.

**Request:**

```json
{
  "token": "abc123...",
  "password": "NewPassword123"
}
```

### Issue Endpoints

#### **GET** `/api/issues`

Get all issues.

**Response:**

```json
{
  "issues": [
    {
      "_id": "...",
      "title": "Pothole on Main Street",
      "description": "Large pothole...",
      "category": "road-damage",
      "status": "open",
      "location": {
        "type": "Point",
        "coordinates": [73.8567, 18.5204]
      },
      "images": ["https://..."],
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### **POST** `/api/issues`

Create new issue (requires auth).

**Request:**

```json
{
  "title": "Broken street light",
  "description": "Street light not working",
  "category": "street-light",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "images": ["https://cloudinary.com/..."]
}
```

#### **PATCH** `/api/issues/[id]`

Update issue status (creator only).

**Request:**

```json
{
  "status": "resolved"
}
```

#### **DELETE** `/api/issues/[id]`

Delete issue (creator only).

#### **POST** `/api/upload`

Upload image to Cloudinary.

**Request:** Multipart form data with `file` field

**Response:**

```json
{
  "url": "https://res.cloudinary.com/..."
}
```

### Admin Endpoints

#### **GET** `/api/admin/issues`

Get all issues (admin only).

#### **PATCH** `/api/admin/issues/[id]`

Update any issue status (admin only).

#### **DELETE** `/api/admin/issues/[id]`

Delete any issue (admin only).

---

## 🔒 Security

### Implemented Security Measures

✅ **CORS Protection**

```typescript
// Whitelist-based origin validation
Allowed Origins:
- http://localhost:3000
- http://localhost:3001
- Your production domain (from NEXT_PUBLIC_APP_URL)

Blocked: All other origins (403 Forbidden)
```

✅ **Security Headers**

- `Strict-Transport-Security`: Force HTTPS
- `X-Frame-Options`: Prevent clickjacking
- `X-Content-Type-Options`: Prevent MIME sniffing
- `X-XSS-Protection`: Enable XSS filtering
- `Referrer-Policy`: Control referrer information
- `Permissions-Policy`: Disable unused features

✅ **Authentication Security**

- bcrypt password hashing (10 rounds)
- JWT tokens with httpOnly cookies
- CSRF protection via NextAuth.js
- Secure token generation for password reset
- 1-hour token expiration

✅ **Input Validation**

- Server-side validation with Zod schemas
- Mongoose model validation
- SQL injection prevention
- XSS protection via sanitization

✅ **API Security**

- Role-based access control (admin routes)
- Session-based authentication
- Rate limiting (planned)
- Request origin validation

---

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import to Vercel**

   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**

   - Add all variables from `.env.local`
   - Update `NEXTAUTH_URL` to your production domain
   - Update `NEXT_PUBLIC_APP_URL` to production

4. **Deploy**
   - Automatic deployment on every push
   - Preview deployments for PRs

### Environment Variables for Production

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
MONGODB_URI=mongodb+srv://...
# ... rest remain the same
```

### Other Deployment Options

- **Netlify**: Similar to Vercel
- **Railway**: Full-stack platform
- **DigitalOcean**: Docker containers
- **AWS Amplify**: AWS ecosystem

---

## 🤝 Contributing

We welcome contributions! Please see our [Custom License](LICENSE) for terms.

### How to Contribute

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to your branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Be respectful and constructive

### Contributors

Significant contributors will be credited in the project documentation.

---

## 📄 License

This project is licensed under a **Custom License** - see the [LICENSE](LICENSE) file for details.

### Summary

✅ **Allowed:**

- Personal, educational, non-profit use
- Modify for your own use
- Contribute improvements
- Study the code

❌ **Not Allowed:**

- Commercial use without permission
- Redistribution under your own name
- Selling the software or derivatives

📧 **Commercial Licensing:** Contact mohitshaharwale01@gmail.com

---

## 💌 Contact

**Mohit Shaharwale**

- 📧 Email: [mohitshaharwale01@gmail.com](mailto:mohitshaharwale01@gmail.com)
- 💼 LinkedIn: [mohit-shaharwale](https://linkedin.com/in/mohit-shaharwale)
- 🐙 GitHub: [@mohits2806](https://github.com/mohits2806)
- 🌐 Portfolio: [mohitshaharwale.netlify.app](https://mohitshaharwale.netlify.app)
- 🐦 Twitter: [@mohitshaharwale](https://x.com/mohitshaharwale)

---

## 🙏 Acknowledgments

- **Next.js Team** - For the incredible framework
- **Vercel** - For seamless deployment
- **OpenStreetMap Contributors** - For free map data
- **Cloudinary** - For reliable image storage
- **MongoDB** - For the powerful database
- **Resend** - For email delivery
- **All Contributors** - Thank you for your support!

---

## 🗺️ Roadmap

- [x] Anonymous issue reporting
- [x] Interactive map interface
- [x] Image upload with Cloudinary
- [x] User authentication
- [x] Google OAuth integration
- [x] Admin dashboard
- [x] Forgot password flow
- [x] Light/dark theme
- [x] CORS protection
- [x] Security headers
- [ ] Email notifications for users
- [ ] Issue commenting system
- [ ] Voting/upvoting issues
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] PDF export reports
- [ ] Multi-language support
- [ ] Push notifications

---

<div align="center">

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=mohits2806/raise-voice&type=Date)](https://star-history.com/#mohits2806/raise-voice&Date)

---

**Built with ❤️ using Next.js 16, React 19, and modern web technologies**

Made by **[Mohit Shaharwale](https://github.com/mohits2806)**

⭐ **Star this repo if you find it helpful!**

[🐛 Report Bug](https://github.com/mohits2806/raise-voice/issues) · [✨ Request Feature](https://github.com/mohits2806/raise-voice/issues) · [📖 Documentation](#-table-of-contents)

</div>

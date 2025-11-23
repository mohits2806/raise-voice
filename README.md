# RaiseVoice 📣

A modern, production-ready community issue reporting platform that empowers citizens to report and track local infrastructure issues. Built with Next.js 16, MongoDB, Leaflet Maps, and featuring a premium theme-aware UI with light/dark mode support.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)

## 📖 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#️-project-structure)
- [Key Features Explained](#-key-features-explained)
- [Design System](#-design-system)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Functionality
- 🗺️ **Interactive Map Interface**: Click-to-report using OpenStreetMap with Leaflet.js (no API key required)
- 📸 **Multi-Image Upload**: Attach multiple photos or capture directly from camera using Cloudinary
- 🔐 **Dual Authentication**: Google OAuth and Email/Password authentication with NextAuth.js v5
- 🔍 **Advanced Filtering**: Filter issues by category, status, and search by keywords
- 📍 **Geolocation Support**: Automatic user location detection with "Go to My Location" button
- 📊 **Real-time Statistics**: Track open, in-progress, and resolved issues with visual analytics
- 👤 **User Profiles**: Personal dashboard showing all reported issues with status tracking
- 🔒 **Issue Management**: Create, update status, and delete your own reported issues

### Modern UI/UX
- 🎨 **Theme Toggle**: Beautiful light and dark modes with smooth transitions
  - **Light Mode**: Clean white and grey color palette
  - **Dark Mode**: Premium gradient backgrounds with glassmorphism
- ⚡ **Smooth Animations**: Micro-animations, fade-ins, slide-ups, and scale effects
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- 🎭 **Premium Design**: Modern card-based layouts with theme-aware colors
- 🌈 **Color-Coded Markers**: Status-based map markers with category emoji icons
- ⌨️ **Keyboard Accessible**: Full keyboard navigation support

### Technical Excellence
- 🚀 **Next.js 16 App Router**: Latest Next.js with Turbopack for blazing fast development
- 💾 **MongoDB Integration**: Efficient data storage with Mongoose ODM
- 🔄 **Real-time Updates**: Instant UI updates after create/update operations
- 🛡️ **Type-Safe**: Built with TypeScript for enhanced code quality
- 📦 **Serverless Ready**: API routes built into Next.js
- 🔐 **Secure**: Protected routes, JWT sessions, and bcrypt password hashing
- 🎯 **SEO Optimized**: Proper meta tags and semantic HTML

## 🎥 Demo

<!-- Add your demo screenshots or GIF here -->
- **Home Page**: Interactive map with filters and issue markers
- **Issue Form**: Modern modal with image upload and location picker
- **User Profile**: Personal dashboard with issue tracking
- **Theme Toggle**: Seamless switch between light and dark modes

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router and React Server Components
- **UI Library**: [React 19](https://react.dev/) with TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom design system
- **Icons**: [Lucide React](https://lucide.dev/)
- **Maps**: [Leaflet.js](https://leafletjs.com/) with [React Leaflet](https://react-leaflet.js.org/)
- **Date Handling**: [date-fns](https://date-fns.org/)

### Backend
- **API**: Next.js API Routes (serverless)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org/)
- **Image Storage**: [Cloudinary](https://cloudinary.com/)
- **Password Hashing**: [bcryptjs](https://www.npmjs.com/package/bcryptjs)

### Development Tools
- **Build Tool**: [Turbopack](https://turbo.build/pack)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Linting**: [ESLint](https://eslint.org/)
- **Package Manager**: npm

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **MongoDB**: Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier available)
- **Cloudinary Account**: For image uploads ([Sign up for free](https://cloudinary.com/))
- **Google Cloud Account**: Optional, for Google OAuth ([Console](https://console.cloud.google.com/))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/raise-voice.git
cd raise-voice
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the environment template:

```bash
cp env.template .env.local
```

Fill in your credentials in `.env.local`:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/raisevoice

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here  # Generate using: openssl rand -base64 32

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in your `.env.local` file.

### 5. Set Up External Services

#### MongoDB Atlas (Free Tier)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new account or sign in
3. Create a new cluster (M0 Sandbox is free)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Add the string to `MONGODB_URI` in `.env.local`

#### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Navigate to the Dashboard
3. Copy the following:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Add these to your `.env.local` file

#### Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google+ API
4. Navigate to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copy Client ID and Client Secret to `.env.local`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

### 7. Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
raise-voice/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Serverless)
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/   # NextAuth.js handler
│   │   │   └── signup/          # User registration
│   │   ├── issues/              # Issue CRUD operations
│   │   │   ├── [id]/            # Single issue operations
│   │   │   └── route.ts         # List & create issues
│   │   └── upload/              # Image upload to Cloudinary
│   ├── auth/                    # Authentication pages
│   │   ├── signin/              # Sign in page
│   │   └── signup/              # Sign up page
│   ├── issues/                  # Issue-related pages
│   │   └── [id]/                # Issue detail page
│   ├── profile/                 # User profile page
│   ├── error.tsx                # Global error handler
│   ├── loading.tsx              # Global loading state
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page with map
│   └── globals.css              # Global styles & theme system
│
├── src/
│   ├── components/              # React Components
│   │   ├── Issues/
│   │   │   ├── IssueForm.tsx    # Issue creation modal
│   │   │   └── ImageUpload.tsx  # Image upload component
│   │   ├── Layout/
│   │   │   └── Header.tsx       # Navigation header
│   │   ├── Map/
│   │   │   ├── InteractiveMap.tsx    # Leaflet map component
│   │   │   └── LocationButton.tsx    # Geolocation button
│   │   └── Providers/
│   │       └── SessionProvider.tsx   # NextAuth session provider
│   │
│   ├── contexts/
│   │   └── ThemeContext.tsx     # Theme provider (light/dark)
│   │
│   ├── lib/                     # Utility Libraries
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── cloudinary.ts        # Cloudinary SDK setup
│   │   ├── constants.ts         # App constants (categories, statuses)
│   │   ├── mongodb.ts           # MongoDB connection
│   │   └── validations.ts       # Input validation helpers
│   │
│   ├── models/                  # Mongoose Models
│   │   ├── Issue.ts             # Issue schema
│   │   └── User.ts              # User schema
│   │
│   └── types/                   # TypeScript Types
│       ├── index.ts             # Shared types
│       └── next-auth.d.ts       # NextAuth type extensions
│
├── public/                       # Static Assets
├── .env.local                    # Environment variables (not in git)
├── .gitignore                    # Git ignore rules
├── env.template                  # Environment template
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🌟 Key Features Explained

### Issue Categories

Users can report issues across multiple categories:

| Icon | Category | Description |
|------|----------|-------------|
| 💧 | Water Supply | Water scarcity, contamination, leakage |
| 🌊 | Puddle/Drainage | Waterlogging, blocked drains |
| 🛣️ | Road Damage | Potholes, cracks, damaged roads |
| 🗑️ | Garbage/Waste | Waste accumulation, missed pickups |
| ⚡ | Electricity | Power outages, faulty lines |
| 💡 | Street Light | Broken or non-functional street lights |
| 📝 | Other | Miscellaneous issues |

### Issue Status Workflow

Issues follow a three-stage lifecycle:

- 🔴 **Open**: Newly reported issue awaiting action
- 🟡 **In Progress**: Issue is being addressed by authorities
- 🟢 **Resolved**: Issue has been fixed/completed

Only the issue creator can update the status or delete the issue.

### Authentication Flow

1. **Email/Password**: Traditional signup with bcrypt password hashing
2. **Google OAuth**: One-click sign-in with Google account
3. **Session Management**: JWT-based sessions with NextAuth.js
4. **Protected Routes**: Automatic redirect to sign-in for authenticated actions

### Map Features

- **Click-to-Report**: Click anywhere on the map to set issue location
- **Custom Markers**: Color-coded by status (red/yellow/green) with category emoji
- **Popups**: Click markers to view issue details
- **User Location**: GPS-based location detection with permission handling
- **Location Button**: Floating button to center map on user's position
- **Smooth Pan**: Animated transitions when navigating the map

### Theme System

The application features a sophisticated theme system:

#### Light Mode
- Clean white backgrounds (`#FFFFFF`)
- Neutral grey text for readability
- Subtle borders and shadows
- Professional appearance

#### Dark Mode
- Gradient backgrounds (Slate 900 → Slate 800)
- Premium glassmorphism effects
- Vibrant accent colors
- Modern aesthetic

#### Features
- **localStorage Persistence**: Theme preference saved across sessions
- **System Preference**: Defaults to dark mode
- **Smooth Transitions**: 300ms animated theme switches
- **CSS Custom Properties**: Centralized theme tokens
- **Component-Level**: Every component respects theme

## 🎨 Design System

### Color Palette

```css
/* Light Mode */
--bg-primary: 255, 255, 255      /* Pure white */
--text-primary: 17, 24, 39       /* Gray-900 */
--accent-primary: 59, 130, 246   /* Blue-500 */

/* Dark Mode */
--bg-primary: 15, 23, 42         /* Slate-900 */
--text-primary: 248, 250, 252    /* Slate-50 */
--accent-primary: 168, 85, 247   /* Purple-500 */
```

### Typography

- **Display Font**: Outfit (for headings)
- **Body Font**: Inter (for body text)
- **Responsive Sizes**: Mobile-optimized with `sm:` modifiers

### Animations

- **Fade In**: 500ms opacity transition
- **Slide Up**: Vertical translation with easing
- **Scale In**: Zoom effect for modals
- **Bounce In**: Spring-like entrance
- **Shimmer**: Progress indicator animation
- **Hover Effects**: Scale and glow on interactive elements

### Components

All components use the `.card` utility class:
```css
.card {
  background: rgb(var(--bg-primary));
  border: 2px solid rgb(var(--border-primary));
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: all 300ms;
}
```

## 📡 API Documentation

### Authentication

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
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

### Issues

#### GET `/api/issues`
Retrieve all issues.

**Response:**
```json
{
  "issues": [
    {
      "_id": "...",
      "title": "Pothole on Main Street",
      "description": "Large pothole causing traffic issues",
      "category": "road-damage",
      "status": "open",
      "location": {
        "type": "Point",
        "coordinates": [73.8567, 18.5204]
      },
      "address": "Main Street, Pune",
      "images": ["https://..."],
      "userId": { ... },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST `/api/issues`
Create a new issue (requires authentication).

**Request Body:**
```json
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "road-damage",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "images": ["https://..."]
}
```

#### GET `/api/issues/[id]`
Get a single issue by ID.

#### PATCH `/api/issues/[id]`
Update issue status (creator only).

**Request Body:**
```json
{
  "status": "resolved"
}
```

#### DELETE `/api/issues/[id]`
Delete an issue (creator only).

### Image Upload

#### POST `/api/upload`
Upload an image to Cloudinary.

**Request:** Multipart form data with `file` field

**Response:**
```json
{
  "url": "https://res.cloudinary.com/..."
}
```

## 🔧 Available Scripts

```bash
# Development with Turbopack (fast refresh)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 📦 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - Add all variables from `.env.local`
   - Update `NEXTAUTH_URL` to your production domain

4. **Deploy**
   - Vercel automatically deploys on every push

### Environment Variables for Production

```env
NEXTAUTH_URL=https://your-domain.vercel.app
MONGODB_URI=mongodb+srv://...
# ... (rest remain the same)
```

### Other Platforms

The app can also be deployed to:
- **Netlify**: Similar to Vercel
- **Railway**: Full-stack deployment
- **DigitalOcean**: Docker container deployment
- **AWS Amplify**: AWS ecosystem

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

Please ensure your PR:
- Follows the existing code style
- Includes appropriate tests
- Updates documentation as needed
- Has a clear description of changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Vercel**: For seamless deployment
- **OpenStreetMap**: For free map tiles
- **Cloudinary**: For image storage
- **MongoDB**: For the database
- **All Contributors**: Thank you for your support!

## 🐛 Known Issues

- None at the moment! 🎉

## 📮 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/raise-voice/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/raise-voice/discussions)
- **Email**: your.email@example.com

## 🗺️ Roadmap

- [ ] Email notifications for issue updates
- [ ] Admin dashboard for authorities
- [ ] Mobile app (React Native)
- [ ] Issue voting system
- [ ] Comment system on issues
- [ ] Export reports as PDF
- [ ] Multi-language support
- [ ] Analytics dashboard

---

<div align="center">

**Built with ❤️ using Next.js 16, React 19, and modern web technologies**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/yourusername/raise-voice/issues) · [Request Feature](https://github.com/yourusername/raise-voice/issues)

</div>

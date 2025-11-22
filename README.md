# RaiseVoice 📣

A production-ready community issue reporting platform built with Next.js 16, MongoDB, and Leaflet Maps. Report and track local infrastructure issues like water supply problems, potholes, garbage accumulation, and more.

## ✨ Features

- 🗺️ **Interactive Map**: Report issues by clicking on an OpenStreetMap
- 📸 **Image Upload**: Attach photos or capture from camera using Cloudinary
- 🔐 **Authentication**: Google OAuth and Email/Password support with NextAuth.js
- 🔍 **Advanced Filtering**: Search and filter issues by category and status
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Serverless Architecture**: API routes built into Next.js
- 🎨 **Premium UI**: Glassmorphic design with smooth animations
- 🔒 **Secure**: Protected routes and user-specific actions
- 📊 **Real-time Stats**: Track open, in-progress, and resolved issues
- 🚀 **Production Ready**: Built with Next.js 16, React 19, and TypeScript

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router and Turbopack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Maps**: Leaflet with OpenStreetMap (free, no API key required)
- **Authentication**: NextAuth.js v5 (Google OAuth + Credentials)
- **Database**: MongoDB with Mongoose ODM
- **Image Storage**: Cloudinary
- **Styling**: Tailwind CSS with glassmorphism effects
- **Icons**: Lucide React

## 📋 Prerequisites

-  Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier available)
- Google OAuth credentials (optional, for Google sign-in)

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd raise-voice
npm install
```

### 2. Environment Variables

Copy `env.template` to `.env.local` and fill in your credentials:

```bash
cp env.template .env.local
```

Required environment variables:

```env
# Database (MongoDB Atlas or local)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/raisevoice

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Cloudinary (Get from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 4. Set Up External Services

#### MongoDB Atlas (Free Tier)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Add to `MONGODB_URI` in `.env.local`

#### Cloudinary (Free Tier)
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to `.env.local`

#### Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

1. **Sign Up/Sign In**: Create an account or sign in with Google
2. **Report Issue**: Click on the map to place a marker and fill out the issue form
3. **Upload Images**: Attach photos from your device or capture with camera
4. **Track Issues**: View all reported issues on the map with status indicators
5. **Filter**: Search and filter issues by category and status
6. **Update Status**: Mark issues as in-progress or resolved (creator only)

## 🏗️ Project Structure

```
raise-voice/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   └── signup/
│   │   ├── issues/
│   │   │   ├── [id]/
│   │   │   └── route.ts
│   │   └── upload/
│   ├── auth/
│   │   ├── signin/
│   │   └── signup/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx
├── src/
│   ├── components/
│   │   ├── Issues/
│   │   │   ├── ImageUpload.tsx
│   │   │   └── IssueForm.tsx
│   │   ├── Layout/
│   │   │   └── Header.tsx
│   │   ├── Map/
│   │   │   └── InteractiveMap.tsx
│   │   └── Providers/
│   │       └── SessionProvider.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── cloudinary.ts
│   │   ├── constants.ts
│   │   ├── mongodb.ts
│   │   ├── mongodb-client.ts
│   │   └── validations.ts
│   ├── models/
│   │   ├── Issue.ts
│   │   └── User.ts
│   └── types/
│       ├── index.ts
│       └── next-auth.d.ts
├── public/
├── .gitignore
├── env.template
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 🔧 Available Scripts

```bash
# Development with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🌟 Key Features Explained

### Issue Categories
- 💧 Water Supply
- 🌊 Puddle/Drainage
- 🛣️ Road Damage
- 🗑️ Garbage/Waste
- ⚡ Electricity
- 💡 Street Light
- 📝 Other

### Issue Statuses
- 🔴 **Open**: Newly reported
- 🟡 **In Progress**: Being addressed
- 🟢 **Resolved**: Completed

### Security Features
- Protected API routes
- User authentication required for creating issues
- Only issue creators can update/delete their issues
- Secure password hashing with bcrypt
- JWT-based sessions

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effect throughout the UI
- **Gradient Backgrounds**: Premium purple-blue-pink gradients
- **Smooth Animations**: Fade-in, slide-up, and scale-in effects
- **Responsive Design**: Mobile-first approach
- **Custom Map Markers**: Color-coded by status with emoji icons
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Update `NEXTAUTH_URL` to your production domain:
```env
NEXTAUTH_URL=https://your-domain.com
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙋‍♂️ Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js 16 and modern web technologies**

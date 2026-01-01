# Firebase Authentication Setup Guide

This guide will help you configure Firebase authentication for StudySyncAI.

## Prerequisites

1. A Google account
2. Node.js and npm/yarn installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "StudySyncAI")
4. Follow the setup wizard
5. Once created, you'll be redirected to the project dashboard

## Step 2: Enable Authentication Methods

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click **Get started**
3. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

## Step 3: Get Your Firebase Config

1. In the Firebase Console, click the Settings gear icon
2. Select "Project settings"
3. Scroll to "Your apps" section
4. Look for your web app (if not created, click "Add app" and select Web)
5. Copy the Firebase config object

Your config should look like:
```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
}
```

## Step 4: Configure Environment Variables

1. In the `frontend` directory, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase config values:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Step 5: Test the Setup

1. Install dependencies (if not already done):
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`
4. You should be redirected to the login page

## Create Test Accounts

Now you can create test accounts directly in the app:

1. Click "Sign Up"
2. Select your role (Student or Teacher)
3. Enter email and password
4. Click "Create Account"

**Important:** Test accounts can also be created/managed in the Firebase Console:
- Go to **Build** → **Authentication** → **Users**
- Click **Add user** to manually create test accounts

## Features Implemented

✅ **Firebase Authentication**
- Email/Password signup
- Email/Password login
- User role selection (Student/Teacher)
- Protected routes

✅ **Role-Based Access**
- Students only see the Student tab and student navigation
- Teachers only see the Teacher tab and teacher navigation
- Role is determined at signup and persisted in Firestore

✅ **User Management**
- User data stored in Firestore
- Display name and role saved per user
- User info displayed in dashboard header

✅ **Logout Functionality**
- Logout button in the sidebar
- Redirects to login page after logout
- Clears all session data

## Architecture

### New Files Created

1. **`frontend/src/config/firebase.ts`** - Firebase initialization
2. **`frontend/src/context/AuthContext.tsx`** - Authentication context and hooks
3. **`frontend/src/pages/LoginPage.tsx`** - Login/Signup UI
4. **`frontend/src/components/ProtectedRoute.tsx`** - Route protection component
5. **`frontend/.env.example`** - Environment variables template

### Modified Files

1. **`frontend/src/App.tsx`** - Added AuthProvider and login route
2. **`frontend/src/pages/Index.tsx`** - Integrated auth context, removed role switcher
3. **`frontend/src/components/layout/DashboardLayout.tsx`** - Added optional role switcher, logout support

## API Hooks

### Using Authentication in Components

```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout, signIn, signUp } = useAuth();

  return (
    <div>
      {user && <p>Welcome, {user.displayName}!</p>}
      {user?.role === "student" && <p>Student Dashboard</p>}
    </div>
  );
}
```

## Firestore Data Structure

User documents are stored in the `users` collection:

```
users/
  {uid}/
    - email: string
    - displayName: string
    - role: "student" | "teacher"
    - createdAt: ISO date string
```

## Troubleshooting

### "Module not found: firebase"
- Run `npm install firebase` in the frontend directory

### "Firebase config is invalid"
- Check that all environment variables are correctly set
- Restart the dev server after changing `.env.local`

### "Cannot read property 'role' of null"
- Make sure you're using components inside the `AuthProvider`
- Check that the user has been created in Firestore

### "Unauthorized domain"
- Add your domain to Firebase Console → Project Settings → Authorized Domains

## Next Steps

1. **Customize user profiles** - Add profile pictures, bio, etc.
2. **Add Firestore rules** - Implement security rules for database access
3. **Add email verification** - Require users to verify their email
4. **Add password reset** - Implement forgot password functionality
5. **Connect to backend** - Sync user data with your Node.js backend

For more help, visit [Firebase Documentation](https://firebase.google.com/docs)

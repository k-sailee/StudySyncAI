# Quick Start Guide - Firebase Authentication

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Get Firebase Credentials
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Email/Password authentication
4. Get your config from Project Settings

### Step 3: Create Environment File
```bash
# In frontend directory
cp .env.example .env.local
```

Then edit `.env.local` and add your Firebase config:
```
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc
```

### Step 4: Run the App
```bash
npm run dev
```

### Step 5: Test the Flow
1. Open http://localhost:5173
2. Should redirect to login page
3. Click "Sign Up"
4. Choose role (Student or Teacher)
5. Enter email, password, and name
6. ✓ Dashboard should load with role-specific UI

---

## 📋 Important Files

| File | Purpose |
|------|---------|
| `src/config/firebase.ts` | Firebase initialization |
| `src/context/AuthContext.tsx` | Auth state management |
| `src/pages/LoginPage.tsx` | Login/signup UI |
| `src/components/ProtectedRoute.tsx` | Route protection |
| `src/pages/Index.tsx` | Main dashboard |
| `src/components/layout/DashboardLayout.tsx` | Layout with role UI |

---

## 🔑 Using Authentication in Components

### Get Current User
```tsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <div>Please login</div>;
  
  return <div>Welcome, {user?.displayName}!</div>;
}
```

### Check User Role
```tsx
const { user } = useAuth();

if (user?.role === "teacher") {
  return <TeacherContent />;
} else {
  return <StudentContent />;
}
```

### Logout User
```tsx
const { logout } = useAuth();

function LogoutButton() {
  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}
```

### Sign Up New User
```tsx
const { signUp } = useAuth();

async function handleSignUp(email, password, name, role) {
  try {
    await signUp(email, password, name, role);
    // Success! User will be logged in automatically
  } catch (error) {
    console.error("Signup failed:", error);
  }
}
```

### Login User
```tsx
const { signIn } = useAuth();

async function handleLogin(email, password) {
  try {
    await signIn(email, password);
    // Success! User is now logged in
  } catch (error) {
    console.error("Login failed:", error);
  }
}
```

---

## 🎯 Key Features

✅ **Email/Password Authentication**
- Users sign up with email and password
- Passwords stored securely by Firebase

✅ **Role-Based UI**
- Students see: Dashboard, Classes, Lessons, Tasks, etc.
- Teachers see: Dashboard, Classes, Sessions, Assignments, etc.
- Role switcher is hidden (unlike the old version)

✅ **Protected Routes**
- Cannot access dashboard without login
- Automatic redirect to login if session expires

✅ **User Profile**
- Display name shown in header
- Role displayed in sidebar

✅ **Logout**
- Logout button in sidebar
- Clears all session data
- Redirects to login

---

## ❓ Common Questions

### Q: How do I add a third role (Admin)?
A: Update the `UserRole` type in `src/context/AuthContext.tsx`:
```tsx
export type UserRole = "student" | "teacher" | "admin";
```

### Q: How do I store additional user data?
A: Update the Firestore document in `AuthContext.tsx`:
```tsx
await setDoc(doc(db, "users", uid), {
  email,
  displayName,
  role,
  profileImage: "url",  // Add custom fields
  bio: "description",
  // ...
});
```

### Q: How do I change a user's role?
A: Currently, role is set at signup and stored in Firestore. To change it:
1. Delete user's account from Firebase Console
2. Create new account with different role

Or add an admin function to update the role in Firestore.

### Q: How do I test without Firebase?
A: Temporarily modify `firebase.ts` to use a mock context for testing.

### Q: How do I add email verification?
A: Use Firebase's `sendEmailVerification()` after signup.

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore` ✓
2. **Use environment variables** - API keys should not be hardcoded ✓
3. **Validate on backend** - Always verify user role on server
4. **Use HTTPS** - Deploy on HTTPS only
5. **Set Firestore Rules** - Restrict data access

---

## 📚 Documentation Links

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [React Context API](https://react.dev/reference/react/useContext)
- [React Router Protected Routes](https://reactrouter.com/)

---

## 🐛 Troubleshooting

### Issue: "Module not found: firebase"
**Solution:** Run `npm install firebase` in frontend directory

### Issue: "Firebase config is invalid"
**Solution:** Check `.env.local` has correct values, restart dev server

### Issue: "Cannot read property 'role' of null"
**Solution:** Make sure you're using `useAuth()` inside `AuthProvider`

### Issue: "Redirect loop between login and dashboard"
**Solution:** Check that Firestore collection `users` exists with user documents

### Issue: "Unauthorized domain" error
**Solution:** Add your domain to Firebase Console → Project Settings → Authorized Domains

---

## 📞 Support

1. Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed setup
2. Review [AUTH_FLOW_DIAGRAMS.md](AUTH_FLOW_DIAGRAMS.md) for architecture
3. Check [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for overview

---

## ✨ Next Steps

After getting authentication working:

1. **Connect Backend** - Call your Node.js API with user JWT token
2. **Add Social Auth** - Google, GitHub login options
3. **User Profile** - Allow users to edit their profile
4. **Email Verification** - Require users to verify email
5. **Password Reset** - Add forgot password flow
6. **Firestore Rules** - Implement security rules
7. **CI/CD** - Deploy to production

---

Happy coding! 🎉

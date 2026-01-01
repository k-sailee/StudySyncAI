# Troubleshooting Guide - Firebase Authentication

## 🔍 Common Issues and Solutions

### 1. "Firebase is not defined" or Module Import Errors

**Problem:** 
```
Error: firebase is not defined
OR
Module not found: Error: Can't resolve 'firebase'
```

**Solution:**
```bash
cd frontend
npm install firebase
```

Then verify in `package.json` that `"firebase": "^10.7.1"` is listed.

---

### 2. Environment Variables Not Loading

**Problem:** 
Firebase config shows undefined values, app throws error about missing config.

**Solutions:**

a) **Check file location:**
```
frontend/
├── .env.local          ← Should be here
├── .env.example
├── vite.config.ts
└── package.json
```

b) **Restart dev server after adding `.env.local`:**
```bash
# Stop the server (Ctrl+C)
npm run dev
```

c) **Verify variable names are correct:**
```
❌ WRONG: FIREBASE_API_KEY=...
✅ CORRECT: VITE_FIREBASE_API_KEY=...
```

d) **Check for extra spaces:**
```
❌ WRONG: VITE_FIREBASE_API_KEY = your_key
✅ CORRECT: VITE_FIREBASE_API_KEY=your_key
```

e) **Verify values are not empty:**
```bash
# In browser console, check if values loaded:
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
```

---

### 3. "Cannot read property 'role' of null" or "user is null"

**Problem:**
```
TypeError: Cannot read property 'role' of undefined
OR
TypeError: Cannot read property 'displayName' of null
```

**Causes & Solutions:**

a) **Not using `useAuth()` inside `AuthProvider`**
```tsx
// ❌ WRONG - AuthProvider not wrapping this component
function App() {
  const { user } = useAuth(); // Error!
}

// ✅ CORRECT
function App() {
  return (
    <AuthProvider>
      <MyComponent />
    </AuthProvider>
  );
}

function MyComponent() {
  const { user } = useAuth(); // Works!
}
```

b) **Checking user before auth is loaded**
```tsx
// ❌ WRONG - doesn't wait for auth to load
const { user } = useAuth();
if (user.role === "teacher") { } // Might crash if user is null

// ✅ CORRECT
const { user, loading } = useAuth();
if (loading) return <div>Loading...</div>;
if (user?.role === "teacher") { } // Safe
```

c) **User not found in Firestore**
```tsx
// Check Firebase Console → Firestore → users collection
// If collection is empty, create a test user:
// 1. Sign up a new user through the app
// 2. Or manually add a user document in Firebase Console
```

---

### 4. "Unauthorized domain" Error

**Problem:**
```
Error: The domain xxxxx is not authorized to run this operation. 
Please add it to the authorization domain list on the Firebase Console.
```

**Solution:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Click **Authentication** tab
5. Scroll to **Authorized domains**
6. Click **Add domain**
7. Add your domain:
   - For local dev: `localhost`
   - For production: `yourdomain.com`

Wait a few minutes for changes to propagate.

---

### 5. Infinite Redirect Loop (Login ↔ Dashboard)

**Problem:**
- Login page redirects to dashboard
- Dashboard immediately redirects back to login
- Can't stay logged in

**Causes & Solutions:**

a) **User document not in Firestore**
```tsx
// In AuthContext.tsx, check the getDoc query:
const userDocRef = doc(db, "users", firebaseUser.uid);
const userDocSnap = await getDoc(userDocRef);

if (!userDocSnap.exists()) {
  // User just signed up, need to create Firestore document
  // This should happen in signUp() function
}
```

b) **Firestore collection doesn't exist**
- Create a test user by signing up
- Firestore will auto-create the `users` collection

c) **Rules blocking Firestore reads**
```javascript
// Temporary: Allow all reads/writes (for testing only!)
match /users/{document=**} {
  allow read, write: if true;
}
```

d) **Check loading state in ProtectedRoute**
```tsx
// Make sure ProtectedRoute waits for auth to load
const { isAuthenticated, loading } = useAuth();
if (loading) return <LoadingSpinner />;
if (!isAuthenticated) return <Navigate to="/login" />;
```

---

### 6. User Remains Logged In After Logout

**Problem:**
After clicking logout, redirects to login but user is immediately logged back in.

**Solution:**

Ensure logout properly clears the session:

```tsx
// In AuthContext.tsx
const logout = async () => {
  try {
    await signOut(auth);  // This clears Firebase session
    setUser(null);        // Clear local state
  } catch (error) {
    console.error("Logout error:", error);
  }
};
```

Also check:
1. No `localStorage` or `sessionStorage` being used
2. No auto-login on app load
3. Clear cookies in browser (might be caching)

---

### 7. Role Not Changing / Showing Wrong Role

**Problem:**
- Signed up as student but sees teacher dashboard
- Or role not updating after changes

**Solution:**

Role is set at signup and stored in Firestore. To change:

**Option 1: Create new account**
- Logout
- Sign up with different email and role

**Option 2: Manual update in Firebase**
1. Go to Firestore → users collection
2. Find the user document
3. Edit the `role` field manually
4. Save changes
5. Logout and login again to see changes

**Option 3: Add admin function**
```tsx
// Add to AuthContext.tsx
const updateUserRole = async (uid: string, newRole: UserRole) => {
  await setDoc(doc(db, "users", uid), { role: newRole }, { merge: true });
};
```

---

### 8. Can't Create Firestore Database

**Problem:**
"Firestore not set up" or "Collection not found" error

**Solution:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Build** → **Firestore Database**
4. Click **Create database**
5. Choose **Start in test mode**
6. Select location (usually `us-central1`)
7. Click **Create**

Wait a minute for initialization.

---

### 9. SignUp Works But Can't Login

**Problem:**
- Account creation succeeds
- But logging in with same credentials fails
- "User not found" error

**Causes & Solutions:**

a) **Firestore document not created during signup**
```tsx
// Check if setDoc is being called in signUp()
const signUp = async (email, password, displayName, role) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  
  // Make sure this happens:
  await setDoc(doc(db, "users", uid), {
    email,
    displayName,
    role,
    createdAt: new Date().toISOString(),
  });
};
```

b) **Wrong collection name**
- Check code uses `doc(db, "users", uid)`
- Not `doc(db, "user", uid)` (singular)

c) **Email already exists in different format**
- Firebase email is case-insensitive
- If signed up as `John@example.com`, login as `john@example.com`

---

### 10. "Maximum call stack size exceeded"

**Problem:**
```
RangeError: Maximum call stack size exceeded
```

Usually happens with infinite loops in useEffect.

**Solution:**

Check `AuthContext.tsx` useEffect:
```tsx
// ❌ WRONG - infinite loop
useEffect(() => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    // ... code that calls setUser
    setUser(...); // This triggers re-render
  }); // No return statement, listener never cleaned up!
}, []); // Missing dependency, runs every render

// ✅ CORRECT
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    // ... code
    setUser(...);
  });

  return () => unsubscribe(); // Clean up listener
}, []); // Empty dependency array - runs once
```

---

### 11. Firestore Security Rules Blocking Access

**Problem:**
- App worked, then stopped after adding Firestore rules
- Error: "Permission denied"

**Solution:**

Your Firestore rules need to allow:
1. Reading own user document
2. Writing own user document during signup

```javascript
// Add to Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own document
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

---

### 12. Lost Firestore Data After Deleting User

**Problem:**
Deleted user from Firebase Console but data still there, or vice versa.

**Solution:**

User data has two parts:
1. **Firebase Authentication** - User credentials
2. **Firestore Database** - User profile document

Delete both:
1. Go to **Authentication** → **Users** → Delete user
2. Go to **Firestore** → **users** collection → Delete document

Or update code to auto-delete Firestore document when user deletes account.

---

### 13. Development Server Shows Blank Page

**Problem:**
- App compiles but shows blank white page
- No errors in console

**Causes & Solutions:**

a) **App not rendering due to missing imports**
```tsx
// Check frontend/src/App.tsx
// Make sure all imports are correct
```

b) **Firestore is undefined**
```tsx
// In AuthContext.tsx, check:
import { db } from "@/config/firebase";
// Not: import { db } from "firebase";
```

c) **Check browser console** (F12 → Console tab)
- Look for red error messages
- Search for "undefined" or "cannot read"

d) **Check Network tab** (F12 → Network tab)
- If Firebase config wrong, API calls will 401/403
- Look for failed requests to `identitytoolkit.googleapis.com`

---

### 14. CORS or Network Errors

**Problem:**
```
Access to XMLHttpRequest from 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**

This is a backend CORS issue, not Firebase-related.

If calling your Node.js backend:
```javascript
// In backend/src/app.js
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true
}));
```

Firebase handles CORS automatically, so this shouldn't happen with Firebase calls.

---

### 15. Tests Failing Due to Auth

**Problem:**
Unit tests fail because `AuthProvider` not available or `useAuth()` not working.

**Solution:**

Wrap test components in `AuthProvider`:
```tsx
import { AuthProvider } from "@/context/AuthContext";

describe("MyComponent", () => {
  it("should render", () => {
    render(
      <AuthProvider>
        <MyComponent />
      </AuthProvider>
    );
  });
});
```

Or mock `useAuth()`:
```tsx
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { displayName: "Test User", role: "student" },
    loading: false,
    isAuthenticated: true,
  }),
}));
```

---

## 🆘 Still Not Working?

1. **Check the docs:**
   - [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   - [QUICK_START.md](QUICK_START.md)
   - [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

2. **Check Firebase Console:**
   - Is authentication enabled?
   - Is Firestore database created?
   - Are there any error messages in logs?

3. **Check browser console:** (F12 key)
   - Red error messages with stack traces
   - Network tab showing failed requests

4. **Try with demo credentials:**
   - If you haven't yet, sign up fresh with test email
   - Check Firestore to ensure document was created

5. **Compare with example:**
   - Check `src/pages/LoginPage.tsx` for signup flow
   - Check `src/context/AuthContext.tsx` for auth logic
   - Compare your changes with original code

---

## 📞 Getting Help

- Firebase Support: https://firebase.google.com/support
- React Issues: https://github.com/facebook/react/issues
- Stack Overflow: tag with `firebase` and `react`

---

Good luck! 🚀

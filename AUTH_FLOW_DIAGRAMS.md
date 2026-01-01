# StudySyncAI Authentication Flow - Visual Guide

## User Journey

### First Time User (Signup)
```
┌─────────────────────────────────────────────────────────────┐
│                    StudySyncAI App                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
                   [Not Authenticated]
                           ↓
                    ┌──────────────┐
                    │  Login Page  │
                    └──────────────┘
                           ↓
                  [Click "Sign Up"]
                           ↓
                 ┌──────────────────────┐
                 │ Select Your Role     │
                 │ ① Student (default)  │
                 │ ② Teacher            │
                 └──────────────────────┘
                           ↓
              ┌────────────────────────────┐
              │ Enter Credentials          │
              │ • Full Name                │
              │ • Email                    │
              │ • Password                 │
              └────────────────────────────┘
                           ↓
         ┌──────────────────────────────────┐
         │ Firebase Creates Account         │
         │ └─ Email/Password Auth          │
         │ └─ User UID Generated           │
         └──────────────────────────────────┘
                           ↓
        ┌────────────────────────────────────┐
        │ Firestore Stores User Document    │
        │ {                                  │
        │   uid: "user123",                 │
        │   email: "student@example.com",   │
        │   displayName: "John Doe",        │
        │   role: "student",                │
        │   createdAt: "2026-01-01"         │
        │ }                                  │
        └────────────────────────────────────┘
                           ↓
           ┌────────────────────────────────┐
           │ Redirect to Dashboard          │
           │ (Role: Student)                │
           └────────────────────────────────┘
```

### Returning User (Login)
```
┌──────────────────────┐
│   Login Page         │
└──────────────────────┘
         ↓
┌──────────────────────────┐
│ Enter Email & Password   │
└──────────────────────────┘
         ↓
┌──────────────────────────┐
│ Firebase Verifies Auth   │
└──────────────────────────┘
         ↓
┌──────────────────────────┐
│ Fetch User Data from     │
│ Firestore (role, name)   │
└──────────────────────────┘
         ↓
┌──────────────────────────┐
│ Load Dashboard           │
│ Show Correct Role UI     │
└──────────────────────────┘
```

## Dashboard UI Based on Role

### Student Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ LearnHub                                          🔔  👤    │
├─────────────────────────────────────────────────────────────┤
│ ├─ Dashboard (active)                                       │
│ ├─ Classes                                                  │
│ ├─ Live Lessons                  [Live]                    │
│ ├─ Recorded Lessons                                        │
│ ├─ My Tasks                        [3]                     │
│ ├─ Progress Tracker                                        │
│ ├─ Study Groups                                            │
│ ├─ Video Library                                           │
│ ├─ Doubt Solver                                            │
│ ├─ Settings                                                │
│ │                                                           │
│ └─ Logout                          🔐                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Welcome back, John!                                       │
│   You have 3 pending tasks...                              │
│                                                              │
│   [Dashboard Content for Students]                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘

✓ Only Student navigation visible
✓ No role switcher
✓ Student-specific content
```

### Teacher Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ LearnHub                                          🔔  👤    │
├─────────────────────────────────────────────────────────────┤
│ ├─ Dashboard (active)                                       │
│ ├─ My Classes                                              │
│ ├─ Live Sessions                   [2]                     │
│ ├─ Assignments                     [12]                    │
│ ├─ Student Progress                                        │
│ ├─ Doubt History                                           │
│ ├─ Settings                                                │
│ │                                                           │
│ └─ Logout                          🔐                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Welcome back, Prof. Smith!                               │
│   You have 5 pending assignments...                        │
│                                                              │
│   [Dashboard Content for Teachers]                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘

✓ Only Teacher navigation visible
✓ No role switcher
✓ Teacher-specific content
```

## Key Differences: Before vs After

### BEFORE (Local State Management)
```
┌─────────────────────────────────────────┐
│      Dashboard Component                 │
├─────────────────────────────────────────┤
│                                          │
│ [Student]  [Teacher]  ← Switchable!    │
│                                          │
│ ✗ Both tabs always visible              │
│ ✗ Can switch anytime                    │
│ ✗ No login required                     │
│ ✗ Data not persisted                    │
│ ✗ Anyone can be teacher                 │
│                                          │
└─────────────────────────────────────────┘
```

### AFTER (Firebase Authentication)
```
┌─────────────────────────────────────────┐
│      Firebase Auth + Firestore          │
├─────────────────────────────────────────┤
│                                          │
│         Login/Signup Page               │
│           ↓                              │
│   Select Role (Once Only!)              │
│      ↓ Student or Teacher               │
│   Store in Firestore                    │
│      ↓                                   │
│   Dashboard with Single Role            │
│                                          │
│ ✓ Role switcher hidden                 │
│ ✓ Cannot switch roles                  │
│ ✓ Login required                        │
│ ✓ Data persisted                        │
│ ✓ Secure role assignment                │
│                                          │
└─────────────────────────────────────────┘
```

## Component Architecture

```
App.tsx
├── AuthProvider
│   ├── BrowserRouter
│   │   └── Routes
│   │       ├── /login → LoginPage
│   │       └── / → ProtectedRoute
│   │           └── Index
│   │               ├── useAuth() [Gets user role]
│   │               ├── DashboardLayout
│   │               │   ├── Sidebar (shows role-specific items)
│   │               │   ├── Header (with logout button)
│   │               │   └── Main Content (role-specific)
│   │               │       ├── Student Dashboard
│   │               │       └── Teacher Dashboard
│   │               └── Toast Notifications
│   └── QueryClientProvider
```

## Data Flow

### Authentication Context
```
┌────────────────────────────────────────┐
│        AuthContext (Global)            │
├────────────────────────────────────────┤
│                                        │
│  State:                                │
│  ├─ user (UserData | null)            │
│  ├─ loading (boolean)                 │
│  └─ isAuthenticated (boolean)         │
│                                        │
│  Methods:                              │
│  ├─ signUp()                          │
│  ├─ signIn()                          │
│  ├─ logout()                          │
│  └─ useAuth() Hook                    │
│                                        │
│  Subscribed to:                        │
│  ├─ Firebase Auth changes             │
│  └─ Firestore user documents          │
│                                        │
└────────────────────────────────────────┘
         ↓
    Components can access via:
    const { user, logout } = useAuth();
```

## Firebase Collection Structure

```
Firestore Database
│
└─ users/
   │
   ├─ user_uid_123/
   │  ├─ email: "student@example.com"
   │  ├─ displayName: "John Doe"
   │  ├─ role: "student"
   │  └─ createdAt: "2026-01-01T10:00:00Z"
   │
   └─ user_uid_456/
      ├─ email: "teacher@example.com"
      ├─ displayName: "Prof. Smith"
      ├─ role: "teacher"
      └─ createdAt: "2026-01-01T11:00:00Z"
```

## Security Features

```
✓ Protected Routes
  └─ Cannot access dashboard without login

✓ Role-Based Access Control
  └─ Student content hidden from teachers
  └─ Teacher content hidden from students

✓ Persistent Authentication
  └─ Session maintained across page refreshes

✓ Secure Logout
  └─ All session data cleared
  └─ Redirected to login

✓ Firebase Security
  └─ Passwords encrypted by Firebase
  └─ Server-side validation
```

## State Management Flow

```
User Interaction
    ↓
LoginPage (Email/Password/Role)
    ↓
AuthContext.signUp() or signIn()
    ↓
Firebase Authentication
    ↓
Firestore Read/Write
    ↓
AuthContext updates state
    ↓
useAuth() Hook triggers re-render
    ↓
Component shows role-specific UI
```

## Testing the Implementation

### Test Scenario 1: Student Signup
```
1. Open app → Redirected to /login
2. Click "Sign Up"
3. Select "Student"
4. Enter: john@example.com / password123 / John Doe
5. Click "Create Account"
6. ✓ Dashboard loads with Student navigation only
7. ✓ Teacher items hidden
8. ✓ Can access student-only pages
```

### Test Scenario 2: Teacher Login
```
1. Already logged in as student
2. Click Logout button
3. Click "Sign In"
4. Enter: teacher@example.com / password123
5. Click "Sign In"
6. ✓ Dashboard reloads with Teacher navigation only
7. ✓ Student items hidden
8. ✓ Can access teacher-only pages
```

### Test Scenario 3: Protected Route
```
1. Close browser (clear session)
2. Manually navigate to localhost:5173
3. ✓ Redirected to /login
4. ✓ Cannot access dashboard
5. Login and ✓ can access dashboard
```

# Firebase Firestore Setup Checklist

Complete these steps to enable the task management feature.

## ✅ Pre-Setup Checklist

- [x] Firebase project created: `studysyncai-82ca9`
- [x] Firebase config added to `.env.local`
- [x] Firebase SDK installed in project
- [x] Authentication already working
- [x] Code implementation completed

## 📝 Setup Steps (Do These Now)

### Step 1: Enable Firestore Database
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Select project: `studysyncai-82ca9`
- [ ] Click "Firestore Database" in left sidebar
- [ ] Click "Create database" button
- [ ] Choose "Start in production mode"
- [ ] Select location: `us-central` (or your preferred region)
- [ ] Click "Enable"
- [ ] Wait for database to be created (30-60 seconds)

### Step 2: Deploy Firestore Security Rules
- [ ] In Firebase Console, stay in Firestore Database
- [ ] Click "Rules" tab at the top
- [ ] You'll see the default rules - replace them
- [ ] Copy the content from `/firestore.rules` file in your project
- [ ] Paste into the rules editor
- [ ] Click "Publish" button
- [ ] Wait for rules to deploy (5-10 seconds)

### Step 3: Create Firestore Index (Optional but Recommended)

#### Option A: Automatic (Recommended - Easier)
- [ ] Start your frontend: `cd frontend && npm run dev`
- [ ] Login to the app
- [ ] Go to Tasks page
- [ ] Open browser console (F12)
- [ ] If you see an index error, click the provided link
- [ ] It will create the index automatically
- [ ] Wait 2-3 minutes for index to build

#### Option B: Manual (More Control)
- [ ] In Firebase Console, go to Firestore Database
- [ ] Click "Indexes" tab
- [ ] Click "Create Index" button
- [ ] Set Collection ID: `tasks`
- [ ] Add field: `userId` (Ascending)
- [ ] Add field: `createdAt` (Descending)
- [ ] Query scope: Collection
- [ ] Click "Create"
- [ ] Wait for index to build (2-3 minutes)

### Step 4: Test the Implementation
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Open browser to `http://localhost:5173`
- [ ] Login with your credentials
- [ ] Navigate to "My Tasks" page
- [ ] Click "Add Task" button
- [ ] Fill in the form:
  - [ ] Title: "Test Task"
  - [ ] Subject: "Mathematics"
  - [ ] Description: "This is a test"
  - [ ] Priority: "High"
  - [ ] Deadline: Tomorrow's date
- [ ] Click "Create Task" button
- [ ] You should see success toast notification
- [ ] Task should appear in the list instantly
- [ ] Try marking it complete (click circle icon)
- [ ] Try deleting it (click trash icon)

### Step 5: Verify in Firebase Console
- [ ] Go back to Firebase Console
- [ ] Go to Firestore Database → Data tab
- [ ] You should see `tasks` collection
- [ ] Click on the collection
- [ ] You should see your test task document
- [ ] Click on the document to view fields
- [ ] Verify all fields are present:
  - [ ] `userId` matches your user ID
  - [ ] `title` is "Test Task"
  - [ ] `subject` is "Mathematics"
  - [ ] `description` is present
  - [ ] `priority` is "high"
  - [ ] `status` is "pending" or "completed"
  - [ ] `progress` is a number
  - [ ] `createdAt` is a timestamp

## 🔍 Verification Checklist

### Database Structure
- [ ] `tasks` collection exists
- [ ] Documents have auto-generated IDs
- [ ] Each document has `userId` field
- [ ] Each document has all required fields

### Security
- [ ] Firestore rules are published
- [ ] Users can only see their own tasks
- [ ] Cannot access other users' tasks

### Functionality
- [ ] Can add new tasks
- [ ] Can view list of tasks
- [ ] Can mark tasks as complete
- [ ] Can delete tasks
- [ ] Can filter by status
- [ ] Can filter by priority
- [ ] Statistics show correct counts
- [ ] Real-time updates work (no refresh needed)

### User Experience
- [ ] Loading state shows while fetching
- [ ] Success toasts appear on actions
- [ ] Error toasts appear on failures
- [ ] Smooth animations
- [ ] Responsive design works

## 🐛 Troubleshooting

### Issue: "Missing or insufficient permissions"
**Solution:**
- [ ] Check Firestore rules are published
- [ ] Verify rules match the content in `/firestore.rules`
- [ ] Make sure you're logged in
- [ ] Try logging out and back in

### Issue: "Index not ready" or "requires an index"
**Solution:**
- [ ] Click the link in the error message
- [ ] Wait 2-3 minutes for index to build
- [ ] Refresh the page
- [ ] Or create index manually (see Step 3)

### Issue: Tasks not appearing
**Solution:**
- [ ] Check browser console for errors
- [ ] Verify Firestore is enabled in Firebase Console
- [ ] Check that you're logged in (AuthContext)
- [ ] Verify `userId` field in database matches your user ID
- [ ] Try adding a new task to trigger refresh

### Issue: Cannot add tasks
**Solution:**
- [ ] Check all required fields are filled
- [ ] Verify Firestore rules allow create operations
- [ ] Check browser console for errors
- [ ] Verify Firebase config in `.env.local` is correct

### Issue: Real-time updates not working
**Solution:**
- [ ] Check browser console for WebSocket errors
- [ ] Verify internet connection
- [ ] Check Firestore quota limits in Firebase Console
- [ ] Try refreshing the page

## 📊 Firebase Console Quick Links

- **Project Overview**: https://console.firebase.google.com/project/studysyncai-82ca9
- **Firestore Database**: https://console.firebase.google.com/project/studysyncai-82ca9/firestore
- **Firestore Rules**: https://console.firebase.google.com/project/studysyncai-82ca9/firestore/rules
- **Firestore Indexes**: https://console.firebase.google.com/project/studysyncai-82ca9/firestore/indexes
- **Authentication**: https://console.firebase.google.com/project/studysyncai-82ca9/authentication

## 📚 Additional Resources

- **Firestore Documentation**: https://firebase.google.com/docs/firestore
- **Security Rules Guide**: https://firebase.google.com/docs/firestore/security/rules-structure
- **Query Documentation**: https://firebase.google.com/docs/firestore/query-data/queries

## ✨ Once Complete

After completing all steps:
- [x] Code implementation ✅
- [ ] Firestore enabled ⏳
- [ ] Security rules deployed ⏳
- [ ] Index created ⏳
- [ ] Feature tested ⏳
- [ ] Data verified in console ⏳

**When all checkboxes are marked, your task management system is fully operational! 🎉**

---

**Estimated Setup Time**: 10-15 minutes
**Difficulty**: Easy (mostly point-and-click in Firebase Console)

Need help? Check:
- [TASKS_FEATURE_GUIDE.md](TASKS_FEATURE_GUIDE.md) - Quick reference
- [FIRESTORE_TASKS_SETUP.md](FIRESTORE_TASKS_SETUP.md) - Detailed guide
- [TASKS_ARCHITECTURE.md](TASKS_ARCHITECTURE.md) - System architecture

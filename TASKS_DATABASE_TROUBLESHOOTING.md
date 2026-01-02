# Tasks Feature - Database Troubleshooting Guide

## Issue: Loading error while fetching task data

### Root Causes & Solutions

#### 1. **Firestore Composite Index Not Created** (MOST COMMON)
**Problem:** Using `where()` + `orderBy()` requires a composite index in Firestore.

**Solution:**
- Go to [Firebase Console](https://console.firebase.google.com/)
- Navigate to Firestore Database → Indexes tab
- Create an index for:
  - Collection: `tasks`
  - Field 1: `userId` (Ascending)
  - Field 2: `createdAt` (Descending)
- Or let Firestore auto-create it by checking the error message in the console

**Status:** ✅ FIXED - Code now uses client-side sorting to avoid requiring composite index

---

#### 2. **Firestore Rules - Permission Denied**
**Problem:** User doesn't have permission to read tasks.

**Check:**
```javascript
// In browser console, run:
window.debugFirebase()
```

**Look for:** `permission-denied` error

**Solution:**
- Verify `firestore.rules` is deployed to Firebase
- Check that rules allow reading:
  ```
  match /tasks/{taskId} {
    allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  }
  ```

---

#### 3. **Firestore Not Initialized or No Internet**
**Problem:** Firestore connection fails.

**Solution:**
- Verify Firebase credentials in `.env.local`
- Check browser console for network errors
- Ensure you're logged in (check AuthContext)
- Check if Firestore is enabled in Firebase Console

---

#### 4. **Database Empty or No Tasks Created**
**Problem:** No error, but tasks list is empty.

**Solution:**
- This is normal! The loading message disappears when there are no tasks.
- Try creating a new task using the "Add Task" button.
- Check Firebase Console Firestore → Data tab to verify documents exist.

---

#### 5. **Authentication Issue**
**Problem:** Error says "No authenticated user".

**Solution:**
- Make sure you're logged in
- Check if AuthContext properly sets the user
- Verify Firebase Auth is configured correctly

---

## Debugging Steps

### Step 1: Check Browser Console
1. Open your app: `http://localhost:5173`
2. Open DevTools (F12 → Console tab)
3. Look for error messages starting with "Error loading tasks"
4. Check the error code:
   - `permission-denied`: Rules issue
   - `failed-precondition`: Index issue (now fixed)
   - `unavailable`: Firebase is down

### Step 2: Run Debug Script
In browser console, run:
```javascript
window.debugFirebase()
```

This will show:
- ✅/❌ Auth status
- ✅/❌ Firestore connection
- ✅/❌ Tasks collection access
- Error details if any

### Step 3: Check Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `studysyncai-82ca9`
3. Check Firestore Database:
   - Data tab: Do you see a `tasks` collection?
   - Rules tab: Are rules deployed?
   - Indexes tab: Are indexes created?

### Step 4: Verify Credentials
Check `/frontend/.env.local`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=studysyncai-82ca9
```

Should match Firebase Console project settings.

---

## Quick Solutions Checklist

- [ ] Remove `orderBy()` from query? ✅ Already done
- [ ] Check Firestore rules deployed? Check Firebase Console
- [ ] Create composite index? Create in Firebase Console or auto-create via error link
- [ ] User authenticated? Check browser console or run `window.debugFirebase()`
- [ ] Firebase credentials correct? Check `.env.local`
- [ ] Try clearing browser cache? Ctrl+Shift+Delete
- [ ] Try re-login? Logout and login again

---

## Enhanced Error Messages

The code now provides specific error messages:

```
✗ permission-denied
  → "Permission denied. Check Firestore rules."

✗ invalid-argument
  → "Invalid query. Retrying without index..."

✗ unavailable
  → "Firestore is currently unavailable."

✗ failed-precondition
  → "Firestore needs to create an index. This usually takes a few minutes."
```

Check the browser console (F12) to see which error you get!

---

## Testing Tasks Feature

1. **Create a task:**
   - Login to app
   - Go to "My Tasks"
   - Click "Add Task"
   - Fill form and submit
   - Should see success toast

2. **View tasks:**
   - Tasks should appear in list
   - Should be sorted by newest first
   - Can filter by status/priority

3. **Update task:**
   - Click the circle icon to mark as complete
   - Status should change to "completed"

4. **Delete task:**
   - Click trash icon
   - Task should be removed

---

## Firebase Console Links

- [Firestore Database](https://console.firebase.google.com/u/0/project/studysyncai-82ca9/firestore)
- [Firestore Rules](https://console.firebase.google.com/u/0/project/studysyncai-82ca9/firestore/rules)
- [Firestore Indexes](https://console.firebase.google.com/u/0/project/studysyncai-82ca9/firestore/indexes)

---

## More Help

If the issue persists:
1. Check console for exact error message
2. Note the error code
3. Check Firebase Console for any warnings
4. Verify rules are published
5. Clear browser cache and refresh

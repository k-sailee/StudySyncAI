# Firestore Setup for Tasks Feature

## Overview
This guide will help you set up Firestore database for the Tasks feature in StudySyncAI.

## Step 1: Enable Firestore in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `studysyncai-82ca9`
3. Click on "Firestore Database" in the left sidebar
4. Click "Create database"
5. Choose "Start in production mode" (we'll add custom rules)
6. Select your preferred location (e.g., `us-central`)
7. Click "Enable"

## Step 2: Set Up Firestore Security Rules

1. In the Firebase Console, go to "Firestore Database"
2. Click on the "Rules" tab
3. Replace the default rules with the content from `firestore.rules` file in the project root
4. Click "Publish"

### Alternative: Using Firebase CLI

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore (if not done)
firebase init firestore

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

## Step 3: Create Firestore Indexes (Optional but Recommended)

For better query performance, create a composite index:

1. Go to Firestore Database → Indexes tab
2. Click "Create Index"
3. Set up the following:
   - Collection ID: `tasks`
   - Fields to index:
     - `userId` (Ascending)
     - `createdAt` (Descending)
   - Query scope: Collection
4. Click "Create"

### Alternative: Automatic Index Creation

When you first run a query, Firestore will prompt you to create the required index. Click the provided link in the console error to automatically create it.

## Step 4: Test the Integration

1. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Login to the application
3. Navigate to "My Tasks" page
4. Click "Add Task" button
5. Fill in the form and submit
6. Verify the task appears in the list
7. Test marking tasks as complete/incomplete
8. Test deleting tasks

## Step 5: Verify Data in Firebase Console

1. Go to Firestore Database → Data tab
2. You should see a `tasks` collection
3. Click on any document to view its fields:
   - `userId`: User's UID
   - `title`: Task title
   - `subject`: Task subject/category
   - `description`: Task description
   - `deadline`: Deadline date
   - `priority`: high/medium/low
   - `status`: pending/in-progress/completed
   - `progress`: 0-100
   - `createdAt`: Timestamp

## Database Structure

### Tasks Collection (`tasks`)

```
tasks/
  {taskId}/
    userId: string         // User who created the task
    title: string          // Task title
    subject: string        // Subject/category
    description: string    // Detailed description
    deadline: string       // Deadline (date string)
    priority: string       // "high" | "medium" | "low"
    status: string         // "pending" | "in-progress" | "completed"
    progress: number       // 0-100
    createdAt: Timestamp   // Creation timestamp
```

### Users Collection (`users`)

Already exists from authentication setup.

## Security Features

✅ **User Isolation**: Users can only see and modify their own tasks
✅ **Authentication Required**: All operations require user to be logged in
✅ **Data Validation**: Firestore rules ensure userId matches authenticated user
✅ **Real-time Updates**: Tasks update automatically using Firestore snapshots

## Troubleshooting

### "Missing or insufficient permissions" error

**Solution**: Make sure Firestore rules are properly deployed. Check the Rules tab in Firebase Console.

### Tasks not appearing

**Solution**: 
1. Check browser console for errors
2. Verify user is logged in (check AuthContext)
3. Verify Firestore is enabled in Firebase Console
4. Check that the userId field matches the authenticated user's UID

### "Index not ready" error

**Solution**: Wait a few minutes for the index to be created, or create it manually in Firebase Console.

### Real-time updates not working

**Solution**:
1. Check browser console for connection errors
2. Verify Firestore is properly initialized in firebase.ts
3. Check network tab for WebSocket connections

## Features Implemented

✅ Add new tasks with form validation
✅ Display tasks filtered by current user
✅ Real-time updates (no refresh needed)
✅ Mark tasks as complete/incomplete
✅ Delete tasks
✅ Filter tasks by status and priority
✅ Task statistics (total, completed, in-progress, pending)
✅ Toast notifications for success/error feedback
✅ Loading states

## Next Steps (Optional Enhancements)

- [ ] Edit existing tasks
- [ ] Bulk operations (mark all complete, delete multiple)
- [ ] Task search functionality
- [ ] Task reminders/notifications
- [ ] Task categories/tags
- [ ] Task sharing with teachers
- [ ] Export tasks to PDF/CSV
- [ ] Task analytics and insights

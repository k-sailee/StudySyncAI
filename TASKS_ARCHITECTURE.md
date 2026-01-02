# Task Management Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              TasksPage Component                         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────┐    │  │
│  │  │ Add Task   │  │ Task List  │  │ Filters         │    │  │
│  │  │ Button     │  │ Display    │  │ (Status/Prior.) │    │  │
│  │  └────────────┘  └────────────┘  └─────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↕ (React Hooks & State)
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend Logic Layer                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • useAuth() → Get current user                          │  │
│  │  • useState() → Manage tasks array                       │  │
│  │  • useEffect() → Load tasks on mount                     │  │
│  │  • handleAddTask() → Create new task                     │  │
│  │  • toggleTaskStatus() → Update task status              │  │
│  │  • deleteTask() → Remove task                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↕ (Firebase SDK)
┌─────────────────────────────────────────────────────────────────┐
│                    Firebase Firestore SDK                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • collection() → Reference tasks collection             │  │
│  │  • addDoc() → Create new document                        │  │
│  │  • updateDoc() → Update existing document               │  │
│  │  • deleteDoc() → Delete document                         │  │
│  │  • query() + where() → Filter by userId                 │  │
│  │  • onSnapshot() → Real-time listener                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↕ (HTTPS/WebSocket)
┌─────────────────────────────────────────────────────────────────┐
│                   Firebase Cloud (Backend)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Firebase Authentication                                 │  │
│  │  ├─ User: user123 (uid)                                 │  │
│  │  └─ Email: student@example.com                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Firestore Database                                      │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ Collection: "tasks"                                 │ │  │
│  │  │  ┌──────────────────────────────────────────────┐  │ │  │
│  │  │  │ Document: task1 (auto-generated ID)          │  │ │  │
│  │  │  │  • userId: "user123"                         │  │ │  │
│  │  │  │  • title: "Math Homework"                    │  │ │  │
│  │  │  │  • subject: "Mathematics"                    │  │ │  │
│  │  │  │  • description: "Chapter 5"                  │  │ │  │
│  │  │  │  • deadline: "2026-01-10"                    │  │ │  │
│  │  │  │  • priority: "high"                          │  │ │  │
│  │  │  │  • status: "pending"                         │  │ │  │
│  │  │  │  • progress: 0                               │  │ │  │
│  │  │  │  • createdAt: Timestamp                      │  │ │  │
│  │  │  └──────────────────────────────────────────────┘  │ │  │
│  │  │  ┌──────────────────────────────────────────────┐  │ │  │
│  │  │  │ Document: task2                               │  │ │  │
│  │  │  │  • userId: "user123"                         │  │ │  │
│  │  │  │  • title: "Physics Lab"                      │  │ │  │
│  │  │  │  • ...                                        │  │ │  │
│  │  │  └──────────────────────────────────────────────┘  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Firestore Security Rules                               │  │
│  │  • Users can only read their own tasks                  │  │
│  │  • Users can only create tasks with their userId        │  │
│  │  • Users can only update/delete their own tasks         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. Adding a New Task

```
┌─────────┐  1. Click    ┌──────────────┐  2. Open    ┌────────────┐
│  User   │────────────→ │ Add Task Btn │───────────→ │   Dialog   │
└─────────┘              └──────────────┘             └────────────┘
                                                             │
                                                        3. Fill Form
                                                             ↓
┌─────────┐  8. Display  ┌──────────────┐  4. Submit  ┌────────────┐
│ UI List │←──────────── │  onSnapshot  │←──────────── │ handleAdd  │
└─────────┘              │  (realtime)  │              │   Task()   │
                         └──────────────┘              └────────────┘
                                ↑                            │
                          7. Notify                    5. addDoc()
                                │                            ↓
                         ┌──────────────┐             ┌────────────┐
                         │  Firestore   │←────────────│  Firebase  │
                         │  Database    │  6. Save    │    SDK     │
                         └──────────────┘             └────────────┘
```

### 2. Loading User Tasks on Page Load

```
┌─────────┐  1. Mount    ┌──────────────┐  2. useEffect  ┌────────────┐
│ TasksPage│────────────→ │  Component   │──────────────→ │  Get user  │
└─────────┘              └──────────────┘                └────────────┘
                                                                │
                                                          3. user.uid
                                                                ↓
┌─────────┐  8. Render   ┌──────────────┐  4. query()   ┌────────────┐
│   UI    │←──────────── │   setTasks   │←──────────────│  Firestore │
└─────────┘              └──────────────┘  7. Data      │   Query    │
                                ↑                        └────────────┘
                                │                              │
                         6. Listen                       5. where()
                                │                              ↓
                         ┌──────────────┐             ┌────────────┐
                         │  onSnapshot  │←────────────│  userId == │
                         │   (setup)    │             │  user.uid  │
                         └──────────────┘             └────────────┘
```

### 3. Toggling Task Status

```
┌─────────┐  1. Click    ┌──────────────┐  2. Call      ┌────────────┐
│  User   │────────────→ │ Circle Icon  │─────────────→ │ toggleTask │
└─────────┘              └──────────────┘               │  Status()  │
                                                         └────────────┘
                                                               │
                                                         3. Get taskId
                                                               ↓
┌─────────┐  8. Auto     ┌──────────────┐  4. updateDoc ┌────────────┐
│ UI List │  Update      │  onSnapshot  │←─────────────│  Firebase  │
└─────────┘  (realtime)  │  (listener)  │  7. Notify   │    SDK     │
                         └──────────────┘              └────────────┘
                                ↑                            │
                          6. Document                  5. Update
                             Changed                  status field
                                │                            ↓
                         ┌──────────────┐             ┌────────────┐
                         │  Firestore   │←────────────│  Database  │
                         │  Database    │             └────────────┘
                         └──────────────┘
```

## Component Hierarchy

```
App
└─ Routes
   └─ DashboardLayout (Protected)
      └─ TasksPage
         ├─ Header Section
         │  ├─ Title
         │  ├─ AI Scheduler Button
         │  └─ Add Task Button → Dialog
         │     └─ Add Task Form
         │        ├─ Title Input
         │        ├─ Subject Select
         │        ├─ Description Textarea
         │        ├─ Priority Select
         │        ├─ Deadline Input
         │        └─ Create Button
         │
         ├─ Statistics Cards
         │  ├─ Total Tasks
         │  ├─ Completed
         │  ├─ In Progress
         │  └─ Pending
         │
         ├─ Filter Section
         │  ├─ Status Filter
         │  └─ Priority Filter
         │
         └─ Task List
            └─ Task Card (for each task)
               ├─ Status Icon (clickable)
               ├─ Task Info
               │  ├─ Title
               │  ├─ Status Badge
               │  ├─ Description
               │  ├─ Subject Badge
               │  ├─ Deadline
               │  ├─ Priority Flag
               │  └─ Progress Bar
               └─ Actions
                  ├─ Edit Button
                  └─ Delete Button
```

## State Management

```
TasksPage Component State:
┌─────────────────────────────────────────┐
│ State Variables                         │
├─────────────────────────────────────────┤
│ • tasks: Task[]                         │
│   ↳ All tasks from Firestore           │
│                                         │
│ • filter: string                        │
│   ↳ "all" | "pending" | "in-progress"  │
│                                         │
│ • priorityFilter: string                │
│   ↳ "all" | "high" | "medium" | "low"  │
│                                         │
│ • isAddDialogOpen: boolean              │
│   ↳ Controls dialog visibility          │
│                                         │
│ • loading: boolean                      │
│   ↳ Shows loading spinner               │
│                                         │
│ • formData: object                      │
│   ├─ title: string                      │
│   ├─ subject: string                    │
│   ├─ description: string                │
│   ├─ deadline: string                   │
│   └─ priority: string                   │
└─────────────────────────────────────────┘

Context (from AuthContext):
┌─────────────────────────────────────────┐
│ • user: UserData                        │
│   ├─ uid: string                        │
│   ├─ email: string                      │
│   ├─ displayName: string                │
│   └─ role: "student" | "teacher"        │
└─────────────────────────────────────────┘
```

## Security Model

```
┌──────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├──────────────────────────────────────────────────────────────┤
│ Layer 1: Firebase Authentication                            │
│   • User must be logged in                                  │
│   • JWT token validates identity                            │
│   • request.auth.uid contains user ID                       │
├──────────────────────────────────────────────────────────────┤
│ Layer 2: Firestore Security Rules                           │
│   • Read: if resource.data.userId == request.auth.uid       │
│   • Create: if request.resource.data.userId == auth.uid     │
│   • Update/Delete: if resource.data.userId == auth.uid      │
├──────────────────────────────────────────────────────────────┤
│ Layer 3: Client-side Filtering                              │
│   • Query: where("userId", "==", user.uid)                  │
│   • Only fetches user's own tasks                           │
│   • Reduces data transfer                                   │
├──────────────────────────────────────────────────────────────┤
│ Result: Complete User Isolation ✅                           │
│   • User A cannot see User B's tasks                        │
│   • User A cannot modify User B's tasks                     │
│   • User A cannot delete User B's tasks                     │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│ Frontend                                │
├─────────────────────────────────────────┤
│ • React + TypeScript                    │
│ • Vite (Build tool)                     │
│ • Tailwind CSS (Styling)                │
│ • shadcn/ui (Components)                │
│ • Framer Motion (Animations)            │
│ • Lucide React (Icons)                  │
└─────────────────────────────────────────┘
         ↕
┌─────────────────────────────────────────┐
│ Firebase SDK                            │
├─────────────────────────────────────────┤
│ • firebase/auth                         │
│ • firebase/firestore                    │
└─────────────────────────────────────────┘
         ↕
┌─────────────────────────────────────────┐
│ Backend (Firebase Cloud)                │
├─────────────────────────────────────────┤
│ • Firebase Authentication               │
│ • Cloud Firestore (NoSQL Database)      │
│ • Firestore Security Rules              │
└─────────────────────────────────────────┘
```

---

This architecture ensures:
- ✅ Real-time data synchronization
- ✅ User data isolation
- ✅ Secure authentication
- ✅ Scalable database structure
- ✅ Clean separation of concerns

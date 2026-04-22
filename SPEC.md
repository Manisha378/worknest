# WorkNest - Production-Ready Full Stack Specification

## 1. Concept & Vision

WorkNest is a modern, minimalist productivity workspace where teams and individuals manage projects, tasks, and notes in one clean dashboard. The feel is "Notion meets Linear" — purposeful, fast, professional. Every interaction should feel crisp and intentional, with the kind of polish that signals a senior engineer built it, not a tutorial follower.

## 2. Design Language

**Aesthetic:** Clean SaaS dashboard — light surfaces, deep contrast text, one bold accent. Think Linear.app's clarity meets Vercel's sophistication.

**Color Palette:**
- Background: `#FAFAFA` (warm off-white)
- Surface/Card: `#FFFFFF`
- Sidebar: `#0A0A0B` (near-black)
- Sidebar text: `#A1A1AA`
- Sidebar active: `#FFFFFF`
- Primary accent: `#6366F1` (indigo)
- Primary hover: `#4F46E5`
- Text primary: `#0A0A0B`
- Text secondary: `#71717A`
- Border: `#E4E4E7`
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`

**Typography:**
- Font: Inter (Google Fonts)
- Headings: 600-700 weight
- Body: 400-500 weight
- Monospace: JetBrains Mono for code/data

**Spacing System:**
- Base unit: 4px
- Card padding: 24px
- Section gap: 32px
- Sidebar width: 260px
- Header height: 64px

**Motion:**
- Transitions: 150ms ease-out for interactions
- Page transitions: 200ms fade
- Modal open: 200ms scale + fade
- Skeleton shimmer: 1.5s infinite

**Visual Assets:**
- Icons: Lucide React (consistent stroke width, minimal)
- Avatars: Initials-based with colored background
- Empty states: Illustration-style with muted colors

## 3. Layout & Structure

**Shell:**
- Fixed left sidebar (260px) with logo, nav links, user profile at bottom
- Top header bar showing page title, breadcrumbs, action buttons
- Main content area with proper padding (32px)
- Mobile: sidebar collapses to hamburger overlay

**Page Pacing:**
- Landing: Hero → Features → CTA → Footer (scrolling)
- Auth pages: Centered card, full-height, minimal
- Dashboard: Stats row → Recent activity → Full table/list
- CRUD pages: Header + filters + table + create button

**Responsive Strategy:**
- Desktop: Full sidebar + content
- Tablet (768px+): Collapsible sidebar
- Mobile (<768px): Hidden sidebar, hamburger menu overlay

## 4. Features & Interactions

### Authentication
- **Signup**: Name, email, password (min 8 chars). Shows inline validation errors. Success redirects to dashboard. Duplicate email shows "Account already exists" message.
- **Login**: Email + password. Shows "Invalid credentials" on failure. Shows "Please sign in to continue" on protected route access.
- **Logout**: Clears session, redirects to login with "Signed out successfully" toast.
- **Password hashing**: bcrypt with 12 rounds.

### Dashboard
- Stats cards: Total tasks, completed, in-progress, pending
- Recent activity: Last 5 created/updated items
- Quick actions: Create task, create project buttons
- Welcome message with user name

### Projects
- List view with title, description preview, task count, created date
- Create modal with title + description fields
- Edit inline or modal
- Delete with confirmation dialog
- Click row to view project's tasks

### Tasks
- Table view with columns: Title, Status, Priority, Due Date, Project, Actions
- Filter by: Status (All, Todo, In Progress, Done), Priority (All, Low, Medium, High)
- Sort by: Created date, due date, title
- Status badge: Color-coded (gray=todo, blue=in-progress, green=done)
- Priority badge: Red=high, yellow=medium, blue=low
- Due date: Red highlight if overdue
- Create/edit: Modal with all fields
- Delete: Confirmation dialog
- Quick status update: Click status badge to cycle

### Notes
- List/card view with title, preview of first 100 chars, created date
- Create/edit: Modal with title + rich content (textarea)
- Delete: Confirmation
- Search: Filter by title in real-time

### Profile
- View name, email, member since date
- Update name
- Change password (current + new + confirm)

### Error Handling
- Form validation: Inline red text below fields, red border
- API errors: Toast notification (red) with message
- 404: Custom "Not found" page
- Server error: "Something went wrong" with retry button

### Empty States
- Dashboard (new user): "Welcome! Create your first project to get started" with illustration
- Projects (empty): "No projects yet. Create one to organize your work."
- Tasks (empty): "No tasks yet. Create one to start tracking."
- Notes (empty): "No notes yet. Create one to capture your thoughts."

### Loading States
- Skeleton loaders for cards (animated shimmer)
- Spinner for buttons during submission
- Skeleton rows for tables (3-5 rows)

## 5. Component Inventory

### Button
- Variants: primary, secondary, outline, ghost, destructive
- Sizes: sm, md, lg
- States: default, hover (darken 10%), active (darken 15%), disabled (opacity 50%), loading (spinner + disabled)

### Input
- States: default (border gray), focus (border indigo, ring), error (border red, red text below)
- Types: text, email, password (with visibility toggle), textarea
- Label above, helper text below

### Badge
- Variants: status (todo/in-progress/done), priority (low/medium/high), neutral
- Size: compact, rounded-full

### Card
- White background, border, rounded-lg, shadow-sm
- Hover: shadow-md transition

### Dialog/Modal
- Overlay: black 50% opacity, backdrop-blur-sm
- Content: white, rounded-xl, max-width 500px, padding 24px
- Animation: fade + scale from 95%

### Table
- Sticky header, alternating row colors (subtle)
- Hover row highlight
- Action buttons on the right

### Sidebar
- Dark background, logo at top, nav links, user section at bottom
- Active link: white text + left border indicator
- Hover: slightly lighter background

### Toast
- Position: bottom-right
- Variants: success (green), error (red), info (blue)
- Auto-dismiss: 5 seconds
- Manual dismiss: X button

## 6. Technical Approach

### Stack
- **Framework**: Next.js 14 with App Router + TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui (Dialog, Table, Input, Button, Badge, Toast)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js v5 (Auth.js) with credentials provider
- **Validation**: Zod for all form inputs and API requests
- **Password**: bcryptjs for hashing
- **Icons**: lucide-react
- **Date**: date-fns for formatting
- **Notifications**: Sonner for toast notifications

### Architecture
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth group: login, signup
│   ├── (protected)/       # Protected group: dashboard, projects, tasks, notes, profile
│   ├── api/               # API routes (if needed)
│   ├── layout.tsx
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Sidebar, Header, Shell
│   └── shared/            # Cards, Tables, Forms
├── lib/
│   ├── db.ts              # Prisma client singleton
│   ├── auth.ts            # NextAuth config
│   └── utils.ts           # Utilities (cn, formatters)
├── actions/               # Server Actions for CRUD
├── types/                 # TypeScript types
└── validations/           # Zod schemas
```

### Data Model
- **User**: id, name, email, password (hashed), createdAt, updatedAt
- **Project**: id, title, description, userId (FK), createdAt, updatedAt
- **Task**: id, title, description, status (todo|in_progress|done), priority (low|medium|high), dueDate (optional), projectId (FK, optional), userId (FK), createdAt, updatedAt
- **Note**: id, title, content, userId (FK), createdAt, updatedAt

### API Design (Server Actions)
- `createProject(formData)` → validate with Zod → create in DB → return project
- `updateProject(id, formData)` → verify ownership → update → return project
- `deleteProject(id)` → verify ownership → delete → return success
- `getProjects()` → return user's projects
- Same pattern for tasks and notes

### Auth Flow
1. Signup: hash password → create user in DB → create session → redirect dashboard
2. Login: find user by email → verify password → create session → redirect
3. Session: JWT stored in cookie, validated on every request
4. Middleware: protect all `/dashboard/*` routes, redirect to `/login`

### Validation (Zod)
- SignupSchema: name (min 2), email (valid format), password (min 8)
- LoginSchema: email, password (non-empty)
- ProjectSchema: title (min 1), description (optional)
- TaskSchema: title, status, priority, dueDate (optional), projectId (optional)
- NoteSchema: title (min 1), content (optional)

### Security
- All passwords hashed with bcrypt (12 rounds)
- CSRF protection via NextAuth
- Server-side ownership verification for all mutations
- Environment variables for all secrets
- No sensitive data in client bundle
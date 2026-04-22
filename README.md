# WorkNest - Production-Ready Full Stack Application

A modern, minimalist productivity workspace for managing projects, tasks, and notes. Built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

![WorkNest](https://img.shields.io/badge/WorkNest-v0.1.0-indigo)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)

## Features

### Authentication
- User signup with email and password
- User login with credential validation
- Password hashing with bcrypt (12 rounds)
- JWT-based session management
- Protected routes with middleware
- Logout functionality

### Dashboard
- Personalized dashboard with user greeting
- Real-time stats: total tasks, completed, in-progress, pending
- Quick actions for creating projects, tasks, notes
- Recent activity feed

### Projects (CRUD)
- Create, read, update, delete projects
- Project task count display
- User-specific data isolation

### Tasks (CRUD)
- Create, read, update, delete tasks
- Status management: To Do, In Progress, Done
- Priority levels: Low, Medium, High
- Due date tracking with overdue highlighting
- Project assignment
- Filter by status, priority, project
- Search functionality
- Quick inline status updates

### Notes (CRUD)
- Create, read, update, delete notes
- Full-text content with preview
- Search functionality
- User-specific data isolation

### Profile
- View and update profile information
- Change password functionality
- Account details display

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, shadcn/ui components |
| Backend | Next.js Server Actions, API Routes |
| Database | PostgreSQL, Prisma ORM |
| Auth | NextAuth.js v5 (Auth.js) |
| Validation | Zod |
| Password | bcryptjs |
| Icons | Lucide React |
| Notifications | Sonner (toast) |
| Date | date-fns |

## Project Structure

```
worknest/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Demo data seeder
├── src/
│   ├── actions/           # Server actions for CRUD
│   │   ├── auth.ts        # Auth actions (signup, login, logout)
│   │   ├── project.ts     # Project CRUD actions
│   │   ├── task.ts        # Task CRUD actions
│   │   └── note.ts        # Note CRUD actions
│   ├── app/
│   │   ├── (auth)/        # Auth pages group
│   │   │   ├── login/     # Login page
│   │   │   └── signup/    # Signup page
│   │   ├── (protected)/   # Protected pages group
│   │   │   ├── dashboard/ # Dashboard page
│   │   │   ├── projects/  # Projects CRUD page
│   │   │   ├── tasks/     # Tasks CRUD page
│   │   │   ├── notes/     # Notes CRUD page
│   │   │   └── profile/   # Profile settings page
│   │   ├── api/
│   │   │   └── auth/      # NextAuth API route
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Landing page
│   │   └── globals.css    # Global styles
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   └── alert-dialog.tsx
│   │   └── layout/        # Layout components
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       └── shell.tsx
│   ├── lib/
│   │   ├── db.ts          # Prisma client
│   │   ├── auth.ts        # NextAuth configuration
│   │   └── utils.ts       # Utility functions
│   ├── types/
│   │   └── index.ts       # TypeScript types
│   ├── validations/
│   │   ├── auth.ts        # Auth validation schemas
│   │   ├── project.ts     # Project validation schemas
│   │   ├── task.ts        # Task validation schemas
│   │   └── note.ts        # Note validation schemas
│   └── middleware.ts      # Route protection
├── .env.example           # Environment variables template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (local or hosted)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd worknest
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
# Generate with: openssl rand -base64 32
AUTH_SECRET="your-auth-secret-here"

# Your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/worknest"

# App URL
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# (Optional) Seed demo data
npx prisma db seed
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open the app**
Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials

After running the seed script:
- **Email:** demo@worknest.app
- **Password:** demo1234

## Database Schema

### User
| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| name | String | User's display name |
| email | String | Unique email address |
| password | String | Hashed password |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Project
| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| title | String | Project name |
| description | String? | Optional description |
| userId | String | Foreign key to User |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Task
| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| title | String | Task title |
| description | String? | Optional description |
| status | Enum | TODO, IN_PROGRESS, DONE |
| priority | Enum | LOW, MEDIUM, HIGH |
| dueDate | DateTime? | Optional due date |
| userId | String | Foreign key to User |
| projectId | String? | Optional FK to Project |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Note
| Field | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Primary key |
| title | String | Note title |
| content | String? | Note content |
| userId | String | Foreign key to User |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `AUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_URL` - Your deployment URL (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET` - Same as AUTH_SECRET
4. Deploy!

### Railway

1. Create a new Railway project
2. Add PostgreSQL database
3. Set environment variables
4. Deploy from GitHub

### Neon (Database)

1. Create a Neon project
2. Get your connection string
3. Add `DATABASE_URL` to your deployment

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Yes | Secret for NextAuth (generate with `openssl rand -base64 32`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Public URL of your app |
| `NEXT_PUBLIC_APP_URL` | No | Public URL (for client-side) |

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### Server Actions

All mutations use Next.js Server Actions:

**Projects:**
- `createProject(formData)` - Create new project
- `updateProject(formData)` - Update existing project
- `deleteProject(id)` - Delete project

**Tasks:**
- `createTask(formData)` - Create new task
- `updateTask(formData)` - Update existing task
- `deleteTask(id)` - Delete task
- `updateTaskStatus(id, status)` - Quick status update

**Notes:**
- `createNote(formData)` - Create new note
- `updateNote(formData)` - Update existing note
- `deleteNote(id)` - Delete note

## Validation

All inputs are validated with Zod schemas:

- **Signup:** Name (2-100 chars), Email (valid format), Password (8-100 chars)
- **Login:** Email (valid format), Password (non-empty)
- **Project:** Title (1-200 chars), Description (optional, max 1000)
- **Task:** Title (1-200 chars), Status, Priority, Due Date (optional)
- **Note:** Title (1-200 chars), Content (optional, max 10000)

## Security Features

- Passwords hashed with bcrypt (12 rounds)
- JWT-based session authentication
- Server-side route protection via middleware
- Ownership verification before mutations
- Input validation on both client and server
- Environment variables for secrets

## Responsive Design

The app is fully responsive:
- **Desktop (1024px+):** Full sidebar + content area
- **Tablet (768px-1023px):** Collapsible sidebar
- **Mobile (<768px):** Hamburger menu with overlay sidebar

## Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed demo data

# Linting
npm run lint         # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

---

Built with Next.js 14, TypeScript, and ❤️ for productivity.
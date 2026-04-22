import { PrismaClient, TaskStatus, TaskPriority } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@worknest.app" },
    update: {},
    create: {
      name: "Alex Chen",
      email: "demo@worknest.app",
      password: hashedPassword,
    },
  });

  console.log("Created demo user:", user.email);

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      title: "Website Redesign",
      description:
        "Complete overhaul of the company website with modern design and improved UX.",
      userId: user.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: "Mobile App Development",
      description:
        "Build a cross-platform mobile application for customers to access services on the go.",
      userId: user.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: "Q4 Marketing Campaign",
      description: "Plan and execute the Q4 marketing initiatives to drive brand awareness.",
      userId: user.id,
    },
  });

  console.log("Created projects");

  // Create tasks
  const tasks = [
    {
      title: "Create wireframes for homepage",
      description: "Design low-fidelity wireframes for the new homepage layout.",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: new Date("2024-11-15"),
      projectId: project1.id,
    },
    {
      title: "Review brand guidelines",
      description: "Go through existing brand guidelines and document any updates needed.",
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      projectId: project1.id,
    },
    {
      title: "Set up development environment",
      description: "Configure local dev environment with all necessary tools and dependencies.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date("2024-11-20"),
      projectId: project1.id,
    },
    {
      title: "Create component library",
      description: "Build reusable UI components following the design system.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date("2024-11-25"),
      projectId: project1.id,
    },
    {
      title: "Implement responsive navigation",
      description: "Build the header navigation with mobile hamburger menu.",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      projectId: project1.id,
    },
    {
      title: "Design database schema",
      description: "Plan and design the database structure for the mobile app.",
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      projectId: project2.id,
    },
    {
      title: "Create API endpoints",
      description: "Build REST API endpoints for user authentication and data operations.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date("2024-11-22"),
      projectId: project2.id,
    },
    {
      title: "Design user onboarding flow",
      description: "Create wireframes for the app onboarding and sign-up process.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: project2.id,
    },
    {
      title: "Plan social media content",
      description: "Create content calendar for social media posts in Q4.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      projectId: project3.id,
    },
    {
      title: "Coordinate with influencers",
      description: "Reach out to potential influencers for partnership opportunities.",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: new Date("2024-11-30"),
      projectId: project3.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        ...task,
        userId: user.id,
      },
    });
  }

  console.log("Created tasks");

  // Create notes
  const notes = [
    {
      title: "Design inspiration",
      content:
        "Looking at Linear, Vercel, and Stripe for design inspiration. Key elements:\n- Clean typography with Inter\n- Subtle shadows and rounded corners\n- Indigo accent color\n- Generous whitespace",
    },
    {
      title: "User research notes",
      content:
        "Met with 5 users to understand their workflow. Common pain points:\n- Too many tools scattered across devices\n- Hard to track progress on tasks\n- Need better organization for projects\n\nThese insights align with our core feature set.",
    },
    {
      title: "API design decisions",
      content:
        "REST vs GraphQL decision:\n- Start with REST for simplicity\n- Can migrate later if needed\n- Focus on clean, consistent endpoints\n\nEndpoints structure:\n- /api/auth/* for authentication\n- /api/projects/* for project operations\n- /api/tasks/* for task operations",
    },
    {
      title: "Q4 Goals",
      content:
        "Primary objectives for Q4:\n1. Launch redesigned website\n2. Complete mobile app MVP\n3. Execute marketing campaign\n4. Grow user base by 50%",
    },
  ];

  for (const note of notes) {
    await prisma.note.create({
      data: {
        ...note,
        userId: user.id,
      },
    });
  }

  console.log("Created notes");
  console.log("\n✅ Seeding complete!");
  console.log("\nDemo credentials:");
  console.log("  Email: demo@worknest.app");
  console.log("  Password: demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
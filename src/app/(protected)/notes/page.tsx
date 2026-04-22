import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { NotesClient } from "./notes-client";

export default async function NotesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const notes = await db.note.findMany({
    where: { userId: userId! },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <Header
        title="Notes"
        description="Capture and organize your thoughts"
      />
      <NotesClient notes={notes} />
    </div>
  );
}
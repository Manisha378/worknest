import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div>
      <Header
        title="Profile"
        description="Manage your account settings"
      />
      <ProfileClient user={user} />
    </div>
  );
}
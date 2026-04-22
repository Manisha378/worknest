import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Shell } from "@/components/layout/shell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Shell
      userName={session.user.name || undefined}
      userEmail={session.user.email || undefined}
    >
      {children}
    </Shell>
  );
}
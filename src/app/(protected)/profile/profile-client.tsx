"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Mail, Calendar, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfileAction, changePasswordAction } from "@/actions/auth";
import { formatDate } from "@/lib/utils";

interface ProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  };
}

export function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string[]>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string[]>>({});

  async function handleProfileUpdate(formData: FormData) {
    setProfileLoading(true);
    setProfileErrors({});
    const result = await updateProfileAction(formData);
    setProfileLoading(false);

    if (!result.success) {
      if (result.errors) setProfileErrors(result.errors);
      toast.error(result.message || "Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
      router.refresh();
    }
  }

  async function handlePasswordChange(formData: FormData) {
    setPasswordLoading(true);
    setPasswordErrors({});
    const result = await changePasswordAction(formData);
    setPasswordLoading(false);

    if (!result.success) {
      if (result.errors) setPasswordErrors(result.errors);
      toast.error(result.message || "Failed to change password");
    } else {
      toast.success("Password changed successfully");
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-semibold text-indigo-600">
              {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div>
              <p className="text-lg font-medium text-zinc-900">{user.name}</p>
              <p className="text-sm text-zinc-500">{user.email}</p>
            </div>
          </div>

          <form action={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                error={profileErrors.name?.[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-zinc-50"
              />
              <p className="text-xs text-zinc-400">
                Contact support to change your email address
              </p>
            </div>
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input
                value={formatDate(user.createdAt)}
                disabled
                className="bg-zinc-50"
              />
            </div>
            <Button type="submit" loading={profileLoading}>
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                error={passwordErrors.currentPassword?.[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter new password (min 8 characters)"
                error={passwordErrors.newPassword?.[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                error={passwordErrors.confirmPassword?.[0]}
                required
              />
            </div>
            <Button type="submit" loading={passwordLoading}>
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
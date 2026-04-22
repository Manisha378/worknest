"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signUpSchema, loginSchema, updateProfileSchema, changePasswordSchema } from "@/validations/auth";
import { auth, signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedData = signUpSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Please fix the errors below",
    };
  }

  const { name, email, password } = validatedData.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      success: false,
      errors: { email: ["An account with this email already exists"] },
      message: "Account already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const signInResult = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (signInResult?.error) {
    return {
      success: false,
      errors: {},
      message: "Account created but couldn't sign in automatically. Please sign in.",
    };
  }

  redirect("/dashboard");
}

export async function loginAction(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedData = loginSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Please fix the errors below",
    };
  }

  const { email, password } = validatedData.data;

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    return {
      success: false,
      errors: {},
      message: "Invalid email or password",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function getSession() {
  const session = await auth();
  return session;
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedData = updateProfileSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Please fix the errors below",
    };
  }

  await db.user.update({
    where: { email: session.user.email },
    data: { name: validatedData.data.name },
  });

  return { success: true, message: "Profile updated successfully" };
}

export async function changePasswordAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const rawData = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validatedData = changePasswordSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Please fix the errors below",
    };
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const isValidPassword = await bcrypt.compare(
    validatedData.data.currentPassword,
    user.password
  );

  if (!isValidPassword) {
    return {
      success: false,
      errors: { currentPassword: ["Current password is incorrect"] },
      message: "Current password is incorrect",
    };
  }

  const hashedPassword = await bcrypt.hash(validatedData.data.newPassword, 12);

  await db.user.update({
    where: { email: session.user.email },
    data: { password: hashedPassword },
  });

  return { success: true, message: "Password changed successfully" };
}
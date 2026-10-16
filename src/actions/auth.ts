"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { FieldValues } from "react-hook-form";

export const register = async (data: FieldValues) => {
  try {
    const { name, email, phone, password } = data;

    if (!name || !email || !phone || !password) {
      return { success: false, message: "All fields are required" };
    }

    const existing = await prisma.user.findUnique({
      where: { email: String(email) },
    });

    if (existing) {
      return { success: false, message: "A user with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        name: String(name),
        email: String(email),
        phone: String(phone),
        password: hashedPassword,
        role: "USER",
        isVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return {
      success: true,
      message: "Account created successfully! You can now log in.",
      data: user,
    };
  } catch (error) {
    console.error("User registration failed:", error);
    return {
      success: false,
      message: "Registration failed. Please try again later.",
    };
  }
};

"use server";

import { prisma } from "@/lib/prisma";
import { UpdateUserRequest } from "@/types";
import { revalidateTag } from "next/cache";
import bcrypt from "bcryptjs";

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        picture: true,
        role: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return null;
    }

    return { success: true, message: "User retrieved successfully", data: user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUserById = async (id: string, data: UpdateUserRequest) => {
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone && { phone: data.phone }),
        ...(data.picture && { picture: data.picture }),
      },
    });

    revalidateTag("USER_PROFILE");

    return {
      success: true,
      message: "User updated successfully",
      data: user,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

export const changeUserPassword = async (
  id: string,
  data: { currentPassword: string; newPassword: string }
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user || !user.password) {
      return { success: false, message: "User not found" };
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return { success: false, message: "Current password is incorrect" };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: { id: Number(id) },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, message: "Failed to change password" };
  }
};

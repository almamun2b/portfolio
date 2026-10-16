"use server";

import { UpdateUserRequest } from "@/types";
import { revalidateTag } from "next/cache";

export const getUserById = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["USER_PROFILE"],
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user:", await res.text());
      return null;
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const updateUserById = async (id: string, data: UpdateUserRequest) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("Failed to update user:", await res.text());
      return null;
    }

    const result = await res.json();

    if (result.success) {
      revalidateTag("USER_PROFILE");
    }

    return result;
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/${id}/change-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      console.error("Failed to change password:", await res.text());
      return null;
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error changing password:", error);
    return null;
  }
};

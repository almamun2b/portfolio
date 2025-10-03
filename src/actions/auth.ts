"use server";

import { User } from "next-auth";
import { FieldValues } from "react-hook-form";

export const register = async (data: FieldValues) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res?.ok) {
    console.error("User registration failed", await res.text());
  }
  const result = await res.json();
  return result;
};

export const loginWithGoogle = async (data: User) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data?.email,
      name: data?.name,
      picture: data?.image,
    }),
  });
  if (!res?.ok) {
    console.error("User Google login failed", await res.text());
  }
  const result = await res.json();
  return result;
};

export const login = async (data: FieldValues) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res?.ok) {
    console.error("User login failed", await res.text());
  }
  const result = await res.json();
  return result;
};

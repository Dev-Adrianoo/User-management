import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { User } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toPublicUser = (user: User) => {
  const { senhaHash, ...publicUser } = user
  return publicUser
}
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

 // Merge de classes Taiwind, usa CLSX + tailwind merge, para evitar conflitos futuros


export function cn(...input: ClassValue[]) {
  return twMerge(clsx(input))
}

export function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, "")
}

// Formata CEP ADICIONANDO TRAÇO

export function formatCep(cep: string): string {
  const normalized = normalizeCep(cep)
  if(normalized.length !== 8) return cep
  return `${normalized.slice(0,5)}-${normalized.slice(5)}`
}

export function isValidCep(cep: string): boolean {
  const normalized = normalizeCep(cep)
  return /^\d{8}$/.test(normalized)
}

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function getInitials(name: string): string {
  const parts = name.trim().split(" ")
  if(parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}


export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function toPublicUser(user: any): any {
  const { senhaHash, ...PublicUser } = user
  return PublicUser
}

export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}
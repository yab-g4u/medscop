import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    "https://amdkjxuekglsxkczawjn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZGtqeHVla2dsc3hrY3phd2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNTgxNDcsImV4cCI6MjA2NTgzNDE0N30.z5dAKo2qHwaDv3eNIhiM4MjY3FkCD2fhLnMBeoq_FTs",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}

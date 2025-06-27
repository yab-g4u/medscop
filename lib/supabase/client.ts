import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    "https://amdkjxuekglsxkczawjn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZGtqeHVla2dsc3hrY3phd2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNTgxNDcsImV4cCI6MjA2NTgzNDE0N30.z5dAKo2qHwaDv3eNIhiM4MjY3FkCD2fhLnMBeoq_FTs",
  )
}

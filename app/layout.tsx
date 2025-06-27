import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: "Medscope: Africa’s AI-Powered Epidemic Simulator",
  description: "Predict, Prepare, and Prevent with Real-Time Blockchain Transparency.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

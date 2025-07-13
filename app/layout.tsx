import type React from "react"
// app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { MainNav } from "@/components/main-nav" // Import MainNav

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Aplikasi Manajemen Inventaris Aki Mainan",
  description: "Aplikasi sederhana untuk mengelola inventaris aki mainan.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <MainNav /> {/* Tambahkan MainNav di sini */}
        <main>{children}</main>
      </body>
    </html>
  )
}

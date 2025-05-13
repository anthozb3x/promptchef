import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import Navbar from "@/components/Navbar"
import ThemeRegistry from "@/components/ThemeRegistry"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning style={{ backgroundColor: '#ffffff' }}>
        <ThemeRegistry>
          <Navbar />
          <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
            {children}
          </main>
          <Toaster position="bottom-right" />
        </ThemeRegistry>
      </body>
    </html>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Moon, Sun, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Avatar from "@/components/avatar"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import LanguageSelector from "@/components/language-selector"
import EmergencyCall from "@/components/emergency-call"
import { useTranslation } from "@/hooks/use-translation"
import { useAuth } from "@/hooks/use-auth"
import { useLocation } from "@/hooks/use-location"
import ShoppingMode from "@/components/modes/shopping-mode"

export default function ShoppingPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(1)
  const [showEmergencyCall, setShowEmergencyCall] = useState(false)

  const router = useRouter()
  const isMobile = useMobile()
  const { t, language, setLanguage } = useTranslation()
  const { user, isAuthenticated } = useAuth()
  const { location, requestLocation } = useLocation()

  // Load user preferences
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode")
    if (storedDarkMode) {
      setDarkMode(storedDarkMode === "true")
    }

    const storedFontSize = localStorage.getItem("fontSize")
    if (storedFontSize) {
      setFontSize(Number.parseFloat(storedFontSize))
    }
  }, [])

  // Request location when page loads
  useEffect(() => {
    if (isAuthenticated && !location) {
      requestLocation()
    }
  }, [isAuthenticated, location, requestLocation])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    localStorage.setItem("darkMode", String(!darkMode))
  }

  const handleEmergencyCall = () => {
    setShowEmergencyCall(true)
  }

  if (!isAuthenticated) {
    // Redirect to login page
    router.push("/login")
    return null
  }

  return (
    <main
      className={cn(
        "min-h-screen transition-colors duration-300",
        darkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-b from-amber-50 to-orange-100 text-gray-800",
      )}
    >
      <div className="max-w-4xl mx-auto p-4">
        {/* Header with back button, settings, language, emergency and dark mode toggle */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className={cn("rounded-full", darkMode ? "hover:bg-gray-700" : "hover:bg-amber-200")}
            >
              <ArrowLeft size={24} />
            </Button>
            <h1
              className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent"
              style={{ fontSize: `${1.5 * fontSize}rem` }}
            >
              {t("shopping_mode")}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEmergencyCall}
              className="rounded-full bg-red-500 hover:bg-red-600 text-white"
            >
              <Phone size={24} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className={cn("rounded-full", darkMode ? "hover:bg-gray-700" : "hover:bg-amber-200")}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </Button>
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} darkMode={darkMode} />
          </div>
        </motion.div>

        {/* Emergency Call Modal */}
        {showEmergencyCall && (
          <EmergencyCall
            onClose={() => setShowEmergencyCall(false)}
            darkMode={darkMode}
            fontSize={fontSize}
            emergencyContact={user?.emergencyContact || { name: "Rahul", phone: "+91 98765 43210" }}
          />
        )}

        {/* Avatar */}
        <motion.div
          className="mb-6 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Avatar mood="shopping" darkMode={darkMode} />
        </motion.div>

        {/* Shopping Mode Content */}
        <ShoppingMode darkMode={darkMode} fontSize={fontSize} location={location} />
      </div>
    </main>
  )
}


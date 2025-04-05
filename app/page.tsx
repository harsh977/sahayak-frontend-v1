"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Moon, Sun, Settings, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import WelcomeAnimation from "@/components/welcome-animation"
import ModeCard from "@/components/mode-card"
import Avatar from "@/components/avatar"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import LanguageSelector from "@/components/language-selector"
import EmergencyCall from "@/components/emergency-call"
import { useTranslation } from "@/hooks/use-translation"
import { useAuth } from "@/hooks/use-auth"
import { useLocation } from "@/hooks/use-location"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(1)
  const [contrast, setContrast] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [showEmergencyCall, setShowEmergencyCall] = useState(false)
  const [avatarMood, setAvatarMood] = useState<"neutral" | "happy" | "thinking">("happy")

  const router = useRouter()
  const isMobile = useMobile()
  const { t, language, setLanguage } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()
  const { location, requestLocation } = useLocation()

  // Simulate loading time for welcome animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setAvatarMood("happy")
    }, 3000)
    return () => clearTimeout(timer)
  }, [t])

  // Request location when app loads
  useEffect(() => {
    if (isAuthenticated && !location) {
      requestLocation()
    }
  }, [isAuthenticated, location, requestLocation])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real app, we would store this preference
    localStorage.setItem("darkMode", String(!darkMode))
  }

  const handleEmergencyCall = () => {
    setShowEmergencyCall(true)
  }

  if (isLoading) {
    return <WelcomeAnimation />
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
        {/* Header with settings, language, emergency and dark mode toggle */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <h1
              className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"
              style={{ fontSize: `${1.5 * fontSize}rem` }}
            >
              {t("app_name")}
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
              onClick={() => setShowSettings(!showSettings)}
              className={cn("rounded-full", darkMode ? "hover:bg-gray-700" : "hover:bg-amber-200")}
            >
              <Settings size={24} />
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

        {/* Settings panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn("mb-6 p-4 rounded-xl shadow-lg", darkMode ? "bg-gray-800" : "bg-white")}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ fontSize: `${1.25 * fontSize}rem` }}>
              {t("settings")}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span style={{ fontSize: `${1 * fontSize}rem` }}>{t("dark_mode")}</span>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ fontSize: `${1 * fontSize}rem` }}>{t("text_size")}</span>
                  <span style={{ fontSize: `${1 * fontSize}rem` }}>{Math.round(fontSize * 100)}%</span>
                </div>
                <Slider
                  value={[fontSize]}
                  min={0.8}
                  max={1.5}
                  step={0.1}
                  onValueChange={(value) => setFontSize(value[0])}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ fontSize: `${1 * fontSize}rem` }}>{t("contrast")}</span>
                  <span style={{ fontSize: `${1 * fontSize}rem` }}>{Math.round(contrast * 100)}%</span>
                </div>
                <Slider
                  value={[contrast]}
                  min={0.8}
                  max={1.2}
                  step={0.1}
                  onValueChange={(value) => setContrast(value[0])}
                />
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={logout}>
                  {t("logout")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Emergency Call Modal */}
        {showEmergencyCall && (
          <EmergencyCall
            onClose={() => setShowEmergencyCall(false)}
            darkMode={darkMode}
            fontSize={fontSize}
            emergencyContact={user?.emergencyContact || { name: "Rahul", phone: "+91 98765 43210" }}
          />
        )}

        {/* Avatar and welcome message */}
        <motion.div
          className="mb-6 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Avatar mood={avatarMood} darkMode={darkMode} />

          <div className="w-full mt-4 text-center">
            <motion.p
              className={cn("text-xl font-medium", darkMode ? "text-gray-200" : "text-gray-700")}
              style={{ fontSize: `${1.2 * fontSize}rem` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t("welcome_message")}
            </motion.p>
          </div>
        </motion.div>

        {/* Mode selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Link href="/religious" style={{ textDecoration: "none" }}>
            <ModeCard
              title={t("religious_mode")}
              description={t("religious_description")}
              icon="🛕"
              color="from-orange-400 to-red-500"
              darkMode={darkMode}
              fontSize={fontSize}
              onClick={() => {}}
            />
          </Link>

          <Link href="/wellness" style={{ textDecoration: "none" }}>
            <ModeCard
              title={t("wellness_mode")}
              description={t("wellness_description")}
              icon="💊"
              color="from-green-400 to-teal-500"
              darkMode={darkMode}
              fontSize={fontSize}
              onClick={() => {}}
            />
          </Link>

          <Link href="/shopping" style={{ textDecoration: "none" }}>
            <ModeCard
              title={t("shopping_mode")}
              description={t("shopping_description")}
              icon="🛒"
              color="from-blue-400 to-indigo-500"
              darkMode={darkMode}
              fontSize={fontSize}
              onClick={() => {}}
            />
          </Link>

          <Link href="/schemes" style={{ textDecoration: "none" }}>
            <ModeCard
              title={t("scheme_mode")}
              description={t("scheme_description")}
              icon="📜"
              color="from-purple-400 to-pink-500"
              darkMode={darkMode}
              fontSize={fontSize}
              onClick={() => {}}
            />
          </Link>
        </motion.div>
      </div>
    </main>
  )
}


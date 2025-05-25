"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

interface LanguageSelectorProps {
  language: "en" | "ja"
  onLanguageChange: (language: "en" | "ja") => void
}

export default function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  return (
    <Select value={language} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-32">
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ja">日本語</SelectItem>
      </SelectContent>
    </Select>
  )
}

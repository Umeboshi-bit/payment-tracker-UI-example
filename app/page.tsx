"use client"

import { useState } from "react"
import { Calendar, Table, Plus, Trash2, BarChart3, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Dashboard from "./components/dashboard"
import CalendarView from "./components/calendar-view"
import TableView from "./components/table-view"
import AddPayment from "./components/add-payment"
import EditPayment from "./components/edit-payment"
import TrashView from "./components/trash-view"
import InvoiceFileUploader from "./components/invoice-file-uploader"
import LanguageSelector from "./components/language-selector"

type View = "dashboard" | "calendar" | "table" | "add" | "edit" | "trash"
type Language = "en" | "ja"

const translations = {
  en: {
    title: "Payment Schedule Tracker",
    dashboard: "Dashboard",
    calendar: "Calendar",
    table: "Table View",
    addPayment: "Add Payment",
    trash: "Trash",
    uploadInvoice: "Upload Invoice",
  },
  ja: {
    title: "支払いスケジュール管理",
    dashboard: "ダッシュボード",
    calendar: "カレンダー",
    table: "テーブル表示",
    addPayment: "支払い追加",
    trash: "ゴミ箱",
    uploadInvoice: "請求書アップロード",
  },
}

export default function PaymentTracker() {
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [language, setLanguage] = useState<Language>("en")
  const [editingPayment, setEditingPayment] = useState<number | null>(null)
  const [showUploader, setShowUploader] = useState(false)

  const t = translations[language]

  const handleEditPayment = (id: number) => {
    setEditingPayment(id)
    setCurrentView("edit")
  }

  const handleFileUploaded = (filePath: string) => {
    console.log("File uploaded:", filePath)
    setShowUploader(false)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard language={language} onEditPayment={handleEditPayment} />
      case "calendar":
        return <CalendarView language={language} onEditPayment={handleEditPayment} />
      case "table":
        return <TableView language={language} onEditPayment={handleEditPayment} />
      case "add":
        return <AddPayment language={language} onBack={() => setCurrentView("dashboard")} />
      case "edit":
        return <EditPayment language={language} paymentId={editingPayment} onBack={() => setCurrentView("dashboard")} />
      case "trash":
        return <TrashView language={language} />
      default:
        return <Dashboard language={language} onEditPayment={handleEditPayment} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploader(true)}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {t.uploadInvoice}
            </Button>
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant={currentView === "dashboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("dashboard")}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {t.dashboard}
          </Button>
          <Button
            variant={currentView === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("calendar")}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {t.calendar}
          </Button>
          <Button
            variant={currentView === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("table")}
            className="flex items-center gap-2"
          >
            <Table className="w-4 h-4" />
            {t.table}
          </Button>
          <Button
            variant={currentView === "add" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("add")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t.addPayment}
          </Button>
          <Button
            variant={currentView === "trash" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("trash")}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {t.trash}
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">{renderCurrentView()}</main>

      {/* Invoice Uploader Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <InvoiceFileUploader
              language={language}
              onFileUploaded={handleFileUploaded}
              onClose={() => setShowUploader(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

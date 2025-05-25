"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Edit, FileText, Eye, Calculator } from "lucide-react"

const translations = {
  en: {
    calendarView: "Calendar View",
    today: "Today",
    edit: "Edit",
    noPayments: "No payments scheduled",
    paymentsFor: "Payments for",
    dailyTotal: "Daily Total",
    viewFile: "View File",
    noFile: "No file attached",
    amount: "Amount",
    method: "Method",
    status: "Status",
    notes: "Notes",
    close: "Close",
    overdue: "Overdue",
    pending: "Pending",
    paid: "Paid",
    upcoming: "Upcoming",
    bankTransfer: "Bank Transfer",
    creditCard: "Credit Card",
    check: "Check",
    cash: "Cash",
    other: "Other",
    deferred: "Deferred",
    deferredPayments: "Deferred Payments",
    originalDue: "Originally Due",
    plannedFor: "Planned For",
    deferredReason: "Reason",
    reschedule: "Reschedule",
    markAsPending: "Mark as Pending",
  },
  ja: {
    calendarView: "カレンダー表示",
    today: "今日",
    edit: "編集",
    noPayments: "支払い予定なし",
    paymentsFor: "支払い予定:",
    dailyTotal: "日次合計",
    viewFile: "ファイル表示",
    noFile: "ファイルなし",
    amount: "金額",
    method: "方法",
    status: "ステータス",
    notes: "備考",
    close: "閉じる",
    overdue: "期限切れ",
    pending: "保留中",
    paid: "支払済み",
    upcoming: "予定",
    bankTransfer: "銀行振込",
    creditCard: "クレジットカード",
    check: "小切手",
    cash: "現金",
    other: "その他",
    deferred: "繰延",
    deferredPayments: "繰延支払",
    originalDue: "当初期日",
    plannedFor: "計画",
    deferredReason: "理由",
    reschedule: "スケジュール変更",
    markAsPending: "保留中としてマーク",
  },
}

interface CalendarViewProps {
  language: "en" | "ja"
  onEditPayment: (id: number) => void
}

// Enhanced mock calendar data with file attachments
const mockPayments = [
  {
    id: 1,
    payeeName: "Tokyo Electric Power",
    amount: 15000,
    date: "2024-01-15",
    status: "upcoming" as const,
    paymentMethod: "bank-transfer" as const,
    notes: "Monthly electricity bill",
    documentUrl: "/uploads/tokyo-electric-invoice.pdf",
    documentName: "January_Electric_Bill.pdf",
  },
  {
    id: 2,
    payeeName: "NTT Communications",
    amount: 8500,
    date: "2024-01-15", // Same date as above to show multiple payments
    status: "pending" as const,
    paymentMethod: "credit-card" as const,
    notes: "Internet service",
    documentUrl: "/uploads/ntt-invoice.pdf",
    documentName: "NTT_Internet_Bill.pdf",
  },
  {
    id: 3,
    payeeName: "Office Rent",
    amount: 120000,
    date: "2024-01-20",
    status: "upcoming" as const,
    paymentMethod: "bank-transfer" as const,
    notes: "Monthly office rent",
    documentUrl: "/uploads/rent-contract.pdf",
    documentName: "Office_Rent_Contract.pdf",
  },
  {
    id: 4,
    payeeName: "Software License",
    amount: 12000,
    date: "2024-01-18",
    status: "upcoming" as const,
    paymentMethod: "credit-card" as const,
    notes: "Adobe Creative Suite",
    documentUrl: null, // No file attached
    documentName: null,
  },
  {
    id: 5,
    payeeName: "Marketing Campaign",
    amount: 45000,
    date: "2024-01-10", // Original due date
    status: "deferred" as const,
    paymentMethod: "bank-transfer" as const,
    notes: "Deferred due to budget review - will pay after Q1 results",
    documentUrl: "/uploads/marketing-invoice.pdf",
    documentName: "Marketing_Campaign_Invoice.pdf",
    originalDueDate: "2024-01-10",
    deferredReason: "Budget review pending",
    plannedPaymentDate: "2024-04-15",
  },
  {
    id: 6,
    payeeName: "Equipment Purchase",
    amount: 85000,
    date: "2024-01-05", // Original due date
    status: "deferred" as const,
    paymentMethod: "bank-transfer" as const,
    notes: "Equipment delivery delayed, payment deferred accordingly",
    documentUrl: null,
    documentName: null,
    originalDueDate: "2024-01-05",
    deferredReason: "Equipment delivery delayed",
    plannedPaymentDate: "2024-03-01",
  },
]

export default function CalendarView({ language, onEditPayment }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const t = translations[language]

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "destructive"
      case "pending":
        return "secondary"
      case "paid":
        return "default"
      case "upcoming":
        return "outline"
      case "deferred":
        return "warning"
      default:
        return "outline"
    }
  }

  const getMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      "bank-transfer": t.bankTransfer,
      "credit-card": t.creditCard,
      check: t.check,
      cash: t.cash,
      other: t.other,
    }
    return methodMap[method] || method
  }

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    // Get first day of the month and last day
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getPaymentsForDate = (day: number) => {
    if (!day) return []
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return mockPayments.filter((payment) => payment.date === dateStr && payment.status !== "deferred")
  }

  // Add function to get deferred payments
  const getDeferredPayments = () => {
    return mockPayments.filter((payment) => payment.status === "deferred")
  }

  const getPaymentsForSelectedDate = () => {
    if (!selectedDate) return []
    return mockPayments.filter((payment) => payment.date === selectedDate)
  }

  const calculateDailyTotal = (payments: typeof mockPayments) => {
    return payments.reduce((total, payment) => total + payment.amount, 0)
  }

  const handleDateClick = (day: number) => {
    if (!day) return
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const payments = getPaymentsForDate(day)

    if (payments.length > 0) {
      setSelectedDate(dateStr)
      setShowPaymentModal(true)
    }
  }

  const handleViewFile = (documentUrl: string, documentName: string) => {
    console.log("Opening file:", documentUrl, documentName)

    const newWindow = window.open("", "_blank")
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>${documentName}</title></head>
          <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f5f5f5;">
            <div style="text-align:center; padding:20px;">
              <h2>📄 ${documentName}</h2>
              <p>File would be displayed here</p>
              <p style="color:#666;">URL: ${documentUrl}</p>
              <button onclick="window.close()" style="padding:10px 20px; margin-top:20px;">Close</button>
            </div>
          </body>
        </html>
      `)
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames =
    language === "ja"
      ? ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]

  const dayNames =
    language === "ja" ? ["日", "月", "火", "水", "木", "金", "土"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return language === "ja"
      ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
      : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const selectedDatePayments = getPaymentsForSelectedDate()
  const dailyTotal = calculateDailyTotal(selectedDatePayments)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t.calendarView}</h2>
        <p className="text-muted-foreground">
          {language === "ja"
            ? "カレンダー形式で支払い予定を確認（日付をクリックして詳細表示）"
            : "View your payment schedule in calendar format (click dates to view details)"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                {t.today}
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground bg-gray-50 rounded">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 auto-rows-fr gap-1 min-h-[400px]">
            {generateCalendarDays(currentDate).map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[80px] border border-gray-100 rounded bg-gray-50/30"
                  ></div>
                )
              }

              const payments = getPaymentsForDate(day)
              const hasPayments = payments.length > 0
              const dayTotal = calculateDailyTotal(payments)
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear()

              return (
                <div
                  key={`day-${day}`}
                  className={`min-h-[80px] border rounded p-2 transition-colors flex flex-col ${
                    isToday ? "bg-blue-50 border-blue-200" : "border-gray-200 bg-white"
                  } ${hasPayments ? "cursor-pointer hover:bg-gray-50 hover:border-gray-300" : ""}`}
                  onClick={() => hasPayments && handleDateClick(day)}
                >
                  <div className="text-sm font-medium mb-1 flex-shrink-0">{day}</div>
                  <div className="flex-1 overflow-hidden space-y-1">
                    {payments.slice(0, 2).map((payment) => (
                      <div key={payment.id} className="text-xs p-1 rounded bg-blue-100 border border-blue-200">
                        <div className="font-medium truncate text-blue-800 leading-tight">{payment.payeeName}</div>
                        <div className="text-blue-600 text-[10px] leading-tight">{formatCurrency(payment.amount)}</div>
                      </div>
                    ))}
                    {payments.length > 2 && (
                      <div className="text-xs p-1 rounded bg-gray-100 text-center text-gray-600">
                        +{payments.length - 2} {language === "ja" ? "件" : "more"}
                      </div>
                    )}
                    {hasPayments && (
                      <div className="text-xs p-1 rounded bg-green-100 border border-green-200 text-center">
                        <div className="font-bold text-green-800 text-[10px] leading-tight">
                          {language === "ja" ? "合計: " : "Total: "}
                          {formatCurrency(dayTotal)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Deferred Payments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            {t.deferredPayments}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {language === "ja" ? "会社の決定により延期された支払い" : "Payments postponed by company decision"}
          </p>
        </CardHeader>
        <CardContent>
          {getDeferredPayments().length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === "ja" ? "延期された支払いはありません" : "No deferred payments"}
            </div>
          ) : (
            <div className="space-y-3">
              {getDeferredPayments().map((payment) => (
                <div key={payment.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{payment.payeeName}</h3>
                        <Badge variant="warning">{t.deferred}</Badge>
                      </div>
                      <div className="text-2xl font-bold text-orange-600 mb-2">{formatCurrency(payment.amount)}</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{t.originalDue}:</span> {payment.originalDueDate}
                        </div>
                        <div>
                          <span className="font-medium">{t.plannedFor}:</span> {payment.plannedPaymentDate}
                        </div>
                        <div>
                          <span className="font-medium">{t.method}:</span> {getMethodLabel(payment.paymentMethod)}
                        </div>
                      </div>
                      {payment.deferredReason && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">{t.deferredReason}:</span> {payment.deferredReason}
                        </div>
                      )}
                      {payment.notes && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">{t.notes}:</span> {payment.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => onEditPayment(payment.id)}>
                        <Edit className="w-4 h-4 mr-1" />
                        {t.edit}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log("Rescheduling payment:", payment.id)
                          // This would open a reschedule dialog
                        }}
                      >
                        {t.reschedule}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          console.log("Marking as pending:", payment.id)
                          // This would change status back to pending
                        }}
                      >
                        {t.markAsPending}
                      </Button>
                    </div>
                  </div>

                  {/* File attachment section */}
                  {payment.documentUrl && payment.documentName && (
                    <div className="mt-3 pt-3 border-t border-orange-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600">{payment.documentName}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewFile(payment.documentUrl!, payment.documentName!)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          {t.viewFile}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {t.paymentsFor} {selectedDate && formatSelectedDate(selectedDate)}
              </span>
              <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg border border-green-200">
                <Calculator className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {t.dailyTotal}: {formatCurrency(dailyTotal)}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {selectedDatePayments.map((payment) => (
              <Card key={payment.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{payment.payeeName}</h3>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(payment.status)}>
                        {t[payment.status as keyof typeof t] || payment.status}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => onEditPayment(payment.id)}>
                        <Edit className="w-4 h-4 mr-1" />
                        {t.edit}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">{t.method}:</span> {getMethodLabel(payment.paymentMethod)}
                    </div>
                    <div>
                      <span className="font-medium">{t.status}:</span>{" "}
                      {t[payment.status as keyof typeof t] || payment.status}
                    </div>
                  </div>

                  {payment.notes && (
                    <div className="mt-3">
                      <span className="font-medium">{t.notes}:</span> {payment.notes}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">📎 {language === "ja" ? "添付ファイル" : "Attached File"}:</span>
                      {payment.documentUrl && payment.documentName ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{payment.documentName}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFile(payment.documentUrl!, payment.documentName!)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            {t.viewFile}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">{t.noFile}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              {t.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

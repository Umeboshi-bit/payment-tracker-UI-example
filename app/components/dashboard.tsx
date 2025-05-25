"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, Clock, AlertTriangle, Edit } from "lucide-react"

const translations = {
  en: {
    overview: "Financial Overview",
    weeklyTotal: "Weekly Total",
    monthlyTotal: "Monthly Total",
    pendingPayments: "Pending Payments",
    upcomingPayments: "Upcoming Payments",
    viewAll: "View All",
    edit: "Edit",
    today: "Today",
    thisWeek: "This Week",
    overdue: "Overdue",
    pending: "Pending",
    paid: "Paid",
    upcoming: "Upcoming",
    deferred: "Deferred",
    deferredPayments: "Deferred Payments",
    deferredCount: "Deferred Count",
  },
  ja: {
    overview: "財務概要",
    weeklyTotal: "週間合計",
    monthlyTotal: "月間合計",
    pendingPayments: "保留中の支払い",
    upcomingPayments: "今後の支払い",
    viewAll: "すべて表示",
    edit: "編集",
    today: "今日",
    thisWeek: "今週",
    overdue: "期限切れ",
    pending: "保留中",
    paid: "支払済み",
    upcoming: "予定",
    deferred: "繰延",
    deferredPayments: "繰延支払",
    deferredCount: "繰延数",
  },
}

interface DashboardProps {
  language: "en" | "ja"
  onEditPayment: (id: number) => void
}

// Mock data
const mockData = {
  weeklyTotal: 125000,
  monthlyTotal: 450000,
  pendingCount: 3,
  upcomingPayments: [
    {
      id: 1,
      payeeName: "Tokyo Electric Power",
      amount: 15000,
      dueDate: "2024-01-15",
      status: "upcoming" as const,
      paymentMethod: "bank-transfer" as const,
    },
    {
      id: 2,
      payeeName: "NTT Communications",
      amount: 8500,
      dueDate: "2024-01-18",
      status: "pending" as const,
      paymentMethod: "credit-card" as const,
    },
    {
      id: 3,
      payeeName: "Office Rent",
      amount: 120000,
      dueDate: "2024-01-20",
      status: "upcoming" as const,
      paymentMethod: "bank-transfer" as const,
    },
  ],
  deferredCount: 2,
  deferredPayments: [
    {
      id: 5,
      payeeName: "Marketing Campaign",
      amount: 45000,
      originalDueDate: "2024-01-10",
      plannedPaymentDate: "2024-04-15",
      status: "deferred" as const,
      paymentMethod: "bank-transfer" as const,
      deferredReason: "Budget review pending",
    },
    {
      id: 6,
      payeeName: "Equipment Purchase",
      amount: 85000,
      originalDueDate: "2024-01-05",
      plannedPaymentDate: "2024-03-01",
      status: "deferred" as const,
      paymentMethod: "bank-transfer" as const,
      deferredReason: "Equipment delivery delayed",
    },
  ],
}

export default function Dashboard({ language, onEditPayment }: DashboardProps) {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t.overview}</h2>
        <p className="text-muted-foreground">
          {language === "ja" ? "財務状況の概要です" : "Overview of your financial status"}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.weeklyTotal}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.weeklyTotal)}</div>
            <p className="text-xs text-muted-foreground">{language === "ja" ? "+12% 先週比" : "+12% from last week"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.monthlyTotal}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.monthlyTotal)}</div>
            <p className="text-xs text-muted-foreground">{language === "ja" ? "+8% 先月比" : "+8% from last month"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.pendingPayments}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.pendingCount}</div>
            <p className="text-xs text-muted-foreground">{language === "ja" ? "要確認" : "Require attention"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.upcomingPayments}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.upcomingPayments.length}</div>
            <p className="text-xs text-muted-foreground">{language === "ja" ? "今後7日間" : "Next 7 days"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.deferredPayments}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockData.deferredCount}</div>
            <p className="text-xs text-muted-foreground">{language === "ja" ? "延期中" : "Postponed"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payments */}
      <Card>
        <CardHeader>
          <CardTitle>{t.upcomingPayments}</CardTitle>
          <CardDescription>{language === "ja" ? "近日中に支払い予定の項目" : "Payments due soon"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.upcomingPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{payment.payeeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "ja" ? "期日: " : "Due: "}
                        {payment.dueDate}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusColor(payment.status)}>
                    {t[payment.status as keyof typeof t] || payment.status}
                  </Badge>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground">{payment.paymentMethod}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onEditPayment(payment.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              {t.viewAll}
            </Button>
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
          <CardDescription>
            {language === "ja" ? "会社の決定により延期された支払い" : "Payments postponed by company decision"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.deferredPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{payment.payeeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "ja" ? "元の期日: " : "Originally due: "}
                        {payment.originalDueDate}
                        {" → "}
                        {language === "ja" ? "予定: " : "Planned: "}
                        {payment.plannedPaymentDate}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">{payment.deferredReason}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="warning">{t.deferred}</Badge>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground">{payment.paymentMethod}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onEditPayment(payment.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

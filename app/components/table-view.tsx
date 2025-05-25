"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Search, Filter } from "lucide-react"

const translations = {
  en: {
    tableView: "Table View",
    search: "Search payments...",
    filterStatus: "Filter by status",
    all: "All",
    payee: "Payee",
    amount: "Amount",
    dueDate: "Due Date",
    status: "Status",
    method: "Method",
    actions: "Actions",
    edit: "Edit",
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
  },
  ja: {
    tableView: "テーブル表示",
    search: "支払いを検索...",
    filterStatus: "ステータスで絞り込み",
    all: "すべて",
    payee: "支払先",
    amount: "金額",
    dueDate: "期日",
    status: "ステータス",
    method: "方法",
    actions: "操作",
    edit: "編集",
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
  },
}

interface TableViewProps {
  language: "en" | "ja"
  onEditPayment: (id: number) => void
}

// Mock table data
const mockPayments = [
  {
    id: 1,
    payeeName: "Tokyo Electric Power",
    amount: 15000,
    dueDate: "2024-01-15",
    status: "upcoming" as const,
    paymentMethod: "bank-transfer" as const,
    notes: "Monthly electricity bill",
  },
  {
    id: 2,
    payeeName: "NTT Communications",
    amount: 8500,
    dueDate: "2024-01-18",
    status: "pending" as const,
    paymentMethod: "credit-card" as const,
    notes: "Internet service",
  },
  {
    id: 3,
    payeeName: "Office Rent",
    amount: 120000,
    dueDate: "2024-01-20",
    status: "upcoming" as const,
    paymentMethod: "bank-transfer" as const,
    notes: "Monthly office rent",
  },
  {
    id: 4,
    payeeName: "Insurance Premium",
    amount: 25000,
    dueDate: "2024-01-10",
    status: "paid" as const,
    paymentMethod: "bank-transfer" as const,
    notes: "Health insurance",
  },
  {
    id: 5,
    payeeName: "Software License",
    amount: 12000,
    dueDate: "2024-01-05",
    status: "overdue" as const,
    paymentMethod: "credit-card" as const,
    notes: "Adobe Creative Suite",
  },
  {
    id: 5,
    payeeName: "Marketing Campaign",
    amount: 45000,
    dueDate: "2024-01-10",
    status: "deferred" as const,
    paymentMethod: "bank-transfer" as const,
    notes: "Deferred due to budget review - will pay after Q1 results",
  },
  {
    id: 6,
    payeeName: "Equipment Purchase",
    amount: 85000,
    dueDate: "2024-01-05",
    status: "deferred" as const,
    paymentMethod: "bank-transfer" as const,
    notes: "Equipment delivery delayed, payment deferred accordingly",
  },
]

export default function TableView({ language, onEditPayment }: TableViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
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

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.payeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t.tableView}</h2>
        <p className="text-muted-foreground">
          {language === "ja" ? "すべての支払いをテーブル形式で管理" : "Manage all your payments in table format"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t.filterStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="upcoming">{t.upcoming}</SelectItem>
                <SelectItem value="pending">{t.pending}</SelectItem>
                <SelectItem value="paid">{t.paid}</SelectItem>
                <SelectItem value="overdue">{t.overdue}</SelectItem>
                <SelectItem value="deferred">{t.deferred}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.payee}</TableHead>
                <TableHead>{t.amount}</TableHead>
                <TableHead>{t.dueDate}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead>{t.method}</TableHead>
                <TableHead>{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.payeeName}</div>
                      {payment.notes && <div className="text-sm text-muted-foreground">{payment.notes}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(payment.status)}>
                      {t[payment.status as keyof typeof t] || payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{getMethodLabel(payment.paymentMethod)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => onEditPayment(payment.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      {t.edit}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {language === "ja" ? "該当する支払いが見つかりません" : "No payments found"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

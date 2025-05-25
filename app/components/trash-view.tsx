"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RotateCcw, Trash2 } from "lucide-react"

const translations = {
  en: {
    trashView: "Deleted Payments",
    restore: "Restore",
    permanentDelete: "Delete Permanently",
    payee: "Payee",
    amount: "Amount",
    deletedDate: "Deleted Date",
    actions: "Actions",
    noDeletedPayments: "No deleted payments",
    confirmRestore: "Are you sure you want to restore this payment?",
    confirmDelete: "Are you sure you want to permanently delete this payment?",
  },
  ja: {
    trashView: "削除済み支払い",
    restore: "復元",
    permanentDelete: "完全削除",
    payee: "支払先",
    amount: "金額",
    deletedDate: "削除日",
    actions: "操作",
    noDeletedPayments: "削除済み支払いはありません",
    confirmRestore: "この支払いを復元しますか？",
    confirmDelete: "この支払いを完全に削除しますか？",
  },
}

interface TrashViewProps {
  language: "en" | "ja"
}

// Mock deleted payments data
const mockDeletedPayments = [
  {
    id: 6,
    payeeName: "Old Subscription",
    amount: 5000,
    deletedAt: "2024-01-10",
    originalDueDate: "2024-01-08",
  },
  {
    id: 7,
    payeeName: "Cancelled Service",
    amount: 12000,
    deletedAt: "2024-01-08",
    originalDueDate: "2024-01-15",
  },
]

export default function TrashView({ language }: TrashViewProps) {
  const t = translations[language]

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleRestore = (id: number) => {
    if (confirm(t.confirmRestore)) {
      console.log("Restoring payment:", id)
      // Here you would call your API to restore the payment
    }
  }

  const handlePermanentDelete = (id: number) => {
    if (confirm(t.confirmDelete)) {
      console.log("Permanently deleting payment:", id)
      // Here you would call your API to permanently delete the payment
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t.trashView}</h2>
        <p className="text-muted-foreground">
          {language === "ja" ? "削除された支払いを管理します" : "Manage deleted payments"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.trashView}</CardTitle>
        </CardHeader>
        <CardContent>
          {mockDeletedPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trash2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t.noDeletedPayments}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.payee}</TableHead>
                  <TableHead>{t.amount}</TableHead>
                  <TableHead>{t.deletedDate}</TableHead>
                  <TableHead>{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDeletedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.payeeName}</div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ja" ? "元の期日: " : "Original due: "}
                          {payment.originalDueDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{payment.deletedAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(payment.id)}
                          className="flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          {t.restore}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handlePermanentDelete(payment.id)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t.permanentDelete}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

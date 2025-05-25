"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Trash2, Upload, FileText, Eye } from "lucide-react"

const translations = {
  en: {
    editPayment: "Edit Payment",
    payeeName: "Payee Name",
    amount: "Amount (JPY)",
    dueDate: "Due Date",
    paymentType: "Payment Type",
    paymentMethod: "Payment Method",
    status: "Status",
    notes: "Notes",
    save: "Save Changes",
    delete: "Delete Payment",
    cancel: "Cancel",
    oneTime: "One-time",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    bankTransfer: "Bank Transfer",
    creditCard: "Credit Card",
    check: "Check",
    cash: "Cash",
    other: "Other",
    upcoming: "Upcoming",
    pending: "Pending",
    paid: "Paid",
    overdue: "Overdue",
    deferred: "Deferred",
  },
  ja: {
    editPayment: "支払いを編集",
    payeeName: "支払先名",
    amount: "金額 (円)",
    dueDate: "期日",
    paymentType: "支払いタイプ",
    paymentMethod: "支払い方法",
    status: "ステータス",
    notes: "備考",
    save: "変更を保存",
    delete: "支払いを削除",
    cancel: "キャンセル",
    oneTime: "一回限り",
    daily: "毎日",
    weekly: "毎週",
    monthly: "毎月",
    bankTransfer: "銀行振込",
    creditCard: "クレジットカード",
    check: "小切手",
    cash: "現金",
    other: "その他",
    upcoming: "予定",
    pending: "保留中",
    paid: "支払済み",
    overdue: "期限切れ",
    deferred: "繰延",
  },
}

interface EditPaymentProps {
  language: "en" | "ja"
  paymentId: number | null
  onBack: () => void
}

// Mock data for the payment being edited
const mockPayment = {
  id: 1,
  payeeName: "Tokyo Electric Power",
  amount: "15000",
  dueDate: "2024-01-15",
  paymentType: "monthly",
  paymentMethod: "bank-transfer",
  status: "upcoming",
  notes: "Monthly electricity bill",
}

export default function EditPayment({ language, paymentId, onBack }: EditPaymentProps) {
  const [formData, setFormData] = useState({
    payeeName: "",
    amount: "",
    dueDate: "",
    paymentType: "",
    paymentMethod: "",
    status: "",
    notes: "",
  })

  const t = translations[language]

  useEffect(() => {
    // In a real app, you would fetch the payment data by ID
    if (paymentId) {
      setFormData(mockPayment)
    }
  }, [paymentId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated data to your API
    console.log("Updating payment:", formData)
    onBack()
  }

  const handleDelete = () => {
    // Here you would typically send a delete request to your API
    console.log("Deleting payment:", paymentId)
    onBack()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!paymentId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{language === "ja" ? "支払いが見つかりません" : "Payment not found"}</p>
        <Button onClick={onBack} className="mt-4">
          {t.cancel}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.cancel}
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t.editPayment}</h2>
          <p className="text-muted-foreground">
            {language === "ja" ? "支払い情報を編集します" : "Edit payment information"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.editPayment}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="payeeName">{t.payeeName}</Label>
                <Input
                  id="payeeName"
                  value={formData.payeeName}
                  onChange={(e) => handleInputChange("payeeName", e.target.value)}
                  placeholder={language === "ja" ? "支払先を入力" : "Enter payee name"}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t.amount}</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">{t.dueDate}</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentType">{t.paymentType}</Label>
                <Select value={formData.paymentType} onValueChange={(value) => handleInputChange("paymentType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "ja" ? "タイプを選択" : "Select type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">{t.oneTime}</SelectItem>
                    <SelectItem value="daily">{t.daily}</SelectItem>
                    <SelectItem value="weekly">{t.weekly}</SelectItem>
                    <SelectItem value="monthly">{t.monthly}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">{t.paymentMethod}</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange("paymentMethod", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "ja" ? "方法を選択" : "Select method"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">{t.bankTransfer}</SelectItem>
                    <SelectItem value="credit-card">{t.creditCard}</SelectItem>
                    <SelectItem value="check">{t.check}</SelectItem>
                    <SelectItem value="cash">{t.cash}</SelectItem>
                    <SelectItem value="other">{t.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{t.status}</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">{t.upcoming}</SelectItem>
                    <SelectItem value="pending">{t.pending}</SelectItem>
                    <SelectItem value="paid">{t.paid}</SelectItem>
                    <SelectItem value="overdue">{t.overdue}</SelectItem>
                    <SelectItem value="deferred">{t.deferred}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t.notes}</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder={language === "ja" ? "備考を入力（任意）" : "Enter notes (optional)"}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">{language === "ja" ? "請求書ファイル" : "Invoice Document"}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    {language === "ja"
                      ? "ファイルをドラッグ&ドロップまたはクリックして選択"
                      : "Drag & drop or click to select file"}
                  </p>
                  <Input
                    id="document"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        console.log("Selected file:", file.name)
                        // In real app, this would upload the file
                      }
                    }}
                  />
                  <Label htmlFor="document">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      {language === "ja" ? "ファイル選択" : "Select File"}
                    </Button>
                  </Label>
                </div>
              </div>

              {/* Show current file if exists */}
              <div className="text-sm text-gray-600">
                {language === "ja" ? "現在のファイル: " : "Current file: "}
                <span className="font-medium">January_Electric_Bill.pdf</span>
                <Button variant="ghost" size="sm" className="ml-2">
                  <Eye className="w-4 h-4 mr-1" />
                  {language === "ja" ? "表示" : "View"}
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {t.save}
              </Button>
              <Button type="button" variant="outline" onClick={onBack}>
                {t.cancel}
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                {t.delete}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

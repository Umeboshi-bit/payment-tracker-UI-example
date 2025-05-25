"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, File, X, CheckCircle } from "lucide-react"

const translations = {
  en: {
    uploadInvoice: "Upload Invoice",
    selectFile: "Select File",
    upload: "Upload",
    uploading: "Uploading...",
    success: "Upload Successful",
    error: "Upload Failed",
    close: "Close",
    supportedFormats: "Supported formats: PDF, JPG, PNG, DOC, DOCX",
    maxSize: "Maximum file size: 5MB",
    dragDrop: "Drag and drop your file here, or click to select",
  },
  ja: {
    uploadInvoice: "請求書アップロード",
    selectFile: "ファイル選択",
    upload: "アップロード",
    uploading: "アップロード中...",
    success: "アップロード成功",
    error: "アップロード失敗",
    close: "閉じる",
    supportedFormats: "対応形式: PDF, JPG, PNG, DOC, DOCX",
    maxSize: "最大ファイルサイズ: 5MB",
    dragDrop: "ファイルをここにドラッグ&ドロップするか、クリックして選択",
  },
}

interface InvoiceFileUploaderProps {
  language: "en" | "ja"
  onFileUploaded: (filePath: string) => void
  onClose: () => void
}

export default function InvoiceFileUploader({ language, onFileUploaded, onClose }: InvoiceFileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [dragOver, setDragOver] = useState(false)

  const t = translations[language]

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      alert(language === "ja" ? "サポートされていないファイル形式です" : "Unsupported file format")
      return
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert(language === "ja" ? "ファイルサイズが大きすぎます（最大5MB）" : "File size too large (max 5MB)")
      return
    }

    setFile(selectedFile)
    setUploadStatus("idle")
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadStatus("idle")

    try {
      const formData = new FormData()
      formData.append("invoice", file)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful response
      const mockFilePath = `/uploads/${Date.now()}-${file.name}`

      setUploadStatus("success")
      onFileUploaded(mockFilePath)

      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("error")
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setUploadStatus("idle")
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t.uploadInvoice}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">{t.dragDrop}</p>
            <p className="text-sm text-muted-foreground mb-4">{t.supportedFormats}</p>
            <p className="text-xs text-muted-foreground mb-4">{t.maxSize}</p>

            <Label htmlFor="file-input">
              <Button variant="outline" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {t.selectFile}
              </Button>
            </Label>
            <Input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileInputChange}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <File className="w-8 h-8 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              {uploadStatus === "success" && <CheckCircle className="w-6 h-6 text-green-500" />}
              {uploadStatus === "idle" && (
                <Button variant="ghost" size="sm" onClick={removeFile}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {uploadStatus === "success" && <div className="text-center text-green-600 font-medium">{t.success}</div>}

            {uploadStatus === "error" && <div className="text-center text-red-600 font-medium">{t.error}</div>}

            <div className="flex gap-2">
              <Button onClick={handleUpload} disabled={uploading || uploadStatus === "success"} className="flex-1">
                {uploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    {t.uploading}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {t.upload}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onClose}>
                {t.close}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

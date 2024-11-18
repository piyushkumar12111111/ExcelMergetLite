"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { mergeExcelFiles } from "@/actions/excel"
import { ExcelViewer } from "@/components/excel-viewer"

export function ExcelMerger() {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [mergedData, setMergedData] = useState<any[]>([])
  const [analysis, setAnalysis] = useState("")
  const [base64Data, setBase64Data] = useState("")
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const excelFiles = selectedFiles.filter(file => 
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    )
    
    if (excelFiles.length !== selectedFiles.length) {
      toast({
        title: "Invalid files",
        description: "Please select only Excel files (.xlsx or .xls)",
        variant: "destructive"
      })
      return
    }
    
    setFiles(excelFiles)
  }

  const handleDownload = () => {
    if (!base64Data) return

    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'merged-excel.xlsx'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please select at least 2 Excel files to merge",
        variant: "destructive"
      })
      return
    }

    try {
      setProcessing(true)
      setProgress(10)

      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`file${index}`, file)
      })

      setProgress(30)
      const response = await mergeExcelFiles(formData)
      setProgress(90)

      if (response.success) {
        setBase64Data(response.data || ""     )
        setMergedData(response.mergedData || [])
        setAnalysis(response.analysis || "")
        
        toast({
          title: "Success!",
          description: "Excel files have been merged successfully"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge Excel files. Please try again.",
        variant: "destructive"
      })
    } finally {
      setProcessing(false)
      setProgress(100)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Excel Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <input
              type="file"
              multiple
              accept=".xlsx,.xls"
              className="hidden"
              id="excel-files"
              onChange={handleFileChange}
            />
            <label htmlFor="excel-files">
              <Button variant="outline" className="w-full cursor-pointer" asChild>
                <div>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Excel Files
                </div>
              </Button>
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected files:</p>
              <ul className="text-sm">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          {progress > 0 && (
            <Progress value={progress} className="w-full" />
          )}

          <Button 
            onClick={handleMerge} 
            disabled={processing || files.length < 2}
            className="w-full"
          >
            {processing ? "Processing..." : "Merge Files"}
          </Button>
        </CardContent>
      </Card>

      {mergedData.length > 0 && (
        <ExcelViewer 
          data={mergedData} 
          analysis={analysis}
          onDownload={handleDownload}
        />
      )}
    </div>
  )
} 
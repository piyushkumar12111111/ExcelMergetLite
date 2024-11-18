"use server"

import * as XLSX from "xlsx"
import { analyzeChatGPT } from "@/lib/chatgpt"

export async function mergeExcelFiles(formData: FormData) {
  try {
    const files = []
    for (const [_, value] of formData.entries()) {
      if (value instanceof Blob) {
        files.push(value)
      }
    }

    const workbooks = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        return XLSX.read(buffer, { type: "buffer" })
      })
    )

    let mergedData: Record<string, string | number>[] = []
    workbooks.forEach((workbook) => {
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(sheet)
      const serializedData = data.map(row => {
        const newRow: Record<string, string | number> = {}
        Object.entries(row as Record<string, unknown>).forEach(([key, value]) => {
          newRow[key] = typeof value === 'object' ? JSON.stringify(value) || '' : String(value)
        })
        return newRow
      })
      mergedData = [...mergedData, ...serializedData]
    })

    let analysis = ""
    if (process.env.RAPIDAPI_KEY) {
      try {
        const dataForAnalysis = JSON.stringify(mergedData.slice(0, 50))
        const result = await analyzeChatGPT(dataForAnalysis)
        if (result?.content) {
          analysis = result.content
        }
      } catch (error) {
        console.error("ChatGPT API error:", error)
      }
    }

    const newWorkbook = XLSX.utils.book_new()
    const dataSheet = XLSX.utils.json_to_sheet(mergedData)
    XLSX.utils.book_append_sheet(newWorkbook, dataSheet, "Merged Data")

    if (analysis) {
      const analysisSheet = XLSX.utils.aoa_to_sheet([[analysis]])
      XLSX.utils.book_append_sheet(newWorkbook, analysisSheet, "Analysis")
    }

    const wbout = XLSX.write(newWorkbook, {
      bookType: 'xlsx',
      type: 'binary'
    })

    const buf = Buffer.from(new Uint8Array(wbout.length))
    for (let i = 0; i < wbout.length; i++) {
      buf[i] = wbout.charCodeAt(i) & 0xFF
    }
    const base64 = buf.toString('base64')

    return {
      success: true,
      data: base64,
      mergedData: mergedData,
      analysis: analysis || null
    }
  } catch (error) {
    console.error("Error merging Excel files:", error)
    return {
      success: false,
      error: "Failed to merge Excel files"
    }
  }
} 
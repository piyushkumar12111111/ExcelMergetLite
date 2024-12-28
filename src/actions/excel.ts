"use server"

import * as XLSX from "xlsx"
import { analyzeChatGPT } from "@/lib/chatgpt"

export async function mergeExcelFiles(formData: FormData) {
  try {
    const files = []
    const MAX_TOTAL_SIZE = 10 * 1024 * 1024 // 10MB total limit
    let totalSize = 0

    for (const [_, value] of formData.entries()) {
      if (value instanceof Blob) {
        totalSize += value.size
        if (totalSize > MAX_TOTAL_SIZE) {
          throw new Error("Total file size too large. Please keep total under 10MB.")
        }
        files.push(value)
      }
    }

    // Process files in smaller batches
    const BATCH_SIZE = 2
    const results = []
    
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE)
      const batchWorkbooks = await Promise.all(
        batch.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer())
          return XLSX.read(buffer, { type: "buffer" })
        })
      )
      results.push(...batchWorkbooks)
    }

    const CHUNK_SIZE = 1000 // Adjust based on your needs
    let mergedData: Record<string, string | number>[] = []
    
    for (const workbook of results) {
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(sheet)
      
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE)
        const serializedChunk = chunk.map(row => {
          const newRow: Record<string, string | number> = {}
          Object.entries(row as Record<string, unknown>).forEach(([key, value]) => {
            newRow[key] = typeof value === 'object' ? JSON.stringify(value) || '' : String(value)
          })
          return newRow
        })
        mergedData = [...mergedData, ...serializedChunk]
      }
    }

    let analysis = ""
    if (process.env.RAPIDAPI_KEY) {
      try {
        const dataForAnalysis = JSON.stringify(mergedData.slice(0, 20))
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
      error: error instanceof Error ? error.message : "Failed to merge Excel files"
    }
  }
} 
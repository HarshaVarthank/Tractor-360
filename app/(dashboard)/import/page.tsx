'use client'

import { useState, useEffect } from 'react'
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowRight,
  RefreshCw,
  Loader2,
  FileCheck,
} from 'lucide-react'
import Papa from 'papaparse'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

export default function ImportPage() {
  const [importType, setImportType] = useState('Customer')
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [importing, setImporting] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/import')
      if (res.ok) {
        const json = await res.json()
        setHistory(json)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0]
    if (!uploaded) return
    setFile(uploaded)

    Papa.parse(uploaded, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data)
        setStep(2)
        toast.success(`Successfully parsed ${results.data.length} records`)
      },
      error: (err) => {
        toast.error(`Error parsing file: ${err.message}`)
      },
    })
  }

  const handleExecuteImport = async () => {
    if (parsedData.length === 0) return
    setImporting(true)
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          importType,
          fileName: file?.name || 'import.csv',
          records: parsedData,
        }),
      })

      if (res.ok) {
        const result = await res.json()
        toast.success(
          `Import finished: ${result.importedCount} records added, ${result.duplicateCount} duplicates skipped.`
        )
        setStep(3)
        fetchHistory()
      } else {
        toast.error('Import failed. Please check file format.')
      }
    } catch (e: any) {
      toast.error(`Import failed: ${e.message}`)
    } finally {
      setImporting(false)
    }
  }

  const downloadSampleTemplate = () => {
    let csv = ''
    if (importType === 'Customer') {
      csv = `name,phone,email,address,city,state,pincode,type\nGurdev Singh,9812300099,gurdev@gmail.com,12 GT Road,Ludhiana,Punjab,141001,INDIVIDUAL\nKisan Sahakari Ltd,9823400088,info@kisansahakari.org,45 Market Rd,Pune,Maharashtra,411001,COMPANY`
    } else if (importType === 'SpareParts') {
      csv = `partNumber,partName,category,currentStock,minimumStock,unitPrice,supplier\nPRT-101,Fuel Injector Nozzle Bosch,Engine,25,8,4200,Bosch India\nPRT-102,Hydraulic Return Line Hose,Hydraulic,15,5,1850,Gates India`
    } else {
      csv = `id,name,value\n1,Sample Record,100`
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${importType.toLowerCase()}_sample_template.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
          Data Import & Ingestion Hub
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Bulk import customer records, spare parts catalogs, and legacy ERP Excel/CSV spreadsheets.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between max-w-xl mx-auto text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>1</span>
            <span>Configure & Upload</span>
          </div>
          <div className="w-12 h-px bg-slate-200" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>2</span>
            <span>Preview & Validate</span>
          </div>
          <div className="w-12 h-px bg-slate-200" />
          <div className={`flex items-center gap-2 ${step === 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>3</span>
            <span>Ingested</span>
          </div>
        </div>

        {/* STEP 1: UPLOAD */}
        {step === 1 && (
          <div className="space-y-6 max-w-2xl mx-auto py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Target Entity</label>
                <select
                  value={importType}
                  onChange={(e) => setImportType(e.target.value)}
                  className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="Customer">Customers (CRM)</option>
                  <option value="SpareParts">Spare Parts Inventory</option>
                  <option value="Tractor">Tractors (Fleet Master)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={downloadSampleTemplate}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Download Sample CSV Template</span>
              </button>
            </div>

            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30 text-center">
              <UploadCloud className="w-10 h-10 text-blue-600 mb-3" />
              <p className="text-sm font-bold text-slate-800">
                Click to browse or drop your CSV file here
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports CSV, XLSX up to 25MB</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* STEP 2: PREVIEW */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Data Preview: {parsedData.length} records ready for &quot;{importType}&quot;
                </h3>
                <p className="text-xs text-slate-500">Review column headers and parsed values before committing to database.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setParsedData([])
                    setFile(null)
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={importing}
                  onClick={handleExecuteImport}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Commit & Import to Database
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                  <tr>
                    {parsedData[0] &&
                      Object.keys(parsedData[0]).map((col) => (
                        <th key={col} className="p-2.5 font-bold text-slate-600">
                          {col}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {parsedData.slice(0, 10).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="p-2.5 text-slate-700 truncate max-w-[150px]">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedData.length > 10 && (
              <p className="text-[11px] text-slate-400 text-center">
                Showing first 10 of {parsedData.length} records
              </p>
            )}
          </div>
        )}

        {/* STEP 3: COMPLETED */}
        {step === 3 && (
          <div className="py-8 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Import Process Completed!</h3>
            <p className="text-xs text-slate-500">
              The database has been updated and synchronized with your uploaded data.
            </p>
            <button
              onClick={() => {
                setStep(1)
                setParsedData([])
                setFile(null)
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold"
            >
              Upload Another File
            </button>
          </div>
        )}
      </div>

      {/* Import Audit Logs */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-slate-500" />
          Recent Ingestion Audit Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-3">File Name</th>
                <th className="py-2.5 px-3">Entity Type</th>
                <th className="py-2.5 px-3">Total Rows</th>
                <th className="py-2.5 px-3">Imported</th>
                <th className="py-2.5 px-3">Duplicates</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">No previous imports recorded.</td>
                </tr>
              ) : (
                history.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{log.fileName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{log.importType}</td>
                    <td className="py-2.5 px-3">{log.totalRecords}</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-bold">{log.imported}</td>
                    <td className="py-2.5 px-3 text-amber-600">{log.duplicates}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{formatDate(log.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

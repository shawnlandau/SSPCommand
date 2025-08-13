'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface CSVData {
  headers: string[];
  rows: string[][];
  preview: string[][];
}

interface CSVUploadProps {
  onDataUpload: (data: CSVData) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

export default function CSVUpload({ 
  onDataUpload, 
  acceptedTypes = ['.csv', 'text/csv'],
  maxSize = 10 
}: CSVUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const processCSV = useCallback((text: string): CSVData => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) throw new Error('CSV file is empty');
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => 
      line.split(',').map(cell => cell.trim().replace(/"/g, ''))
    );
    
    return {
      headers,
      rows,
      preview: rows.slice(0, 5) // Show first 5 rows as preview
    };
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setIsProcessing(true);
    
    try {
      // Validate file type
      if (!acceptedTypes.some(type => 
        file.name.endsWith(type) || file.type === type
      )) {
        throw new Error('Invalid file type. Please upload a CSV file.');
      }
      
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`File size must be less than ${maxSize}MB.`);
      }
      
      const text = await file.text();
      const data = processCSV(text);
      
      setCsvData(data);
      setFileName(file.name);
      onDataUpload(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process CSV file');
    } finally {
      setIsProcessing(false);
    }
  }, [acceptedTypes, maxSize, processCSV, onDataUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const clearData = useCallback(() => {
    setCsvData(null);
    setFileName(null);
    setError(null);
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          isDragOver 
            ? 'border-accent-500 bg-accent-50' 
            : 'border-foreground-muted/20 hover:border-accent-400 hover:bg-neutral-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className={`p-3 rounded-2xl ${
              isDragOver ? 'bg-accent-100' : 'bg-neutral-100'
            }`}>
              <Upload className={`w-6 h-6 ${
                isDragOver ? 'text-accent-600' : 'text-foreground-muted'
              }`} />
            </div>
          </div>
          
          <div>
            <p className="text-section text-foreground">
              {isDragOver ? 'Drop your CSV file here' : 'Upload CSV File'}
            </p>
            <p className="text-body-sm text-foreground-secondary mt-1">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>
          
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-accent-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent-500 border-t-transparent" />
              Processing...
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-600 text-body-sm">{error}</p>
        </div>
      )}

      {/* Success Display */}
      {csvData && fileName && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800 text-body-sm">File uploaded successfully!</p>
                <p className="text-caption text-green-600">{fileName}</p>
              </div>
            </div>
            <button
              onClick={clearData}
              className="p-2 hover:bg-green-100 rounded-xl transition-colors"
            >
              <X className="w-4 h-4 text-green-600" />
            </button>
          </div>

          {/* Data Preview */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b bg-neutral-50">
              <h3 className="font-medium text-foreground">Data Preview (First 5 rows)</h3>
              <p className="text-caption text-foreground-muted">
                {csvData.rows.length} total rows, {csvData.headers.length} columns
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-neutral-50">
                    {csvData.headers.map((header, index) => (
                      <th key={index} className="px-4 py-2 text-left text-body-sm font-medium text-foreground-muted">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.preview.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b hover:bg-neutral-50">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-body-sm text-foreground">
                          {cell || <span className="text-foreground-muted">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

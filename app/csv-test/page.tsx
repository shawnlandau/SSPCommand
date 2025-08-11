'use client';

import { useState, useMemo } from 'react';
import CSVUpload from '../components/CSVUpload';

interface CSVData {
  headers: string[];
  rows: string[][];
  preview: string[][];
}

export default function CSVTestPage() {
  const [uploadedData, setUploadedData] = useState<CSVData | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<string>('');
  const [territoryColumn, setTerritoryColumn] = useState<string>('');

  const handleDataUpload = (data: CSVData) => {
    setUploadedData(data);
    console.log('CSV Data received:', data);
    
    // Try to auto-detect territory column
    const possibleTerritoryColumns = ['territory', 'region', 'state', 'area', 'location'];
    const detectedColumn = data.headers.find(header => 
      possibleTerritoryColumns.some(possible => 
        header.toLowerCase().includes(possible)
      )
    );
    if (detectedColumn) {
      setTerritoryColumn(detectedColumn);
    }
  };

  // Get unique territories from the data
  const uniqueTerritories = useMemo(() => {
    if (!uploadedData || !territoryColumn) return [];
    
    const territoryIndex = uploadedData.headers.indexOf(territoryColumn);
    if (territoryIndex === -1) return [];
    
    const territories = new Set<string>();
    uploadedData.rows.forEach(row => {
      if (row[territoryIndex] && row[territoryIndex].trim()) {
        territories.add(row[territoryIndex].trim());
      }
    });
    
    return Array.from(territories).sort();
  }, [uploadedData, territoryColumn]);

  // Filter data by selected territory
  const filteredData = useMemo(() => {
    if (!uploadedData || !selectedTerritory || !territoryColumn) {
      return uploadedData;
    }
    
    const territoryIndex = uploadedData.headers.indexOf(territoryColumn);
    if (territoryIndex === -1) return uploadedData;
    
    const filteredRows = uploadedData.rows.filter(row => 
      row[territoryIndex] && row[territoryIndex].trim() === selectedTerritory
    );
    
    return {
      ...uploadedData,
      rows: filteredRows,
      preview: filteredRows.slice(0, 5)
    };
  }, [uploadedData, selectedTerritory, territoryColumn]);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CSV Upload Test Page</h1>
        <p className="text-muted-foreground">
          Upload your "SJL Opps" CSV file to test the import functionality
        </p>
      </div>

      <CSVUpload onDataUpload={handleDataUpload} />

      {uploadedData && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold">Data Analysis</h2>
          
          {/* Territory Selection */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Territory Filtering</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Territory Column
                </label>
                <select
                  value={territoryColumn}
                  onChange={(e) => setTerritoryColumn(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="">Select a column...</option>
                  {uploadedData.headers.map((header, index) => (
                    <option key={index} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Select Territory
                </label>
                <select
                  value={selectedTerritory}
                  onChange={(e) => setSelectedTerritory(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  disabled={!territoryColumn}
                >
                  <option value="">All Territories</option>
                  {uniqueTerritories.map((territory) => (
                    <option key={territory} value={territory}>
                      {territory}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {territoryColumn && (
              <div className="text-sm text-muted-foreground">
                <p>Found {uniqueTerritories.length} unique territories in &quot;{territoryColumn}&quot; column</p>
                {selectedTerritory && (
                  <p className="mt-1">
                    Showing {filteredData?.rows.length || 0} rows for &quot;{selectedTerritory}&quot;
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Data Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-medium text-muted-foreground mb-1">Total Rows</h3>
              <p className="text-2xl font-bold">{filteredData?.rows.length || 0}</p>
              {selectedTerritory && uploadedData && (
                <p className="text-sm text-muted-foreground">
                  of {uploadedData.rows.length} total
                </p>
              )}
            </div>
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-medium text-muted-foreground mb-1">Total Columns</h3>
              <p className="text-2xl font-bold">{uploadedData.headers.length}</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-medium text-muted-foreground mb-1">Data Size</h3>
              <p className="text-2xl font-bold">
                {(JSON.stringify(filteredData || uploadedData).length / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          {/* Column Headers */}
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/50">
              <h3 className="font-medium">Column Headers</h3>
              <p className="text-sm text-muted-foreground">
                These are the data fields available in your CSV
              </p>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {uploadedData.headers.map((header, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      header === territoryColumn
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-primary/10 text-primary border-primary/20'
                    }`}
                  >
                    {header}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Data Preview */}
          {filteredData && (
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/50">
                <h3 className="font-medium">
                  Data Preview {selectedTerritory ? `(${selectedTerritory})` : "(All Territories)"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Showing first 5 rows of {filteredData.rows.length} total rows
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      {filteredData.headers.map((header, index) => (
                        <th key={index} className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.preview.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b hover:bg-muted/20">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-sm">
                            {cell || <span className="text-muted-foreground">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

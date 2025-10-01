import React, { useState } from 'react';

function QueryResultGrid({ 
  results, 
  columns, // 새로 추가된 컬럼 정보
  isLoading, 
  executionTime, 
  affectedRows, 
  error,
  isEditing,
  onCellEdit, // 새로 추가된 셀 편집 핸들러
  onAddRow,
  onDeleteRows,
  onSave,
  onDiscard
}) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState(new Set());

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="mt-5">
        <h3 className="font-semibold text-gray-900 mb-3">실행 결과</h3>
        <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 min-h-[300px] max-h-[500px] overflow-auto">
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-center">쿼리를 실행하는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="mt-5">
        <h3 className="font-semibold text-gray-900 mb-3">실행 결과</h3>
        <div className="border border-red-200 rounded-lg bg-red-50 p-4 min-h-[300px] max-h-[500px] overflow-auto">
          <div className="flex flex-col items-center justify-center h-64 text-red-600">
            <svg className="w-16 h-16 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-semibold mb-2">쿼리 실행 오류</h4>
            <p className="text-center text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 컬럼 정보 결정 (results가 있으면 results에서, 없으면 columns prop에서)
  const displayColumns = results && results.length > 0 
    ? Object.keys(results[0]) 
    : (columns || []);

  // 결과가 없는 상태
  if ((!results || results.length === 0) && displayColumns.length === 0) {
    return (
      <div className="mt-5">
        <h3 className="font-semibold text-gray-900 mb-3">실행 결과</h3>
        <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 min-h-[300px] max-h-[500px] overflow-auto">
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-center">쿼리를 실행하면 결과가 여기에 표시됩니다</p>
            {executionTime && (
              <p className="text-sm text-green-600 mt-2">
                마지막 실행 시간: {executionTime}ms
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 정렬 처리
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // 데이터 정렬 (결과가 있을 때만)
  const sortedResults = results && results.length > 0 ? [...results].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    const comparison = aVal < bVal ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  }) : [];

  // 전체 선택/해제
  const toggleAllRows = (checked) => {
    if (checked && results) {
      setSelectedRows(new Set(results.map((_, i) => i)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // 개별 행 선택/해제  
  const toggleRow = (index, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);
  };

  // CSV 다운로드
  const downloadCSV = () => {
    if (!results || results.length === 0) {
      // 컬럼만 있는 경우 헤더만 다운로드
      const csv = displayColumns.join(',');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'query_structure.csv';
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const headers = displayColumns.join(',');
    const rows = sortedResults.map(row => 
      displayColumns.map(col => {
        const value = row[col] ?? '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    ).join('\n');
    
    const csv = headers + '\n' + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 셀 값 포맷팅
  const formatCellValue = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">(null)</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="text-blue-600 font-semibold">{value.toLocaleString()}</span>;
    }
    
    if (typeof value === 'boolean') {
      return (
        <span className={`font-semibold ${value ? 'text-green-600' : 'text-red-600'}`}>
          {value.toString().toUpperCase()}
        </span>
      );
    }
    
    const stringValue = value.toString();
    if (stringValue.length > 50) {
      return (
        <span title={stringValue} className="truncate block max-w-xs">
          {stringValue.substring(0, 50)}...
        </span>
      );
    }
    
    return stringValue;
  };

  // 셀 편집 핸들러
  const handleCellChange = (rowIndex, columnName, newValue) => {
    if (onCellEdit) {
      onCellEdit(rowIndex, columnName, newValue);
    }
  };

  const hasResults = results && results.length > 0;
  const hasColumns = displayColumns.length > 0;

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">실행 결과</h3>
        
        {/* 결과 통계 및 액션 */}
        <div className="flex items-center space-x-4 text-sm">
          {hasResults && (
            <span className="text-gray-600">
              {results.length.toLocaleString()} rows retrieved
            </span>
          )}
          {!hasResults && hasColumns && (
            <span className="text-gray-600">
              {displayColumns.length} columns (no data)
            </span>
          )}
          {executionTime && (
            <span className="text-gray-600">
              {executionTime}ms
            </span>
          )}
          {affectedRows !== undefined && (
            <span className="text-green-600">
              {affectedRows} rows affected
            </span>
          )}
          {selectedRows.size > 0 && (
            <span className="text-blue-600">
              {selectedRows.size} selected
            </span>
          )}
          
          {/* Export 버튼 */}
          {hasColumns && (
            <button 
              onClick={downloadCSV}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              title="CSV로 다운로드"
            >
              Export CSV
            </button>
          )}
        </div>
      </div>

      {hasColumns ? (
        <div className="border border-gray-200 rounded-lg bg-white min-h-[300px] max-h-[500px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-100 border-b border-gray-200">
              <tr>
                {/* 체크박스 컬럼 (편집 모드이고 데이터가 있을 때만) */}
                {isEditing && hasResults && (
                  <th className="w-8 p-2 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedRows.size === results.length && results.length > 0}
                      onChange={(e) => toggleAllRows(e.target.checked)}
                    />
                  </th>
                )}
                
                {/* 데이터 컬럼들 */}
                {displayColumns.map(column => (
                  <th
                    key={column}
                    className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 border-r border-gray-200 transition-colors"
                    onClick={() => hasResults && handleSort(column)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column}</span>
                      {hasResults && sortColumn === column && (
                        <span className="text-blue-600">
                          {sortDirection === 'desc' ? '↓' : '↑'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {hasResults ? (
                // 데이터가 있는 경우
                sortedResults.map((row, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-blue-50 border-b border-gray-100 transition-colors ${
                      selectedRows.has(index) ? 'bg-blue-50' : ''
                    }`}
                  >
                    {/* 체크박스 (편집 모드일 때만) */}
                    {isEditing && (
                      <td className="w-8 p-2 text-center border-r border-gray-100">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedRows.has(index)}
                          onChange={(e) => toggleRow(index, e.target.checked)}
                        />
                      </td>
                    )}
                    
                    {/* 데이터 셀들 */}
                    {displayColumns.map(column => (
                      <td
                        key={column}
                        className="px-3 py-2 border-r border-gray-100 font-mono text-xs"
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={row[column] ?? ''}
                            className="w-full bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-500 rounded px-1"
                            onChange={(e) => handleCellChange(index, column, e.target.value)}
                          />
                        ) : (
                          formatCellValue(row[column])
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                // 데이터가 없지만 컬럼이 있는 경우 (빈 행 표시)
                <tr className="border-b border-gray-100">
                  {isEditing && (
                    <td className="w-8 p-2 text-center border-r border-gray-100">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        disabled
                      />
                    </td>
                  )}
                  {displayColumns.map(column => (
                    <td
                      key={column}
                      className="px-3 py-8 border-r border-gray-100 text-center text-gray-400 italic"
                    >
                      (no data)
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
          
          {/* 컬럼만 있고 데이터가 없을 때 안내 메시지 */}
          {!hasResults && hasColumns && (
            <div className="p-4 text-center text-gray-500 bg-gray-50 border-t border-gray-200">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">
                조회된 데이터가 없습니다. 위의 컬럼 구조를 참고하세요.
              </p>
            </div>
          )}
        </div>
      ) : (
        // 컬럼도 없는 경우
        <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 min-h-[300px] max-h-[500px] overflow-auto">
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-center">쿼리를 실행하면 결과가 여기에 표시됩니다</p>
            {executionTime && (
              <p className="text-sm text-green-600 mt-2">
                마지막 실행 시간: {executionTime}ms
              </p>
            )}
          </div>
        </div>
      )}

      {/* 편집 모드 액션 버튼들 - 편집 모드이고 결과가 있을 때만 표시 */}
      {isEditing && hasResults && (
        <div className="flex justify-end items-center mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-2">
            <button
              onClick={() => onDeleteRows(Array.from(selectedRows))}
              disabled={selectedRows.size === 0}
              className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors disabled:opacity-50"
            >
              선택 삭제 ({selectedRows.size})
            </button>
            <button
              onClick={onDiscard}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
            >
              변경 취소
            </button>
            <button
              onClick={onSave}
              className="px-3 py-1.5 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
            >
              변경 저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QueryResultGrid;
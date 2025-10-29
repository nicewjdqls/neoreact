import React, { useState } from 'react';

function QueryResultGrid({ 
  results, 
  columns,
  isLoading, 
  executionTime, 
  affectedRows, 
  error,
  isEditing,
  onCellEdit,
  onAddRow,
  onDeleteRows,
  onSave,
  onDiscard
}) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState(new Set());

  if (isLoading) {
    return (
      <div style={{ marginTop: '1.25rem' }}>
        <h3 style={{ fontWeight: '600', color: '#fff', marginBottom: '0.75rem' }}>실행 결과</h3>
        <div style={{ 
          border: '1px solid rgba(255, 255, 255, 0.15)', 
          borderRadius: '0.5rem', 
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '1rem',
          minHeight: '18.75rem',
          maxHeight: '31.25rem',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '16rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            <div style={{ 
              animation: 'spin 1s linear infinite', 
              borderRadius: '50%', 
              height: '2rem', 
              width: '2rem', 
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#3b82f6 transparent #3b82f6 transparent',
              marginBottom: '1rem'
            }}></div>
            <p style={{ textAlign: 'center' }}>쿼리를 실행하는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginTop: '1.25rem' }}>
        <h3 style={{ fontWeight: '600', color: '#fff', marginBottom: '0.75rem' }}>실행 결과</h3>
        <div style={{ 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          borderRadius: '0.5rem', 
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '1rem',
          minHeight: '18.75rem',
          maxHeight: '31.25rem',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '16rem', color: '#ef4444' }}>
            <svg style={{ width: '4rem', height: '4rem', marginBottom: '1rem', color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>쿼리 실행 오류</h4>
            <p style={{ textAlign: 'center', fontSize: '0.875rem' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const displayColumns = results && results.length > 0 
    ? Object.keys(results[0]) 
    : (columns || []);

  if ((!results || results.length === 0) && displayColumns.length === 0) {
    return (
      <div style={{ marginTop: '1.25rem' }}>
        <h3 style={{ fontWeight: '600', color: '#fff', marginBottom: '0.75rem' }}>실행 결과</h3>
        <div style={{ 
          border: '1px solid rgba(255, 255, 255, 0.15)', 
          borderRadius: '0.5rem', 
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '1rem',
          minHeight: '18.75rem',
          maxHeight: '31.25rem',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '16rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            <svg style={{ width: '4rem', height: '4rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p style={{ textAlign: 'center' }}>쿼리를 실행하면 결과가 여기에 표시됩니다</p>
            {executionTime && (
              <p style={{ fontSize: '0.875rem', color: '#22c55e', marginTop: '0.5rem' }}>
                마지막 실행 시간: {executionTime}ms
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

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

  const toggleAllRows = (checked) => {
    if (checked && results) {
      setSelectedRows(new Set(results.map((_, i) => i)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const toggleRow = (index, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);
  };

  const downloadCSV = () => {
    if (!results || results.length === 0) {
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

  const formatCellValue = (value) => {
    if (value === null || value === undefined) {
      return <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontStyle: 'italic' }}>(null)</span>;
    }
    
    if (typeof value === 'number') {
      return <span style={{ color: '#3b82f6', fontWeight: '600' }}>{value.toLocaleString()}</span>;
    }
    
    if (typeof value === 'boolean') {
      return (
        <span style={{ fontWeight: '600', color: value ? '#22c55e' : '#ef4444' }}>
          {value.toString().toUpperCase()}
        </span>
      );
    }
    
    const stringValue = value.toString();
    if (stringValue.length > 50) {
      return (
        <span title={stringValue} style={{ display: 'block', maxWidth: '20rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {stringValue.substring(0, 50)}...
        </span>
      );
    }
    
    return stringValue;
  };

  const handleCellChange = (rowIndex, columnName, newValue) => {
    if (onCellEdit) {
      onCellEdit(rowIndex, columnName, newValue);
    }
  };

  const hasResults = results && results.length > 0;
  const hasColumns = displayColumns.length > 0;

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ fontWeight: '600', color: '#fff' }}>실행 결과</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
          {hasResults && (
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {results.length.toLocaleString()} rows retrieved
            </span>
          )}
          {!hasResults && hasColumns && (
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {displayColumns.length} columns (no data)
            </span>
          )}
          {executionTime && (
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {executionTime}ms
            </span>
          )}
          {affectedRows !== undefined && (
            <span style={{ color: '#22c55e' }}>
              {affectedRows} rows affected
            </span>
          )}
          {selectedRows.size > 0 && (
            <span style={{ color: '#3b82f6' }}>
              {selectedRows.size} selected
            </span>
          )}
          
          {hasColumns && (
            <button 
              onClick={downloadCSV}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="CSV로 다운로드"
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              Export CSV
            </button>
          )}
        </div>
      </div>

      {hasColumns ? (
        <div style={{ 
          border: '1px solid rgba(255, 255, 255, 0.15)', 
          borderRadius: '0.5rem', 
          background: 'rgba(0, 0, 0, 0.3)',
          minHeight: '18.75rem',
          maxHeight: '31.25rem',
          overflow: 'auto'
        }}>
          <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(0, 0, 0, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', zIndex: 10 }}>
              <tr>
                {isEditing && hasResults && (
                  <th style={{ width: '2rem', padding: '0.5rem', textAlign: 'center', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input
                      type="checkbox"
                      style={{ width: '1rem', height: '1rem', cursor: 'pointer', accentColor: '#3b82f6' }}
                      checked={selectedRows.size === results.length && results.length > 0}
                      onChange={(e) => toggleAllRows(e.target.checked)}
                    />
                  </th>
                )}
                
                {displayColumns.map(column => (
                  <th
                    key={column}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                      cursor: hasResults ? 'pointer' : 'default',
                      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.2s',
                      background: 'transparent'
                    }}
                    onClick={() => hasResults && handleSort(column)}
                    onMouseEnter={(e) => {
                      if (hasResults) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (hasResults) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>{column}</span>
                      {hasResults && sortColumn === column && (
                        <span style={{ color: '#3b82f6' }}>
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
                sortedResults.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.2s',
                      background: selectedRows.has(index) ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedRows.has(index)) {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedRows.has(index)) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {isEditing && (
                      <td style={{ width: '2rem', padding: '0.5rem', textAlign: 'center', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <input
                          type="checkbox"
                          style={{ width: '1rem', height: '1rem', cursor: 'pointer', accentColor: '#3b82f6' }}
                          checked={selectedRows.has(index)}
                          onChange={(e) => toggleRow(index, e.target.checked)}
                        />
                      </td>
                    )}
                    
                    {displayColumns.map(column => (
                      <td
                        key={column}
                        style={{
                          padding: '0.75rem',
                          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: 'rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={row[column] ?? ''}
                            style={{
                              width: '100%',
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              color: 'rgba(255, 255, 255, 0.9)',
                              padding: '0.25rem',
                              borderRadius: '0.25rem'
                            }}
                            onChange={(e) => handleCellChange(index, column, e.target.value)}
                            onFocus={(e) => {
                              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                              e.target.style.border = '1px solid rgba(59, 130, 246, 0.5)';
                            }}
                            onBlur={(e) => {
                              e.target.style.background = 'transparent';
                              e.target.style.border = 'none';
                            }}
                          />
                        ) : (
                          formatCellValue(row[column])
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {isEditing && (
                    <td style={{ width: '2rem', padding: '0.5rem', textAlign: 'center', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <input
                        type="checkbox"
                        style={{ width: '1rem', height: '1rem', cursor: 'not-allowed', opacity: 0.5 }}
                        disabled
                      />
                    </td>
                  )}
                  {displayColumns.map(column => (
                    <td
                      key={column}
                      style={{
                        padding: '2rem 0.75rem',
                        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontStyle: 'italic'
                      }}
                    >
                      (no data)
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
          
          {!hasResults && hasColumns && (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', background: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <svg style={{ width: '2rem', height: '2rem', margin: '0 auto 0.5rem', color: 'rgba(255, 255, 255, 0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p style={{ fontSize: '0.875rem' }}>
                조회된 데이터가 없습니다. 위의 컬럼 구조를 참고하세요.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ 
          border: '1px solid rgba(255, 255, 255, 0.15)', 
          borderRadius: '0.5rem', 
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '1rem',
          minHeight: '18.75rem',
          maxHeight: '31.25rem',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '16rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            <svg style={{ width: '4rem', height: '4rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p style={{ textAlign: 'center' }}>쿼리를 실행하면 결과가 여기에 표시됩니다</p>
            {executionTime && (
              <p style={{ fontSize: '0.875rem', color: '#22c55e', marginTop: '0.5rem' }}>
                마지막 실행 시간: {executionTime}ms
              </p>
            )}
          </div>
        </div>
      )}

      {isEditing && hasResults && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          marginTop: '0.75rem', 
          padding: '0.75rem',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '0.5rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onDeleteRows(Array.from(selectedRows))}
              disabled={selectedRows.size === 0}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '0.875rem',
                background: selectedRows.size === 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
                color: selectedRows.size === 0 ? 'rgba(239, 68, 68, 0.5)' : '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '0.375rem',
                cursor: selectedRows.size === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedRows.size > 0) e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                if (selectedRows.size > 0) e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              }}
            >
              선택 삭제 ({selectedRows.size})
            </button>
            <button
              onClick={onDiscard}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '0.875rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              변경 취소
            </button>
            <button
              onClick={onSave}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: '0.875rem',
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)'}
            >
              변경 저장
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default QueryResultGrid;
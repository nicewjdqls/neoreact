import React, { useRef, useState } from 'react';

function SQLEditor({ 
  value, 
  onChange, 
  onExecute, 
  isExecuting, 
  execMsg,
  execMsgType,
  isEditing,
  onToggleEdit,
  onAddRow,
  onDeleteRows,
  onDiscard,
  onSave,
  onClearResult
}) {
  const editorRef = useRef(null);
  const lineNumberRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [currentStatement, setCurrentStatement] = useState('');

  const getSelectedText = () => {
    if (!editorRef.current || !value) return null;
    
    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    
    if (start === end) return null;
    
    return value.substring(start, end).trim();
  };

  const findCurrentStatement = (text, cursorPos) => {
    if (!text || !text.trim()) return '';

    const statements = text.split(';');
    
    if (statements.length === 1) {
      return text.trim();
    }

    let currentPos = 0;
    let targetStatementIndex = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statementLength = statements[i].length;
      const nextPos = currentPos + statementLength + 1;
      
      if (cursorPos >= currentPos && cursorPos <= nextPos) {
        targetStatementIndex = i;
        break;
      }
      
      currentPos = nextPos;
    }

    let statement = statements[targetStatementIndex].trim();
    
    const lines = statement.split('\n');
    const cleanedLines = lines.map(line => {
      const commentIndex = line.indexOf('--');
      if (commentIndex >= 0) {
        return line.substring(0, commentIndex);
      }
      return line;
    });
    
    let cleanedStatement = cleanedLines.join('\n').replace(/\/\*[\s\S]*?\*\//g, '').trim();
    
    if (!cleanedStatement) {
      for (let i = targetStatementIndex + 1; i < statements.length; i++) {
        const candidate = statements[i].trim();
        const withoutComments = candidate.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
        if (withoutComments) {
          return withoutComments;
        }
      }
      
      for (let i = targetStatementIndex - 1; i >= 0; i--) {
        const candidate = statements[i].trim();
        const withoutComments = candidate.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
        if (withoutComments) {
          return withoutComments;
        }
      }
      
      return '';
    }

    return cleanedStatement;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'F9' || (e.ctrlKey && e.key === 'Enter')) {
      e.preventDefault();
      
      const selectedText = getSelectedText();
      if (selectedText) {
        setCurrentStatement(selectedText);
        onExecute(selectedText);
        return;
      }
      
      const cursorPos = editorRef.current?.selectionStart || 0;
      const statement = findCurrentStatement(value, cursorPos);
      setCurrentStatement(statement);
      onExecute(statement);
      return;
    }
  };

  const handleSelectionChange = (e) => {
    if (!value) return;
    
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    
    const textBeforeCursor = value.substring(0, start);
    const lines = textBeforeCursor.split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });

    if (start !== end) {
      const selected = value.substring(start, end).trim();
      setCurrentStatement(selected);
    } else {
      const statement = findCurrentStatement(value, start);
      setCurrentStatement(statement);
    }
  };

  const handleEditorScroll = () => {
    if (editorRef.current && lineNumberRef.current) {
      lineNumberRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  const getCurrentStatementInfo = () => {
    if (!currentStatement.trim()) return null;
    
    const trimmed = currentStatement.trim();
    const firstWord = trimmed.split(/\s+/)[0]?.toUpperCase();
    
    let color = 'text-blue-600';
    let bgColor = 'bg-blue-50';
    let borderColor = 'border-blue-200';
    
    if (firstWord === 'SELECT') {
      color = '#3b82f6';
      bgColor = 'rgba(59, 130, 246, 0.1)';
      borderColor = 'rgba(59, 130, 246, 0.3)';
    } else if (['INSERT', 'UPDATE', 'DELETE'].includes(firstWord)) {
      color = '#f97316';
      bgColor = 'rgba(249, 115, 22, 0.1)';
      borderColor = 'rgba(249, 115, 22, 0.3)';
    } else if (['CREATE', 'DROP', 'ALTER'].includes(firstWord)) {
      color = '#ef4444';
      bgColor = 'rgba(239, 68, 68, 0.1)';
      borderColor = 'rgba(239, 68, 68, 0.3)';
    }
    
    return {
      statement: trimmed.length > 150 ? trimmed.substring(0, 150) + '...' : trimmed,
      color,
      bgColor,
      borderColor
    };
  };

  const statementInfo = getCurrentStatementInfo();

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '1.25rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            background: 'rgba(59, 130, 246, 0.2)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fff' }}>SQL 쿼리 편집기</h2>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              <span style={{ fontWeight: '600' }}>F9</span> 또는 <span style={{ fontWeight: '600' }}>Ctrl+Enter</span>: 실행 | 
              <span style={{ color: '#3b82f6', marginLeft: '0.25rem' }}>드래그 선택 후 실행 가능</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ padding: '1.25rem' }}>
        {/* SQL 에디터 영역 */}
        <div style={{ 
          border: '1px solid rgba(255, 255, 255, 0.2)', 
          borderRadius: '0.5rem', 
          overflow: 'hidden', 
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex'
        }}>
          {/* 라인 번호 */}
          <div 
            ref={lineNumberRef}
            style={{
              width: '3rem',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRight: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '1rem 0.5rem',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: 'monospace',
              overflow: 'hidden',
              flexShrink: 0,
              lineHeight: '1.25rem'
            }}
          >
            {(value || '').split('\n').map((_, index) => (
              <div key={index} style={{ height: '1.25rem', textAlign: 'right' }}>
                {index + 1}
              </div>
            ))}
          </div>
          
          {/* 텍스트 에디터 */}
          <textarea 
            ref={editorRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onSelect={handleSelectionChange}
            onMouseUp={handleSelectionChange}
            onClick={handleSelectionChange}
            onScroll={handleEditorScroll}
            rows={15}
            style={{
              flex: 1,
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              resize: 'none',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: '#fff',
              overflow: 'auto',
              whiteSpace: 'pre',
              wordWrap: 'off',
              overflowWrap: 'normal',
              lineHeight: '1.25rem'
            }}
            placeholder="SQL 쿼리를 입력하세요... (세미콜론으로 문장 구분)"
            spellCheck={false}
          />
        </div>

        {/* 상태바 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '0.5rem', 
          padding: '0.5rem 0.75rem',
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Line {cursorPosition.line}, Column {cursorPosition.column}</span>
            <span>Length: {(value || '').length} chars</span>
            {getSelectedText() && (
              <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                Selected: {getSelectedText().length} chars
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Oracle SQL</span>
            <span>UTF-8</span>
            {isExecuting && <span style={{ color: '#3b82f6', animation: 'pulse 2s ease-in-out infinite', fontWeight: '600' }}>Executing...</span>}
          </div>
        </div>

        {/* 컨트롤 버튼들 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => {
                const selectedText = getSelectedText();
                if (selectedText) {
                  setCurrentStatement(selectedText);
                  onExecute(selectedText);
                } else {
                  const cursorPos = editorRef.current?.selectionStart || 0;
                  const statement = findCurrentStatement(value, cursorPos);
                  setCurrentStatement(statement);
                  onExecute(statement);
                }
              }}
              disabled={isExecuting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                background: isExecuting ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: isExecuting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.2s',
                opacity: isExecuting ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isExecuting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isExecuting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }
              }}
            >
              {isExecuting ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', height: '1rem', width: '1rem' }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  실행 중...
                </>
              ) : (
                <>
                  <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  실행 (F9)
                </>
              )}
            </button>
            <button 
              onClick={onClearResult}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              결과 지우기
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={isEditing}
                onChange={onToggleEdit}
                style={{ 
                  width: '1rem', 
                  height: '1rem',
                  cursor: 'pointer',
                  accentColor: '#3b82f6'
                }} 
              />
              편집 모드(인라인)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={onAddRow}
                disabled={!isEditing}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                  background: isEditing ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  color: isEditing ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: isEditing ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (isEditing) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  if (isEditing) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                행 추가
              </button>
              <button 
                onClick={onDeleteRows}
                disabled={!isEditing}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                  background: isEditing ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  color: isEditing ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: isEditing ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (isEditing) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  if (isEditing) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                선택 삭제
              </button>
              <button 
                onClick={onDiscard}
                disabled={!isEditing}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                  background: isEditing ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  color: isEditing ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.375rem',
                  cursor: isEditing ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (isEditing) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  if (isEditing) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                변경 취소
              </button>
              <button 
                onClick={onSave}
                disabled={!isEditing}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                  background: isEditing ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(34, 197, 94, 0.3)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: isEditing ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: isEditing ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (isEditing) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isEditing) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
                  }
                }}
              >
                변경 저장
              </button>
            </div>
          </div>
        </div>

        {/* 실행 메시지 */}
        {execMsg && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            border: '1px solid',
            background: execMsgType === 'error'
              ? 'rgba(239, 68, 68, 0.1)'
              : execMsgType === 'success'
              ? 'rgba(34, 197, 94, 0.1)'
              : 'rgba(59, 130, 246, 0.1)',
            borderColor: execMsgType === 'error'
              ? 'rgba(239, 68, 68, 0.3)'
              : execMsgType === 'success'
              ? 'rgba(34, 197, 94, 0.3)'
              : 'rgba(59, 130, 246, 0.3)',
            color: execMsgType === 'error'
              ? '#ef4444'
              : execMsgType === 'success'
              ? '#22c55e'
              : '#3b82f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              {execMsgType === 'error' ? (
                <svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0, marginTop: '0.125rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : execMsgType === 'success' ? (
                <svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0, marginTop: '0.125rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0, marginTop: '0.125rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div style={{ flex: 1, whiteSpace: 'pre-line' }}>
                {execMsg}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default SQLEditor;
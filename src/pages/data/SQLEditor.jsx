import React, { useRef, useState, useEffect } from 'react';

function SQLEditor({ 
  value, 
  onChange, 
  onExecute, 
  isExecuting, 
  execMsg,
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

  // TOAD 규칙: 커서 위치에 따른 현재 SQL 문장 찾기
  const findCurrentStatement = (text, cursorPos) => {
    if (!text.trim()) return '';

    // 세미콜론 위치들 찾기
    const semicolonPositions = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ';') {
        semicolonPositions.push(i);
      }
    }

    // 세미콜론이 없으면 전체 텍스트 반환
    if (semicolonPositions.length === 0) {
      return text.trim();
    }

    // 커서 위치 기준으로 현재 문장 범위 찾기
    let statementStart = 0;
    let statementEnd = text.length;

    // 커서 이전의 마지막 세미콜론 찾기
    for (let i = 0; i < semicolonPositions.length; i++) {
      const semicolonPos = semicolonPositions[i];
      if (semicolonPos < cursorPos) {
        statementStart = semicolonPos + 1;
      } else {
        statementEnd = semicolonPos + 1;
        break;
      }
    }

    // 특별한 경우: 커서가 세미콜론 바로 뒤에 있을 때
    for (let semicolonPos of semicolonPositions) {
      if (cursorPos === semicolonPos + 1) {
        // 세미콜론 바로 다음에 커서가 있으면 다음 문장 실행
        statementStart = semicolonPos + 1;
        // 다음 세미콜론 찾기
        const nextSemicolonIndex = semicolonPositions.findIndex(pos => pos > semicolonPos);
        if (nextSemicolonIndex !== -1) {
          statementEnd = semicolonPositions[nextSemicolonIndex] + 1;
        } else {
          statementEnd = text.length;
        }
        break;
      }
    }

    // 문장 추출
    let statement = text.substring(statementStart, statementEnd).trim();
    
    // 빈 문장이면 다음 비어있지 않은 문장 찾기
    if (!statement || statement === ';') {
      for (let i = 0; i < semicolonPositions.length; i++) {
        const start = i === 0 ? 0 : semicolonPositions[i - 1] + 1;
        const end = semicolonPositions[i] + 1;
        const candidate = text.substring(start, end).trim();
        
        if (candidate && candidate !== ';' && !candidate.match(/^[\s\-\/\*]*$/)) {
          // 주석만 있는 것도 제외
          const withoutComments = candidate.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
          if (withoutComments && withoutComments !== ';') {
            return candidate;
          }
        }
      }
      
      // 마지막 문장도 체크 (세미콜론 없을 수 있음)
      if (semicolonPositions.length > 0) {
        const lastStatement = text.substring(semicolonPositions[semicolonPositions.length - 1] + 1).trim();
        if (lastStatement) {
          return lastStatement;
        }
      }
    }

    // 세미콜론으로 끝나지 않으면 추가 (표시용)
    if (statement && !statement.endsWith(';') && statementEnd < text.length) {
      // 실제로 세미콜론으로 끝나는 경우가 아니면 추가하지 않음
    }

    return statement || text.trim();
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e) => {
    // F9: 현재 문장 실행 (TOAD 규칙)
    if (e.key === 'F9') {
      e.preventDefault();
      const cursorPos = editorRef.current?.selectionStart || 0;
      const statement = findCurrentStatement(value, cursorPos);
      setCurrentStatement(statement);
      onExecute(statement);
      return;
    }

    // Ctrl+Enter: 현재 문장 실행
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      const cursorPos = editorRef.current?.selectionStart || 0;
      const statement = findCurrentStatement(value, cursorPos);
      setCurrentStatement(statement);
      onExecute(statement);
      return;
    }

    // F5: 전체 스크립트 실행 제거
  };

  // 커서 위치 및 현재 문장 업데이트
  const handleSelectionChange = (e) => {
    const start = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, start);
    const lines = textBeforeCursor.split('\n');
    setCursorPosition({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });

    // 현재 문장 미리보기 업데이트
    const statement = findCurrentStatement(value, start);
    setCurrentStatement(statement);
  };

  // 에디터 스크롤과 라인 번호 동기화
  const handleEditorScroll = () => {
    if (editorRef.current && lineNumberRef.current) {
      lineNumberRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  // 현재 실행될 문장 하이라이트 표시
  const getCurrentStatementInfo = () => {
    if (!currentStatement.trim()) return null;
    
    const trimmed = currentStatement.trim();
    const firstWord = trimmed.split(/\s+/)[0]?.toUpperCase();
    
    let color = 'text-blue-600';
    if (firstWord === 'SELECT') color = 'text-blue-600';
    else if (['INSERT', 'UPDATE', 'DELETE'].includes(firstWord)) color = 'text-orange-600';
    else if (['CREATE', 'DROP', 'ALTER'].includes(firstWord)) color = 'text-red-600';
    
    return {
      statement: trimmed.length > 100 ? trimmed.substring(0, 100) + '...' : trimmed,
      color
    };
  };

  const statementInfo = getCurrentStatementInfo();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">SQL 쿼리 편집기</h2>
            <div className="text-sm text-gray-500">Oracle 방식 실행 지원 (F9: 현재문, F5: 전체, 드래그 선택) - SAMPLE_DATA로 동작</div>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        {/* SQL 에디터 영역 */}
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white flex">
          {/* 라인 번호 열 */}
          <div 
            ref={lineNumberRef}
            className="w-12 bg-gray-50 border-r border-gray-200 py-4 px-2 text-xs text-gray-500 font-mono overflow-hidden flex-shrink-0"
            style={{ lineHeight: '20px' }}
          >
            {value.split('\n').map((_, index) => (
              <div key={index} className="h-5 leading-5 text-right">
                {index + 1}
              </div>
            ))}
          </div>
          
          {/* 텍스트 에디터 열 */}
          <textarea 
            ref={editorRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onSelect={handleSelectionChange}
            onMouseUp={handleSelectionChange}
            onScroll={handleEditorScroll}
            rows={12}
            className="flex-1 p-4 font-mono text-sm resize-none border-none outline-none bg-white overflow-auto"
            placeholder=""
            spellCheck={false}
            style={{ 
              whiteSpace: 'pre', 
              wordWrap: 'off', 
              overflowWrap: 'normal',
              lineHeight: '20px'
            }}
          />
        </div>

        {/* 상태바 */}
        <div className="flex justify-between items-center mt-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          <div className="flex space-x-4">
            <span>Line {cursorPosition.line}, Column {cursorPosition.column}</span>
            <span>Length: {value.length} chars</span>
          </div>
          <div className="flex space-x-4">
            <span>Oracle SQL</span>
            <span>UTF-8</span>
            {isExecuting && <span className="text-blue-600">Executing...</span>}
          </div>
        </div>

        {/* 컨트롤 버튼들 */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-3">
            <button 
              onClick={() => {
                const cursorPos = editorRef.current?.selectionStart || 0;
                const statement = findCurrentStatement(value, cursorPos);
                setCurrentStatement(statement);
                onExecute(statement);
              }}
              disabled={isExecuting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {isExecuting ? '실행 중...' : '실행 (F9)'}
            </button>
            <button 
              onClick={onClearResult}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition-colors"
            >
              결과 지우기
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input 
                type="checkbox" 
                checked={isEditing}
                onChange={onToggleEdit}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
              편집 모드(인라인)
            </label>
            <div className="flex gap-2">
              <button 
                onClick={onAddRow}
                disabled={!isEditing}
                className="px-3 py-1.5 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                행 추가
              </button>
              <button 
                onClick={onDeleteRows}
                disabled={!isEditing}
                className="px-3 py-1.5 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                선택 삭제
              </button>
              <button 
                onClick={onDiscard}
                disabled={!isEditing}
                className="px-3 py-1.5 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                변경 취소
              </button>
              <button 
                onClick={onSave}
                disabled={!isEditing}
                className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                변경 저장
              </button>
            </div>
          </div>
        </div>

        {/* 실행 메시지 */}
        {execMsg && (
          <div className="mt-3 text-sm text-gray-600">{execMsg}</div>
        )}
      </div>
    </div>
  );
}

export default SQLEditor;
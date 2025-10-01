import React, { useState } from 'react';
import SQLEditor from './SQLEditor';
import SchemaBrowser from './SchemaBrowser';
import QueryResultGrid from './QueryResultGrid';

function DirectMapping({ connections, tables, setTables }) {
  // SQL 편집기 상태
  const [sqlQuery, setSqlQuery] = useState(`SELECT a.title as source,
       b.answer_text as target
  FROM articles a,
       answers b
 WHERE a.id = b.article_id
   AND ROWNUM = 1;`);

  // 쿼리 실행 상태
  const [queryResults, setQueryResults] = useState(null);
  const [queryColumns, setQueryColumns] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [affectedRows, setAffectedRows] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [execMsg, setExecMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedResults, setEditedResults] = useState(null);

  // 쿼리 실행
  const executeQuery = async (statement = null) => {
    const queryToExecute = statement || sqlQuery.trim();
    
    setIsExecuting(true);
    setExecMsg('쿼리를 실행하는 중...');
    setQueryError(null);
    
    const startTime = Date.now();
    
    try {
      if (!queryToExecute) {
        throw new Error('쿼리가 비어있습니다.');
      }

      // 실행 시뮬레이션
      await new Promise(resolve => {
        const delay = Math.random() > 0.9 ? 4000 : 1000 + Math.random() * 2000;
        setTimeout(resolve, delay);
      });
      
      const endTime = Date.now();
      const execTime = endTime - startTime;
      
      // 샘플 결과 생성 (매핑 결과 시뮬레이션)
      const results = [
        { source: 'AI란 무엇인가?', target: 'AI는 인공지능입니다.' },
        { source: 'Spring Boot 시작', target: 'Spring Boot는 스프링 기반 프레임워크입니다.' }
      ];
      const columns = ['source', 'target'];
      
      setQueryResults(results);
      setQueryColumns(columns);
      setEditedResults([...results]);
      setExecutionTime(execTime);
      setExecMsg(`${results.length}개의 매핑 결과가 조회되었습니다.`);
      
    } catch (error) {
      const endTime = Date.now();
      const execTime = endTime - startTime;
      
      setQueryError(error.message);
      setExecutionTime(execTime);
      setQueryResults(null);
      setQueryColumns([]);
      setEditedResults(null);
      setExecMsg(`오류: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // 결과 초기화
  const clearResults = () => {
    setQueryResults(null);
    setQueryColumns([]);
    setEditedResults(null);
    setQueryError(null);
    setExecutionTime(null);
    setAffectedRows(null);
    setExecMsg('');
  };

  // 편집 모드 토글
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing && queryResults) {
      setEditedResults([...queryResults]);
    }
  };

  // 셀 편집
  const handleCellEdit = (rowIndex, columnName, newValue) => {
    if (!editedResults) return;
    
    const updatedResults = [...editedResults];
    updatedResults[rowIndex] = {
      ...updatedResults[rowIndex],
      [columnName]: newValue
    };
    setEditedResults(updatedResults);
  };

  // 행 추가
  const handleAddRow = () => {
    if (!editedResults || queryColumns.length === 0) return;
    
    const newRow = {};
    queryColumns.forEach(col => {
      newRow[col] = '';
    });
    
    setEditedResults([...editedResults, newRow]);
  };

  // 행 삭제
  const handleDeleteRows = (indices) => {
    if (!editedResults) return;
    
    const updatedResults = editedResults.filter((_, index) => !indices.includes(index));
    setEditedResults(updatedResults);
  };

  // 저장
  const handleSave = () => {
    if (!editedResults) return;
    
    setQueryResults([...editedResults]);
    alert(`${editedResults.length}개의 행이 저장되었습니다.`);
  };

  // 취소
  const handleDiscard = () => {
    if (queryResults) {
      setEditedResults([...queryResults]);
    }
    alert('변경사항이 취소되었습니다.');
  };

  // 스키마 브라우저 이벤트
  const handleTableSelect = (tableName) => {
    setSqlQuery(prev => prev + tableName + ' ');
  };

  const handleColumnSelect = (tableName, columnName) => {
    setSqlQuery(prev => prev + columnName + ' ');
  };

  return (
    <div className="flex gap-6">
      {/* 왼쪽: 스키마 브라우저 */}
      <SchemaBrowser 
        connections={connections}
        tables={tables}
        onTableSelect={handleTableSelect}
        onColumnSelect={handleColumnSelect}
      />

      {/* 오른쪽: SQL 편집기 + 결과 */}
      <div className="flex-1 space-y-6">
        {/* SQL 쿼리 편집기 */}
        <SQLEditor
          value={sqlQuery}
          onChange={setSqlQuery}
          onExecute={executeQuery}
          isExecuting={isExecuting}
          execMsg={execMsg}
          isEditing={isEditing}
          onToggleEdit={toggleEditMode}
          onAddRow={handleAddRow}
          onDeleteRows={() => alert('선택된 행 삭제')}
          onDiscard={handleDiscard}
          onSave={handleSave}
          onClearResult={clearResults}
        />

        {/* 쿼리 결과 */}
        <QueryResultGrid
          results={isEditing ? editedResults : queryResults}
          columns={queryColumns}
          isLoading={isExecuting}
          executionTime={executionTime}
          affectedRows={affectedRows}
          error={queryError}
          isEditing={isEditing}
          onCellEdit={handleCellEdit}
          onAddRow={handleAddRow}
          onDeleteRows={handleDeleteRows}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      </div>
    </div>
  );
}

export default DirectMapping;
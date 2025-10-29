import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CheckCircle, XCircle, Info, Database, X } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SQLEditor from './SQLEditor';
import SchemaBrowser from './SchemaBrowser';
import QueryResultGrid from './QueryResultGrid';
import RelationMapping from './RelationMapping';
function DirectMapping({ 
  connections, 
  selectedConnection,
  tables, 
  mappings,
  addTable,
  insertData,
  selectData,
  deleteData,
  updateData,
  dropTable,
  addMapping,
  deleteMapping
}) {
  const [sqlQuery, setSqlQuery] = useState(`-- ========================================
-- 📌 실전 매핑 쿼리 예시 (바로 실행 가능!)
-- ========================================
-- 왼쪽 DB 연결을 드래그하여 연결한 후 아래 쿼리를 실행하세요.
-- 이미 존재하는 테이블(11_USERS, 11_ORDERS)을 사용합니다.

-- 1. ANSI JOIN 방식 매핑 쿼리
SELECT u.USER_NAME AS source,
       o.AMOUNT AS target
  FROM 11_USERS u
  JOIN 11_ORDERS o ON u.USER_ID = o.USER_ID;

-- 2. Oracle (+) 방식 매핑 쿼리  
SELECT u.USER_NAME AS source,
       o.AMOUNT AS target
  FROM 11_USERS u,
       11_ORDERS o
 WHERE u.USER_ID = o.USER_ID(+);

-- ========================================
-- 💡 사용 방법:
-- 1. 왼쪽에서 DB 연결을 드래그하여 'DB 연결' 영역에 드롭
-- 2. 위 쿼리 중 하나를 선택 (드래그)하고 실행 버튼 클릭
-- 3. 매핑이 자동으로 '통합 매핑 결과'에 등록됩니다!
-- ========================================`);


  const [queryResults, setQueryResults] = useState(null);
  const [queryColumns, setQueryColumns] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [affectedRows, setAffectedRows] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [execMsg, setExecMsg] = useState('');
  const [execMsgType, setExecMsgType] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedResults, setEditedResults] = useState(null);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

  // DB 연결 관련 state
  const [directConnectionId, setDirectConnectionId] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // localStorage에서 연결 정보 로드
  const [localConnections, setLocalConnections] = useState([]);
  
  React.useEffect(() => {
    const loadConnections = () => {
      try {
        const saved = localStorage.getItem('schemaBrowserConnections');
        if (saved) {
          const loaded = JSON.parse(saved);
          setLocalConnections(loaded);
        }
      } catch (error) {
        console.error('❌ localStorage 로드 실패:', error);
      }
    };
    loadConnections();
  }, []);

  // DB 연결 시 실제 테이블 기반으로 예시 쿼리 생성
  React.useEffect(() => {
    if (directConnectionId && tables && tables.length > 0) {
      // 연결된 DB의 테이블만 필터링
      const connectedTables = tables.filter(t => 
        String(t.connectionId) === String(directConnectionId)
      );

      if (connectedTables.length >= 2) {
        // 첫 번째와 두 번째 테이블 선택
        const table1 = connectedTables[0];
        const table2 = connectedTables[1];
        
        // 각 테이블의 첫 번째 컬럼 (보통 ID나 키 컬럼)
        const table1Col = table1.columns && table1.columns.length > 0 ? table1.columns[0] : 'ID';
        const table2Col = table2.columns && table2.columns.length > 0 ? table2.columns[0] : 'ID';
        
        // 두 번째 컬럼 (데이터 컬럼)
        const table1DataCol = table1.columns && table1.columns.length > 1 ? table1.columns[1] : table1Col;
        const table2DataCol = table2.columns && table2.columns.length > 1 ? table2.columns[1] : table2Col;

        const newQuery = `-- ========================================
-- 📌 실전 매핑 쿼리 예시 (바로 실행 가능!)
-- ========================================
-- 연결된 DB의 실제 테이블을 사용합니다.

-- 1. ANSI JOIN 방식 매핑 쿼리
SELECT t1.${table1DataCol} AS source,
       t2.${table2DataCol} AS target
  FROM ${table1.name} t1
  JOIN ${table2.name} t2 ON t1.${table1Col} = t2.${table2Col};

-- 2. Oracle (+) 방식 매핑 쿼리  
SELECT t1.${table1DataCol} AS source,
       t2.${table2DataCol} AS target
  FROM ${table1.name} t1,
       ${table2.name} t2
 WHERE t1.${table1Col} = t2.${table2Col}(+);

-- ========================================
-- 💡 사용 방법:
-- 1. 위 쿼리 중 하나를 선택하고 실행 버튼 클릭
-- 2. 매핑이 자동으로 '통합 매핑 결과'에 등록됩니다!
-- 
-- 📋 사용 가능한 테이블:
${connectedTables.map(t => `--   - ${t.name} (${t.columns ? t.columns.join(', ') : '컬럼 없음'})`).join('\n')}
-- ========================================`;
        
        setSqlQuery(newQuery);
      } else if (connectedTables.length === 1) {
        const table = connectedTables[0];
        const col1 = table.columns && table.columns.length > 0 ? table.columns[0] : 'COL1';
        const col2 = table.columns && table.columns.length > 1 ? table.columns[1] : 'COL2';

        const newQuery = `-- ========================================
-- 📌 연결된 DB의 테이블 정보
-- ========================================
-- 테이블: ${table.name}
-- 컬럼: ${table.columns ? table.columns.join(', ') : '없음'}

-- ⚠️ 매핑을 위해서는 최소 2개의 테이블이 필요합니다.
-- 테이블을 추가로 생성해주세요.

-- 예시: 테이블 생성
CREATE TABLE ${table.name}_RELATED (
  ${col1} NUMBER PRIMARY KEY,
  related_data VARCHAR2(100)
);

-- 매핑 쿼리 예시
SELECT t1.${col1} AS source,
       t2.related_data AS target
  FROM ${table.name} t1
  JOIN ${table.name}_RELATED t2 ON t1.${col1} = t2.${col1};
-- ========================================`;
        
        setSqlQuery(newQuery);
      } else {
        setSqlQuery(`-- ========================================
-- ⚠️ 연결된 DB에 테이블이 없습니다.
-- ========================================
-- 먼저 테이블을 생성해주세요.

-- 예시: 테이블 생성
CREATE TABLE SAMPLE_SOURCE (
  id NUMBER PRIMARY KEY,
  source_text VARCHAR2(1000)
);

CREATE TABLE SAMPLE_TARGET (
  id NUMBER PRIMARY KEY,
  source_id NUMBER,
  target_text VARCHAR2(1000)
);

-- 매핑 쿼리 예시
SELECT s.source_text AS source,
       t.target_text AS target
  FROM SAMPLE_SOURCE s
  JOIN SAMPLE_TARGET t ON s.id = t.source_id;
-- ========================================`);
      }
    }
  }, [directConnectionId, tables]);

  // props가 비어있으면 localStorage에서 가져온 것 사용
  const activeConnections = (connections && connections.length > 0) 
    ? connections 
    : localConnections;

  // 연결 정보 가져오기 함수
  const getConnectionInfo = (connectionId) => {
    const found = activeConnections.find(conn => String(conn.id) === String(connectionId));
    return found;
  };

  // 드롭 핸들러 - DB 연결
  const handleDropConnection = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const connectionId = e.dataTransfer.getData('connectionId');
    if (connectionId) {
      setDirectConnectionId(connectionId);
      
      const connInfo = getConnectionInfo(connectionId);
      const dbName = connInfo?.title || connInfo?.name || connInfo?.dbName || connInfo?.database || connInfo?.connectionName || 'DB';
      notify(
        'DB 연결됨',
        `${dbName}가 직접매핑에 연결되었습니다.`,
        'success'
      );
    }
  };

  // 드래그 오버 핸들러
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  // DB 연결 취소
  const handleClearConnection = () => {
    setDirectConnectionId(null);
    notify('DB 연결 해제', 'DB 연결이 해제되었습니다.', 'info');
  };

  const notify = (title, message, variant = 'danger') => {
    const iconMap = {
      success: <CheckCircle size={48} className="text-success mb-3" />,
      danger: <XCircle size={48} className="text-danger mb-3" />,
      info: <Info size={48} className="text-info mb-3" />
    };
    
    setAlertConfig({ title, message, variant, icon: iconMap[variant] });
    setShowAlertModal(true);
  };

  const parseCreateTable = (sql) => {
    const createTableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]+?)\)/i;
    const match = sql.match(createTableRegex);
    
    if (!match) return null;
    
    const tableName = match[1];
    const columnsStr = match[2];
    
    const columnLines = columnsStr.split(',').map(line => line.trim());
    const columns = columnLines.map(line => {
      const parts = line.split(/\s+/);
      return parts[0];
    }).filter(col => col && !col.toUpperCase().includes('PRIMARY') && !col.toUpperCase().includes('FOREIGN'));
    
    return { tableName, columns };
  };

  const parseJoinQuery = (sql) => {
    const sqlUpper = sql.toUpperCase();
    const hasOracleJoin = sql.includes('(+)');
    const hasAnsiJoin = /\bJOIN\b/i.test(sql);
    
    if (!hasOracleJoin && !hasAnsiJoin) {
      return null;
    }
    
    const selectRegex = /SELECT\s+([\s\S]+?)\s+FROM\s+([\s\S]+?)(?:WHERE|GROUP|ORDER|LIMIT|;|$)/i;
    const match = sql.match(selectRegex);
    
    if (!match) return null;
    
    const selectClause = match[1].trim();
    const fromClause = match[2].trim();
    
    let sourceTable = '';
    let labelTable = '';
    
    if (hasAnsiJoin) {
      const fromMatch = fromClause.match(/(\w+)\s+(\w+)\s+JOIN\s+(\w+)\s+(\w+)/i);
      if (fromMatch) {
        sourceTable = fromMatch[1];
        labelTable = fromMatch[3];
      }
    } else {
      const fromMatch = fromClause.match(/(\w+)\s+\w+\s*,\s*(\w+)\s+\w+/i);
      if (fromMatch) {
        sourceTable = fromMatch[1];
        labelTable = fromMatch[2];
      }
    }
    
    const sourceMatch = selectClause.match(/(\w+)\.(\w+)\s+AS\s+source/i);
    const targetMatch = selectClause.match(/(\w+)\.(\w+)\s+AS\s+target/i);
    
    if (!sourceMatch || !targetMatch) return null;
    
    let relSource = '';
    let relLabel = '';
    
    if (hasAnsiJoin) {
      const joinMatch = sql.match(/ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/i);
      if (joinMatch) {
        relSource = joinMatch[2];
        relLabel = joinMatch[4];
      }
    } else if (hasOracleJoin) {
      const oracleJoinMatch = sql.match(/WHERE\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)\(\+\)|WHERE\s+(\w+)\.(\w+)\(\+\)\s*=\s*(\w+)\.(\w+)/i);
      if (oracleJoinMatch) {
        if (oracleJoinMatch[1]) {
          relSource = oracleJoinMatch[2];
          relLabel = oracleJoinMatch[4];
        } else {
          relSource = oracleJoinMatch[6];
          relLabel = oracleJoinMatch[8];
        }
      }
    }
    
    return {
      sourceTable: sourceTable || sourceMatch[1],
      sourceColumn: sourceMatch[2],
      labelTable: labelTable || targetMatch[1],
      labelColumn: targetMatch[2],
      relSource: relSource,
      relLabel: relLabel,
      joinType: hasOracleJoin ? 'Oracle (+)' : 'ANSI JOIN'
    };
  };

  const parseSelectTable = (sql) => {
    const match = sql.match(/FROM\s+(\w+)/i);
    return match ? match[1] : null;
  };

  const executeQuery = async (statement = null) => {
    if (!directConnectionId) {
      setQueryError('DB를 연결해주세요.');
      setExecMsg('DB를 연결해주세요.');
      setExecMsgType('error');
      setQueryResults(null);
      setQueryColumns([]);
      return;
    }

    const queryToExecute = (statement !== null && statement.trim()) ? statement.trim() : sqlQuery.trim();
    
    setIsExecuting(true);
    setExecMsg('쿼리를 실행하는 중...');
    setExecMsgType('info');
    setQueryError(null);
    
    const startTime = Date.now();
    
    try {
      if (!queryToExecute) {
        throw new Error('쿼리가 비어있습니다.');
      }

      const queryUpper = queryToExecute.toUpperCase().trim();

      await new Promise(resolve => setTimeout(resolve, 800));

      if (queryUpper.startsWith('CREATE TABLE')) {
        const tableInfo = parseCreateTable(queryToExecute);
        
        if (tableInfo) {
          addTable(directConnectionId, tableInfo.tableName, tableInfo.columns);
          
          const endTime = Date.now();
          const execTime = endTime - startTime;
          
          setExecutionTime(execTime);
          setExecMsg(`✓ 테이블 '${tableInfo.tableName}'이(가) 생성되었습니다. (${tableInfo.columns.length}개 컬럼)`);
          setExecMsgType('success');
          setQueryResults(null);
          setQueryColumns([]);
          setQueryError(null);
        } else {
          throw new Error('CREATE TABLE 문법을 확인해주세요.');
        }
        
        setIsExecuting(false);
        return;
      }

      if (queryUpper.startsWith('DROP TABLE')) {
        const tableNameMatch = queryToExecute.match(/DROP\s+TABLE\s+(\w+)/i);
        if (tableNameMatch) {
          const tableName = tableNameMatch[1];
          dropTable(directConnectionId, tableName);
          
          const endTime = Date.now();
          const execTime = endTime - startTime;
          
          setExecutionTime(execTime);
          setExecMsg(`✓ 테이블 '${tableName}'이(가) 삭제되었습니다.`);
          setExecMsgType('success');
          setQueryResults(null);
          setQueryColumns([]);
          setQueryError(null);
        } else {
          throw new Error('DROP TABLE 문법을 확인해주세요.');
        }
        
        setIsExecuting(false);
        return;
      }

      if (queryUpper.startsWith('DELETE')) {
        const tableNameMatch = queryToExecute.match(/DELETE\s+FROM\s+(\w+)/i);
        
        if (tableNameMatch) {
          const tableName = tableNameMatch[1];
          deleteData(directConnectionId, tableName);
          
          const endTime = Date.now();
          const execTime = endTime - startTime;
          
          setExecutionTime(execTime);
          setAffectedRows(0);
          setExecMsg(`✓ "${tableName}" 테이블의 모든 데이터가 삭제되었습니다.`);
          setExecMsgType('success');
          setQueryResults(null);
          setQueryColumns([]);
          setQueryError(null);
        } else {
          throw new Error('DELETE FROM 문법을 확인해주세요.');
        }
        
        setIsExecuting(false);
        return;
      }

      if (queryUpper.startsWith('INSERT')) {
        const endTime = Date.now();
        const execTime = endTime - startTime;
        
        setExecutionTime(execTime);
        setAffectedRows(1);
        setExecMsg(`✓ 데이터가 삽입되었습니다. (1개 행 삽입됨)`);
        setExecMsgType('success');
        setQueryResults(null);
        setQueryColumns([]);
        setQueryError(null);
        
        setIsExecuting(false);
        return;
      }

      if (queryUpper.startsWith('UPDATE')) {
        const endTime = Date.now();
        const execTime = endTime - startTime;
        
        setExecutionTime(execTime);
        setAffectedRows(0);
        setExecMsg(`✓ 업데이트가 완료되었습니다. (0개 행 업데이트됨)`);
        setExecMsgType('success');
        setQueryResults(null);
        setQueryColumns([]);
        setQueryError(null);
        
        setIsExecuting(false);
        return;
      }

      const hasJoin = queryToExecute.toUpperCase().includes('JOIN') || queryToExecute.includes('(+)');
      
      if (hasJoin && queryUpper.startsWith('SELECT')) {
        const mappingInfo = parseJoinQuery(queryToExecute);
        
        if (mappingInfo && mappingInfo.sourceColumn && mappingInfo.labelColumn) {
          const currentTables = tables || [];
          
          // ✅ connectionId를 체크하면서 테이블 찾기
          const sourceTable = currentTables.find(t => 
            String(t.connectionId) === String(directConnectionId) && 
            t.name.toLowerCase() === mappingInfo.sourceTable.toLowerCase()
          );
          const labelTable = currentTables.find(t => 
            String(t.connectionId) === String(directConnectionId) && 
            t.name.toLowerCase() === mappingInfo.labelTable.toLowerCase()
          );
          
          // ✅ 테이블이 없어도 경고만 하고 매핑은 생성
          if (!sourceTable) {
            console.warn(`⚠️ 테이블 "${mappingInfo.sourceTable}"이(가) 현재 연결된 DB에 없습니다. 매핑은 생성되지만 실제 데이터 검증은 생략됩니다.`);
          }
          
          if (!labelTable) {
            console.warn(`⚠️ 테이블 "${mappingInfo.labelTable}"이(가) 현재 연결된 DB에 없습니다. 매핑은 생성되지만 실제 데이터 검증은 생략됩니다.`);
          }
          
          // ✅ 테이블이 있는 경우에만 컬럼 검증
          if (sourceTable) {
            const sourceColumns = sourceTable.columns.map(c => c.toLowerCase());
            
            if (!sourceColumns.includes(mappingInfo.sourceColumn.toLowerCase())) {
              throw new Error(`❌ 테이블 "${mappingInfo.sourceTable}"에 컬럼 "${mappingInfo.sourceColumn}"이(가) 존재하지 않습니다.
사용 가능한 컬럼: ${sourceColumns.join(', ')}`);
            }
            
            if (mappingInfo.relSource && !sourceColumns.includes(mappingInfo.relSource.toLowerCase())) {
              throw new Error(`❌ JOIN 조건 오류: 테이블 "${mappingInfo.sourceTable}"에 조인 컬럼 "${mappingInfo.relSource}"이(가) 존재하지 않습니다.
사용 가능한 컬럼: ${sourceColumns.join(', ')}`);
            }
          }
          
          if (labelTable) {
            const labelColumns = labelTable.columns.map(c => c.toLowerCase());
            
            if (!labelColumns.includes(mappingInfo.labelColumn.toLowerCase())) {
              throw new Error(`❌ 테이블 "${mappingInfo.labelTable}"에 컬럼 "${mappingInfo.labelColumn}"이(가) 존재하지 않습니다.
사용 가능한 컬럼: ${labelColumns.join(', ')}`);
            }
            
            if (mappingInfo.relLabel && !labelColumns.includes(mappingInfo.relLabel.toLowerCase())) {
              throw new Error(`❌ JOIN 조건 오류: 테이블 "${mappingInfo.labelTable}"에 조인 컬럼 "${mappingInfo.relLabel}"이(가) 존재하지 않습니다.
사용 가능한 컬럼: ${labelColumns.join(', ')}`);
            }
          }
          
          if (!mappingInfo.relSource || !mappingInfo.relLabel) {
            throw new Error(`❌ JOIN 조건이 올바르지 않습니다.
ANSI JOIN: ON 절에 조인 조건 필요 (예: ON src.id = tgt.source_id)
Oracle JOIN: WHERE 절에 (+) 조인 조건 필요 (예: WHERE a.id = b.id(+))`);
          }
          
          const results = [];
          const columns = ['source', 'target'];
          
          setQueryResults(results);
          setQueryColumns(columns);
          setEditedResults([]);
          setQueryError(null);
          
          const mappingData = {
            type: 'direct',
            sourceTable: mappingInfo.sourceTable,
            sourceColumn: mappingInfo.sourceColumn,
            labelTable: mappingInfo.labelTable,
            labelColumn: mappingInfo.labelColumn,
            relSource: mappingInfo.relSource,
            relLabel: mappingInfo.relLabel,
            sqlQuery: queryToExecute
          };
          
          addMapping(mappingData);
          
          const endTime = Date.now();
          const execTime = endTime - startTime;
          setExecutionTime(execTime);
          setExecMsg(`✓ 매핑이 생성되었습니다.
원본: ${mappingInfo.sourceTable}.${mappingInfo.sourceColumn}
정답: ${mappingInfo.labelTable}.${mappingInfo.labelColumn}
관계: ${mappingInfo.sourceTable}.${mappingInfo.relSource} ↔ ${mappingInfo.labelTable}.${mappingInfo.relLabel}
(${mappingInfo.joinType})`);
          setExecMsgType('success');
        } else {
          throw new Error('JOIN 쿼리에서 source, target 컬럼을 찾을 수 없습니다. (SELECT column AS source, column AS target 형식 필요)');
        }
        
        setIsExecuting(false);
        return;
      }

      if (queryUpper.startsWith('SELECT')) {
        const endTime = Date.now();
        const execTime = endTime - startTime;
        
        const tableName = parseSelectTable(queryToExecute);
        
        if (tableName) {
          const currentTables = tables || [];
          const foundTable = currentTables.find(t => t.name.toLowerCase() === tableName.toLowerCase());
          
          if (foundTable) {
            const tableData = foundTable.data || [];
            const tableColumns = foundTable.columns || [];
            
            setQueryResults(tableData);
            setQueryColumns(tableColumns);
            setEditedResults([...tableData]);
            setExecutionTime(execTime);
            setExecMsg(`✓ "${tableName}" 테이블 조회 완료: ${tableData.length}개 행 조회됨
컬럼: ${tableColumns.join(', ')}`);
            setExecMsgType('info');
            setQueryError(null);
          } else {
            throw new Error(`❌ 테이블 "${tableName}"을(를) 찾을 수 없습니다. CREATE TABLE로 먼저 생성해주세요.`);
          }
        } else {
          setQueryResults([]);
          setQueryColumns([]);
          setEditedResults([]);
          setExecutionTime(execTime);
          setExecMsg(`✓ 조회 완료: 0개 행 조회됨`);
          setExecMsgType('info');
          setQueryError(null);
        }
        
        setIsExecuting(false);
        return;
      }

      const endTime = Date.now();
      const execTime = endTime - startTime;
      
      setExecutionTime(execTime);
      setExecMsg(`✓ 쿼리가 실행되었습니다.`);
      setExecMsgType('success');
      setQueryResults(null);
      setQueryColumns([]);
      setQueryError(null);
      
    } catch (error) {
      const endTime = Date.now();
      const execTime = endTime - startTime;
      
      setQueryError(error.message);
      setExecutionTime(execTime);
      setQueryResults(null);
      setQueryColumns([]);
      setEditedResults(null);
      setExecMsg(`✗ 오류: ${error.message}`);
      setExecMsgType('error');
    } finally {
      setIsExecuting(false);
    }
  };

  const clearResults = () => {
    setQueryResults(null);
    setQueryColumns([]);
    setEditedResults(null);
    setQueryError(null);
    setExecutionTime(null);
    setAffectedRows(null);
    setExecMsg('');
    setExecMsgType('');
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing && queryResults) {
      setEditedResults([...queryResults]);
    }
  };

  const handleCellEdit = (rowIndex, columnName, newValue) => {
    if (!editedResults) return;
    
    const updatedResults = [...editedResults];
    updatedResults[rowIndex] = {
      ...updatedResults[rowIndex],
      [columnName]: newValue
    };
    setEditedResults(updatedResults);
  };

  const handleAddRow = () => {
    if (!editedResults || queryColumns.length === 0) return;
    
    const newRow = {};
    queryColumns.forEach(col => {
      newRow[col] = '';
    });
    
    setEditedResults([...editedResults, newRow]);
  };

  const handleDeleteRows = (indices) => {
    if (!editedResults) return;
    
    const updatedResults = editedResults.filter((_, index) => !indices.includes(index));
    setEditedResults(updatedResults);
  };

  const handleSave = () => {
    if (!editedResults) return;
    
    setQueryResults([...editedResults]);
    setExecMsg(`✓ ${editedResults.length}개의 행이 저장되었습니다.`);
    setExecMsgType('success');
  };

  const handleDiscard = () => {
    if (queryResults) {
      setEditedResults([...queryResults]);
    }
    setExecMsg('ℹ️ 변경사항이 취소되었습니다.');
    setExecMsgType('info');
  };

  const handleTableSelect = (tableName) => {
    setSqlQuery(prev => prev + tableName + ' ');
  };

  const handleColumnSelect = (tableName, columnName) => {
    setSqlQuery(prev => prev + columnName + ' ');
  };

  const handleSendToTraining = () => {
    if (mappings.length === 0) {
      notify('매핑 데이터 없음', '먼저 매핑을 추가해주세요.', 'danger');
      return;
    }
    
    console.log('학습 데이터 전송:', mappings);
    
    notify(
      '학습 전송 완료',
      `${mappings.length}개의 매핑 데이터가 학습 시스템으로 성공적으로 전송되었습니다.`,
      'success'
    );
  };

  return (
    <div style={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      {/* 컨텐츠 영역 */}
      <div style={{ 
        flex: 1,
        display: 'flex', 
        gap: '1.5rem',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* 왼쪽: DB 연결 + 스키마 브라우저 */}
        <div style={{ 
          width: '280px',
          minWidth: '280px',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          overflow: 'hidden'
        }}>
          {/* DB 연결 드롭 영역 */}
          <div 
            onDrop={handleDropConnection}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%)',
              border: isDraggingOver 
                ? '2px dashed #6366f1' 
                : directConnectionId 
                  ? '2px solid #6366f1' 
                  : '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '0.75rem',
              padding: '1rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            <h2 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#fff', 
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '0.5rem', 
                  height: '0.5rem', 
                  background: directConnectionId ? '#6366f1' : '#6b7280', 
                  borderRadius: '50%', 
                  marginRight: '0.5rem' 
                }}></div>
                DB 연결
              </span>
            </h2>
            
            {!directConnectionId ? (
              <div style={{
                padding: '1.5rem 1rem',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.8125rem',
                border: '2px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                background: isDraggingOver ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)'
              }}>
                <Database size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                <div style={{ marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>DB 연결 필요</div>
                <div style={{ fontSize: '0.75rem', lineHeight: '1.5' }}>
                  DB를 드래그하여<br/>
                  여기에 드롭하세요
                </div>
              </div>
            ) : (
              <div style={{
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '0.5rem',
                background: 'rgba(99, 102, 241, 0.05)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  flex: 1,
                  minWidth: 0
                }}>
                  <Database size={16} style={{ color: '#6366f1', flexShrink: 0 }} />
                  <span style={{ 
                    color: '#6366f1', 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {(() => {
                      const connInfo = getConnectionInfo(directConnectionId);
                      return connInfo?.title || connInfo?.name || connInfo?.dbName || connInfo?.database || connInfo?.connectionName || 'DB';
                    })()}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearConnection();
                  }}
                  style={{
                    marginLeft: '0.5rem',
                    padding: '0.25rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '0.25rem',
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                  title="연결 해제"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {/* 스키마 브라우저 */}
          <div style={{ 
            flex: 1,
            minHeight: 0,
            overflow: 'hidden'
          }}>
            <SchemaBrowser 
              connections={activeConnections}
              selectedConnection={directConnectionId}
              tables={tables}
              onTableSelect={handleTableSelect}
              onColumnSelect={handleColumnSelect}
            />
          </div>
        </div>

        {/* 오른쪽: SQL 편집기 + 결과 */}
        <div style={{ 
          flex: 1,
          minWidth: 0,
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          overflow: 'hidden'
        }}>
          {/* SQL 쿼리 편집기 */}
          <div style={{ flexShrink: 0 }}>
            <SQLEditor
              value={sqlQuery}
              onChange={setSqlQuery}
              onExecute={executeQuery}
              isExecuting={isExecuting}
              execMsg={execMsg}
              execMsgType={execMsgType}
              isEditing={isEditing}
              onToggleEdit={toggleEditMode}
              onAddRow={handleAddRow}
              onDeleteRows={() => setExecMsg('선택된 행 삭제 기능')}
              onDiscard={handleDiscard}
              onSave={handleSave}
              onClearResult={clearResults}
            />
          </div>

          {/* 쿼리 결과 */}
          <div style={{ 
            flex: 1,
            minHeight: 0,
            overflow: 'hidden'
          }}>
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


          {/* 통합 매핑 결과 */}
          {mappings && mappings.length > 0 && (
            <RelationMapping
              mappings={mappings}
              deleteMapping={deleteMapping}
              title="통합 매핑 결과"
              isIntegrated={true}
              showSendButton={true}
              onSendToTraining={handleSendToTraining}
            />
          )}
        </div>
      </div>

      {/* 알림 Modal */}
      <Modal 
        show={showAlertModal} 
        onHide={() => setShowAlertModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Body className="text-center p-4">
          {alertConfig.icon}
          <h5 className="fw-bold mb-3">{alertConfig.title}</h5>
          <p className="text-muted mb-4">{alertConfig.message}</p>
          <Button 
            variant={alertConfig.variant}
            onClick={() => setShowAlertModal(false)}
            className="px-4 shadow-sm"
            style={{ 
              borderRadius: '12px',
              background: alertConfig.variant === 'success' 
                ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                : alertConfig.variant === 'info'
                ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
                : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              border: 'none'
            }}
          >
            확인
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DirectMapping;
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CheckCircle, XCircle, Info, Database, X } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SchemaBrowser from './SchemaBrowser';
import RelationMapping from './RelationMapping';
function SelectMapping({ 
  connections: propsConnections, 
  selectedConnection,
  tables, 
  mappings,
  addMapping,
  deleteMapping
}) {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

  // localStorage에서 연결 정보 로드
  const [localConnections, setLocalConnections] = useState([]);
  
  useEffect(() => {
    const loadConnections = () => {
      try {
        const saved = localStorage.getItem('schemaBrowserConnections');
        if (saved) {
          const loaded = JSON.parse(saved);
          console.log('💾 localStorage에서 로드한 connections:', loaded);
          setLocalConnections(loaded);
        }
      } catch (error) {
        console.error('❌ localStorage 로드 실패:', error);
      }
    };
    
    loadConnections();
  }, []);

  // props가 비어있으면 localStorage에서 가져온 것 사용
  const connections = (propsConnections && propsConnections.length > 0) 
    ? propsConnections 
    : localConnections;
  
  console.log('🔌 SelectMapping이 사용하는 connections:', connections);

  const notify = (title, message, variant = 'danger') => {
    const iconMap = {
      success: <CheckCircle size={48} style={{ color: '#48bb78', marginBottom: '1rem' }} />,
      danger: <XCircle size={48} style={{ color: '#f56565', marginBottom: '1rem' }} />,
      info: <Info size={48} style={{ color: '#4299e1', marginBottom: '1rem' }} />
    };
    
    setAlertConfig({ title, message, variant, icon: iconMap[variant] });
    setShowAlertModal(true);
  };
  
  const [sourceTable, setSourceTable] = useState('');
  const [labelTable, setLabelTable] = useState('');
  const [sourceColumn, setSourceColumn] = useState('');
  const [labelColumn, setLabelColumn] = useState('');
  const [relationSourceColumn, setRelationSourceColumn] = useState('');
  const [relationLabelColumn, setRelationLabelColumn] = useState('');

  // 학습 모델 관련 state 추가
  const [modelNameSelect, setModelNameSelect] = useState('');
  const [modelNameInput, setModelNameInput] = useState('');

  // 드래그 앤 드롭을 위한 연결 ID 상태
  const [sourceConnectionId, setSourceConnectionId] = useState(null);
  const [labelConnectionId, setLabelConnectionId] = useState(null);
  const [isDraggingOverSource, setIsDraggingOverSource] = useState(false);
  const [isDraggingOverLabel, setIsDraggingOverLabel] = useState(false);

  // 스토리보드: 연결별 샘플 테이블 저장
  const [connectionTables, setConnectionTables] = useState({});

  // 연결 정보 가져오기 함수 (먼저 선언)
  const getConnectionInfo = (connectionId) => {
    console.log('🔍 getConnectionInfo 호출:', { connectionId, connections });
    const found = connections.find(conn => String(conn.id) === String(connectionId));
    console.log('✅ 찾은 연결:', found);
    return found;
  };

  // 샘플 테이블 생성 함수
  const generateSampleTables = (connectionId) => {
    const connInfo = getConnectionInfo(connectionId);
    const dbName = connInfo?.title || connInfo?.name || connInfo?.dbName || connInfo?.database || connInfo?.connectionName || 'DB';
    
    return [
      {
        name: `${dbName}_USERS`,
        columns: ['USER_ID', 'USER_NAME', 'EMAIL']
      },
      {
        name: `${dbName}_ORDERS`,
        columns: ['ORDER_ID', 'USER_ID', 'AMOUNT']
      }
    ];
  };

  // 연결별 테이블 가져오기
  const getTablesForConnection = (connectionId) => {
    if (!connectionId) return [];
    
    // 이미 생성된 샘플 테이블이 있으면 반환
    if (connectionTables[connectionId]) {
      return connectionTables[connectionId];
    }
    
    // 없으면 샘플 테이블 생성
    const newTables = generateSampleTables(connectionId);
    setConnectionTables(prev => ({
      ...prev,
      [connectionId]: newTables
    }));
    
    return newTables;
  };

  const sourceTables = sourceConnectionId ? getTablesForConnection(sourceConnectionId) : [];
  const labelTables = labelConnectionId ? getTablesForConnection(labelConnectionId) : [];

  // 드롭 핸들러
  const handleDropSource = (e) => {
    e.preventDefault();
    setIsDraggingOverSource(false);
    
    const connectionId = e.dataTransfer.getData('connectionId');
    if (connectionId) {
      console.log('🎯 원본 영역에 드롭된 connectionId:', connectionId);
      setSourceConnectionId(connectionId);
      setSourceTable('');
      setSourceColumn('');
      setRelationSourceColumn('');
      
      const connInfo = getConnectionInfo(connectionId);
      const dbName = connInfo?.title || connInfo?.name || connInfo?.dbName || connInfo?.database || connInfo?.connectionName || 'DB';
      notify('원본 DB 연결됨', `${dbName}가 원본 영역에 연결되었습니다.`, 'success');
    }
  };

  const handleDropLabel = (e) => {
    e.preventDefault();
    setIsDraggingOverLabel(false);
    
    const connectionId = e.dataTransfer.getData('connectionId');
    if (connectionId) {
      console.log('🎯 정답 영역에 드롭된 connectionId:', connectionId);
      setLabelConnectionId(connectionId);
      setLabelTable('');
      setLabelColumn('');
      setRelationLabelColumn('');
      
      const connInfo = getConnectionInfo(connectionId);
      const dbName = connInfo?.title || connInfo?.name || connInfo?.dbName || connInfo?.database || connInfo?.connectionName || 'DB';
      notify('정답 DB 연결됨', `${dbName}가 정답 영역에 연결되었습니다.`, 'success');
    }
  };

  const handleDragOverSource = (e) => {
    e.preventDefault();
    setIsDraggingOverSource(true);
  };

  const handleDragLeaveSource = () => {
    setIsDraggingOverSource(false);
  };

  const handleDragOverLabel = (e) => {
    e.preventDefault();
    setIsDraggingOverLabel(true);
  };

  const handleDragLeaveLabel = () => {
    setIsDraggingOverLabel(false);
  };

  // 연결 해제 핸들러
  const handleClearSource = () => {
    setSourceConnectionId(null);
    setSourceTable('');
    setSourceColumn('');
    setRelationSourceColumn('');
    notify('원본 DB 연결 해제', '원본 DB 연결이 해제되었습니다.', 'info');
  };

  const handleClearLabel = () => {
    setLabelConnectionId(null);
    setLabelTable('');
    setLabelColumn('');
    setRelationLabelColumn('');
    notify('정답 DB 연결 해제', '정답 DB 연결이 해제되었습니다.', 'info');
  };

  const handleTableSelect = (tableName) => {
    console.log('테이블 선택:', tableName);
  };

  const handleColumnSelect = (tableName, columnName) => {
    console.log('컬럼 선택:', tableName, columnName);
  };

  const handleAddMapping = () => {
    if (!sourceTable || !labelTable || !sourceColumn || !labelColumn || !relationSourceColumn || !relationLabelColumn) {
      notify('입력 오류', '모든 필드를 입력해주세요.', 'danger');
      return;
    }

    const mapping = {
      id: Date.now(),
      type: 'select',
      sourceTable,
      labelTable,
      sourceColumn,
      labelColumn,
      relSource: relationSourceColumn,
      relLabel: relationLabelColumn
    };

    addMapping(mapping);
    
    notify('매핑 추가', '새로운 매핑이 추가되었습니다.', 'success');
    
    setSourceTable('');
    setLabelTable('');
    setSourceColumn('');
    setLabelColumn('');
    setRelationSourceColumn('');
    setRelationLabelColumn('');
  };

  const getColumnOptions = (tableName, connectionId) => {
    const tablesForConnection = getTablesForConnection(connectionId);
    const table = tablesForConnection.find(t => t.name === tableName);
    if (!table) return null;
    
    return table.columns.map(col => (
      <option key={col} value={col} style={{ background: '#2a3046', color: '#fff' }}>
        {col}
      </option>
    ));
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
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .select-card {
          background: linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 0.75rem;
          padding: 1.25rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .drop-zone {
          transition: all 0.3s;
        }
        .drop-zone.dragging {
          border-color: rgba(99, 102, 241, 0.8) !important;
          background: rgba(99, 102, 241, 0.1) !important;
          transform: scale(1.02);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
        }
        .db-connected-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
          border: 1px solid rgba(34, 197, 94, 0.5);
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #22c55e;
        }
      `}</style>

      {/* 컨텐츠 영역 */}
      <div style={{ 
        flex: 1,
        display: 'flex', 
        gap: '1.5rem',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* 왼쪽: 스키마 브라우저 */}
        <div style={{ 
          width: '280px',
          minWidth: '280px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <SchemaBrowser 
            connections={connections}
            tables={tables}
            onTableSelect={handleTableSelect}
            onColumnSelect={handleColumnSelect}
            selectedConnection={selectedConnection}
          />
        </div>

        {/* 오른쪽: 메인 컨텐츠 */}
        <div style={{ 
          flex: 1,
          minWidth: 0,
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          overflow: 'hidden'
        }}>
          {/* 테이블 선택 */}
          <div style={{ 
            flexShrink: 0,
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1.5rem' 
          }}>
            {/* 원본 테이블 */}
            <div 
              className={`select-card drop-zone ${isDraggingOverSource ? 'dragging' : ''}`}
              onDrop={handleDropSource}
              onDragOver={handleDragOverSource}
              onDragLeave={handleDragLeaveSource}
              style={{
                border: sourceConnectionId 
                  ? '2px solid rgba(34, 197, 94, 0.5)'
                  : '1px solid rgba(99, 102, 241, 0.3)'
              }}
            >
              <h2 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '1rem', 
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '0.75rem', 
                    height: '0.75rem', 
                    background: sourceConnectionId ? '#22c55e' : '#6b7280', 
                    borderRadius: '50%', 
                    marginRight: '0.5rem' 
                  }}></div>
                  원본 테이블
                </span>
                {sourceConnectionId && (
                  <span className="db-connected-badge">
                    <Database size={16} />
                    {(() => {
                      const connInfo = getConnectionInfo(sourceConnectionId);
                      const dbName = connInfo?.title || connInfo?.name || connInfo?.dbName || connInfo?.database || connInfo?.connectionName || '원본 DB';
                      console.log('🖥️ 원본 DB 이름:', dbName);
                      return dbName;
                    })()}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearSource();
                      }}
                      style={{
                        marginLeft: '0.5rem',
                        padding: '0.125rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '0.25rem',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                      title="연결 해제"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </h2>
              
              {!sourceConnectionId ? (
                <div style={{
                  padding: '3rem 1rem',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.875rem',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.02)'
                }}>
                  <Database size={48} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                  <div style={{ marginBottom: '0.5rem', fontWeight: '600', fontSize: '1rem' }}>DB 연결 필요</div>
                  <div style={{ fontSize: '0.75rem', lineHeight: '1.5' }}>
                    왼쪽 'DB 연결 정보'에서<br/>
                    DB를 드래그하여 여기에 드롭하세요
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
                      테이블 선택
                    </label>
                    <select
                      value={sourceTable}
                      onChange={(e) => {
                        setSourceTable(e.target.value);
                        setSourceColumn('');
                        setRelationSourceColumn('');
                      }}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="" style={{ background: '#2a3046', color: '#fff' }}>-- 테이블 선택 --</option>
                      {sourceTables.map(table => (
                        <option key={table.name} value={table.name} style={{ background: '#2a3046', color: '#fff' }}>
                          {table.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
                        원본 컬럼
                      </label>
                      <select
                        value={sourceColumn}
                        onChange={(e) => setSourceColumn(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '0.5rem',
                          color: '#fff',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                        disabled={!sourceTable}
                      >
                        <option value="" style={{ background: '#2a3046', color: '#fff' }}>-- 컬럼 선택 --</option>
                        {sourceTable && sourceConnectionId && getColumnOptions(sourceTable, sourceConnectionId)}
                      </select>
                      {sourceColumn && (
                        <div style={{ 
                          marginTop: '0.5rem', 
                          fontSize: '0.75rem', 
                          color: 'rgba(59, 130, 246, 0.8)',
                          padding: '0.5rem',
                          background: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '0.375rem'
                        }}>
                          선택됨: {sourceTable}.{sourceColumn}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 정답 테이블 */}
            <div 
              className={`select-card drop-zone ${isDraggingOverLabel ? 'dragging' : ''}`}
              onDrop={handleDropLabel}
              onDragOver={handleDragOverLabel}
              onDragLeave={handleDragLeaveLabel}
              style={{
                border: labelConnectionId 
                  ? '2px solid rgba(168, 85, 247, 0.5)'
                  : '1px solid rgba(99, 102, 241, 0.3)'
              }}
            >
              <h2 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '1rem', 
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '0.75rem', 
                    height: '0.75rem', 
                    background: labelConnectionId ? '#a855f7' : '#6b7280', 
                    borderRadius: '50%', 
                    marginRight: '0.5rem' 
                  }}></div>
                  정답 테이블
                </span>
                {labelConnectionId && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
                    border: '1px solid rgba(168, 85, 247, 0.5)',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#a855f7'
                  }}>
                    <Database size={16} />
                    {(() => {
                      const connInfo = getConnectionInfo(labelConnectionId);
                      return connInfo?.title || connInfo?.name || connInfo?.dbName || connInfo?.database || connInfo?.connectionName || '정답 DB';
                    })()}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearLabel();
                      }}
                      style={{
                        marginLeft: '0.5rem',
                        padding: '0.125rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '0.25rem',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                      title="연결 해제"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </h2>
              
              {!labelConnectionId ? (
                <div style={{
                  padding: '3rem 1rem',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.875rem',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.02)'
                }}>
                  <Database size={48} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                  <div style={{ marginBottom: '0.5rem', fontWeight: '600', fontSize: '1rem' }}>DB 연결 필요</div>
                  <div style={{ fontSize: '0.75rem', lineHeight: '1.5' }}>
                    왼쪽 'DB 연결 정보'에서<br/>
                    DB를 드래그하여 여기에 드롭하세요
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
                      테이블 선택
                    </label>
                    <select
                      value={labelTable}
                      onChange={(e) => {
                        setLabelTable(e.target.value);
                        setLabelColumn('');
                        setRelationLabelColumn('');
                      }}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="" style={{ background: '#2a3046', color: '#fff' }}>-- 테이블 선택 --</option>
                      {labelTables.map(table => (
                        <option key={table.name} value={table.name} style={{ background: '#2a3046', color: '#fff' }}>
                          {table.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem', display: 'block', fontWeight: '600' }}>
                        정답 컬럼
                      </label>
                      <select
                        value={labelColumn}
                        onChange={(e) => setLabelColumn(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '0.5rem',
                          color: '#fff',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                        disabled={!labelTable}
                      >
                        <option value="" style={{ background: '#2a3046', color: '#fff' }}>-- 컬럼 선택 --</option>
                        {labelTable && labelConnectionId && getColumnOptions(labelTable, labelConnectionId)}
                      </select>
                      {labelColumn && (
                        <div style={{ 
                          marginTop: '0.5rem', 
                          fontSize: '0.75rem', 
                          color: 'rgba(168, 85, 247, 0.8)',
                          padding: '0.5rem',
                          background: 'rgba(168, 85, 247, 0.1)',
                          borderRadius: '0.375rem'
                        }}>
                          선택됨: {labelTable}.{labelColumn}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 관계 매핑 & 버튼 */}
          <div className="select-card" style={{ flexShrink: 0 }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem', 
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '0.75rem', height: '0.75rem', background: '#8b5cf6', borderRadius: '50%', marginRight: '0.5rem' }}></div>
                테이블 관계 매핑
              </span>
              
              <button
                onClick={handleAddMapping}
                disabled={!sourceTable || !labelTable || !sourceColumn || !labelColumn || !relationSourceColumn || !relationLabelColumn}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: (!sourceTable || !labelTable || !sourceColumn || !labelColumn || !relationSourceColumn || !relationLabelColumn)
                    ? 'rgba(99, 102, 241, 0.3)'
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: (!sourceTable || !labelTable || !sourceColumn || !labelColumn || !relationSourceColumn || !relationLabelColumn) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.2s',
                  opacity: (!sourceTable || !labelTable || !sourceColumn || !labelColumn || !relationSourceColumn || !relationLabelColumn) ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (sourceTable && labelTable && sourceColumn && labelColumn && relationSourceColumn && relationLabelColumn) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
                }}
              >
                매핑 추가
              </button>
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1.5rem',
              padding: '1rem',
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '0.5rem'
            }}>
              <div>
                <label style={{ 
                  fontSize: '0.875rem', 
                  color: 'rgba(59, 130, 246, 1)', 
                  marginBottom: '0.5rem', 
                  display: 'block', 
                  fontWeight: '600' 
                }}>
                  원본 관계 컬럼
                </label>
                <select
                  value={relationSourceColumn}
                  onChange={(e) => setRelationSourceColumn(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                  disabled={!sourceTable}
                >
                  <option value="" style={{ background: '#2a3046', color: '#fff' }}>-- 관계 컬럼 선택 --</option>
                  {sourceTable && sourceConnectionId && getColumnOptions(sourceTable, sourceConnectionId)}
                </select>
                {sourceTable && relationSourceColumn && (
                  <div style={{ 
                    marginTop: '0.5rem', 
                    fontSize: '0.75rem', 
                    color: 'rgba(59, 130, 246, 0.8)',
                    padding: '0.5rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '0.375rem'
                  }}>
                    선택됨: {sourceTable}.{relationSourceColumn}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  fontSize: '0.875rem', 
                  color: 'rgba(168, 85, 247, 1)', 
                  marginBottom: '0.5rem', 
                  display: 'block', 
                  fontWeight: '600' 
                }}>
                  정답 관계 컬럼
                </label>
                <select
                  value={relationLabelColumn}
                  onChange={(e) => setRelationLabelColumn(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                  disabled={!labelTable}
                >
                  <option value="" style={{ background: '#2a3046', color: '#fff' }}>-- 관계 컬럼 선택 --</option>
                  {labelTable && labelConnectionId && getColumnOptions(labelTable, labelConnectionId)}
                </select>
                {labelTable && relationLabelColumn && (
                  <div style={{ 
                    marginTop: '0.5rem', 
                    fontSize: '0.75rem', 
                    color: 'rgba(168, 85, 247, 0.8)',
                    padding: '0.5rem',
                    background: 'rgba(168, 85, 247, 0.1)',
                    borderRadius: '0.375rem'
                  }}>
                    선택됨: {labelTable}.{relationLabelColumn}
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* 매핑 결과 */}
          <RelationMapping
            mappings={mappings}
            deleteMapping={deleteMapping}
            title="매핑 결과"
            isIntegrated={false}
            showSendButton={false}
          />
        </div>
      </div>

      {/* 알림 Modal */}
      <Modal 
        show={showAlertModal} 
        onHide={() => setShowAlertModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Body 
          style={{
            background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '2rem',
            textAlign: 'center'
          }}
        >
          {alertConfig.icon}
          <h5 style={{ fontWeight: '700', marginBottom: '1rem', color: '#fff', fontSize: '1.25rem' }}>
            {alertConfig.title}
          </h5>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
            {alertConfig.message}
          </p>
          <Button 
            onClick={() => setShowAlertModal(false)}
            style={{ 
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              background: alertConfig.variant === 'success' 
                ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                : alertConfig.variant === 'info'
                ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
                : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            확인
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default SelectMapping;
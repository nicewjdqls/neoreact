import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import SourceDBConfigModal from './SourceDBConfigModal';
import 'bootstrap/dist/css/bootstrap.min.css';

function SchemaBrowser({ tables, onTableSelect, onColumnSelect, selectedConnection: externalSelectedConnection, onConnectionChange, connections: externalConnections }) {
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [expandedTables, setExpandedTables] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // 알림 모달 상태 추가
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'success',
    icon: null
  });

  // 연결별 샘플 테이블 저장 (SelectMapping과 동일)
  const [connectionTables, setConnectionTables] = useState({});

  // 컴포넌트 마운트 시 저장된 연결 정보 로드
  useEffect(() => {
    loadConnections();
  }, []);

  // 외부에서 connections prop이 제공되면 사용
  useEffect(() => {
    if (externalConnections && externalConnections.length > 0) {
      setConnections(externalConnections);
    }
  }, [externalConnections]);

  // 외부에서 selectedConnection이 변경되면 동기화
  useEffect(() => {
    if (externalSelectedConnection !== undefined) {
      setSelectedConnection(externalSelectedConnection);
    }
  }, [externalSelectedConnection]);

  useEffect(() => {
    console.log('=== SchemaBrowser tables 업데이트 ===');
    console.log('테이블 개수:', tables.length);
    console.log('테이블 목록:', tables.map(t => t.name));
  }, [tables]);

  const loadConnections = () => {
    const saved = localStorage.getItem('schemaBrowserConnections');
    if (saved) {
      try {
        const loadedConnections = JSON.parse(saved);
        setConnections(loadedConnections);
      } catch (error) {
        console.error('연결 정보 로드 실패:', error);
      }
    }
  };

  // 알림 표시 함수 (index.jsx와 동일)
  const showNotification = (title, message, variant = 'success') => {
    const iconMap = {
      success: <CheckCircle size={48} style={{ color: '#48bb78', marginBottom: '1rem' }} />,
      danger: <XCircle size={48} style={{ color: '#f56565', marginBottom: '1rem' }} />,
      info: <Info size={48} style={{ color: '#4299e1', marginBottom: '1rem' }} />
    };
    
    setAlertConfig({
      title,
      message,
      variant,
      icon: iconMap[variant]
    });
    setShowAlertModal(true);
  };

  // 연결 정보 가져오기 함수
  const getConnectionInfo = (connectionId) => {
    const found = connections.find(conn => String(conn.id) === String(connectionId));
    return found;
  };

  // 샘플 테이블 생성 함수 (SelectMapping과 동일)
  const generateSampleTables = (connectionId) => {
    const connInfo = getConnectionInfo(connectionId);
    const dbName = connInfo?.title || connInfo?.name || connInfo?.dbName || connInfo?.database || connInfo?.connectionName || 'DB';
    
    return [
      {
        name: `${dbName}_USERS`,
        columns: ['USER_ID', 'USER_NAME', 'EMAIL'],
        connectionId: connectionId  // ✅ connectionId 추가
      },
      {
        name: `${dbName}_ORDERS`,
        columns: ['ORDER_ID', 'USER_ID', 'AMOUNT'],
        connectionId: connectionId  // ✅ connectionId 추가
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

  // 표시할 테이블 결정: tables prop이 있으면 사용, 없으면 샘플 테이블 사용
  const displayTables = tables && tables.length > 0 
    ? tables 
    : (selectedConnection ? getTablesForConnection(selectedConnection) : []);

  const toggleTable = (tableName) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  const filteredTables = displayTables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.columns.some(col => col.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleTableClick = (tableName) => {
    if (onTableSelect) {
      onTableSelect(tableName);
    }
    toggleTable(tableName);
  };

  const handleColumnClick = (tableName, columnName) => {
    if (onColumnSelect) {
      onColumnSelect(tableName, columnName);
    }
  };

  const handleConnectionClick = (connId) => {
    setSelectedConnection(connId);
    if (onConnectionChange) {
      onConnectionChange(connId);
    }
  };

  const getConnectionStatus = (status) => {
    return status === 'connected' ? 
      <div style={{ width: '0.5rem', height: '0.5rem', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s ease-in-out infinite' }}></div> :
      <div style={{ width: '0.5rem', height: '0.5rem', background: '#ef4444', borderRadius: '50%' }}></div>;
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // SourceDBConfigModal에서 선택한 DB들을 추가
  const handleSelectConnections = (selectedConnections) => {
    console.log('선택된 DB 연결:', selectedConnections);
    
    // 기존 connections와 합치되, 중복 제거
    const existingIds = connections.map(c => c.id);
    const newConnections = selectedConnections
      .filter(conn => !existingIds.includes(conn.id))
      .map(conn => ({
        ...conn,
        status: 'connected' // ✅ 녹색 상태로 설정
      }));
    
    if (newConnections.length === 0) {
      showNotification('알림', '이미 추가된 DB 연결입니다.', 'info');
      return;
    }

    const updatedConnections = [...connections, ...newConnections];
    setConnections(updatedConnections);
    
    // localStorage에 저장
    localStorage.setItem('schemaBrowserConnections', JSON.stringify(updatedConnections));
    
    showNotification('추가 완료', `${newConnections.length}개의 DB 연결이 추가되었습니다.`, 'success');
    
    // 첫 번째 새 연결을 자동 선택
    if (newConnections.length > 0) {
      handleConnectionClick(newConnections[0].id);
    }
  };

  // DB 연결 삭제
  const handleDeleteConnection = (e, id) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    
    const updatedConnections = connections.filter(conn => conn.id !== id);
    setConnections(updatedConnections);
    localStorage.setItem('schemaBrowserConnections', JSON.stringify(updatedConnections));
    
    // 삭제된 연결이 현재 선택된 연결이면 선택 해제
    if (selectedConnection === id) {
      setSelectedConnection(null);
      if (onConnectionChange) {
        onConnectionChange(null);
      }
    }
    
    // 해당 연결의 샘플 테이블도 삭제
    setConnectionTables(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    
    showNotification('삭제 완료', 'DB 연결이 삭제되었습니다.', 'success');
  };

  // 드래그 시작 핸들러
  const handleDragStart = (e, connection) => {
    console.log('🎯 DB 드래그 시작:', connection);
    e.dataTransfer.setData('connectionId', connection.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div style={{ 
      width: '100%',
      height: '100%',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .scrollbar-hide::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          borderRadius: 2px;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>

      {/* DB 연결 정보 */}
      <div style={{
        flexShrink: 0,
        background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '0.75rem',
        padding: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', margin: 0 }}>
            DB 연결 정보
          </h2>
          <button 
            onClick={handleOpenModal}
            style={{
              padding: '0.375rem 0.75rem',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '0.375rem',
              color: '#6366f1',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
          >
            + DB 추가
          </button>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem',
          maxHeight: '200px',
          overflowY: 'auto'
        }} className="scrollbar-hide">
          {connections.length === 0 ? (
            <div style={{
              padding: '1.5rem 1rem',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.8125rem',
              border: '1px dashed rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>연결된 DB가 없습니다</div>
              <div style={{ fontSize: '0.75rem' }}>
                "+ DB 추가" 버튼을 눌러<br/>
                DB를 연결하세요
              </div>
            </div>
          ) : (
            connections.map(conn => (
              <div
                key={conn.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, conn)}
                onClick={() => handleConnectionClick(conn.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.5rem',
                  cursor: 'grab',
                  background: selectedConnection === conn.id 
                    ? 'rgba(99, 102, 241, 0.2)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: selectedConnection === conn.id 
                    ? '1px solid rgba(99, 102, 241, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedConnection !== conn.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedConnection !== conn.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                  {getConnectionStatus(conn.status)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '0.8125rem', 
                      fontWeight: '600', 
                      color: selectedConnection === conn.id ? '#6366f1' : '#fff',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {conn.title || conn.name || conn.dbName || conn.database || conn.connectionName || 'DB'}
                    </div>
                    <div style={{ 
                      fontSize: '0.6875rem', 
                      color: 'rgba(255, 255, 255, 0.5)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {conn.host || conn.server || 'localhost'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteConnection(e, conn.id)}
                  style={{
                    marginLeft: '0.5rem',
                    padding: '0.25rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '0.25rem',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  }}
                  title="연결 삭제"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 테이블 & 컬럼 */}
      <div style={{
        flex: 1,
        minHeight: 0,
        background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '0.75rem',
        padding: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#fff', flexShrink: 0 }}>
          테이블 & 컬럼
        </h2>
        
        {!selectedConnection ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.8125rem',
            padding: '2rem 1rem'
          }}>
            <div>
              <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>DB를 선택하세요</div>
              <div style={{ fontSize: '0.75rem', lineHeight: '1.5' }}>
                위에서 DB 연결을 선택하면<br/>
                테이블 목록이 표시됩니다
              </div>
            </div>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="테이블 또는 컬럼 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flexShrink: 0,
                width: '100%',
                padding: '0.5rem 0.75rem',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: '0.8125rem',
                marginBottom: '0.75rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
            />
            
            <div style={{ 
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }} className="scrollbar-hide">
              {filteredTables.length === 0 ? (
                <div style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.8125rem'
                }}>
                  {searchTerm ? '검색 결과가 없습니다' : '예시 테이블을 생성 중입니다...'}
                </div>
              ) : (
                filteredTables.map((table) => (
                  <div key={table.name} style={{
                    flexShrink: 0,
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.03)'
                  }}>
                    <div
                      draggable={true}
                      onDragStart={(e) => {
                        console.log('🎯 테이블 드래그 시작:', table.name);
                        const dragData = {
                          type: 'table',
                          tableName: table.name,
                          columns: table.columns,
                          connectionId: selectedConnection
                        };
                        e.dataTransfer.setData('application/json', JSON.stringify(dragData));
                        e.dataTransfer.effectAllowed = 'copy';
                        e.currentTarget.style.opacity = '0.5';
                      }}
                      onDragEnd={(e) => {
                        console.log('🎯 테이블 드래그 종료:', table.name);
                        e.currentTarget.style.opacity = '1';
                      }}
                      onClick={() => handleTableClick(table.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        cursor: 'grab',
                        transition: 'all 0.2s',
                        background: expandedTables[table.name] 
                          ? 'rgba(99, 102, 241, 0.15)' 
                          : 'transparent'
                      }}
                      title={`${table.name} (드래그 가능)`}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = expandedTables[table.name] 
                        ? 'rgba(99, 102, 241, 0.15)' 
                        : 'transparent'
                      }
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                        <div style={{ width: '0.5rem', height: '0.5rem', background: '#3b82f6', borderRadius: '50%', flexShrink: 0 }}></div>
                        <span style={{ 
                          fontWeight: '600', 
                          color: '#fff', 
                          fontSize: '0.8125rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {table.name}
                        </span>
                        <span style={{ 
                          fontSize: '0.6875rem', 
                          color: 'rgba(255, 255, 255, 0.5)',
                          flexShrink: 0
                        }}>
                          ({table.columns.length})
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        color: 'rgba(255, 255, 255, 0.6)',
                        transform: expandedTables[table.name] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        flexShrink: 0
                      }}>
                        ▼
                      </span>
                    </div>
                    
                    {expandedTables[table.name] && (
                      <div style={{ 
                        padding: '0.5rem 0.75rem 0.5rem 1.75rem',
                        background: 'rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}>
                        {table.columns.map((column) => (
                          <div
                            key={column}
                            draggable={true}
                            onDragStart={(e) => {
                              console.log('🎯 컬럼 드래그 시작:', `${table.name}.${column}`);
                              const dragData = {
                                type: 'column',
                                tableName: table.name,
                                columnName: column,
                                connectionId: selectedConnection
                              };
                              e.dataTransfer.setData('application/json', JSON.stringify(dragData));
                              e.dataTransfer.effectAllowed = 'copy';
                              e.currentTarget.style.opacity = '0.5';
                              e.stopPropagation();
                            }}
                            onDragEnd={(e) => {
                              console.log('🎯 컬럼 드래그 종료:', `${table.name}.${column}`);
                              e.currentTarget.style.opacity = '1';
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0.25rem',
                              borderRadius: '0.25rem',
                              cursor: 'grab',
                              fontSize: '0.75rem',
                              color: 'rgba(255, 255, 255, 0.7)',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => handleColumnClick(table.name, column)}
                            title={`${table.name}.${column}`}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                              e.currentTarget.style.color = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                            }}
                          >
                            <div style={{ width: '0.5rem', height: '0.5rem', background: '#f97316', borderRadius: '50%', marginRight: '0.5rem', flexShrink: 0 }}></div>
                            <span style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>{column}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* DB 선택 모달 */}
      <SourceDBConfigModal 
        show={showModal}
        onClose={handleCloseModal}
        onSelect={handleSelectConnections}
      />

      {/* 알림 모달 (index.jsx와 동일한 디자인) */}
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

export default SchemaBrowser;
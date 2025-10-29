import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { CheckCircle, XCircle, Info, List, Save } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MonitoringLayout from '../../components/MonitoringLayout';
import SelectMapping from './SelectMapping';
import DirectMapping from './DirectMapping';
import MappingListModal from './MappingListModal';

function Datacollector({ selectedMapping: initialMapping }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('select');
  const [connections, setConnections] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [tables, setTables] = useState({});
  const [mappings, setMappings] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showMappingListModal, setShowMappingListModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [pendingMapping, setPendingMapping] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 현재 선택된 매핑 정보
  const [currentMapping, setCurrentMapping] = useState(initialMapping || null);
  
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

  // 초기 매핑 정보 로드
  useEffect(() => {
    if (initialMapping) {
      loadMappingData(initialMapping);
    }
  }, [initialMapping]);

  // 매핑 데이터 로드 함수
  const loadMappingData = (mapping) => {
    console.log('📥 매핑 데이터 로드:', mapping);
    setCurrentMapping(mapping);
    
    // 신규 매핑이 아닌 경우 기존 데이터 로드
    if (!mapping.isNew && mapping.id !== 'new') {
      // localStorage에서 해당 매핑의 저장된 데이터 로드
      const savedMappingData = localStorage.getItem(`mapping_${mapping.id}`);
      if (savedMappingData) {
        try {
          const data = JSON.parse(savedMappingData);
          
          // DB 연결 정보 복원
          if (data.connections && data.connections.length > 0) {
            setConnections(data.connections);
            setSelectedConnection(data.selectedConnection || data.connections[0].id);
          }
          
          // 테이블 정보 복원
          if (data.tables) {
            setTables(data.tables);
          }
          
          // 매핑 정보 복원
          if (data.mappings) {
            setMappings(data.mappings);
          }
          
          showNotification(
            '매핑 불러오기 완료',
            `"${mapping.title}" 매핑을 불러왔습니다.`,
            'success'
          );
        } catch (error) {
          console.error('매핑 데이터 로드 실패:', error);
          showNotification('오류', '매핑 데이터를 불러오는 중 오류가 발생했습니다.', 'danger');
        }
      } else {
        // 저장된 데이터가 없으면 빈 상태로 시작
        showNotification(
          '새 작업 시작',
          `"${mapping.title}" 매핑을 시작합니다.`,
          'info'
        );
      }
    } else {
      // 신규 매핑
      showNotification(
        '신규 매핑 생성',
        `"${mapping.title}" 새로운 매핑을 시작합니다.`,
        'info'
      );
    }
    
    setHasUnsavedChanges(false);
  };

  // 매핑 데이터 저장 함수
  const saveMappingData = () => {
    if (!currentMapping) {
      showNotification('오류', '저장할 매핑이 선택되지 않았습니다.', 'danger');
      return false;
    }

    try {
      const mappingData = {
        connections,
        selectedConnection,
        tables,
        mappings,
        savedAt: new Date().toISOString()
      };

      localStorage.setItem(`mapping_${currentMapping.id}`, JSON.stringify(mappingData));
      setHasUnsavedChanges(false);
      
      showNotification(
        '저장 완료',
        `"${currentMapping.title}" 매핑이 저장되었습니다.`,
        'success'
      );
      
      return true;
    } catch (error) {
      console.error('매핑 데이터 저장 실패:', error);
      showNotification('저장 실패', '매핑 데이터를 저장하는 중 오류가 발생했습니다.', 'danger');
      return false;
    }
  };

  const showNotification = (title, message, variant = 'danger') => {
    const iconMap = {
      success: <CheckCircle size={48} className="text-success mb-3" />,
      danger: <XCircle size={48} className="text-danger mb-3" />,
      info: <Info size={48} className="text-info mb-3" />
    };
    
    setAlertConfig({ title, message, variant, icon: iconMap[variant] });
    setShowAlertModal(true);
  };

  // 매핑 목록 버튼 클릭 핸들러
  const handleMappingListClick = () => {
    if (hasUnsavedChanges) {
      // 저장되지 않은 변경사항이 있으면 확인 모달 표시
      setShowSaveConfirmModal(true);
    } else {
      // 변경사항이 없으면 바로 매핑 목록 모달 표시
      setShowMappingListModal(true);
    }
  };

  // 저장 확인 모달에서 "저장" 선택
  const handleSaveAndOpenList = () => {
    const saved = saveMappingData();
    setShowSaveConfirmModal(false);
    if (saved) {
      setShowMappingListModal(true);
    }
  };

  // 저장 확인 모달에서 "저장 안 함" 선택
  const handleOpenListWithoutSave = () => {
    setShowSaveConfirmModal(false);
    setShowMappingListModal(true);
  };

  // 매핑 선택 핸들러
  const handleSelectMapping = (mapping) => {
    setPendingMapping(mapping);
    setShowMappingListModal(false);
    
    // 현재 매핑과 다른 매핑을 선택했는지 확인
    if (currentMapping && currentMapping.id !== mapping.id && hasUnsavedChanges) {
      setShowSaveConfirmModal(true);
    } else {
      // 변경사항이 없거나 같은 매핑이면 바로 로드
      loadMappingData(mapping);
    }
  };

  // 저장 후 매핑 전환
  const handleSaveAndSwitch = () => {
    const saved = saveMappingData();
    setShowSaveConfirmModal(false);
    if (saved && pendingMapping) {
      loadMappingData(pendingMapping);
      setPendingMapping(null);
    }
  };

  // 저장 없이 매핑 전환
  const handleSwitchWithoutSave = () => {
    setShowSaveConfirmModal(false);
    if (pendingMapping) {
      loadMappingData(pendingMapping);
      setPendingMapping(null);
    }
  };

  const addTable = (connectionId, tableName, columns) => {
    setTables(prev => {
      const connectionTables = prev[connectionId] || [];
      const existingIndex = connectionTables.findIndex(t => t.name === tableName);
      
      if (existingIndex >= 0) {
        const updated = [...connectionTables];
        updated[existingIndex] = { ...updated[existingIndex], columns: columns };
        return { ...prev, [connectionId]: updated };
      }
      
      return {
        ...prev,
        [connectionId]: [...connectionTables, { name: tableName, columns: columns, data: [] }]
      };
    });
    setHasUnsavedChanges(true);
  };

  const insertData = (connectionId, tableName, rowData) => {
    setTables(prev => {
      const connectionTables = prev[connectionId] || [];
      const tableIndex = connectionTables.findIndex(t => t.name === tableName);
      if (tableIndex === -1) return prev;
      
      const updated = [...connectionTables];
      updated[tableIndex] = {
        ...updated[tableIndex],
        data: [...updated[tableIndex].data, rowData]
      };
      
      return { ...prev, [connectionId]: updated };
    });
    setHasUnsavedChanges(true);
  };

  const selectData = (connectionId, tableName) => {
    const connectionTables = tables[connectionId] || [];
    const table = connectionTables.find(t => t.name === tableName);
    return table ? { columns: table.columns, data: table.data } : null;
  };

  const deleteData = (connectionId, tableName) => {
    setTables(prev => {
      const connectionTables = prev[connectionId] || [];
      const tableIndex = connectionTables.findIndex(t => t.name === tableName);
      if (tableIndex === -1) return prev;
      
      const updated = [...connectionTables];
      updated[tableIndex] = { ...updated[tableIndex], data: [] };
      
      return { ...prev, [connectionId]: updated };
    });
    setHasUnsavedChanges(true);
  };

  const updateData = (connectionId, tableName, newData) => {
    setTables(prev => {
      const connectionTables = prev[connectionId] || [];
      const tableIndex = connectionTables.findIndex(t => t.name === tableName);
      if (tableIndex === -1) return prev;
      
      const updated = [...connectionTables];
      updated[tableIndex] = { ...updated[tableIndex], data: newData };
      
      return { ...prev, [connectionId]: updated };
    });
    setHasUnsavedChanges(true);
  };

  const dropTable = (connectionId, tableName) => {
    setTables(prev => {
      const connectionTables = prev[connectionId] || [];
      const filtered = connectionTables.filter(t => t.name !== tableName);
      return { ...prev, [connectionId]: filtered };
    });
    setHasUnsavedChanges(true);
  };

  const addMapping = (mapping) => {
    setMappings(prev => [...prev, { ...mapping, id: Date.now(), createdAt: new Date().toISOString() }]);
    setHasUnsavedChanges(true);
  };

  const deleteMapping = (mappingId) => {
    setMappings(prev => prev.filter(m => m.id !== mappingId));
    setHasUnsavedChanges(true);
  };

  const getCurrentTables = () => {
    return selectedConnection ? (tables[selectedConnection] || []) : [];
  };

  const getCurrentMappings = () => {
    return mappings;
  };

  // SourceDBConfigModal에서 선택한 DB 연결 정보들을 추가하는 함수
  const handleAddConnections = (selectedConnections) => {
    let addedCount = 0;
    const newConnections = [...connections];
    
    selectedConnections.forEach(dbConn => {
      const exists = connections.some(conn => 
        conn.host === dbConn.host && 
        conn.port === dbConn.port && 
        conn.dbName === dbConn.dbName && 
        conn.user === dbConn.user
      );

      if (!exists) {
        const newConnection = {
          id: newConnections.length + addedCount + 1,
          name: dbConn.title || `${dbConn.dbName} (${dbConn.host})`,
          host: dbConn.host,
          port: dbConn.port,
          dbName: dbConn.dbName,
          user: dbConn.user,
          status: 'connected'
        };
        
        newConnections.push(newConnection);
        setTables(prev => ({ ...prev, [newConnection.id]: [] }));
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setConnections(newConnections);
      
      if (connections.length === 0) {
        setSelectedConnection(newConnections[0].id);
      }
      
      setHasUnsavedChanges(true);
      
      showNotification(
        '연결 추가 완료', 
        `${addedCount}개의 DB 연결이 추가되었습니다.`, 
        'success'
      );
    } else {
      showNotification(
        '중복 연결', 
        '선택한 DB 연결이 이미 존재합니다.', 
        'info'
      );
    }
  };

  return (
    <MonitoringLayout
      title="Neo AI Portal"
      subtitle="Data Collection & Mapping"
      environment="Production"
      showNavigation={true}
    >
      <div style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, #1e2139 0%, #2a3046 100%)',
        minHeight: '100vh'
      }}>
        {/* 헤더 섹션 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            {/* 제목 및 정보 */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <h1 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '700', 
                  color: '#fff',
                  margin: 0
                }}>
                  데이터수집 및 매핑
                </h1>
                {hasUnsavedChanges && (
                  <span style={{
                    padding: '0.375rem 0.75rem',
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#fbbf24'
                  }}>
                    저장되지 않음
                  </span>
                )}
              </div>
              
              {/* 현재 작업 중인 매핑 제목 표시 */}
              {currentMapping && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '0.875rem 1.25rem',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <svg style={{ width: '1.25rem', height: '1.25rem', color: '#6366f1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.125rem' }}>
                      현재 작업 중
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>
                      {currentMapping.title}
                    </div>
                  </div>
                </div>
              )}
              
              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                데이터베이스 연결 및 학습 데이터 매핑을 구성하세요
              </p>
            </div>
            
            {/* 버튼 그룹 */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {/* 저장 버튼 */}
              <button 
                onClick={saveMappingData}
                disabled={!hasUnsavedChanges || !currentMapping}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: hasUnsavedChanges && currentMapping
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: hasUnsavedChanges && currentMapping ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: hasUnsavedChanges && currentMapping ? 'pointer' : 'not-allowed',
                  boxShadow: hasUnsavedChanges && currentMapping ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (hasUnsavedChanges && currentMapping) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (hasUnsavedChanges && currentMapping) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                  }
                }}
              >
                <Save size={16} />
                저장
              </button>

              {/* 매핑 목록 버튼 */}
              <button 
                onClick={handleMappingListClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
                }}
              >
                <List size={16} />
                매핑 목록
              </button>

              {/* 테이블 매핑(Chain) 버튼 */}
              <button 
                onClick={() => navigate('/datacollectorchain')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                }}
              >
                <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                테이블 매핑(Chain)
              </button>
            </div>
          </div>

          {/* DB 선택 */}
          {connections.length > 0 && (
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' }}>
                연결된 DB:
              </label>
              <select
                value={selectedConnection || ''}
                onChange={(e) => setSelectedConnection(Number(e.target.value))}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- DB 선택 --</option>
                {connections.map(conn => (
                  <option key={conn.id} value={conn.id} style={{ background: '#2a3046', color: '#fff' }}>
                    {conn.name} {conn.status === 'connected' ? '✓' : '✗'}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                ({getCurrentTables().length}개 테이블, {getCurrentMappings().length}개 매핑)
              </span>
            </div>
          )}

          {/* 탭 선택 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' }}>
                매핑 방식:
              </span>
              <div style={{ 
                display: 'flex', 
                background: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '0.75rem', 
                padding: '0.375rem',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
              }}>
                <button
                  onClick={() => setActiveTab('select')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: activeTab === 'select' 
                      ? 'rgba(99, 102, 241, 0.9)' 
                      : 'transparent',
                    color: activeTab === 'select' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                    transform: activeTab === 'select' ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: activeTab === 'select' ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
                  }}
                >
                  <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  선택매핑
                </button>
                <button
                  onClick={() => setActiveTab('direct')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: activeTab === 'direct' 
                      ? 'rgba(99, 102, 241, 0.9)' 
                      : 'transparent',
                    color: activeTab === 'direct' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                    transform: activeTab === 'direct' ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: activeTab === 'direct' ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
                  }}
                >
                  <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  직접매핑
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              <div style={{ 
                width: '0.5rem', 
                height: '0.5rem', 
                borderRadius: '50%', 
                background: activeTab === 'select' ? '#6366f1' : '#10b981'
              }}></div>
              <span style={{ fontWeight: '500' }}>
                {activeTab === 'select' ? 'UI 기반 테이블 매핑' : 'SQL 기반 직접 매핑'}
              </span>
            </div>
          </div>
        </div>

        {/* 탭별 컨텐츠 */}
        {activeTab === 'select' ? (
          <SelectMapping 
            connections={connections}
            selectedConnection={selectedConnection}
            tables={getCurrentTables()}
            mappings={getCurrentMappings()}
            addMapping={addMapping}
            deleteMapping={deleteMapping}
            onAddConnections={handleAddConnections}
          />
        ) : (
          <DirectMapping 
            connections={connections}
            selectedConnection={selectedConnection}
            tables={getCurrentTables()}
            mappings={getCurrentMappings()}
            addTable={addTable}
            insertData={insertData}
            selectData={selectData}
            deleteData={deleteData}
            updateData={updateData}
            dropTable={dropTable}
            addMapping={addMapping}
            deleteMapping={deleteMapping}
            onAddConnections={handleAddConnections}
          />
        )}

        {/* 매핑 목록 모달 */}
        <MappingListModal
          show={showMappingListModal}
          onClose={() => setShowMappingListModal(false)}
          onSelectMapping={handleSelectMapping}
        />

        {/* 저장 확인 모달 */}
        <Modal 
          show={showSaveConfirmModal} 
          onHide={() => setShowSaveConfirmModal(false)}
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
            <Info size={48} style={{ color: '#4299e1', marginBottom: '1rem' }} />
            <h5 style={{ fontWeight: '700', marginBottom: '1rem', color: '#fff', fontSize: '1.25rem' }}>
              저장되지 않은 변경사항
            </h5>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
              현재 작업 중인 내용을 저장하시겠습니까?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button 
                onClick={() => setShowSaveConfirmModal(false)}
                style={{ 
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                취소
              </Button>
              <Button 
                onClick={pendingMapping ? handleSwitchWithoutSave : handleOpenListWithoutSave}
                style={{ 
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                저장 안 함
              </Button>
              <Button 
                onClick={pendingMapping ? handleSaveAndSwitch : handleSaveAndOpenList}
                style={{ 
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                저장
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        {/* 알림 모달 */}
        <Modal show={showAlertModal} onHide={() => setShowAlertModal(false)} centered backdrop="static">
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
    </MonitoringLayout>
  );
}

export default Datacollector;
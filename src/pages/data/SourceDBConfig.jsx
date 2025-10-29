import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Plus, Edit2, Trash2, Save, X, CheckCircle, XCircle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MonitoringLayout from '../../components/MonitoringLayout';
import DataCollectionConnection from './DataCollectionConnection';

function SourceDBConfig() {
  const [dbConnections, setDbConnections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    host: '',
    port: '',
    dbName: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    host: '',
    port: '1521',
    dbName: '',
    user: '',
    password: ''
  });
  
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

  // 로컬스토리지에서 DB 연결 정보 로드
  useEffect(() => {
    loadDBConnections();
  }, []);

  const loadDBConnections = () => {
    const saved = localStorage.getItem('sourceDBConnections');
    if (saved) {
      try {
        setDbConnections(JSON.parse(saved));
      } catch (error) {
        console.error('DB 연결 정보 로드 실패:', error);
      }
    }
  };

  const saveDBConnections = (connections) => {
    localStorage.setItem('sourceDBConnections', JSON.stringify(connections));
    setDbConnections(connections);
  };

  const showNotification = (title, message, variant = 'danger') => {
    const iconMap = {
      success: <CheckCircle size={48} className="text-success mb-3" />,
      danger: <XCircle size={48} className="text-danger mb-3" />
    };
    
    setAlertConfig({ title, message, variant, icon: iconMap[variant] });
    setShowAlertModal(true);
  };

  const handleOpenModal = () => {
    setFormData({
      title: '',
      host: '',
      port: '1521',
      dbName: '',
      user: '',
      password: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      title: '',
      host: '',
      port: '1521',
      dbName: '',
      user: '',
      password: ''
    });
  };

  const handleSave = () => {
    if (!formData.title || !formData.host || !formData.dbName || !formData.user) {
      showNotification('필수 정보 누락', 'DB연결제목, 호스트, DB이름, 사용자계정은 필수 입력 항목입니다.', 'danger');
      return;
    }

    const currentUser = localStorage.getItem('userName') || '관리자';
    const now = new Date().toISOString();

    // 신규 추가
    const newConnection = {
      id: Date.now(),
      ...formData,
      createdBy: currentUser,
      createdAt: now,
      updatedBy: currentUser,
      updatedAt: now
    };
    saveDBConnections([...dbConnections, newConnection]);
    showNotification('추가 완료', 'DB 연결 정보가 추가되었습니다.', 'success');

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updated = dbConnections.filter(conn => conn.id !== id);
      saveDBConnections(updated);
      setSelectedConnection(null);
      showNotification('삭제 완료', 'DB 연결 정보가 삭제되었습니다.', 'success');
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRowClick = (conn) => {
    if (selectedConnection?.id === conn.id) {
      setSelectedConnection(null);
    } else {
      setSelectedConnection(conn);
      setEditFormData({
        title: conn.title,
        host: conn.host,
        port: conn.port,
        dbName: conn.dbName
      });
    }
  };

  const handleSaveDetail = () => {
    if (!editFormData.title || !editFormData.host || !editFormData.dbName) {
      showNotification('필수 정보 누락', 'DB연결제목, 호스트, DB이름은 필수 입력 항목입니다.', 'danger');
      return;
    }

    const currentUser = localStorage.getItem('userName') || '관리자';
    const now = new Date().toISOString();

    const updated = dbConnections.map(conn => 
      conn.id === selectedConnection.id 
        ? { 
            ...conn, 
            title: editFormData.title,
            host: editFormData.host,
            port: editFormData.port,
            dbName: editFormData.dbName,
            updatedBy: currentUser,
            updatedAt: now
          }
        : conn
    );
    
    saveDBConnections(updated);
    const updatedConnection = updated.find(conn => conn.id === selectedConnection.id);
    setSelectedConnection(updatedConnection);
    
    showNotification('수정 완료', 'DB 연결 정보가 수정되었습니다.', 'success');
  };

  return (
    <MonitoringLayout activeMenu="code1" onMenuChange={() => {}}>
      <div style={{ background: '#1e2139', minHeight: '100vh', padding: '1.5rem' }}>
        <style>{`
          .db-config-card {
            background: linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
          .db-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: rgba(30, 33, 57, 0.8);
            border-radius: 8px;
            overflow: hidden;
          }
          .db-table thead {
            background: rgba(54, 61, 90, 0.6);
          }
          .db-table th {
            padding: 1rem;
            color: #ffffff;
            font-weight: 600;
            font-size: 0.875rem;
            text-align: left;
            border-bottom: 2px solid rgba(99, 102, 241, 0.3);
          }
          .db-table td {
            padding: 0.875rem 1rem;
            color: #ffffff;
            font-size: 0.875rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .db-table tbody tr:hover {
            background: rgba(99, 102, 241, 0.15);
          }
          .db-table tbody tr:last-child td {
            border-bottom: none;
          }
          .db-table tbody tr.clickable-row {
            cursor: pointer;
          }
          .db-table tbody tr.selected-row {
            background: rgba(99, 102, 241, 0.25);
          }
          .detail-section {
            background: rgba(30, 33, 57, 0.9);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 8px;
            padding: 1.5rem;
            margin-top: 1.5rem;
          }
          .detail-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            padding: 0.625rem 0.875rem;
            font-size: 0.875rem;
            color: #fff;
            outline: none;
            transition: all 0.2s;
          }
          .detail-input:focus {
            border: 1px solid rgba(99, 102, 241, 0.6);
            background: rgba(255, 255, 255, 0.15);
          }
        `}</style>

        {/* 헤더 */}
        <div className="db-config-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
                DB 연결정보 설정
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                원본/정답 데이터베이스 연결 정보를 관리합니다
              </p>
            </div>
            <button
              onClick={handleOpenModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
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
              <Plus size={18} />
              신규 추가
            </button>
          </div>
        </div>

        {/* DB 연결 목록 테이블 */}
        <div className="db-config-card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>
            등록된 DB 연결 목록
          </h2>
          
          {dbConnections.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 0', 
              color: 'rgba(255, 255, 255, 0.5)' 
            }}>
              <svg style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H4V7z" />
              </svg>
              <p style={{ fontSize: '0.875rem' }}>등록된 DB 연결 정보가 없습니다</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>신규 추가 버튼을 눌러 DB 연결을 등록하세요</p>
            </div>
          ) : (
            <table className="db-table">
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>순번</th>
                  <th style={{ width: '20%' }}>DB연결제목</th>
                  <th style={{ width: '25%' }}>호스트:포트</th>
                  <th style={{ width: '15%' }}>DB명</th>
                  <th style={{ width: '15%' }}>등록자</th>
                  <th style={{ width: '20%' }}>등록일시</th>
                </tr>
              </thead>
              <tbody>
                {dbConnections.map((conn, index) => (
                  <tr 
                    key={conn.id} 
                    onClick={() => handleRowClick(conn)}
                    className={`clickable-row ${selectedConnection?.id === conn.id ? 'selected-row' : ''}`}
                  >
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#6366f1' }}>
                      {index + 1}
                    </td>
                    <td style={{ fontWeight: '600' }}>{conn.title}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      {conn.host}:{conn.port}
                    </td>
                    <td>{conn.dbName}</td>
                    <td>{conn.createdBy}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {new Date(conn.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 선택된 연결의 상세 정보 */}
        {selectedConnection && (
          <div className="detail-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fff' }}>
                상세 정보
              </h3>
              <button
                onClick={() => handleDelete(selectedConnection.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Trash2 size={16} />
                삭제
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', display: 'block', marginBottom: '0.5rem' }}>
                  DB연결제목
                </label>
                <input
                  type="text"
                  className="detail-input"
                  value={editFormData.title}
                  onChange={(e) => handleEditInputChange('title', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', display: 'block', marginBottom: '0.5rem' }}>
                  호스트
                </label>
                <input
                  type="text"
                  className="detail-input"
                  value={editFormData.host}
                  onChange={(e) => handleEditInputChange('host', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', display: 'block', marginBottom: '0.5rem' }}>
                  포트
                </label>
                <input
                  type="text"
                  className="detail-input"
                  value={editFormData.port}
                  onChange={(e) => handleEditInputChange('port', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', display: 'block', marginBottom: '0.5rem' }}>
                  DB 이름
                </label>
                <input
                  type="text"
                  className="detail-input"
                  value={editFormData.dbName}
                  onChange={(e) => handleEditInputChange('dbName', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', display: 'block', marginBottom: '0.5rem' }}>
                  사용자 계정
                </label>
                <input
                  type="text"
                  className="detail-input"
                  value={selectedConnection.user}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', display: 'block', marginBottom: '0.5rem' }}>
                  수정자
                </label>
                <input
                  type="text"
                  className="detail-input"
                  value={selectedConnection.updatedBy}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={handleSaveDetail}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.5rem',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                }}
              >
                <Save size={16} />
                수정 저장
              </button>
            </div>
          </div>
        )}

        {/* ⭐ DataCollectionConnection 컴포넌트 사용 */}
        <DataCollectionConnection
          show={showModal}
          onClose={handleCloseModal}
          dbForm={formData}
          setDbForm={setFormData}
          onSave={handleSave}
        />

        {/* 알림 모달 */}
        {showAlertModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.98) 0%, rgba(54, 61, 90, 0.98) 100%)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              textAlign: 'center',
              minWidth: '20rem'
            }}>
              {alertConfig.icon}
              <h5 style={{ color: '#fff', fontWeight: '600', marginBottom: '1rem' }}>
                {alertConfig.title}
              </h5>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem' }}>
                {alertConfig.message}
              </p>
              <Button
                onClick={() => setShowAlertModal(false)}
                style={{
                  background: alertConfig.variant === 'success' ? '#10b981' : '#ef4444',
                  border: 'none',
                  padding: '0.5rem 2rem',
                  fontWeight: '600'
                }}
              >
                확인
              </Button>
            </div>
          </div>
        )}
      </div>
    </MonitoringLayout>
  );
}

export default SourceDBConfig;
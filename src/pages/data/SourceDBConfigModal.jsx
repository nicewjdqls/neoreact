import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CheckCircle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

function SourceDBConfigModal({ show, onClose, onSelect }) {
  const [dbConnections, setDbConnections] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로컬스토리지에서 DB 연결 정보 로드
  useEffect(() => {
    if (show) {
      console.log('📂 SourceDBConfigModal 열림 - DB 연결 정보 로드');
      loadDBConnections();
      setSelectedIds([]);
      setIsSubmitting(false); // 모달 열릴 때 제출 상태 초기화
    }
  }, [show]);

  const loadDBConnections = () => {
    const saved = localStorage.getItem('sourceDBConnections');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('📥 sourceDBConnections 로드:', parsed);
        setDbConnections(parsed);
      } catch (error) {
        console.error('DB 연결 정보 로드 실패:', error);
      }
    } else {
      console.log('⚠️ sourceDBConnections 없음');
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === dbConnections.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(dbConnections.map(conn => conn.id));
    }
  };

  const handleAddSelected = () => {
    // ⭐ 중복 제출 방지
    if (isSubmitting) {
      console.log('⚠️ 이미 제출 중 - 중복 호출 방지');
      return;
    }
    
    console.log('=== handleAddSelected 시작 ===');
    console.log('선택된 ID들:', selectedIds);
    
    const selectedConnections = dbConnections.filter(conn => selectedIds.includes(conn.id));
    console.log('선택된 DB 연결:', selectedConnections);
    
    if (selectedConnections.length === 0) {
      alert('추가할 DB 연결을 선택해주세요.');
      return;
    }
    
    setIsSubmitting(true); // 제출 중 플래그 설정
    
    // onSelect 호출
    console.log('📤 onSelect 호출');
    onSelect(selectedConnections);
    
    // 약간의 지연 후 모달 닫기 (상태 업데이트가 완료되도록)
    setTimeout(() => {
      console.log('🚪 모달 닫기');
      onClose();
      setIsSubmitting(false);
    }, 100);
  };

  return (
    <Modal 
      show={show} 
      onHide={() => {
        console.log('❌ Modal onHide 호출됨');
        if (!isSubmitting) {
          onClose();
        }
      }} 
      size="lg" 
      centered 
      backdrop="static"
    >
      <Modal.Body 
        style={{
          background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
          color: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '2rem'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
            DB 연결 선택
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
            추가할 DB 연결 정보를 선택하세요
          </p>
        </div>
        
        {/* Body Content */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '1.5rem' }}>
          {dbConnections.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 0', 
              color: 'rgba(255, 255, 255, 0.5)' 
            }}>
              <svg style={{ 
                width: '3rem', 
                height: '3rem', 
                margin: '0 auto 1rem', 
                opacity: 0.5 
              }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H4V7z" />
              </svg>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>등록된 DB 연결 정보가 없습니다</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                먼저 'DB연결정보관리' 메뉴에서 DB 연결을 등록해주세요
              </p>
            </div>
          ) : (
            <>
              {/* 전체 선택 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                marginBottom: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={toggleSelectAll}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'}
              >
                <div style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  border: '2px solid rgba(99, 102, 241, 0.8)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: selectedIds.length === dbConnections.length 
                    ? 'rgba(99, 102, 241, 0.8)' 
                    : 'transparent',
                  transition: 'all 0.2s'
                }}>
                  {selectedIds.length === dbConnections.length && (
                    <CheckCircle size={16} color="#fff" />
                  )}
                </div>
                <span style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#fff' 
                }}>
                  전체 선택 ({selectedIds.length}/{dbConnections.length})
                </span>
              </div>

              {/* DB 연결 목록 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dbConnections.map(conn => (
                  <div
                    key={conn.id}
                    style={{
                      padding: '1rem',
                      background: selectedIds.includes(conn.id)
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: selectedIds.includes(conn.id)
                        ? '2px solid rgba(99, 102, 241, 0.8)'
                        : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: selectedIds.includes(conn.id)
                        ? '0 0 0 2px rgba(99, 102, 241, 0.2)'
                        : 'none'
                    }}
                    onClick={() => toggleSelection(conn.id)}
                    onMouseEnter={(e) => {
                      if (!selectedIds.includes(conn.id)) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedIds.includes(conn.id)) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      {/* 체크박스 */}
                      <div style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        border: '2px solid rgba(99, 102, 241, 0.8)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: selectedIds.includes(conn.id) 
                          ? 'rgba(99, 102, 241, 0.8)' 
                          : 'transparent',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                        marginTop: '0.125rem'
                      }}>
                        {selectedIds.includes(conn.id) && (
                          <CheckCircle size={16} color="#fff" />
                        )}
                      </div>

                      {/* DB 정보 */}
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600', 
                          color: '#fff',
                          marginBottom: '0.5rem'
                        }}>
                          {conn.title}
                        </div>
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(2, 1fr)', 
                          gap: '0.5rem',
                          fontSize: '0.75rem',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}>
                          <div>
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>호스트: </span>
                            {conn.host}:{conn.port}
                          </div>
                          <div>
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>DB명: </span>
                            {conn.dbName}
                          </div>
                          <div>
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>계정: </span>
                            {conn.user}
                          </div>
                          <div>
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>등록자: </span>
                            {conn.createdBy || '관리자'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Footer Buttons */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <Button
            onClick={() => {
              console.log('취소 버튼 클릭');
              onClose();
            }}
            disabled={isSubmitting}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              opacity: isSubmitting ? 0.5 : 1
            }}
            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            취소
          </Button>
          <Button
            onClick={handleAddSelected}
            disabled={selectedIds.length === 0 || isSubmitting}
            style={{
              padding: '0.75rem 1.5rem',
              background: (selectedIds.length === 0 || isSubmitting)
                ? 'rgba(99, 102, 241, 0.3)'
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: (selectedIds.length === 0 || isSubmitting) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: (selectedIds.length === 0 || isSubmitting) ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (selectedIds.length > 0 && !isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedIds.length > 0 && !isSubmitting) {
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isSubmitting ? '추가 중...' : `선택 추가 (${selectedIds.length}개)`}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SourceDBConfigModal;
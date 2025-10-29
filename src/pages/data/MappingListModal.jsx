import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Plus, FileText, X, Calendar, User } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

function MappingListModal({ show, onClose, onSelectMapping }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMappingForm, setShowNewMappingForm] = useState(false);
  const [newMappingTitle, setNewMappingTitle] = useState('');

  // 샘플 데이터 3개
  const sampleMappings = [
    {
      id: 1,
      title: '고객 주문 데이터 수집',
      createdBy: '김철수',
      createdAt: '2025-10-20T09:30:00',
      updatedBy: '김철수',
      updatedAt: '2025-10-23T14:22:00'
    },
    {
      id: 2,
      title: '재고 관리 시스템 수집',
      createdBy: '이영희',
      createdAt: '2025-10-18T11:15:00',
      updatedBy: '박민수',
      updatedAt: '2025-10-24T10:05:00'
    },
    {
      id: 3,
      title: '회원 정보 통합 수집',
      createdBy: '정다은',
      createdAt: '2025-10-15T16:45:00',
      updatedBy: '정다은',
      updatedAt: '2025-10-22T09:30:00'
    }
  ];

  const filteredMappings = sampleMappings.filter(mapping =>
    mapping.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mapping.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMappingClick = (mapping) => {
    // 선택한 매핑 정보를 부모 컴포넌트로 전달
    onSelectMapping(mapping);
  };

  const handleCreateNewClick = () => {
    // 신규 생성 폼 표시
    setShowNewMappingForm(true);
  };

  const handleConfirmNewMapping = () => {
    // 제목 유효성 검사
    if (!newMappingTitle.trim()) {
      alert('데이터수집 제목을 입력해주세요.');
      return;
    }

    // ✅ 수정: 신규 매핑 객체 생성하여 Datacollector로 전달
    const newMapping = {
      id: 'new',
      title: newMappingTitle.trim(),
      isNew: true,
      createdBy: '현재사용자', // 실제로는 세션에서 가져와야 함
      createdAt: new Date().toISOString(),
      updatedBy: '현재사용자',
      updatedAt: new Date().toISOString()
    };

    // 부모 컴포넌트로 신규 매핑 전달 (Datacollector로 이동)
    onSelectMapping(newMapping);
  };

  const handleCancelNewMapping = () => {
    setShowNewMappingForm(false);
    setNewMappingTitle('');
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      size="xl"
      backdrop="static"
    >
      <div style={{
        background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.98) 0%, rgba(54, 61, 90, 0.98) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '1rem',
        minHeight: '70vh',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <style>{`
          .mapping-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            overflow: hidden;
          }
          .mapping-table thead {
            background: rgba(99, 102, 241, 0.2);
            position: sticky;
            top: 0;
            z-index: 10;
          }
          .mapping-table th {
            padding: 1rem;
            color: #fff;
            font-weight: 600;
            font-size: 0.875rem;
            text-align: left;
            border-bottom: 2px solid rgba(99, 102, 241, 0.3);
          }
          .mapping-table td {
            padding: 0.875rem 1rem;
            color: #fff;
            font-size: 0.875rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .mapping-table tbody tr {
            cursor: pointer;
            transition: all 0.2s;
          }
          .mapping-table tbody tr:hover {
            background: rgba(99, 102, 241, 0.15);
            transform: scale(1.01);
          }
          .mapping-table tbody tr:last-child td {
            border-bottom: none;
          }
          .title-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: #fff;
            outline: none;
          }
          .title-input:focus {
            border: 1px solid rgba(99, 102, 241, 0.6);
          }
          .title-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
        `}</style>

        {/* 헤더 */}
        <div style={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
          padding: '1.5rem',
          background: 'transparent',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'rgba(99, 102, 241, 0.2)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={20} color="#6366f1" />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontWeight: '700', margin: 0, fontSize: '1.5rem' }}>
                  {showNewMappingForm ? '신규 데이터수집 생성' : '데이터수집 목록'}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', margin: 0, fontSize: '0.875rem' }}>
                  {showNewMappingForm ? '데이터수집 제목을 입력하세요' : '작업할 데이터수집을 선택하거나 새로 생성하세요'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                padding: '0.25rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
            >
              <X size={28} />
            </button>
          </div>

          {/* 검색 및 신규 생성 버튼 (신규 폼이 아닐 때만 표시) */}
          {!showNewMappingForm && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="제목 또는 작성자로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    fontSize: '0.875rem',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
                <svg
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1rem',
                    height: '1rem',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={handleCreateNewClick}
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
                <Plus size={18} />
                신규 생성
              </button>
            </div>
          )}
        </div>

        {/* 본문 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {showNewMappingForm ? (
            /* 신규 데이터수집 제목 입력 폼 */
            <div style={{ 
              maxWidth: '600px', 
              margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
              padding: '2rem'
            }}>
              {/* 제목 입력 */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#fff',
                  marginBottom: '0.75rem'
                }}>
                  <FileText size={18} color="#6366f1" />
                  데이터수집 제목
                </label>
                <input
                  type="text"
                  className="title-input"
                  placeholder="예: 고객 주문 데이터 수집"
                  value={newMappingTitle}
                  onChange={(e) => setNewMappingTitle(e.target.value)}
                  autoFocus
                />
              </div>

              {/* 버튼 */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={handleCancelNewMapping}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmNewMapping}
                  disabled={!newMappingTitle.trim()}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: newMappingTitle.trim()
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: newMappingTitle.trim() ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: newMappingTitle.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: newMappingTitle.trim()
                      ? '0 4px 12px rgba(99, 102, 241, 0.4)'
                      : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (newMappingTitle.trim()) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (newMappingTitle.trim()) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
                    }
                  }}
                >
                  확인
                </button>
              </div>
            </div>
          ) : (
            /* 기존 데이터수집 목록 테이블 */
            filteredMappings.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem', 
                color: 'rgba(255, 255, 255, 0.5)' 
              }}>
                <svg 
                  style={{ width: '5rem', height: '5rem', margin: '0 auto 1.5rem', opacity: 0.5 }} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.5" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                  {searchQuery ? '검색 결과가 없습니다' : '데이터수집 결과가 없습니다'}
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  {searchQuery ? '다른 검색어를 시도해보세요' : '신규 생성 버튼을 눌러 새로운 데이터수집을 시작하세요'}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="mapping-table">
                  <thead>
                    <tr>
                      <th style={{ width: '5%', textAlign: 'center' }}>순번</th>
                      <th style={{ width: '32%' }}>데이터수집 제목</th>
                      <th style={{ width: '13%' }}>작성자</th>
                      <th style={{ width: '18%' }}>작성일시</th>
                      <th style={{ width: '13%' }}>수정자</th>
                      <th style={{ width: '19%' }}>수정일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMappings.map((mapping, index) => (
                      <tr key={mapping.id} onClick={() => handleMappingClick(mapping)}>
                        <td style={{ textAlign: 'center', fontWeight: '700', color: 'rgba(99, 102, 241, 0.8)' }}>
                          {index + 1}
                        </td>
                        <td style={{ fontWeight: '700', color: '#fff' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={16} />
                            {mapping.title}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <User size={14} />
                            {mapping.createdBy}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Calendar size={14} />
                            {new Date(mapping.createdAt).toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <User size={14} />
                            {mapping.updatedBy}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Calendar size={14} />
                            {new Date(mapping.updatedAt).toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        {/* 하단 정보 */}
        {!showNewMappingForm && (
          <div style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            padding: '1rem 1.5rem',
            background: 'rgba(0, 0, 0, 0.2)',
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              총 {filteredMappings.length}개의 데이터수집 결과
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              💡 데이터수집을 클릭하여 작업을 계속하거나 신규 생성으로 시작하세요
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default MappingListModal;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Plus, Cpu, X, Calendar, User, Database } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

function ModelListModal({ show, onClose, onSelectModel }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModelForm, setShowNewModelForm] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('');

  // 데이터셋 목록
  const datasets = [
    { id: 'ds1', name: '뉴스기사 데이터셋' },
    { id: 'ds2', name: '영화 리뷰 데이터셋' },
    { id: 'ds3', name: 'AI 질의응답 데이터셋' }
  ];

  // 샘플 모델 데이터
  const sampleModels = [
    {
      id: 1,
      modelName: '뉴스 분석 모델 v1',
      datasetName: '뉴스기사 데이터셋',
      createdBy: '김철수',
      createdAt: '2025-10-20T09:30:00',
      updatedBy: '김철수',
      updatedAt: '2025-10-23T14:22:00'
    },
    {
      id: 2,
      modelName: '영화 감성 분석 모델',
      datasetName: '영화 리뷰 데이터셋',
      createdBy: '이영희',
      createdAt: '2025-10-18T11:15:00',
      updatedBy: '박민수',
      updatedAt: '2025-10-24T10:05:00'
    },
    {
      id: 3,
      modelName: 'AI 질의응답 학습 모델',
      datasetName: 'AI 질의응답 데이터셋',
      createdBy: '정다은',
      createdAt: '2025-10-15T16:45:00',
      updatedBy: '정다은',
      updatedAt: '2025-10-22T09:30:00'
    }
  ];

  const filteredModels = sampleModels.filter(model =>
    model.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.datasetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModelClick = (model) => {
    // 선택한 모델 정보를 부모 컴포넌트로 전달
    onSelectModel(model);
  };

  const handleCreateNewClick = () => {
    // 신규 생성 폼 표시
    setShowNewModelForm(true);
  };

  const handleConfirmNewModel = () => {
    // 유효성 검사
    if (!newModelName.trim()) {
      alert('모델명을 입력해주세요.');
      return;
    }

    if (!selectedDataset) {
      alert('데이터셋을 선택해주세요.');
      return;
    }

    // 선택된 데이터셋 정보 찾기
    const dataset = datasets.find(ds => ds.id === selectedDataset);

    // 신규 모델 객체 생성하여 Modelmanage로 전달
    const newModel = {
      id: 'new',
      modelName: newModelName.trim(),
      datasetName: dataset ? dataset.name : '',
      datasetId: selectedDataset,
      isNew: true,
      createdBy: '현재사용자', // 실제로는 세션에서 가져와야 함
      createdAt: new Date().toISOString(),
      updatedBy: '현재사용자',
      updatedAt: new Date().toISOString()
    };

    // 부모 컴포넌트로 신규 모델 전달 (Modelmanage로 이동)
    onSelectModel(newModel);
  };

  const handleCancelNewModel = () => {
    setShowNewModelForm(false);
    setNewModelName('');
    setSelectedDataset('');
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
          .model-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            overflow: hidden;
          }
          .model-table thead {
            background: rgba(99, 102, 241, 0.2);
            position: sticky;
            top: 0;
            z-index: 10;
          }
          .model-table th {
            padding: 1rem;
            color: #fff;
            font-weight: 600;
            font-size: 0.875rem;
            text-align: left;
            border-bottom: 2px solid rgba(99, 102, 241, 0.3);
          }
          .model-table td {
            padding: 0.875rem 1rem;
            color: #fff;
            font-size: 0.875rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .model-table tbody tr {
            cursor: pointer;
            transition: all 0.2s;
          }
          .model-table tbody tr:hover {
            background: rgba(99, 102, 241, 0.15);
            transform: scale(1.01);
          }
          .model-table tbody tr:last-child td {
            border-bottom: none;
          }
          .form-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: #fff;
            outline: none;
          }
          .form-input:focus {
            border: 1px solid rgba(99, 102, 241, 0.6);
          }
          .form-input::placeholder {
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
                <Cpu size={20} color="#6366f1" />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontWeight: '700', margin: 0, fontSize: '1.5rem' }}>
                  {showNewModelForm ? '신규 학습모델 생성' : '학습모델 목록'}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', margin: 0, fontSize: '0.875rem' }}>
                  {showNewModelForm ? '모델명과 데이터셋을 선택하세요' : '작업할 학습모델을 선택하거나 새로 생성하세요'}
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
          {!showNewModelForm && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="모델명, 데이터셋명 또는 작성자로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                />
                <svg
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1.125rem',
                    height: '1.125rem',
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
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
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

        {/* 컨텐츠 영역 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {showNewModelForm ? (
            /* 신규 모델 생성 폼 */
            <div style={{ 
              maxWidth: '40rem', 
              margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
              padding: '2rem'
            }}>
              {/* 모델명 입력 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: '#fff',
                  marginBottom: '0.75rem'
                }}>
                  <Cpu size={18} color="#6366f1" />
                  모델명
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="예: 뉴스 분석 모델 v1"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* 데이터셋 선택 */}
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
                  <Database size={18} color="#6366f1" />
                  데이터셋 선택
                </label>
                <select
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className="form-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="" style={{ background: '#2a3046', color: '#fff' }}>-- 데이터셋 선택 --</option>
                  {datasets.map(dataset => (
                    <option key={dataset.id} value={dataset.id} style={{ background: '#2a3046', color: '#fff' }}>
                      {dataset.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 선택 확인 */}
              {(newModelName || selectedDataset) && (
                <div style={{ 
                  marginBottom: '2rem', 
                  padding: '0.75rem', 
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(99, 102, 241, 1)', marginBottom: '0.25rem' }}>
                    {newModelName && (
                      <div>모델명: <span style={{ fontWeight: '600' }}>{newModelName}</span></div>
                    )}
                    {selectedDataset && (
                      <div>데이터셋: <span style={{ fontWeight: '600' }}>{datasets.find(ds => ds.id === selectedDataset)?.name}</span></div>
                    )}
                  </div>
                </div>
              )}

              {/* 버튼 */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleCancelNewModel}
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
                  onClick={handleConfirmNewModel}
                  disabled={!newModelName.trim() || !selectedDataset}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: (newModelName.trim() && selectedDataset)
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: (newModelName.trim() && selectedDataset) ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: (newModelName.trim() && selectedDataset) ? 'pointer' : 'not-allowed',
                    boxShadow: (newModelName.trim() && selectedDataset)
                      ? '0 4px 12px rgba(99, 102, 241, 0.4)'
                      : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (newModelName.trim() && selectedDataset) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (newModelName.trim() && selectedDataset) {
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
            /* 기존 학습모델 목록 테이블 */
            filteredModels.length === 0 ? (
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
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" 
                  />
                </svg>
                <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                  {searchQuery ? '검색 결과가 없습니다' : '학습모델이 없습니다'}
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  {searchQuery ? '다른 검색어를 시도해보세요' : '신규 생성 버튼을 눌러 새로운 학습모델을 시작하세요'}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="model-table">
                  <thead>
                    <tr>
                      <th style={{ width: '5%', textAlign: 'center' }}>순번</th>
                      <th style={{ width: '28%' }}>모델명</th>
                      <th style={{ width: '20%' }}>데이터셋명</th>
                      <th style={{ width: '10%' }}>작성자</th>
                      <th style={{ width: '17%' }}>작성일시</th>
                      <th style={{ width: '20%' }}>수정일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModels.map((model, index) => (
                      <tr key={model.id} onClick={() => handleModelClick(model)}>
                        <td style={{ textAlign: 'center', fontWeight: '700', color: 'rgba(99, 102, 241, 0.8)' }}>
                          {index + 1}
                        </td>
                        <td style={{ fontWeight: '700', color: '#fff' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Cpu size={16} />
                            {model.modelName}
                          </div>
                        </td>
                        <td style={{ color: 'rgba(168, 85, 247, 0.9)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Database size={14} />
                            {model.datasetName}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <User size={14} />
                            {model.createdBy}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Calendar size={14} />
                            {new Date(model.createdAt).toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Calendar size={14} />
                            {new Date(model.updatedAt).toLocaleString('ko-KR', {
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
        {!showNewModelForm && (
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
              총 {filteredModels.length}개의 학습모델
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              💡 학습모델을 클릭하여 작업을 계속하거나 신규 생성으로 시작하세요
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ModelListModal;
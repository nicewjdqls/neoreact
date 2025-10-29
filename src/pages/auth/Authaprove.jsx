import React, { useState } from 'react';
import MonitoringLayout from '../../components/MonitoringLayout';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { CheckCircle, XCircle, Info, AlertTriangle, MessageCircle, Shield, Upload, User, Calendar, Phone, Building, Clock, FileText } from 'lucide-react';
import FileUpload from '../../components/FileUpload';
import { SearchButton } from '../../components/button';
import './Auth.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Authaprove = () => {
  const [filters, setFilters] = useState({
    groupName: '',
    requester: '',
    status: ''
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [comment, setComment] = useState('');
  const [actionType, setActionType] = useState('');
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [applications] = useState([
    {
      id: 1,
      groupName: '개발자 권한',
      requester: '홍길동',
      department: '개발팀',
      position: '대리',
      contact: '010-1234-5678',
      startDate: '2025-09-20',
      endDate: '2025-12-31',
      requestDate: '2025-09-18',
      status: '대기',
      purpose: '신규 시스템 개발 참여',
      approvalDate: '-',
      comments: '-'
    },
    {
      id: 2,
      groupName: '관리자 권한',
      requester: '김철수',
      department: '운영팀',
      position: '과장',
      contact: '010-9876-5432',
      startDate: '2025-09-21',
      endDate: '2026-03-31',
      requestDate: '2025-09-19',
      status: '승인',
      purpose: '시스템 관리 및 모니터링',
      approvalDate: '2025-09-19',
      comments: '승인 완료'
    },
    {
      id: 3,
      groupName: '데이터 분석 권한',
      requester: '이영희',
      department: '데이터팀',
      position: '주임',
      contact: '010-5555-6666',
      startDate: '2025-09-22',
      endDate: '2025-11-30',
      requestDate: '2025-09-20',
      status: '반려',
      purpose: 'BI 리포트 작성 및 분석',
      approvalDate: '2025-09-21',
      comments: '권한 범위 재검토 필요'
    }
  ]);

  const showNotification = (title, message, variant = 'danger') => {
    const iconMap = {
      success: <CheckCircle size={48} className="mb-3" style={{color: '#22c55e'}} />,
      danger: <XCircle size={48} className="mb-3" style={{color: '#ef4444'}} />,
      info: <Info size={48} className="mb-3" style={{color: '#3b82f6'}} />,
      warning: <AlertTriangle size={48} className="mb-3" style={{color: '#f59e0b'}} />
    };
    
    setAlertConfig({
      title,
      message,
      variant,
      icon: iconMap[variant]
    });
    setShowAlertModal(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSearching(false);
  };

  const handleFileUploadSuccess = (file) => {
    setUploadedFile(file);
    showNotification('업로드 완료', '파일이 성공적으로 업로드되었습니다.', 'success');
  };

  const handleFileUploadError = (message) => {
    showNotification('업로드 실패', message, 'warning');
  };

  const handleItemSelect = (id, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleRowClick = (app, e) => {
    // 체크박스 클릭은 제외
    if (e.target.type === 'checkbox') {
      return;
    }
    
    // 같은 행을 다시 클릭하면 상세정보 닫기
    if (selectedDetail?.id === app.id) {
      setSelectedDetail(null);
    } else {
      setSelectedDetail(app);
    }
  };

  const handleBatchAction = (action) => {
    if (selectedItems.length === 0) {
      showNotification('선택 오류', '승인/반려할 항목을 선택하세요.', 'warning');
      return;
    }
    
    if (action === '승인') {
      setActionType(action);
      setShowConfirmModal(true);
    } else if (action === '반려') {
      setActionType(action);
      setShowCommentModal(true);
    }
  };

  const handleConfirmApproval = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowConfirmModal(false);
    setSelectedItems([]);
    setIsProcessing(false);
    showNotification('승인 완료', '승인이 완료되었습니다.', 'success');
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      showNotification('입력 오류', '반려 사유를 입력해주세요.', 'warning');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSelectedItems([]);
    setComment('');
    setShowCommentModal(false);
    setIsProcessing(false);
    showNotification('반려 완료', '반려가 완료되었습니다.', 'success');
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      '대기': { bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' },
      '승인': { bg: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: 'rgba(34, 197, 94, 0.4)' },
      '반려': { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'rgba(239, 68, 68, 0.4)' }
    };
    const style = statusStyles[status] || statusStyles['대기'];
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.375rem 0.75rem',
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '0.375rem',
        fontSize: '0.8125rem',
        fontWeight: '600',
        color: style.color
      }}>
        {status}
      </span>
    );
  };

  return (
    <MonitoringLayout activeMenu="authaprove" onMenuChange={() => {}}>
      <div className="auth-page-wrapper">
        {/* 페이지 헤더 */}
        <div className="auth-page-header">
          <div className="auth-page-header-content">
            <div className="auth-page-icon">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="auth-page-title">권한 승인</h3>
              <p className="auth-page-subtitle">권한 신청 내역을 조회하고 승인/반려 처리합니다</p>
            </div>
          </div>
        </div>

        <div className="auth-container-improved">
          {/* 권한 신청 조회 섹션 */}
          <div className="auth-section">
            <div className="auth-section-header">
              <div className="auth-section-title-wrapper">
                <h4 className="auth-section-title">권한 신청 조회</h4>
                <span className="auth-section-count">{applications.length}</span>
              </div>
              {/* 검색/승인/반려/파일업로드 버튼 */}
              <div className="auth-button-group">
                <SearchButton 
                  onClick={handleSearch}
                  disabled={isSearching}
                  isLoading={isSearching}
                />
                <Button 
                  onClick={() => handleBatchAction('승인')}
                  disabled={selectedItems.length === 0}
                  className="auth-btn-modern auth-btn-success"
                  style={{
                    padding: '0.625rem 1.25rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    background: selectedItems.length === 0 
                      ? 'rgba(34, 197, 94, 0.3)' 
                      : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: '#fff',
                    opacity: selectedItems.length === 0 ? 0.6 : 1,
                    minWidth: '100px',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircle size={16} />
                  승인
                </Button>
                <Button 
                  onClick={() => handleBatchAction('반려')}
                  disabled={selectedItems.length === 0}
                  className="auth-btn-modern auth-btn-danger"
                  style={{
                    padding: '0.625rem 1.25rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    background: selectedItems.length === 0 
                      ? 'rgba(239, 68, 68, 0.3)' 
                      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#fff',
                    opacity: selectedItems.length === 0 ? 0.6 : 1,
                    minWidth: '100px',
                    justifyContent: 'center'
                  }}
                >
                  <XCircle size={16} />
                  반려
                </Button>
                <Button 
                  onClick={() => setShowFileUploadModal(true)}
                  className="auth-btn-modern auth-btn-primary"
                  style={{
                    padding: '0.625rem 1.25rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#fff',
                    minWidth: '100px',
                    justifyContent: 'center'
                  }}
                >
                  <Upload size={16} />
                  파일 업로드
                </Button>
              </div>
            </div>
            
            <div className="auth-section-body">
              <div className="auth-search-grid">
                <div className="auth-form-group">
                  <label className="auth-form-label">권한 그룹명</label>
                  <input 
                    type="text"
                    name="groupName"
                    value={filters.groupName}
                    onChange={handleFilterChange}
                    placeholder="권한 그룹명 입력"
                    className="auth-form-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">신청자</label>
                  <input 
                    type="text"
                    name="requester"
                    value={filters.requester}
                    onChange={handleFilterChange}
                    placeholder="신청자명 입력"
                    className="auth-form-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">승인 결과</label>
                  <select 
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="auth-form-input"
                  >
                    <option value="">전체</option>
                    <option value="대기">대기</option>
                    <option value="승인">승인</option>
                    <option value="반려">반려</option>
                  </select>
                </div>
              </div>
              
              <div className="auth-table-container">
                <table className="auth-table-modern">
                  <thead>
                    <tr>
                      <th style={{width: '50px', textAlign: 'center'}}>
                        <input 
                          type="checkbox" 
                          className="auth-modern-checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(applications.map(app => app.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          checked={selectedItems.length === applications.length && applications.length > 0}
                        />
                      </th>
                      <th>권한 그룹명</th>
                      <th>신청자</th>
                      <th>소속</th>
                      <th>사용 기간</th>
                      <th>신청일자</th>
                      <th className="auth-status-col">승인 결과</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="auth-empty-cell">
                          <div className="auth-empty-state">
                            <svg className="auth-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <h4 className="auth-empty-title">신청 내역이 없습니다</h4>
                            <p className="auth-empty-desc">권한 신청 내역이 표시됩니다</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      applications.map(app => (
                        <tr 
                          key={app.id}
                          onClick={(e) => handleRowClick(app, e)}
                          className={`auth-table-row-hover ${selectedDetail?.id === app.id ? 'auth-table-row-selected' : ''}`}
                          style={{cursor: 'pointer'}}
                        >
                          <td style={{textAlign: 'center'}}>
                            <input 
                              type="checkbox" 
                              className="auth-modern-checkbox"
                              checked={selectedItems.includes(app.id)}
                              onChange={(e) => handleItemSelect(app.id, e.target.checked)}
                            />
                          </td>
                          <td>{app.groupName}</td>
                          <td>{app.requester}</td>
                          <td>{app.department}</td>
                          <td>{app.startDate} ~ {app.endDate}</td>
                          <td>{app.requestDate}</td>
                          <td className="auth-status-col">
                            {getStatusBadge(app.status)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 상세정보 섹션 (행 클릭 시 표시) */}
          {selectedDetail && (
            <div className="auth-section" style={{ marginTop: '1.5rem' }}>
              <div className="auth-section-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                  <FileText size={20} style={{color: '#60a5fa'}} />
                  <h4 className="auth-section-title">상세 정보</h4>
                  <span style={{
                    padding: '0.375rem 0.75rem',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.375rem',
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                    color: '#a5b4fc'
                  }}>
                    ID: {selectedDetail.id}
                  </span>
                </div>
                <Button 
                  onClick={() => setSelectedDetail(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    borderRadius: '0.375rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  닫기
                </Button>
              </div>

              <div className="auth-section-body">
                <div style={{display: 'grid', gap: '1.5rem'}}>
                  {/* 권한 정보 */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <Shield size={18} style={{color: '#60a5fa', marginRight: '0.5rem'}} />
                      <h6 style={{margin: 0, color: '#fff', fontWeight: '600', fontSize: '0.9375rem'}}>권한 정보</h6>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">권한 그룹명</label>
                        <div className="auth-detail-value">{selectedDetail.groupName}</div>
                      </div>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">사용 목적</label>
                        <div className="auth-detail-value">{selectedDetail.purpose}</div>
                      </div>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">사용 시작일</label>
                        <div className="auth-detail-value">
                          <Calendar size={14} style={{marginRight: '0.5rem', color: '#60a5fa'}} />
                          {selectedDetail.startDate}
                        </div>
                      </div>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">사용 종료일</label>
                        <div className="auth-detail-value">
                          <Calendar size={14} style={{marginRight: '0.5rem', color: '#60a5fa'}} />
                          {selectedDetail.endDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 신청자 정보 */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <User size={18} style={{color: '#60a5fa', marginRight: '0.5rem'}} />
                      <h6 style={{margin: 0, color: '#fff', fontWeight: '600', fontSize: '0.9375rem'}}>신청자 정보</h6>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">신청자</label>
                        <div className="auth-detail-value">{selectedDetail.requester}</div>
                      </div>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">소속</label>
                        <div className="auth-detail-value">
                          <Building size={14} style={{marginRight: '0.5rem', color: '#60a5fa'}} />
                          {selectedDetail.department}
                        </div>
                      </div>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">직급</label>
                        <div className="auth-detail-value">{selectedDetail.position}</div>
                      </div>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">연락처</label>
                        <div className="auth-detail-value">
                          <Phone size={14} style={{marginRight: '0.5rem', color: '#60a5fa'}} />
                          {selectedDetail.contact}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 처리 정보 */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <Clock size={18} style={{color: '#60a5fa', marginRight: '0.5rem'}} />
                      <h6 style={{margin: 0, color: '#fff', fontWeight: '600', fontSize: '0.9375rem'}}>처리 정보</h6>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">신청일자</label>
                        <div className="auth-detail-value">{selectedDetail.requestDate}</div>
                      </div>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">처리일자</label>
                        <div className="auth-detail-value">{selectedDetail.approvalDate}</div>
                      </div>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">처리 상태</label>
                        <div>{getStatusBadge(selectedDetail.status)}</div>
                      </div>
                      <div className="auth-detail-field">
                        <label className="auth-detail-label">처리 의견</label>
                        <div className="auth-detail-value">{selectedDetail.comments}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FileUpload 컴포넌트 사용 */}
          <FileUpload
            show={showFileUploadModal}
            onHide={() => setShowFileUploadModal(false)}
            onSuccess={handleFileUploadSuccess}
            onError={handleFileUploadError}
          />

          {/* 승인 확인 모달 */}
          <Modal 
            show={showConfirmModal} 
            onHide={() => !isProcessing && setShowConfirmModal(false)}
            centered
            backdrop="static"
            className="dark-modal"
          >
            <Modal.Body className="text-center p-4" style={{background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.98) 0%, rgba(54, 61, 90, 0.98) 100%)'}}>
              <CheckCircle size={48} style={{color: '#22c55e'}} className="mb-3" />
              <h5 className="fw-bold mb-3" style={{color: '#fff'}}>승인 확인</h5>
              <p className="mb-4" style={{color: 'rgba(255, 255, 255, 0.7)'}}>
                선택한 {selectedItems.length}건의 신청을 승인하시겠습니까?
              </p>
              <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                <Button 
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isProcessing}
                  className="auth-btn-modern auth-btn-secondary"
                >
                  취소
                </Button>
                <Button 
                  onClick={handleConfirmApproval}
                  disabled={isProcessing}
                  className="auth-btn-modern auth-btn-success"
                >
                  {isProcessing ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      처리중
                    </>
                  ) : (
                    '확인'
                  )}
                </Button>
              </div>
            </Modal.Body>
          </Modal>

          {/* 반려 사유 입력 모달 */}
          <Modal 
            show={showCommentModal} 
            onHide={() => !isProcessing && setShowCommentModal(false)}
            centered
            backdrop="static"
            className="dark-modal"
          >
            <Modal.Header 
              closeButton={!isProcessing}
              className="dark-modal-header"
              style={{borderBottom: '1px solid rgba(239, 68, 68, 0.3)'}}
            >
              <Modal.Title className="fw-bold d-flex align-items-center">
                <MessageCircle size={20} className="me-2" />
                반려 사유 입력
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="dark-modal-body">
              <div className="mb-3">
                <label className="auth-form-label">
                  반려 사유 <span style={{color: '#ef4444'}}>*</span>
                </label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="auth-form-input"
                  rows="5" 
                  placeholder="반려 사유를 입력해주세요"
                  disabled={isProcessing}
                  style={{resize: 'vertical', minHeight: '120px'}}
                />
              </div>
              <div style={{
                padding: '0.75rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                <Info size={16} style={{display: 'inline', marginRight: '0.5rem', color: '#f87171'}} />
                선택한 {selectedItems.length}건의 신청이 반려 처리됩니다.
              </div>
            </Modal.Body>
            <Modal.Footer className="dark-modal-footer">
              <Button 
                onClick={() => {
                  setShowCommentModal(false);
                  setComment('');
                }}
                disabled={isProcessing}
                className="auth-btn-modern auth-btn-secondary"
              >
                취소
              </Button>
              <Button 
                onClick={handleCommentSubmit}
                disabled={isProcessing}
                className="auth-btn-modern auth-btn-danger"
              >
                {isProcessing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    처리중
                  </>
                ) : (
                  '반려 처리'
                )}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* 알림 모달 */}
          <Modal 
            show={showAlertModal} 
            onHide={() => setShowAlertModal(false)}
            centered
            backdrop="static"
            className="dark-modal"
          >
            <Modal.Body className="text-center p-4" style={{background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.98) 0%, rgba(54, 61, 90, 0.98) 100%)'}}>
              {alertConfig.icon}
              <h5 className="fw-bold mb-3" style={{color: '#fff'}}>{alertConfig.title}</h5>
              <p className="mb-4" style={{color: 'rgba(255, 255, 255, 0.7)'}}>{alertConfig.message}</p>
              <Button 
                onClick={() => setShowAlertModal(false)}
                className={`auth-btn-modern ${
                  alertConfig.variant === 'success' ? 'auth-btn-success' :
                  alertConfig.variant === 'info' ? 'auth-btn-primary' :
                  alertConfig.variant === 'warning' ? 'auth-btn-warning' :
                  'auth-btn-danger'
                }`}
              >
                확인
              </Button>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </MonitoringLayout>
  );
};

export default Authaprove;
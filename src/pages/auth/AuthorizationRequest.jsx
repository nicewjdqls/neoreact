import React, { useState } from 'react';
import MonitoringLayout from '../../components/MonitoringLayout';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { CheckCircle, XCircle, Info, AlertTriangle, Trash2, FileText, ClipboardList, Calendar } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SearchButton } from '../../components/button';
import './Auth.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AuthorizationRequest = () => {
  const [formData, setFormData] = useState({
    group: '',
    dept: '',
    position: '',
    startDate: null,
    endDate: null,
    phone: '',
    purpose: ''
  });

  const [requests, setRequests] = useState([
    {
      id: 1,
      group: '개발자',
      purpose: 'AI 포털 개발',
      startDate: '2025-09-20',
      endDate: '2025-12-31',
      phone: '010-1111-2222',
      requestDate: '2025-09-18',
      status: 'pending',
      processDate: null,
      comment: null,
      dept: '개발팀',
      position: '대리'
    }
  ]);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showNotification = (title, message, variant = 'danger') => {
    const iconMap = {
      success: <CheckCircle size={48} className="text-success mb-3" />,
      danger: <XCircle size={48} className="text-danger mb-3" />,
      info: <Info size={48} className="text-info mb-3" />,
      warning: <AlertTriangle size={48} className="text-warning mb-3" />
    };
    
    setAlertConfig({
      title,
      message,
      variant,
      icon: iconMap[variant]
    });
    setShowAlertModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['group', 'dept', 'position', 'startDate', 'endDate', 'phone', 'purpose'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      const fieldNames = {
        group: '권한 그룹',
        dept: '소속',
        position: '직급',
        startDate: '권한 사용 시작일',
        endDate: '권한 사용 종료일',
        phone: '연락처',
        purpose: '사용 목적'
      };
      
      const missingFieldNames = missingFields.map(field => fieldNames[field]).join(', ');
      showNotification(
        '입력 오류', 
        `다음 필수 항목을 입력해주세요: ${missingFieldNames}`, 
        'warning'
      );
      return false;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      showNotification('날짜 오류', '시작일은 오늘 이후 날짜를 선택해주세요.', 'warning');
      return false;
    }

    if (endDate <= startDate) {
      showNotification('날짜 오류', '종료일은 시작일보다 나중 날짜를 선택해주세요.', 'warning');
      return false;
    }

    const phoneRegex = /^[0-9-]+$/;
    if (!phoneRegex.test(formData.phone)) {
      showNotification('연락처 오류', '올바른 연락처 형식을 입력해주세요. (예: 010-1234-5678)', 'warning');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRequest = {
        id: Date.now(),
        group: formData.group,
        purpose: formData.purpose,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0],
        phone: formData.phone,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        processDate: null,
        comment: null,
        dept: formData.dept,
        position: formData.position
      };
      
      setRequests(prev => [newRequest, ...prev]);
      
      setFormData({
        group: '', dept: '', position: '', startDate: null, endDate: null, phone: '', purpose: ''
      });
      
      showNotification(
        '신청 완료',
        '권한 신청이 성공적으로 완료되었습니다.', 
        'success'
      );
    } catch (error) {
      showNotification('신청 실패', '권한 신청 중 오류가 발생했습니다. 다시 시도해주세요.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    const request = requests.find(r => r.id === requestId);
    
    if (request.status !== 'pending') {
      showNotification('취소 불가', '승인 대기 상태의 신청만 취소할 수 있습니다.', 'warning');
      return;
    }

    if (!window.confirm('이 권한 신청을 취소하시겠습니까?')) {
      return;
    }

    setDeletingId(requestId);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRequests(prev => prev.filter(r => r.id !== requestId));
      showNotification('취소 완료', '권한 신청이 취소되었습니다.', 'success');
    } catch (error) {
      showNotification('취소 실패', '신청 취소 중 오류가 발생했습니다.', 'danger');
    } finally {
      setDeletingId(null);
    }
  };

  // 신청 내역 조회 함수
  const handleRefreshRequests = async () => {
    setIsRefreshing(true);
    
    try {
      // 실제로는 여기서 API 호출하여 최신 데이터를 가져옵니다
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 예시: API에서 데이터를 받아온다고 가정
      // const response = await fetch('/api/authorization-requests');
      // const data = await response.json();
      // setRequests(data);
      
      showNotification(
        '조회 완료',
        `권한 신청 내역 ${requests.length}건을 최신 정보로 업데이트했습니다.`, 
        'success'
      );
    } catch (error) {
      showNotification('조회 실패', '신청 내역을 불러오는 중 오류가 발생했습니다.', 'danger');
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: '승인 대기',
        className: 'pending'
      },
      approved: {
        label: '승인 완료',
        className: 'approved'
      },
      rejected: {
        label: '반려',
        className: 'rejected'
      }
    };

    const config = statusConfig[status];
    if (!config) return null;

    return (
      <span className={`auth-status-badge ${config.className}`}>
        <span className="auth-status-dot"></span>
        {config.label}
      </span>
    );
  };

  return (
    <MonitoringLayout activeMenu="authorizationRequest" onMenuChange={() => {}}>
      <div className="auth-page-wrapper">
        {/* 페이지 헤더 */}
        <div className="auth-page-header">
          <div className="auth-page-header-content">
            <div className="auth-page-icon">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="auth-page-title">권한 신청</h3>
              <p className="auth-page-subtitle">시스템 사용을 위한 권한을 신청합니다</p>
            </div>
          </div>
        </div>

        <div className="auth-container-improved">
          {/* 권한 신청서 */}
          <div className="auth-section">
            <div className="auth-section-header">
              <div className="auth-section-title-wrapper">
                <h3 className="auth-section-title">권한 신청서</h3>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-section-body">
              <div className="auth-search-grid">
                <div className="auth-form-group">
                  <label className="auth-form-label">
                    권한 그룹 <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <select 
                    name="group"
                    value={formData.group}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="auth-form-input"
                    style={{paddingLeft: '1rem'}}
                    required
                  >
                    <option value="">권한 그룹 선택</option>
                    <option value="관리자">관리자</option>
                    <option value="개발자">개발자</option>
                    <option value="운영자">운영자</option>
                    <option value="사용자">사용자</option>
                  </select>
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">
                    소속 <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="dept"
                    value={formData.dept}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="auth-form-input"
                    style={{paddingLeft: '1rem'}}
                    placeholder="예: 개발팀"
                    required 
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">
                    직급 <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="auth-form-input"
                    style={{paddingLeft: '1rem'}}
                    placeholder="예: 대리"
                    required 
                  />
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">
                    권한 사용 시작일 <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <div className="auth-datepicker-wrapper">
                    <Calendar className="auth-datepicker-icon" size={16} />
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                      disabled={isSubmitting}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="시작일을 선택하세요"
                      className="auth-form-input auth-datepicker-input"
                      minDate={new Date()}
                      popperPlacement="bottom-start"
                      showPopperArrow={false}
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">
                    권한 사용 종료일 <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <div className="auth-datepicker-wrapper">
                    <Calendar className="auth-datepicker-icon" size={16} />
                    <DatePicker
                      selected={formData.endDate}
                      onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                      disabled={isSubmitting}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="종료일을 선택하세요"
                      className="auth-form-input auth-datepicker-input"
                      minDate={formData.startDate || new Date()}
                      popperPlacement="bottom-start"
                      showPopperArrow={false}
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-form-label">
                    연락처 <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="auth-form-input"
                    style={{paddingLeft: '1rem'}}
                    placeholder="예: 010-1234-5678"
                    required 
                  />
                </div>
              </div>

              {/* 사용 목적 */}
              <div className="auth-form-group" style={{marginTop: '1rem'}}>
                <label className="auth-form-label">
                  사용 목적 <span style={{color: '#ef4444'}}>*</span>
                </label>
                <textarea 
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="auth-form-input"
                  style={{paddingLeft: '1rem', resize: 'vertical', minHeight: '100px'}}
                  placeholder="권한이 필요한 사유와 사용 목적을 입력해주세요" 
                  rows="3"
                  required
                />
              </div>

              <div className="auth-button-group" style={{marginTop: '1.5rem'}}>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-btn-modern auth-btn-primary"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      신청 처리중
                    </>
                  ) : (
                    <>
                      <FileText size={16} />
                      권한 신청하기
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* 신청 내역 */}
          <div className="auth-section">
            <div className="auth-section-header">
              <div className="auth-section-title-wrapper">
                <h3 className="auth-section-title">신청 내역</h3>
                <span className="auth-section-count">{requests.length}건</span>
              </div>
              
              {/* SearchButton 공통 컴포넌트 사용 */}
              <div className="auth-button-group">
                <SearchButton
                  onClick={handleRefreshRequests}
                  disabled={isRefreshing}
                  isLoading={isRefreshing}
                />
              </div>
            </div>
            
            <div className="auth-section-body">
              <div className="auth-table-container">
                <table className="auth-table-modern">
                  <thead>
                    <tr>
                      <th>권한 그룹</th>
                      <th>사용 목적</th>
                      <th>시작일</th>
                      <th>종료일</th>
                      <th>연락처</th>
                      <th>신청일자</th>
                      <th className="auth-status-col">승인 결과</th>
                      <th>처리일시</th>
                      <th>코멘트</th>
                      <th className="auth-action-col">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="auth-empty-cell">
                          <div className="auth-empty-state">
                            <ClipboardList className="auth-empty-icon" />
                            <h4 className="auth-empty-title">신청 내역이 없습니다</h4>
                            <p className="auth-empty-desc">권한 신청서를 작성하여 제출하세요</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      requests.map(request => (
                        <tr key={request.id}>
                          <td>
                            <span className="auth-key-badge">{request.group}</span>
                          </td>
                          <td>
                            <div style={{maxWidth: '12rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                              {request.purpose}
                            </div>
                          </td>
                          <td className="auth-date-cell">{request.startDate}</td>
                          <td className="auth-date-cell">{request.endDate}</td>
                          <td className="auth-user-cell">{request.phone}</td>
                          <td className="auth-date-cell">{request.requestDate}</td>
                          <td className="auth-status-col">
                            {renderStatusBadge(request.status)}
                          </td>
                          <td className="auth-date-cell">
                            {request.processDate || '-'}
                          </td>
                          <td style={{color: 'rgba(255, 255, 255, 0.6)', maxWidth: '8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {request.comment || '-'}
                          </td>
                          <td className="auth-action-col">
                            {request.status === 'pending' && (
                              <button
                                onClick={() => handleCancelRequest(request.id)}
                                disabled={deletingId === request.id}
                                className="auth-delete-btn"
                              >
                                {deletingId === request.id ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  <>
                                    <Trash2 size={14} />
                                    취소
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 알림 모달 - index.js 스타일 적용 */}
          <Modal 
            show={showAlertModal} 
            onHide={() => setShowAlertModal(false)}
            centered
            backdrop="static"
          >
            <Modal.Body 
              className="text-center p-4"
              style={{
                background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
                color: '#fff',
                borderRadius: '12px',
                border: '1px solid rgba(99, 102, 241, 0.3)'
              }}
            >
              {alertConfig.icon}
              <h5 className="fw-bold mb-3" style={{ color: '#fff' }}>
                {alertConfig.title}
              </h5>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)' }} className="mb-4">
                {alertConfig.message}
              </p>
              <Button 
                onClick={() => setShowAlertModal(false)}
                className="px-4 shadow-sm"
                style={{ 
                  borderRadius: '8px',
                  background: alertConfig.variant === 'success' 
                    ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                    : alertConfig.variant === 'info'
                    ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
                    : alertConfig.variant === 'warning'
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                  border: 'none',
                  fontWeight: '600'
                }}
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

export default AuthorizationRequest;
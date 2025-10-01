import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { CheckCircle, XCircle, Info, AlertTriangle, MessageCircle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Authaprove = () => {
  const [filters, setFilters] = useState({
    groupName: '',
    requester: '',
    status: ''
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [comment, setComment] = useState('');
  const [actionType, setActionType] = useState('');
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

  // 스피너 상태
  const [isSearching, setIsSearching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 샘플 신청 데이터
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
    }
  ]);

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ groupName: '', requester: '', status: '' });
  };

  const handleSearch = async () => {
    setIsSearching(true);
    console.log('검색 조건:', filters);
    
    // 검색 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSearching(false);
  };

  const handleItemSelect = (id, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
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
    console.log('승인 처리:', { selectedItems });
    
    // 처리 시뮬레이션
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
    console.log(`${actionType} 처리:`, { selectedItems, comment });
    
    // 처리 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSelectedItems([]);
    setComment('');
    setShowCommentModal(false);
    setIsProcessing(false);
    showNotification('반려 완료', `${actionType}이 완료되었습니다.`, 'success');
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      '대기': 'bg-yellow-100 text-yellow-700',
      '승인': 'bg-green-100 text-green-700',
      '반려': 'bg-red-100 text-red-700'
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="권한 승인 및 관리 시스템"
      environment="Production"
      showNavigation={true}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">권한 승인 관리</h1>
                <p className="text-gray-600 text-sm mt-0.5">권한 신청을 검토하고 승인/반려 처리합니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* 조회 조건 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">조회 조건</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">권한 그룹명</label>
              <input 
                type="text" 
                name="groupName"
                value={filters.groupName}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                placeholder="권한 그룹명 입력" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">신청자</label>
              <input 
                type="text" 
                name="requester"
                value={filters.requester}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                placeholder="신청자 이름 입력" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">승인 상태</label>
              <select 
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">전체</option>
                <option value="대기">대기</option>
                <option value="승인">승인</option>
                <option value="반려">반려</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4"
              style={{ 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                border: 'none'
              }}
            >
              {isSearching ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  조회중...
                </>
              ) : (
                '조회'
              )}
            </Button>
            <Button 
              variant="secondary"
              onClick={resetFilters}
              className="px-4"
              style={{ borderRadius: '12px' }}
            >
              초기화
            </Button>
          </div>
        </div>

        {/* 신청 내역 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">신청 내역</h3>
                <p className="text-sm text-gray-600 mt-0.5">권한 신청을 검토하고 승인/반려 처리하세요</p>
              </div>
            </div>
            
            {/* 승인/반려 버튼 */}
            <div className="flex gap-2">
              <Button 
                onClick={() => handleBatchAction('승인')}
                disabled={isProcessing}
                className="px-4"
                style={{ 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  border: 'none'
                }}
              >
                {isProcessing && actionType === '승인' ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    처리중...
                  </>
                ) : (
                  '승인'
                )}
              </Button>
              <Button 
                onClick={() => handleBatchAction('반려')}
                disabled={isProcessing}
                className="px-4"
                style={{ 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                  border: 'none'
                }}
              >
                {isProcessing && actionType === '반려' ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    처리중...
                  </>
                ) : (
                  '반려'
                )}
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">선택</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">권한 그룹</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">신청자 정보</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">사용 기간</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">신청일자</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">처리 현황</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <React.Fragment key={app.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-center" rowSpan="2">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(app.id)}
                          onChange={(e) => handleItemSelect(app.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" 
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" rowSpan="2">
                        <div className="text-sm font-medium text-gray-900">{app.groupName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{app.requester}</div>
                        <div className="text-sm text-gray-500">{app.contact}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.startDate}</div>
                        <div className="text-sm text-gray-500">~ {app.endDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.requestDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.approvalDate !== '-' ? `처리일: ${app.approvalDate}` : '처리 대기중'}
                      </td>
                    </tr>
                    <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                      <td className="px-6 py-3" colSpan="2">
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">소속:</span> {app.department} / <span className="font-medium">직급:</span> {app.position}
                        </div>
                      </td>
                      <td className="px-6 py-3" colSpan="2">
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">사용 목적:</span> {app.purpose}
                        </div>
                      </td>
                      <td className="px-6 py-3" colSpan="2">
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">승인/반려 코멘트:</span> {app.comments}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 승인 확인 모달 */}
        <Modal 
          show={showConfirmModal} 
          onHide={() => !isProcessing && setShowConfirmModal(false)}
          centered
          backdrop="static"
        >
          <Modal.Body className="text-center p-4">
            <CheckCircle size={48} className="text-success mb-3" />
            <h5 className="fw-bold mb-3">승인 확인</h5>
            <p className="text-muted mb-4">선택한 항목들을 승인하시겠습니까?</p>
            <div className="d-flex gap-2 justify-content-center">
              <Button 
                variant="outline-secondary"
                onClick={() => setShowConfirmModal(false)}
                disabled={isProcessing}
                className="px-4"
                style={{ borderRadius: '12px' }}
              >
                취소
              </Button>
              <Button 
                onClick={handleConfirmApproval}
                disabled={isProcessing}
                className="px-4 shadow-sm"
                style={{ 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  border: 'none'
                }}
              >
                {isProcessing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    처리중...
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
        >
          <Modal.Header 
            closeButton={!isProcessing}
            className="border-0 text-white"
            style={{ 
              background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              borderRadius: '20px 20px 0 0'
            }}
          >
            <Modal.Title className="fw-bold d-flex align-items-center">
              <MessageCircle size={20} className="me-2" />
              반려 사유 입력
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="mb-3">
              <label className="form-label fw-medium">반려 사유 <span className="text-danger">*</span></label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-control shadow-sm" 
                rows="4" 
                placeholder="반려 사유를 입력해주세요"
                disabled={isProcessing}
                style={{ borderRadius: '12px' }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-light" style={{ borderRadius: '0 0 20px 20px' }}>
            <Button 
              variant="outline-secondary"
              onClick={() => {
                setShowCommentModal(false);
                setComment('');
              }}
              disabled={isProcessing}
              className="px-4"
              style={{ borderRadius: '12px' }}
            >
              취소
            </Button>
            <Button 
              onClick={handleCommentSubmit}
              disabled={isProcessing}
              className="px-4 shadow-sm"
              style={{ 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                border: 'none'
              }}
            >
              {isProcessing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  처리중...
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
                  : alertConfig.variant === 'warning'
                  ? 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
                  : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                border: 'none'
              }}
            >
              확인
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    </Layout>
  );
};

export default Authaprove;
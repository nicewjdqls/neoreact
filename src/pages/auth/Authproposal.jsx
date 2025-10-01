import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { CheckCircle, XCircle, Info, AlertTriangle, Send } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Authproposal = () => {
  const [formData, setFormData] = useState({
    group: '',
    dept: '',
    position: '',
    startDate: '',
    endDate: '',
    phone: '',
    purpose: ''
  });

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // 날짜 검증
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

    // 연락처 검증 (기본적인 형식)
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
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('권한 신청:', formData);
      
      // 폼 초기화
      setFormData({
        group: '', dept: '', position: '', startDate: '', endDate: '', phone: '', purpose: ''
      });
      
      showNotification(
        '권한 신청이 성공적으로 완료되었습니다.', 
        'success'
      );
    } catch (error) {
      showNotification('신청 실패', '권한 신청 중 오류가 발생했습니다. 다시 시도해주세요.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="권한 신청 및 승인 관리 시스템"
      environment="Production"
      showNavigation={true}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 권한 신청 섹션 - 메인 포커스 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c0 .621.504 1.125 1.125 1.125H18a2.25 2.25 0 002.25-2.25M8.25 8.25V6.108"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">권한 신청</h2>
                <p className="text-gray-600 text-sm mt-0.5">새로운 시스템 접근 권한을 신청해보세요</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* 기본 입력 (3개씩) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* 권한 그룹 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  권한 그룹 <span className="text-danger">*</span>
                </label>
                <select 
                  name="group"
                  value={formData.group}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                  required
                  style={{ borderRadius: '12px' }}
                >
                  <option value="">선택하세요</option>
                  <option value="ADMIN">관리자</option>
                  <option value="DEV">개발자</option>
                  <option value="USER">일반 사용자</option>
                </select>
              </div>
              
              {/* 소속 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  소속 <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="dept"
                  value={formData.dept}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                  placeholder="예: 개발팀"
                  style={{ borderRadius: '12px' }}
                  required 
                />
              </div>

              {/* 직급 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  직급 <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                  placeholder="예: 대리"
                  style={{ borderRadius: '12px' }}
                  required 
                />
              </div>

              {/* 권한 사용 시작일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  권한 사용 시작일 <span className="text-danger">*</span>
                </label>
                <input 
                  type="date" 
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  style={{ borderRadius: '12px' }}
                  required 
                />
              </div>

              {/* 권한 사용 종료일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  권한 사용 종료일 <span className="text-danger">*</span>
                </label>
                <input 
                  type="date" 
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  style={{ borderRadius: '12px' }}
                  required 
                />
              </div>

              {/* 연락처 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                  placeholder="예: 010-1234-5678"
                  style={{ borderRadius: '12px' }}
                  required 
                />
              </div>
            </div>

            {/* 사용 목적 (한 줄 전체) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사용 목적 <span className="text-danger">*</span>
              </label>
              <textarea 
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none" 
                placeholder="권한이 필요한 사유와 사용 목적을 입력해주세요" 
                rows="3"
                style={{ borderRadius: '12px' }}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 shadow-sm"
                style={{ 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                  border: 'none'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    신청 처리중...
                  </>
                ) : (
                  '권한 신청하기'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* 신청 내역 섹션 - 서브 포커스 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">신청 내역</h3>
                <p className="text-sm text-gray-600 mt-0.5">제출한 권한 신청의 승인 현황을 확인하세요</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">권한 그룹</th>
                    <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">사용 목적</th>
                    <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">시작일</th>
                    <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">종료일</th>
                    <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">연락처</th>
                    <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">신청일자</th>
                    <th className="px-4 py-3 border-b border-gray-200 text-center text-sm font-semibold text-gray-700">승인 결과</th>
                    <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">처리일시</th>
                    <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">코멘트</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 border-b border-gray-100">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        개발자
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-900">AI 포털 개발</td>
                    <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">2025-09-20</td>
                    <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">2025-12-31</td>
                    <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">010-1111-2222</td>
                    <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">2025-09-18</td>
                    <td className="px-4 py-3 border-b border-gray-100 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg className="w-1.5 h-1.5 mr-1.5 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx={4} cy={4} r={3} />
                        </svg>
                        승인 대기
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-500">-</td>
                    <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-500">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

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

export default Authproposal;
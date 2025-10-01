import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { CheckCircle, XCircle, Info, AlertTriangle, Search, Settings, Code as CodeIcon } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Code = () => {
  const [activeTab, setActiveTab] = useState('category');
  const [isLoading, setIsLoading] = useState(false);
  
  // 필터 데이터
  const [filterData, setFilterData] = useState({
    categoryCode: '',
    categoryName: '',
    detailCode: '',
    detailName: ''
  });

  // 입력 데이터
  const [categoryData, setCategoryData] = useState({
    code: '',
    name: '',
    description: ''
  });

  const [detailData, setDetailData] = useState({
    categoryCode: '',
    code: '',
    name: '',
    description: ''
  });

  // 모달 상태
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

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

  // 탭 전환 함수
  const showTab = (tabName) => {
    setActiveTab(tabName);
  };

  // 필터 입력 처리
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 카테고리 입력 처리
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 상세 코드 입력 처리
  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 검색 함수
  const searchCodes = async () => {
    setIsLoading(true);
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('코드 조회:', filterData);
      showNotification('조회 완료', '코드 데이터를 성공적으로 조회했습니다.', 'success');
    } catch (error) {
      showNotification('조회 실패', '코드 조회 중 오류가 발생했습니다.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 초기화
  const resetFilters = () => {
    setFilterData({
      categoryCode: '',
      categoryName: '',
      detailCode: '',
      detailName: ''
    });
    showNotification('초기화 완료', '검색 조건이 초기화되었습니다.', 'info');
  };

  // 대분류 저장
  const addCategory = async () => {
    if (!categoryData.code || !categoryData.name) {
      showNotification('입력 오류', '코드와 코드명을 모두 입력해주세요.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('대분류 저장:', categoryData);
      setCategoryData({ code: '', name: '', description: '' });
      showNotification('저장 완료', '대분류 코드가 성공적으로 저장되었습니다.', 'success');
    } catch (error) {
      showNotification('저장 실패', '대분류 코드 저장 중 오류가 발생했습니다.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  // 대분류 삭제
  const deleteCategory = () => {
    console.log('대분류 삭제');
    showNotification('삭제 완료', '선택된 대분류 코드가 삭제되었습니다.', 'info');
  };

  // 상세 코드 저장
  const addDetail = async () => {
    if (!detailData.code || !detailData.name) {
      showNotification('입력 오류', '상세 코드와 상세명을 모두 입력해주세요.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('상세 코드 저장:', detailData);
      setDetailData({ categoryCode: '', code: '', name: '', description: '' });
      showNotification('저장 완료', '상세 코드가 성공적으로 저장되었습니다.', 'success');
    } catch (error) {
      showNotification('저장 실패', '상세 코드 저장 중 오류가 발생했습니다.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  // 상세 코드 삭제
  const deleteDetail = () => {
    console.log('상세 코드 삭제');
    showNotification('삭제 완료', '선택된 상세 코드가 삭제되었습니다.', 'info');
  };

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="코드 관리 및 분류 시스템"
      environment="Production"
      showNavigation={true}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 검색 조건 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">검색 조건</h2>
                  <p className="text-gray-600 text-sm mt-0.5">코드 검색 및 필터링 옵션</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={searchCodes} 
                  disabled={isLoading}
                  style={{ 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                    border: 'none'
                  }}
                  className="px-4 py-2 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      조회중...
                    </>
                  ) : (
                    '조회'
                  )}
                </Button>
                <Button 
                  onClick={resetFilters} 
                  variant="secondary"
                  style={{ borderRadius: '12px' }}
                  className="px-4 py-2 shadow-sm"
                >
                  초기화
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* 첫 줄: 대분류 코드 / 대분류 코드명 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">대분류 코드</label>
                <input 
                  type="text" 
                  name="categoryCode"
                  value={filterData.categoryCode}
                  onChange={handleFilterChange}
                  placeholder="예: CAT001" 
                  className="w-full border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                  style={{ borderRadius: '12px' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">대분류 코드명</label>
                <input 
                  type="text" 
                  name="categoryName"
                  value={filterData.categoryName}
                  onChange={handleFilterChange}
                  placeholder="예: 대분류1" 
                  className="w-full border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                  style={{ borderRadius: '12px' }}
                />
              </div>
            </div>

            {/* 두 번째 줄: 상세 코드 / 상세 코드명 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상세 코드</label>
                <input 
                  type="text" 
                  name="detailCode"
                  value={filterData.detailCode}
                  onChange={handleFilterChange}
                  placeholder="예: DET001" 
                  className="w-full border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                  style={{ borderRadius: '12px' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상세 코드명</label>
                <input 
                  type="text" 
                  name="detailName"
                  value={filterData.detailName}
                  onChange={handleFilterChange}
                  placeholder="예: 상세1" 
                  className="w-full border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                  style={{ borderRadius: '12px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 코드 관리 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">코드 관리</h2>
                <p className="text-gray-600 text-sm mt-0.5">시스템 코드 등록 및 관리</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* 탭 네비게이션 */}
            <div className="flex border-b border-gray-200 mb-6">
              <button 
                className={`px-6 py-3 font-semibold text-sm transition-colors ${
                  activeTab === 'category' 
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                }`}
                onClick={() => showTab('category')}
                style={{ borderRadius: '12px 12px 0 0' }}
              >
                대분류 코드
              </button>
              <button 
                className={`px-6 py-3 font-semibold text-sm transition-colors ${
                  activeTab === 'detail' 
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                }`}
                onClick={() => showTab('detail')}
                style={{ borderRadius: '12px 12px 0 0' }}
              >
                상세 코드
              </button>
            </div>

            {/* 대분류 코드 탭 */}
            <div className={activeTab === 'category' ? '' : 'hidden'}>
              {/* 버튼 영역 */}
              <div className="flex gap-2 mb-4 justify-end">
                <Button 
                  onClick={addCategory}
                  disabled={isLoading}
                  style={{ 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    border: 'none'
                  }}
                  className="px-4 py-2 shadow-sm"
                >
                  저장
                </Button>
                <Button 
                  onClick={deleteCategory}
                  variant="danger"
                  style={{ 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                    border: 'none'
                  }}
                  className="px-4 py-2 shadow-sm"
                >
                  삭제
                </Button>
              </div>

              {/* 입력란 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    코드 <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="code"
                    value={categoryData.code}
                    onChange={handleCategoryChange}
                    placeholder="코드" 
                    className="w-full border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                    style={{ borderRadius: '12px' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    코드명 <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={categoryData.name}
                    onChange={handleCategoryChange}
                    placeholder="코드명" 
                    className="w-full border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                    style={{ borderRadius: '12px' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <input 
                    type="text" 
                    name="description"
                    value={categoryData.description}
                    onChange={handleCategoryChange}
                    placeholder="설명" 
                    className="w-full border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* 대분류 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                    <tr>
                      <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">코드</th>
                      <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">코드명</th>
                      <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">설명</th>
                      <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">작업자</th>
                      <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">작업일시</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-900">CAT001</td>
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-900">시스템관리</td>
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">시스템 관리 관련 코드</td>
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">관리자</td>
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">2025-09-26 10:30</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 상세 코드 탭 */}
            <div className={activeTab === 'detail' ? '' : 'hidden'}>
              {/* 버튼 영역 */}
              <div className="flex gap-2 mb-4 justify-end">
                <Button 
                  onClick={addDetail}
                  disabled={isLoading}
                  style={{ 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    border: 'none'
                  }}
                  className="px-4 py-2 shadow-sm"
                >
                  저장
                </Button>
                <Button 
                  onClick={deleteDetail}
                  variant="danger"
                  style={{ 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                    border: 'none'
                  }}
                  className="px-4 py-2 shadow-sm"
                >
                  삭제
                </Button>
              </div>

              {/* 입력란 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">대분류 코드</label>
                  <input 
                    type="text" 
                    name="categoryCode"
                    value={detailData.categoryCode}
                    onChange={handleDetailChange}
                    placeholder="대분류 코드" 
                    readOnly 
                    className="w-full border border-gray-300 px-3 py-2.5 bg-gray-100" 
                    style={{ borderRadius: '12px' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상세 코드 <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="code"
                    value={detailData.code}
                    onChange={handleDetailChange}
                    placeholder="상세 코드" 
                    className="w-full border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                    style={{ borderRadius: '12px' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상세명 <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={detailData.name}
                    onChange={handleDetailChange}
                    placeholder="상세명" 
                    className="w-full border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                    style={{ borderRadius: '12px' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                  <input 
                    type="text" 
                    name="description"
                    value={detailData.description}
                    onChange={handleDetailChange}
                    placeholder="설명" 
                    className="w-full border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" 
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>

              {/* 상세 코드 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                    <tr>
                      <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">대분류</th>
                      <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">상세 코드</th>
                      <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">상세명</th>
                      <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">설명</th>
                      <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">작업자</th>
                      <th className="px-4 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">작업일시</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 border-b border-gray-100">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          시스템관리
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-900">SYS001</td>
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-900">사용자관리</td>
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">사용자 계정 관리</td>
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">관리자</td>
                      <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">2025-09-26 10:35</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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

export default Code;
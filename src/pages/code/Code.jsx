import React, { useState, useEffect } from 'react';
import MonitoringLayout from '../../components/MonitoringLayout';
import { Modal, Button } from 'react-bootstrap';
import { CheckCircle, XCircle, Info, AlertTriangle, Search, Settings, Plus, Trash2 } from 'lucide-react';
import { AddButton, DeleteButton, SaveButton, SearchButton, ResetButton } from '../../components/button';
import 'bootstrap/dist/css/bootstrap.min.css';

const Code = () => {
  const [activeTab, setActiveTab] = useState('category');
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 사용자 정보 가져오기
  const getCurrentUser = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.id || user.username || user.email || '게스트';
      } catch (e) {
        return '게스트';
      }
    }
    
    const sessionUser = sessionStorage.getItem('userInfo');
    if (sessionUser) {
      try {
        const user = JSON.parse(sessionUser);
        return user.id || user.username || user.email || '게스트';
      } catch (e) {
        return '게스트';
      }
    }
    
    return '게스트';
  };

  const currentUser = getCurrentUser();
  
  // 필터 데이터
  const [categoryFilter, setCategoryFilter] = useState({
    code: '',
    name: ''
  });

  const [detailFilter, setDetailFilter] = useState({
    categoryCode: '',
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

  // 대분류 목록
  const [categories, setCategories] = useState([]);
  const [initialCategories, setInitialCategories] = useState([]); // 초기 상태 저장

  // 상세 코드 목록
  const [details, setDetails] = useState([]);
  const [initialDetails, setInitialDetails] = useState([]); // 초기 상태 저장

  // 선택된 대분류
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 대분류 검색 결과
  const [searchedCategories, setSearchedCategories] = useState([]);

  // 모달 상태
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

  // 상세 코드 탭으로 전환 시 전체 대분류 목록 표시
  useEffect(() => {
    if (activeTab === 'detail') {
      // 삭제 표시되지 않은 대분류만 표시
      const availableCategories = categories.filter(cat => !cat.markedForDelete);
      setSearchedCategories(availableCategories);
    }
  }, [activeTab, categories]);

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

  // 대분류 필터 입력 처리
  const handleCategoryFilterChange = (e) => {
    const { name, value } = e.target;
    setCategoryFilter(prev => ({ ...prev, [name]: value }));
  };

  // 상세 코드 필터 입력 처리
  const handleDetailFilterChange = (e) => {
    const { name, value } = e.target;
    setDetailFilter(prev => ({ ...prev, [name]: value }));
    
    // categoryCode 필터가 비워지면 전체 대분류 목록 표시
    if (name === 'categoryCode' && value === '') {
      const availableCategories = categories.filter(cat => !cat.markedForDelete);
      setSearchedCategories(availableCategories);
    }
  };

  // 카테고리 입력 처리
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({ ...prev, [name]: value }));
  };

  // 상세 코드 입력 처리
  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setDetailData(prev => ({ ...prev, [name]: value }));
  };

  // 대분류 검색
  const searchCategories = async () => {
    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // TODO: 실제 API 호출로 대체
      // const result = await fetchCategories(categoryFilter);
      // setCategories(result);
      // setInitialCategories(JSON.parse(JSON.stringify(result))); // 깊은 복사로 초기 상태 저장
      showNotification('조회 완료', '대분류 코드를 성공적으로 조회했습니다.', 'success');
    } finally {
      setIsSearching(false);
    }
  };

  // 대분류 초기화 - 편집 내용을 원래 상태로 복원
  const resetCategoryFilter = () => {
    // 필터 초기화
    setCategoryFilter({ code: '', name: '' });
    // 입력 데이터 초기화
    setCategoryData({ code: '', name: '', description: '' });
    // 편집 내용을 초기 상태로 복원
    if (initialCategories.length > 0) {
      setCategories(JSON.parse(JSON.stringify(initialCategories))); // 깊은 복사
      showNotification('초기화 완료', '편집 내용이 조회 시점으로 복원되었습니다.', 'info');
    }
  };

  // 상세 코드 검색
  const searchDetails = async () => {
    if (!selectedCategory) {
      showNotification('선택 오류', '대분류를 먼저 선택해주세요.', 'warning');
      return;
    }

    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // TODO: 실제 API 호출로 대체
      // const result = await fetchDetails(selectedCategory.code, detailFilter);
      // setDetails(result);
      // setInitialDetails(JSON.parse(JSON.stringify(result))); // 깊은 복사로 초기 상태 저장
      showNotification('조회 완료', '상세 코드를 성공적으로 조회했습니다.', 'success');
    } finally {
      setIsSearching(false);
    }
  };

  // 상세 코드 초기화 - 편집 내용을 원래 상태로 복원
  const resetDetailFilter = () => {
    // 필터 초기화
    setDetailFilter({ categoryCode: selectedCategory?.code || '', detailCode: '', detailName: '' });
    // 입력 데이터 초기화
    setDetailData({ categoryCode: selectedCategory?.code || '', code: '', name: '', description: '' });
    // 편집 내용을 초기 상태로 복원
    if (initialDetails.length > 0) {
      setDetails(JSON.parse(JSON.stringify(initialDetails))); // 깊은 복사
      showNotification('초기화 완료', '편집 내용이 조회 시점으로 복원되었습니다.', 'info');
    }
  };

  // 대분류 체크박스 선택
  const handleCategorySelect = (id) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, selected: !cat.selected } : cat
    ));
  };

  // 상세 코드 체크박스 선택
  const handleDetailSelect = (id) => {
    setDetails(prev => prev.map(det => 
      det.id === id ? { ...det, selected: !det.selected } : det
    ));
  };

  // 대분류 저장
  const saveCategories = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCategories = categories
        .filter(cat => !cat.markedForDelete)
        .map(cat => ({ ...cat, isNew: false, selected: false }));
      
      setCategories(updatedCategories);
      setInitialCategories(JSON.parse(JSON.stringify(updatedCategories))); // 저장 후 초기 상태 업데이트
      
      // 상세 코드 탭의 검색 목록도 업데이트
      if (activeTab === 'detail') {
        setSearchedCategories(updatedCategories);
      }
      
      showNotification('저장 완료', '대분류 코드가 성공적으로 저장되었습니다.', 'success');
    } catch (error) {
      showNotification('저장 실패', '대분류 코드 저장 중 오류가 발생했습니다.', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  // 대분류 추가
  const addCategory = () => {
    if (!categoryData.code || !categoryData.name) {
      showNotification('입력 오류', '코드와 코드명을 모두 입력해주세요.', 'warning');
      return;
    }

    if (categories.some(cat => cat.code === categoryData.code && !cat.markedForDelete)) {
      showNotification('입력 오류', '이미 존재하는 코드입니다.', 'warning');
      return;
    }

    const newCategory = {
      id: Date.now(),
      code: categoryData.code,
      name: categoryData.name,
      description: categoryData.description,
      user: currentUser,
      date: new Date().toLocaleString(),
      markedForDelete: false,
      isNew: true,
      selected: false
    };

    setCategories(prev => [...prev, newCategory]);
    setCategoryData({ code: '', name: '', description: '' });
    showNotification('추가 완료', '대분류 코드가 추가되었습니다.', 'success');
  };

  // 대분류 삭제 표시
  const markCategoriesForDelete = () => {
    const selectedItems = categories.filter(cat => cat.selected);
    
    if (selectedItems.length === 0) {
      showNotification('선택 오류', '삭제할 항목을 선택해주세요.', 'warning');
      return;
    }

    setCategories(prev => prev.map(cat => 
      cat.selected ? { ...cat, markedForDelete: !cat.markedForDelete, selected: false } : cat
    ));
  };

  // 대분류 검색 (상세 코드 탭)
  const searchCategoriesForDetail = () => {
    // 검색어가 비어있으면 전체 목록 표시
    if (!detailFilter.categoryCode.trim()) {
      const availableCategories = categories.filter(cat => !cat.markedForDelete);
      setSearchedCategories(availableCategories);
      return;
    }

    const filtered = categories.filter(cat => 
      !cat.markedForDelete && 
      (cat.code.toLowerCase().includes(detailFilter.categoryCode.toLowerCase()) ||
       cat.name.toLowerCase().includes(detailFilter.categoryCode.toLowerCase()))
    );

    if (filtered.length === 0) {
      showNotification('조회 결과 없음', '검색된 대분류 코드가 없습니다.', 'info');
      setSearchedCategories([]);
      setSelectedCategory(null);
    } else {
      setSearchedCategories(filtered);
      setDetailFilter(prev => ({ ...prev, detailCode: '', detailName: '' }));
    }
  };

  // 대분류 선택
  const selectCategoryForDetail = (category) => {
    setSelectedCategory(category);
    setDetailData(prev => ({ ...prev, categoryCode: category.code }));
    setDetailFilter(prev => ({ ...prev, categoryCode: category.code, detailCode: '', detailName: '' }));
  };

  // 상세 코드 저장
  const saveDetails = async () => {
    if (!selectedCategory) {
      showNotification('선택 오류', '대분류를 먼저 선택해주세요.', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedDetails = details
        .filter(det => !det.markedForDelete)
        .map(det => ({ ...det, isNew: false, selected: false }));
      
      setDetails(updatedDetails);
      setInitialDetails(JSON.parse(JSON.stringify(updatedDetails))); // 저장 후 초기 상태 업데이트
      showNotification('저장 완료', '상세 코드가 성공적으로 저장되었습니다.', 'success');
    } catch (error) {
      showNotification('저장 실패', '상세 코드 저장 중 오류가 발생했습니다.', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  // 상세 코드 추가
  const addDetail = () => {
    if (!selectedCategory) {
      showNotification('선택 오류', '대분류를 먼저 선택해주세요.', 'warning');
      return;
    }

    if (!detailData.code || !detailData.name) {
      showNotification('입력 오류', '상세 코드와 상세명을 모두 입력해주세요.', 'warning');
      return;
    }

    if (details.some(det => det.code === detailData.code && !det.markedForDelete)) {
      showNotification('입력 오류', '이미 존재하는 상세 코드입니다.', 'warning');
      return;
    }

    const newDetail = {
      id: Date.now(),
      categoryCode: selectedCategory.code,
      categoryName: selectedCategory.name,
      code: detailData.code,
      name: detailData.name,
      description: detailData.description,
      user: currentUser,
      date: new Date().toLocaleString(),
      markedForDelete: false,
      isNew: true,
      selected: false
    };

    setDetails(prev => [...prev, newDetail]);
    setDetailData(prev => ({ ...prev, code: '', name: '', description: '' }));
    showNotification('추가 완료', '상세 코드가 추가되었습니다.', 'success');
  };

  // 상세 코드 삭제 표시
  const markDetailsForDelete = () => {
    if (!selectedCategory) {
      showNotification('선택 오류', '대분류를 먼저 선택해주세요.', 'warning');
      return;
    }

    const selectedItems = details.filter(det => det.selected);
    
    if (selectedItems.length === 0) {
      showNotification('선택 오류', '삭제할 항목을 선택해주세요.', 'warning');
      return;
    }

    setDetails(prev => prev.map(det => 
      det.selected ? { ...det, markedForDelete: !det.markedForDelete, selected: false } : det
    ));
  };

  // 현재 선택된 대분류의 상세 코드만 필터링
  const filteredDetails = selectedCategory 
    ? details.filter(det => det.categoryCode === selectedCategory.code)
    : [];

  // 공통 스타일
  const styles = {
    pageWrapper: {
      background: '#1e2139',
      minHeight: '100vh',
      padding: '2rem'
    },
    pageHeader: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '1rem',
      padding: '2rem',
      marginBottom: '2rem'
    },
    pageHeaderContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem'
    },
    pageIcon: {
      width: '4rem',
      height: '4rem',
      borderRadius: '1rem',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)'
    },
    pageTitle: {
      fontSize: '1.875rem',
      fontWeight: '700',
      color: '#fff',
      margin: 0
    },
    pageSubtitle: {
      fontSize: '1rem',
      color: 'rgba(255, 255, 255, 0.7)',
      margin: '0.5rem 0 0 0'
    },
    section: {
      background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.95) 0%, rgba(54, 61, 90, 0.95) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
    },
    sectionTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#fff',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    sectionCount: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#a5b4fc',
      background: 'rgba(99, 102, 241, 0.2)',
      padding: '0.25rem 0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid rgba(99, 102, 241, 0.3)'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    formLabel: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.9)'
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      color: 'rgba(255, 255, 255, 0.4)',
      pointerEvents: 'none'
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.75rem',
      background: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '0.5rem',
      color: '#fff',
      fontSize: '0.9375rem',
      transition: 'all 0.2s',
      outline: 'none'
    },
    inputNoIcon: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '0.5rem',
      color: '#fff',
      fontSize: '0.9375rem',
      transition: 'all 0.2s',
      outline: 'none'
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'flex-end',
      flexWrap: 'wrap'
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      border: '1px solid rgba(99, 102, 241, 0.2)'
    },
    tableHeader: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
      borderBottom: '2px solid rgba(99, 102, 241, 0.3)'
    },
    th: {
      padding: '1rem',
      textAlign: 'left',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.9)',
      whiteSpace: 'nowrap'
    },
    td: {
      padding: '1rem',
      fontSize: '0.875rem',
      color: 'rgba(255, 255, 255, 0.8)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 2rem',
      color: 'rgba(255, 255, 255, 0.5)'
    },
    emptyIcon: {
      width: '48px',
      height: '48px',
      margin: '0 auto 1rem',
      opacity: 0.3
    },
    emptyTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: '0.5rem'
    },
    emptyDesc: {
      fontSize: '0.875rem',
      color: 'rgba(255, 255, 255, 0.5)'
    },
    checkbox: {
      width: '1.125rem',
      height: '1.125rem',
      borderRadius: '0.25rem',
      cursor: 'pointer',
      accentColor: '#6366f1'
    },
    tabButton: {
      padding: '0.875rem 1.5rem',
      fontSize: '0.9375rem',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.6)',
      background: 'transparent',
      border: 'none',
      borderBottom: '3px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s',
      borderRadius: '0.5rem 0.5rem 0 0'
    },
    tabButtonActive: {
      color: '#fff',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
      borderBottomColor: '#6366f1'
    },
    categoryCard: {
      padding: '0.875rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.2s',
      marginBottom: '0.5rem'
    },
    categoryCardSelected: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
      border: '2px solid #6366f1'
    },
    selectedCategoryInfo: {
      padding: '1rem 1.5rem',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '0.75rem',
      marginBottom: '1.5rem'
    }
  };

  return (
    <MonitoringLayout>
      <div style={styles.pageWrapper}>
        {/* 페이지 헤더 */}
        <div style={styles.pageHeader}>
          <div style={styles.pageHeaderContent}>
            <div style={styles.pageIcon}>
              <Settings size={32} />
            </div>
            <div>
              <h1 style={styles.pageTitle}>코드 관리</h1>
              <p style={styles.pageSubtitle}>시스템 코드 및 상세 코드 관리</p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.95) 0%, rgba(54, 61, 90, 0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '1rem',
          marginBottom: '1.5rem',
          overflow: 'hidden'
        }}>
          <div style={{display: 'flex', borderBottom: '1px solid rgba(99, 102, 241, 0.2)'}}>
            <button
              onClick={() => setActiveTab('category')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'category' ? styles.tabButtonActive : {})
              }}
            >
              대분류 코드
            </button>
            <button
              onClick={() => setActiveTab('detail')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'detail' ? styles.tabButtonActive : {})
              }}
            >
              상세 코드
            </button>
          </div>
        </div>

        {/* 대분류 코드 탭 */}
        {activeTab === 'category' && (
          <>
            {/* 입력 섹션 */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>대분류 코드 등록</h3>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <AddButton onClick={addCategory} />
                  <DeleteButton onClick={markCategoriesForDelete} />
                  <SaveButton onClick={saveCategories} isLoading={isSaving} />
                </div>
              </div>
              
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    코드 <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="code"
                    value={categoryData.code}
                    onChange={handleCategoryChange}
                    placeholder="예: CAT001" 
                    style={styles.inputNoIcon}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    코드명 <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={categoryData.name}
                    onChange={handleCategoryChange}
                    placeholder="예: 카테고리1" 
                    style={styles.inputNoIcon}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>설명</label>
                  <input 
                    type="text" 
                    name="description"
                    value={categoryData.description}
                    onChange={handleCategoryChange}
                    placeholder="코드 설명" 
                    style={styles.inputNoIcon}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                  />
                </div>
              </div>
            </div>

            {/* 대분류 목록 */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <h3 style={styles.sectionTitle}>대분류 코드 목록</h3>
                  <span style={styles.sectionCount}>{categories.length}개</span>
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <SearchButton onClick={searchCategories} isLoading={isSearching} />
                  <ResetButton onClick={resetCategoryFilter} />
                </div>
              </div>
              
              {/* 조회 필터 */}
              <div style={{marginBottom: '1.5rem'}}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>코드</label>
                    <div style={styles.inputWrapper}>
                      <Search size={16} style={styles.inputIcon} />
                      <input 
                        type="text" 
                        name="code"
                        value={categoryFilter.code}
                        onChange={handleCategoryFilterChange}
                        placeholder="코드 검색" 
                        style={styles.input}
                        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                      />
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>코드명</label>
                    <div style={styles.inputWrapper}>
                      <Search size={16} style={styles.inputIcon} />
                      <input 
                        type="text" 
                        name="name"
                        value={categoryFilter.name}
                        onChange={handleCategoryFilterChange}
                        placeholder="코드명 검색" 
                        style={styles.input}
                        onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                  <thead style={styles.tableHeader}>
                    <tr>
                      <th style={{...styles.th, width: '50px', textAlign: 'center'}}>선택</th>
                      <th style={styles.th}>코드</th>
                      <th style={styles.th}>코드명</th>
                      <th style={styles.th}>설명</th>
                      <th style={styles.th}>작업자</th>
                      <th style={styles.th}>작업일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{...styles.td, borderBottom: 'none'}}>
                          <div style={styles.emptyState}>
                            <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <h4 style={styles.emptyTitle}>등록된 코드가 없습니다</h4>
                            <p style={styles.emptyDesc}>새로운 대분류 코드를 등록해주세요</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      categories.map(cat => (
                        <tr 
                          key={cat.id}
                          style={{
                            background: cat.markedForDelete 
                              ? 'rgba(239, 68, 68, 0.1)' 
                              : cat.isNew 
                              ? 'rgba(34, 197, 94, 0.1)' 
                              : 'transparent',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (!cat.markedForDelete && !cat.isNew) {
                              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!cat.markedForDelete && !cat.isNew) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <td style={{...styles.td, textAlign: 'center'}}>
                            <input 
                              type="checkbox"
                              checked={cat.selected}
                              onChange={() => handleCategorySelect(cat.id)}
                              style={styles.checkbox}
                            />
                          </td>
                          <td style={styles.td}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                              {cat.isNew && <Plus size={16} style={{color: '#22c55e'}} />}
                              {cat.markedForDelete && <Trash2 size={16} style={{color: '#ef4444'}} />}
                              <span>{cat.code}</span>
                            </div>
                          </td>
                          <td style={styles.td}>{cat.name}</td>
                          <td style={{...styles.td, color: 'rgba(255, 255, 255, 0.6)'}}>{cat.description}</td>
                          <td style={styles.td}>{cat.user}</td>
                          <td style={{...styles.td, color: 'rgba(255, 255, 255, 0.6)'}}>{cat.date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* 상세 코드 탭 */}
        {activeTab === 'detail' && (
          <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem'}}>
            {/* 좌측: 대분류 검색 */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>대분류 조회</h3>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>대분류 검색</label>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <input 
                    type="text" 
                    name="categoryCode"
                    value={detailFilter.categoryCode}
                    onChange={handleDetailFilterChange}
                    placeholder="코드 또는 코드명" 
                    style={{...styles.inputNoIcon, flex: 1}}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                  />
                  <SearchButton onClick={searchCategoriesForDetail} />
                </div>
              </div>

              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginTop: '1rem'
              }}>
                {searchedCategories.length === 0 ? (
                  <div style={{...styles.emptyState, padding: '2rem 1rem'}}>
                    <Info size={32} style={{...styles.emptyIcon, margin: '0 auto 0.5rem'}} />
                    <h4 style={{...styles.emptyTitle, fontSize: '0.9rem'}}>대분류 코드가 없습니다</h4>
                    <p style={{...styles.emptyDesc, fontSize: '0.8rem'}}>대분류 코드 탭에서 먼저 등록해주세요</p>
                  </div>
                ) : (
                  searchedCategories.map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => selectCategoryForDetail(cat)}
                      style={{
                        ...styles.categoryCard,
                        ...(selectedCategory?.id === cat.id ? styles.categoryCardSelected : {})
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategory?.id !== cat.id) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory?.id !== cat.id) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }
                      }}
                    >
                      <div style={{fontWeight: '600', color: '#fff', marginBottom: '0.25rem'}}>
                        {cat.code}
                      </div>
                      <div style={{fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.6)'}}>
                        {cat.name}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 우측: 상세 코드 관리 */}
            <div>
              {!selectedCategory ? (
                <div style={{...styles.section, height: '100%', minHeight: '400px'}}>
                  <div style={{...styles.emptyState, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <Info size={48} style={styles.emptyIcon} />
                    <h4 style={styles.emptyTitle}>대분류를 선택하세요</h4>
                    <p style={styles.emptyDesc}>좌측에서 대분류를 선택하면 상세 코드를 관리할 수 있습니다</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* 선택된 대분류 정보 */}
                  <div style={styles.selectedCategoryInfo}>
                    <div style={{fontSize: '0.875rem', color: '#a5b4fc', marginBottom: '0.5rem'}}>
                      선택된 대분류
                    </div>
                    <div style={{fontSize: '1.25rem', fontWeight: '700', color: '#fff'}}>
                      {selectedCategory.code} - {selectedCategory.name}
                    </div>
                  </div>

                  {/* 입력 섹션 */}
                  <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                      <h3 style={styles.sectionTitle}>상세 코드 등록</h3>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <AddButton onClick={addDetail} />
                        <DeleteButton onClick={markDetailsForDelete} />
                        <SaveButton onClick={saveDetails} isLoading={isSaving} />
                      </div>
                    </div>
                    
                    <div style={styles.formGrid}>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>
                          상세 코드 <span style={{color: '#ef4444'}}>*</span>
                        </label>
                        <input 
                          type="text" 
                          name="code"
                          value={detailData.code}
                          onChange={handleDetailChange}
                          placeholder="예: DET001" 
                          style={styles.inputNoIcon}
                          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>
                          상세명 <span style={{color: '#ef4444'}}>*</span>
                        </label>
                        <input 
                          type="text" 
                          name="name"
                          value={detailData.name}
                          onChange={handleDetailChange}
                          placeholder="예: 상세1" 
                          style={styles.inputNoIcon}
                          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>설명</label>
                        <input 
                          type="text" 
                          name="description"
                          value={detailData.description}
                          onChange={handleDetailChange}
                          placeholder="코드 설명" 
                          style={styles.inputNoIcon}
                          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 상세 코드 목록 */}
                  <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <h3 style={styles.sectionTitle}>상세 코드 목록</h3>
                        <span style={styles.sectionCount}>{filteredDetails.length}개</span>
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <SearchButton onClick={searchDetails} isLoading={isSearching} />
                        <ResetButton onClick={resetDetailFilter} />
                      </div>
                    </div>
                    
                    {/* 조회 필터 */}
                    <div style={{marginBottom: '1.5rem'}}>
                      <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>상세 코드</label>
                          <div style={styles.inputWrapper}>
                            <Search size={16} style={styles.inputIcon} />
                            <input 
                              type="text" 
                              name="detailCode"
                              value={detailFilter.detailCode}
                              onChange={handleDetailFilterChange}
                              placeholder="상세 코드 검색" 
                              style={styles.input}
                              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                              onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                            />
                          </div>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>상세 코드명</label>
                          <div style={styles.inputWrapper}>
                            <Search size={16} style={styles.inputIcon} />
                            <input 
                              type="text" 
                              name="detailName"
                              value={detailFilter.detailName}
                              onChange={handleDetailFilterChange}
                              placeholder="코드명 검색" 
                              style={styles.input}
                              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                              onBlur={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{overflowX: 'auto'}}>
                      <table style={styles.table}>
                        <thead style={styles.tableHeader}>
                          <tr>
                            <th style={{...styles.th, width: '50px', textAlign: 'center'}}>선택</th>
                            <th style={styles.th}>상세 코드</th>
                            <th style={styles.th}>상세명</th>
                            <th style={styles.th}>설명</th>
                            <th style={styles.th}>작업자</th>
                            <th style={styles.th}>작업일시</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDetails.length === 0 ? (
                            <tr>
                              <td colSpan="6" style={{...styles.td, borderBottom: 'none'}}>
                                <div style={styles.emptyState}>
                                  <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                  </svg>
                                  <h4 style={styles.emptyTitle}>등록된 상세 코드가 없습니다</h4>
                                  <p style={styles.emptyDesc}>새로운 상세 코드를 등록해주세요</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredDetails.map(det => (
                              <tr 
                                key={det.id}
                                style={{
                                  background: det.markedForDelete 
                                    ? 'rgba(239, 68, 68, 0.1)' 
                                    : det.isNew 
                                    ? 'rgba(34, 197, 94, 0.1)' 
                                    : 'transparent',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  if (!det.markedForDelete && !det.isNew) {
                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!det.markedForDelete && !det.isNew) {
                                    e.currentTarget.style.background = 'transparent';
                                  }
                                }}
                              >
                                <td style={{...styles.td, textAlign: 'center'}}>
                                  <input 
                                    type="checkbox"
                                    checked={det.selected}
                                    onChange={() => handleDetailSelect(det.id)}
                                    style={styles.checkbox}
                                  />
                                </td>
                                <td style={styles.td}>
                                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                    {det.isNew && <Plus size={16} style={{color: '#22c55e'}} />}
                                    {det.markedForDelete && <Trash2 size={16} style={{color: '#ef4444'}} />}
                                    <span>{det.code}</span>
                                  </div>
                                </td>
                                <td style={styles.td}>{det.name}</td>
                                <td style={{...styles.td, color: 'rgba(255, 255, 255, 0.6)'}}>{det.description}</td>
                                <td style={styles.td}>{det.user}</td>
                                <td style={{...styles.td, color: 'rgba(255, 255, 255, 0.6)'}}>{det.date}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 알림 모달 */}
        <Modal 
          show={showAlertModal} 
          onHide={() => setShowAlertModal(false)}
          centered
          backdrop="static"
          style={{zIndex: 9999}}
        >
          <Modal.Body 
            className="text-center p-4" 
            style={{
              background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.98) 0%, rgba(54, 61, 90, 0.98) 100%)',
              borderRadius: '1rem'
            }}
          >
            {alertConfig.icon}
            <h5 className="fw-bold mb-3" style={{color: '#fff'}}>{alertConfig.title}</h5>
            <p className="mb-4" style={{color: 'rgba(255, 255, 255, 0.7)'}}>{alertConfig.message}</p>
            <Button 
              onClick={() => setShowAlertModal(false)}
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
                background: alertConfig.variant === 'success' 
                  ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                  : alertConfig.variant === 'info' 
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : alertConfig.variant === 'warning'
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff'
              }}
            >
              확인
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    </MonitoringLayout>
  );
};

export default Code;
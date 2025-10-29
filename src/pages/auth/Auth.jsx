import React, { useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MonitoringLayout from '../../components/MonitoringLayout';
import { Modal, Button } from 'react-bootstrap';
import { CheckCircle, XCircle, Info, AlertTriangle, Shield, Trash2 } from 'lucide-react';
import MenuSelectionModal from './components/MenuSelectionModal';
import { SearchButton, SaveButton, ResetButton, AddButton, DeleteButton } from '../../components/button';
import './Auth.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// ========================================
// Yup 스키마 정의
// ========================================
const menuPermissionSchema = yup.object({
  key: yup.string().required('메뉴를 선택해주세요'),
  name: yup.string(),
  permissions: yup.object({
    create: yup.boolean().default(false),
    update: yup.boolean().default(false),
    delete: yup.boolean().default(false),
    read: yup.boolean().default(false),
  }),
  user: yup.string(),
});

const roleSchema = yup.object({
  name: yup
    .string()
    .required('권한명을 입력해주세요')
    .max(50, '권한명은 최대 50자까지 입력 가능합니다'),
  key: yup
    .string()
    .required('권한키를 입력해주세요')
    .max(30, '권한키는 최대 30자까지 입력 가능합니다')
    .matches(/^[A-Z0-9_]+$/, '권한키는 대문자, 숫자, 언더스코어(_)만 사용 가능합니다')
    .test('unique-key', '이미 존재하는 권한키입니다', function(value) {
      if (!value) return true;
      const { options } = this;
      const roles = options.context?.roles || [];
      const currentIndex = options.context?.currentIndex;
      
      const duplicateIndex = roles.findIndex((role, idx) => 
        role.key === value && idx !== currentIndex
      );
      
      return duplicateIndex === -1;
    }),
  menus: yup.array().of(menuPermissionSchema).default([]),
  user: yup.string(),
  date: yup.string(),
  tempId: yup.number(),
  isActive: yup.boolean().default(true),
  isNew: yup.boolean(),
  isSaved: yup.boolean().default(false), // 저장된 데이터 여부
});

// 전체 폼 스키마
const authFormSchema = yup.object({
  roles: yup
    .array()
    .of(roleSchema)
    .min(1, '최소 1개 이상의 권한 그룹이 필요합니다'),
});

const Auth = () => {
  // ========================================
  // 검색/필터 상태
  // ========================================
  const [filterName, setFilterName] = useState('');
  const [filterKey, setFilterKey] = useState('');
  const [selectedRoleKeys, setSelectedRoleKeys] = useState([]); // 체크박스로 변경
  
  // ========================================
  // UI 상태
  // ========================================
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteTargetRoles, setDeleteTargetRoles] = useState([]); // 삭제할 역할들
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSelectingMenu, setIsSelectingMenu] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

  // ========================================
  // 사용자 정보
  // ========================================
  const getCurrentUser = () => {
    const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.id || user.username || user.email || '게스트';
      } catch (e) {
        return '게스트';
      }
    }
    return '게스트';
  };

  const currentUser = getCurrentUser();

  // ========================================
  // 메뉴 트리 정의
  // ========================================
  const menuTree = useMemo(() => [
    { 
      name: '모니터링', 
      key: 'main1', 
      children: [
        { name: '실시간 모니터링', key: 'main1_realtime', children: [] },
        { name: '통계 대시보드', key: 'main1_stats', children: [] }
      ] 
    },
    { 
      name: '데이터 수집', 
      key: 'datacollector', 
      children: [
        { name: '데이터 업로드', key: 'datacollector_upload', children: [] },
        { name: '수집 이력', key: 'datacollector_history', children: [] }
      ] 
    },
    { 
      name: '학습모델', 
      key: 'modelmanage', 
      children: [
        { name: '모델 목록', key: 'modelmanage_list', children: [] },
        { name: '모델 학습', key: 'modelmanage_train', children: [] }
      ] 
    },
    { 
      name: 'AI Chat관리', 
      key: 'chat', 
      children: [
        { name: '채팅 이력', key: 'chat_history', children: [] },
        { name: '채팅 설정', key: 'chat_config', children: [] }
      ] 
    },
    { 
      name: 'APIs', 
      key: 'apimanage', 
      children: [] 
    },
    { 
      name: '관리', 
      key: 'manage',
      children: [
        { name: '권한 관리', key: 'auth', children: [] },
        { name: '권한신청', key: 'authorizationRequest', children: [] },
        { name: '권한 승인', key: 'authaprove', children: [] },
        { name: '메뉴관리', key: 'menu', children: [] }
      ]
    }
  ], []);

  // ========================================
  // React Hook Form 설정
  // ========================================
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
    trigger
  } = useForm({
    resolver: yupResolver(authFormSchema),
    mode: 'onBlur',
    defaultValues: {
      roles: [
        {
          name: '관리자',
          key: 'ADMIN',
          menus: [],
          user: currentUser,
          date: '2025-09-18 10:00',
          tempId: 1,
          isActive: true,
          isSaved: true // 기존 데이터
        },
        {
          name: '일반사용자',
          key: 'USER',
          menus: [],
          user: currentUser,
          date: '2025-09-18 11:00',
          tempId: 2,
          isActive: true,
          isSaved: true // 기존 데이터
        }
      ]
    },
    context: { roles: [] }
  });

  // useFieldArray로 roles 관리
  const { 
    fields: roleFields, 
    append: appendRole, 
    remove: removeRole,
    update: updateRole
  } = useFieldArray({
    control,
    name: 'roles'
  });

  // 현재 roles 값 감시
  const watchedRoles = watch('roles');

  // 중복 검사를 위한 컨텍스트 업데이트
  useEffect(() => {
    if (watchedRoles) {
      trigger();
    }
  }, [watchedRoles, trigger]);

  // ========================================
  // 필터링된 역할 목록
  // ========================================
  const displayedRoles = useMemo(() => {
    if (!watchedRoles) return [];
    
    return watchedRoles.filter(role => {
      const nameMatch = !filterName || role.name?.toLowerCase().includes(filterName.toLowerCase());
      const keyMatch = !filterKey || role.key?.toLowerCase().includes(filterKey.toLowerCase());
      return nameMatch && keyMatch;
    });
  }, [watchedRoles, filterName, filterKey]);

  // ========================================
  // 선택된 역할의 메뉴 (첫 번째 선택된 역할)
  // ========================================
  const currentMenus = useMemo(() => {
    if (selectedRoleKeys.length === 0 || !watchedRoles) return [];
    
    const selectedRole = watchedRoles.find(r => r.key === selectedRoleKeys[0]);
    return selectedRole?.menus || [];
  }, [selectedRoleKeys, watchedRoles]);

  // 선택된 역할의 인덱스 (첫 번째)
  const selectedRoleIndex = useMemo(() => {
    if (selectedRoleKeys.length === 0 || !watchedRoles) return -1;
    return watchedRoles.findIndex(r => r.key === selectedRoleKeys[0]);
  }, [selectedRoleKeys, watchedRoles]);

  // ========================================
  // 유틸리티 함수
  // ========================================
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

  const findMenuNode = (nodes, key) => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children && node.children.length > 0) {
        const found = findMenuNode(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // ========================================
  // 검색 및 초기화
  // ========================================
  const searchRoles = async () => {
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSearching(false);
  };

  const resetFilters = () => {
    setFilterName('');
    setFilterKey('');
    setSelectedRoleKeys([]);
  };

  // ========================================
  // 역할 관리 함수
  // ========================================
  const addRoleRow = () => {
    const newRole = {
      name: '',
      key: '',
      menus: [],
      user: currentUser,
      date: new Date().toLocaleString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isNew: true,
      tempId: Date.now(),
      isActive: true,
      isSaved: false // 새로 추가된 데이터
    };

    appendRole(newRole);
  };

  // 체크박스 토글
  const toggleRoleSelection = (roleKey) => {
    setSelectedRoleKeys(prev => {
      if (prev.includes(roleKey)) {
        return prev.filter(key => key !== roleKey);
      } else {
        return [...prev, roleKey];
      }
    });
  };

  // 전체 선택/해제
  const toggleAllRoles = () => {
    if (selectedRoleKeys.length === displayedRoles.length) {
      setSelectedRoleKeys([]);
    } else {
      setSelectedRoleKeys(displayedRoles.map(role => role.key));
    }
  };

  // 삭제 버튼 클릭 시
  const handleDeleteClick = () => {
    if (selectedRoleKeys.length === 0) {
      showNotification('선택 필요', '삭제할 권한 그룹을 선택해주세요.', 'warning');
      return;
    }

    // 선택된 역할 중 저장된 데이터가 있는지 확인
    const selectedRoles = watchedRoles.filter(role => selectedRoleKeys.includes(role.key));
    const savedRoles = selectedRoles.filter(role => role.isSaved);

    if (savedRoles.length > 0) {
      // 저장된 데이터가 있으면 확인 모달 표시
      setDeleteTargetRoles(selectedRoles);
      setShowDeleteConfirmModal(true);
    } else {
      // 저장되지 않은 데이터만 있으면 바로 삭제
      executeDelete(selectedRoles);
    }
  };

  // 삭제 실행
  const executeDelete = (rolesToDelete) => {
    const deleteIndices = rolesToDelete
      .map(role => watchedRoles.findIndex(r => r.tempId === role.tempId))
      .filter(index => index !== -1)
      .sort((a, b) => b - a); // 역순으로 정렬하여 삭제

    deleteIndices.forEach(index => {
      removeRole(index);
    });

    setSelectedRoleKeys([]);
    setShowDeleteConfirmModal(false);
    setDeleteTargetRoles([]);

    showNotification(
      '삭제 완료',
      `${rolesToDelete.length}개의 권한 그룹이 삭제되었습니다.`,
      'success'
    );
  };

  // 삭제 확인
  const confirmDelete = () => {
    executeDelete(deleteTargetRoles);
  };

  // 삭제 취소
  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setDeleteTargetRoles([]);
  };

  // ========================================
  // 권한 그룹 저장
  // ========================================
  const saveRoleGroups = async () => {
    setIsSaving(true);
    
    try {
      // 폼 유효성 검사
      const isValid = await trigger('roles');
      
      if (!isValid) {
        showNotification('검증 오류', '입력값을 확인해주세요.', 'warning');
        setIsSaving(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const roles = getValues('roles');
      console.log('저장할 권한 그룹:', roles);
      
      // 모든 역할을 저장된 상태로 업데이트
      roles.forEach((role, index) => {
        setValue(`roles.${index}.isSaved`, true);
      });
      
      showNotification(
        '저장 완료',
        '권한 그룹이 성공적으로 저장되었습니다.',
        'success'
      );
    } catch (error) {
      showNotification(
        '저장 실패',
        error.message || '저장 중 오류가 발생했습니다.',
        'danger'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ========================================
  // 메뉴 관리 함수 (모달 방식)
  // ========================================
  const openMenuModal = () => {
    if (selectedRoleKeys.length === 0) {
      showNotification('역할 미선택', '먼저 권한 그룹을 선택해주세요.', 'warning');
      return;
    }
    if (selectedRoleKeys.length > 1) {
      showNotification('다중 선택 불가', '메뉴 설정은 한 번에 하나의 권한 그룹만 가능합니다.', 'warning');
      return;
    }
    setShowMenuModal(true);
  };

  const closeMenuModal = () => {
    setShowMenuModal(false);
  };

  const confirmMenuSelection = async (selectedMenus) => {
    console.log('confirmMenuSelection 호출됨');
    console.log('selectedMenus:', selectedMenus);
    console.log('selectedRoleIndex:', selectedRoleIndex);
    
    if (selectedRoleIndex === -1) {
      showNotification('역할 미선택', '권한 그룹이 선택되지 않았습니다.', 'warning');
      return;
    }

    if (!selectedMenus || selectedMenus.length === 0) {
      showNotification('메뉴 미선택', '선택된 메뉴가 없습니다.', 'warning');
      return;
    }

    setIsSelectingMenu(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 현재 메뉴 가져오기
      const currentRoleMenus = getValues(`roles.${selectedRoleIndex}.menus`) || [];
      
      // 새로운 메뉴를 기존 메뉴와 병합 (중복 제거)
      const existingMenuKeys = new Set(currentRoleMenus.map(m => m.key));
      const newMenus = selectedMenus.filter(menu => !existingMenuKeys.has(menu.key));
      
      // 병합된 메뉴 목록
      const updatedMenus = [...currentRoleMenus, ...newMenus];
      
      console.log('updatedMenus:', updatedMenus);
      
      // setValue로 메뉴 업데이트
      setValue(`roles.${selectedRoleIndex}.menus`, updatedMenus, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
      
      // 강제로 리렌더링을 위해 updateRole 사용
      const updatedRole = {
        ...watchedRoles[selectedRoleIndex],
        menus: updatedMenus
      };
      updateRole(selectedRoleIndex, updatedRole);
      
      setShowMenuModal(false);
      setIsSelectingMenu(false);
      showNotification(
        '메뉴 선택 완료', 
        `${newMenus.length}개의 메뉴가 추가되었습니다.`, 
        'success'
      );
    } catch (error) {
      console.error('메뉴 선택 중 오류:', error);
      setIsSelectingMenu(false);
      showNotification('오류 발생', '메뉴 선택 중 오류가 발생했습니다.', 'danger');
    }
  };

  const updateMenuPermission = (menuIndex, permissionType, value) => {
    if (selectedRoleIndex === -1) return;

    setValue(
      `roles.${selectedRoleIndex}.menus.${menuIndex}.permissions.${permissionType}`, 
      value,
      {
        shouldValidate: false,
        shouldDirty: true
      }
    );
  };

  const savePermissions = async () => {
    if (selectedRoleIndex === -1 || currentMenus.length === 0) {
      showNotification('저장 불가', '저장할 메뉴가 없습니다.', 'warning');
      return;
    }

    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('저장할 메뉴 권한:', currentMenus);
      
      showNotification(
        '저장 완료',
        '메뉴별 권한이 성공적으로 저장되었습니다.',
        'success'
      );
    } catch (error) {
      showNotification(
        '저장 실패',
        error.message || '저장 중 오류가 발생했습니다.',
        'danger'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ========================================
  // 비동기 중복 검사
  // ========================================
  const validateRoleKeyUnique = async (index, value) => {
    if (!value) {
      clearErrors(`roles.${index}.key`);
      return;
    }

    const upperValue = value.toUpperCase();
    setValue(`roles.${index}.key`, upperValue, { shouldValidate: false });

    const roles = getValues('roles');
    const isDuplicate = roles.some((role, idx) => 
      idx !== index && role.key === upperValue
    );

    if (isDuplicate) {
      setError(`roles.${index}.key`, {
        type: 'manual',
        message: '이미 존재하는 권한키입니다'
      });
    } else {
      clearErrors(`roles.${index}.key`);
      await trigger(`roles.${index}.key`);
    }
  };

  // 디바운스 타이머
  const debounceTimers = React.useRef({});

  const handleRoleKeyBlur = (index, value) => {
    if (debounceTimers.current[index]) {
      clearTimeout(debounceTimers.current[index]);
    }

    debounceTimers.current[index] = setTimeout(() => {
      validateRoleKeyUnique(index, value);
    }, 300);
  };

  // ========================================
  // 폼 제출
  // ========================================
  const onSubmit = async (data) => {
    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('저장할 데이터:', data);
      
      showNotification(
        '저장 완료',
        '권한 설정이 성공적으로 저장되었습니다.',
        'success'
      );
    } catch (error) {
      showNotification(
        '저장 실패',
        error.message || '저장 중 오류가 발생했습니다.',
        'danger'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const onError = (errors) => {
    console.log('검증 오류:', errors);
    
    const firstError = Object.values(errors)[0];
    let errorMessage = '입력값을 확인해주세요.';
    
    if (firstError?.message) {
      errorMessage = firstError.message;
    } else if (firstError?.roles) {
      const roleError = firstError.roles[0];
      if (roleError?.name?.message) {
        errorMessage = roleError.name.message;
      } else if (roleError?.key?.message) {
        errorMessage = roleError.key.message;
      }
    }
    
    showNotification('검증 오류', errorMessage, 'warning');
  };

  return (
    <MonitoringLayout>
      <div className="auth-page-wrapper">
        {/* 페이지 헤더 */}
        <div className="auth-page-header">
          <div className="auth-page-header-content">
            <div className="auth-page-icon">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="auth-page-title">권한 관리</h1>
              <p className="auth-page-subtitle">역할 기반 접근 제어 (RBAC) 관리</p>
            </div>
          </div>
        </div>

        {/* 메인 컨테이너 */}
        <div className="auth-container-improved">
          {/* ===== [섹션 1] 권한 그룹 관리 ===== */}
          <div className="auth-section">
            <div className="auth-section-header">
              <div className="auth-section-title-wrapper">
                <h4 className="auth-section-title">권한 그룹 관리</h4>
                <span className="auth-section-count">{displayedRoles.length}개</span>
              </div>
              <div className="auth-button-group">
                <SearchButton 
                  onClick={searchRoles}
                  isLoading={isSearching}
                />
                <SaveButton 
                  onClick={saveRoleGroups}
                  isLoading={isSaving}
                />
                <DeleteButton 
                  onClick={handleDeleteClick}
                  disabled={selectedRoleKeys.length === 0}
                />
                <ResetButton onClick={resetFilters} />
                <AddButton onClick={addRoleRow}>
                  그룹 추가
                </AddButton>
              </div>
            </div>
            
            <div className="auth-section-body">
              {/* 검색 필터 */}
              <div className="auth-search-grid">
                <div className="auth-form-group">
                  <label className="auth-form-label">권한명</label>
                  <input
                    type="text"
                    className="auth-form-input"
                    placeholder="권한명으로 검색"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                  />
                </div>
                <div className="auth-form-group">
                  <label className="auth-form-label">권한키</label>
                  <input
                    type="text"
                    className="auth-form-input"
                    placeholder="권한키로 검색"
                    value={filterKey}
                    onChange={(e) => setFilterKey(e.target.value)}
                  />
                </div>
              </div>

              {/* 역할 테이블 */}
              <div className="auth-table-container">
                <table className="auth-table-modern">
                  <thead>
                    <tr>
                      <th style={{width: '50px'}}>
                        <input
                          type="checkbox"
                          checked={displayedRoles.length > 0 && selectedRoleKeys.length === displayedRoles.length}
                          onChange={toggleAllRoles}
                          className="auth-modern-checkbox"
                        />
                      </th>
                      <th>권한명</th>
                      <th>권한키</th>
                      <th>작업자</th>
                      <th>작업일시</th>
                      <th className="auth-status-col">사용여부</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRoles.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="auth-empty-cell">
                          <div className="auth-empty-state">
                            <svg className="auth-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                            <h4 className="auth-empty-title">등록된 권한이 없습니다</h4>
                            <p className="auth-empty-desc">"그룹 추가" 버튼을 클릭하여 새로운 권한 그룹을 추가하세요</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      displayedRoles.map((role, displayIndex) => {
                        const actualIndex = watchedRoles.findIndex(r => r.tempId === role.tempId);
                        
                        return (
                          <tr 
                            key={role.tempId || displayIndex}
                            className={selectedRoleKeys.includes(role.key) ? 'auth-row-selected' : ''}
                          >
                            <td style={{textAlign: 'center'}}>
                              <input
                                type="checkbox"
                                checked={selectedRoleKeys.includes(role.key)}
                                onChange={() => toggleRoleSelection(role.key)}
                                className="auth-modern-checkbox"
                              />
                            </td>
                            <td className="auth-name-cell">
                              <Controller
                                name={`roles.${actualIndex}.name`}
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                  <>
                                    <input
                                      {...field}
                                      type="text"
                                      className={`auth-form-input ${error ? 'is-invalid' : ''}`}
                                      placeholder="권한명 입력"
                                    />
                                    {error && (
                                      <div className="auth-error-message">{error.message}</div>
                                    )}
                                  </>
                                )}
                              />
                            </td>
                            <td className="auth-key-cell">
                              <Controller
                                name={`roles.${actualIndex}.key`}
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                  <>
                                    <input
                                      {...field}
                                      type="text"
                                      className={`auth-form-input ${error ? 'is-invalid' : ''}`}
                                      placeholder="ROLE_NAME"
                                      onBlur={(e) => handleRoleKeyBlur(actualIndex, e.target.value)}
                                      onChange={(e) => {
                                        const upperValue = e.target.value.toUpperCase();
                                        field.onChange(upperValue);
                                      }}
                                    />
                                    {error && (
                                      <div className="auth-error-message">{error.message}</div>
                                    )}
                                  </>
                                )}
                              />
                            </td>
                            <td className="auth-user-cell">{role.user}</td>
                            <td className="auth-date-cell">{role.date}</td>
                            <td className="auth-status-cell">
                              <Controller
                                name={`roles.${actualIndex}.isActive`}
                                control={control}
                                render={({ field }) => (
                                  <div className="auth-toggle-switch">
                                    <input
                                      type="checkbox"
                                      id={`toggle-${role.tempId}`}
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="auth-toggle-input"
                                    />
                                    <label htmlFor={`toggle-${role.tempId}`} className="auth-toggle-label">
                                      <span className="auth-toggle-slider"></span>
                                    </label>
                                  </div>
                                )}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ===== [섹션 2] 메뉴별 권한 설정 (모달 선택 방식) ===== */}
          <div className="auth-section">
            <div className="auth-section-header">
              <div className="auth-section-title-wrapper">
                <h4 className="auth-section-title">메뉴별 권한 설정</h4>
                {selectedRoleKeys.length === 1 && (
                  <span className="auth-selected-role">
                    {displayedRoles.find(r => r.key === selectedRoleKeys[0])?.name}
                  </span>
                )}
              </div>
              <div className="auth-button-group">
                {/* 모달 방식으로 메뉴 선택 */}
                <AddButton
                  onClick={openMenuModal}
                  disabled={selectedRoleKeys.length !== 1 || isSelectingMenu}
                >
                  메뉴 선택
                </AddButton>
                <SaveButton
                  onClick={savePermissions}
                  disabled={selectedRoleKeys.length !== 1 || isSaving || currentMenus.length === 0}
                  isLoading={isSaving}
                />
              </div>
            </div>
            
            <div className="auth-section-body">
              <div className="auth-table-container">
                <table className="auth-table-modern">
                  <thead>
                    <tr>
                      <th>메뉴명</th>
                      <th className="auth-permission-col">등록</th>
                      <th className="auth-permission-col">수정</th>
                      <th className="auth-permission-col">삭제</th>
                      <th className="auth-permission-col">조회</th>
                      <th>작업자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMenus.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="auth-empty-cell">
                          <div className="auth-empty-state">
                            <svg className="auth-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <h4 className="auth-empty-title">메뉴가 없습니다</h4>
                            <p className="auth-empty-desc">
                              {selectedRoleKeys.length === 1 ? '"메뉴 선택" 버튼을 클릭하여 메뉴를 추가하세요' : '권한 그룹을 하나만 선택하세요'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentMenus.map((menu, menuIndex) => (
                        <tr key={menuIndex}>
                          <td>
                            <div className="auth-menu-name-cell">
                              <span>{menu.name}</span>
                            </div>
                          </td>
                          <td className="auth-permission-col">
                            <input 
                              type="checkbox" 
                              checked={menu.permissions?.create || false}
                              onChange={(e) => updateMenuPermission(menuIndex, 'create', e.target.checked)}
                              className="auth-modern-checkbox"
                            />
                          </td>
                          <td className="auth-permission-col">
                            <input 
                              type="checkbox" 
                              checked={menu.permissions?.update || false}
                              onChange={(e) => updateMenuPermission(menuIndex, 'update', e.target.checked)}
                              className="auth-modern-checkbox"
                            />
                          </td>
                          <td className="auth-permission-col">
                            <input 
                              type="checkbox" 
                              checked={menu.permissions?.delete || false}
                              onChange={(e) => updateMenuPermission(menuIndex, 'delete', e.target.checked)}
                              className="auth-modern-checkbox"
                            />
                          </td>
                          <td className="auth-permission-col">
                            <input 
                              type="checkbox" 
                              checked={menu.permissions?.read || false}
                              onChange={(e) => updateMenuPermission(menuIndex, 'read', e.target.checked)}
                              className="auth-modern-checkbox"
                            />
                          </td>
                          <td className="auth-user-cell">{menu.user}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ===== 메뉴 선택 모달 ===== */}
          <MenuSelectionModal
            show={showMenuModal}
            onHide={closeMenuModal}
            onConfirm={confirmMenuSelection}
            isLoading={isSelectingMenu}
            menuTree={menuTree}
            selectedRoleKey={selectedRoleKeys[0]}
            menuMap={watchedRoles.reduce((acc, role) => {
              acc[role.key] = role.menus || [];
              return acc;
            }, {})}
            currentUser={currentUser}
          />

          {/* 삭제 확인 모달 */}
          <Modal 
            show={showDeleteConfirmModal} 
            onHide={cancelDelete}
            centered
            backdrop="static"
          >
            <Modal.Body 
              className="text-center p-4"
              style={{
                background: 'linear-gradient(135deg, rgba(60, 65, 90, 0.98) 0%, rgba(75, 80, 110, 0.98) 100%)',
                color: '#fff',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <Trash2 size={48} className="mb-3" style={{color: '#ef4444'}} />
              <h5 className="fw-bold mb-3" style={{ color: '#fff' }}>권한 그룹 삭제</h5>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)' }} className="mb-2">
                선택한 {deleteTargetRoles.length}개의 권한 그룹을 삭제하시겠습니까?
              </p>
              {deleteTargetRoles.some(r => r.isSaved) && (
                <p style={{ color: '#fbbf24', fontSize: '0.875rem' }} className="mb-4">
                  ⚠️ 이미 저장된 데이터가 포함되어 있습니다.
                </p>
              )}
              <div className="d-flex gap-2 justify-content-center mt-4">
                <Button 
                  onClick={cancelDelete}
                  className="px-4"
                  style={{ 
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontWeight: '600',
                    padding: '0.625rem 1.5rem',
                    fontSize: '0.9375rem'
                  }}
                >
                  취소
                </Button>
                <Button 
                  onClick={confirmDelete}
                  className="px-4"
                  style={{ 
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: 'none',
                    fontWeight: '600',
                    padding: '0.625rem 1.5rem',
                    fontSize: '0.9375rem'
                  }}
                >
                  삭제
                </Button>
              </div>
            </Modal.Body>
          </Modal>

          {/* 알림 모달 */}
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
              <h5 className="fw-bold mb-3" style={{ color: '#fff' }}>{alertConfig.title}</h5>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)' }} className="mb-4">
                {alertConfig.message}
              </p>
              <Button 
                onClick={() => setShowAlertModal(false)}
                className="px-4 shadow-sm"
                style={{ 
                  borderRadius: '8px',
                  background: alertConfig.variant === 'success' 
                    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                    : alertConfig.variant === 'info'
                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                    : alertConfig.variant === 'warning'
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  fontWeight: '600',
                  padding: '0.625rem 1.5rem',
                  fontSize: '0.9375rem'
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

export default Auth;
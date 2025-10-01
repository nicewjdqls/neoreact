import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, RefreshCw, Calendar, Clock } from 'lucide-react';
import Layout from '../../components/Layout';

// 커스텀 DateTime 피커 컴포넌트
function CustomDateTimePicker({ value, onChange, placeholder, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDateTime, setTempDateTime] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes()
  });
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // 현재 값을 파싱해서 tempDateTime 설정
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setTempDateTime({
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes()
      });
    }
  }, [value]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const formatTime = (date) => {
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${hour}:${minute}`;
  };

  // 캘린더 생성
  const generateCalendar = () => {
    const firstDay = new Date(tempDateTime.year, tempDateTime.month, 1);
    const lastDay = new Date(tempDateTime.year, tempDateTime.month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    return days;
  };

  const handleDateSelect = (date) => {
    setTempDateTime(prev => ({
      ...prev,
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    }));
  };

  const handleConfirm = () => {
    const newDateTime = new Date(tempDateTime.year, tempDateTime.month, tempDateTime.day, tempDateTime.hour, tempDateTime.minute);
    const formattedValue = newDateTime.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm 형식
    onChange(formattedValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const displayValue = value ? 
    `${formatDate(new Date(value))} ${formatTime(new Date(value))}` : 
    '';

  return (
    <div className="relative">
      <div
        ref={inputRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer bg-white hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${className}`}
      >
        <Calendar size={16} className="text-gray-600 mr-2" />
        <span className={displayValue ? 'text-gray-900' : 'text-gray-400'}>
          {displayValue || placeholder}
        </span>
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef} 
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
          style={{ minWidth: '650px' }}
        >
          <div className="flex">
            {/* 캘린더 섹션 */}
            <div className="p-4 border-r border-gray-200" style={{ width: '350px' }}>
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar size={16} className="mr-1" />
                  날짜 선택
                </h4>
              </div>
              
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setTempDateTime(prev => ({ 
                    ...prev, 
                    month: prev.month - 1 < 0 ? 11 : prev.month - 1, 
                    year: prev.month - 1 < 0 ? prev.year - 1 : prev.year 
                  }))}
                  className="p-2 hover:bg-gray-100 rounded text-gray-600 flex items-center justify-center"
                  style={{ width: '32px', height: '32px' }}
                >
                  &#8249;
                </button>
                <div className="flex space-x-2">
                  <select
                    value={tempDateTime.year}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="text-sm border-none bg-transparent font-medium text-gray-700"
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                      <option key={year} value={year}>{year}년</option>
                    ))}
                  </select>
                  <select
                    value={tempDateTime.month}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                    className="text-sm border-none bg-transparent font-medium text-gray-700"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setTempDateTime(prev => ({ 
                    ...prev, 
                    month: prev.month + 1 > 11 ? 0 : prev.month + 1, 
                    year: prev.month + 1 > 11 ? prev.year + 1 : prev.year 
                  }))}
                  className="p-2 hover:bg-gray-100 rounded text-gray-600 flex items-center justify-center"
                  style={{ width: '32px', height: '32px' }}
                >
                  &#8250;
                </button>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* 캘린더 그리드 */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendar().map((date, index) => {
                  const isCurrentMonth = date.getMonth() === tempDateTime.month;
                  const isSelected = date.getDate() === tempDateTime.day && 
                                   date.getMonth() === tempDateTime.month && 
                                   date.getFullYear() === tempDateTime.year;
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      className={`h-8 w-full flex items-center justify-center text-sm rounded-lg transition-colors ${
                        !isCurrentMonth
                          ? 'text-gray-300 hover:bg-gray-50'
                          : isSelected
                          ? 'bg-blue-500 text-white font-medium'
                          : isToday
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 시간 선택 섹션 */}
            <div className="p-4" style={{ width: '300px' }}>
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock size={16} className="mr-1" />
                  시간 선택
                </h4>
              </div>

              {/* 선택된 날짜 표시 */}
              <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700">
                  {formatDate(new Date(tempDateTime.year, tempDateTime.month, tempDateTime.day))}
                </div>
              </div>

              {/* 시간 분 선택 */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-center">
                  <label className="block text-xs text-gray-500 mb-2">시</label>
                  <select
                    value={tempDateTime.hour}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, hour: parseInt(e.target.value) }))}
                    className="w-16 text-center text-lg font-medium border border-gray-200 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>

                <div className="text-2xl font-bold text-gray-300 mt-6">:</div>

                <div className="text-center">
                  <label className="block text-xs text-gray-500 mb-2">분</label>
                  <select
                    value={tempDateTime.minute}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, minute: parseInt(e.target.value) }))}
                    className="w-16 text-center text-lg font-medium border border-gray-200 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 확인/취소 버튼 */}
              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  확인
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 알림 모달 컴포넌트
function AlertModal({ show, onClose, config }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            {config.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">{config.title}</h3>
          <p className="text-gray-600 mb-6">{config.message}</p>
          
          <div className="flex gap-3 justify-center">
            {config.showRetry && (
              <button
                onClick={config.onRetry}
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                재시도
              </button>
            )}
            <button
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                config.variant === 'success' 
                  ? 'bg-green-500 hover:bg-green-600'
                  : config.variant === 'warning'
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : config.variant === 'info'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatSession() {
  // 유니크 ID 생성 유틸리티 함수
  const uniqId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null,
    showRetry: false,
    onRetry: null
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    serviceType: '',
    level: '',
    searchText: ''
  });

  const services = ['일반', '데이터수집', '학습모델', 'AI Chat', 'APIs', '설정', '모니터링'];
  const urls = [
    'https://service1.example.com',
    'https://service2.example.com', 
    'https://service3.example.com',
    'https://service4.example.com',
    'https://service5.example.com'
  ];
  const messages = [
    'Started inference',
    'Completed batch',
    'Error reading data',
    'Model update applied',
    'Session timeout',
    'Data pre-processing',
    'GPU memory warning',
    'User disconnected'
  ];

  // 알림 함수
  const showNotification = (title, message, variant = 'danger', showRetry = false, onRetry = null) => {
    const iconMap = {
      success: <CheckCircle size={48} className="text-green-500 mb-3" />,
      danger: <XCircle size={48} className="text-red-500 mb-3" />,
      warning: <AlertTriangle size={48} className="text-orange-500 mb-3" />,
      info: <Info size={48} className="text-blue-500 mb-3" />
    };
    
    setAlertConfig({
      title,
      message,
      variant,
      icon: iconMap[variant],
      showRetry,
      onRetry
    });
    setShowAlertModal(true);
  };

  const formatDateTime = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  // 유효성 검사 함수
  const validateFilters = () => {
    if (filters.startDate && filters.endDate) {
      const startDateTime = new Date(filters.startDate);
      const endDateTime = new Date(filters.endDate);
      
      if (startDateTime > endDateTime) {
        showNotification(
          '날짜 시간 범위 오류',
          '시작 일시는 종료 일시보다 이전이어야 합니다. 날짜와 시간을 다시 확인해주세요.',
          'danger'
        );
        return false;
      }

      // 조회 기간이 너무 긴지 체크 (예: 7일 이상)
      const daysDiff = (endDateTime - startDateTime) / (1000 * 60 * 60 * 24);
      if (daysDiff > 7) {
        showNotification(
          '조회 기간 제한',
          '조회 기간은 7일을 초과할 수 없습니다. 기간을 줄여주세요.',
          'warning'
        );
        return false;
      }

      // 미래 날짜 체크
      const now = new Date();
      if (startDateTime > now || endDateTime > now) {
        showNotification(
          '날짜 선택 오류',
          '미래 날짜는 선택할 수 없습니다.',
          'danger'
        );
        return false;
      }
    }
    return true;
  };

  // 서버 오류 시뮬레이션
  const simulateServerError = () => {
    return Math.random() < 0.05; // 5% 확률로 오류
  };

  const addLog = () => {
    const now = new Date();
    const newLog = {
      id: uniqId(),
      timestamp: formatDateTime(now),
      sessionId: 'sess-' + Math.floor(Math.random() * 100),
      service: services[Math.floor(Math.random() * services.length)],
      level: ['INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 3)],
      message: messages[Math.floor(Math.random() * messages.length)],
      url: urls[Math.floor(Math.random() * urls.length)],
      rawTime: now
    };

    setLogs(prev => {
      const updated = [newLog, ...prev];
      return updated.length > 1000 ? updated.slice(0, 1000) : updated;
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = async () => {
    if (!validateFilters()) {
      return;
    }

    // 조회 버튼을 클릭하면 실시간 표시 해제
    setAutoScroll(false);
    setIsLoading(true);
    
    try {
      // 서버 요청 시뮬레이션 (1-2초 지연)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (simulateServerError()) {
            reject(new Error('서버 연결 오류'));
          } else {
            resolve();
          }
        }, 1000 + Math.random() * 1000);
      });

      let filtered = [...logs];

      if (filters.startDate) {
        const startTime = new Date(filters.startDate);
        filtered = filtered.filter(log => log.rawTime >= startTime);
      }

      if (filters.endDate) {
        const endTime = new Date(filters.endDate);
        // 종료 날짜는 해당 일의 23:59:59까지 포함하도록 설정
        const endOfDay = new Date(endTime);
        endOfDay.setHours(23, 59, 59, 999);
        filtered = filtered.filter(log => log.rawTime <= endOfDay);
      }

      if (filters.serviceType) {
        filtered = filtered.filter(log => log.service === filters.serviceType);
      }

      if (filters.level) {
        filtered = filtered.filter(log => log.level === filters.level);
      }

      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        filtered = filtered.filter(log => 
          log.message.toLowerCase().includes(searchLower) ||
          log.sessionId.toLowerCase().includes(searchLower)
        );
      }

      // 시간순 정렬 (최신 순)
      filtered.sort((a, b) => b.rawTime - a.rawTime);

      setFilteredLogs(filtered);
      
      // 조회 완료 알림
      setTimeout(() => {
        showNotification(
          '조회 완료',
          `총 ${filtered.length}건의 세션 로그가 조회되었습니다.`,
          'success'
        );
      }, 100);

    } catch (error) {
      showNotification(
        '조회 오류',
        '데이터 조회 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.',
        'danger',
        true,
        () => {
          setShowAlertModal(false);
          setTimeout(() => {
            applyFilters();
          }, 500);
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'INFO': return 'bg-blue-100 text-blue-800';
      case 'WARN': return 'bg-yellow-100 text-yellow-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 시간 유효성 검사
  const isDateTimeRangeValid = () => {
    if (!filters.startDate || !filters.endDate) return true;
    const startDateTime = new Date(filters.startDate);
    const endDateTime = new Date(filters.endDate);
    return startDateTime <= endDateTime;
  };

  // 실시간 로그 생성
  useEffect(() => {
    const interval = setInterval(addLog, 1000);
    return () => clearInterval(interval);
  }, []);

  // 자동 스크롤이 켜져있으면 필터 자동 적용
  useEffect(() => {
    if (autoScroll && logs.length > 0) {
      setFilteredLogs([...logs]);
    }
  }, [logs, autoScroll]);

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="활성 세션 상세조회"
      environment="Production"
      showNavigation={true}
    >
      {/* 알림 Modal */}
      <AlertModal 
        show={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        config={alertConfig}
      />

      <div className="space-y-6">
        {/* 제목 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">활성 세션 상세조회</h2>
        </div>

        {/* 필터 영역 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* 첫 번째 행: 시작일시 - 종료일시 - 서비스구분 - Level - 조회버튼 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-4">
            {/* 시작일시 - 커스텀 DateTime 피커 */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">시작일시</label>
              <CustomDateTimePicker
                value={filters.startDate}
                onChange={(value) => handleFilterChange('startDate', value)}
                placeholder="시작일시 선택"
              />
            </div>

            {/* 종료일시 - 커스텀 DateTime 피커 */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">종료일시</label>
              <CustomDateTimePicker
                value={filters.endDate}
                onChange={(value) => handleFilterChange('endDate', value)}
                placeholder="종료일시 선택"
              />
            </div>

            {/* 서비스 구분 */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">서비스 구분</label>
              <select
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">전체</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">Level</label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">전체</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>

            {/* 조회 버튼 */}
            <div className="md:col-span-1">
              <button
                onClick={applyFilters}
                disabled={isLoading}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    조회 중...
                  </div>
                ) : (
                  '조회'
                )}
              </button>
            </div>
          </div>

          {/* 두 번째 행: 메시지 검색 */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-end mb-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">메시지 검색</label>
              <input
                type="text"
                placeholder="메시지, 세션ID로 검색..."
                value={filters.searchText}
                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 세 번째 행: 실시간 표시 체크박스 */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">실시간 표시</span>
              </label>
            </div>
          </div>

          {/* 날짜 시간 범위 오류 표시 */}
          {!isDateTimeRangeValid() && (
            <div className="mt-3">
              <div className="text-red-600 text-sm flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                시작 일시는 종료 일시보다 이전이어야 합니다.
              </div>
            </div>
          )}

          {/* 안내 문구 */}
          <div className="mt-3 text-xs text-gray-500">
            조회 기간은 최대 7일까지 선택 가능합니다.
          </div>
        </div>

        {/* 상태 표시 */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            총 {filteredLogs.length}건의 세션 로그가 조회되었습니다.
          </span>
          {autoScroll && (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
              <div className="w-3 h-3">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-green-600 border-t-transparent"></div>
              </div>
              <span className="text-sm font-medium">실시간 모니터링 중</span>
            </div>
          )}
        </div>

        {/* 로그 테이블 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ height: '70vh', overflowY: 'auto' }}>
            {filteredLogs.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">세션일시</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">세션ID</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">서비스 구분</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">Level</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">메시지</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">서비스 URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-center text-sm text-gray-700">{log.timestamp}</td>
                      <td className="px-4 py-2 text-center text-sm font-mono text-gray-900">{log.sessionId}</td>
                      <td className="px-4 py-2 text-center text-sm font-medium text-gray-900">{log.service}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeClass(log.level)}`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">{log.message}</td>
                      <td className="px-4 py-2 text-center">
                        <a 
                          href={log.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                        >
                          {log.url}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">데이터가 없습니다</h3>
                <p className="text-gray-500 text-center max-w-sm">
                  조회 조건을 설정하고 "조회" 버튼을 클릭하여<br/>
                  데이터를 불러오세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StatSession;
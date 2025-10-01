import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock } from 'lucide-react';
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

function StatAPIs() {
  // 유니크 ID 생성 유틸리티 함수
  const uniqId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const [apiCalls, setApiCalls] = useState([]);
  const [filteredApiCalls, setFilteredApiCalls] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [resetTimestamp, setResetTimestamp] = useState(null); // 초기화 시점을 기록
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    modelFilter: '',
    apiNameFilter: ''
  });

  const models = ['gpt-3.5', 'gpt-4', 'custom-model'];
  const apiNames = ['TextGeneration', 'ChatCompletion', 'Embedding', 'Summarization', 'Moderation'];

  const formatDateTime = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const addAPICall = () => {
    const now = new Date();
    const model = models[Math.floor(Math.random() * models.length)];
    const apiName = apiNames[Math.floor(Math.random() * apiNames.length)];
    const status = Math.random() > 0.1 ? '성공' : '실패';
    const responseTime = (Math.random() * 200 + 50).toFixed(2);
    const accuracy = (Math.random() * 50 + 50).toFixed(2); // 50~100% 범위
    const requestJson = { prompt: "Hello world", max_tokens: 50 };
    const responseJson = status === '성공' ? { text: "안녕하세요" } : { error: "Timeout" };

    const newAPICall = {
      id: uniqId(),
      model,
      apiName,
      status,
      responseTime: parseFloat(responseTime),
      accuracy: parseFloat(accuracy),
      requestJson,
      responseJson,
      timestamp: now,
      rawTime: now
    };

    setApiCalls(prev => {
      const updated = [newAPICall, ...prev];
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
    // 조회 버튼을 클릭하면 실시간 표시 해제
    setAutoScroll(false);
    setIsLoading(true);
    
    try {
      // 서버 요청 시뮬레이션 (1-2초 지연)
      await new Promise(resolve => {
        setTimeout(resolve, 1000 + Math.random() * 1000);
      });

      let filtered = [...apiCalls];

      if (filters.startDate) {
        const startTime = new Date(filters.startDate);
        filtered = filtered.filter(call => call.rawTime >= startTime);
      }

      if (filters.endDate) {
        const endTime = new Date(filters.endDate);
        // 종료 날짜는 해당 일의 23:59:59까지 포함하도록 설정
        const endOfDay = new Date(endTime);
        endOfDay.setHours(23, 59, 59, 999);
        filtered = filtered.filter(call => call.rawTime <= endOfDay);
      }

      if (filters.modelFilter) {
        filtered = filtered.filter(call => call.model === filters.modelFilter);
      }

      if (filters.apiNameFilter) {
        const searchLower = filters.apiNameFilter.toLowerCase();
        filtered = filtered.filter(call => 
          call.apiName.toLowerCase().includes(searchLower)
        );
      }

      // 시간순 정렬 (최신 순)
      filtered.sort((a, b) => b.rawTime - a.rawTime);

      setFilteredApiCalls(filtered);
      
      // 조회 완료 알림
      setTimeout(() => {
        alert(`조회 완료: 총 ${filtered.length}건의 API 호출 데이터가 조회되었습니다.`);
      }, 100);

    } catch (error) {
      alert('데이터 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === '성공' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getAccuracyClass = (accuracy) => {
    if (accuracy >= 80) return 'text-green-600 font-semibold';
    if (accuracy >= 60) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const formatJson = (jsonObj) => {
    return JSON.stringify(jsonObj, null, 2);
  };

  // 결과 초기화 함수 (조회 조건은 유지)
  const resetResults = () => {
    // 조회 결과만 초기화
    setFilteredApiCalls([]);
    
    // 초기화 시점 기록 (현재 시간 이후의 이벤트만 표시하기 위해)
    setResetTimestamp(new Date());
  };

  // 실시간 API 호출 데이터 생성
  useEffect(() => {
    const interval = setInterval(addAPICall, 1500);
    return () => clearInterval(interval);
  }, []);

  // 자동 스크롤이 켜져있을 때만 실시간 업데이트 (필터 조건 변경에는 반응하지 않음)
  useEffect(() => {
    if (autoScroll) {
      let filtered = [...apiCalls];
      
      // 초기화 시점 이후의 이벤트만 필터링
      if (resetTimestamp) {
        filtered = filtered.filter(call => call.rawTime > resetTimestamp);
      }

      setFilteredApiCalls(filtered);
    }
  }, [apiCalls, autoScroll, resetTimestamp]); // filters 제거

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="APIs 사용현황 상세조회"
      environment="Production"
      showNavigation={true}
    >
      <div className="space-y-6">
        {/* 제목 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900">APIs 사용현황 상세조회</h2>
        </div>

        {/* 필터 영역 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            {/* 실시간 표시 체크박스 */}
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

            {/* 모델 */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">모델</label>
              <select
                value={filters.modelFilter}
                onChange={(e) => handleFilterChange('modelFilter', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">전체</option>
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            {/* API 이름 */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">API 이름</label>
              <input
                type="text"
                placeholder="Search..."
                value={filters.apiNameFilter}
                onChange={(e) => handleFilterChange('apiNameFilter', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 조회 버튼 */}
            <div className="md:col-span-1">
              <button
                onClick={applyFilters}
                disabled={isLoading}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>

        {/* 실시간 상태 표시 */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            총 {filteredApiCalls.length}건의 API 호출이 조회되었습니다.
          </span>
          <div className="flex items-center gap-3">
            {autoScroll && (
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
                <div className="w-3 h-3">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-green-600 border-t-transparent"></div>
                </div>
                <span className="text-sm font-medium">실시간 모니터링 중</span>
              </div>
            )}
            <button
              onClick={resetResults}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm transition-all duration-200"
            >
              초기화
            </button>
          </div>
        </div>

        {/* 데이터 테이블 또는 빈 상태 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredApiCalls.length > 0 ? (
            <div className="overflow-x-auto" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">호출 시간</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">모델</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">API 이름</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">상태</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">응답시간(ms)</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">정확도(%)</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">요청 JSON</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b border-gray-200">응답 JSON</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApiCalls.map(call => (
                    <tr key={call.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-center text-sm text-gray-700">{formatDateTime(call.timestamp)}</td>
                      <td className="px-4 py-2 text-center">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {call.model}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center text-sm font-medium text-gray-900">{call.apiName}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(call.status)}`}>
                          {call.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center text-sm font-semibold text-gray-900">
                        {call.responseTime}
                      </td>
                      <td className={`px-4 py-2 text-center text-sm ${getAccuracyClass(call.accuracy)}`}>
                        {call.accuracy}
                      </td>
                      <td className="px-4 py-2" style={{ maxWidth: '200px' }}>
                        <pre 
                          className="bg-gray-50 p-2 rounded text-xs text-gray-700 overflow-auto"
                          style={{ 
                            maxHeight: '100px', 
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}
                        >
                          {formatJson(call.requestJson)}
                        </pre>
                      </td>
                      <td className="px-4 py-2" style={{ maxWidth: '200px' }}>
                        <pre 
                          className="bg-gray-50 p-2 rounded text-xs text-gray-700 overflow-auto"
                          style={{ 
                            maxHeight: '100px', 
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}
                        >
                          {formatJson(call.responseJson)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* 빈 상태 표시 */
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
    </Layout>
  );
}

export default StatAPIs;
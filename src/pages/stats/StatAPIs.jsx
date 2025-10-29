import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock } from 'lucide-react';
import MonitoringLayout from '../../components/MonitoringLayout';

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
    const formattedValue = newDateTime.toISOString().slice(0, 16);
    onChange(formattedValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

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
        className={`flex items-center px-3 py-2 text-sm border rounded-lg cursor-pointer transition-all duration-200 ${className}`}
        style={{
          background: 'rgba(42, 48, 70, 0.6)',
          borderColor: 'rgba(139, 92, 246, 0.3)',
          color: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <Calendar size={16} className="mr-2" style={{ color: 'rgba(139, 92, 246, 0.8)' }} />
        <span style={{ color: displayValue ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)' }}>
          {displayValue || placeholder}
        </span>
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef} 
          className="absolute top-full left-0 mt-1 border rounded-xl shadow-lg z-50"
          style={{ 
            minWidth: '650px',
            background: 'rgba(42, 48, 70, 0.98)',
            borderColor: 'rgba(139, 92, 246, 0.3)'
          }}
        >
          <div className="flex">
            <div className="p-4 border-r" style={{ width: '350px', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
              <div className="mb-3">
                <h4 className="text-sm font-medium flex items-center" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  <Calendar size={16} className="mr-1" />
                  날짜 선택
                </h4>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setTempDateTime(prev => ({ 
                    ...prev, 
                    month: prev.month - 1 < 0 ? 11 : prev.month - 1, 
                    year: prev.month - 1 < 0 ? prev.year - 1 : prev.year 
                  }))}
                  className="p-2 rounded flex items-center justify-center transition-colors"
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'rgba(139, 92, 246, 0.1)'
                  }}
                >
                  &#8249;
                </button>
                <div className="flex space-x-2">
                  <select
                    value={tempDateTime.year}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="text-sm border-none font-medium"
                    style={{ 
                      background: 'transparent',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                      <option key={year} value={year} style={{ background: '#2a3046' }}>{year}년</option>
                    ))}
                  </select>
                  <select
                    value={tempDateTime.month}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                    className="text-sm border-none font-medium"
                    style={{ 
                      background: 'transparent',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index} style={{ background: '#2a3046' }}>{month}</option>
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
                  className="p-2 rounded flex items-center justify-center transition-colors"
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'rgba(139, 92, 246, 0.1)'
                  }}
                >
                  &#8250;
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-xs font-medium" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {day}
                  </div>
                ))}
              </div>

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
                      className="h-8 w-full flex items-center justify-center text-sm rounded-lg transition-colors"
                      style={{
                        color: !isCurrentMonth 
                          ? 'rgba(255, 255, 255, 0.3)' 
                          : isSelected 
                          ? '#fff'
                          : isToday
                          ? 'rgba(139, 92, 246, 1)'
                          : 'rgba(255, 255, 255, 0.8)',
                        background: isSelected 
                          ? 'rgba(139, 92, 246, 0.8)' 
                          : isToday
                          ? 'rgba(139, 92, 246, 0.2)'
                          : 'transparent',
                        fontWeight: isSelected || isToday ? '600' : '400'
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4" style={{ width: '300px' }}>
              <div className="mb-3">
                <h4 className="text-sm font-medium flex items-center" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  <Clock size={16} className="mr-1" />
                  시간 선택
                </h4>
              </div>

              <div className="text-center mb-4 p-3 rounded-lg" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <div className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  {formatDate(new Date(tempDateTime.year, tempDateTime.month, tempDateTime.day))}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-center">
                  <label className="block text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>시</label>
                  <select
                    value={tempDateTime.hour}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, hour: parseInt(e.target.value) }))}
                    className="w-16 text-center text-lg font-medium border rounded-lg py-2"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i} style={{ background: '#2a3046' }}>{String(i).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>

                <div className="text-2xl font-bold mt-6" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>:</div>

                <div className="text-center">
                  <label className="block text-xs mb-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>분</label>
                  <select
                    value={tempDateTime.minute}
                    onChange={(e) => setTempDateTime(prev => ({ ...prev, minute: parseInt(e.target.value) }))}
                    className="w-16 text-center text-lg font-medium border rounded-lg py-2"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i} style={{ background: '#2a3046' }}>{String(i).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full px-4 py-2 text-sm rounded-lg transition-colors font-medium"
                  style={{
                    color: '#fff',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(99, 102, 241, 0.9))'
                  }}
                >
                  확인
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full px-4 py-2 text-sm border rounded-lg transition-colors"
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    background: 'transparent'
                  }}
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
  const [resetTimestamp, setResetTimestamp] = useState(null);
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
    const accuracy = (Math.random() * 50 + 50).toFixed(2);
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
    setAutoScroll(false);
    setIsLoading(true);
    
    try {
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

      filtered.sort((a, b) => b.rawTime - a.rawTime);

      setFilteredApiCalls(filtered);
      
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
      ? { background: 'rgba(34, 197, 94, 0.2)', color: 'rgba(134, 239, 172, 1)' }
      : { background: 'rgba(239, 68, 68, 0.2)', color: 'rgba(252, 165, 165, 1)' };
  };

  const getAccuracyClass = (accuracy) => {
    if (accuracy >= 80) return { color: 'rgba(134, 239, 172, 1)', fontWeight: '600' };
    if (accuracy >= 60) return { color: 'rgba(252, 211, 77, 1)', fontWeight: '600' };
    return { color: 'rgba(252, 165, 165, 1)', fontWeight: '600' };
  };

  const formatJson = (jsonObj) => {
    return JSON.stringify(jsonObj, null, 2);
  };

  const resetResults = () => {
    setFilteredApiCalls([]);
    setResetTimestamp(new Date());
  };

  useEffect(() => {
    const interval = setInterval(addAPICall, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoScroll) {
      let filtered = [...apiCalls];
      
      if (resetTimestamp) {
        filtered = filtered.filter(call => call.rawTime > resetTimestamp);
      }

      setFilteredApiCalls(filtered);
    }
  }, [apiCalls, autoScroll, resetTimestamp]);

  return (
    <MonitoringLayout>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            background: 'rgba(42, 48, 70, 0.6)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '0'
            }}>
              APIs 사용현황 상세조회
            </h2>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(42, 48, 70, 0.6)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#8b5cf6' }}
                />
                <span className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>실시간 표시</span>
              </label>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>시작일시</label>
              <CustomDateTimePicker
                value={filters.startDate}
                onChange={(value) => handleFilterChange('startDate', value)}
                placeholder="시작일시 선택"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>종료일시</label>
              <CustomDateTimePicker
                value={filters.endDate}
                onChange={(value) => handleFilterChange('endDate', value)}
                placeholder="종료일시 선택"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>모델</label>
              <select
                value={filters.modelFilter}
                onChange={(e) => handleFilterChange('modelFilter', e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(42, 48, 70, 0.6)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <option value="">전체</option>
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>API 이름</label>
              <input
                type="text"
                placeholder="Search..."
                value={filters.apiNameFilter}
                onChange={(e) => handleFilterChange('apiNameFilter', e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(42, 48, 70, 0.6)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}
              />
            </div>

            <div className="md:col-span-1">
              <button
                onClick={applyFilters}
                disabled={isLoading}
                className="w-full px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                style={{
                  color: '#fff',
                  background: isLoading 
                    ? 'rgba(139, 92, 246, 0.5)' 
                    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9))',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
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

        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            총 {filteredApiCalls.length}건의 API 호출이 조회되었습니다.
          </span>
          <div className="flex items-center gap-3">
            {autoScroll && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border" style={{
                background: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.3)',
                color: 'rgba(134, 239, 172, 1)'
              }}>
                <div className="w-3 h-3">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-t-transparent" style={{ borderColor: 'rgba(134, 239, 172, 1)' }}></div>
                </div>
                <span className="text-sm font-medium">실시간 모니터링 중</span>
              </div>
            )}
            <button
              onClick={resetResults}
              className="px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200"
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                background: 'rgba(42, 48, 70, 0.6)',
                borderColor: 'rgba(139, 92, 246, 0.3)'
              }}
            >
              초기화
            </button>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(42, 48, 70, 0.6)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {filteredApiCalls.length > 0 ? (
            <div className="overflow-x-auto" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <table className="w-full">
                <thead className="sticky top-0 z-10" style={{ background: 'rgba(30, 33, 57, 0.95)' }}>
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>호출 시간</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>모델</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>API 이름</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>상태</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>응답시간(ms)</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>정확도(%)</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>요청 JSON</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-b" style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 0.2)'
                    }}>응답 JSON</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApiCalls.map(call => {
                    const statusStyle = getStatusBadgeClass(call.status);
                    const accuracyStyle = getAccuracyClass(call.accuracy);
                    return (
                      <tr key={call.id} className="border-b transition-colors" style={{ 
                        borderColor: 'rgba(139, 92, 246, 0.1)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="px-4 py-2 text-center text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {formatDateTime(call.timestamp)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full" style={{
                            background: 'rgba(156, 163, 175, 0.2)',
                            color: 'rgba(209, 213, 219, 1)'
                          }}>
                            {call.model}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          {call.apiName}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full" style={statusStyle}>
                            {call.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center text-sm font-semibold" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          {call.responseTime}
                        </td>
                        <td className="px-4 py-2 text-center text-sm" style={accuracyStyle}>
                          {call.accuracy}
                        </td>
                        <td className="px-4 py-2" style={{ maxWidth: '200px' }}>
                          <pre 
                            className="p-2 rounded text-xs overflow-auto"
                            style={{ 
                              maxHeight: '100px', 
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              background: 'rgba(30, 33, 57, 0.6)',
                              color: 'rgba(255, 255, 255, 0.8)'
                            }}
                          >
                            {formatJson(call.requestJson)}
                          </pre>
                        </td>
                        <td className="px-4 py-2" style={{ maxWidth: '200px' }}>
                          <pre 
                            className="p-2 rounded text-xs overflow-auto"
                            style={{ 
                              maxHeight: '100px', 
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              background: 'rgba(30, 33, 57, 0.6)',
                              color: 'rgba(255, 255, 255, 0.8)'
                            }}
                          >
                            {formatJson(call.responseJson)}
                          </pre>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(139, 92, 246, 0.6)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>데이터가 없습니다</h3>
              <p className="text-center max-w-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                조회 조건을 설정하고 "조회" 버튼을 클릭하여<br/>
                데이터를 불러오세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </MonitoringLayout>
  );
}

export default StatAPIs;
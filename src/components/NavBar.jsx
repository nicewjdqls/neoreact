import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-slate-100 px-4 py-2 rounded-lg mb-6">
      <ul className="flex gap-6 text-sm font-medium">
        <li>
          <Link 
            to="/main1" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            모니터링
          </Link>
        </li>
        <li>
          <Link 
            to="/datacollector" 
            className="text-gray-600 hover:text-indigo-600"
          >
            데이터 수집
          </Link>
        </li>
        <li>
          <Link 
            to="/modelmanage" 
            className="text-gray-600 hover:text-indigo-600"
          >
            학습모델
          </Link>
        </li>
        <li>
          <Link 
            to="/chat" 
            className="text-gray-600 hover:text-indigo-600"
          >
            AI Chat관리
          </Link>
        </li>
        <li>
          <Link 
            to="/Apimanage" 
            className="text-gray-600 hover:text-indigo-600"
          >
            APIs
          </Link>
        </li>
        <li>
          <Link 
            to="/authorizationRequest" 
            className="text-gray-600 hover:text-indigo-600"
          >
            권한신청
          </Link>
        </li>
        
        {/* 설정 드롭다운 메뉴 */}
        <li className="relative" ref={settingsRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 cursor-pointer"
          >
            설정
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* 드롭다운 메뉴 */}
          {isSettingsOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-1">
                <Link
                  to="/menu"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  메뉴관리
                </Link>
                <Link
                  to="/memberjoint"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  사용자 관리
                </Link>
                <Link
                  to="/auth"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  권한 관리
                </Link>
                <Link
                  to="/authaprove"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  권한 승인
                </Link>
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
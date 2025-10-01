import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Modal, 
  Button 
} from 'react-bootstrap';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../../components/Layout';
import SelectMapping from './SelectMapping';
import DirectMapping from './DirectMapping';

// 샘플 DB 연결 정보
const SAMPLE_CONNECTIONS = [
  { id: 1, name: 'Production DB', host: 'prod-server.com', port: '1521', dbName: 'PROD_DB', user: 'admin', status: 'connected' },
  { id: 2, name: 'Training DB', host: 'train-server.com', port: '1521', dbName: 'TRAIN_DB', user: 'trainer', status: 'connected' },
  { id: 3, name: 'Development DB', host: 'dev-server.com', port: '1521', dbName: 'DEV_DB', user: 'developer', status: 'disconnected' }
];

// 샘플 데이터
const SAMPLE_DATA = {
  'articles': [
    { id: 1, title: 'AI란 무엇인가?', body: 'AI 정의 및 활용 예시' },
    { id: 2, title: 'Spring Boot 시작', body: '기본 구조와 예제' }
  ],
  'answers': [
    { answer_id: 101, article_id: 1, answer_text: 'AI는 인공지능입니다.' },
    { answer_id: 102, article_id: 2, answer_text: 'Spring Boot는 스프링 기반 프레임워크입니다.' }
  ]
};

// 초기 샘플 테이블 데이터
const INITIAL_TABLES = [
  { name: 'TRAINING_SOURCE', columns: ['ID', 'INPUT_TEXT', 'CONTEXT', 'CREATED_AT'], data: [] },
  { name: 'TRAINING_TARGET', columns: ['ID', 'OUTPUT_TEXT', 'LABEL', 'CONFIDENCE'], data: [] },
  { name: 'articles', columns: ['id', 'title', 'body'], data: SAMPLE_DATA.articles },
  { name: 'answers', columns: ['answer_id', 'article_id', 'answer_text'], data: SAMPLE_DATA.answers }
];

function Datacollector() {
  const navigate = useNavigate();

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('select'); // 'select' | 'direct'

  // 공통 상태
  const [connections, setConnections] = useState(SAMPLE_CONNECTIONS);
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [showDbModal, setShowDbModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });
  const [dbForm, setDbForm] = useState({
    host: '',
    port: '1521',
    dbName: '',
    user: '',
    password: ''
  });

  // 알림 함수
  const showNotification = (title, message, variant = 'danger') => {
    const iconMap = {
      success: <CheckCircle size={48} className="text-success mb-3" />,
      danger: <XCircle size={48} className="text-danger mb-3" />,
      info: <Info size={48} className="text-info mb-3" />
    };
    
    setAlertConfig({
      title,
      message,
      variant,
      icon: iconMap[variant]
    });
    setShowAlertModal(true);
  };

  // DB 연결 관리
  const openDbModal = () => {
    setShowDbModal(true);
    setDbForm({ host: '', port: '1521', dbName: '', user: '', password: '' });
  };

  const closeDbModal = () => {
    setShowDbModal(false);
  };

  const saveDbConnection = () => {
    if (!dbForm.host || !dbForm.dbName || !dbForm.user) {
      showNotification('필수 정보 누락', '호스트, DB 이름, 사용자는 필수 입력 항목입니다.', 'danger');
      return;
    }

    const newConnection = {
      id: connections.length + 1,
      name: `${dbForm.dbName} (${dbForm.host})`,
      host: dbForm.host,
      port: dbForm.port,
      dbName: dbForm.dbName,
      user: dbForm.user,
      status: 'connected'
    };

    setConnections([...connections, newConnection]);
    closeDbModal();
    showNotification('연결 성공', '데이터베이스 연결이 성공적으로 추가되었습니다.', 'success');
  };

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="AI 데이터 매핑 & 학습"
      environment="Production"
      showNavigation={true}
    >
      <div className="bg-gray-50 min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">데이터 수집(학습 데이터 매핑)</h1>

        {/* 알림 Modal */}
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
                  : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                border: 'none'
              }}
            >
              확인
            </Button>
          </Modal.Body>
        </Modal>

        {/* 통합 헤더 영역 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          {/* 상단: 액션 버튼들 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H4V7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">데이터 매핑 설정</h2>
                <p className="text-sm text-gray-500">데이터베이스 연결 및 학습 데이터 매핑을 구성하세요</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={openDbModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H4V7z" />
                </svg>
                데이터베이스 연결
              </button>
              <button 
                onClick={() => navigate('/datacollectorchain')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-200 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                테이블 매핑(Chain)
              </button>
            </div>
          </div>

          {/* 하단: 매핑 방식 탭 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">매핑 방식:</span>
              <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
                <button
                  onClick={() => setActiveTab('select')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'select'
                      ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  선택매핑
                </button>
                <button
                  onClick={() => setActiveTab('direct')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'direct'
                      ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  직접매핑
                </button>
              </div>
            </div>

            {/* 현재 선택된 방식 정보 */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full ${activeTab === 'select' ? 'bg-indigo-400' : 'bg-emerald-400'}`}></div>
              <span className="font-medium">
                {activeTab === 'select' ? 'UI 기반 테이블 매핑' : 'SQL 기반 직접 매핑'}
              </span>
            </div>
          </div>
        </div>

        {/* 탭별 컨텐츠 */}
        {activeTab === 'select' ? (
          <SelectMapping 
            connections={connections}
            tables={tables}
            showNotification={showNotification}
          />
        ) : (
          <DirectMapping 
            connections={connections}
            tables={tables}
            setTables={setTables}
            showNotification={showNotification}
          />
        )}

        {/* DB 연결 모달 */}
        {showDbModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">DB 연결 정보 입력</h2>
              
              <label className="text-sm font-medium text-gray-600">호스트</label>
              <input 
                type="text" 
                placeholder="localhost"
                value={dbForm.host}
                onChange={(e) => setDbForm({...dbForm, host: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              
              <label className="text-sm font-medium text-gray-600">포트</label>
              <input 
                type="text" 
                placeholder="1521"
                value={dbForm.port}
                onChange={(e) => setDbForm({...dbForm, port: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              
              <label className="text-sm font-medium text-gray-600">DB 이름</label>
              <input 
                type="text" 
                placeholder="ORCL"
                value={dbForm.dbName}
                onChange={(e) => setDbForm({...dbForm, dbName: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              
              <label className="text-sm font-medium text-gray-600">사용자</label>
              <input 
                type="text" 
                placeholder="scott"
                value={dbForm.user}
                onChange={(e) => setDbForm({...dbForm, user: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              
              <label className="text-sm font-medium text-gray-600">비밀번호</label>
              <input 
                type="password" 
                placeholder="tiger"
                value={dbForm.password}
                onChange={(e) => setDbForm({...dbForm, password: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-4 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <div className="flex justify-end gap-3">
                <button 
                  onClick={closeDbModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  취소
                </button>
                <button 
                  onClick={saveDbConnection}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  연결
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Datacollector;
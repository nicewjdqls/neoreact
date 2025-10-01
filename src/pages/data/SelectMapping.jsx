import React, { useState } from 'react';
import { 
  Modal, 
  Button 
} from 'react-bootstrap';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

function SelectMapping({ connections, tables, showNotification }) {
  // 내부 모달 상태
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    variant: 'danger',
    icon: null
  });

  // 내부 알림 함수
  const notify = (title, message, variant = 'danger') => {
    if (showNotification) {
      showNotification(title, message, variant);
    } else {
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
    }
  };
  // 선택매핑 상태
  const [sourceTable, setSourceTable] = useState('');
  const [labelTable, setLabelTable] = useState('');
  const [sourceColumn, setSourceColumn] = useState('');
  const [labelColumn, setLabelColumn] = useState('');
  const [relationSourceColumn, setRelationSourceColumn] = useState('');
  const [relationLabelColumn, setRelationLabelColumn] = useState('');
  const [modelNameInput, setModelNameInput] = useState('');
  const [modelNameSelect, setModelNameSelect] = useState('');
  const [mappings, setMappings] = useState([
    {
      sourceTable: 'articles',
      sourceColumn: 'title',
      labelTable: 'answers',
      labelColumn: 'answer_text',
      relSource: 'id',
      relLabel: 'article_id'
    }
  ]);

  // 컬럼 데이터 렌더링
  const renderColumnsForTable = (tableName) => {
    const table = tables.find(t => t.name === tableName);
    if (!table) return null;
    
    const data = table.data || [];
    const cols = table.columns || [];
    
    return data.slice(0, 3).map((row, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-2 gap-2 text-xs border-b py-1">
        {cols.map((col, colIndex) => (
          <div key={colIndex}>{row[col] || ''}</div>
        ))}
      </div>
    ));
  };

  // 컬럼 옵션 생성
  const getColumnOptions = (tableName) => {
    const table = tables.find(t => t.name === tableName);
    if (!table) return [];
    
    return table.columns.map(col => (
      <option key={col} value={col}>
        {col}
      </option>
    ));
  };

  // 매핑 추가
  const handleAddMapping = () => {
    // 유효성 검사
    if (!sourceTable) {
      notify('항목 선택 필요', '원본 테이블을 선택해주세요.', 'danger');
      return;
    }
    
    if (!labelTable) {
      notify('항목 선택 필요', '정답 테이블을 선택해주세요.', 'danger');
      return;
    }
    
    if (!sourceColumn) {
      notify('항목 선택 필요', '원본 컬럼을 선택해주세요.', 'danger');
      return;
    }
    
    if (!labelColumn) {
      notify('항목 선택 필요', '정답 컬럼을 선택해주세요.', 'danger');
      return;
    }
    
    if (!relationSourceColumn) {
      notify('항목 선택 필요', '원본 관계 컬럼을 선택해주세요.', 'danger');
      return;
    }
    
    if (!relationLabelColumn) {
      notify('항목 선택 필요', '정답 관계 컬럼을 선택해주세요.', 'danger');
      return;
    }

    const newMapping = {
      sourceTable,
      labelTable,
      sourceColumn,
      labelColumn,
      relSource: relationSourceColumn,
      relLabel: relationLabelColumn
    };

    setMappings([...mappings, newMapping]);
    
    // 선택 초기화
    setSourceTable('');
    setLabelTable('');
    setSourceColumn('');
    setLabelColumn('');
    setRelationSourceColumn('');
    setRelationLabelColumn('');
    
    notify('매핑 추가 완료', '테이블 매핑이 성공적으로 추가되었습니다.', 'success');
  };

  // 매핑 삭제
  const handleDeleteMapping = (index) => {
    setMappings(mappings.filter((_, i) => i !== index));
    notify('매핑 삭제 완료', '선택한 매핑이 삭제되었습니다.', 'info');
  };

  // 학습 데이터 전송
  const handleSendToTraining = () => {
    if (mappings.length === 0) {
      notify('매핑 데이터 없음', '먼저 매핑을 추가해주세요.', 'danger');
      return;
    }
    
    // 모델 선택 검증
    if (!modelNameInput && !modelNameSelect) {
      notify('모델 선택 필요', '학습 모델을 선택하거나 입력해주세요.', 'danger');
      return;
    }
    
    const selectedModel = modelNameInput || modelNameSelect;
    console.log('학습 데이터:', mappings);
    console.log('선택된 모델:', selectedModel);
    
    notify(
      '학습 전송 완료', 
      `${mappings.length}개의 매핑 데이터가 ${selectedModel} 모델로 성공적으로 전송되었습니다.`, 
      'success'
    );
  };

  return (
    <div className="flex gap-6">
      {/* 왼쪽: DB 연결 정보 */}
      <div className="w-1/6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-700">DB 연결 정보</h2>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {connections.map((db, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">{db.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${
                    db.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>{db.host}:{db.port}</div>
                  <div>{db.dbName} ({db.user})</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 오른쪽: 메인 컨텐츠 */}
      <div className="flex-1 space-y-6">
        {/* 테이블 선택 / 컬럼 선택 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 원본 테이블 */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              원본 테이블
            </h2>
            <select 
              value={sourceTable}
              onChange={(e) => setSourceTable(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- 테이블 선택 --</option>
              {tables.map(table => (
                <option key={table.name} value={table.name}>{table.name}</option>
              ))}
            </select>
            <div className="border border-gray-200 rounded-md p-2 max-h-48 overflow-y-auto bg-gray-50 mb-3">
              {sourceTable ? (
                renderColumnsForTable(sourceTable)
              ) : (
                <div className="text-gray-400 text-sm text-center py-4">
                  테이블을 선택하면 데이터 미리보기가 표시됩니다
                </div>
              )}
            </div>
            <select 
              value={sourceColumn}
              onChange={(e) => setSourceColumn(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- 원본 컬럼 선택 --</option>
              {sourceTable && getColumnOptions(sourceTable)}
            </select>
          </div>

          {/* 정답 테이블 */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              정답 테이블
            </h2>
            <select 
              value={labelTable}
              onChange={(e) => setLabelTable(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- 테이블 선택 --</option>
              {tables.map(table => (
                <option key={table.name} value={table.name}>{table.name}</option>
              ))}
            </select>
            <div className="border border-gray-200 rounded-md p-2 max-h-48 overflow-y-auto bg-gray-50 mb-3">
              {labelTable ? (
                renderColumnsForTable(labelTable)
              ) : (
                <div className="text-gray-400 text-sm text-center py-4">
                  테이블을 선택하면 데이터 미리보기가 표시됩니다
                </div>
              )}
            </div>
            <select 
              value={labelColumn}
              onChange={(e) => setLabelColumn(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- 정답 컬럼 선택 --</option>
              {labelTable && getColumnOptions(labelTable)}
            </select>
          </div>
        </div>

        {/* 학습 모델 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            학습 모델 선택/입력
          </h2>
          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">모델 이름 직접 입력</label>
              <input 
                type="text" 
                placeholder="예: gpt-5-custom"
                value={modelNameInput}
                onChange={(e) => setModelNameInput(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">기존 모델 선택</label>
              <select 
                value={modelNameSelect}
                onChange={(e) => setModelNameSelect(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">-- 선택 --</option>
                <option value="gpt-4">gpt-4</option>
                <option value="gpt-5">gpt-5</option>
                <option value="llama">llama</option>
              </select>
            </div>
          </div>
          {(modelNameInput || modelNameSelect) && (
            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-sm text-purple-700">
                선택된 모델: <span className="font-medium">{modelNameInput || modelNameSelect}</span>
              </div>
            </div>
          )}
        </div>

        {/* 관계 매핑 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            관계 매핑
          </h2>
          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-600">원본 관계 컬럼</label>
              <select 
                value={relationSourceColumn}
                onChange={(e) => setRelationSourceColumn(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">-- 선택 --</option>
                {sourceTable && getColumnOptions(sourceTable)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">정답 관계 컬럼</label>
              <select 
                value={relationLabelColumn}
                onChange={(e) => setRelationLabelColumn(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">-- 선택 --</option>
                {labelTable && getColumnOptions(labelTable)}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <button 
              onClick={handleAddMapping}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium"
            >
              매핑 추가
            </button>
            <button 
              onClick={handleSendToTraining}
              className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-medium"
            >
              학습 데이터로 전송
            </button>
          </div>
        </div>

        {/* 매핑 결과 */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-700 flex items-center justify-between">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              매핑 결과
            </span>
            <span className="text-sm text-gray-500 font-normal">
              총 {mappings.length}개 매핑
            </span>
          </h2>
          
          {mappings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p>생성된 매핑이 없습니다.</p>
              <p className="text-sm">테이블과 컬럼을 선택한 후 "매핑 추가" 버튼을 클릭해주세요.</p>
            </div>
          ) : (
            <ul className="space-y-2 text-sm text-gray-700 max-h-48 overflow-y-auto">
              {mappings.map((mapping, index) => (
                <li key={index} className="flex justify-between items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      <span className="text-blue-600">{mapping.sourceTable}.{mapping.sourceColumn}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="text-green-600">{mapping.labelTable}.{mapping.labelColumn}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      관계: {mapping.sourceTable}.{mapping.relSource} ↔ {mapping.labelTable}.{mapping.relLabel}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteMapping(index)}
                    className="ml-3 px-3 py-1 text-red-600 text-xs rounded hover:bg-red-100 transition"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

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
    </div>
  );
}

export default SelectMapping;
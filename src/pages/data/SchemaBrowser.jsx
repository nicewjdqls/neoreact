import React, { useState } from 'react';

function SchemaBrowser({ connections, tables, onTableSelect, onColumnSelect }) {
  const [expandedTables, setExpandedTables] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const toggleTable = (tableName) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.columns.some(col => col.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleTableClick = (tableName) => {
    if (onTableSelect) {
      onTableSelect(tableName);
    }
    toggleTable(tableName);
  };

  const handleColumnClick = (tableName, columnName) => {
    if (onColumnSelect) {
      onColumnSelect(tableName, columnName);
    }
  };

  const getConnectionStatus = (status) => {
    return status === 'connected' ? 
      <div className="w-2 h-2 bg-green-500 rounded-full"></div> :
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
  };

  return (
    <div className="w-1/5 space-y-6">
      {/* DB 연결 정보 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">DB 연결 정보</h2>
          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="space-y-3 text-sm max-h-64 overflow-y-auto scrollbar-hide">
          {connections.map(conn => (
            <div key={conn.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{conn.name}</span>
                {getConnectionStatus(conn.status)}
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>{conn.host}:{conn.port}</div>
                <div>{conn.dbName} ({conn.user})</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 스키마 브라우저 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">스키마</h2>
        
        {/* 검색 */}
        <div className="relative mb-4">
          <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="테이블/컬럼 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 테이블 목록 */}
        <div className="text-sm space-y-1 max-h-80 overflow-y-auto scrollbar-hide">
          {filteredTables.map(table => (
            <div key={table.name} className="space-y-1">
              {/* 테이블 행 */}
              <div
                className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded text-sm group"
                onClick={() => handleTableClick(table.name)}
              >
                <span className={`mr-2 transition-transform text-gray-400 ${
                  expandedTables[table.name] ? 'rotate-90' : ''
                }`}>
                  ▶
                </span>
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className={`font-medium group-hover:text-blue-600 ${
                  table.name.includes('_SOURCE') ? 'text-green-700' :
                  table.name.includes('_TARGET') ? 'text-purple-700' : 'text-gray-800'
                }`}>
                  {table.name}
                </span>
              </div>
              
              {/* 컬럼 목록 */}
              {expandedTables[table.name] && (
                <div className="ml-6 border-l-2 border-gray-200 pl-2 space-y-1">
                  {table.columns.map(column => (
                    <div
                      key={column}
                      className="flex items-center p-1 hover:bg-gray-50 cursor-pointer rounded text-xs text-gray-600 group"
                      onClick={() => handleColumnClick(table.name, column)}
                      title={`${table.name}.${column}`}
                    >
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                      <span className="group-hover:text-blue-600">{column}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {filteredTables.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">검색 결과가 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* Oracle SQL 지원 안내 */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
        <h2 className="text-base font-semibold mb-3 text-blue-900">Oracle SQL 완전 지원</h2>
        <div className="text-xs text-blue-800 space-y-2">
          <div className="font-medium">지원되는 모든 Oracle SQL:</div>
          <div className="pl-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
              <span>SELECT, INSERT, UPDATE, DELETE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
              <span>CREATE TABLE, DROP TABLE, ALTER TABLE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
              <span>GRANT, REVOKE (권한 관리)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
              <span>JOIN, WHERE, ORDER BY, GROUP BY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
              <span>(+) Oracle Outer Join</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
              <span>모든 Oracle 함수 및 구문</span>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="font-medium text-green-700 mb-1">실행 방법:</div>
            <div className="pl-3 space-y-0.5 text-green-800">
              <div>✓ F9: 현재 커서 위치의 SQL 실행</div>
              <div>✓ Ctrl+Enter: 현재 문장 실행</div>
              <div>✓ 편집 모드: 결과 데이터 직접 수정</div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-blue-100 rounded text-blue-900">
            <div className="text-xs font-medium">💡 학습 데이터 권장 형식:</div>
            <div className="text-xs mt-1">
              source/target 접미사를 사용하면 매핑 기능에서 쉽게 구분됩니다.
              (예: chat_source, training_target)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchemaBrowser;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

// 샘플 데이터 (Datacollector와 동일)
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

// 테이블 스키마 정의 (타입 정보 포함)
const TABLES_SCHEMA = [
  {
    name: 'articles',
    position: { x: 100, y: 100 },
    columns: [
      { name: 'id', type: 'BIGINT', isPrimaryKey: true, isForeignKey: false },
      { name: 'title', type: 'VARCHAR(255)', isPrimaryKey: false, isForeignKey: false },
      { name: 'body', type: 'TEXT', isPrimaryKey: false, isForeignKey: false }
    ],
    data: SAMPLE_DATA.articles
  },
  {
    name: 'answers',
    position: { x: 500, y: 100 },
    columns: [
      { name: 'answer_id', type: 'BIGINT', isPrimaryKey: true, isForeignKey: false },
      { name: 'article_id', type: 'BIGINT', isPrimaryKey: false, isForeignKey: true },
      { name: 'answer_text', type: 'TEXT', isPrimaryKey: false, isForeignKey: false }
    ],
    data: SAMPLE_DATA.answers
  },
  {
    name: 'TRAINING_SOURCE',
    position: { x: 100, y: 400 },
    columns: [
      { name: 'ID', type: 'BIGINT', isPrimaryKey: true, isForeignKey: false },
      { name: 'INPUT_TEXT', type: 'TEXT', isPrimaryKey: false, isForeignKey: false },
      { name: 'CONTEXT', type: 'VARCHAR(500)', isPrimaryKey: false, isForeignKey: false },
      { name: 'CREATED_AT', type: 'TIMESTAMP', isPrimaryKey: false, isForeignKey: false }
    ],
    data: []
  },
  {
    name: 'TRAINING_TARGET',
    position: { x: 500, y: 400 },
    columns: [
      { name: 'ID', type: 'BIGINT', isPrimaryKey: true, isForeignKey: false },
      { name: 'OUTPUT_TEXT', type: 'TEXT', isPrimaryKey: false, isForeignKey: false },
      { name: 'LABEL', type: 'VARCHAR(100)', isPrimaryKey: false, isForeignKey: false },
      { name: 'CONFIDENCE', type: 'DECIMAL(5,4)', isPrimaryKey: false, isForeignKey: false }
    ],
    data: []
  }
];

// 관계 정의
const RELATIONSHIPS = [
  {
    from: { table: 'articles', column: 'id' },
    to: { table: 'answers', column: 'article_id' },
    type: 'one-to-many',
    name: 'article_answers'
  }
];

function Datacollectorchain() {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const [tables, setTables] = useState(TABLES_SCHEMA);
  const [selectedTable, setSelectedTable] = useState(null);
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedTable: null,
    startPosition: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1000, height: 600 });

  // SVG 좌표 변환 함수
  const getSVGCoordinates = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const y = ((clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;
    
    return { x, y };
  };

  // 테이블 클릭 핸들러
  const handleTableClick = (tableName, e) => {
    e.stopPropagation();
    if (!dragState.isDragging) {
      setSelectedTable(selectedTable === tableName ? null : tableName);
    }
  };

  // 드래그 시작 (테이블 헤더에서만)
  const handleHeaderMouseDown = (e, tableName) => {
    e.preventDefault();
    e.stopPropagation();
    
    const table = tables.find(t => t.name === tableName);
    if (!table) return;

    const svgCoords = getSVGCoordinates(e.clientX, e.clientY);
    
    setDragState({
      isDragging: true,
      draggedTable: tableName,
      startPosition: { x: e.clientX, y: e.clientY },
      offset: {
        x: svgCoords.x - table.position.x,
        y: svgCoords.y - table.position.y
      }
    });

    // 커서 스타일 변경
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  // 전역 마우스 이벤트 핸들러
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!dragState.isDragging || !dragState.draggedTable) return;

      const svgCoords = getSVGCoordinates(e.clientX, e.clientY);
      
      setTables(prevTables => 
        prevTables.map(table => 
          table.name === dragState.draggedTable
            ? {
                ...table,
                position: {
                  x: Math.max(0, Math.min(800, svgCoords.x - dragState.offset.x)),
                  y: Math.max(0, Math.min(600, svgCoords.y - dragState.offset.y))
                }
              }
            : table
        )
      );
    };

    const handleGlobalMouseUp = () => {
      if (dragState.isDragging) {
        setDragState({
          isDragging: false,
          draggedTable: null,
          startPosition: { x: 0, y: 0 },
          offset: { x: 0, y: 0 }
        });

        // 커서 스타일 복원
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [dragState, viewBox]);

  // 줌 기능
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  // 테이블 렌더링
  const renderTable = (table) => {
    const isSelected = selectedTable === table.name;
    const isDragging = dragState.draggedTable === table.name;
    const tableWidth = 280;
    const headerHeight = 40;
    const rowHeight = 32;
    const tableHeight = headerHeight + (table.columns.length * rowHeight);

    return (
      <g 
        key={table.name}
        className={`table-group ${isDragging ? 'dragging' : ''}`}
        style={{ 
          cursor: isDragging ? 'grabbing' : 'default',
          filter: isDragging ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' : 'none'
        }}
      >
        {/* 테이블 그림자 */}
        <rect
          x={table.position.x + 2}
          y={table.position.y + 2}
          width={tableWidth}
          height={tableHeight}
          fill="rgba(0,0,0,0.1)"
          rx="6"
        />
        
        {/* 테이블 컨테이너 */}
        <rect
          x={table.position.x}
          y={table.position.y}
          width={tableWidth}
          height={tableHeight}
          fill="white"
          stroke={isSelected ? "#3B82F6" : (isDragging ? "#10B981" : "#E5E7EB")}
          strokeWidth={isSelected || isDragging ? 2 : 1}
          rx="6"
          className="table-container"
          onClick={(e) => handleTableClick(table.name, e)}
        />

        {/* 드래그 가능한 테이블 헤더 */}
        <rect
          x={table.position.x}
          y={table.position.y}
          width={tableWidth}
          height={headerHeight}
          fill={isSelected ? "#3B82F6" : (isDragging ? "#10B981" : "#1F2937")}
          rx="6"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={(e) => handleHeaderMouseDown(e, table.name)}
          className="table-header cursor-grab hover:brightness-110 transition-all duration-150"
        />
        <rect
          x={table.position.x}
          y={table.position.y + headerHeight - 6}
          width={tableWidth}
          height={6}
          fill={isSelected ? "#3B82F6" : (isDragging ? "#10B981" : "#1F2937")}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={(e) => handleHeaderMouseDown(e, table.name)}
          className="cursor-grab"
        />

        {/* 드래그 힌트 아이콘 */}
        <g className="drag-hint" style={{ opacity: isDragging ? 1 : 0.6 }}>
          <circle
            cx={table.position.x + 20}
            cy={table.position.y + headerHeight / 2}
            r="6"
            fill="rgba(255,255,255,0.2)"
          />
          <g transform={`translate(${table.position.x + 17}, ${table.position.y + headerHeight / 2 - 3})`}>
            <circle cx="0" cy="0" r="1" fill="white" />
            <circle cx="3" cy="0" r="1" fill="white" />
            <circle cx="6" cy="0" r="1" fill="white" />
            <circle cx="0" cy="3" r="1" fill="white" />
            <circle cx="3" cy="3" r="1" fill="white" />
            <circle cx="6" cy="3" r="1" fill="white" />
            <circle cx="0" cy="6" r="1" fill="white" />
            <circle cx="3" cy="6" r="1" fill="white" />
            <circle cx="6" cy="6" r="1" fill="white" />
          </g>
        </g>

        {/* 테이블명 */}
        <text
          x={table.position.x + tableWidth / 2}
          y={table.position.y + headerHeight / 2}
          textAnchor="middle"
          dy="0.35em"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          className="pointer-events-none select-none"
        >
          {table.name}
        </text>

        {/* 데이터 개수 표시 */}
        <text
          x={table.position.x + tableWidth - 10}
          y={table.position.y + headerHeight / 2}
          textAnchor="end"
          dy="0.35em"
          fill="rgba(255,255,255,0.8)"
          fontSize="11"
          className="pointer-events-none select-none"
        >
          ({table.data?.length || 0} rows)
        </text>

        {/* 컬럼들 */}
        {table.columns.map((column, index) => {
          const y = table.position.y + headerHeight + (index * rowHeight);
          const isEven = index % 2 === 0;
          
          return (
            <g key={column.name}>
              {/* 컬럼 배경 */}
              <rect
                x={table.position.x}
                y={y}
                width={tableWidth}
                height={rowHeight}
                fill={isEven ? "#F9FAFB" : "white"}
                className="hover:fill-blue-50 transition-colors"
              />

              {/* PK/FK 아이콘 */}
              {column.isPrimaryKey && (
                <rect
                  x={table.position.x + 8}
                  y={y + 8}
                  width={16}
                  height={16}
                  fill="#FBBf24"
                  rx="2"
                />
              )}
              {column.isForeignKey && !column.isPrimaryKey && (
                <rect
                  x={table.position.x + 8}
                  y={y + 8}
                  width={16}
                  height={16}
                  fill="#10B981"
                  rx="2"
                />
              )}

              {/* 키 라벨 */}
              {column.isPrimaryKey && (
                <text
                  x={table.position.x + 16}
                  y={y + 16}
                  textAnchor="middle"
                  dy="0.35em"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  PK
                </text>
              )}
              {column.isForeignKey && !column.isPrimaryKey && (
                <text
                  x={table.position.x + 16}
                  y={y + 16}
                  textAnchor="middle"
                  dy="0.35em"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  FK
                </text>
              )}

              {/* 컬럼명 */}
              <text
                x={table.position.x + (column.isPrimaryKey || column.isForeignKey ? 32 : 12)}
                y={y + rowHeight / 2}
                dy="0.35em"
                fill="#1F2937"
                fontSize="12"
                fontWeight={column.isPrimaryKey ? "bold" : "normal"}
                className="pointer-events-none select-none"
              >
                {column.name}
              </text>

              {/* 데이터 타입 */}
              <text
                x={table.position.x + tableWidth - 12}
                y={y + rowHeight / 2}
                textAnchor="end"
                dy="0.35em"
                fill="#6B7280"
                fontSize="11"
                className="pointer-events-none select-none"
              >
                {column.type}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  // 관계선 렌더링
  const renderRelationships = () => {
    return RELATIONSHIPS.map((rel, index) => {
      const fromTable = tables.find(t => t.name === rel.from.table);
      const toTable = tables.find(t => t.name === rel.to.table);
      
      if (!fromTable || !toTable) return null;

      const fromX = fromTable.position.x + 280;
      const fromY = fromTable.position.y + 40 + (fromTable.columns.findIndex(c => c.name === rel.from.column) + 0.5) * 32;
      const toX = toTable.position.x;
      const toY = toTable.position.y + 40 + (toTable.columns.findIndex(c => c.name === rel.to.column) + 0.5) * 32;

      const midX = (fromX + toX) / 2;

      return (
        <g key={index} className="relationship-line">
          {/* 관계선 */}
          <path
            d={`M ${fromX} ${fromY} Q ${midX} ${fromY} ${midX} ${(fromY + toY) / 2} Q ${midX} ${toY} ${toX} ${toY}`}
            fill="none"
            stroke="#6366F1"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
            className="transition-all duration-300"
          />
          
          {/* 관계 타입 라벨 */}
          <rect
            x={midX - 30}
            y={(fromY + toY) / 2 - 8}
            width="60"
            height="16"
            fill="white"
            stroke="#6366F1"
            strokeWidth="1"
            rx="8"
          />
          <text
            x={midX}
            y={(fromY + toY) / 2}
            textAnchor="middle"
            dy="0.35em"
            fill="#6366F1"
            fontSize="10"
            fontWeight="bold"
            className="pointer-events-none select-none"
          >
            1:N
          </text>
        </g>
      );
    });
  };

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="테이블 매핑 ERD"
      environment="Production"
      showNavigation={true}
    >
      <div className="bg-gray-50 min-h-screen p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/datacollector')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              데이터 수집으로 돌아가기
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">테이블 매핑 ERD</h1>
              <p className="text-gray-600">테이블 헤더를 드래그하여 위치를 조정하세요</p>
            </div>
          </div>

          {/* 컨트롤 패널 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border p-1">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                disabled={zoomLevel <= 0.5}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                disabled={zoomLevel >= 3}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={handleZoomReset}
                className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
              >
                초기화
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              {tables.length}개 테이블 • {RELATIONSHIPS.length}개 관계
            </div>
          </div>
        </div>

        {/* ERD 캔버스 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H4V7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Entity Relationship Diagram</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span>Primary Key</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                  <span>Foreign Key</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  <span>드래그 가능</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden" style={{ height: '700px' }}>
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
              className={dragState.isDragging ? 'cursor-grabbing' : 'cursor-default'}
              onMouseDown={(e) => {
                // 빈 공간 클릭 시 선택 해제
                if (e.target === e.currentTarget) {
                  setSelectedTable(null);
                }
              }}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: '0 0' }}
            >
              {/* Arrow marker 정의 */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6366F1"
                  />
                </marker>
              </defs>

              {/* 관계선들 */}
              {renderRelationships()}

              {/* 테이블들 */}
              {tables.map(renderTable)}
            </svg>
          </div>
        </div>

        {/* 하단 정보 패널 */}
        {selectedTable && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                테이블 정보: {selectedTable}
              </h3>
              <button
                onClick={() => setSelectedTable(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {(() => {
              const table = tables.find(t => t.name === selectedTable);
              return (
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">컬럼 정보</h4>
                    <div className="space-y-2">
                      {table?.columns.map((column, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {column.isPrimaryKey && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">PK</span>
                            )}
                            {column.isForeignKey && (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded">FK</span>
                            )}
                            <span className="font-medium">{column.name}</span>
                          </div>
                          <span className="text-gray-600 text-sm">{column.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">데이터 현황</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-indigo-600 mb-1">
                        {table?.data?.length || 0}
                      </div>
                      <div className="text-gray-600 text-sm">총 레코드 수</div>
                      
                      {table?.data?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-sm text-gray-600 mb-2">샘플 데이터</div>
                          <div className="text-xs text-gray-500 font-mono">
                            {JSON.stringify(table.data[0], null, 2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Datacollectorchain;
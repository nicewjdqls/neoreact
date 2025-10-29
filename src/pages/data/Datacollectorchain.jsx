import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MonitoringLayout from '../../components/MonitoringLayout';

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

  const getSVGCoordinates = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const y = ((clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;
    
    return { x, y };
  };

  const handleTableClick = (tableName, e) => {
    e.stopPropagation();
    if (!dragState.isDragging) {
      setSelectedTable(selectedTable === tableName ? null : tableName);
    }
  };

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

    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

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
        <rect
          x={table.position.x + 2}
          y={table.position.y + 2}
          width={tableWidth}
          height={tableHeight}
          fill="rgba(0,0,0,0.1)"
          rx="6"
        />
        
        <rect
          x={table.position.x}
          y={table.position.y}
          width={tableWidth}
          height={tableHeight}
          fill="#2a3046"
          stroke={isSelected ? "#6366f1" : (isDragging ? "#22c55e" : "rgba(99, 102, 241, 0.3)")}
          strokeWidth={isSelected || isDragging ? 2 : 1}
          rx="6"
          className="table-container"
          onClick={(e) => handleTableClick(table.name, e)}
        />

        <rect
          x={table.position.x}
          y={table.position.y}
          width={tableWidth}
          height={headerHeight}
          fill={isSelected ? "#6366f1" : (isDragging ? "#22c55e" : "#363d5a")}
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
          fill={isSelected ? "#6366f1" : (isDragging ? "#22c55e" : "#363d5a")}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={(e) => handleHeaderMouseDown(e, table.name)}
          className="cursor-grab"
        />

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

        {table.columns.map((column, index) => {
          const y = table.position.y + headerHeight + (index * rowHeight);
          const isEven = index % 2 === 0;
          
          return (
            <g key={column.name}>
              <rect
                x={table.position.x}
                y={y}
                width={tableWidth}
                height={rowHeight}
                fill={isEven ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.1)"}
                className="hover:fill-blue-50 transition-colors"
              />

              {column.isPrimaryKey && (
                <rect
                  x={table.position.x + 8}
                  y={y + 8}
                  width={16}
                  height={16}
                  fill="#f59e0b"
                  rx="2"
                />
              )}
              {column.isForeignKey && !column.isPrimaryKey && (
                <rect
                  x={table.position.x + 8}
                  y={y + 8}
                  width={16}
                  height={16}
                  fill="#22c55e"
                  rx="2"
                />
              )}

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

              <text
                x={table.position.x + (column.isPrimaryKey || column.isForeignKey ? 32 : 12)}
                y={y + rowHeight / 2}
                dy="0.35em"
                fill="rgba(255, 255, 255, 0.9)"
                fontSize="12"
                fontWeight={column.isPrimaryKey ? "bold" : "normal"}
                className="pointer-events-none select-none"
              >
                {column.name}
              </text>

              <text
                x={table.position.x + tableWidth - 12}
                y={y + rowHeight / 2}
                textAnchor="end"
                dy="0.35em"
                fill="rgba(255, 255, 255, 0.6)"
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
          <path
            d={`M ${fromX} ${fromY} Q ${midX} ${fromY} ${midX} ${(fromY + toY) / 2} Q ${midX} ${toY} ${toX} ${toY}`}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
            className="transition-all duration-300"
          />
          
          <rect
            x={midX - 30}
            y={(fromY + toY) / 2 - 8}
            width="60"
            height="16"
            fill="#2a3046"
            stroke="#6366f1"
            strokeWidth="1"
            rx="8"
          />
          <text
            x={midX}
            y={(fromY + toY) / 2}
            textAnchor="middle"
            dy="0.35em"
            fill="#6366f1"
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
    <MonitoringLayout activeMenu="datacollector" onMenuChange={() => {}}>
      <div style={{ background: '#1e2139', minHeight: '100vh', padding: '1.5rem' }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/datacollector')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              데이터 수집으로 돌아가기
            </button>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.25rem' }}>
                테이블 매핑 ERD
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                테이블 헤더를 드래그하여 위치를 조정하세요
              </p>
            </div>
          </div>

          {/* 컨트롤 패널 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: 'rgba(42, 48, 70, 0.7)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '0.5rem',
              padding: '0.25rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}>
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: zoomLevel <= 0.5 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: zoomLevel <= 0.5 ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (zoomLevel > 0.5) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  if (zoomLevel > 0.5) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <svg style={{ width: '1rem', height: '1rem', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: 'rgba(255, 255, 255, 0.9)',
                minWidth: '3.75rem',
                textAlign: 'center'
              }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: zoomLevel >= 3 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: zoomLevel >= 3 ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (zoomLevel < 3) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  if (zoomLevel < 3) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <svg style={{ width: '1rem', height: '1rem', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={handleZoomReset}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: '#6366f1',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
              >
                초기화
              </button>
            </div>
            
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              {tables.length}개 테이블 • {RELATIONSHIPS.length}개 관계
            </div>
          </div>
        </div>

        {/* ERD 캔버스 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%)',
          borderRadius: '1rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            background: 'linear-gradient(90deg, rgba(42, 48, 70, 0.95) 0%, rgba(54, 61, 90, 0.95) 100%)',
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'rgba(99, 102, 241, 0.2)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg style={{ width: '1rem', height: '1rem', color: '#6366f1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 1.79 4 4 4h8c0-2.21-1.79-4-4-4H4V7z" />
                  </svg>
                </div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fff' }}>Entity Relationship Diagram</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '1rem', height: '1rem', background: '#f59e0b', borderRadius: '0.25rem' }}></div>
                  <span>Primary Key</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '1rem', height: '1rem', background: '#22c55e', borderRadius: '0.25rem' }}></div>
                  <span>Foreign Key</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg style={{ width: '1rem', height: '1rem', color: 'rgba(255, 255, 255, 0.6)' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  <span>드래그 가능</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', overflow: 'hidden', height: '43.75rem', background: '#1e2139' }}>
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
              className={dragState.isDragging ? 'cursor-grabbing' : 'cursor-default'}
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedTable(null);
                }
              }}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: '0 0' }}
            >
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
                    fill="#6366f1"
                  />
                </marker>
              </defs>

              {renderRelationships()}
              {tables.map(renderTable)}
            </svg>
          </div>
        </div>

        {/* 하단 정보 패널 */}
        {selectedTable && (
          <div style={{
            marginTop: '1.5rem',
            background: 'linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fff' }}>
                테이블 정보: {selectedTable}
              </h3>
              <button
                onClick={() => setSelectedTable(null)}
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  padding: '0.25rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {(() => {
              const table = tables.find(t => t.name === selectedTable);
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.75rem' }}>컬럼 정보</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {table?.columns.map((column, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '0.5rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {column.isPrimaryKey && (
                              <span style={{ 
                                padding: '0.25rem 0.5rem', 
                                background: 'rgba(245, 158, 11, 0.2)', 
                                color: '#f59e0b',
                                border: '1px solid rgba(245, 158, 11, 0.4)',
                                fontSize: '0.75rem', 
                                fontWeight: '600',
                                borderRadius: '0.25rem'
                              }}>PK</span>
                            )}
                            {column.isForeignKey && (
                              <span style={{ 
                                padding: '0.25rem 0.5rem', 
                                background: 'rgba(34, 197, 94, 0.2)', 
                                color: '#22c55e',
                                border: '1px solid rgba(34, 197, 94, 0.4)',
                                fontSize: '0.75rem', 
                                fontWeight: '600',
                                borderRadius: '0.25rem'
                              }}>FK</span>
                            )}
                            <span style={{ fontWeight: '600', color: '#fff' }}>{column.name}</span>
                          </div>
                          <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>{column.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.75rem' }}>데이터 현황</h4>
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', padding: '1rem' }}>
                      <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6366f1', marginBottom: '0.25rem' }}>
                        {table?.data?.length || 0}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>총 레코드 수</div>
                      
                      {table?.data?.length > 0 && (
                        <div style={{ 
                          marginTop: '1rem', 
                          paddingTop: '1rem', 
                          borderTop: '1px solid rgba(255, 255, 255, 0.15)'
                        }}>
                          <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                            샘플 데이터
                          </div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: 'rgba(255, 255, 255, 0.6)', 
                            fontFamily: 'monospace',
                            background: 'rgba(0, 0, 0, 0.2)',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            maxHeight: '10rem',
                            overflow: 'auto'
                          }}>
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
    </MonitoringLayout>
  );
}

export default Datacollectorchain;
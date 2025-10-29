import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './TransactionDetailModal.css';

function TransactionDetailModal({ heatData, onClose, onPauseChange, isPaused }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [viewBox, setViewBox] = useState(() => {
    const now = Date.now();
    const tenMinutesAgo = now - (10 * 60 * 1000);
    return { minX: tenMinutesAgo, maxX: now, minY: 0, maxY: 5000 };
  });
  const [tick, setTick] = useState(0);

  // 실시간 업데이트
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        const now = Date.now();
        const tenMinutesAgo = now - (10 * 60 * 1000);
        setViewBox({ minX: tenMinutesAgo, maxX: now, minY: 0, maxY: 5000 });
        setTick(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const width = 1200;
  const height = 600;
  const padding = { top: 20, right: 60, bottom: 50, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // 스케일 함수
  const xScale = useCallback((value) => {
    return ((value - viewBox.minX) / (viewBox.maxX - viewBox.minX)) * chartWidth;
  }, [viewBox.minX, viewBox.maxX, chartWidth]);

  const yScale = useCallback((value) => {
    return chartHeight - ((value - viewBox.minY) / (viewBox.maxY - viewBox.minY)) * chartHeight;
  }, [viewBox.minY, viewBox.maxY, chartHeight]);

  const xScaleInverse = useCallback((pixel) => {
    return (pixel / chartWidth) * (viewBox.maxX - viewBox.minX) + viewBox.minX;
  }, [chartWidth, viewBox.maxX, viewBox.minX]);

  const yScaleInverse = useCallback((pixel) => {
    return viewBox.maxY - (pixel / chartHeight) * (viewBox.maxY - viewBox.minY);
  }, [chartHeight, viewBox.maxY, viewBox.minY]);

  // 색상 결정
  const getPointColor = useCallback((d) => {
    if (d.status >= 400) return '#ef4444';
    if (d.responseTime > 3000) return '#ef4444';
    if (d.responseTime > 2000) return '#fb923c';
    if (d.responseTime > 1000) return '#eab308';
    return '#22c55e';
  }, []);

  // 시간 포맷
  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }, []);

  // 🔥 수정된 드래그 이벤트 핸들러
  const handleMouseDown = useCallback((e) => {
    if (!svgRef.current || !containerRef.current) return;
    
    // 실시간 모드면 일시정지
    if (!isPaused) {
      onPauseChange(true);
    }
    
    // SVG 요소의 실제 크기와 위치 가져오기
    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // 🔥 마우스 위치를 SVG 내부 좌표로 변환
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;
    
    // 🔥 viewBox 비율 계산
    const scaleX = width / svgRect.width;
    const scaleY = height / svgRect.height;
    
    // 🔥 SVG 좌표계로 변환
    const svgX = mouseX * scaleX;
    const svgY = mouseY * scaleY;
    
    // 🔥 차트 영역 내 좌표 (padding 제외)
    const x = svgX - padding.left;
    const y = svgY - padding.top;
    
    console.log('🎯 Mouse Down:', {
      clientX: e.clientX,
      clientY: e.clientY,
      svgX,
      svgY,
      chartX: x,
      chartY: y,
      chartWidth,
      chartHeight
    });
    
    setIsDragging(true);
    setDragStart({ x, y });
    setDragEnd({ x, y });
    
    // 이전 선택 초기화
    setSelectedTransactions([]);
    setSelectedDetail(null);
  }, [isPaused, onPauseChange, width, height, padding, chartWidth, chartHeight]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !svgRef.current) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;
    
    const scaleX = width / svgRect.width;
    const scaleY = height / svgRect.height;
    
    const svgX = mouseX * scaleX;
    const svgY = mouseY * scaleY;
    
    // 차트 영역 내로 제한
    const x = Math.max(0, Math.min(chartWidth, svgX - padding.left));
    const y = Math.max(0, Math.min(chartHeight, svgY - padding.top));
    
    setDragEnd({ x, y });
  }, [isDragging, width, height, chartWidth, chartHeight, padding]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !dragStart || !dragEnd) {
      setIsDragging(false);
      return;
    }

    // 🔥 드래그 영역의 데이터 좌표 계산
    const xMin = Math.min(xScaleInverse(dragStart.x), xScaleInverse(dragEnd.x));
    const xMax = Math.max(xScaleInverse(dragStart.x), xScaleInverse(dragEnd.x));
    const yMin = Math.min(yScaleInverse(dragStart.y), yScaleInverse(dragEnd.y));
    const yMax = Math.max(yScaleInverse(dragStart.y), yScaleInverse(dragEnd.y));

    console.log('🔍 Drag Selection:', {
      xMin: new Date(xMin).toLocaleTimeString(),
      xMax: new Date(xMax).toLocaleTimeString(),
      yMin,
      yMax,
      totalData: heatData.length
    });

    // 🔥 선택된 영역 내의 트랜잭션 필터링
    const filtered = heatData.filter(d => {
      const inRange = d.x >= xMin && d.x <= xMax && d.y >= yMin && d.y <= yMax;
      return inRange;
    });

    console.log('✅ Filtered Transactions:', filtered.length);

    if (filtered.length > 0) {
      setSelectedTransactions(filtered);
      console.log('📊 Selected Transactions:', filtered);
    } else {
      console.warn('⚠️ No transactions found in selected area');
      // 작은 영역이라도 표시하기 위해 약간의 여유 추가
      const margin = (viewBox.maxX - viewBox.minX) * 0.01; // 1% 여유
      const yMargin = (viewBox.maxY - viewBox.minY) * 0.02; // 2% 여유
      
      const expandedFiltered = heatData.filter(d => 
        d.x >= (xMin - margin) && 
        d.x <= (xMax + margin) && 
        d.y >= (yMin - yMargin) && 
        d.y <= (yMax + yMargin)
      );
      
      if (expandedFiltered.length > 0) {
        console.log('📊 Found with margin:', expandedFiltered.length);
        setSelectedTransactions(expandedFiltered);
      }
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, [isDragging, dragStart, dragEnd, heatData, xScaleInverse, yScaleInverse, viewBox]);

  // X축, Y축 눈금
  const xTicks = useMemo(() => {
    const ticks = [];
    const tickCount = 10;
    for (let i = 0; i <= tickCount; i++) {
      const value = viewBox.minX + (i / tickCount) * (viewBox.maxX - viewBox.minX);
      ticks.push({ value, label: formatTime(value) });
    }
    return ticks;
  }, [viewBox.minX, viewBox.maxX, formatTime]);

  const yTicks = [0, 1000, 2000, 3000, 4000, 5000];

  // 드래그 사각형
  const dragRect = useMemo(() => {
    if (!isDragging || !dragStart || !dragEnd) return null;

    const x = Math.min(dragStart.x, dragEnd.x);
    const y = Math.min(dragStart.y, dragEnd.y);
    const w = Math.abs(dragEnd.x - dragStart.x);
    const h = Math.abs(dragEnd.y - dragStart.y);

    return (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="rgba(59, 130, 246, 0.1)"
        stroke="#60a5fa"
        strokeWidth={2}
        strokeDasharray="5,5"
        pointerEvents="none"
      />
    );
  }, [isDragging, dragStart, dragEnd]);

  // 차트 렌더링
  const chart = useMemo(() => {
    return (
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ 
          background: 'transparent', 
          cursor: isDragging ? 'crosshair' : 'crosshair',
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* 배경 그리드 */}
          {yTicks.map(tick => (
            <line
              key={`y-grid-${tick}`}
              x1={0}
              y1={yScale(tick)}
              x2={chartWidth}
              y2={yScale(tick)}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={1}
            />
          ))}

          {xTicks.map((tick, i) => (
            <line
              key={`x-grid-${i}`}
              x1={xScale(tick.value)}
              y1={0}
              x2={xScale(tick.value)}
              y2={chartHeight}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={1}
            />
          ))}

          {/* 데이터 포인트 */}
          {heatData.map((d, i) => {
            const cx = xScale(d.x);
            const cy = yScale(d.y);
            if (cx < -10 || cx > chartWidth + 10 || cy < -10 || cy > chartHeight + 10) return null;
            
            return (
              <circle
                key={`${d.transactionId}-${i}`}
                cx={cx}
                cy={cy}
                r={3}
                fill={getPointColor(d)}
                opacity={0.9}
                stroke={d.status >= 400 ? '#ef4444' : 'transparent'}
                strokeWidth={d.status >= 400 ? 2 : 0}
                style={{ pointerEvents: 'none' }}
              />
            );
          })}

          {/* 드래그 사각형 */}
          {dragRect}

          {/* X축 */}
          <line
            x1={0}
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth={2}
          />

          {/* Y축 */}
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={chartHeight}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth={2}
          />

          {/* X축 레이블 */}
          {xTicks.map((tick, i) => (
            <text
              key={`x-label-${i}`}
              x={xScale(tick.value)}
              y={chartHeight + 25}
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="10"
              textAnchor="middle"
              transform={`rotate(-45, ${xScale(tick.value)}, ${chartHeight + 25})`}
            >
              {tick.label}
            </text>
          ))}

          {/* Y축 레이블 */}
          {yTicks.map(tick => (
            <text
              key={`y-label-${tick}`}
              x={-15}
              y={yScale(tick) + 4}
              fill="rgba(255, 255, 255, 0.6)"
              fontSize="10"
              textAnchor="end"
            >
              {tick}ms
            </text>
          ))}

          {/* 축 제목 */}
          <text
            x={chartWidth / 2}
            y={chartHeight + 45}
            fill="rgba(255, 255, 255, 0.8)"
            fontSize="12"
            textAnchor="middle"
          >
            시간 (Time)
          </text>

          <text
            x={-chartHeight / 2}
            y={-45}
            fill="rgba(255, 255, 255, 0.8)"
            fontSize="12"
            textAnchor="middle"
            transform={`rotate(-90)`}
          >
            응답시간 (Response Time, ms)
          </text>
        </g>
      </svg>
    );
  }, [heatData, tick, isDragging, xScale, yScale, xTicks, yTicks, getPointColor, dragRect, handleMouseDown, handleMouseMove, handleMouseUp, width, height, chartWidth, chartHeight, padding]);

  return (
    <div className="modal-backdrop" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content">
        {/* 헤더 */}
        <div className="modal-header">
          <div className="modal-header-left">
            <h2 className="modal-title">
              Transaction Heatmap (T-Map)
              {isPaused ? (
                <span className="paused-badge-modal">⏸ 일시정지</span>
              ) : (
                <span className="live-badge-modal">🔴 LIVE</span>
              )}
            </h2>
            <p className="modal-subtitle">
              💡 드래그하여 영역을 선택하면 해당 트랜잭션을 분석할 수 있습니다
              {isPaused && " (일시정지 상태 - 과거 데이터 탐색 가능)"}
              {selectedTransactions.length > 0 && ` - ${selectedTransactions.length}건 선택됨`}
            </p>
          </div>
          <div className="modal-header-controls">
            {isPaused && (
              <button
                className="resume-button-modal"
                onClick={() => {
                  onPauseChange(false);
                  setSelectedTransactions([]);
                  setSelectedDetail(null);
                }}
                title="실시간 보기로 돌아가기"
              >
                ▶️ 실시간 보기
              </button>
            )}
            <button className="close-button" onClick={onClose}>
              ✕ 닫기
            </button>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="modal-body">
          {/* Heatmap */}
          <div 
            ref={containerRef}
            className={`heatmap-section ${selectedTransactions.length > 0 ? 'with-sidebar' : ''}`}
          >
            <div className="canvas-container">
              {chart}
            </div>
          </div>

          {/* 선택된 트랜잭션 목록 */}
          {selectedTransactions.length > 0 && (
            <div className="transactions-sidebar">
              <h3 className="sidebar-title">
                선택된 트랜잭션 ({selectedTransactions.length}건)
              </h3>
              
              <div className="transactions-list">
                {selectedTransactions.map((tx, idx) => (
                  <div
                    key={`${tx.transactionId}-${idx}`}
                    className={`transaction-item ${selectedDetail === tx ? 'selected' : ''} ${tx.status >= 400 ? 'error' : ''}`}
                    onClick={() => setSelectedDetail(tx)}
                  >
                    <div className="transaction-item-header">
                      <span className="transaction-url">{tx.url}</span>
                      <span className={`transaction-status ${tx.status >= 400 ? 'error' : 'success'}`}>
                        {tx.status}
                      </span>
                    </div>
                    <div className="transaction-item-meta">
                      <span>응답시간: {tx.responseTime.toFixed(0)}ms</span>
                      <span>{new Date(tx.x).toLocaleTimeString('ko-KR')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 상세 정보 */}
              {selectedDetail && (
                <div className="transaction-detail">
                  <h4 className="detail-title">트랜잭션 상세</h4>
                  <div className="detail-grid">
                    <span className="detail-label">URL:</span>
                    <span className="detail-value url">{selectedDetail.url}</span>
                    
                    <span className="detail-label">상태 코드:</span>
                    <span className={`detail-value status ${selectedDetail.status >= 400 ? 'error' : 'success'}`}>
                      {selectedDetail.status}
                    </span>
                    
                    <span className="detail-label">응답시간:</span>
                    <span className="detail-value">{selectedDetail.responseTime.toFixed(2)}ms</span>
                    
                    <span className="detail-label">시작시간:</span>
                    <span className="detail-value">
                      {new Date(selectedDetail.timestamp).toLocaleString('ko-KR')}
                    </span>
                    
                    <span className="detail-label">Transaction ID:</span>
                    <span className="detail-value mono">{selectedDetail.transactionId}</span>

                    <span className="detail-label">Method:</span>
                    <span className="detail-value">{selectedDetail.method}</span>

                    <span className="detail-label">Server IP:</span>
                    <span className="detail-value">{selectedDetail.serverIp}</span>

                    <span className="detail-label">Client IP:</span>
                    <span className="detail-value">{selectedDetail.clientIp}</span>

                    <span className="detail-label">DB Time:</span>
                    <span className="detail-value">{selectedDetail.dbTime.toFixed(2)}ms</span>

                    <span className="detail-label">CPU Time:</span>
                    <span className="detail-value">{selectedDetail.cpuTime.toFixed(2)}ms</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 통계 정보 */}
        {selectedTransactions.length > 0 && (
          <div className="modal-footer">
            <div className="stat-item">
              <span className="stat-label">선택된 트랜잭션: </span>
              <span className="stat-value primary">{selectedTransactions.length}건</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">평균 응답시간: </span>
              <span className="stat-value success">
                {(selectedTransactions.reduce((sum, tx) => sum + tx.responseTime, 0) / selectedTransactions.length).toFixed(2)}ms
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">최대 응답시간: </span>
              <span className="stat-value warning">
                {Math.max(...selectedTransactions.map(tx => tx.responseTime)).toFixed(2)}ms
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">오류: </span>
              <span className="stat-value error">
                {selectedTransactions.filter(tx => tx.status >= 400).length}건
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionDetailModal;
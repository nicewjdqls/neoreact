import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Layout from '../../components/Layout';

function Main1() {
  const navigate = useNavigate();
  
  // 유니크 ID 생성 유틸리티 함수
  const uniqId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback: 타임스탬프 + 랜덤 문자열
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const [kpis, setKpis] = useState({
    sessions: '—',
    error: '—',
    latency: '— ms',
    tokens: '—',
    satisfaction: '—%',
    apiSessions: '—',
    apiError: '—'
  });
  const [logs, setLogs] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [lastUpdate, setLastUpdate] = useState('—');
  const [logLevel, setLogLevel] = useState('ALL');
  const [modelFilter, setModelFilter] = useState('all');
  const [paused, setPaused] = useState(false);

  // Chart refs
  const throughputChartRef = useRef(null);
  const modelPieRef = useRef(null);
  const dataCollectorChartRef = useRef(null);
  const gpuSparkRef = useRef(null);
  const memSparkRef = useRef(null);
  const queueSparkRef = useRef(null);

  // Chart instances
  const chartsRef = useRef({});

  // Utility functions
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Update KPIs
  const updateKPIs = () => {
    setKpis({
      sessions: rand(12, 320).toString(),
      error: (Math.random() * 5).toFixed(2) + '%',
      latency: rand(40, 1200) + ' ms',
      tokens: rand(3000, 120000).toLocaleString(),
      satisfaction: rand(50, 100) + '%',
      apiSessions: rand(5000, 120000).toLocaleString(),
      apiError: (Math.random() * 5).toFixed(2) + '%'
    });
  };

  // Add log entry - 유니크 ID 사용
  const pushLog = (level, text) => {
    const newLog = {
      id: uniqId(), // Date.now() 대신 유니크 ID 사용
      level,
      time: new Date().toLocaleTimeString(),
      text,
      node: `node-${rand(1, 4)}`
    };
    setLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  // Generate nodes data
  const generateNodes = () => {
    const nodeData = [];
    for (let i = 1; i <= 4; i++) {
      const cpu = rand(10, 95);
      const gpu = rand(0, 100);
      const mem = rand(12, 64);
      const status = Math.random() < 0.96 ? 'running' : 'degraded';
      nodeData.push({ id: i, cpu, gpu, mem, status });
    }
    setNodes(nodeData);
  };

  // Create sparkline chart
  const createSparkChart = (canvas, data) => {
    if (!canvas) return null;
    
    return new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          borderColor: 'rgba(99, 102, 241, 0.8)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  };

  // Initialize charts
  useEffect(() => {
    // Throughput chart
    if (throughputChartRef.current) {
      const tData = {
        labels: Array.from({ length: 30 }, (_, i) => i - 29),
        datasets: [
          {
            label: '요청(초)',
            data: Array.from({ length: 30 }, () => rand(50, 500)),
            borderWidth: 2,
            tension: 0.3,
            borderColor: 'rgba(99,102,241,0.9)',
            backgroundColor: 'rgba(99,102,241,0.08)',
            fill: true
          },
          {
            label: 'p90 ms',
            data: Array.from({ length: 30 }, () => rand(30, 1200)),
            borderWidth: 2,
            tension: 0.3,
            borderColor: 'rgba(16,185,129,0.9)',
            backgroundColor: 'rgba(16,185,129,0.06)',
            fill: true
          }
        ]
      };
      
      chartsRef.current.throughput = new Chart(throughputChartRef.current.getContext('2d'), {
        type: 'line',
        data: tData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    // Model pie chart
    if (modelPieRef.current) {
      chartsRef.current.modelPie = new Chart(modelPieRef.current.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['gpt-4', 'gpt-5', 'llama'],
          datasets: [{ data: [45, 35, 20] }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // Data Collector chart
    if (dataCollectorChartRef.current) {
      chartsRef.current.dataCollector = new Chart(dataCollectorChartRef.current.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Group A', 'Group B', 'Group C', 'Group D', 'Group E'],
          datasets: [{
            label: '수집 데이터 건수',
            data: [rand(100, 500), rand(200, 600), rand(150, 700), rand(50, 400), rand(100, 300)],
            backgroundColor: 'rgba(99,102,241,0.7)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    // Sparkline charts
    if (gpuSparkRef.current) {
      chartsRef.current.gpuSpark = createSparkChart(
        gpuSparkRef.current,
        Array.from({ length: 20 }, () => rand(10, 90))
      );
    }
    if (memSparkRef.current) {
      chartsRef.current.memSpark = createSparkChart(
        memSparkRef.current,
        Array.from({ length: 20 }, () => rand(20, 80))
      );
    }
    if (queueSparkRef.current) {
      chartsRef.current.queueSpark = createSparkChart(
        queueSparkRef.current,
        Array.from({ length: 20 }, () => rand(0, 30))
      );
    }

    // Initial data
    updateKPIs();
    generateNodes();
    
    // 초기 더미 로그를 한 번에 생성하여 렌더링 최적화
    setLogs(Array.from({ length: 6 }, (_, i) => ({
      id: uniqId(),
      level: ['INFO', 'WARN', 'ERROR'][rand(0, 2)],
      time: new Date().toLocaleTimeString(),
      text: `시스템 시뮬레이션 로그 예시 ${i + 1}`,
      node: `node-${rand(1, 4)}`
    })));

    // Cleanup function
    return () => {
      Object.values(chartsRef.current).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
    };
  }, []);

  // Update charts periodically
  useEffect(() => {
    const updateCharts = () => {
      // Update throughput chart
      if (chartsRef.current.throughput) {
        const chart = chartsRef.current.throughput;
        chart.data.labels.push('');
        chart.data.labels.shift();
        chart.data.datasets[0].data.push(rand(50, 600));
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.push(rand(30, 1200));
        chart.data.datasets[1].data.shift();
        chart.update();
      }

      // Update model pie chart
      if (chartsRef.current.modelPie) {
        const a = rand(30, 60);
        const b = rand(20, 50);
        chartsRef.current.modelPie.data.datasets[0].data = [a, b, Math.max(5, 100 - a - b)];
        chartsRef.current.modelPie.update();
      }

      // Update data collector chart
      if (chartsRef.current.dataCollector) {
        chartsRef.current.dataCollector.data.datasets[0].data = [
          rand(100, 500), rand(200, 600), rand(150, 700), rand(50, 400), rand(100, 300)
        ];
        chartsRef.current.dataCollector.update();
      }

      // Update sparklines
      ['gpuSpark', 'memSpark', 'queueSpark'].forEach(chartName => {
        const chart = chartsRef.current[chartName];
        if (chart) {
          const data = chart.data.datasets[0].data;
          data.push(rand(0, 100));
          data.shift();
          chart.update();
        }
      });

      setLastUpdate(new Date().toLocaleTimeString());
      updateKPIs();
    };

    const interval1 = setInterval(() => {
      updateCharts();
      if (Math.random() < 0.12) {
        pushLog('WARN', '응답 지연 감지: p90 > 1000ms');
      }
    }, 4000);

    const interval2 = setInterval(() => {
      generateNodes();
    }, 15000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    updateKPIs();
    generateNodes();
    pushLog('INFO', '수동 새로고침 수행');
  };

  // Handle model filter change
  const handleModelFilterChange = (value) => {
    setModelFilter(value);
    if (chartsRef.current.modelPie) {
      let data;
      if (value === 'all') data = [45, 35, 20];
      else if (value === 'gpt-4') data = [75, 15, 10];
      else if (value === 'gpt-5') data = [20, 65, 15];
      else if (value === 'llama') data = [10, 10, 80];
      
      chartsRef.current.modelPie.data.datasets[0].data = data;
      chartsRef.current.modelPie.update();
    }
  };

  // Filter logs based on level
  const filteredLogs = logs.filter(log => 
    logLevel === 'ALL' || log.level === logLevel
  );

  return (
    <Layout 
      title="Neo AI Portal"
      subtitle="실시간 모델 & 인프라 모니터링 · 서비스 상태 · 사용량"
      environment="Production"
      showNavigation={true}
    >
      {/* KPI row */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div 
          className="bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={() => navigate('/statsession')}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">활성 세션</div>
              <div className="text-2xl font-semibold">{kpis.sessions}</div>
              <div className="text-xs text-gray-500">동시 사용자 / 지난 1분</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">에러율</div>
              <div className="text-xl text-red-600 font-semibold">{kpis.error}</div>
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={() => navigate('/statresponse')}
        >
          <div className="text-xs text-gray-500">평균 응답시간 (p90)</div>
          <div className="text-2xl font-semibold my-2">{kpis.latency}</div>
          <div className="text-xs text-gray-500">지연 시간 추적 (모델 + 네트워크)</div>
        </div>

        <div 
          className="bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={() => navigate('/stattoken')}
        >
          <div className="text-xs text-gray-500">토큰 사용량 (오늘)</div>
          <div className="text-2xl font-semibold my-2">{kpis.tokens}</div>
          <div className="text-xs text-gray-500">총 토큰 / API 요청</div>
        </div>

        <div 
          className="bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={() => navigate('/statsatisfaction')}
        >
          <div className="text-xs text-gray-500">만족도 평가(오늘)</div>
          <div className="text-2xl font-semibold my-2">{kpis.satisfaction}</div>
          <div className="text-xs text-gray-500">만족도 평가 합산 (추정)</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">APIs 사용현황(오늘)</div>
              <div className="text-2xl font-semibold my-2">{kpis.apiSessions}</div>
              <div className="text-xs text-gray-500">총 API호출 현황</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">에러율</div>
              <div className="text-xl text-red-600 font-semibold">{kpis.apiError}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Charts (left: 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div 
            className="bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
            onClick={() => navigate('/statapis')}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">모델 처리량 & 지연</h2>
                <p className="text-sm text-gray-500">요청 수 · 성공/실패 비율 · p50/p90 응답시간</p>
              </div>
              <div className="text-sm text-gray-500 text-right">
                <div>업데이트: <span>{lastUpdate}</span></div>
              </div>
            </div>
            <div className="relative h-64 bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
            onClick={() => navigate('/statapis')}>
              <canvas ref={throughputChartRef}></canvas>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">모델별 요청 분포</h2>
                <p className="text-sm text-gray-500">각 모델이 처리하는 요청 비율</p>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={modelFilter}
                  onChange={(e) => handleModelFilterChange(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  <option value="all">모든 모델</option>
                  <option value="gpt-4">gpt-4</option>
                  <option value="gpt-5">gpt-5</option>
                  <option value="llama">llama</option>
                </select>
              </div>
            </div>
                    <div 
          className="bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={() => navigate('/statsllmmodel')}
        >
              <canvas ref={modelPieRef}></canvas>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">데이터 수집 현황</h2>
            <p className="text-sm text-gray-500 mb-2">그룹별 수집된 데이터 건수</p>
            <div className="relative h-64 bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
            onClick={() => navigate('/statdatacollector')}>
              <canvas ref={dataCollectorChartRef}></canvas>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">실시간 로그 (최근 100개)</h2>
                <p className="text-sm text-gray-500">오류 / 경고 / 상태 변경</p>
              </div>
              <div className="text-sm text-gray-500">
                필터:
                <select 
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm ml-2"
                >
                  <option>ALL</option>
                  <option>ERROR</option>
                  <option>WARN</option>
                  <option>INFO</option>
                </select>
              </div>
            </div>
                                <div 
          className="bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={() => navigate('/stattotalmonitor')}
        >
              {filteredLogs.map(log => (
                <div key={log.id} className="p-2 rounded-md bg-white text-sm border mb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="mr-2">{log.level}</strong>
                      <span className="text-gray-500">{log.time}</span>
                    </div>
                    <div className="text-xs text-gray-500">{log.node}</div>
                  </div>
                  <div className="mt-1">{log.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: infra */}
        <aside className="space-y-4">
        <div 
          className="bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={() => navigate('/statserver')}
        >
            <h3 className="text-md font-semibold mb-2">GPU / 서버 자원</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">GPU 사용률 (전체)</div>
                  <div className="text-lg font-medium">73%</div>
                </div>
                <div style={{ width: '120px', height: '40px' }}>
                  <canvas ref={gpuSparkRef} height="40"></canvas>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">메모리 사용</div>
                  <div className="text-lg font-medium">24.3 / 32 GB</div>
                </div>
                <div style={{ width: '120px', height: '40px' }}>
                  <canvas ref={memSparkRef} height="40"></canvas>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">큐 대기 길이</div>
                  <div className="text-lg font-medium">12</div>
                </div>
                <div style={{ width: '120px', height: '40px' }}>
                  <canvas ref={queueSparkRef} height="40"></canvas>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
            onClick={() => navigate('/statnode')}
          >
            <h3 className="text-md font-semibold mb-2">노드 상태</h3>
            <div className="space-y-2">
              {nodes.map(node => (
                <div 
                  key={node.id} 
                  className="p-3 rounded-md border flex items-center justify-between bg-white"
                >
                  <div>
                    <div className="font-medium">
                      node-{node.id} 
                      <span className="text-xs text-gray-500 ml-1">({node.status})</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      CPU {node.cpu}% · GPU {node.gpu}% · MEM {node.mem}GB
                    </div>
                  </div>
                  <div className="text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // 부모 클릭 이벤트 방지
                        alert(`SSH placeholder for node-${node.id}`);
                      }}
                      className="px-3 py-1 rounded-md bg-slate-100 text-sm hover:bg-slate-200"
                    >
                      SSH
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

       <div 
          className="bg-white p-4 rounded-xl shadow cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          onClick={() => navigate('/statalarm')}
        >
            <h3 className="text-md font-semibold mb-2">알림 & 이벤트</h3>
            <div className="space-y-2 text-sm text-gray-500">현재 이상 없음</div>
          </div>
        </aside>
      </section>

      {/* Footer */}
      <footer className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          데이터는 샘플이며 실제 운영과 연동하려면 API 또는 WebSocket 엔드포인트를 연결하세요.
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
          >
            강제 새로고침
          </button>
          <button 
            onClick={() => setPaused(!paused)}
            className="px-4 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
          >
            {paused ? '알림 재개' : '알림 일시정지'}
          </button>
        </div>
      </footer>
    </Layout>
  );
}

export default Main1;
import React, { useState, useEffect, useRef } from 'react';
import MonitoringLayout from '../../components/MonitoringLayout';
import KpiCards from './KpiCards';
import RequestViewer from './RequestViewer';
import DataFlowMonitoring from './DataFlowMonitoring';
import ThroughputChart from './ThroughputChart';
import MetricsCharts from './MetricsCharts';
import ModelDistribution from './ModelDistribution';
import DataCollectorChart from './DataCollectorChart';
import TransactionHeatmap from './TransactionHeatmap';
import GpuServerResources from './GpuServerResources';
import AiNodeStatus from './AiNodeStatus';
import AlarmEvents from './AlarmEvents';
import RealtimeLogs from './RealtimeLogs';

function Main1() {
  const uniqId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const [paused, setPaused] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [logLevel, setLogLevel] = useState('ALL');
  
  // 히트맵 일시정지 상태 (별도 관리)
  const [heatmapPaused, setHeatmapPaused] = useState(false);

  const [kpis, setKpis] = useState({
    requestViewer: 70.0,
    apdex: 46.9,
    tps: 110.0,
    activeUsers: 70.0,
    errorRate: 43.1,
    avgResponseTime: 303,
    realTimeTPS: 41,
    sessions: 156,
    sessionError: 2.3,
    latency: 420,
    tokens: 45200,
    satisfaction: 87,
    apiSessions: 89300,
    apiError: 1.8
  });

  const [logs, setLogs] = useState([]);
  const [alarmEvents, setAlarmEvents] = useState([]);
  const [requestParticles, setRequestParticles] = useState([]);
  const requestAnimationRef = useRef(null);

  // 트랜잭션 히트맵 데이터 (최대 1시간 데이터 유지)
  const [heatData, setHeatData] = useState([]);
  const maxHeatDataAge = 60 * 60 * 1000; // 1시간

  const [particleStats, setParticleStats] = useState({
    success: 0,
    warning: 0,
    error: 0
  });

  const [nodes, setNodes] = useState([
    { id: 1, name: 'Client', status: 'good', value: 45, x: 100 },
    { id: 2, name: 'Gateway', status: 'good', value: 42, x: 280 },
    { id: 3, name: 'API Server', status: 'warning', value: 78, x: 460 },
    { id: 4, name: 'Database', status: 'good', value: 38, x: 640 },
    { id: 5, name: 'Cache', status: 'good', value: 22, x: 820 }
  ]);

  const [aiNodes, setAiNodes] = useState([
    { id: 1, cpu: 65, gpu: 73, mem: 24, status: 'running' },
    { id: 2, cpu: 48, gpu: 82, mem: 28, status: 'running' },
    { id: 3, cpu: 72, gpu: 68, mem: 22, status: 'running' },
    { id: 4, cpu: 55, gpu: 91, mem: 30, status: 'degraded' }
  ]);

  const chartsRef = useRef({});
  const throughputChartRef = useRef(null);
  const modelPieRef = useRef(null);
  const dataCollectorChartRef = useRef(null);
  const heatmapRef = useRef(null);

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

  const getStatus = (value) => {
    if (value < 50) return 'good';
    if (value < 80) return 'warning';
    return 'error';
  };

  // 트랜잭션 데이터 생성 함수
  const generateTransaction = () => {
    const urls = [
      '/api/v1/users',
      '/api/v1/products',
      '/api/v1/orders',
      '/api/v1/chat/completions',
      '/api/v1/models/inference',
      '/api/v1/analytics',
      '/api/v1/search',
      '/api/v1/recommendations'
    ];

    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const serverIps = ['10.0.1.10', '10.0.1.11', '10.0.1.12', '10.0.1.13'];
    const clientIps = ['192.168.1.100', '192.168.1.101', '192.168.1.102', '192.168.1.103'];

    // 응답시간: 대부분 정상, 일부 느림, 극소수 매우 느림
    let responseTime;
    const randomValue = Math.random();
    if (randomValue < 0.7) {
      // 70%: 100-800ms (정상)
      responseTime = 100 + Math.random() * 700;
    } else if (randomValue < 0.9) {
      // 20%: 800-2000ms (경고)
      responseTime = 800 + Math.random() * 1200;
    } else if (randomValue < 0.97) {
      // 7%: 2000-3500ms (느림)
      responseTime = 2000 + Math.random() * 1500;
    } else {
      // 3%: 3500-5000ms (매우 느림)
      responseTime = 3500 + Math.random() * 1500;
    }

    // 상태 코드 (대부분 200, 가끔 에러)
    let status;
    const statusRand = Math.random();
    if (statusRand < 0.92) {
      status = 200;
    } else if (statusRand < 0.95) {
      status = 404;
    } else if (statusRand < 0.98) {
      status = 500;
    } else {
      status = 503;
    }

    const timestamp = Date.now();
    const dbTime = responseTime * (0.3 + Math.random() * 0.4); // DB 시간은 전체의 30-70%
    const cpuTime = responseTime * (0.1 + Math.random() * 0.2); // CPU 시간은 전체의 10-30%

    return {
      transactionId: uniqId(),
      timestamp: timestamp,
      x: timestamp, // x축: 시간
      y: responseTime, // y축: 응답시간
      responseTime: responseTime,
      status: status,
      url: urls[Math.floor(Math.random() * urls.length)],
      method: methods[Math.floor(Math.random() * methods.length)],
      serverIp: serverIps[Math.floor(Math.random() * serverIps.length)],
      clientIp: clientIps[Math.floor(Math.random() * clientIps.length)],
      dbTime: dbTime,
      cpuTime: cpuTime
    };
  };

  // 트랜잭션 데이터 생성 (일시정지 상태가 아닐 때만)
  useEffect(() => {
    if (heatmapPaused) return;

    const interval = setInterval(() => {
      const newTransaction = generateTransaction();
      
      setHeatData(prev => {
        const now = Date.now();
        // 1시간 이상 오래된 데이터는 제거
        const filtered = prev.filter(d => now - d.timestamp < maxHeatDataAge);
        // 새 트랜잭션 추가 (최대 5000개 유지)
        const updated = [...filtered, newTransaction];
        return updated.length > 5000 ? updated.slice(-5000) : updated;
      });
    }, 300); // 300ms마다 새 트랜잭션 생성

    return () => clearInterval(interval);
  }, [heatmapPaused, maxHeatDataAge]);

  const pushLog = (level, text) => {
    const newLog = {
      id: uniqId(),
      level,
      time: new Date().toLocaleTimeString(),
      text,
      node: `node-${rand(1, 4)}`
    };
    setLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const addAlarmEvent = () => {
    const now = new Date();
    const levels = ['INFO', 'WARN', 'ERROR', 'DELAY'];
    const selectedLevel = levels[Math.floor(Math.random() * levels.length)];
    const alarmNodes = ['node01', 'node02', 'node03', 'node04', 'node05'];
    const services = ['일반', '데이터수집', '학습모델', 'AI Chat', 'APIs', '설정', '모니터링'];
    const messages = [
      'CPU 사용률 80% 초과',
      '메모리 부족 경고',
      '세션 타임아웃',
      '데이터 수집 실패',
      '모델 업데이트 완료',
      '네트워크 지연 발생',
      '응답 시간 지연',
      'API 호출 지연',
      '데이터베이스 연결 지연',
      '서비스 응답 지연'
    ];

    let selectedMessage;
    if (selectedLevel === 'DELAY') {
      const delayMessages = messages.filter(msg => 
        msg.includes('지연') || msg.includes('타임아웃')
      );
      selectedMessage = delayMessages[Math.floor(Math.random() * delayMessages.length)];
    } else {
      selectedMessage = messages[Math.floor(Math.random() * messages.length)];
    }

    const formatDateTime = (date) => {
      const pad = (n) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ` +
             `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const newEvent = {
      id: uniqId(),
      timestamp: formatDateTime(now),
      level: selectedLevel,
      message: selectedMessage,
      node: alarmNodes[Math.floor(Math.random() * alarmNodes.length)],
      service: services[Math.floor(Math.random() * services.length)],
      rawTime: now
    };

    setAlarmEvents(prev => {
      const updated = [newEvent, ...prev];
      return updated.length > 50 ? updated.slice(0, 50) : updated;
    });
  };

  const updateKPIs = () => {
    setKpis({
      requestViewer: parseFloat(randFloat(60, 80)),
      apdex: parseFloat(randFloat(40, 50)),
      tps: parseFloat(randFloat(100, 120)),
      activeUsers: parseFloat(randFloat(60, 80)),
      errorRate: parseFloat(randFloat(40, 50)),
      avgResponseTime: rand(250, 350),
      realTimeTPS: rand(35, 55),
      sessions: rand(120, 200),
      sessionError: parseFloat(randFloat(1, 5)),
      latency: rand(300, 600),
      tokens: rand(40000, 60000),
      satisfaction: rand(80, 95),
      apiSessions: rand(80000, 100000),
      apiError: parseFloat(randFloat(1, 3))
    });
  };

  // 실시간 TPS 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setKpis(prev => ({
        ...prev,
        realTimeTPS: rand(30, 65)
      }));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // 알람 이벤트 생성
  useEffect(() => {
    const interval = setInterval(addAlarmEvent, 3000);
    return () => clearInterval(interval);
  }, []);

  // 노드 상태 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        value: Math.max(10, Math.min(100, node.value + (Math.random() - 0.5) * 15)),
        status: getStatus(node.value)
      })));
      
      setAiNodes(prev => prev.map(node => ({
        ...node,
        cpu: rand(40, 90),
        gpu: rand(60, 95),
        mem: rand(20, 32),
        status: Math.random() < 0.95 ? 'running' : 'degraded'
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Request Particles 생성
  useEffect(() => {
    const createRequestParticle = () => {
      const types = ['success', 'warning', 'error'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const newParticle = {
        id: Date.now() + Math.random(),
        progress: 0,
        speed: 0.006 + Math.random() * 0.008,
        size: 8 + Math.random() * 6,
        opacity: 0.9,
        type: type,
        verticalOffset: (Math.random() - 0.5) * 30,
        delay: Math.random() * 0.2
      };
      
      setRequestParticles(prev => [...prev, newParticle]);
      setParticleStats(prev => ({
        ...prev,
        [type]: prev[type] + 1
      }));
    };

    const interval = setInterval(createRequestParticle, 250);
    return () => clearInterval(interval);
  }, []);

  // Request Particles 애니메이션
  useEffect(() => {
    const animate = () => {
      setRequestParticles(prev => {
        const filtered = prev.filter(p => p.progress < 1);
        const removed = prev.filter(p => p.progress >= 1);
        
        if (removed.length > 0) {
          setParticleStats(current => {
            const updated = { ...current };
            removed.forEach(p => {
              if (updated[p.type] > 0) {
                updated[p.type] = updated[p.type] - 1;
              }
            });
            return updated;
          });
        }
        
        return filtered.map(p => ({
          ...p,
          progress: p.progress + p.speed
        }));
      });
      requestAnimationRef.current = requestAnimationFrame(animate);
    };

    requestAnimationRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
    };
  }, []);

  // 초기 로그 생성
  useEffect(() => {
    updateKPIs();
    
    setLogs(Array.from({ length: 6 }, (_, i) => ({
      id: uniqId(),
      level: ['INFO', 'WARN', 'ERROR'][rand(0, 2)],
      time: new Date().toLocaleTimeString(),
      text: `시스템 시뮬레이션 로그 예시 ${i + 1}`,
      node: `node-${rand(1, 4)}`
    })));
  }, []);

  // 차트 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return;

      ['tps', 'activeUsers', 'avgResponse'].forEach(chartName => {
        const chart = chartsRef.current[chartName];
        if (chart) {
          chart.data.datasets.forEach((dataset) => {
            const data = dataset.data;
            if (chartName === 'tps') {
              data.push(rand(80, 120));
            } else if (chartName === 'activeUsers') {
              data.push(rand(50, 90));
            } else {
              data.push(rand(200, 400));
            }
            data.shift();
          });
          chart.update('none');
        }
      });

      if (throughputChartRef.current) {
        const chart = throughputChartRef.current;
        chart.data.datasets.forEach((dataset, idx) => {
          const data = dataset.data;
          if (idx === 0) {
            data.push(rand(50, 600));
          } else {
            data.push(rand(30, 1200));
          }
          data.shift();
        });
        chart.update('none');
      }

      if (modelPieRef.current) {
        const total = 100;
        const values = [];
        
        values.push(Math.floor(Math.random() * 16) + 25);
        values.push(Math.floor(Math.random() * 11) + 15);
        values.push(Math.floor(Math.random() * 11) + 10);
        values.push(Math.floor(Math.random() * 8) + 8);
        values.push(Math.floor(Math.random() * 8) + 5);
        
        const sum = values.reduce((a, b) => a + b, 0);
        values.push(Math.max(3, total - sum));
        
        modelPieRef.current.data.datasets[0].data = values;
        modelPieRef.current.update('active');
      }

      if (dataCollectorChartRef.current) {
        dataCollectorChartRef.current.data.datasets[0].data = [
          rand(150, 650), rand(250, 750), rand(200, 800), rand(100, 500), rand(150, 450)
        ];
        dataCollectorChartRef.current.update('active');
      }

      ['gpuSpark', 'memSpark', 'queueSpark'].forEach(chartName => {
        const chart = chartsRef.current[chartName];
        if (chart) {
          const data = chart.data.datasets[0].data;
          data.push(rand(0, 100));
          data.shift();
          chart.update('none');
        }
      });

      updateKPIs();
      
      if (Math.random() < 0.1) {
        pushLog(['INFO', 'WARN', 'ERROR'][rand(0, 2)], 
          ['응답 지연 감지', '서버 부하 증가', 'API 호출 성공', '메모리 사용량 증가'][rand(0, 3)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <MonitoringLayout 
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
    >
      <div style={{ padding: '1rem' }}>
        <style>{`
          .apm-card {
            background: rgba(42, 48, 70, 0.7);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: all 0.3s;
          }
          .apm-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
            border-color: rgba(99, 102, 241, 0.5);
          }
          .apm-card-bright {
            background: linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%);
            border: 1px solid rgba(99, 102, 241, 0.4);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            transition: all 0.3s;
          }
          .apm-card-bright:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
            border-color: rgba(99, 102, 241, 0.6);
          }
          .apm-card-title {
            font-size: 0.9rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .gauge-value {
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            font-weight: 700;
          }
          .kpi-card {
            background: linear-gradient(135deg, rgba(42, 48, 70, 0.9) 0%, rgba(54, 61, 90, 0.9) 100%);
            border: 1px solid rgba(99, 102, 241, 0.4);
            border-radius: 8px;
            padding: 1.2rem;
            transition: all 0.3s;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
          .kpi-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
          }
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          @keyframes tpsBubble {
            0%, 100% {
              transform: scale(1);
              opacity: 0.6;
            }
            50% {
              transform: scale(1.15);
              opacity: 0.8;
            }
          }
          .donut-3d-container {
            perspective: 1000px;
            transform-style: preserve-3d;
          }
          .donut-3d-canvas {
            transform: rotateX(15deg);
            filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.6));
            transition: transform 0.3s ease;
          }
          .donut-3d-canvas:hover {
            transform: rotateX(20deg) scale(1.05);
          }
          .alarm-badge {
            display: inline-block;
            padding: 0.2rem 0.5rem;
            font-size: 0.7rem;
            font-weight: 600;
            border-radius: 12px;
          }
          .bg-blue-100 { background-color: rgba(219, 234, 254, 0.3); }
          .text-blue-800 { color: #1e40af; }
          .bg-yellow-100 { background-color: rgba(254, 243, 199, 0.3); }
          .text-yellow-800 { color: #92400e; }
          .bg-red-100 { background-color: rgba(254, 226, 226, 0.3); }
          .text-red-800 { color: #991b1b; }
          .bg-cyan-100 { background-color: rgba(207, 250, 254, 0.3); }
          .text-cyan-800 { color: #155e75; }
        `}</style>

        {/* Header */}
        <div style={{ background: 'rgba(42, 48, 70, 0.6)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              🏠 / 통합 모니터링 / {activeMenu === 'dashboard' ? '대시보드' : activeMenu}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1rem', marginBottom: '1rem' }}>
          {/* Left side */}
          <div>
            <KpiCards kpis={kpis} />
            <RequestViewer kpis={kpis} requestParticles={requestParticles} particleStats={particleStats} />
            <DataFlowMonitoring nodes={nodes} />
            <ThroughputChart chartRef={throughputChartRef} />
            <MetricsCharts chartRefs={chartsRef} />
            <ModelDistribution chartRef={modelPieRef} />
            <DataCollectorChart chartRef={dataCollectorChartRef} />
            <TransactionHeatmap 
              heatData={heatData} 
              isPaused={heatmapPaused}
              onPauseChange={setHeatmapPaused}
            />
          </div>

          {/* Right side */}
          <div>
            <GpuServerResources chartRefs={chartsRef} />
            <AiNodeStatus aiNodes={aiNodes} />
            <AlarmEvents alarmEvents={alarmEvents} />
            <RealtimeLogs logs={logs} logLevel={logLevel} setLogLevel={setLogLevel} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'rgba(42, 48, 70, 0.5)', 
          borderRadius: '6px', 
          fontSize: '0.7rem', 
          color: 'rgba(255, 255, 255, 0.5)', 
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            © 2025 Neo AI Portal | Version 1.0.0
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={updateKPIs}
              style={{
                padding: '0.4rem 0.8rem',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              🔄 새로고침
            </button>
            <button 
              onClick={() => setPaused(!paused)}
              style={{
                padding: '0.4rem 0.8rem',
                background: paused ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${paused ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                borderRadius: '4px',
                color: '#fff',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              {paused ? '▶️ 재개' : '⏸️ 일시정지'}
            </button>
          </div>
        </div>
      </div>
    </MonitoringLayout>
  );
}

export default Main1;
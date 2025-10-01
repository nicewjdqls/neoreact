import React, { useMemo, useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Card, Row, Col, Table, Badge, Button, ProgressBar } from 'react-bootstrap';
import {
  Activity,
  Cpu,
  CloudLightning,
  Server,
  Database,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Zap
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const statusVariant = {
  healthy: 'success',
  warning: 'warning',
  critical: 'danger',
  maintenance: 'secondary'
};

const statusLabel = {
  healthy: '정상',
  warning: '주의',
  critical: '위험',
  maintenance: '점검중'
};

const gpuStatusTone = (util) => {
  if (util >= 85) return 'danger';
  if (util >= 65) return 'warning';
  return 'success';
};

const generateLogEntry = () => {
  const levels = ['info', 'info', 'warning', 'critical'];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const templates = {
    info: 'API 요청 처리 완료',
    warning: 'GPU Queue 지연 발생',
    critical: '응답 SLA 초과 발생'
  };
  return {
    time: new Date().toLocaleTimeString(),
    service: ['Inference API', 'Vector DB', 'Realtime Stream'][Math.floor(Math.random() * 3)],
    level,
    message: templates[level]
  };
};

const AIPortal = () => {
  const [metrics, setMetrics] = useState({
    apiRequests: 182340,
    avgLatency: 248,
    gpuUsage: 68,
    traffic: 82
  });

  const [trafficLogs, setTrafficLogs] = useState(() =>
    Array.from({ length: 6 }).map(() => generateLogEntry())
  );

  const apiServices = useMemo(() => ([
    {
      name: 'Inference API',
      status: 'healthy',
      latency: '212 ms',
      uptime: '99.98%',
      volume: '58.2K'
    },
    {
      name: 'Embeddings API',
      status: 'warning',
      latency: '364 ms',
      uptime: '99.31%',
      volume: '32.4K'
    },
    {
      name: 'Realtime Stream',
      status: 'healthy',
      latency: '128 ms',
      uptime: '99.87%',
      volume: '12.1K'
    },
    {
      name: 'Vector Database',
      status: 'maintenance',
      latency: '—',
      uptime: '96.4%',
      volume: '—'
    }
  ]), []);

  const gpuFleets = useMemo(() => ([
    { name: 'GPU Cluster A', utilization: 72, memory: 68, temperature: 64 },
    { name: 'GPU Cluster B', utilization: 88, memory: 74, temperature: 71 },
    { name: 'GPU Cluster C', utilization: 61, memory: 53, temperature: 58 }
  ]), []);

  const incidentFeed = useMemo(() => ([
    {
      id: 1,
      time: '09:24',
      title: 'API 오류율 증가',
      detail: 'Embeddings API 오류율 3% → 5.6%',
      severity: 'warning'
    },
    {
      id: 2,
      time: '08:40',
      title: 'GPU 워크로드 리밸런싱',
      detail: 'Cluster B → C 자원 재할당',
      severity: 'healthy'
    },
    {
      id: 3,
      time: '07:55',
      title: '실시간 로그 스파이크',
      detail: '트래픽 급증에 따른 버퍼 조정',
      severity: 'critical'
    }
  ]), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        apiRequests: prev.apiRequests + Math.floor(Math.random() * 1200),
        avgLatency: Math.max(180, Math.min(420, prev.avgLatency + (Math.random() - 0.5) * 30)),
        gpuUsage: Math.max(45, Math.min(96, prev.gpuUsage + (Math.random() - 0.5) * 5)),
        traffic: Math.max(40, Math.min(98, prev.traffic + (Math.random() - 0.5) * 8))
      }));

      setTrafficLogs(prev => {
        const next = [generateLogEntry(), ...prev];
        return next.slice(0, 8);
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout
      title="AI 운영 포탈"
      subtitle="API, GPU, 트래픽 로그를 한눈에 모니터링"
      environment="Production"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-semibold mb-1">실시간 관제 현황</h2>
          <p className="text-muted mb-0">서비스 핵심 지표와 인프라 상태를 실시간으로 확인하세요.</p>
        </div>
        <Button variant="outline-primary" className="d-flex align-items-center gap-2">
          <RefreshCw size={16} />
          새로고침
        </Button>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3} sm={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted text-uppercase" style={{ fontSize: '12px' }}>API 요청량</span>
                <Activity size={18} className="text-primary" />
              </div>
              <h3 className="fw-semibold mb-0">{metrics.apiRequests.toLocaleString()}</h3>
              <small className="text-success d-flex align-items-center gap-1 mt-2">
                <ArrowUpRight size={14} /> 전일 대비 12.4%
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted text-uppercase" style={{ fontSize: '12px' }}>평균 응답 지연</span>
                <Server size={18} className="text-info" />
              </div>
              <h3 className="fw-semibold mb-0">{Math.round(metrics.avgLatency)} ms</h3>
              <small className="text-danger d-flex align-items-center gap-1 mt-2">
                <ArrowDownRight size={14} /> SLA 250ms 대비 ↑
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted text-uppercase" style={{ fontSize: '12px' }}>GPU 평균 활용률</span>
                <Cpu size={18} className="text-warning" />
              </div>
              <h3 className="fw-semibold mb-0">{Math.round(metrics.gpuUsage)}%</h3>
              <ProgressBar now={metrics.gpuUsage} className="mt-3" variant={gpuStatusTone(metrics.gpuUsage)} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted text-uppercase" style={{ fontSize: '12px' }}>실시간 트래픽</span>
                <Globe size={18} className="text-success" />
              </div>
              <h3 className="fw-semibold mb-0">{Math.round(metrics.traffic)}%</h3>
              <small className="text-muted d-flex align-items-center gap-1 mt-2">
                <Zap size={14} /> 피크 대비 사용률
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">API 서비스 상태</h5>
                <small className="text-muted">응답 시간과 가용성 기준으로 정렬</small>
              </div>
              <Button size="sm" variant="outline-secondary">전체 보기</Button>
            </Card.Header>
            <Card.Body className="pt-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead>
                  <tr className="text-muted" style={{ fontSize: '13px' }}>
                    <th>서비스</th>
                    <th className="text-center">상태</th>
                    <th className="text-end">평균 지연</th>
                    <th className="text-end">가용성</th>
                    <th className="text-end">요청 수</th>
                  </tr>
                </thead>
                <tbody>
                  {apiServices.map(service => (
                    <tr key={service.name}>
                      <td className="fw-semibold">{service.name}</td>
                      <td className="text-center">
                        <Badge bg={statusVariant[service.status]} className="px-3 py-2">
                          {statusLabel[service.status]}
                        </Badge>
                      </td>
                      <td className="text-end">{service.latency}</td>
                      <td className="text-end">{service.uptime}</td>
                      <td className="text-end">{service.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">실시간 트래픽 로그</h5>
                <small className="text-muted">최근 8개 이벤트 스트림</small>
              </div>
              <Button size="sm" variant="outline-secondary">로그 다운로드</Button>
            </Card.Header>
            <Card.Body className="pt-0">
              <div className="d-flex flex-column gap-3">
                {trafficLogs.map((log, index) => (
                  <div key={`${log.time}-${index}`} className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold">{log.message}</div>
                      <small className="text-muted">{log.service}</small>
                    </div>
                    <div className="text-end">
                      <Badge bg={log.level === 'critical' ? 'danger' : log.level === 'warning' ? 'warning' : 'info'}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <div className="text-muted" style={{ fontSize: '12px' }}>{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-1">GPU 클러스터 현황</h5>
              <small className="text-muted">워크로드 균형 및 온도</small>
            </Card.Header>
            <Card.Body className="pt-0 d-flex flex-column gap-3">
              {gpuFleets.map(cluster => (
                <div key={cluster.name} className="p-3 border rounded-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold">{cluster.name}</span>
                    <Badge bg={gpuStatusTone(cluster.utilization)}>{cluster.utilization}%</Badge>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-flex justify-content-between">
                      <span>GPU Utilization</span>
                      <span>{cluster.utilization}%</span>
                    </small>
                    <ProgressBar now={cluster.utilization} variant={gpuStatusTone(cluster.utilization)} />
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-flex justify-content-between">
                      <span>Memory Usage</span>
                      <span>{cluster.memory}%</span>
                    </small>
                    <ProgressBar now={cluster.memory} variant="info" />
                  </div>
                  <div>
                    <small className="text-muted d-flex justify-content-between">
                      <span>Temperature</span>
                      <span>{cluster.temperature}℃</span>
                    </small>
                    <ProgressBar now={cluster.temperature} variant={cluster.temperature > 70 ? 'danger' : 'success'} />
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0 d-flex align-items-center gap-2">
              <AlertTriangle size={18} className="text-warning" />
              <div>
                <h5 className="mb-0">알림 &amp; 인시던트</h5>
                <small className="text-muted">최근 이벤트 타임라인</small>
              </div>
            </Card.Header>
            <Card.Body className="pt-0">
              <div className="d-flex flex-column gap-3">
                {incidentFeed.map(incident => (
                  <div key={incident.id} className="d-flex gap-3">
                    <div className="text-muted" style={{ minWidth: '48px' }}>{incident.time}</div>
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg={statusVariant[incident.severity]}>{statusLabel[incident.severity]}</Badge>
                        <span className="fw-semibold">{incident.title}</span>
                      </div>
                      <small className="text-muted">{incident.detail}</small>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="primary" className="w-100 mt-3">
                <CloudLightning size={16} className="me-2" /> 비상대응 대시보드 열기
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 mt-4">
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">데이터 파이프라인 상태</h5>
            <small className="text-muted">ETL 작업 및 피드 업데이트 주기</small>
          </div>
          <Button size="sm" variant="outline-secondary">
            <Database size={16} className="me-2" /> 파이프라인 제어
          </Button>
        </Card.Header>
        <Card.Body className="pt-0">
          <Row className="g-4">
            {[{
              name: '수집 파이프라인',
              desc: '외부 이벤트 → Ingestion Queue',
              progress: 92,
              eta: '5분 이내'
            }, {
              name: '학습 데이터 정제',
              desc: 'Raw Storage → Feature Store',
              progress: 67,
              eta: '34분'
            }, {
              name: '모델 서빙 반영',
              desc: 'Feature Store → Realtime Endpoint',
              progress: 48,
              eta: '1시간 12분'
            }].map((pipeline, idx) => (
              <Col md={4} key={pipeline.name}>
                <div className="p-4 border rounded-3 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold">{pipeline.name}</span>
                    <Badge bg={idx === 0 ? 'success' : idx === 1 ? 'warning' : 'info'}>{pipeline.progress}%</Badge>
                  </div>
                  <p className="text-muted mb-3" style={{ fontSize: '14px' }}>{pipeline.desc}</p>
                  <ProgressBar
                    now={pipeline.progress}
                    variant={idx === 0 ? 'success' : idx === 1 ? 'warning' : 'info'}
                    className="mb-2"
                  />
                  <small className="text-muted">예상 완료: {pipeline.eta}</small>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default AIPortal;

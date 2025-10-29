// NetworkMonitor.jsx
class NetworkMonitor {
  constructor() {
    this.anomalies = [];
  }

  detectAnomalies(response) {
    const issues = [];
    
    // 1. 응답 시간 체크
    if (response.duration > 5000) {
      issues.push('Slow response');
    }
    
    // 2. SSL 검증 실패 감지
    if (response.config.url.startsWith('http://')) {
      issues.push('Insecure connection');
    }
    
    // 3. 비정상 상태 코드
    if ([429, 503].includes(response.status)) {
      issues.push('Rate limited or service unavailable');
    }
    
    if (issues.length > 0) {
      this.reportToServer(issues);
    }
  }

  async reportToServer(anomalies) {
    await axios.post('/api/security/report', {
      anomalies,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    });
  }
}

// Axios Interceptor
const monitor = new NetworkMonitor();

axios.interceptors.response.use(
  response => {
    monitor.detectAnomalies(response);
    return response;
  },
  error => {
    monitor.detectAnomalies(error);
    return Promise.reject(error);
  }
);
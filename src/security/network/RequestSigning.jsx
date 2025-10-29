// RequestSigning.jsx
import crypto from 'crypto-js';

class RequestSigner {
  constructor(secretKey) {
    this.secretKey = secretKey; // 환경변수에서 로드
  }

  signRequest(method, endpoint, body = '') {
    const timestamp = Date.now();
    const payload = `${timestamp}${method}${endpoint}${JSON.stringify(body)}`;
    const signature = crypto.HmacSHA256(payload, this.secretKey).toString();
    
    return {
      'X-Timestamp': timestamp,
      'X-Signature': signature
    };
  }
}

// Axios Interceptor에 적용
axios.interceptors.request.use(config => {
  const signer = new RequestSigner(process.env.REACT_APP_SECRET);
  const headers = signer.signRequest(
    config.method,
    config.url,
    config.data
  );
  
  config.headers = { ...config.headers, ...headers };
  return config;
});
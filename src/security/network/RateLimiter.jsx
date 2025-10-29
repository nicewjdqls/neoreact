// RateLimiter.jsx
class RateLimiter {
  constructor() {
    this.requests = new Map(); // endpoint: [timestamps]
  }

  canMakeRequest(endpoint, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const timestamps = this.requests.get(endpoint) || [];
    
    // 윈도우 밖의 요청 제거
    const validTimestamps = timestamps.filter(t => now - t < windowMs);
    
    if (validTimestamps.length >= maxRequests) {
      return false;
    }
    
    validTimestamps.push(now);
    this.requests.set(endpoint, validTimestamps);
    return true;
  }
}

// Axios Interceptor에 적용
const limiter = new RateLimiter();

axios.interceptors.request.use(config => {
  if (!limiter.canMakeRequest(config.url)) {
    return Promise.reject(new Error('Too many requests'));
  }
  return config;
});
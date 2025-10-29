// CertificatePinning.jsx
import { fetch } from 'react-native-ssl-pinning';

const certificatePin = {
  'api.yourserver.com': {
    includeSubdomains: true,
    pins: [
      'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      // 백업 핀 추가
    ]
  }
};

export const secureFetch = async (url, options) => {
  try {
    return await fetch(url, {
      ...options,
      sslPinning: certificatePin,
      timeoutInterval: 10000,
    });
  } catch (error) {
    console.error('SSL Pinning failed:', error);
    throw error;
  }
};
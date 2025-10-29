// src/utils/cryptoUtils.js
// 암호화 유틸리티 (민감한 데이터 보호)

/**
 * Base64 인코딩/디코딩 유틸리티
 */
export const Base64 = {
  /**
   * Base64 인코딩
   * @param {string} str - 인코딩할 문자열
   * @returns {string} Base64 인코딩된 문자열
   */
  encode: (str) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (error) {
      console.error('❌ [Base64] ENCODE 실패:', error);
      return str;
    }
  },

  /**
   * Base64 디코딩
   * @param {string} str - 디코딩할 문자열
   * @returns {string} 디코딩된 문자열
   */
  decode: (str) => {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (error) {
      console.error('❌ [Base64] DECODE 실패:', error);
      return str;
    }
  }
};

/**
 * 간단한 XOR 암호화 (클라이언트 사이드 기본 보호)
 * 주의: 강력한 보안이 필요한 경우 서버 사이드 암호화 사용 권장
 */
export const SimpleEncryption = {
  /**
   * XOR 암호화
   * @param {string} text - 암호화할 텍스트
   * @param {string} key - 암호화 키
   * @returns {string} 암호화된 텍스트
   */
  encrypt: (text, key = 'neo-react-secret-key') => {
    try {
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      return Base64.encode(result);
    } catch (error) {
      console.error('❌ [SimpleEncryption] ENCRYPT 실패:', error);
      return text;
    }
  },

  /**
   * XOR 복호화
   * @param {string} encryptedText - 복호화할 텍스트
   * @param {string} key - 암호화 키
   * @returns {string} 복호화된 텍스트
   */
  decrypt: (encryptedText, key = 'neo-react-secret-key') => {
    try {
      const decoded = Base64.decode(encryptedText);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      console.error('❌ [SimpleEncryption] DECRYPT 실패:', error);
      return encryptedText;
    }
  }
};

/**
 * Web Crypto API를 사용한 강력한 암호화
 * (최신 브라우저에서만 지원)
 */
export const SecureEncryption = {
  /**
   * 암호화 키 생성
   * @returns {Promise<CryptoKey>} 암호화 키
   */
  generateKey: async () => {
    try {
      return await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('❌ [SecureEncryption] KEY 생성 실패:', error);
      throw error;
    }
  },

  /**
   * 데이터 암호화 (AES-GCM)
   * @param {string} text - 암호화할 텍스트
   * @param {CryptoKey} key - 암호화 키
   * @returns {Promise<string>} 암호화된 데이터 (Base64)
   */
  encrypt: async (text, key) => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data
      );

      // IV와 암호화된 데이터를 함께 저장
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedData), iv.length);

      return Base64.encode(String.fromCharCode(...combined));
    } catch (error) {
      console.error('❌ [SecureEncryption] ENCRYPT 실패:', error);
      throw error;
    }
  },

  /**
   * 데이터 복호화 (AES-GCM)
   * @param {string} encryptedText - 암호화된 텍스트 (Base64)
   * @param {CryptoKey} key - 암호화 키
   * @returns {Promise<string>} 복호화된 텍스트
   */
  decrypt: async (encryptedText, key) => {
    try {
      const decoded = Base64.decode(encryptedText);
      const combined = new Uint8Array(decoded.split('').map(c => c.charCodeAt(0)));

      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    } catch (error) {
      console.error('❌ [SecureEncryption] DECRYPT 실패:', error);
      throw error;
    }
  }
};

/**
 * 해시 함수 (SHA-256)
 */
export const Hash = {
  /**
   * SHA-256 해시 생성
   * @param {string} text - 해시할 텍스트
   * @returns {Promise<string>} 해시값 (Hex)
   */
  sha256: async (text) => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('❌ [Hash] SHA-256 실패:', error);
      throw error;
    }
  }
};

/**
 * 토큰 생성 유틸리티
 */
export const TokenGenerator = {
  /**
   * 랜덤 토큰 생성
   * @param {number} length - 토큰 길이
   * @returns {string} 랜덤 토큰
   */
  generate: (length = 32) => {
    try {
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('❌ [TokenGenerator] GENERATE 실패:', error);
      // 폴백: Math.random() 사용
      return Array.from({ length }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
    }
  },

  /**
   * UUID v4 생성
   * @returns {string} UUID
   */
  uuid: () => {
    try {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    } catch (error) {
      console.error('❌ [TokenGenerator] UUID 실패:', error);
      // 폴백
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }
};

/**
 * 암호화된 저장소 래퍼
 */
export const EncryptedStorage = {
  /**
   * 암호화하여 저장
   * @param {string} key - 키
   * @param {*} value - 값
   * @param {string} encryptionKey - 암호화 키
   */
  setItem: (key, value, encryptionKey = 'neo-react-secret-key') => {
    try {
      const jsonValue = JSON.stringify(value);
      const encrypted = SimpleEncryption.encrypt(jsonValue, encryptionKey);
      localStorage.setItem(key, encrypted);
      console.log(`🔐 [EncryptedStorage] SET: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ [EncryptedStorage] SET 실패:', error);
      return false;
    }
  },

  /**
   * 복호화하여 가져오기
   * @param {string} key - 키
   * @param {*} defaultValue - 기본값
   * @param {string} encryptionKey - 암호화 키
   * @returns {*} 복호화된 값
   */
  getItem: (key, defaultValue = null, encryptionKey = 'neo-react-secret-key') => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) {
        return defaultValue;
      }

      const decrypted = SimpleEncryption.decrypt(encrypted, encryptionKey);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('❌ [EncryptedStorage] GET 실패:', error);
      return defaultValue;
    }
  },

  /**
   * 삭제
   * @param {string} key - 키
   */
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      console.log(`🔐 [EncryptedStorage] REMOVE: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ [EncryptedStorage] REMOVE 실패:', error);
      return false;
    }
  }
};

/**
 * CSRF 토큰 관리
 */
export const CSRFToken = {
  /**
   * CSRF 토큰 생성
   * @returns {string} CSRF 토큰
   */
  generate: () => {
    const token = TokenGenerator.generate(32);
    sessionStorage.setItem('csrf_token', token);
    console.log('🛡️ [CSRF] 토큰 생성');
    return token;
  },

  /**
   * CSRF 토큰 가져오기
   * @returns {string|null} CSRF 토큰
   */
  get: () => {
    return sessionStorage.getItem('csrf_token');
  },

  /**
   * CSRF 토큰 검증
   * @param {string} token - 검증할 토큰
   * @returns {boolean} 검증 결과
   */
  validate: (token) => {
    const storedToken = CSRFToken.get();
    return storedToken !== null && storedToken === token;
  },

  /**
   * CSRF 토큰 삭제
   */
  clear: () => {
    sessionStorage.removeItem('csrf_token');
    console.log('🛡️ [CSRF] 토큰 삭제');
  }
};

export default {
  Base64,
  SimpleEncryption,
  SecureEncryption,
  Hash,
  TokenGenerator,
  EncryptedStorage,
  CSRFToken
};

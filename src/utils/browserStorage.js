// src/utils/browserStorage.js
// 브라우저 저장소 통합 유틸리티 (쿠키, 로컬 스토리지, 세션 스토리지)

/**
 * 쿠키 관리 유틸리티
 */
export const CookieStorage = {
  /**
   * 쿠키 설정
   * @param {string} name - 쿠키 이름
   * @param {string} value - 쿠키 값
   * @param {Object} options - 쿠키 옵션
   * @param {number} options.days - 만료 기간 (일)
   * @param {string} options.path - 경로
   * @param {boolean} options.secure - Secure 속성
   * @param {boolean} options.httpOnly - HttpOnly 속성 (서버 사이드 전용)
   * @param {string} options.sameSite - SameSite 속성 (Strict, Lax, None)
   */
  set: (name, value, options = {}) => {
    try {
      const {
        days = 7,
        path = '/',
        secure = window.location.protocol === 'https:',
        sameSite = 'Strict'
      } = options;

      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

      // 만료일 설정
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        cookieString += `; expires=${date.toUTCString()}`;
      }

      // 경로 설정
      cookieString += `; path=${path}`;

      // Secure 속성 (HTTPS only)
      if (secure) {
        cookieString += '; Secure';
      }

      // SameSite 속성 (CSRF 방어)
      cookieString += `; SameSite=${sameSite}`;

      document.cookie = cookieString;
      console.log(`🍪 [Cookie] SET: ${name}`);
      return true;
    } catch (error) {
      console.error('❌ [Cookie] SET 실패:', error);
      return false;
    }
  },

  /**
   * 쿠키 가져오기
   * @param {string} name - 쿠키 이름
   * @returns {string|null} 쿠키 값
   */
  get: (name) => {
    try {
      const nameEQ = encodeURIComponent(name) + '=';
      const cookies = document.cookie.split(';');

      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
          const value = decodeURIComponent(cookie.substring(nameEQ.length));
          console.log(`🍪 [Cookie] GET: ${name}`);
          return value;
        }
      }
      return null;
    } catch (error) {
      console.error('❌ [Cookie] GET 실패:', error);
      return null;
    }
  },

  /**
   * 쿠키 삭제
   * @param {string} name - 쿠키 이름
   * @param {string} path - 경로
   */
  remove: (name, path = '/') => {
    try {
      document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
      console.log(`🍪 [Cookie] REMOVE: ${name}`);
      return true;
    } catch (error) {
      console.error('❌ [Cookie] REMOVE 실패:', error);
      return false;
    }
  },

  /**
   * 모든 쿠키 삭제
   */
  clear: () => {
    try {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const name = cookie.split('=')[0].trim();
        CookieStorage.remove(name);
      }
      console.log('🍪 [Cookie] CLEAR: 모든 쿠키 삭제');
      return true;
    } catch (error) {
      console.error('❌ [Cookie] CLEAR 실패:', error);
      return false;
    }
  }
};

/**
 * 로컬 스토리지 관리 유틸리티
 */
export const LocalStorage = {
  /**
   * 로컬 스토리지에 데이터 저장
   * @param {string} key - 키
   * @param {*} value - 값 (자동으로 JSON 변환)
   * @param {Object} options - 옵션
   * @param {boolean} options.encrypt - 암호화 여부
   */
  set: (key, value, options = {}) => {
    try {
      const { encrypt = false } = options;
      let dataToStore = value;

      // 객체는 JSON으로 변환
      if (typeof value === 'object') {
        dataToStore = JSON.stringify(value);
      }

      // 암호화 (선택적)
      if (encrypt) {
        // 암호화 로직은 cryptoUtils에서 처리
        console.warn('⚠️ [LocalStorage] 암호화 옵션 활성화 - cryptoUtils 필요');
      }

      localStorage.setItem(key, dataToStore);
      console.log(`💾 [LocalStorage] SET: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ [LocalStorage] SET 실패:', error);
      return false;
    }
  },

  /**
   * 로컬 스토리지에서 데이터 가져오기
   * @param {string} key - 키
   * @param {*} defaultValue - 기본값
   * @returns {*} 저장된 값
   */
  get: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key);

      if (value === null) {
        return defaultValue;
      }

      // JSON 파싱 시도
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('❌ [LocalStorage] GET 실패:', error);
      return defaultValue;
    }
  },

  /**
   * 로컬 스토리지에서 데이터 삭제
   * @param {string} key - 키
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      console.log(`💾 [LocalStorage] REMOVE: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ [LocalStorage] REMOVE 실패:', error);
      return false;
    }
  },

  /**
   * 로컬 스토리지 전체 삭제
   */
  clear: () => {
    try {
      localStorage.clear();
      console.log('💾 [LocalStorage] CLEAR: 모든 데이터 삭제');
      return true;
    } catch (error) {
      console.error('❌ [LocalStorage] CLEAR 실패:', error);
      return false;
    }
  },

  /**
   * 특정 접두사를 가진 키 모두 삭제
   * @param {string} prefix - 접두사
   */
  clearByPrefix: (prefix) => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
      console.log(`💾 [LocalStorage] CLEAR BY PREFIX: ${prefix}`);
      return true;
    } catch (error) {
      console.error('❌ [LocalStorage] CLEAR BY PREFIX 실패:', error);
      return false;
    }
  }
};

/**
 * 세션 스토리지 관리 유틸리티
 */
export const SessionStorage = {
  /**
   * 세션 스토리지에 데이터 저장
   * @param {string} key - 키
   * @param {*} value - 값
   */
  set: (key, value) => {
    try {
      let dataToStore = value;

      // 객체는 JSON으로 변환
      if (typeof value === 'object') {
        dataToStore = JSON.stringify(value);
      }

      sessionStorage.setItem(key, dataToStore);
      console.log(`📦 [SessionStorage] SET: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ [SessionStorage] SET 실패:', error);
      return false;
    }
  },

  /**
   * 세션 스토리지에서 데이터 가져오기
   * @param {string} key - 키
   * @param {*} defaultValue - 기본값
   * @returns {*} 저장된 값
   */
  get: (key, defaultValue = null) => {
    try {
      const value = sessionStorage.getItem(key);

      if (value === null) {
        return defaultValue;
      }

      // JSON 파싱 시도
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('❌ [SessionStorage] GET 실패:', error);
      return defaultValue;
    }
  },

  /**
   * 세션 스토리지에서 데이터 삭제
   * @param {string} key - 키
   */
  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
      console.log(`📦 [SessionStorage] REMOVE: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ [SessionStorage] REMOVE 실패:', error);
      return false;
    }
  },

  /**
   * 세션 스토리지 전체 삭제
   */
  clear: () => {
    try {
      sessionStorage.clear();
      console.log('📦 [SessionStorage] CLEAR: 모든 데이터 삭제');
      return true;
    } catch (error) {
      console.error('❌ [SessionStorage] CLEAR 실패:', error);
      return false;
    }
  }
};

/**
 * 통합 저장소 인터페이스
 * 저장소 타입을 명시적으로 선택 가능
 */
export const BrowserStorage = {
  /**
   * 데이터 저장
   * @param {string} key - 키
   * @param {*} value - 값
   * @param {Object} options - 옵션
   * @param {string} options.type - 저장소 타입 (cookie, local, session)
   * @param {number} options.days - 쿠키 만료 기간
   * @param {boolean} options.secure - Secure 속성
   */
  set: (key, value, options = {}) => {
    const { type = 'local' } = options;

    switch (type) {
      case 'cookie':
        return CookieStorage.set(key, value, options);
      case 'session':
        return SessionStorage.set(key, value);
      case 'local':
      default:
        return LocalStorage.set(key, value, options);
    }
  },

  /**
   * 데이터 가져오기
   * @param {string} key - 키
   * @param {Object} options - 옵션
   * @param {string} options.type - 저장소 타입
   * @param {*} options.defaultValue - 기본값
   */
  get: (key, options = {}) => {
    const { type = 'local', defaultValue = null } = options;

    switch (type) {
      case 'cookie':
        return CookieStorage.get(key) || defaultValue;
      case 'session':
        return SessionStorage.get(key, defaultValue);
      case 'local':
      default:
        return LocalStorage.get(key, defaultValue);
    }
  },

  /**
   * 데이터 삭제
   * @param {string} key - 키
   * @param {Object} options - 옵션
   * @param {string} options.type - 저장소 타입
   */
  remove: (key, options = {}) => {
    const { type = 'local' } = options;

    switch (type) {
      case 'cookie':
        return CookieStorage.remove(key);
      case 'session':
        return SessionStorage.remove(key);
      case 'local':
      default:
        return LocalStorage.remove(key);
    }
  },

  /**
   * 모든 저장소 삭제
   */
  clearAll: () => {
    CookieStorage.clear();
    LocalStorage.clear();
    SessionStorage.clear();
    console.log('🧹 [BrowserStorage] 모든 저장소 삭제');
  }
};

export default BrowserStorage;

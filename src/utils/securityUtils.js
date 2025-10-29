// src/utils/securityUtils.js
// XSS, CSRF 및 기타 보안 위협 방어 유틸리티

import { CSRFToken } from './cryptoUtils';

/**
 * XSS (Cross-Site Scripting) 방어 유틸리티
 */
export const XSSProtection = {
  /**
   * HTML 특수 문자 이스케이프
   * @param {string} str - 이스케이프할 문자열
   * @returns {string} 이스케이프된 문자열
   */
  escapeHTML: (str) => {
    if (typeof str !== 'string') {
      return str;
    }

    const htmlEscapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };

    return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
  },

  /**
   * 사용자 입력 검증 및 정리
   * @param {string} input - 사용자 입력
   * @param {Object} options - 옵션
   * @param {boolean} options.allowHTML - HTML 허용 여부
   * @param {number} options.maxLength - 최대 길이
   * @returns {string} 정리된 입력
   */
  sanitizeInput: (input, options = {}) => {
    if (typeof input !== 'string') {
      return '';
    }

    const {
      allowHTML = false,
      maxLength = 10000
    } = options;

    let sanitized = input.trim();

    // 최대 길이 제한
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    // HTML 허용하지 않으면 이스케이프
    if (!allowHTML) {
      sanitized = XSSProtection.escapeHTML(sanitized);
    }

    // 위험한 스크립트 태그 제거
    sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, ''); // 인라인 이벤트 핸들러 제거
    sanitized = sanitized.replace(/javascript:/gi, ''); // javascript: URL 제거

    console.log('🛡️ [XSS] 입력 정리 완료');
    return sanitized;
  },

  /**
   * URL 검증
   * @param {string} url - 검증할 URL
   * @returns {boolean} 안전한 URL 여부
   */
  isValidURL: (url) => {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      const urlObj = new URL(url);

      // 허용된 프로토콜만 허용
      const allowedProtocols = ['http:', 'https:', 'mailto:'];
      if (!allowedProtocols.includes(urlObj.protocol)) {
        console.warn('⚠️ [XSS] 허용되지 않은 프로토콜:', urlObj.protocol);
        return false;
      }

      // javascript:, data: 등 위험한 URL 차단
      if (url.toLowerCase().includes('javascript:') ||
          url.toLowerCase().includes('data:')) {
        console.warn('⚠️ [XSS] 위험한 URL 감지');
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  /**
   * 안전한 innerHTML 설정
   * @param {HTMLElement} element - DOM 엘리먼트
   * @param {string} html - HTML 문자열
   */
  setInnerHTML: (element, html) => {
    if (!element) {
      return;
    }

    // HTML 정리
    const sanitized = XSSProtection.sanitizeInput(html, { allowHTML: false });
    element.textContent = sanitized; // innerHTML 대신 textContent 사용

    console.log('🛡️ [XSS] 안전한 innerHTML 설정');
  }
};

/**
 * CSRF (Cross-Site Request Forgery) 방어 유틸리티
 */
export const CSRFProtection = {
  /**
   * CSRF 토큰 초기화
   */
  initialize: () => {
    if (!CSRFToken.get()) {
      CSRFToken.generate();
      console.log('🛡️ [CSRF] 토큰 초기화');
    }
  },

  /**
   * HTTP 요청에 CSRF 토큰 추가
   * @param {Object} headers - HTTP 헤더
   * @returns {Object} CSRF 토큰이 추가된 헤더
   */
  addTokenToHeaders: (headers = {}) => {
    const token = CSRFToken.get();
    if (!token) {
      console.warn('⚠️ [CSRF] 토큰이 없습니다. 먼저 초기화하세요.');
      return headers;
    }

    return {
      ...headers,
      'X-CSRF-Token': token
    };
  },

  /**
   * 폼에 CSRF 토큰 추가
   * @param {HTMLFormElement} form - 폼 엘리먼트
   */
  addTokenToForm: (form) => {
    if (!form) {
      return;
    }

    const token = CSRFToken.get();
    if (!token) {
      console.warn('⚠️ [CSRF] 토큰이 없습니다.');
      return;
    }

    // 기존 CSRF 토큰 필드 제거
    const existingField = form.querySelector('input[name="csrf_token"]');
    if (existingField) {
      existingField.remove();
    }

    // 새 CSRF 토큰 필드 추가
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'csrf_token';
    input.value = token;
    form.appendChild(input);

    console.log('🛡️ [CSRF] 폼에 토큰 추가');
  },

  /**
   * CSRF 토큰 검증
   * @param {string} token - 검증할 토큰
   * @returns {boolean} 검증 결과
   */
  validateToken: (token) => {
    return CSRFToken.validate(token);
  }
};

/**
 * 입력 검증 유틸리티
 */
export const InputValidation = {
  /**
   * 이메일 검증
   * @param {string} email - 이메일
   * @returns {boolean} 유효한 이메일 여부
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 비밀번호 강도 검증
   * @param {string} password - 비밀번호
   * @returns {Object} 검증 결과
   */
  validatePassword: (password) => {
    const result = {
      valid: true,
      errors: []
    };

    if (password.length < 8) {
      result.valid = false;
      result.errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
    }

    if (!/[A-Z]/.test(password)) {
      result.valid = false;
      result.errors.push('비밀번호는 최소 1개의 대문자를 포함해야 합니다.');
    }

    if (!/[a-z]/.test(password)) {
      result.valid = false;
      result.errors.push('비밀번호는 최소 1개의 소문자를 포함해야 합니다.');
    }

    if (!/[0-9]/.test(password)) {
      result.valid = false;
      result.errors.push('비밀번호는 최소 1개의 숫자를 포함해야 합니다.');
    }

    if (!/[!@#$%^&*]/.test(password)) {
      result.valid = false;
      result.errors.push('비밀번호는 최소 1개의 특수문자(!@#$%^&*)를 포함해야 합니다.');
    }

    return result;
  },

  /**
   * 사용자 이름 검증
   * @param {string} username - 사용자 이름
   * @returns {boolean} 유효한 사용자 이름 여부
   */
  isValidUsername: (username) => {
    // 3-20자, 영문자, 숫자, 언더스코어만 허용
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  /**
   * SQL Injection 패턴 감지
   * @param {string} input - 사용자 입력
   * @returns {boolean} SQL Injection 패턴 감지 여부
   */
  detectSQLInjection: (input) => {
    if (typeof input !== 'string') {
      return false;
    }

    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(;|\-\-|\/\*|\*\/|xp_|sp_)/i,
      /('|"|;|--|\/\*|\*\/)/
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        console.warn('⚠️ [Security] SQL Injection 패턴 감지');
        return true;
      }
    }

    return false;
  }
};

/**
 * Content Security Policy (CSP) 헬퍼
 */
export const CSPHelper = {
  /**
   * CSP 헤더 생성
   * @returns {Object} CSP 헤더
   */
  generateHeaders: () => {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self'",
        "frame-ancestors 'none'"
      ].join('; ')
    };
  }
};

/**
 * 세션 보안 유틸리티
 */
export const SessionSecurity = {
  /**
   * 세션 고정 공격 방어 - 로그인 시 세션 ID 재생성
   * @returns {string} 새로운 세션 ID
   */
  regenerateSessionId: () => {
    const newSessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    console.log('🔄 [Session] 세션 ID 재생성');
    return newSessionId;
  },

  /**
   * 세션 타임아웃 검사
   * @param {string} lastActivity - 마지막 활동 시간
   * @param {number} timeout - 타임아웃 시간 (밀리초)
   * @returns {boolean} 타임아웃 여부
   */
  isSessionExpired: (lastActivity, timeout = 30 * 60 * 1000) => {
    if (!lastActivity) {
      return true;
    }

    const now = Date.now();
    const lastActivityTime = new Date(lastActivity).getTime();
    const elapsed = now - lastActivityTime;

    return elapsed > timeout;
  }
};

/**
 * 보안 HTTP 요청 래퍼
 */
export const SecureRequest = {
  /**
   * 안전한 fetch 요청
   * @param {string} url - 요청 URL
   * @param {Object} options - fetch 옵션
   * @returns {Promise} fetch 결과
   */
  fetch: async (url, options = {}) => {
    // URL 검증
    if (!XSSProtection.isValidURL(url)) {
      throw new Error('유효하지 않은 URL입니다.');
    }

    // CSRF 토큰 추가
    const headers = CSRFProtection.addTokenToHeaders(options.headers);

    // 기본 보안 헤더 추가
    const secureHeaders = {
      ...headers,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    };

    const secureOptions = {
      ...options,
      headers: secureHeaders,
      credentials: 'same-origin' // CSRF 방어
    };

    console.log('🔒 [SecureRequest] 안전한 요청 전송:', url);

    try {
      const response = await fetch(url, secureOptions);
      return response;
    } catch (error) {
      console.error('❌ [SecureRequest] 요청 실패:', error);
      throw error;
    }
  }
};

/**
 * 데이터 마스킹 유틸리티
 */
export const DataMasking = {
  /**
   * 이메일 마스킹
   * @param {string} email - 이메일
   * @returns {string} 마스킹된 이메일
   */
  maskEmail: (email) => {
    if (!email || !email.includes('@')) {
      return '***';
    }

    const [local, domain] = email.split('@');
    const maskedLocal = local.substring(0, 2) + '***';
    return `${maskedLocal}@${domain}`;
  },

  /**
   * 전화번호 마스킹
   * @param {string} phone - 전화번호
   * @returns {string} 마스킹된 전화번호
   */
  maskPhone: (phone) => {
    if (!phone) {
      return '***';
    }

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 4) {
      return '***';
    }

    return cleaned.substring(0, 3) + '****' + cleaned.substring(cleaned.length - 4);
  },

  /**
   * 신용카드 번호 마스킹
   * @param {string} cardNumber - 신용카드 번호
   * @returns {string} 마스킹된 신용카드 번호
   */
  maskCardNumber: (cardNumber) => {
    if (!cardNumber) {
      return '****';
    }

    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length < 4) {
      return '****';
    }

    return '**** **** **** ' + cleaned.substring(cleaned.length - 4);
  }
};

export default {
  XSSProtection,
  CSRFProtection,
  InputValidation,
  CSPHelper,
  SessionSecurity,
  SecureRequest,
  DataMasking
};

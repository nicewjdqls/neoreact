// src/security/input/InputSanitizer.jsx
// 입력 정제 - XSS 공격 방지를 위한 입력값 정제

/**
 * InputSanitizer - 사용자 입력을 안전하게 정제
 * 
 * 주요 기능:
 * 1. HTML 태그 제거 또는 이스케이프
 * 2. JavaScript 이벤트 핸들러 제거
 * 3. 위험한 프로토콜 차단 (javascript:, data: 등)
 * 4. SQL 인젝션 패턴 탐지
 */

class InputSanitizer {
  /**
   * 🧹 기본 정제 - HTML 태그 완전 제거
   * 
   * @param {string} input - 정제할 입력값
   * @returns {string} 정제된 문자열
   * 
   * @example
   * sanitize("<script>alert('xss')</script>Hello")
   * // → "Hello"
   */
  static sanitize(input) {
    if (typeof input !== 'string') {
      return '';
    }

    // HTML 태그 완전 제거
    let cleaned = input.replace(/<[^>]*>/g, '');
    
    // 연속된 공백 정리
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  }

  /**
   * 🔒 HTML 이스케이프 - 태그를 문자로 변환
   * 
   * @param {string} input - 이스케이프할 입력값
   * @returns {string} 이스케이프된 문자열
   * 
   * @example
   * escapeHtml("<script>alert('xss')</script>")
   * // → "&lt;script&gt;alert('xss')&lt;/script&gt;"
   */
  static escapeHtml(input) {
    if (typeof input !== 'string') {
      return '';
    }

    const htmlEscapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };

    return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
  }

  /**
   * 🚫 위험한 패턴 제거
   * 
   * @param {string} input - 검사할 입력값
   * @returns {string} 위험 패턴이 제거된 문자열
   */
  static removeDangerousPatterns(input) {
    if (typeof input !== 'string') {
      return '';
    }

    let cleaned = input;

    // JavaScript 이벤트 핸들러 제거
    const dangerousEvents = [
      /on\w+\s*=/gi,           // onclick=, onerror= 등
      /javascript:/gi,         // javascript: 프로토콜
      /data:text\/html/gi,     // data: 프로토콜
      /vbscript:/gi,           // vbscript: 프로토콜
      /<script[\s\S]*?<\/script>/gi,  // script 태그
      /<iframe[\s\S]*?<\/iframe>/gi,  // iframe 태그
      /<object[\s\S]*?<\/object>/gi,  // object 태그
      /<embed[\s\S]*?>/gi,     // embed 태그
    ];

    dangerousEvents.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });

    return cleaned;
  }

  /**
   * 🔐 안전한 텍스트 (가장 강력)
   * HTML 태그 제거 + 특수문자 이스케이프 + 위험 패턴 제거
   * 
   * @param {string} input - 정제할 입력값
   * @returns {string} 완전히 정제된 안전한 문자열
   */
  static sanitizeStrict(input) {
    if (typeof input !== 'string') {
      return '';
    }

    // 1단계: 위험한 패턴 제거
    let cleaned = this.removeDangerousPatterns(input);
    
    // 2단계: HTML 태그 제거
    cleaned = this.sanitize(cleaned);
    
    // 3단계: 특수문자 이스케이프
    cleaned = this.escapeHtml(cleaned);
    
    return cleaned;
  }

  /**
   * 📧 이메일 검증 및 정제
   * 
   * @param {string} email - 검증할 이메일
   * @returns {string|null} 유효한 이메일 또는 null
   */
  static sanitizeEmail(email) {
    if (typeof email !== 'string') {
      return null;
    }

    // 공백 제거
    const cleaned = email.trim().toLowerCase();
    
    // 이메일 정규식
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    return emailRegex.test(cleaned) ? cleaned : null;
  }

  /**
   * 🔢 숫자만 추출
   * 
   * @param {string} input - 입력값
   * @returns {string} 숫자만 포함된 문자열
   */
  static sanitizeNumber(input) {
    if (typeof input !== 'string') {
      return '';
    }

    return input.replace(/[^0-9]/g, '');
  }

  /**
   * 📱 전화번호 정제
   * 
   * @param {string} phone - 전화번호
   * @returns {string} 정제된 전화번호 (숫자와 하이픈만)
   */
  static sanitizePhone(phone) {
    if (typeof input !== 'string') {
      return '';
    }

    // 숫자와 하이픈만 남기기
    return phone.replace(/[^0-9-]/g, '');
  }

  /**
   * 🌐 URL 검증 및 정제
   * 
   * @param {string} url - 검증할 URL
   * @returns {string|null} 안전한 URL 또는 null
   */
  static sanitizeUrl(url) {
    if (typeof url !== 'string') {
      return null;
    }

    const cleaned = url.trim();

    // 위험한 프로토콜 차단
    const dangerousProtocols = /^(javascript|data|vbscript):/i;
    if (dangerousProtocols.test(cleaned)) {
      console.warn('[InputSanitizer] 위험한 URL 프로토콜 차단:', cleaned);
      return null;
    }

    // 안전한 프로토콜만 허용
    const safeProtocolRegex = /^(https?|ftp):\/\//i;
    
    // 프로토콜이 없으면 https:// 추가
    if (!safeProtocolRegex.test(cleaned)) {
      return `https://${cleaned}`;
    }

    return cleaned;
  }

  /**
   * 🗂️ 파일명 정제
   * 
   * @param {string} filename - 파일명
   * @returns {string} 정제된 파일명
   */
  static sanitizeFilename(filename) {
    if (typeof filename !== 'string') {
      return 'untitled';
    }

    // 위험한 문자 제거 (경로 탐색 방지)
    let cleaned = filename.replace(/[<>:"/\\|?*\x00-\x1f]/g, '');
    
    // .. (상위 디렉토리 접근) 제거
    cleaned = cleaned.replace(/\.\./g, '');
    
    // 공백을 언더스코어로
    cleaned = cleaned.replace(/\s+/g, '_');
    
    return cleaned || 'untitled';
  }

  /**
   * 🔍 SQL 인젝션 패턴 탐지
   * 
   * @param {string} input - 검사할 입력값
   * @returns {boolean} SQL 인젝션 의심 여부
   */
  static detectSqlInjection(input) {
    if (typeof input !== 'string') {
      return false;
    }

    // SQL 인젝션 의심 패턴
    const sqlPatterns = [
      /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bDROP\b|\bUPDATE\b)/i,
      /--/,                    // SQL 주석
      /\/\*/,                  // 주석 시작
      /;/,                     // 명령 종료
      /'\s*OR\s*'1'\s*=\s*'1/i,  // 전형적인 OR 1=1
      /'\s*OR\s*1\s*=\s*1/i
    ];

    const isSuspicious = sqlPatterns.some(pattern => pattern.test(input));

    if (isSuspicious) {
      console.warn('[InputSanitizer] ⚠️ SQL 인젝션 의심 입력 감지:', input);
    }

    return isSuspicious;
  }

  /**
   * 📝 입력 길이 제한
   * 
   * @param {string} input - 입력값
   * @param {number} maxLength - 최대 길이
   * @returns {string} 제한된 길이의 문자열
   */
  static limitLength(input, maxLength = 1000) {
    if (typeof input !== 'string') {
      return '';
    }

    if (input.length > maxLength) {
      console.warn(`[InputSanitizer] 입력 길이 초과 (${input.length} > ${maxLength})`);
      return input.substring(0, maxLength);
    }

    return input;
  }

  /**
   * 🎯 통합 정제 - 여러 검증을 한 번에
   * 
   * @param {string} input - 정제할 입력값
   * @param {Object} options - 옵션
   * @returns {Object} { value, isValid, warnings }
   */
  static sanitizeWithValidation(input, options = {}) {
    const {
      maxLength = 1000,
      allowHtml = false,
      checkSql = true,
      type = 'text' // 'text', 'email', 'url', 'number'
    } = options;

    const warnings = [];
    let cleaned = input;

    // 타입 체크
    if (typeof input !== 'string') {
      return { value: '', isValid: false, warnings: ['입력값이 문자열이 아닙니다'] };
    }

    // 길이 제한
    if (cleaned.length > maxLength) {
      cleaned = this.limitLength(cleaned, maxLength);
      warnings.push(`입력 길이가 ${maxLength}자로 제한되었습니다`);
    }

    // SQL 인젝션 체크
    if (checkSql && this.detectSqlInjection(cleaned)) {
      warnings.push('위험한 SQL 패턴이 감지되었습니다');
      return { value: '', isValid: false, warnings };
    }

    // 타입별 정제
    switch (type) {
      case 'email':
        cleaned = this.sanitizeEmail(cleaned);
        if (!cleaned) {
          warnings.push('유효하지 않은 이메일 형식입니다');
          return { value: '', isValid: false, warnings };
        }
        break;

      case 'url':
        cleaned = this.sanitizeUrl(cleaned);
        if (!cleaned) {
          warnings.push('유효하지 않은 URL입니다');
          return { value: '', isValid: false, warnings };
        }
        break;

      case 'number':
        cleaned = this.sanitizeNumber(cleaned);
        break;

      default:
        // text
        if (allowHtml) {
          cleaned = this.escapeHtml(cleaned);
        } else {
          cleaned = this.sanitizeStrict(cleaned);
        }
    }

    return {
      value: cleaned,
      isValid: true,
      warnings
    };
  }
}

export default InputSanitizer;


// ========================================
// 🎯 사용 예시
// ========================================

/**
 * 1. 기본 사용 - HTML 태그 제거
 */
// const userInput = "<script>alert('xss')</script>안녕하세요";
// const cleaned = InputSanitizer.sanitize(userInput);
// console.log(cleaned); // → "안녕하세요"

/**
 * 2. HTML 이스케이프 - 태그를 문자로
 */
// const comment = "<b>강조</b> 텍스트";
// const escaped = InputSanitizer.escapeHtml(comment);
// console.log(escaped); // → "&lt;b&gt;강조&lt;/b&gt; 텍스트"

/**
 * 3. 가장 강력한 정제
 */
// const dangerous = "<script>alert('xss')</script><img src=x onerror='alert(1)'>";
// const safe = InputSanitizer.sanitizeStrict(dangerous);
// console.log(safe); // → "" (모두 제거됨)

/**
 * 4. 이메일 검증
 */
// const email = InputSanitizer.sanitizeEmail("  USER@EXAMPLE.COM  ");
// console.log(email); // → "user@example.com"
// 
// const invalid = InputSanitizer.sanitizeEmail("invalid-email");
// console.log(invalid); // → null

/**
 * 5. URL 검증
 */
// const url = InputSanitizer.sanitizeUrl("example.com");
// console.log(url); // → "https://example.com"
// 
// const dangerous = InputSanitizer.sanitizeUrl("javascript:alert('xss')");
// console.log(dangerous); // → null (차단됨)

/**
 * 6. SQL 인젝션 탐지
 */
// const suspicious = "admin' OR '1'='1";
// const isSql = InputSanitizer.detectSqlInjection(suspicious);
// console.log(isSql); // → true

/**
 * 7. React 컴포넌트에서 사용
 */
// import InputSanitizer from './InputSanitizer';
// 
// const CommentForm = () => {
//   const [comment, setComment] = useState('');
// 
//   const handleSubmit = () => {
//     const cleaned = InputSanitizer.sanitizeStrict(comment);
//     // 서버로 전송
//     submitComment(cleaned);
//   };
// 
//   return (
//     <form onSubmit={handleSubmit}>
//       <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
//       <button type="submit">등록</button>
//     </form>
//   );
// };

/**
 * 8. 통합 검증
 */
// const result = InputSanitizer.sanitizeWithValidation(
//   userInput,
//   {
//     maxLength: 500,
//     allowHtml: false,
//     checkSql: true,
//     type: 'text'
//   }
// );
// 
// if (result.isValid) {
//   console.log('정제된 값:', result.value);
// } else {
//   console.log('경고:', result.warnings);
// }
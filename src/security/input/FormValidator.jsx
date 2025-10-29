// src/security/input/FormValidator.jsx
// 폼 데이터 검증 - 여러 필드를 한 번에 검증

import { useState, useCallback } from 'react';
import InputSanitizer from './InputSanitizer';

/**
 * FormValidator - 폼 필드 검증 유틸리티
 * 
 * 주요 기능:
 * 1. 필드별 검증 규칙 설정
 * 2. 실시간 검증
 * 3. 에러 메시지 관리
 * 4. 커스텀 검증 규칙
 */

/**
 * 🎯 검증 규칙 정의
 */
const ValidationRules = {
  // 필수 입력
  required: (value, message = '필수 입력 항목입니다') => {
    if (!value || value.trim() === '') {
      return message;
    }
    return null;
  },

  // 최소 길이
  minLength: (value, min, message = `최소 ${min}자 이상 입력해주세요`) => {
    if (value && value.length < min) {
      return message;
    }
    return null;
  },

  // 최대 길이
  maxLength: (value, max, message = `최대 ${max}자까지 입력 가능합니다`) => {
    if (value && value.length > max) {
      return message;
    }
    return null;
  },

  // 이메일 형식
  email: (value, message = '올바른 이메일 형식이 아닙니다') => {
    if (!value) return null;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  // 전화번호 형식 (한국)
  phone: (value, message = '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)') => {
    if (!value) return null;
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(value)) {
      return message;
    }
    return null;
  },

  // 숫자만
  numeric: (value, message = '숫자만 입력 가능합니다') => {
    if (!value) return null;
    if (!/^\d+$/.test(value)) {
      return message;
    }
    return null;
  },

  // 영문만
  alpha: (value, message = '영문자만 입력 가능합니다') => {
    if (!value) return null;
    if (!/^[a-zA-Z]+$/.test(value)) {
      return message;
    }
    return null;
  },

  // 영문 + 숫자
  alphaNumeric: (value, message = '영문자와 숫자만 입력 가능합니다') => {
    if (!value) return null;
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return message;
    }
    return null;
  },

  // URL 형식
  url: (value, message = '올바른 URL 형식이 아닙니다') => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },

  // 비밀번호 강도
  password: (value, message = '비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다') => {
    if (!value) return null;
    const hasMinLength = value.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasMinLength || !hasLetter || !hasNumber || !hasSpecial) {
      return message;
    }
    return null;
  },

  // 비밀번호 확인 일치
  matches: (value, compareValue, message = '입력값이 일치하지 않습니다') => {
    if (value !== compareValue) {
      return message;
    }
    return null;
  },

  // 날짜 형식 (YYYY-MM-DD)
  date: (value, message = '올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)') => {
    if (!value) return null;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return message;
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return message;
    }
    return null;
  },

  // 최소값
  min: (value, min, message = `최소값은 ${min}입니다`) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num < min) {
      return message;
    }
    return null;
  },

  // 최대값
  max: (value, max, message = `최대값은 ${max}입니다`) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num > max) {
      return message;
    }
    return null;
  },

  // 범위
  range: (value, min, max, message = `${min}~${max} 사이의 값을 입력해주세요`) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num) || num < min || num > max) {
      return message;
    }
    return null;
  }
};

/**
 * 🎣 useFormValidator Hook
 * 
 * @param {Object} initialValues - 초기값
 * @param {Object} validationRules - 검증 규칙
 * @returns {Object} 폼 상태 및 메서드
 */
export const useFormValidator = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 단일 필드 검증
  const validateField = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    // XSS 체크
    if (InputSanitizer.detectSqlInjection(value)) {
      return '위험한 입력 패턴이 감지되었습니다';
    }

    // 규칙 배열 처리
    if (Array.isArray(rules)) {
      for (const rule of rules) {
        const error = executeRule(rule, value, values);
        if (error) return error;
      }
    } else {
      // 단일 규칙
      const error = executeRule(rules, value, values);
      if (error) return error;
    }

    return null;
  }, [validationRules, values]);

  // 규칙 실행
  const executeRule = (rule, value, allValues) => {
    if (typeof rule === 'function') {
      // 커스텀 검증 함수
      return rule(value, allValues);
    }

    if (typeof rule === 'object') {
      // 규칙 객체 { type, params, message }
      const { type, params = [], message } = rule;
      const validator = ValidationRules[type];
      
      if (validator) {
        return validator(value, ...params, message);
      }
    }

    if (typeof rule === 'string') {
      // 규칙 이름만 (예: 'required', 'email')
      const validator = ValidationRules[rule];
      if (validator) {
        return validator(value);
      }
    }

    return null;
  };

  // 전체 폼 검증
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName] || '');
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  // 값 변경 핸들러
  const handleChange = useCallback((fieldName) => (e) => {
    const value = e.target.value;
    
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // 이미 터치된 필드는 실시간 검증
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
    }
  }, [touched, validateField]);

  // Blur 핸들러
  const handleBlur = useCallback((fieldName) => () => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    const error = validateField(fieldName, values[fieldName] || '');
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, [values, validateField]);

  // 제출 핸들러
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 모든 필드를 터치된 것으로 표시
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // 전체 검증
    const isValid = validateForm();

    if (isValid && onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('[FormValidator] 제출 오류:', error);
      }
    }

    setIsSubmitting(false);
  }, [values, validationRules, validateForm]);

  // 초기화
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // 필드 값 설정
  const setFieldValue = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  // 필드 에러 설정
  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateForm,
    reset,
    setFieldValue,
    setFieldError
  };
};

/**
 * 📝 ValidatedInput 컴포넌트
 */
export const ValidatedInput = ({
  name,
  label,
  error,
  touched,
  ...props
}) => {
  const showError = touched && error;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          fontSize: '0.875rem',
          color: '#374151'
        }}>
          {label}
        </label>
      )}
      <input
        {...props}
        name={name}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: `2px solid ${showError ? '#ef4444' : '#d1d5db'}`,
          borderRadius: '8px',
          fontSize: '1rem',
          transition: 'border-color 0.2s',
          ...props.style
        }}
      />
      {showError && (
        <div style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#ef4444'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

/**
 * 📝 ValidatedTextarea 컴포넌트
 */
export const ValidatedTextarea = ({
  name,
  label,
  error,
  touched,
  ...props
}) => {
  const showError = touched && error;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          fontSize: '0.875rem',
          color: '#374151'
        }}>
          {label}
        </label>
      )}
      <textarea
        {...props}
        name={name}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: `2px solid ${showError ? '#ef4444' : '#d1d5db'}`,
          borderRadius: '8px',
          fontSize: '1rem',
          transition: 'border-color 0.2s',
          minHeight: '120px',
          resize: 'vertical',
          ...props.style
        }}
      />
      {showError && (
        <div style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#ef4444'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default {
  useFormValidator,
  ValidatedInput,
  ValidatedTextarea,
  ValidationRules
};



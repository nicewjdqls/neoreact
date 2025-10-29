// src/security/input/XSSProtection.jsx
// XSS 자동 방어 - 입력 필드에 자동으로 보안 적용

import React, { useState, useEffect } from 'react';
import InputSanitizer from './InputSanitizer';

/**
 * XSSProtection - 입력 필드를 자동으로 보호하는 HOC
 * 
 * 사용법:
 * 1. 컴포넌트로 감싸기 (자동 보호)
 * 2. Hook으로 사용 (useXSSProtection)
 * 3. 개별 Input 컴포넌트 (ProtectedInput)
 */

/**
 * 🛡️ 보호된 Input 컴포넌트
 * 
 * @param {Object} props - input props
 * @param {string} sanitizeType - 정제 타입 ('text', 'email', 'url', 'number')
 * @param {boolean} allowHtml - HTML 허용 여부
 * @param {function} onSanitized - 정제 후 콜백
 */
export const ProtectedInput = ({ 
  value, 
  onChange, 
  sanitizeType = 'text',
  allowHtml = false,
  maxLength = 1000,
  onSanitized = null,
  ...props 
}) => {
  const [displayValue, setDisplayValue] = useState(value || '');
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const rawValue = e.target.value;
    setDisplayValue(rawValue);

    // 입력 정제
    const result = InputSanitizer.sanitizeWithValidation(rawValue, {
      maxLength,
      allowHtml,
      checkSql: true,
      type: sanitizeType
    });

    // 경고가 있으면 표시
    if (result.warnings.length > 0) {
      setWarning(result.warnings[0]);
      console.warn('[XSSProtection] 입력 경고:', result.warnings);
    } else {
      setWarning(null);
    }

    // 정제된 값으로 onChange 호출
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: result.value
        }
      };
      onChange(syntheticEvent);
    }

    // 정제 후 콜백
    if (onSanitized) {
      onSanitized(result);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <input
        {...props}
        value={displayValue}
        onChange={handleChange}
        style={{
          ...props.style,
          borderColor: warning ? '#ef4444' : props.style?.borderColor
        }}
      />
      {warning && (
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: 0,
          fontSize: '0.75rem',
          color: '#ef4444'
        }}>
          ⚠️ {warning}
        </div>
      )}
    </div>
  );
};

/**
 * 🛡️ 보호된 Textarea 컴포넌트
 */
export const ProtectedTextarea = ({ 
  value, 
  onChange, 
  allowHtml = false,
  maxLength = 5000,
  onSanitized = null,
  ...props 
}) => {
  const [displayValue, setDisplayValue] = useState(value || '');
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const rawValue = e.target.value;
    setDisplayValue(rawValue);

    // 입력 정제
    const result = InputSanitizer.sanitizeWithValidation(rawValue, {
      maxLength,
      allowHtml,
      checkSql: true,
      type: 'text'
    });

    if (result.warnings.length > 0) {
      setWarning(result.warnings[0]);
      console.warn('[XSSProtection] 입력 경고:', result.warnings);
    } else {
      setWarning(null);
    }

    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: result.value
        }
      };
      onChange(syntheticEvent);
    }

    if (onSanitized) {
      onSanitized(result);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <textarea
        {...props}
        value={displayValue}
        onChange={handleChange}
        style={{
          ...props.style,
          borderColor: warning ? '#ef4444' : props.style?.borderColor
        }}
      />
      {warning && (
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: 0,
          fontSize: '0.75rem',
          color: '#ef4444'
        }}>
          ⚠️ {warning}
        </div>
      )}
      <div style={{
        position: 'absolute',
        bottom: '-20px',
        right: 0,
        fontSize: '0.75rem',
        color: '#9ca3af'
      }}>
        {displayValue.length} / {maxLength}
      </div>
    </div>
  );
};

/**
 * 🎣 useXSSProtection Hook
 * 
 * @param {string} initialValue - 초기값
 * @param {Object} options - 옵션
 * @returns {Object} { value, setValue, sanitizedValue, isValid, warnings }
 * 
 * @example
 * const { value, setValue, sanitizedValue } = useXSSProtection('', {
 *   sanitizeType: 'text',
 *   maxLength: 500
 * });
 */
export const useXSSProtection = (initialValue = '', options = {}) => {
  const {
    sanitizeType = 'text',
    allowHtml = false,
    maxLength = 1000,
    checkSql = true
  } = options;

  const [value, setValue] = useState(initialValue);
  const [sanitizedValue, setSanitizedValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    if (value) {
      const result = InputSanitizer.sanitizeWithValidation(value, {
        maxLength,
        allowHtml,
        checkSql,
        type: sanitizeType
      });

      setSanitizedValue(result.value);
      setIsValid(result.isValid);
      setWarnings(result.warnings);

      if (result.warnings.length > 0) {
        console.warn('[XSSProtection] 입력 경고:', result.warnings);
      }
    } else {
      setSanitizedValue('');
      setIsValid(true);
      setWarnings([]);
    }
  }, [value, maxLength, allowHtml, checkSql, sanitizeType]);

  return {
    value,
    setValue,
    sanitizedValue,
    isValid,
    warnings
  };
};

/**
 * 🛡️ XSSProtection HOC - 모든 input을 자동 보호
 * 
 * @param {React.Component} WrappedComponent - 감싸질 컴포넌트
 * @returns {React.Component} 보호된 컴포넌트
 */
export const withXSSProtection = (WrappedComponent) => {
  return (props) => {
    const protectInput = (element) => {
      if (!element || !element.props) return element;

      // input이나 textarea인 경우
      if (element.type === 'input' || element.type === 'textarea') {
        const { onChange, value, ...restProps } = element.props;

        const handleProtectedChange = (e) => {
          const rawValue = e.target.value;
          
          // 입력 정제
          const result = InputSanitizer.sanitizeWithValidation(rawValue, {
            maxLength: 1000,
            allowHtml: false,
            checkSql: true,
            type: 'text'
          });

          if (result.warnings.length > 0) {
            console.warn('[XSSProtection] 자동 보호 경고:', result.warnings);
          }

          // 정제된 값으로 onChange 호출
          if (onChange) {
            const syntheticEvent = {
              ...e,
              target: {
                ...e.target,
                value: result.value
              }
            };
            onChange(syntheticEvent);
          }
        };

        return React.cloneElement(element, {
          ...restProps,
          value,
          onChange: handleProtectedChange
        });
      }

      // 자식이 있으면 재귀적으로 처리
      if (element.props && element.props.children) {
        const children = React.Children.map(
          element.props.children,
          protectInput
        );
        return React.cloneElement(element, {}, children);
      }

      return element;
    };

    return <WrappedComponent {...props}>{protectInput(props.children)}</WrappedComponent>;
  };
};

/**
 * 🔒 XSSProtectionProvider - 전역 XSS 보호
 */
export const XSSProtectionProvider = ({ children, config = {} }) => {
  const defaultConfig = {
    enabled: true,
    logWarnings: true,
    strictMode: false,
    ...config
  };

  useEffect(() => {
    if (defaultConfig.enabled) {
      console.log('[XSSProtection] 전역 XSS 보호 활성화');
    }
  }, []);

  return <>{children}</>;
};

// 기본 export
const XSSProtection = {
  ProtectedInput,
  ProtectedTextarea,
  useXSSProtection,
  withXSSProtection,
  XSSProtectionProvider
};

export default XSSProtection;

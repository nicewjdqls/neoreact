// src/security/input/FileUploadValidator.jsx
// 파일 업로드 검증 - 악성 파일 차단, 타입/크기 검증

import React, { useState, useCallback } from 'react';
import { Upload, File, AlertTriangle, CheckCircle, X } from 'lucide-react';

/**
 * FileUploadValidator - 파일 업로드 보안 검증
 * 
 * 주요 기능:
 * 1. 파일 타입 검증 (MIME type + 확장자)
 * 2. 파일 크기 제한
 * 3. 악성 파일 패턴 감지
 * 4. 이미지 파일 추가 검증
 * 5. 다중 파일 업로드 지원
 */

/**
 * 🔒 파일 검증 유틸리티
 */
class FileValidator {
  // 허용된 MIME 타입 (기본값)
  static ALLOWED_TYPES = {
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    videos: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg']
  };

  // 위험한 확장자 (실행 파일 등)
  static DANGEROUS_EXTENSIONS = [
    'exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js', 
    'jar', 'msi', 'dll', 'sh', 'app', 'deb', 'rpm'
  ];

  // 악성 파일 시그니처 (매직 넘버)
  static MAGIC_NUMBERS = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46],
    'application/pdf': [0x25, 0x50, 0x44, 0x46],
    'application/zip': [0x50, 0x4B, 0x03, 0x04]
  };

  /**
   * 🔍 파일 타입 검증
   */
  static validateType(file, allowedTypes) {
    if (!allowedTypes || allowedTypes.length === 0) {
      return { valid: true };
    }

    // MIME 타입 체크
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `허용되지 않는 파일 형식입니다. 허용: ${allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * 📏 파일 크기 검증
   */
  static validateSize(file, maxSize) {
    if (!maxSize) {
      return { valid: true };
    }

    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `파일 크기가 너무 큽니다 (${fileSizeMB}MB / ${maxSizeMB}MB)`
      };
    }

    return { valid: true };
  }

  /**
   * 🚫 위험한 확장자 검증
   */
  static validateExtension(file) {
    const extension = file.name.split('.').pop().toLowerCase();

    if (this.DANGEROUS_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        error: `보안상 위험한 파일 형식입니다 (.${extension})`
      };
    }

    return { valid: true };
  }

  /**
   * 🔐 매직 넘버 검증 (실제 파일 타입 확인)
   */
  static async validateMagicNumber(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const arr = new Uint8Array(e.target.result).slice(0, 4);
        const expectedMagic = this.MAGIC_NUMBERS[file.type];

        if (!expectedMagic) {
          // 매직 넘버가 정의되지 않은 타입은 통과
          resolve({ valid: true });
          return;
        }

        // 매직 넘버 비교
        const isValid = expectedMagic.every((byte, index) => byte === arr[index]);

        if (!isValid) {
          resolve({
            valid: false,
            error: '파일 내용이 파일 확장자와 일치하지 않습니다 (위장 파일 의심)'
          });
        } else {
          resolve({ valid: true });
        }
      };

      reader.onerror = () => {
        resolve({
          valid: false,
          error: '파일을 읽을 수 없습니다'
        });
      };

      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  }

  /**
   * 🖼️ 이미지 파일 추가 검증
   */
  static async validateImage(file, options = {}) {
    const { maxWidth = 4000, maxHeight = 4000 } = options;

    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        if (img.width > maxWidth || img.height > maxHeight) {
          resolve({
            valid: false,
            error: `이미지 크기가 너무 큽니다 (최대: ${maxWidth}x${maxHeight}px)`
          });
        } else {
          resolve({ valid: true });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          valid: false,
          error: '유효하지 않은 이미지 파일입니다'
        });
      };

      img.src = url;
    });
  }

  /**
   * 🎯 통합 검증
   */
  static async validate(file, options = {}) {
    const {
      allowedTypes = [],
      maxSize = null,
      checkMagicNumber = true,
      imageOptions = {}
    } = options;

    console.log('🔍 [FileValidator] 파일 검증 시작:', file.name);

    // 1. 확장자 검증
    const extResult = this.validateExtension(file);
    if (!extResult.valid) {
      console.warn('❌ [FileValidator] 확장자 검증 실패');
      return extResult;
    }

    // 2. 타입 검증
    const typeResult = this.validateType(file, allowedTypes);
    if (!typeResult.valid) {
      console.warn('❌ [FileValidator] 타입 검증 실패');
      return typeResult;
    }

    // 3. 크기 검증
    const sizeResult = this.validateSize(file, maxSize);
    if (!sizeResult.valid) {
      console.warn('❌ [FileValidator] 크기 검증 실패');
      return sizeResult;
    }

    // 4. 매직 넘버 검증
    if (checkMagicNumber) {
      const magicResult = await this.validateMagicNumber(file);
      if (!magicResult.valid) {
        console.warn('❌ [FileValidator] 매직 넘버 검증 실패');
        return magicResult;
      }
    }

    // 5. 이미지 추가 검증
    if (file.type.startsWith('image/')) {
      const imageResult = await this.validateImage(file, imageOptions);
      if (!imageResult.valid) {
        console.warn('❌ [FileValidator] 이미지 검증 실패');
        return imageResult;
      }
    }

    console.log('✅ [FileValidator] 파일 검증 성공');
    return { valid: true };
  }
}

/**
 * 📎 FileUploadValidator 컴포넌트
 */
const FileUploadValidator = ({
  allowedTypes = FileValidator.ALLOWED_TYPES.images,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 1,
  checkMagicNumber = true,
  imageOptions = { maxWidth: 4000, maxHeight: 4000 },
  onFilesChange = null,
  onError = null
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // 파일 검증 및 추가
  const validateAndAddFiles = useCallback(async (fileList) => {
    const newFiles = Array.from(fileList);

    // 최대 파일 개수 체크
    if (files.length + newFiles.length > maxFiles) {
      const error = `최대 ${maxFiles}개의 파일만 업로드 가능합니다`;
      if (onError) onError(error);
      return;
    }

    const validatedFiles = [];

    for (const file of newFiles) {
      const result = await FileValidator.validate(file, {
        allowedTypes,
        maxSize,
        checkMagicNumber,
        imageOptions
      });

      if (result.valid) {
        validatedFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        });
      } else {
        if (onError) {
          onError(`${file.name}: ${result.error}`);
        }
      }
    }

    if (validatedFiles.length > 0) {
      const updatedFiles = [...files, ...validatedFiles];
      setFiles(updatedFiles);
      
      if (onFilesChange) {
        onFilesChange(updatedFiles.map(f => f.file));
      }
    }
  }, [files, maxFiles, allowedTypes, maxSize, checkMagicNumber, imageOptions, onFilesChange, onError]);

  // 파일 선택 핸들러
  const handleFileSelect = useCallback((e) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      validateAndAddFiles(fileList);
    }
  }, [validateAndAddFiles]);

  // 드래그 앤 드롭
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const fileList = e.dataTransfer.files;
    if (fileList && fileList.length > 0) {
      validateAndAddFiles(fileList);
    }
  }, [validateAndAddFiles]);

  // 파일 제거
  const handleRemoveFile = useCallback((id) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);

    if (onFilesChange) {
      onFilesChange(updatedFiles.map(f => f.file));
    }

    // 미리보기 URL 해제
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  }, [files, onFilesChange]);

  // 파일 크기 포맷
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div style={{ width: '100%' }}>
      {/* 업로드 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#6366f1' : '#d1d5db'}`,
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.05)' : '#f9fafb',
          transition: 'all 0.3s'
        }}
      >
        <input
          type="file"
          id="file-upload"
          multiple={maxFiles > 1}
          onChange={handleFileSelect}
          accept={allowedTypes.join(',')}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <Upload size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
          <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            파일을 드래그하거나 클릭하여 업로드
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            최대 {formatFileSize(maxSize)} | {maxFiles}개까지 가능
          </div>
        </label>
      </div>

      {/* 파일 목록 */}
      {files.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          {files.map((fileItem) => (
            <div
              key={fileItem.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '0.75rem',
                backgroundColor: '#fff'
              }}
            >
              {/* 미리보기 또는 아이콘 */}
              {fileItem.preview ? (
                <img
                  src={fileItem.preview}
                  alt={fileItem.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    marginRight: '1rem'
                  }}
                />
              ) : (
                <File size={48} style={{ marginRight: '1rem', color: '#9ca3af' }} />
              )}

              {/* 파일 정보 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  {fileItem.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {formatFileSize(fileItem.size)} • {fileItem.type}
                </div>
              </div>

              {/* 상태 및 삭제 버튼 */}
              <CheckCircle size={20} style={{ color: '#10b981', marginRight: '0.75rem' }} />
              <button
                onClick={() => handleRemoveFile(fileItem.id)}
                style={{
                  padding: '0.5rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#ef4444'
                }}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadValidator;
export { FileValidator };


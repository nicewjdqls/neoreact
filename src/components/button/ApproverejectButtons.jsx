import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from 'react-bootstrap';

// 승인 버튼
export const ApproveButton = ({ onClick, disabled = false, children = '승인' }) => {
  const buttonStyle = {
    padding: '0.625rem 1.25rem',
    fontSize: '0.9375rem',
    fontWeight: '600',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    color: '#fff',
    opacity: disabled ? 0.6 : 1,
    minWidth: '100px',
    justifyContent: 'center'
  };

  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
    >
      <CheckCircle size={16} />
      {children}
    </Button>
  );
};

// 반려 버튼
export const RejectButton = ({ onClick, disabled = false, children = '반려' }) => {
  const buttonStyle = {
    padding: '0.625rem 1.25rem',
    fontSize: '0.9375rem',
    fontWeight: '600',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    opacity: disabled ? 0.6 : 1,
    minWidth: '100px',
    justifyContent: 'center'
  };

  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
    >
      <XCircle size={16} />
      {children}
    </Button>
  );
};
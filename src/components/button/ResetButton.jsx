import React from 'react';
import { Button } from 'react-bootstrap';

const ResetButton = ({ onClick, disabled = false, children = '초기화' }) => {
  const buttonStyle = {
    padding: '0.625rem 1.25rem',
    fontSize: '0.9375rem',
    fontWeight: '600',
    borderRadius: '0.5rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
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
      {children}
    </Button>
  );
};

export default ResetButton;
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from 'react-bootstrap';

const DeleteButton = ({ onClick, disabled = false, children = '삭제' }) => {
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
      <Trash2 size={16} />
      {children}
    </Button>
  );
};

export default DeleteButton;
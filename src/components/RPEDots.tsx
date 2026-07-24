import React from 'react';

interface RPEDotsProps {
  value: number;
  max?: number;
  size?: number;
}

const ORANGE = '#FF6B35';
const GRAY = '#E0E0E0';

const dotStyle: React.CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: '50%',
  marginRight: 4,
  transition: 'background-color 0.2s',
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#999',
  marginLeft: 4,
};

const RPEDots: React.FC<RPEDotsProps> = ({ value, max = 10, size }) => {
  const dots: React.ReactElement[] = [];
  for (let i = 1; i <= max; i++) {
    const filled = i <= value;
    const adjustedSize = size || 20;
    dots.push(
      <div
        key={i}
        style={{
          ...dotStyle,
          width: adjustedSize,
          height: adjustedSize,
          backgroundColor: filled ? ORANGE : GRAY,
        }}
      />
    );
  }
  return (
    <div style={containerStyle}>
      {dots}
      <span style={labelStyle}>{value}/{max}</span>
    </div>
  );
};

export default RPEDots;

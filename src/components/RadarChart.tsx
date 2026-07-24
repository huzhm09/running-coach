import React from 'react';

interface RadarChartProps {
  data: {
    endurance: number;
    speed: number;
    strength: number;
    recovery: number;
    mileage: number;
  };
  size?: number;
  maxValue?: number;
}

const LABELS = ['耐力', '速度', '力量', '恢复', '跑量'];
const ORANGE = '#FF6B35';
const LIGHT_ORANGE = 'rgba(255, 107, 53, 0.15)';
const GRID_COLOR = '#E8E8E8';
const LABEL_COLOR = '#666';
const STROKE_WIDTH = 2;

const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 200,
  maxValue = 100,
}) => {
  const values = [
    data.endurance,
    data.speed,
    data.strength,
    data.recovery,
    data.mileage,
  ];

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 24;
  const numPoints = 5;
  const angleStep = (2 * Math.PI) / numPoints;
  // Start from top (-PI/2)
  const startAngle = -Math.PI / 2;

  // Calculate point on polygon at given radius ratio (0-1)
  const getPoint = (index: number, r: number) => {
    const angle = startAngle + index * angleStep;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Build polygon path string
  const polygonPath = (points: { x: number; y: number }[]) => {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  };

  // Grid concentric pentagons (20% steps)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPolygons = gridLevels.map((level) => {
    const pts = Array.from({ length: numPoints }, (_, i) =>
      getPoint(i, radius * level)
    );
    return polygonPath(pts);
  });

  // Data polygon
  const dataPoints = values.map((v, i) =>
    getPoint(i, radius * Math.min(v / maxValue, 1))
  );
  const dataPath = polygonPath(dataPoints);

  // Axis lines from center to each vertex
  const axisLines = Array.from({ length: numPoints }, (_, i) => {
    const p = getPoint(i, radius);
    return `M${cx},${cy}L${p.x},${p.y}`;
  });

  // Label positions (slightly beyond the vertex)
  const labelPositions = Array.from({ length: numPoints }, (_, i) => {
    const angle = startAngle + i * angleStep;
    const labelRadius = radius + 18;
    return {
      x: cx + labelRadius * Math.cos(angle),
      y: cy + labelRadius * Math.sin(angle),
      label: LABELS[i],
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid pentagons */}
      {gridPolygons.map((path, i) => (
        <path
          key={`grid-${i}`}
          d={path}
          fill="none"
          stroke={GRID_COLOR}
          strokeWidth={1}
        />
      ))}

      {/* Axis lines */}
      {axisLines.map((path, i) => (
        <path
          key={`axis-${i}`}
          d={path}
          fill="none"
          stroke={GRID_COLOR}
          strokeWidth={1}
        />
      ))}

      {/* Data polygon fill */}
      <path
        d={dataPath}
        fill={LIGHT_ORANGE}
        stroke={ORANGE}
        strokeWidth={STROKE_WIDTH}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle
          key={`dot-${i}`}
          cx={p.x}
          cy={p.y}
          r={4}
          fill={ORANGE}
          stroke="#fff"
          strokeWidth={2}
        />
      ))}

      {/* Labels */}
      {labelPositions.map((pos, i) => {
        // Adjust text-anchor based on position
        let textAnchor: 'start' | 'middle' | 'end' = 'middle';
        let dy = '0.3em';
        const angle = startAngle + i * angleStep;
        const normalized = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        if (normalized === 0 || Math.abs(normalized - 2 * Math.PI) < 0.01) {
          textAnchor = 'middle';
          dy = '-0.5em';
        } else if (normalized > 0 && normalized < Math.PI) {
          textAnchor = 'start';
          dy = '0.3em';
        } else {
          textAnchor = 'end';
          dy = '0.3em';
        }
        // Additional vertical adjustments
        if (normalized > Math.PI * 0.8 && normalized < Math.PI * 1.2) {
          dy = '1em';
        } else if (normalized > Math.PI * 1.8 || (normalized > 0 && normalized < Math.PI * 0.2)) {
          dy = '-0.5em';
        }

        return (
          <text
            key={`label-${i}`}
            x={pos.x}
            y={pos.y}
            textAnchor={textAnchor}
            dominantBaseline="central"
            fontSize={12}
            fill={LABEL_COLOR}
            dy={dy}
          >
            {pos.label}
          </text>
        );
      })}

      {/* Value labels inside */}
      {dataPoints.map((p, i) => (
        <text
          key={`val-${i}`}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fontWeight="bold"
          fill="#fff"
          dy="-0.2em"
        >
          {values[i]}
        </text>
      ))}
    </svg>
  );
};

export default RadarChart;

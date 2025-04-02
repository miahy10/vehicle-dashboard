import React, { useMemo } from 'react';

const CircularGauge = ({
  minValue,
  maxValue,
  currentValue,
  tickInterval,
  labelInterval,
  labelFunction,
  width = 1500,
  height = 1500,
  arcStart = -135, // Début de l'arc à -135°
  arcEnd = 135, // Fin de l'arc à 135°
  needleColor = 'red',
  strokeColor = 'white',
  textColor = 'white',
  backgroundColor = 'black', // Fond noir
}) => {
  const radius = 35;
  const centerX = 50;
  const centerY = 50;
  const valueRange = maxValue - minValue;
  const angleRange = arcEnd - arcStart;

  // Calcul précis de l'angle de l'aiguille
  const angle = useMemo(() => {
    if (currentValue < minValue) return arcStart; // Limite inférieure
    if (currentValue > maxValue) return arcEnd; // Limite supérieure
    return arcStart + ((currentValue - minValue) / valueRange) * angleRange;
  }, [currentValue, minValue, maxValue, arcStart, arcEnd, valueRange, angleRange]);

  // Calcul des graduations
  const marks = useMemo(() => {
    const marksArray = [];
    for (let value = minValue; value <= maxValue; value += tickInterval) {
      const markAngle = arcStart + ((value - minValue) / valueRange) * angleRange - 90;
      const angleRad = (markAngle * Math.PI) / 180;
      const x1 = centerX + radius * Math.cos(angleRad);
      const y1 = centerY + radius * Math.sin(angleRad);
      const x2 = centerX + (radius + 5) * Math.cos(angleRad);
      const y2 = centerY + (radius + 5) * Math.sin(angleRad);
      marksArray.push(
        <line
          key={value}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={strokeColor}
          strokeWidth="1"
        />
      );
    }
    return marksArray;
  }, [minValue, maxValue, tickInterval, arcStart, arcEnd, strokeColor, valueRange, angleRange]);

  // Calcul des étiquettes
  const labels = useMemo(() => {
    const labelsArray = [];
    for (let value = minValue; value <= maxValue; value += labelInterval) {
      const labelAngle = arcStart + ((value - minValue) / valueRange) * angleRange - 90;
      const angleRad = (labelAngle * Math.PI) / 180;
      const x = centerX + (radius + 10) * Math.cos(angleRad); // Position à l'extérieur de l'arc
      const y = centerY + (radius + 10) * Math.sin(angleRad);
      const label = labelFunction ? labelFunction(value) : value;
      labelsArray.push(
        <text
          key={value}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="6" // Taille augmentée pour meilleure lisibilité
          fill={textColor}
        >
          {label}
        </text>
      );
    }
    return labelsArray;
  }, [minValue, maxValue, labelInterval, arcStart, arcEnd, labelFunction, textColor, valueRange, angleRange]);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor, // Fond noir
        borderRadius: '50%', // Style circulaire
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX + radius} ${centerY}`}
          stroke={strokeColor}
          strokeWidth="2" // Épaisseur augmentée
          fill="none"
        />
        {marks}
        {labels}
        <line
          className="needle"
          x1={centerX}
          y1={centerY}
          x2={centerX}
          y2={centerY - radius + 5}
          transform={`rotate(${angle}, ${centerX}, ${centerY})`}
          stroke={needleColor}
          strokeWidth="2"
          style={{ transition: 'transform 0.5s ease-in-out' }}
        />
      </svg>
    </div>
  );
};

export default CircularGauge;
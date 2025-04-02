import React from 'react';
import CircularGauge from './CircularGauge';

const Speedometer = ({ speed }) => {
  return (
    <div style={{ position: 'relative' }}>
      <CircularGauge
        minValue={0}
        maxValue={240}
        currentValue={speed}
        tickInterval={10}
        labelInterval={40}
        width={300}
        height={300}
      />
      <svg
        style={{
          position: 'absolute',
          top: '35%', // Position légèrement au-dessus du centre
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        width="100"
        height="30"
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight="bold"
          fill="white"
        >
          NISM
          <tspan fill="red">O</tspan>
        </text>
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          width: '100%',
          textAlign: 'center',
          color: 'white',
          fontSize: '12px',
        }}
      >
        km/h
      </div>
    </div>
  );
};

export default Speedometer;
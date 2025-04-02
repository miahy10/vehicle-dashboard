import React from 'react';
import CircularGauge from './CircularGauge';

const Tachometer = ({ rpm }) => {
  return (
    <div style={{ position: 'relative' }}>
      <CircularGauge
        minValue={0}
        maxValue={10}
        currentValue={rpm}
        tickInterval={1}
        labelInterval={1}
        labelFunction={(value) => `${value}`}
        width={300}
        height={300}
      />
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
        x1000 r/min
      </div>
    </div>
  );
};

export default Tachometer;
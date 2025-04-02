import React from 'react';
import CircularGauge from './CircularGauge';

const TemperatureGauge = ({ temperature }) => {
  return (
    <CircularGauge
      minValue={0}
      maxValue={1}
      currentValue={temperature}
      tickInterval={0.1}
      labelInterval={1}
      labelFunction={(value) => (value === 0 ? 'C' : 'H')}
      width={150}
      height={150}
    />
  );
};

export default TemperatureGauge;
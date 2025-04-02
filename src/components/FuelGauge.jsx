import React from 'react';
import CircularGauge from './CircularGauge';

const FuelGauge = ({ fuel }) => {
  return (
    <CircularGauge
      minValue={0}
      maxValue={1}
      currentValue={fuel}
      tickInterval={0.1}
      labelInterval={1}
      labelFunction={(value) => (value === 0 ? 'E' : 'F')}
      width={150}
      height={150}
    />
  );
};

export default FuelGauge;
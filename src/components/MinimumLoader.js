import React, { useState, useEffect } from 'react';
import Loader from './Loader';

const MinimumLoader = ({ loading, children, minDuration = 2000, size = 150 }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    // Set minimum time
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  useEffect(() => {
    // Hide loader only when both conditions are met:
    // 1. Data has loaded (!loading)
    // 2. Minimum time has passed
    if (!loading && minTimePassed) {
      setShowLoader(false);
    }
  }, [loading, minTimePassed]);

  if (showLoader) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={size} />
      </div>
    );
  }

  return children;
};

export default MinimumLoader;


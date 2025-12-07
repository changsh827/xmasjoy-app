import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<number[]>([]);

  useEffect(() => {
    // Generate a fixed number of snowflakes
    const flakeCount = 20;
    const newFlakes = Array.from({ length: flakeCount }, (_, i) => i);
    setFlakes(newFlakes);
  }, []);

  return (
    <div aria-hidden="true">
      {flakes.map((i) => {
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 5 + 5 + 's';
        const animationDelay = Math.random() * 5 + 's';
        
        return (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${left}%`,
              animationDuration: `${animationDuration}, 3s`,
              animationDelay: `${animationDelay}, 0s`,
              opacity: Math.random()
            }}
          >
            ❅
          </div>
        );
      })}
    </div>
  );
};

export default Snowfall;
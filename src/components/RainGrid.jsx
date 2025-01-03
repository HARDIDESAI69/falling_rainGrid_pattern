import React, { useState, useEffect } from 'react';
import '../styles/RainGrid.css';

// Utility to generate shades for a given color
const generateColorSet = (baseColor) => {
  const lighten = (color, percent) => {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  };

  // Define some base colors
  const colorPalettes = {
    blue: '#0909FF',
    green: '#2cf13b',
    pink: '#FF007F',
    red: '#F62817',
    purple: '#F433FF',
    yellow: '#FFFF0A',
    orange: '#FFA600',
  };

  // Pick a random color palette
  const selectedColor = colorPalettes[baseColor.toLowerCase()] || '#0000FF'; // Default to blue if not found

  // Generate shades from darkest to lightest
  return [0, 10, 20, 30, 40, 50].map((percent) => lighten(selectedColor, percent));
};

const RainGrid = ({ rows = 15, cols = 20 }) => {
  const [rainDrops, setRainDrops] = useState([]);
  const [colorSet, setColorSet] = useState(generateColorSet('blue')); // Default color set is blue

  useEffect(() => {
    initializeRain();

    const rainInterval = setInterval(updateRain, 100); // Increased speed of rain
    const columnInterval = setInterval(changeRainColumns, 1500); // Faster column change
    const colorChangeInterval = setInterval(changeRainColors, 2000); // Faster color change

    return () => {
      clearInterval(rainInterval);
      clearInterval(columnInterval);
      clearInterval(colorChangeInterval);
    };
  }, []);

  // Initialize Rain in random columns
  const initializeRain = () => {
    const initialRain = Array.from({ length: cols }, () => ({
      start: Math.floor(Math.random() * rows),
      active: Math.random() > 0.7,
    }));
    setRainDrops(initialRain);
  };

  // Update Rainfall
  const updateRain = () => {
    setRainDrops((prev) =>
      prev.map((drop) =>
        drop.active
          ? {
              ...drop,
              start: (drop.start + 1) % (rows + 6), // Reset after reaching end
            }
          : drop
      )
    );
  };

  // Change active columns
  const changeRainColumns = () => {
    setRainDrops((prev) =>
      prev.map((drop) => ({
        ...drop,
        active: Math.random() > 0.7,
      }))
    );
  };

  // Change color set for rain drops
  const changeRainColors = () => {
    const colorOptions = ['blue', 'green', 'pink', 'red', 'purple', 'yellow'];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    setColorSet(generateColorSet(randomColor));
  };

  return (
    <div
      className="rain-grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {Array.from({ length: rows }).map((_, rowIndex) =>
        Array.from({ length: cols }).map((_, colIndex) => {
          const drop = rainDrops[colIndex] || { active: false, start: 0 }; // Fallback for undefined

          let cellColor = '#222'; // Default grid color

          if (drop.active) {
            const rainStart = drop.start - 6;
            if (rowIndex >= rainStart && rowIndex < drop.start) {
              const gradientIndex = rowIndex - rainStart;
              if (gradientIndex >= 0 && gradientIndex < 6) {
                cellColor = colorSet[gradientIndex]; // Apply gradient color
              }
            }
          }

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="grid-cell"
              style={{
                backgroundColor: cellColor,
              }}
            ></div>
          );
        })
      )}
    </div>
  );
};

export default RainGrid;

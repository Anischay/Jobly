// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock canvas
HTMLCanvasElement.prototype.getContext = () => {
  return {
    clearRect: () => {},
    scale: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    arc: () => {},
    fill: () => {},
    fillText: () => {},
  };
};

// Mock window.devicePixelRatio
Object.defineProperty(window, 'devicePixelRatio', {
  configurable: true,
  value: 1,
});

// Mock window.scrollTo
window.scrollTo = jest.fn();

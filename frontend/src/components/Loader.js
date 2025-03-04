import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Loader = () => {
  const [value, setValue] = useState(0.021); // Starting value

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => parseFloat((prev + 0.00035).toFixed(6))); // Increment by 0.00035 per minute
    }, 1000); // 60,000ms = 1 minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Format value to ensure it always has six decimal places
  const formattedValue = value.toFixed(6).split(""); // Convert to array for individual digit animation

  return (
    <StyledWrapper>
      <div className="loader">
        {formattedValue.map((digit, index) => (
          <span key={index} className="digit">
            {digit}
          </span>
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    display: inline-flex;
    padding: 0.7em 1.7em;
    font-size: 30px;
    border-radius: 0.5em;
    background: #e8e8e8;
    box-shadow: 6px -6px 12px #c5c5c5, -6px 6px 12px #ffffff;
    font-family: monospace;
    font-weight: bold;
    overflow: hidden;
    justify-content: center;
  }

  .digit {
    display: inline-block;
    position: relative;
    animation: bounce 0.5s ease-in-out;
    animation-fill-mode: both;
  }

  /* Animation for each digit */
  @keyframes bounce {
    0% {
      transform: translateY(-50%);
      opacity: 0;
    }
    50% {
      transform: translateY(0%);
      opacity: 1;
    }
    100% {
      transform: translateY(-5%);
    }
  }

  .digit:nth-child(even) {
    animation-delay: 0.1s;
  }

  .digit:nth-child(odd) {
    animation-delay: 0.2s;
  }
`;

export default Loader;

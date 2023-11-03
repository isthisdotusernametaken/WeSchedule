import React, { useState } from "react";

function Button() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(clickCount + 1);
  };

  return (
    <button type="button" onClick={handleClick}>
      Clicks: {clickCount}
    </button>
  );
}

export default Button;

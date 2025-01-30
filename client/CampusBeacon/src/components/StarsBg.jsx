import { useState } from "react";

const StarsBg = ({ delay }) => {
    const [position] = useState({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
    });
}
export default StarsBg; 
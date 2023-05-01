import React, { useState, useEffect, useRef } from "react";
//@ts-ignore
import FiMessageCircle from "@iconscout/react-unicons/icons/uil-react";

const MovableChatBubble = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const animationTimeout = useRef(null);

  const handleStart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { clientX, clientY } = getCoordinates(e);

    setIsDragging(true);
    setPosition((prev) => {
      const newX = Math.min(Math.max(clientX - 25, 0), window.innerWidth - 50);
      const newY = Math.min(Math.max(clientY - 25, 0), window.innerHeight - 50);
      return { x: newX, y: newY };
    });
  };

  const handleMove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { clientX, clientY } = getCoordinates(e);

    if (isDragging) {
      setPosition((prev) => {
        const newX = Math.min(
          Math.max(clientX - 25, 0),
          window.innerWidth - 50
        );
        const newY = Math.min(
          Math.max(clientY - 25, 0),
          window.innerHeight - 50
        );
        return { x: newX, y: newY };
      });
    }
  };

  const handleEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (animationTimeout.current) clearTimeout(animationTimeout.current);
    animationTimeout.current = setTimeout(() => setIsDragging(false), 100);
  };

  const getCoordinates = (event) => {
    if (event.type.startsWith("touch")) {
      return {
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
      };
    } else {
      return {
        clientX: event.clientX,
        clientY: event.clientY,
      };
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("touchend", handleEnd);
    } else {
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    }

    return () => {
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  return (
    <div
      className="disable-touch-drag fixed z-50"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
    >
      <div
        className={`rounded-full bg-blue-500 p-2 text-white shadow-lg transition-colors duration-300 ease-in-out ${
          isDragging ? "bg-blue-600" : ""
        }`}
      >
        <FiMessageCircle size={24} />
      </div>
    </div>
  );
};

export default MovableChatBubble;

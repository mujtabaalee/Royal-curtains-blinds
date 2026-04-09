import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  }, [isAdmin]);

  // Use springs for buttery smooth following
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Detect hoverable elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, [role="button"], input, textarea, select, .btn');
      setIsHovering(!!clickable);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  // Don't render on touch devices or admin dashboard
  if (isAdmin || (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0))) {
    return null;
  }

  return (
    <>
      {/* Outer ring — follows with spring delay */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 64 : 42,
          height: isHovering ? 64 : 42,
          borderRadius: '50%',
          border: `2.5px solid ${isHovering ? '#D4AF37' : 'rgba(212, 175, 55, 0.7)'}`,
          backgroundColor: isHovering ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.75 : 1,
          transition: 'width 0.3s ease, height 0.3s ease, border 0.3s ease, opacity 0.3s ease, background-color 0.3s ease',
        }}
      />

      {/* Inner dot — instant follow */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 10 : 8,
          height: isHovering ? 10 : 8,
          borderRadius: '50%',
          backgroundColor: '#D4AF37',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 2.5 : 1,
          boxShadow: '0 0 8px rgba(212, 175, 55, 0.6)',
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.3s ease, scale 0.15s ease',
        }}
      />
    </>
  );
};

export default CustomCursor;

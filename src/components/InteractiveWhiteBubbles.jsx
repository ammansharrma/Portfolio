import { useEffect, useRef, memo } from 'react';
import './InteractiveWhiteBubbles.css';

function InteractiveWhiteBubbles() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Bubble class with physics
    class Bubble {
      constructor(x, y, radius, vx, vy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.mass = radius;
      }

      draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, 'rgba(140, 100, 255, 0.6)');
        gradient.addColorStop(0.5, 'rgba(140, 100, 255, 0.35)');
        gradient.addColorStop(1, 'rgba(140, 100, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.vx = -this.vx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.vy = -this.vy;
        }

        this.x += this.vx;
        this.y += this.vy;
      }
    }

    // Create 2 bubbles (reduced for calmer ending)
    const bubbles = [
      new Bubble(canvas.width * 0.35, canvas.height * 0.35, 160, 0.5, 0.3),
      new Bubble(canvas.width * 0.65, canvas.height * 0.6, 180, -0.4, 0.5)
    ];

    // Collision detection and response
    function checkCollision(bubble1, bubble2) {
      const dx = bubble2.x - bubble1.x;
      const dy = bubble2.y - bubble1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < bubble1.radius + bubble2.radius) {
        // Calculate collision angle
        const angle = Math.atan2(dy, dx);
        
        // Calculate velocities in collision coordinate system
        const v1 = {
          x: bubble1.vx * Math.cos(angle) + bubble1.vy * Math.sin(angle),
          y: bubble1.vy * Math.cos(angle) - bubble1.vx * Math.sin(angle)
        };
        const v2 = {
          x: bubble2.vx * Math.cos(angle) + bubble2.vy * Math.sin(angle),
          y: bubble2.vy * Math.cos(angle) - bubble2.vx * Math.sin(angle)
        };

        // Elastic collision formulas
        const v1FinalX = ((bubble1.mass - bubble2.mass) * v1.x + 2 * bubble2.mass * v2.x) / (bubble1.mass + bubble2.mass);
        const v2FinalX = ((bubble2.mass - bubble1.mass) * v2.x + 2 * bubble1.mass * v1.x) / (bubble1.mass + bubble2.mass);

        // Convert back to original coordinate system
        bubble1.vx = v1FinalX * Math.cos(angle) - v1.y * Math.sin(angle);
        bubble1.vy = v1.y * Math.cos(angle) + v1FinalX * Math.sin(angle);
        bubble2.vx = v2FinalX * Math.cos(angle) - v2.y * Math.sin(angle);
        bubble2.vy = v2.y * Math.cos(angle) + v2FinalX * Math.sin(angle);

        // Separate bubbles to prevent overlap
        const overlap = bubble1.radius + bubble2.radius - distance;
        const separationX = (overlap / 2) * Math.cos(angle);
        const separationY = (overlap / 2) * Math.sin(angle);
        
        bubble1.x -= separationX;
        bubble1.y -= separationY;
        bubble2.x += separationX;
        bubble2.y += separationY;
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check collisions between all bubbles
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          checkCollision(bubbles[i], bubbles[j]);
        }
      }

      // Update and draw bubbles
      bubbles.forEach(bubble => {
        bubble.update();
        bubble.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize with debounce
    let resizeTimeout;
    function handleResize() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, 150);
    }

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-white-bubbles-canvas"
      aria-hidden="true"
    />
  );
}

export default memo(InteractiveWhiteBubbles)

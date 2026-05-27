import React, { useEffect, useRef } from 'react';
import './NeuralNetwork.css';

const NeuralNetwork = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas size
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class - small floating dots like in the image
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 1; // Small dots 1-3.5px
        
        // Random gentle movement in any direction
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.3 + 0.1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = this.getGradientColor();
        
        // For fade in/out effect
        this.life = Math.random();
        this.lifeSpeed = Math.random() * 0.005 + 0.002;
      }

      getGradientColor() {
        // Create gradient from blue to purple to pink like the image
        const position = Math.random();
        
        if (position < 0.33) {
          // Blue tones
          return { r: 59 + Math.random() * 50, g: 130 + Math.random() * 20, b: 246 };
        } else if (position < 0.66) {
          // Purple tones
          return { r: 118 + Math.random() * 30, g: 75 + Math.random() * 20, b: 162 + Math.random() * 50 };
        } else {
          // Pink/Red tones
          return { r: 220 + Math.random() * 35, g: 38 + Math.random() * 40, b: 127 + Math.random() * 50 };
        }
      }

      update() {
        // Gentle floating movement
        this.x += this.vx;
        this.y += this.vy;

        // Very subtle sine wave for organic movement
        this.x += Math.sin(this.y * 0.005) * 0.1;
        this.y += Math.cos(this.x * 0.005) * 0.1;

        // Life cycle for fade effect
        this.life += this.lifeSpeed;
        if (this.life > 1) {
          this.lifeSpeed = -this.lifeSpeed;
        } else if (this.life < 0) {
          this.lifeSpeed = -this.lifeSpeed;
        }

        // Wrap around screen edges
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }

      draw() {
        const currentOpacity = this.opacity * this.life;
        
        // Draw small dot with subtle glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Radial gradient for soft edges
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Create many small particles like in the image
    const particleCount = Math.min(150, Math.floor((width * height) / 8000));
    particlesRef.current = Array.from({ length: particleCount }, () => new Particle());

    // Animation loop
    const animate = () => {
      // Clear canvas completely for clean redraw
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="neural-network-canvas" />;
};

export default NeuralNetwork;

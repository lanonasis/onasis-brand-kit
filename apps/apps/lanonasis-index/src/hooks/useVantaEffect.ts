import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface VantaEffect {
  destroy: () => void;
}

interface VantaModule {
  default: (options: {
    el: HTMLElement;
    THREE: typeof THREE;
    color: number;
    backgroundColor: number;
    points: number;
    maxDistance: number;
    spacing: number;
  }) => VantaEffect;
}

interface VantaOptions {
  color?: number;
  backgroundColor?: number;
  points?: number;
  maxDistance?: number;
  spacing?: number;
}

export const useVantaEffect = (options: VantaOptions = {}) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);

  useEffect(() => {
    let effect: VantaEffect | null = null;

    const initVanta = async () => {
      try {
        if (!vantaRef.current) return;
        if (vantaEffect) {
          vantaEffect.destroy();
          setVantaEffect(null);
        }

        // Dynamically import Vanta to handle potential loading issues
        const NET = await import('vanta/dist/vanta.net.min') as VantaModule;
        
        effect = NET.default({
          el: vantaRef.current,
          THREE,
          color: options.color || 0x00b4ff,
          backgroundColor: options.backgroundColor || 0x0a1930,
          points: options.points || 10,
          maxDistance: options.maxDistance || 25,
          spacing: options.spacing || 16,
        });
        
        setVantaEffect(effect);
      } catch (error) {
        console.warn('Vanta.js failed to initialize:', error);
        // Fallback: Apply a static gradient background
        if (vantaRef.current) {
          vantaRef.current.style.background = 'linear-gradient(135deg, #0a1930 0%, #1a2332 50%, #0a1930 100%)';
        }
      }
    };

    const timer = setTimeout(initVanta, 100);

    return () => {
      clearTimeout(timer);
      if (effect) {
        try {
          effect.destroy();
        } catch (error) {
          console.warn('Error destroying Vanta effect:', error);
        }
      }
    };
  }, [vantaEffect, options]); // Added options to dependency array

  return vantaRef;
};
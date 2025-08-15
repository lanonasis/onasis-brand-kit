declare module 'vanta/dist/vanta.net.min' {
  import * as THREE from 'three';
  
  interface VantaNetOptions {
    el: HTMLElement | null;
    THREE: typeof THREE;
    color: number;
    backgroundColor: number;
    points?: number;
    maxDistance?: number;
    spacing?: number;
  }
<<<<<<< Updated upstream
  
  interface VantaNetEffect {
    destroy: () => void;
  }
  
  export default function NET(options: VantaNetOptions): VantaNetEffect;
=======

  // Updated export structure to match actual module
  const NET: {
    default: {
      default: (options: VantaOptions) => VantaEffect;
    };
  };
  
  // Default export structure
  export default {
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      default: (_: VantaOptions) => VantaEffect
    }
  };
>>>>>>> Stashed changes
}

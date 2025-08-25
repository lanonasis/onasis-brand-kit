declare module 'vanta/dist/vanta.net.min' {
  import * as THREE from 'three';

  export interface VantaNetOptions {
    el: HTMLElement | null;
    THREE: typeof THREE;
    color: number;
    backgroundColor: number;
    points: number;
    maxDistance: number;
    spacing: number;
  }

  export interface VantaNetEffect {
    destroy: () => void;
  }

  export default function NET(options: VantaNetOptions): VantaNetEffect;
}

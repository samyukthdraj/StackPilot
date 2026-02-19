// Type declarations for GSAP and Lenis loaded from CDN

interface Window {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  Lenis: any;
}

declare module "gsap" {
  export const gsap: any;
  export const ScrollTrigger: any;
}

// Type declarations for GSAP and Lenis loaded from CDN

interface Window {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Lenis: any;
}

declare module "gsap" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const gsap: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const ScrollTrigger: any;
}

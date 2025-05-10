import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const PageTransition = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      {
        y: "100%", // Start off screen (bottom)
        opacity: 0.6,
        scale: 0.96,
      },
      {
        y: "0%",
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      }
    );

    return () => {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: "-5%",
        duration: 0.4,
        ease: "power2.in",
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen w-full ${className}`} // Allow dynamic className
    >
      {children}
    </div>
  );
};

export default PageTransition;

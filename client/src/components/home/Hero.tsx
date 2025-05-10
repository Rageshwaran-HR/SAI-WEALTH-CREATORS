import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import animationData from '@/lib/Animation.json';
import { gsap } from 'gsap';

const Hero = () => {
  const refs = {
    section: useRef<HTMLElement>(null),
    badge: useRef<HTMLSpanElement>(null),
    heading: useRef<HTMLHeadingElement>(null),
    subtext: useRef<HTMLParagraphElement>(null),
    ctas: useRef<HTMLDivElement>(null),
    animation: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 1 } });

    tl.fromTo(refs.section.current, { opacity: 0 }, { opacity: 1 })
      .fromTo(refs.badge.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.4')
      .fromTo(refs.heading.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.6')
      .fromTo(refs.subtext.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.6')
      .fromTo(refs.ctas.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.6')
      .fromTo(refs.animation.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1 }, '-=1');
  }, []);

  return (
    <section
      ref={refs.section}
      className="relative bg-[#0B1120] text-white py-28 md:py-36 overflow-hidden"
    >
      {/* Subtle glowing background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sky-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            <span
              ref={refs.badge}
              className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-blue-500/10 text-sky-300 tracking-widest uppercase"
            >
              Sai Wealth Creator
            </span>
            <h1
              ref={refs.heading}
              className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight"
            >
              Empowering Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
                Financial Future
              </span>
            </h1>
            <p
              ref={refs.subtext}
              className="text-white/70 text-lg md:text-xl max-w-xl mx-auto lg:mx-0"
            >
              Tailored investment solutions backed by insights and strategy.
              Trust us to grow your capital securely and efficiently.
            </p>

            <div
              ref={refs.ctas}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-semibold px-8 py-4 shadow-md"
              >
                <Link href="/contact">Start Investing<ArrowUpRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white bg-[#FFD700]/60 hover:bg-[#FFD700] px-8 py-4 font-medium"
                asChild
              >
                <Link href="/research">Explore Funds</Link>
              </Button>
            </div>
          </div>

          {/* Lottie Animation */}
          <div ref={refs.animation} className="max-w-md w-full mx-auto lg:mx-0">
            <Lottie animationData={animationData} loop autoplay />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

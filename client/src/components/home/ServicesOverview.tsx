import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const services: Service[] = [
  {
    id: 'mutual-funds',
    title: 'Mutual Funds',
    description: 'Diversified investment options with professional management to help you achieve your financial goals.',
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80'
  },
  {
    id: 'portfolio-management',
    title: 'Portfolio Management',
    description: 'Personalized investment strategies managed by expert advisors to optimize returns and manage risk.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 'alternative-investments',
    title: 'Alternative Investments',
    description: 'Access to unique investment opportunities beyond traditional assets for portfolio diversification.',
    image: 'https://images.unsplash.com/photo-1607944024060-0450380ddd33?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 'insurance',
    title: 'Insurance Solutions',
    description: 'Comprehensive protection for life, health, and assets to secure your family\'s financial future.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 'tax-advisory',
    title: 'Tax Advisory',
    description: 'Strategic tax planning and compliance services to optimize your financial decisions and investments.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 'retirement-planning',
    title: 'Retirement Planning',
    description: 'Comprehensive retirement strategies to ensure financial security and peace of mind in your golden years.',
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  }
];
const ServicesOverview = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = document.querySelectorAll('.service-card');
  
    if (!cards.length) return;
  
    ScrollTrigger.batch(cards, {
      onEnter: batch => {
        gsap.fromTo(
          batch,
          {
            opacity: 0,
            y: 50,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            overwrite: 'auto',
          }
        );
      },
      once: true,
      start: 'top 85%',
    });
  
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto" ref={containerRef}>
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-3">Our Investment Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive financial solutions tailored to meet your unique investment needs and long-term objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              className="service-card overflow-hidden will-change-transform transition-transform duration-500"
            >
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary bg-opacity-30"></div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-montserrat font-bold text-xl text-primary mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <Link href={`/services/${service.id}`} className="text-secondary font-bold hover:underline flex items-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            className="bg-primary hover:bg-primary/90 text-white font-bold"
            asChild
          >
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;

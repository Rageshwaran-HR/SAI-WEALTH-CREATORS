import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftIcon, CheckCircle2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import PageTransition from "@/components/layout/PageTransition";
import gsap from 'gsap';

type Service = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  icon: string;
};

const services: Record<string, Service> = {
  'mutual-funds': {
    id: 'mutual-funds',
    title: 'Mutual Funds',
    description: 'Diversified investment options with professional management to help you achieve your financial goals.',
    longDescription: 'Our mutual fund advisory services provide access to a wide range of funds across various asset classes, risk profiles, and investment objectives. We help you select the right funds based on your financial goals and risk tolerance, whether you\'re looking for growth, income, or a balanced approach. Our team continuously monitors fund performance and makes recommendations to optimize your portfolio.',
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    icon: 'chart-line'
  },
  'portfolio-management': {
    id: 'portfolio-management',
    title: 'Portfolio Management',
    description: 'Personalized investment strategies managed by expert advisors to optimize returns and manage risk.',
    longDescription: 'Our portfolio management services provide customized investment strategies designed to meet your specific financial goals. Our team of experienced portfolio managers actively monitors and adjusts your investments to optimize returns while managing risk. We focus on creating a diversified portfolio that aligns with your risk tolerance and time horizon, incorporating a mix of asset classes to maximize growth potential and minimize volatility.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'chart-pie'
  },
  'alternative-investments': {
    id: 'alternative-investments',
    title: 'Alternative Investments',
    description: 'Access to unique investment opportunities beyond traditional assets for portfolio diversification.',
    longDescription: 'Our alternative investment services provide access to non-traditional asset classes such as private equity, hedge funds, real estate, and structured products. These investments can provide diversification benefits and potentially higher returns compared to traditional investments. Our team conducts thorough due diligence on alternative investment options to ensure they meet our stringent criteria for quality, risk, and return potential.',
    image: 'https://images.unsplash.com/photo-1607944024060-0450380ddd33?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'building'
  },
  'insurance': {
    id: 'insurance',
    title: 'Insurance Solutions',
    description: 'Comprehensive protection for life, health, and assets to secure your family\'s financial future.',
    longDescription: 'Our insurance advisory services help you navigate the complex world of insurance products. We analyze your needs and recommend appropriate life, health, and general insurance policies to ensure comprehensive protection for you and your family. We work with leading insurance providers to offer a wide range of options at competitive rates, focusing on policies that provide optimal coverage for your specific circumstances.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'shield-alt'
  },
  'tax-advisory': {
    id: 'tax-advisory',
    title: 'Tax Advisory',
    description: 'Strategic tax planning and compliance services to optimize your financial decisions and investments.',
    longDescription: 'Our tax advisory services help you navigate the complex tax landscape to ensure compliance while minimizing your tax burden. We provide strategic advice on tax-efficient investment strategies, retirement planning, and estate planning. Our team stays updated on the latest tax laws and regulations to help you take advantage of available deductions, credits, and exemptions, ultimately maximizing your after-tax returns.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'file-invoice'
  },
  'retirement-planning': {
    id: 'retirement-planning',
    title: 'Retirement Planning',
    description: 'Comprehensive retirement strategies to ensure financial security and peace of mind in your golden years.',
    longDescription: 'Our retirement planning services help you prepare for a financially secure retirement. We analyze your current financial situation, estimate your future needs, and develop a comprehensive strategy to help you achieve your retirement goals. This includes determining the optimal savings rate, investment allocation, and withdrawal strategy to ensure your money lasts throughout retirement, while also planning for contingencies such as healthcare expenses and inflation.',
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'umbrella-beach'
  },
  'estate-planning': {
    id: 'estate-planning',
    title: 'Estate Planning',
    description: 'Protect your assets and ensure your wealth is transferred according to your wishes.',
    longDescription: 'Our estate planning services help you protect and preserve your wealth for future generations. We assist with will creation, trust establishment, and succession planning to ensure your assets are transferred according to your wishes. Our team works closely with legal experts to develop comprehensive estate plans that minimize taxes, avoid probate, and provide for the seamless transfer of wealth to your beneficiaries.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'landmark'
  }
};

const ServiceDetail = () => {
  const params = useParams();
  const { id } = params;
  const [service, setService] = useState<Service | null>(null);

  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    if (id && services[id]) {
      setService(services[id]);
    }
  }, [id]);

  useEffect(() => {
    if (service) {
      // GSAP animations
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(imageRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      });

      gsap.from(contentRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 1,
        ease: "power3.out",
      });
    }
  }, [service]);

  if (!service) {
    return (
      <div className="py-16 bg-white min-h-screen">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="font-montserrat font-bold text-3xl text-primary mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-8">The service you're looking for doesn't exist or has been moved.</p>
            <Button asChild>
              <Link href="/services">Back to Services</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
    <div className="container mx-auto pb-4">
      <div className="mb-6" ref={headerRef}>
        <Button variant="ghost" asChild className="flex items-center text-primary">
          <Link href="/services">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Services
          </Link>
        </Button>
      </div>

      <div className="mb-12" ref={imageRef}>
        <div className="relative h-80 rounded-lg overflow-hidden">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h1 className="font-montserrat font-bold text-4xl mb-4">{service.title}</h1>
              <p className="text-xl max-w-3xl">{service.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12" ref={contentRef}>
        <div className="lg:col-span-2">
          <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">About {service.title}</h2>
          <div className="space-y-4 text-gray-600">
            <p>{service.longDescription}</p>
            <p>At Sai Wealth Creators, we understand that every client has unique financial needs and goals. Our approach is highly personalized, starting with a comprehensive assessment of your current financial situation, goals, and risk tolerance. Based on this assessment, we develop a tailored strategy that aligns with your objectives.</p>
            <p>Our team of experienced professionals leverages their expertise and market knowledge to guide you through the complex financial landscape. We pride ourselves on maintaining open communication, providing regular updates, and being available to address any questions or concerns you may have.</p>
          </div>

          <div className="mt-12">
            <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Why Choose Our {service.title}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mr-3" />
                <span className="text-gray-600">Personalized solutions tailored to your unique financial goals</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mr-3" />
                <span className="text-gray-600">Expert guidance from our team of certified financial professionals</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mr-3" />
                <span className="text-gray-600">Transparent fee structure with no hidden charges</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mr-3" />
                <span className="text-gray-600">Regular portfolio reviews and performance reports</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mr-3" />
                <span className="text-gray-600">Ongoing support and guidance as your financial needs evolve</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-12">
            <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Our Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">1</div>
                <h4 className="font-montserrat font-bold text-lg text-primary mb-2">Assessment</h4>
                <p className="text-gray-600 text-sm">We begin with a comprehensive assessment of your financial situation and goals.</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">2</div>
                <h4 className="font-montserrat font-bold text-lg text-primary mb-2">Strategy Development</h4>
                <p className="text-gray-600 text-sm">We develop a personalized strategy that aligns with your objectives and risk tolerance.</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">3</div>
                <h4 className="font-montserrat font-bold text-lg text-primary mb-2">Implementation</h4>
                <p className="text-gray-600 text-sm">We implement your plan and provide ongoing monitoring and adjustments as needed.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-gray-100 sticky top-24">
            <CardContent className="p-6">
              <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Get Started Today</h3>
              <p className="text-gray-600 mb-6">
                Contact us for a free consultation to discuss how our {service.title} can help you achieve your financial goals.
              </p>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold mb-4" asChild>
                <Link href="/contact">Schedule a Consultation</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/calculators">Try Our Financial Calculators</Link>
              </Button>
              
              <div className="mt-8 pt-6 border-t border-gray-300">
                <h4 className="font-montserrat font-medium text-primary mb-3">Related Services</h4>
                <ul className="space-y-2">
                  {Object.values(services)
                    .filter(s => s.id !== service.id)
                    .slice(0, 3)
                    .map(relatedService => (
                      <li key={relatedService.id}>
                        <Link href={`/services/${relatedService.id}`}>
                          <a className="text-secondary hover:underline">{relatedService.title}</a>
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-300">
                <h4 className="font-montserrat font-medium text-primary mb-3">Have Questions?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Our team is ready to answer any questions you may have about our services.
                </p>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span className="font-medium">+91 80 4567 8900</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-16 bg-primary text-white rounded-lg p-10 text-center">
        <h2 className="font-montserrat font-bold text-2xl mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Take the first step toward achieving your financial goals with our {service.title}.
        </p>
        <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-bold" asChild>
          <Link href="/contact">Contact Us Today</Link>
        </Button>
      </div>
    </div>
    </PageTransition>
  );
};

export default ServiceDetail;

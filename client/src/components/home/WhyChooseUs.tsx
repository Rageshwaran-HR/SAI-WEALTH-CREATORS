import { useEffect } from 'react';
import { features, testimonials } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BarChart3, Shield, UserCheck, Coins } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WhyChooseUs = () => {
  useEffect(() => {
    // Animate feature cards
    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: '.feature-card',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.2,
    });

    // Animate testimonials
    gsap.from('.testimonial-card', {
      scrollTrigger: {
        trigger: '.testimonial-card',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.3,
      delay: 0.3,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-3">Why Choose Sai Wealth Creator</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            With decades of experience in financial markets, we offer the expertise and personalized service to help you achieve your investment goals.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="feature-card bg-gray-100 rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(0,123,255,0.6)]">
                {feature.id === 1 && <BarChart3 size={28} className="text-white" />}
                {feature.id === 2 && <UserCheck size={28} className="text-white" />}
                {feature.id === 3 && <Shield size={28} className="text-white" />}
                {feature.id === 4 && <Coins size={28} className="text-white" />}
              </div>
              <h3 className="font-montserrat font-bold text-xl text-primary mb-2">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h3 className="font-montserrat font-bold text-2xl text-primary text-center mb-8">What Our Clients Say</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="testimonial-card bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 relative">
                  <div className="absolute -top-4 left-6 text-5xl text-secondary opacity-50">"</div>
                  <p className="text-gray-600 mb-4 pt-4">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center">
                    <Avatar className="w-12 h-12 mr-4">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-montserrat font-medium text-primary">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

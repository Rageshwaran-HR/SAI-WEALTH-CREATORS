import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import PageTransition from "@/components/layout/PageTransition";
import gsap from 'gsap';

const About = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location);
  const section = searchParams.get('section') || 'story';

  const [activeTab, setActiveTab] = useState(section);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      bio: "With over 25 years of experience in the financial sector, Rajesh has helped countless clients achieve their financial goals."
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Chief Investment Officer",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      bio: "Priya brings extensive expertise in portfolio management and market analysis, having previously worked at leading financial institutions."
    },
    {
      id: 3,
      name: "Vikram Patel",
      role: "Head of Advisory Services",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      bio: "Vikram specializes in comprehensive financial planning, with particular expertise in retirement and estate planning."
    },
    {
      id: 4,
      name: "Neha Reddy",
      role: "Tax Planning Specialist",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      bio: "A certified tax professional, Neha helps clients optimize their tax strategies and ensure regulatory compliance."
    }
  ];

  const partners = [
    {
      id: 1,
      name: "Axis Mutual Fund",
      logo: "logo-placeholder",
      description: "One of India's leading asset management companies offering innovative investment solutions."
    },
    {
      id: 2,
      name: "HDFC Life Insurance",
      logo: "logo-placeholder",
      description: "Providing comprehensive insurance solutions for life, health, and retirement planning."
    },
    {
      id: 3,
      name: "SBI Portfolio Management Services",
      logo: "logo-placeholder",
      description: "Expert portfolio management services for high-net-worth individuals and institutions."
    },
    {
      id: 4,
      name: "Kotak Securities",
      logo: "logo-placeholder",
      description: "Leading stock brokerage and investment advisory services for equity markets."
    }
  ];

  useEffect(() => {
    // GSAP animations for the active tab
    gsap.from(".fade-in", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });

    gsap.from(".slide-in", {
      x: -100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(value);
      setIsTransitioning(false);
    }, 300); // Match the duration of the transition animation
  };

  return (
    <PageTransition>
      <div className="bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 fade-in">
            <h1 className="font-montserrat font-bold text-3xl md:text-5xl text-primary mb-4">About Sai Wealth Creators</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Learn about our story, our team, and our commitment to helping clients achieve their financial goals.
            </p>
          </div>

          <Tabs defaultValue={section} onValueChange={handleTabChange} className="mb-12">
            <TabsList className="flex justify-center mb-10 fade-in">
              <TabsTrigger value="story">Our Story</TabsTrigger>
              <TabsTrigger value="team">Our Team</TabsTrigger>
              <TabsTrigger value="partners">Our Partners</TabsTrigger>
            </TabsList>

            <div className={`tab-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
              <TabsContent value="story">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="slide-in">
                    <h2 className="font-montserrat font-bold text-2xl text-primary mb-4">Our Journey</h2>
                    <p className="text-gray-600 mb-4">
                      Founded in 2005, Sai Wealth Creators LLP began with a simple mission: to provide transparent, client-focused financial advice that puts people first.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Starting with just three employees in a small office in Bangalore, we've grown to a team of over 50 financial professionals serving clients across India.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Today, Sai Wealth Creators manages over ₹500 crores in assets for individuals, families, and institutions.
                    </p>
                    <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold mt-4">
                      Learn More About Our Services
                    </Button>
                  </div>
                  <div className="fade-in">
                    <img 
                      src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" 
                      alt="Sai Wealth Creators office" 
                      className="rounded-lg shadow-xl w-full"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="team">
                <div className="text-center mb-8 fade-in">
                  <h2 className="font-montserrat font-bold text-2xl text-primary mb-4">Meet Our Team</h2>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    Our team of experienced financial professionals is committed to providing you with personalized, expert advice to help you achieve your financial goals.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className="bg-white shadow-md overflow-hidden fade-in">
                      <div className="p-6 text-center">
                        <Avatar className="w-24 h-24 mx-auto mb-4">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-montserrat font-bold text-xl text-primary mb-1">{member.name}</h3>
                        <p className="text-secondary font-medium mb-3">{member.role}</p>
                        <p className="text-gray-600 text-sm">{member.bio}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="partners">
                <div className="text-center mb-8 fade-in">
                  <h2 className="font-montserrat font-bold text-2xl text-primary mb-4">Our Strategic Partners</h2>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    We collaborate with leading financial institutions to provide our clients with the best investment options and solutions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {partners.map((partner) => (
                    <Card key={partner.id} className="bg-white shadow-md fade-in">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                            <span className="text-gray-500 text-xs">{partner.logo}</span>
                          </div>
                          <h3 className="font-montserrat font-bold text-xl text-primary">{partner.name}</h3>
                        </div>
                        <p className="text-gray-600">{partner.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;

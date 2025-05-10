import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from "@/components/layout/PageTransition";

const services = [
  {
    id: 'mutual-funds',
    title: 'Mutual Funds',
    description: 'Diversified investment options with professional management to help you achieve your financial goals.',
    longDescription: 'Our mutual fund advisory services provide access to a wide range of funds across various asset classes, risk profiles, and investment objectives. We help you select the right funds based on your financial goals and risk tolerance.',
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    icon: 'chart-line'
  },
  {
    id: 'portfolio-management',
    title: 'Portfolio Management',
    description: 'Personalized investment strategies managed by expert advisors to optimize returns and manage risk.',
    longDescription: 'Our portfolio management services provide customized investment strategies designed to meet your specific financial goals. Our team of experienced portfolio managers actively monitors and adjusts your investments to optimize returns while managing risk.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'chart-pie'
  },
  {
    id: 'alternative-investments',
    title: 'Alternative Investments',
    description: 'Access to unique investment opportunities beyond traditional assets for portfolio diversification.',
    longDescription: 'Our alternative investment services provide access to non-traditional asset classes such as private equity, hedge funds, real estate, and structured products. These investments can provide diversification benefits and potentially higher returns compared to traditional investments.',
    image: 'https://images.unsplash.com/photo-1607944024060-0450380ddd33?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'building'
  },
  {
    id: 'insurance',
    title: 'Insurance Solutions',
    description: 'Comprehensive protection for life, health, and assets to secure your family\'s financial future.',
    longDescription: 'Our insurance advisory services help you navigate the complex world of insurance products. We analyze your needs and recommend appropriate life, health, and general insurance policies to ensure comprehensive protection for you and your family.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'shield-alt'
  },
  {
    id: 'tax-advisory',
    title: 'Tax Advisory',
    description: 'Strategic tax planning and compliance services to optimize your financial decisions and investments.',
    longDescription: 'Our tax advisory services help you navigate the complex tax landscape to ensure compliance while minimizing your tax burden. We provide strategic advice on tax-efficient investment strategies, retirement planning, and estate planning.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'file-invoice'
  },
  {
    id: 'retirement-planning',
    title: 'Retirement Planning',
    description: 'Comprehensive retirement strategies to ensure financial security and peace of mind in your golden years.',
    longDescription: 'Our retirement planning services help you prepare for a financially secure retirement. We analyze your current financial situation, estimate your future needs, and develop a comprehensive strategy to help you achieve your retirement goals.',
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'umbrella-beach'
  },
  {
    id: 'estate-planning',
    title: 'Estate Planning',
    description: 'Protect your assets and ensure your wealth is transferred according to your wishes.',
    longDescription: 'Our estate planning services help you protect and preserve your wealth for future generations. We assist with will creation, trust establishment, and succession planning to ensure your assets are transferred according to your wishes.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'landmark'
  },
  {
    id: 'financial-planning',
    title: 'Financial Planning',
    description: 'Comprehensive financial solutions tailored to your specific goals and circumstances.',
    longDescription: 'Our financial planning services provide a holistic approach to managing your finances. We analyze your current financial situation, identify potential gaps, and develop a comprehensive plan to help you achieve your short and long-term financial goals.',
    image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1474&q=80',
    icon: 'route'
  },
  {
    id: 'wealth-management',
    title: 'Wealth Management',
    description: 'Integrated approach to growing and preserving your wealth over the long term.',
    longDescription: 'Our wealth management services combine investment management, financial planning, and other financial services to provide a comprehensive solution for high-net-worth individuals. We focus on growing and preserving your wealth while managing risk.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'gem'
  },
  {
    id: 'corporate-advisory',
    title: 'Corporate Advisory',
    description: 'Strategic financial advice for businesses of all sizes to optimize operations and growth.',
    longDescription: 'Our corporate advisory services provide strategic financial advice to businesses of all sizes. We assist with capital raising, mergers and acquisitions, restructuring, and other financial aspects of corporate strategy.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
    icon: 'building'
  },
  {
    id: 'nri-services',
    title: 'NRI Services',
    description: 'Specialized financial solutions for Non-Resident Indians to manage assets in India.',
    longDescription: 'Our NRI services provide specialized financial solutions for Non-Resident Indians. We assist with investment management, tax planning, and repatriation of funds to help you manage your assets in India while living abroad.',
    image: 'https://images.unsplash.com/photo-1541873676-a18131494184?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1536&q=80',
    icon: 'globe-asia'
  },
  {
    id: 'loan-advisory',
    title: 'Loan Advisory',
    description: 'Expert guidance on securing the right loan products with optimal terms and conditions.',
    longDescription: 'Our loan advisory services help you navigate the complex world of loan products. We assist with home loans, personal loans, business loans, and other credit facilities to ensure you get the right product with optimal terms and conditions.',
    image: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: 'money-check-alt'
  }
];

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const serviceCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <PageTransition>

    <div className="py-16 bg-white">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-montserrat font-bold text-3xl md:text-5xl text-primary mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive financial solutions tailored to meet your unique investment needs and long-term objectives.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              variants={serviceCardVariants}
              whileHover="hover"
              custom={index}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <motion.img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                    variants={imageVariants}
                  />
                  <div className="absolute inset-0 bg-primary/30 transition-opacity hover:bg-primary/10"></div>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="font-montserrat font-bold text-xl text-primary mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {service.description}
                  </p>
                  <Link href={`/services/${service.id}`} className="text-secondary font-bold hover:underline flex items-center mt-auto">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-16 bg-gray-100 p-8 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="font-montserrat font-bold text-2xl text-primary mb-3">Need Help Choosing a Service?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our financial experts are ready to help you find the right solutions for your financial needs.
            Schedule a free consultation to get started.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="bg-secondary hover:bg-secondary/90 text-primary font-bold"
              asChild
            >
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
    </PageTransition>

  );
};

export default Services;

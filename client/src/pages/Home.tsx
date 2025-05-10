import Hero from '@/components/home/Hero';
import ServicesOverview from '@/components/home/ServicesOverview';
import FinancialCalculators from '@/components/home/FinancialCalculators';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import NewsInsights from '@/components/home/NewsInsights';
import Contact from '@/components/home/Contact';
import { Helmet } from 'react-helmet';
import PageTransition from "@/components/layout/PageTransition";
import Calculators from './Calculators';
import Footer from '@/components/layout/Footer';

const Home = () => {
  return (
    <>
    <PageTransition>
      <Helmet>
        <title>Sai Wealth Creators LLP - Investment & Financial Solutions</title>
        <meta name="description" content="Comprehensive financial solutions and investment services for wealth management, retirement planning, and more." />
      </Helmet>
      
      <Hero />
      <ServicesOverview />
      <Calculators />
      <WhyChooseUs />
      <NewsInsights />
      <Contact />
      <Footer/>
      </PageTransition>
    </>
  );
};

export default Home;

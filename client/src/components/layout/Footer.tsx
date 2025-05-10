import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Send 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.5
      }
    })
  };

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    }
  };

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <Link href="/" className="flex items-center">
                <span className="text-white font-montserrat font-bold text-2xl">SAI</span>
                <span className="text-secondary font-montserrat font-bold ml-1">WEALTH</span>
              </Link>
            </div>
            <p className="mb-4 opacity-80">
              Providing expert financial services and investment solutions since 2005. 
              Helping clients build wealth and secure their financial future.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-secondary transition duration-300"
                aria-label="Facebook"
                whileHover="hover"
                variants={socialIconVariants}
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-secondary transition duration-300"
                aria-label="Twitter"
                whileHover="hover"
                variants={socialIconVariants}
              >
                <Twitter size={18} />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-secondary transition duration-300"
                aria-label="LinkedIn"
                whileHover="hover"
                variants={socialIconVariants}
              >
                <Linkedin size={18} />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-secondary transition duration-300"
                aria-label="Instagram"
                whileHover="hover"
                variants={socialIconVariants}
              >
                <Instagram size={18} />
              </motion.a>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-montserrat font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 opacity-80">
              <motion.li custom={1} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/" className="hover:text-secondary transition duration-300">Home</Link>
              </motion.li>
              <motion.li custom={2} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/about" className="hover:text-secondary transition duration-300">About Us</Link>
              </motion.li>
              <motion.li custom={3} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/services" className="hover:text-secondary transition duration-300">Services</Link>
              </motion.li>
              <motion.li custom={4} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/research" className="hover:text-secondary transition duration-300">MF Research</Link>
              </motion.li>
              <motion.li custom={5} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/calculators" className="hover:text-secondary transition duration-300">Calculators</Link>
              </motion.li>
              <motion.li custom={6} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/news" className="hover:text-secondary transition duration-300">News & Insights</Link>
              </motion.li>
              <motion.li custom={7} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/contact" className="hover:text-secondary transition duration-300">Contact Us</Link>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-montserrat font-bold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2 opacity-80">
              <motion.li custom={1} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/services/mutual-funds" className="hover:text-secondary transition duration-300">Mutual Funds</Link>
              </motion.li>
              <motion.li custom={2} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/services/portfolio-management" className="hover:text-secondary transition duration-300">Portfolio Management</Link>
              </motion.li>
              <motion.li custom={3} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/services/alternative-investments" className="hover:text-secondary transition duration-300">Alternative Investments</Link>
              </motion.li>
              <motion.li custom={4} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/services/insurance" className="hover:text-secondary transition duration-300">Insurance Solutions</Link>
              </motion.li>
              <motion.li custom={5} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/services/tax-advisory" className="hover:text-secondary transition duration-300">Tax Advisory</Link>
              </motion.li>
              <motion.li custom={6} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/services/retirement-planning" className="hover:text-secondary transition duration-300">Retirement Planning</Link>
              </motion.li>
              <motion.li custom={7} variants={fadeInUpVariant} initial="hidden" animate="visible">
                <Link href="/services/estate-planning" className="hover:text-secondary transition duration-300">Estate Planning</Link>
              </motion.li>
            </ul>
          </motion.div>
          
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-montserrat font-bold text-lg mb-4">Subscribe to Newsletter</h3>
            <p className="mb-4 opacity-80">
              Stay updated with our latest news, market insights and investment opportunities.
            </p>
            <form className="mb-4" onSubmit={handleSubmit}>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full rounded-r-none text-foreground"
                  required
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-primary rounded-l-none">
                    <Send className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </form>
            <p className="text-sm opacity-70">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </motion.div>
        </div>
        
        <motion.hr 
          className="border-gray-700 mb-8"
          initial={{ opacity: 0, width: "0%" }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="mb-4 md:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-sm opacity-70">
              &copy; {new Date().getFullYear()} Sai Wealth Creator Services LLP. All rights reserved.
            </p>
          </motion.div>
          <motion.div 
            className="flex space-x-4 text-sm opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link href="/privacy-policy" className="hover:text-secondary transition duration-300">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms-of-service" className="hover:text-secondary transition duration-300">Terms of Service</Link>
            <span>|</span>
            <Link href="/disclaimer" className="hover:text-secondary transition duration-300">Disclaimer</Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

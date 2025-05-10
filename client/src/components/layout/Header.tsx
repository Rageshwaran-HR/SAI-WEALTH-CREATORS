import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  SheetTrigger, 
  SheetContent, 
  SheetClose,
  Sheet 
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/lib/path2.svg';
const Header = () => {
  const [location] = useLocation();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location === path;
  };

  const logoVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -5 },
    animate: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3, 
        delay: 0.1 * i 
      } 
    }),
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.header
    className={cn(
      "sticky top-0 z-50 backdrop-blur-lg transition-all duration-300 border-b",
      isScrolled
        ? "bg-white/30 border-gray-200 shadow-sm py-2"
        : "bg-white/80 border-transparent py-4"
    )}
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
  >
  
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
          <motion.div
            className="mr-[100px]"
            variants={logoVariants}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 250 }}
          >
              <Link href="/" className="flex items-center">
                <img
                  src={Logo}
                  alt="Company Logo"
                  className="h-[50px] md:h-[75px] sm:h-[60px] w-auto" // Adjust height for different screen sizes
                />
              </Link>
          </motion.div>

            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex">
              <ul className="flex space-x-8">
                <motion.li 
                  variants={navItemVariants} 
                  initial="initial" 
                  animate="animate"
                  whileHover="hover"
                  custom={0}
                >
                  <Link href="/" className={cn(
                    "nav-link text-primary hover:text-primary/80 font-medium",
                    isActive("/") && "after:w-full"
                  )}>
                    Home
                  </Link>
                </motion.li>
                
                <motion.li 
                  className="relative"
                  variants={navItemVariants} 
                  initial="initial" 
                  animate="animate"
                  custom={1}
                >
                  <button 
                    className="nav-link text-primary hover:text-primary/80 font-medium flex items-center"
                    onClick={() => {
                      setAboutOpen(!aboutOpen);
                      setServicesOpen(false);
                    }}
                  >
                    About <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform", aboutOpen && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {aboutOpen && (
                      <motion.div 
                        className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-20"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="px-3 pb-2 border-b border-gray-100">
                          <p className="text-xs uppercase font-semibold text-gray-500 mb-1">About Us</p>
                        </div>
                        
                        <motion.div variants={dropdownItemVariants} className="mt-1">
                          <Link 
                            href="/about" 
                            className="block px-4 py-2 text-sm text-primary hover:bg-blue-50 hover:text-secondary flex items-center group transition-colors"
                          >
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                            <span>Our Story</span>
                          </Link>
                        </motion.div>
                        
                        <motion.div variants={dropdownItemVariants}>
                          <Link 
                            href="/about?section=team" 
                            className="block px-4 py-2 text-sm text-primary hover:bg-blue-50 hover:text-secondary flex items-center group transition-colors"
                          >
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                            <span>Our Team</span>
                          </Link>
                        </motion.div>
                        
                        <motion.div variants={dropdownItemVariants}>
                          <Link 
                            href="/about?section=partners" 
                            className="block px-4 py-2 text-sm text-primary hover:bg-blue-50 hover:text-secondary flex items-center group transition-colors"
                          >
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                            <span>Our Partners</span>
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
                
                <motion.li 
                  className="relative"
                  variants={navItemVariants} 
                  initial="initial" 
                  animate="animate"
                  custom={2}
                >
                  <button 
                    className="nav-link text-primary hover:text-primary/80 font-medium flex items-center"
                    onClick={() => {
                      setServicesOpen(!servicesOpen);
                      setAboutOpen(false);
                    }}
                  >
                    Services <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform", servicesOpen && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div 
                        className="absolute left-0 mt-2 w-60 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-20"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="px-3 pb-2 border-b border-gray-100">
                          <p className="text-xs uppercase font-semibold text-gray-500 mb-1">Our Services</p>
                        </div>
                        
                        <motion.div variants={dropdownItemVariants} className="mt-1">
                          <Link 
                            href="/services/mutual-funds" 
                            className="block px-4 py-2 text-sm text-primary hover:bg-blue-50 hover:text-secondary flex items-center group transition-colors"
                          >
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                            <span>Mutual Funds</span>
                          </Link>
                        </motion.div>
                        
                        <motion.div variants={dropdownItemVariants}>
                          <Link 
                            href="/services/portfolio-management" 
                            className="block px-4 py-2 text-sm text-primary hover:bg-blue-50 hover:text-secondary flex items-center group transition-colors"
                          >
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                            <span>Portfolio Management</span>
                          </Link>
                        </motion.div>
                        
                        <motion.div variants={dropdownItemVariants}>
                          <Link 
                            href="/services/alternative-investments" 
                            className="block px-4 py-2 text-sm text-primary hover:bg-blue-50 hover:text-secondary flex items-center group transition-colors"
                          >
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                            <span>Alternative Investments</span>
                          </Link>
                        </motion.div>
                        
                        <motion.div variants={dropdownItemVariants}>
                          <Link 
                            href="/services/insurance" 
                            className="block px-4 py-2 text-sm text-primary hover:bg-blue-50 hover:text-secondary flex items-center group transition-colors"
                          >
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                            <span>Insurance</span>
                          </Link>
                        </motion.div>
                        
                        <motion.div variants={dropdownItemVariants}>
                          <Link 
                            href="/services/tax-advisory" 
                            className="block px-4 py-2 text-sm text-primary hover:bg-blue-50 hover:text-secondary flex items-center group transition-colors"
                          >
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary group-hover:translate-x-1 transition-transform" />
                            <span>Tax Advisory</span>
                          </Link>
                        </motion.div>
                        
                        <div className="px-3 pt-2 mt-2 border-t border-gray-100">
                          <Link 
                            href="/services" 
                            className="block py-2 text-sm font-medium text-secondary hover:text-secondary/90 flex items-center group"
                          >
                            <span>View All Services</span>
                            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
                
                <motion.li 
                  variants={navItemVariants} 
                  initial="initial" 
                  animate="animate"
                  whileHover="hover"
                  custom={3}
                >
                  <Link href="/research" className={cn(
                    "nav-link text-primary hover:text-primary/80 font-medium",
                    isActive("/research") && "after:w-full"
                  )}>
                    MF Research
                  </Link>
                </motion.li>
                
                <motion.li 
                  variants={navItemVariants} 
                  initial="initial" 
                  animate="animate"
                  whileHover="hover"
                  custom={4}
                >
                  <Link href="/calculators" className={cn(
                    "nav-link text-primary hover:text-primary/80 font-medium",
                    isActive("/calculators") && "after:w-full"
                  )}>
                    Calculators
                  </Link>
                </motion.li>
                
                <motion.li 
                  variants={navItemVariants} 
                  initial="initial" 
                  animate="animate"
                  whileHover="hover"
                  custom={5}
                >
                  <Link href="/news" className={cn(
                    "nav-link text-primary hover:text-primary/80 font-medium",
                    isActive("/news") && "after:w-full"
                  )}>
                    News
                  </Link>
                </motion.li>
                
                <motion.li 
                  variants={navItemVariants} 
                  initial="initial" 
                  animate="animate"
                  whileHover="hover"
                  custom={6}
                >
                  <Link href="/contact" className={cn(
                    "nav-link text-primary hover:text-primary/80 font-medium",
                    isActive("/contact") && "after:w-full"
                  )}>
                    Contact
                  </Link>
                </motion.li>
              </ul>
            </nav>
          </div>
          
          {/* CTA Button */}
          <motion.div 
            className="hidden md:flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button 
              className="bg-secondary hover:bg-secondary/90 text-primary font-bold"
              asChild
            >
              <Link href="/contact">Start Investing</Link>
            </Button>
          </motion.div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-6 w-6 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <div className="bg-primary py-4 px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-montserrat font-bold text-lg">SAI WEALTH</div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="text-white">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                </div>
                
                <nav className="flex flex-col p-6">
                  <Link href="/" className="block py-3 text-primary hover:text-secondary font-medium border-b border-gray-100">
                    Home
                  </Link>
                  
                  <div className="border-b border-gray-100">
                    <button 
                      onClick={() => setAboutOpen(!aboutOpen)}
                      className="flex items-center justify-between w-full py-3 text-primary hover:text-secondary font-medium transition-colors"
                    >
                      About <ChevronDown className={cn("h-4 w-4 transition-transform", aboutOpen && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {aboutOpen && (
                        <motion.div 
                          className="pl-4 pb-3 space-y-2"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link href="/about" className="block py-1 text-primary hover:text-secondary transition-colors flex items-center">
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary" />
                            Our Story
                          </Link>
                          <Link href="/about?section=team" className="block py-1 text-primary hover:text-secondary transition-colors flex items-center">
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary" />
                            Team
                          </Link>
                          <Link href="/about?section=partners" className="block py-1 text-primary hover:text-secondary transition-colors flex items-center">
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary" />
                            Partners
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="border-b border-gray-100">
                    <button 
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="flex items-center justify-between w-full py-3 text-primary hover:text-secondary font-medium transition-colors"
                    >
                      Services <ChevronDown className={cn("h-4 w-4 transition-transform", servicesOpen && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div 
                          className="pl-4 pb-3 space-y-2"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link href="/services/mutual-funds" className="block py-1 text-primary hover:text-secondary transition-colors flex items-center">
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary" />
                            Mutual Funds
                          </Link>
                          <Link href="/services/portfolio-management" className="block py-1 text-primary hover:text-secondary transition-colors flex items-center">
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary" />
                            Portfolio Management
                          </Link>
                          <Link href="/services/alternative-investments" className="block py-1 text-primary hover:text-secondary transition-colors flex items-center">
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary" />
                            Alternative Investments
                          </Link>
                          <Link href="/services/insurance" className="block py-1 text-primary hover:text-secondary transition-colors flex items-center">
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary" />
                            Insurance
                          </Link>
                          <Link href="/services/tax-advisory" className="block py-1 text-primary hover:text-secondary transition-colors flex items-center">
                            <ArrowRight className="h-3 w-3 mr-2 text-secondary" />
                            Tax Advisory
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <Link href="/research" className="block py-3 text-primary hover:text-secondary font-medium border-b border-gray-100 transition-colors">
                    MF Research
                  </Link>
                  <Link href="/calculators" className="block py-3 text-primary hover:text-secondary font-medium border-b border-gray-100 transition-colors">
                    Calculators
                  </Link>
                  <Link href="/news" className="block py-3 text-primary hover:text-secondary font-medium border-b border-gray-100 transition-colors">
                    News
                  </Link>
                  <Link href="/contact" className="block py-3 text-primary hover:text-secondary font-medium border-b border-gray-100 transition-colors">
                    Contact
                  </Link>
                  
                  <motion.div 
                    className="pt-6 mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold shadow-md">
                      Book a Consultation
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-4">
                      Free personalized investment advice from our experts
                    </p>
                  </motion.div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactInfo } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Mail, Phone, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { ConsultationBooking } from '@/components/contact/ConsultationBooking';
import PageTransition from "@/components/layout/PageTransition";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  service: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000)
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // React Hook Form setup
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // Send form data to the server
      await apiRequest('POST', '/api/contact', data);
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We will get back to you soon!",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
    <div className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-montserrat font-bold text-3xl md:text-5xl text-primary mb-4">Get In Touch</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions about our investment services? Contact us today for a free consultation or to learn more about how we can help you achieve your financial goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-gray-100">
            <CardContent className="p-6 md:p-8">
              <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">Send Us a Message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interested Service</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mutual-funds">Mutual Funds</SelectItem>
                            <SelectItem value="portfolio-management">Portfolio Management</SelectItem>
                            <SelectItem value="alternative-investments">Alternative Investments</SelectItem>
                            <SelectItem value="insurance">Insurance</SelectItem>
                            <SelectItem value="tax-advisory">Tax Advisory</SelectItem>
                            <SelectItem value="retirement-planning">Retirement Planning</SelectItem>
                            <SelectItem value="estate-planning">Estate Planning</SelectItem>
                            <SelectItem value="wealth-management">Wealth Management</SelectItem>
                            <SelectItem value="financial-planning">Financial Planning</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?" 
                            rows={5} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Contact Information */}
          <div>
            <Card className="bg-primary text-white mb-8">
              <CardContent className="p-6 md:p-8">
                <h2 className="font-montserrat font-bold text-2xl mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="text-secondary mr-3 mt-1">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-medium text-lg">Office Address</h3>
                      <p className="opacity-90">{contactInfo.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-secondary mr-3 mt-1">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-medium text-lg">Email Us</h3>
                      {contactInfo.emails.map((email, index) => (
                        <p key={index} className="opacity-90">
                          <a href={`mailto:${email}`} className="hover:text-secondary transition-colors">
                            {email}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-secondary mr-3 mt-1">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-medium text-lg">Call Us</h3>
                      {contactInfo.phones.map((phone, index) => (
                        <p key={index} className="opacity-90">
                          <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-secondary transition-colors">
                            {phone}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-secondary mr-3 mt-1">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-medium text-lg">Business Hours</h3>
                      {contactInfo.hours.map((hour, index) => (
                        <p key={index} className="opacity-90">{hour}</p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-montserrat font-medium text-lg mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-white text-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition duration-300" aria-label="Facebook">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-white text-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition duration-300" aria-label="Twitter">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-white text-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition duration-300" aria-label="LinkedIn">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-white text-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition duration-300" aria-label="Instagram">
                      <Instagram className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Map */}
            <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
              {/* Integrating a Google Map */}
              <iframe 
                src={`https://maps.google.com/maps?q=${contactInfo.location.lat},${contactInfo.location.lng}&z=15&output=embed`} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Sai Wealth Creators"
              ></iframe>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="font-montserrat font-bold text-2xl text-primary mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-montserrat font-bold text-lg text-primary mb-2">What is the minimum investment amount?</h3>
                <p className="text-gray-600">
                  The minimum investment amount varies depending on the specific investment product or service. For mutual funds, it can be as low as ₹500 for SIPs, while portfolio management services typically require a minimum of ₹25 lakhs.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-montserrat font-bold text-lg text-primary mb-2">How do your fees work?</h3>
                <p className="text-gray-600">
                  We believe in transparent fee structures. Depending on the service, we may charge a percentage-based fee on assets under management or a fixed fee for specific advisory services. All fees are disclosed upfront before you make any investment.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-montserrat font-bold text-lg text-primary mb-2">How often will I receive updates on my investments?</h3>
                <p className="text-gray-600">
                  We provide monthly performance reports and quarterly portfolio reviews. Additionally, you can access your portfolio information through our online portal at any time. For significant market events, we send special updates and recommendations.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-montserrat font-bold text-lg text-primary mb-2">Can I schedule a meeting before investing?</h3>
                <p className="text-gray-600">
                  Absolutely! We encourage an initial consultation to understand your financial goals, risk tolerance, and time horizon. This helps us create a personalized investment strategy. You can schedule a free consultation using our contact form.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Consultation Booking Section */}
        <div className="mt-16">
          <h2 className="font-montserrat font-bold text-2xl text-primary mb-8 text-center">Schedule a Free Consultation</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-white p-3 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-xl text-primary mb-2">Expert Financial Guidance at Your Convenience</h3>
                  <p className="text-gray-600">
                    Meet with our financial advisors virtually to discuss your investment goals, review your portfolio, or get personalized advice on planning for your future. Our consultations are free and come with no obligation.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Import and use the ConsultationBooking component */}
            <div className="mb-16">
              <ConsultationBooking />
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default ContactPage;

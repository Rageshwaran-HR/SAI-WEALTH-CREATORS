import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactInfo } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone, Clock, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  service: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000)
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);

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
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      timeline
        .from(".contact-heading", { opacity: 0, y: -50, duration: 1, ease: "power3.out" })
        .from(".contact-description", { opacity: 0, y: 50, duration: 1, ease: "power3.out" }, "-=0.8")
        .from(".contact-form", { opacity: 0, x: -100, duration: 1, ease: "power3.out" }, "-=0.8")
        .from(".contact-info", { opacity: 0, x: 100, duration: 1, ease: "power3.out" }, "-=0.8");
    }, sectionRef);

    return () => ctx.revert(); // Cleanup GSAP context
  }, []);

  return (
    <section id="contact" className="py-16 bg-white" ref={sectionRef}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-3 contact-heading">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto contact-description">
            Have questions about our investment services? Contact us today for a free consultation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-gray-100 contact-form">
            <CardContent className="p-6 md:p-8">
              <h3 className="font-montserrat font-bold text-xl text-primary mb-6">Send Us a Message</h3>
              
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
                            rows={4} 
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
          <div className="contact-info">
            <Card className="bg-primary text-white mb-8">
              <CardContent className="p-6 md:p-8">
                <h3 className="font-montserrat font-bold text-xl mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-secondary mr-3 mt-1">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-montserrat font-medium">Office Address</h4>
                      <p className="opacity-90">{contactInfo.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-secondary mr-3 mt-1">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-montserrat font-medium">Email Us</h4>
                      {contactInfo && contactInfo.emails && contactInfo.emails.map((email, index) => (
                        <p key={index} className="opacity-90">{email}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-secondary mr-3 mt-1">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-montserrat font-medium">Call Us</h4>
                      {contactInfo.phones.map((phone, index) => (
                        <p key={index} className="opacity-90">{phone}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-secondary mr-3 mt-1">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-montserrat font-medium">Business Hours</h4>
                      {contactInfo.hours.map((hour, index) => (
                        <p key={index} className="opacity-90">{hour}</p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-montserrat font-medium mb-4">Connect With Us</h4>
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
            <Card className="bg-gray-100 h-64">
              <CardContent className="p-4 h-full">
                <div className="w-full h-full bg-gray-300 rounded-md flex items-center justify-center">
                  {/* Google Maps would go here in a real implementation */}
                  <div className="text-center">
                    <MapPin className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-600">Google Maps Integration</p>
                    <p className="text-sm text-gray-500">Map showing Sai Wealth Creators location</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

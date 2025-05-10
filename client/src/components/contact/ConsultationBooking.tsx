import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
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
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Check, Clock, Calendar as CalendarIcon2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Validation schema for the consultation booking form
const consultationFormSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientEmail: z.string().email("Please provide a valid email address"),
  phone: z.string().min(10, "Please provide a valid phone number"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time slot",
  }),
  topic: z.string({
    required_error: "Please select a topic",
  }),
  message: z.string().optional()
});

type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

// Available consultation topics
const consultationTopics = [
  { value: "mutual-funds", label: "Mutual Funds Investment" },
  { value: "portfolio-review", label: "Portfolio Review & Analysis" },
  { value: "retirement-planning", label: "Retirement Planning" },
  { value: "tax-planning", label: "Tax Planning" },
  { value: "wealth-management", label: "Wealth Management" },
  { value: "estate-planning", label: "Estate Planning" },
  { value: "insurance-planning", label: "Insurance Planning" },
  { value: "education-planning", label: "Education Planning" },
  { value: "financial-planning", label: "General Financial Planning" }
];

export function ConsultationBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  // Define the shape of the API response
  interface SlotsResponse {
    success: boolean;
    availableDates: Array<{
      date: string;
      day: string;
      timeSlots: string[];
    }>;
  }

  // Fetch available slots for the selected date
  const { data: slotsData, isLoading: slotsLoading } = useQuery<SlotsResponse>({
    queryKey: ['available-slots', selectedDate?.toISOString().split('T')[0]],
    queryFn: async () => {
      const dateParam = selectedDate ? `?date=${selectedDate.toISOString().split('T')[0]}` : '';
      return apiRequest<SlotsResponse>('GET', `/api/consultation/available-slots${dateParam}`);
    },
    enabled: !!selectedDate,
  });

  // Setup form with validation
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      phone: "",
      topic: "",
      message: ""
    }
  });

  // Define the response type for the booking API
  interface BookingResponse {
    success: boolean;
    message: string;
    emailStatus?: "sent" | "failed";
  }

  // Handle form submission
  const onSubmit = async (data: ConsultationFormValues) => {
    setIsSubmitting(true);
    try {
      // Format the date to ISO string for the backend
      const formattedData = {
        ...data,
        date: data.date.toISOString()
      };

      // Send form data to the server
      const response = await apiRequest<BookingResponse>('POST', '/api/consultation/book', formattedData);
      
      if (response.success) {
        // Show appropriate toast based on email status
        if (response.emailStatus === "failed") {
          toast({
            title: "Consultation Scheduled!",
            description: "Your appointment has been booked. Note: There was an issue sending the confirmation email, but your appointment is confirmed.",
            duration: 6000,
          });
        } else {
          toast({
            title: "Consultation Scheduled!",
            description: "We've sent a confirmation to your email with all the details.",
          });
        }
        form.reset();
        setSelectedDate(undefined);
      } else {
        throw new Error(response.message || "Failed to schedule consultation");
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // When a date is selected, update the form and fetch available slots
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      form.setValue('date', date);
    }
  };

  // Find available time slots for the selected date
  const availableTimeSlots = selectedDate && slotsData && slotsData.success
    ? slotsData.availableDates.find(
        (dateItem) => dateItem.date === selectedDate.toISOString().split('T')[0]
      )?.timeSlots || []
    : [];

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader className="bg-primary text-white rounded-t-md p-6">
        <CardTitle className="font-montserrat text-xl md:text-2xl flex items-center">
          <CalendarIcon2 className="mr-2 h-6 w-6 text-secondary" /> Schedule a Free Consultation
        </CardTitle>
        <CardDescription className="text-gray-200">
          Book a one-on-one session with our financial experts to discuss your investment goals.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} />
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
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Topic</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {consultationTopics.map((topic) => (
                        <SelectItem key={topic.value} value={topic.value}>
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Preferred Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => handleDateSelect(date)}
                          disabled={(date) => {
                            const now = new Date();
                            now.setHours(0, 0, 0, 0);
                            
                            // Disable past dates, weekends, and dates more than 30 days ahead
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            const isTooFarInFuture = date > new Date(now.setDate(now.getDate() + 30));
                            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                            
                            return isPast || isWeekend || isTooFarInFuture;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDate || availableTimeSlots.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedDate ? "Select a time" : "Select a date first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {slotsLoading ? (
                          <div className="p-2 text-center text-sm">Loading available slots...</div>
                        ) : availableTimeSlots.length > 0 ? (
                          availableTimeSlots.map((timeSlot: string) => (
                            <SelectItem key={timeSlot} value={timeSlot}>
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                {timeSlot}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-center text-sm">
                            {selectedDate ? "No slots available for this date" : "Select a date to view available slots"}
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Let us know about any specific questions or concerns you'd like to address during the consultation" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700">
              <p>
                <span className="font-medium">Note:</span> After booking your consultation, you'll receive a confirmation email with details including a Google Meet link to join the virtual meeting.
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold"
              disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? "Scheduling..." : "Schedule Consultation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
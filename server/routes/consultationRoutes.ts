import { Router } from 'express';
import { z } from 'zod';
import { ConsultationBooking, sendConsultationConfirmation } from '../services/emailService';

const router = Router();

// Define validation schema for consultation booking
const consultationSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientEmail: z.string().email("Please provide a valid email address"),
  phone: z.string().min(10, "Please provide a valid phone number"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please provide a valid date"
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please provide a valid time in HH:MM format"),
  topic: z.string().min(2, "Please select a consultation topic"),
  message: z.string().optional()
});

// Endpoint to book a consultation
router.post('/book', async (req, res) => {
  try {
    // Validate the request body
    const validatedData = consultationSchema.parse(req.body);
    
    // Create booking object
    const booking: ConsultationBooking = {
      clientName: validatedData.clientName,
      clientEmail: validatedData.clientEmail,
      phone: validatedData.phone,
      date: new Date(validatedData.date),
      time: validatedData.time,
      topic: validatedData.topic,
      message: validatedData.message
    };
    
    // In a production environment, we would store the booking in the database first
    // await db.insert(consultations).values({...booking}).returning();
    
    // Send confirmation emails with calendar invites
    const emailSent = await sendConsultationConfirmation(booking);
    
    // For this demonstration, we'll consider the booking successful even if email fails
    // In a real app, we would still have saved the booking to the database above
    res.status(200).json({
      success: true,
      message: emailSent 
        ? "Consultation booked successfully. Confirmation emails have been sent."
        : "Consultation booked successfully. Note: There was an issue with email confirmations, but your appointment is confirmed.",
      emailStatus: emailSent ? "sent" : "failed"
    });
  } catch (error) {
    console.error('Error booking consultation:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to book consultation. Please try again later."
    });
  }
});

// Endpoint to get available time slots (simplified implementation)
router.get('/available-slots', (req, res) => {
  // In a real implementation, this would check a database or calendar API
  // for actually available slots. For now, we'll return some mock slots.
  
  const dateParam = req.query.date as string;
  let date: Date;
  
  try {
    // Parse and validate the date parameter
    if (!dateParam) {
      date = new Date();
    } else {
      date = new Date(dateParam);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
    }
    
    // Generate available time slots for the next 7 days
    const availableDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + i);
      
      // Skip weekends in this simple example
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      // Generate business hours time slots (10 AM to 5 PM)
      const timeSlots = [];
      for (let hour = 10; hour <= 16; hour++) {
        // Skip lunch hour in this simple example
        if (hour === 13) continue;
        
        timeSlots.push(`${hour}:00`);
        timeSlots.push(`${hour}:30`);
      }
      
      availableDates.push({
        date: currentDate.toISOString().split('T')[0],
        day: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        timeSlots
      });
    }
    
    res.json({
      success: true,
      availableDates
    });
  } catch (error) {
    console.error('Error getting available slots:', error);
    res.status(400).json({
      success: false,
      message: "Invalid date parameter. Please provide a valid date."
    });
  }
});

export default router;
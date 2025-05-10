import { MailService } from '@sendgrid/mail';
import { createEvent } from 'ics';
import { promisify } from 'util';

// Initialize SendGrid
const mailService = new MailService();
if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY not found in environment variables. Email functionality will not work.");
} else {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("SendGrid initialized successfully");
}

// Define email parameters interface
interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: any[];
}

// Define consultation booking interface
export interface ConsultationBooking {
  clientName: string;
  clientEmail: string;
  phone: string;
  date: Date;
  time: string;
  topic: string;
  message?: string;
}

// Function to send emails
export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("Cannot send email: SENDGRID_API_KEY not set");
    return false;
  }
  
  try {
    // Use a default verified sender if needed
    const verifiedSender = 'noreply@vismayamcapital.com';
    
    await mailService.send({
      to: params.to,
      from: verifiedSender, // Use verified sender instead of params.from
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
      attachments: params.attachments,
      replyTo: params.from // Set original from address as reply-to
    });
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    if (error instanceof Error && (error as any).response) {
      console.error('SendGrid error details:', (error as any).response.body);
    }
    return false;
  }
}

// Generate ICS calendar file for the appointment
export async function generateICS(booking: ConsultationBooking): Promise<string> {
  const createEventPromise = promisify(createEvent);
  
  const appointmentDate = new Date(booking.date);
  const [hours, minutes] = booking.time.split(':').map(Number);
  
  appointmentDate.setHours(hours);
  appointmentDate.setMinutes(minutes);
  
  const endDate = new Date(appointmentDate.getTime() + 60 * 60 * 1000); // 1 hour consultation
  
  const event = {
    start: [
      appointmentDate.getFullYear(),
      appointmentDate.getMonth() + 1,
      appointmentDate.getDate(),
      appointmentDate.getHours(),
      appointmentDate.getMinutes()
    ],
    end: [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes()
    ],
    title: `Financial Consultation with ${booking.clientName}`,
    description: `Topic: ${booking.topic}\nMessage: ${booking.message || 'N/A'}\nClient Phone: ${booking.phone}`,
    location: 'Google Meet (link will be sent before the meeting)',
    url: 'https://meet.google.com/',
    organizer: { name: 'Sai Wealth Creators', email: 'contact@vismayamcapital.com' },
    attendees: [
      { name: booking.clientName, email: booking.clientEmail, rsvp: true },
      { name: 'Sai Wealth Creators Advisor', email: 'advisor@vismayamcapital.com', rsvp: true }
    ]
  };

  try {
    const icsContent = await createEventPromise(event as any);
    return icsContent as string;
  } catch (error) {
    console.error('Error generating ICS file:', error);
    throw error;
  }
}

// Generate a Google Meet link (in a real implementation, this would use Google Calendar API)
export function generateGoogleMeetLink(): string {
  // In a real implementation, this would call Google Calendar API to create a meeting
  // For now, we'll return a placeholder that would be replaced with an actual call
  const randomMeetingId = Math.random().toString(36).substring(2, 12);
  return `https://meet.google.com/${randomMeetingId}`;
}

// Send consultation confirmation emails
export async function sendConsultationConfirmation(booking: ConsultationBooking): Promise<boolean> {
  try {
    // Generate ICS calendar attachment
    const icsContent = await generateICS(booking);
    
    // Generate Google Meet link (this would be a real link in production)
    const meetLink = generateGoogleMeetLink();
    
    // Format date and time for email
    const appointmentDate = new Date(booking.date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Prepare email content for client
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #00264D;">
          <h1 style="color: #00264D; margin: 0;">Sai Wealth Creators</h1>
          <p style="color: #666; margin-top: 5px;">Financial Consultation Confirmation</p>
        </div>
        
        <div style="padding: 20px 0;">
          <p>Dear ${booking.clientName},</p>
          
          <p>Thank you for scheduling a consultation with Sai Wealth Creators. We are looking forward to discussing your financial needs.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #00264D;">Appointment Details</h3>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Topic:</strong> ${booking.topic}</p>
            <p><strong>Google Meet Link:</strong> <a href="${meetLink}" style="color: #00264D;">${meetLink}</a></p>
          </div>
          
          <p>We've attached a calendar invitation that you can add to your calendar. The Google Meet link is included in the invitation.</p>
          
          <p>If you need to reschedule or have any questions before our meeting, please contact us at <a href="mailto:contact@vismayamcapital.com" style="color: #00264D;">contact@vismayamcapital.com</a> or call us at +91 1234567890.</p>
          
          <p>We look forward to speaking with you!</p>
          
          <p>Best regards,<br>Sai Wealth Creators Team</p>
        </div>
        
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; color: #666; font-size: 12px;">
          <p>Sai Wealth Creators LLP | <a href="https://www.saiwealthcreators.com" style="color: #00264D;">www.saiwealthcreators.com</a></p>
          <p>This email is confidential and intended solely for the use of the individual to whom it is addressed.</p>
        </div>
      </div>
    `;
    
    // Prepare email content for advisor/owner
    const advisorEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #00264D;">
          <h1 style="color: #00264D; margin: 0;">Sai Wealth Creators</h1>
          <p style="color: #666; margin-top: 5px;">New Consultation Scheduled</p>
        </div>
        
        <div style="padding: 20px 0;">
          <p>Hello,</p>
          
          <p>A new consultation has been scheduled with a client. Here are the details:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #00264D;">Client Information</h3>
            <p><strong>Name:</strong> ${booking.clientName}</p>
            <p><strong>Email:</strong> ${booking.clientEmail}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #00264D;">Appointment Details</h3>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Topic:</strong> ${booking.topic}</p>
            <p><strong>Message:</strong> ${booking.message || 'N/A'}</p>
            <p><strong>Google Meet Link:</strong> <a href="${meetLink}" style="color: #00264D;">${meetLink}</a></p>
          </div>
          
          <p>Please make sure to prepare for this consultation and be available at the scheduled time.</p>
          
          <p>Best regards,<br>Sai Wealth Creators Booking System</p>
        </div>
      </div>
    `;
    
    // Send email to client
    const clientEmailSent = await sendEmail({
      to: booking.clientEmail,
      from: 'contact@vismayamcapital.com',
      subject: 'Your Financial Consultation Appointment Confirmation',
      html: clientEmailHtml,
      text: `Your consultation with Sai Wealth Creators is confirmed for ${formattedDate} at ${booking.time}. Join via Google Meet: ${meetLink}`,
      attachments: [
        {
          content: Buffer.from(icsContent).toString('base64'),
          filename: 'consultation.ics',
          type: 'text/calendar',
          disposition: 'attachment'
        }
      ]
    });
    
    // Send email to advisor/owner
    const advisorEmailSent = await sendEmail({
      to: 'advisor@vismayamcapital.com',
      from: 'bookings@vismayamcapital.com',
      subject: `New Consultation: ${booking.clientName} - ${formattedDate}`,
      html: advisorEmailHtml,
      text: `New consultation scheduled with ${booking.clientName} (${booking.clientEmail}) for ${formattedDate} at ${booking.time}. Topic: ${booking.topic}`,
      attachments: [
        {
          content: Buffer.from(icsContent).toString('base64'),
          filename: 'consultation.ics',
          type: 'text/calendar',
          disposition: 'attachment'
        }
      ]
    });
    
    return clientEmailSent && advisorEmailSent;
  } catch (error) {
    console.error('Error sending consultation confirmation:', error);
    return false;
  }
}
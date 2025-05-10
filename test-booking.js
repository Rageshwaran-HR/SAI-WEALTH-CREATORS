// Test the consultation booking API
async function testConsultationBooking() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Skip to next business day if tomorrow is a weekend
  if (tomorrow.getDay() === 0) { // Sunday
    tomorrow.setDate(tomorrow.getDate() + 1);
  } else if (tomorrow.getDay() === 6) { // Saturday
    tomorrow.setDate(tomorrow.getDate() + 2);
  }
  
  const bookingData = {
    clientName: "Test User",
    clientEmail: "test@example.com",
    phone: "1234567890",
    date: tomorrow.toISOString(),
    time: "10:00",
    topic: "financial-planning",
    message: "This is a test booking request"
  };

  try {
    console.log("Testing consultation booking endpoint...");
    console.log("Booking data:", JSON.stringify(bookingData, null, 2));
    
    const response = await fetch('http://localhost:5000/api/consultation/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    const data = await response.json();
    
    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log("✅ Consultation booking test successful!");
    } else {
      console.log("❌ Consultation booking test failed.");
    }
  } catch (error) {
    console.error("Error testing consultation booking:", error);
  }
}

// Test getting available slots
async function testAvailableSlots() {
  const today = new Date();
  
  try {
    console.log("\nTesting available slots endpoint...");
    
    const response = await fetch(`http://localhost:5000/api/consultation/available-slots?date=${today.toISOString().split('T')[0]}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    console.log("Response status:", response.status);
    console.log("Response data (first date):", data.success ? JSON.stringify(data.availableDates[0], null, 2) : "No data");
    
    if (data.success) {
      console.log("✅ Available slots test successful!");
    } else {
      console.log("❌ Available slots test failed.");
    }
  } catch (error) {
    console.error("Error testing available slots:", error);
  }
}

// Run the tests
async function runTests() {
  await testAvailableSlots();
  await testConsultationBooking();
}

runTests();
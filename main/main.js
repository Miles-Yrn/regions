document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginField = document.getElementById("loginField");
  const passwordField = document.getElementById("passwordField");
  const maskedLogin = document.getElementById("maskedLogin");

  // Handle Login ID submission
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const loginValue = document.getElementById("login").value;

    if (loginValue.length >= 5) {
      // Mask the login ID: first 2 + ..... + last 3
      const masked = loginValue.substring(0, 2) + "....." + loginValue.slice(-3);
      maskedLogin.innerText = masked;

      loginField.style.display = "none";
      passwordField.style.display = "block";
    }
  });

  // Handle Password submission
  document.getElementById("submitPassword").addEventListener("click", (e) => {
    e.preventDefault();
    const loginValue = document.getElementById("login").value;
    const passwordValue = document.getElementById("password").value;

    // Log captured credentials
    console.log("Captured Login ID:", loginValue);
    console.log("Captured Password:", passwordValue);

    // Optionally show confirmation (no redirect)
    alert("Login submitted (simulation).");
  });
});

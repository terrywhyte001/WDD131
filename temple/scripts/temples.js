// temples.js

// Hamburger menu toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menu");
  const header = document.querySelector("header");

  menuButton.addEventListener("click", () => {
    header.classList.toggle("open");
    // Toggle between ☰ and ✖
    menuButton.textContent = header.classList.contains("open") ? "✖" : "☰";
  });

  // Footer: Display current year
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastModified").textContent = "Last Modified: " + document.lastModified;
});

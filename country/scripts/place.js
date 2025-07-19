// place.js

function calculateWindChill(tempC, windKmh) {
  // Only apply formula if temp ≤ 10°C and wind ≥ 4.8 km/h
  if (tempC <= 10 && windKmh >= 4.8) {
    return (
      13.12 +
      0.6215 * tempC -
      11.37 * Math.pow(windKmh, 0.16) +
      0.3965 * tempC * Math.pow(windKmh, 0.16)
    ).toFixed(1);
  } else {
    return "N/A";
  }
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  // Wind Chill Calculation
  const temp = parseFloat(document.getElementById("temperature").textContent);
  const wind = parseFloat(document.getElementById("windSpeed").textContent);
  const chill = calculateWindChill(temp, wind);
  document.getElementById("windChill").textContent = `${chill} °C`;

  // Footer Dates
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastModified").textContent = document.lastModified;
});


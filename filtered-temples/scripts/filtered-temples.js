// Temple array
const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg",
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg",
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg",
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg",
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg",
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg",
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg",
  },
  {
    templeName: "Johannesburg South Africa",
    location: "Johannesburg, South Africa",
    dedicated: "1985, August, 24",
    area: 19000,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/johannesburg-south-africa/400x250/johannesburg-temple-lds-1401425-wallpaper.jpg",
  },
  {
    templeName: "Brigham City Utah",
    location: "Brigham City, Utah, United States",
    dedicated: "2012, September, 23",
    area: 36000,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/brigham-city-utah/400x250/brigham-city-utah-temple-lds-901823-wallpaper.jpg",
  },
  {
    templeName: "Bangkok Thailand",
    location: "Bangkok, Thailand",
    dedicated: "2023, October, 22",
    area: 44000,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/bangkok-thailand/400x250/bangkok-temple-lds-2112335.jpg",
  },
];

// Get the container
const container = document.querySelector("#temples");

// Create card
function createTempleCard(temple) {
  const card = document.createElement("section");
  card.classList.add("temple-card");

  card.innerHTML = `
    <h2>${temple.templeName}</h2>
    <p><strong>Location:</strong> ${temple.location}</p>
    <p><strong>Dedicated:</strong> ${temple.dedicated}</p>
    <p><strong>Area:</strong> ${temple.area.toLocaleString()} sq ft</p>
    <img src="${temple.imageUrl}" alt="${temple.templeName}" loading="lazy">
  `;
  container.appendChild(card);
}

// Display temples
function displayTemples(templesArray) {
  container.innerHTML = "";
  templesArray.forEach(createTempleCard);
}

// Filtering logic
function filterTemples(criteria) {
  let filtered = [];

  switch (criteria) {
    case "old":
      filtered = temples.filter((t) => parseInt(t.dedicated) < 1900);
      break;
    case "new":
      filtered = temples.filter((t) => parseInt(t.dedicated) > 2000);
      break;
    case "large":
      filtered = temples.filter((t) => t.area > 90000);
      break;
    case "small":
      filtered = temples.filter((t) => t.area < 10000);
      break;
    default:
      filtered = temples;
  }

  displayTemples(filtered);
}

// Button events
document.getElementById("home").addEventListener("click", () => filterTemples("home"));
document.getElementById("old").addEventListener("click", () => filterTemples("old"));
document.getElementById("new").addEventListener("click", () => filterTemples("new"));
document.getElementById("large").addEventListener("click", () => filterTemples("large"));
document.getElementById("small").addEventListener("click", () => filterTemples("small"));

// On load
displayTemples(temples);



import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_Y4We77eLPTldRYdJ8VNEom3Kc6fG0c52Zf6ljt7XDDo3NL09E4Ml3e7leRP2OArH";

// Step 1: Initial Load Function
async function initialLoad() {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/breeds', {
      headers: {
        'x-api-key': API_KEY
      }
    });
    const breeds = await response.json();

    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Initial breed selection
    await handleBreedChange();
  } catch (error) {
    console.error('Error during initial load:', error);
  }
}

// Step 2: Event handler for breed selection
async function handleBreedChange() {
  const selectedBreedId = breedSelect.value;
  if (!selectedBreedId) return;

  try {
    showProgressBar();
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${selectedBreedId}&limit=5`, {
      headers: {
        'x-api-key': API_KEY
      }
    });
    const breedImages = await response.json();
    hideProgressBar();

    // Clear existing carousel items
    const carouselInner = document.getElementById('carouselInner');
    carouselInner.innerHTML = '';

    // Add new images to carousel
    const template = document.getElementById('carouselItemTemplate');
    breedImages.forEach((image, index) => {
      const clone = template.content.cloneNode(true);
      const imgElement = clone.querySelector('img');
      imgElement.src = image.url;
      imgElement.alt = `${image.breeds[0].name} cat`;
      
      const favoriteButton = clone.querySelector('.favourite-button');
      favoriteButton.dataset.imgId = image.id;

      if (index === 0) {
        clone.querySelector('.carousel-item').classList.add('active');
      }

      carouselInner.appendChild(clone);
    });

    // Display breed information
    if (breedImages.length > 0) {
      const breedInfo = breedImages[0].breeds[0];
      infoDump.innerHTML = `
        <h2>${breedInfo.name}</h2>
        <p><strong>Origin:</strong> ${breedInfo.origin}</p>
        <p><strong>Temperament:</strong> ${breedInfo.temperament}</p>
        <p><strong>Description:</strong> ${breedInfo.description}</p>
        <p><strong>Life Span:</strong> ${breedInfo.life_span} years</p>
        <p><strong>Weight:</strong> ${breedInfo.weight.metric} kg</p>
      `;
    }
  } catch (error) {
    console.error('Error fetching breed information:', error);
    hideProgressBar();
  }
}

// Function to show progress bar
function showProgressBar() {
  progressBar.style.width = '100%';
}

// Function to hide progress bar
function hideProgressBar() {
  progressBar.style.width = '0%';
}

// Event listener for breed selection
breedSelect.addEventListener('change', handleBreedChange);

// Function to handle favoriting
export async function toggleFavorite(imgId) {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/favourites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({ image_id: imgId })
    });
    if (response.ok) {
      alert('Image added to favorites!');
    } else {
      alert('Failed to add image to favorites.');
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
}

// Function to get favorites
async function getFavourites() {
  try {
    showProgressBar();
    const response = await fetch('https://api.thecatapi.com/v1/favourites', {
      headers: {
        'x-api-key': API_KEY
      }
    });
    const favorites = await response.json();
    hideProgressBar();

    // Clear existing carousel items
    const carouselInner = document.getElementById('carouselInner');
    carouselInner.innerHTML = '';

    // Add favorite images to carousel
    const template = document.getElementById('carouselItemTemplate');
    favorites.forEach((favorite, index) => {
      const clone = template.content.cloneNode(true);
      const imgElement = clone.querySelector('img');
      imgElement.src = favorite.image.url;
      imgElement.alt = 'Favorite cat';
      
      const favoriteButton = clone.querySelector('.favourite-button');
      favoriteButton.dataset.imgId = favorite.image_id;

      if (index === 0) {
        clone.querySelector('.carousel-item').classList.add('active');
      }

      carouselInner.appendChild(clone);
    });

    infoDump.innerHTML = '<h2>Your Favorite Cats</h2>';
  } catch (error) {
    console.error('Error fetching favorites:', error);
    hideProgressBar();
  }
}

// Event listener for get favorites button
getFavouritesBtn.addEventListener('click', getFavourites);

// Initial load
initialLoad();
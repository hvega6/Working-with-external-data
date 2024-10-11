
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
const API_KEY =
  "live_Y4We77eLPTldRYdJ8VNEom3Kc6fG0c52Zf6ljt7XDDo3NL09E4Ml3e7leRP2OArH";



/// Step 1: Initial Load Function
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

// Event listener for favorite button clicks
document.addEventListener('click', async function(event) {
  if (event.target.closest('.favourite-button')) {
    const imgId = event.target.closest('.favourite-button').dataset.imgId;
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
});

// Event listener for get favorites button
getFavouritesBtn.addEventListener('click', async function() {
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
});

// Initial load
initialLoad();
/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */

import axios from 'axios';

// Set default headers for Axios
axios.defaults.headers.common['x-api-key'] = 'live_Y4We77eLPTldRYdJ8VNEom3Kc6fG0c52Zf6ljt7XDDo3NL09E4Ml3e7leRP2OArH';
axios.defaults.baseURL = 'https://api.thecatapi.com/v1';

// Elements
const breedSelect = document.getElementById('breedSelect');
const carousel = document.getElementById('carousel');
const infoDump = document.getElementById('infoDump');
const progressBar = document.getElementById('progressBar');
const getFavouritesBtn = document.getElementById('getFavouritesBtn');

// Initial load function
async function initialLoad() {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/breeds');
    const breeds = await response.json();
    
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Load initial breed
    await loadBreedInfo(breedSelect.value);
  } catch (error) {
    console.error('Error during initial load:', error);
  }
}

// Load breed information
async function loadBreedInfo(breedId) {
  try {
    const response = await axios.get(`/images/search?breed_ids=${breedId}&limit=5`);
    
    carousel.innerHTML = '';
    infoDump.innerHTML = '';

    response.data.forEach(image => {
      const imgElement = document.createElement('img');
      imgElement.src = image.url;
      imgElement.alt = image.breeds[0].name;
      imgElement.addEventListener('click', () => favourite(image.id));
      carousel.appendChild(imgElement);
    });

    const breedInfo = response.data[0].breeds[0];
    infoDump.innerHTML = `
      <h2>${breedInfo.name}</h2>
      <p>${breedInfo.description}</p>
      <p>Temperament: ${breedInfo.temperament}</p>
      <p>Origin: ${breedInfo.origin}</p>
      <p>Life Span: ${breedInfo.life_span} years</p>
    `;
  } catch (error) {
    console.error('Error loading breed info:', error);
  }
}

// Event listener for breed select
breedSelect.addEventListener('change', (event) => loadBreedInfo(event.target.value));

// Favourite function
export async function favourite(imageId) {
  try {
    const response = await axios.post('/favourites', { image_id: imageId });
    console.log('Image favourited:', response.data);
    // TODO: Implement toggle behavior
  } catch (error) {
    console.error('Error favouriting image:', error);
  }
}

// Get favourites function
async function getFavourites() {
  try {
    const response = await axios.get('/favourites');
    carousel.innerHTML = '';
    response.data.forEach(fav => {
      const imgElement = document.createElement('img');
      imgElement.src = fav.image.url;
      imgElement.alt = 'Favourite cat';
      carousel.appendChild(imgElement);
    });
  } catch (error) {
    console.error('Error getting favourites:', error);
  }
}

// Add event listener for get favourites button
getFavouritesBtn.addEventListener('click', getFavourites);

// Axios interceptors for logging request time and updating progress
axios.interceptors.request.use(config => {
  console.log('Request started');
  progressBar.style.width = '0%';
  document.body.style.cursor = 'progress';
  config.metadata = { startTime: new Date() };
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  const endTime = new Date();
  const duration = endTime - response.config.metadata.startTime;
  console.log(`Request completed in ${duration}ms`);
  progressBar.style.width = '100%';
  document.body.style.cursor = 'default';
  return response;
}, error => {
  document.body.style.cursor = 'default';
  return Promise.reject(error);
});

// Progress update function
function updateProgress(progressEvent) {
  if (progressEvent.lengthComputable) {
    const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
    progressBar.style.width = percentComplete + '%';
  }
}

// Initialize the app
initialLoad();
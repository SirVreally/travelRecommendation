function addSubmission() {
  // Get the message of the new Submission
  let submission = document.getElementById("new_submission");
  // If the user has left a Submission, display a pop-up
  if (submission.value != null && submission.value.trim() != "") {
    console.log("We have received your submission.");
    //Call showPopup here
    showPopup(true);
    
    // Reset the value of the textarea
    submission.value = "";
  }
}

function showPopup(bool) {
  if (bool) {
    document.getElementById('popup').style.visibility = 'visible'
  } else {
    document.getElementById('popup').style.visibility = 'hidden'
  }
}
function toPluralArrayName(keyword) {
    const pluralMap = {
      country: 'countries',
      countries: 'countries',
      temple: 'temples',
      temples: 'temples',
      beach: 'beaches',
      beaches: 'beaches'
    };
    return pluralMap[keyword.toLowerCase()] || null;
  }
  // Get local time string for a given timezone
function getLocalTime(timezone) {
  if (!timezone) return 'Time not available';
  try {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: timezone
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date());
  } catch (e) {
    return 'Invalid timezone';
  }
}
  
  function searchFromJSON(keyword) {
    fetch('travel_recommendation_api.json')
      .then(response => response.json())
      .then(data => {
        const lowerKeyword = keyword.toLowerCase();
        const arrayName = toPluralArrayName(lowerKeyword);
  
        let results = [];
  
        if (arrayName === 'countries') {
          // For "country" search: show all cities from countries, plus all temples and beaches
          const allCities = data.countries.flatMap(country => country.cities || []);
          results = [
            ...allCities,
            ...data.temples,
            ...data.beaches
          ];
        } else if (arrayName && data[arrayName]) {
          // For "temple" or "beach" search: show all items in that array
          results = data[arrayName];
        } else {
          // General search:
  
          // Search countries by name matching keyword
          const matchedCountries = data.countries.filter(country =>
            country.name.toLowerCase().includes(lowerKeyword)
          );
  
          // Gather cities from matched countries or all countries if none matched
          let citiesToSearch = [];
          if (matchedCountries.length > 0) {
            citiesToSearch = matchedCountries.flatMap(country => country.cities || []);
          } else {
            citiesToSearch = data.countries.flatMap(country => country.cities || []);
          }
  
          // Filter cities by name matching keyword
          const matchedCities = citiesToSearch.filter(city =>
            city.name.toLowerCase().includes(lowerKeyword)
          );
  
          // Filter temples and beaches by name or description
          const matchedTemples = data.temples.filter(item =>
            item.name.toLowerCase().includes(lowerKeyword) ||
            item.description.toLowerCase().includes(lowerKeyword)
          );
  
          const matchedBeaches = data.beaches.filter(item =>
            item.name.toLowerCase().includes(lowerKeyword) ||
            item.description.toLowerCase().includes(lowerKeyword)
          );
  
          // Combine all matched results
          results = [
            ...matchedCities,
            ...matchedTemples,
            ...matchedBeaches
          ];
        }
  
        displayResults(results, keyword);
      })
      .catch(error => {
        console.error('Error fetching JSON data:', error);
      });
  }
  
  function displayResults(results, keyword) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
  
    if (results.length > 0) {
      results.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('recommendation-card');
  
        const img = document.createElement('img');
        img.src = item.imageUrl || 'default.jpg';
        img.alt = item.name;
  
        const textContainer = document.createElement('div');
        textContainer.classList.add('recommendation-text');
  
        const title = document.createElement('h3');
        title.textContent = item.name;
  
        const desc = document.createElement('p');
        desc.textContent = item.description || '';

        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.classList.add('view-button');
  
        // Event listener to navigate to another page, e.g., details.html
        // Pass the item name as a query parameter (URL encoded)
        viewButton.addEventListener('click', () => {
          const encodedName = encodeURIComponent(item.name);
          window.location.href = `contact_us.html`;
        });
        // Get and display local time
        const localTimeStr = getLocalTime(item.timezone);
        const timeElement = document.createElement('p');
        timeElement.textContent = `Local Time: ${localTimeStr}`;
        timeElement.classList.add('local-time');
    
        textContainer.appendChild(title);
        textContainer.appendChild(desc);
        textContainer.appendChild(timeElement);

        card.appendChild(img);
        card.appendChild(textContainer);
        card.appendChild(viewButton);
          
        resultsContainer.appendChild(card);
      });
    } else {
      resultsContainer.textContent = `No results found for: ${keyword}`;
    }
  }
  
  // Event listeners for search and clear buttons
  document.getElementById('searchBtn').addEventListener('click', () => {
    const keyword = document.getElementById('searchInput').value.trim();
    if (keyword) {
      searchFromJSON(keyword);
    }
  });
  
  document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('results').innerHTML = '';
  });
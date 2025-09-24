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
function searchFromJSON(keyword, category) {
  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      const allCities = data.countries.flatMap(country => country.cities);
      const lowerKeyword = keyword.toLowerCase();

      let results = [];

      if (category === 'beach') {
        results = allCities.filter(city =>
          city.name.toLowerCase().includes('beach') ||
          city.description.toLowerCase().includes('beach')
        );
      } else if (category === 'temple') {
        results = allCities.filter(city =>
          city.name.toLowerCase().includes('temple') ||
          city.description.toLowerCase().includes('temple')
        );
      } else if (category === 'country') {
        // Filter cities by country name matching keyword
        results = data.countries.filter(country =>
          country.name.toLowerCase() === lowerKeyword
        ).flatMap(country => country.cities);
      } else {
        // 'all' category or default: search keyword in name or description
        results = allCities.filter(city =>
          city.name.toLowerCase().includes(lowerKeyword) ||
          city.description.toLowerCase().includes(lowerKeyword)
        );
      }

      const resultsContainer = document.getElementById('results');
      resultsContainer.innerHTML = '';

      if (results.length > 0) {
        results.forEach(city => {
          const card = document.createElement('div');
          card.classList.add('recommendation-card');

          const img = document.createElement('img');
          img.src = city.imageUrl;
          img.alt = city.name;

          const title = document.createElement('h3');
          title.textContent = city.name;

          const desc = document.createElement('p');
          desc.textContent = city.description;

          card.appendChild(img);
          card.appendChild(title);
          card.appendChild(desc);

          resultsContainer.appendChild(card);
        });
      } else {
        resultsContainer.textContent = 'No results found for: ' + keyword;
      }
    })
    .catch(error => {
      console.error('Error fetching JSON data:', error);
    });
}

// Attach event listener to search button
document.getElementById('searchBtn').addEventListener('click', () => {
  const keyword = document.getElementById('searchInput').value.trim();

  if (keyword !== 'all') {
    searchFromJSON(keyword);
  }
});

// Clear button logic
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  document.getElementById('searchCategory').value = 'all';
  document.getElementById('results').innerHTML = '';
});
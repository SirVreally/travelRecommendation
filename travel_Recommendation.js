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
function searchLocation() {
    const input = document.getElementById('destinationInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
    const countries = data.conditions.find(item => item.name.toLowerCase() === input);

    if (condition) {
        const name = countries.name.join(', ');
        const imageUrl = countries.imageUrl.join(', ');
        const description = countries.description;

        resultDiv.innerHTML += `<h2>${countries.name}</h2>`;
        resultDiv.innerHTML += `<img src="${countries.imageUrl}" alt="hjh">`;

        resultDiv.innerHTML += `<p><strong>Name:</strong> ${Name}</p>`;
        resultDiv.innerHTML += `<p><strong>Image:</strong> ${imageUrl}</p>`;
        resultDiv.innerHTML += `<p><strong>Description:</strong> ${description}</p>`;
        } else {
        resultDiv.innerHTML = 'Country not found.';
        }
    })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
      });
}
    btnSearch.addEventListener('click', searchCondition);

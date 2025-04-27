// The data of molds you fetched from the Google Sheet API (we'll use this for matching)
const molds = [
    // Example of mold objects — replace this with actual data fetched from your Google Sheet
    { name: "Bunny Mold", image: "bunny.jpg", number: "BM-101", location: "Shelf A" },
    { name: "Pumpkin Mold", image: "pumpkin.jpg", number: "PM-102", location: "Shelf B" },
    // Add more molds...
  ];
  
  // Function that filters the list of molds based on the search bar input
  function searchMolds() {
    let input = document.getElementById('searchBar').value.toLowerCase(); // Get the user input
    let resultDiv = document.getElementById('result-container'); // This is where the results will go
    
    // Clear any previous results
    resultDiv.innerHTML = "";
  
    // Loop through the molds and check if the name matches the search term
    molds.forEach(mold => {
      if (mold.name.toLowerCase().includes(input)) {
        // Create a new div for the matching mold
        let moldDiv = document.createElement('div');
        moldDiv.classList.add('mold-item'); // Add a class for styling
        
        // Insert the image and name of the mold
        moldDiv.innerHTML = `
          <img src="${mold.image}" alt="${mold.name}" class="mold-image" />
          <div class="mold-info">
            <h3>${mold.name}</h3>
            <p>Mold Number: ${mold.number}</p>
            <p>Location: ${mold.location}</p>
          </div>
        `;
        
        // Append the mold to the results container
        resultDiv.appendChild(moldDiv);
      }
    });
  }
  
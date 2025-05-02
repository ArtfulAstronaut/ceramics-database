const sheetID = '1brx43eDqhroWHrSNgjPII1IQ667ofr0nZ3APFTtYhXc';
const ApiKey = "AIzaSyDm8pwzgmPsxdhrt7KTa4FHwXMBdlcFn5k";
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
//const base = "https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/Sheet1?key=${ApiKey}";

async function fetchData() {
    try {
        const res = fetch(base).then(response => response.json());
        //if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        //const jsonData = res.json();
        const data = res.table.rows.map(row => {
            return {
                name: row.c[0]?.v || '',
                number: row.c[1]?.v || '',
                manufacturer: row.c[2]?.v || '',
                bisquePrice: row.c[3]?.v || '',
                partOfASet: row.c[4]?.v || '',
                shelfWall: row.c[5]?.v || '',
                shelfNumber: row.c[6]?.v || '',
                shelfLevel: row.c[7]?.v || '',
                keywords: row.c[8]?.v || '',
                notes: row.c[9]?.v || '',
                image: row.c[10]?.v || 'https://www.shutterstock.com/shutterstock/videos/1111389205/thumb/12.jpg?ip=x480' // Fallback image
            };
        });
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}


function displayMolds(molds) {
    const moldGrid = document.getElementById('moldGrid');
    moldGrid.innerHTML = '';
    if (!Array.isArray(molds) || molds.length === 0) {
        moldGrid.innerHTML = '<p>No molds found.</p>';
        return;
    }
    molds.forEach(mold => {
        if (!mold || !mold.name) return; // Skip invalid molds
        const moldCard = document.createElement('div');
        moldCard.className = 'mold-card';
        moldCard.innerHTML = `
             <a href="details.html?name=${encodeURIComponent(mold.name)}&number=${encodeURIComponent(mold.number)}&manufacturer=${encodeURIComponent(mold.manufacturer)}&bisquePrice=${encodeURIComponent(mold.bisquePrice)}&partOfASet=${encodeURIComponent(mold.partOfASet)}&shelfWall=${encodeURIComponent(mold.shelfWall)}&shelfNumber=${encodeURIComponent(mold.shelfNumber)}&shelfLevel=${encodeURIComponent(mold.shelfLevel)}&keywords=${encodeURIComponent(mold.keywords)}&notes=${encodeURIComponent(mold.notes)}&image=${encodeURIComponent(mold.image)}" class="mold-link" target="_blank">
                <img src="${mold.image}" alt="${mold.name || 'Mold Image'}" class="mold-image">
                <div class="mold-info">
                    <h3>${mold.name}</h3>
                    <p><strong>Number:</strong> ${mold.number}</p>
                    <p><strong>Manufacturer:</strong> ${mold.manufacturer}</p>
                    <p><strong>Bisque Price:</strong> ${mold.bisquePrice}</p>
                </div>
            </a>
        `;
        moldGrid.appendChild(moldCard);
    });
}
function setupFilters(data) {
    const searchBar = document.getElementById('searchBar');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');

    if (!searchBar || !categoryFilter || !sortSelect) {
        console.error('Search bar, category filter, or sort select not found in the DOM.');
        return;
    }

    function filterAndSortMolds() {
        const searchTerm = searchBar.value?.toLowerCase() || '';
        const category = categoryFilter.value || '';
        const sortBy = sortSelect.value;

        // Filter molds
        const filtered = data.filter(mold => {
            const matchesSearch = mold.name.toLowerCase().includes(searchTerm) || mold.number.toLowerCase().includes(searchTerm);
            const matchesCategory = category ? mold.category === category : true;
            return matchesSearch && matchesCategory;
        });

        // Sort molds
        const sorted = filtered.sort((a, b) => {
            if (sortBy === 'bisquePrice') {
                // Sort by bisquePrice numerically
                return parseFloat(a.bisquePrice) - parseFloat(b.bisquePrice);
            }
            return a[sortBy]?.localeCompare(b[sortBy] || '');
        });

        displayMolds(sorted);
    }

    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    searchBar.addEventListener('input', debounce(filterAndSortMolds, 300));
    categoryFilter.addEventListener('change', filterAndSortMolds);
    sortSelect.addEventListener('change', filterAndSortMolds);
}

async function initialize() {
    const molds = await fetchData();
    if (molds.length === 0) {
        const moldGrid = document.getElementById('moldGrid');
        moldGrid.innerHTML = '<p>Failed to load molds. Please try again later.</p>';
        return;
    }
    displayMolds(molds);
    setupFilters(molds);
}

initialize();

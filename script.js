import { fetchData } from './dataLoad.js';

function displayMolds(molds) {
    const moldGrid = document.getElementById('moldGrid');
    moldGrid.innerHTML = '';

    if (!Array.isArray(molds) || molds.length === 0) {
        moldGrid.innerHTML = '<p>No molds found.</p>';
        return;
    }

    molds.forEach(mold => {
        if (!mold || !mold.name) return; // Skip invalid molds

        // Use the image only if it exists; otherwise, skip rendering the image tag
        const imageTag = mold.image
            ? `<img src="${mold.image}" alt="${mold.name || 'Mold Image'}" class="mold-image">`
            : '';

        const moldCard = document.createElement('div');
        moldCard.className = 'mold-card';
        moldCard.innerHTML = `
            <a href="details.html?name=${encodeURIComponent(mold.name)}&number=${encodeURIComponent(mold.number)}&manufacturer=${encodeURIComponent(mold.manufacturer)}&bisquePrice=${encodeURIComponent(mold.bisquePrice)}&partOfASet=${encodeURIComponent(mold.partOfASet)}&shelfWall=${encodeURIComponent(mold.shelfWall)}&shelfNumber=${encodeURIComponent(mold.shelfNumber)}&shelfLevel=${encodeURIComponent(mold.shelfLevel)}&keywords=${encodeURIComponent(mold.keywords)}&notes=${encodeURIComponent(mold.notes)}&image=${encodeURIComponent(mold.image)}" class="mold-link" target="_blank">
                ${imageTag}
                <div class="mold-info">
                    <h3>${mold.name}</h3><br>
                    <h4><strong>Model Number:</strong></h4>${mold.number} - ${mold.manufacturer} </p><br>
                    <h4><strong>Bisque Price:</strong></h4> ${mold.bisquePrice}</p><br>
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

    if (!searchBar || /*!categoryFilter ||*/ !sortSelect) {
        console.error('Search bar, category filter, or sort select not found in the DOM.');
        return;
    }

    function filterAndSortMolds() {
        const searchTerm = searchBar.value?.toLowerCase() || '';
        const sortBy = sortSelect.value;

        // Filter molds
        const filtered = data.filter(mold => {
            const matchesSearch = mold.name.toLowerCase().includes(searchTerm) ||
                                  mold.number.toLowerCase().includes(searchTerm) ||
                                  mold.keywords.toLowerCase().includes(searchTerm); // Include keywords in the search
            return matchesSearch;
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
    //categoryFilter.addEventListener('change', filterAndSortMolds);
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

function goBack() {
    window.location.href = 'index.html'; // Replace 'index.html' with the actual path to your landing page
}

initialize();

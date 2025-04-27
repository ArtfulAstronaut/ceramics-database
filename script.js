const sheetID = '1gNdq3mvjhSXm68haGgbrC2P29lB2Q_1XWK1nV-WWMow';
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;

async function fetchData() {
    const res = await fetch(base);
    const text = await res.text();
    const jsonData = JSON.parse(text.substr(47).slice(0, -2));
    const data = jsonData.table.rows.map(row => {
        return {
            name: row.c[0]?.v || '',
            number: row.c[1]?.v || '',
            category: row.c[2]?.v || '',
            image: row.c[3]?.v || '',
            location: row.c[4]?.v || '',
            notes: row.c[5]?.v || '',
            purchaseHistory: row.c[6]?.v || ''
        };
    });
    return data;
}

function displayMolds(molds) {
    const moldGrid = document.getElementById('moldGrid');
    moldGrid.innerHTML = '';
    molds.forEach(mold => {
        const moldCard = document.createElement('div');
        moldCard.className = 'mold-card';
        moldCard.innerHTML = `
            <img src="${mold.image}" alt="${mold.name}">
            <div class="mold-info">
                <h3>${mold.name}</h3>
                <p><strong>Number:</strong> ${mold.number}</p>
                <p><strong>Location:</strong> ${mold.location}</p>
            </div>
        `;
        moldCard.addEventListener('click', () => {
            alert(`Notes: ${mold.notes}\nPurchased: ${mold.purchaseHistory}`);
        });
        moldGrid.appendChild(moldCard);
    });
}

function setupFilters(data) {
    const searchBar = document.getElementById('searchBar');
    const categoryFilter = document.getElementById('categoryFilter');

    function filterMolds() {
        const searchTerm = searchBar.value.toLowerCase();
        const category = categoryFilter.value;
        const filtered = data.filter(mold => {
            const matchesSearch = mold.name.toLowerCase().includes(searchTerm) || mold.number.toLowerCase().includes(searchTerm);
            const matchesCategory = category ? mold.category === category : true;
            return matchesSearch && matchesCategory;
        });
        displayMolds(filtered);
    }

    searchBar.addEventListener('input', filterMolds);
    categoryFilter.addEventListener('change', filterMolds);
}

async function initialize() {
    const molds = await fetchData();
    displayMolds(molds);
    setupFilters(molds);
}

initialize();

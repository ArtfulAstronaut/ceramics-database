const sheetID = '1brx43eDqhroWHrSNgjPII1IQ667ofr0nZ3APFTtYhXc';
const apiKey = 'AIzaSyDm8pwzgmPsxdhrt7KTa4FHwXMBdlcFn5k';
const baseURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/Sheet1?key=${apiKey}`;

export async function fetchData() {
    try {
        const res = await fetch(baseURL);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const json = await res.json();
        return json.values.slice(1).map(row => ({
            name: row[0] ?? '',
            number: row[1] ?? '',
            manufacturer: row[2] ?? '',
            bisquePrice: row[3] ?? '',
            partOfASet: row[4] ?? '',
            shelfWall: row[5] ?? '',
            shelfNumber: row[6] ?? '',
            shelfLevel: row[7] ?? '',
            keywords: row[8] ?? '',
            notes: row[9] ?? '',
            image: row[10] ?? '',
            image2: row[11] ?? '',
            image3: row[12] ?? '',
            image4: row[13] ?? '',
        }));
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

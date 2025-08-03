const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5S2B50uLXxdeKPCZKJHmC2xRA2SD-sUxC_qtivRPhvX2JTYQvvyNZhZ4yYtpDHB-3KmcPEpy-DoWv/pub?gid=0&single=true&output=csv';

async function loadSheetData() {
  try {
    const res = await fetch(sheetUrl);
    const csvText = await res.text();

    const rows = csvText.trim().split('\n').map(row => row.split(','));
    const dataMap = new Map();

    rows.forEach(([country, note, debiut]) => {
      if (country && note) {
        let fullNote = note.trim();
        if(debiut && debiut.trim() !== ''){
          fullNote +=` (${debiut.trim()})`;
        }
        dataMap.set(country.trim(), fullNote);
      }
    });

    document.querySelectorAll('span').forEach(span => {
      const country = span.textContent.trim();
      if (dataMap.has(country)) {
        span.textContent += ` (${dataMap.get(country)})`;
      }
    });
  } catch (error) {
    console.error('Błąd podczas ładowania danych z arkusza:', error);
  }
}

loadSheetData();
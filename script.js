const sheetUrl = 'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vQ5S2B50uLXxdeKPCZKJHmC2xRA2SD-sUxC_qtivRPhvX2JTYQvvyNZhZ4yYtpDHB-3KmcPEpy-DoWv/pubhtml/sheet?headers=false&gid=0';

async function loadSheetData() {
  try {
    const res = await fetch(sheetUrl);
    const htmlText = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const rows= Array.from(doc.querySelectorAll('table tr'))
    const dataMap = new Map();

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        let country = cells[0].textContent.trim();
        let note = cells[1].textContent.trim();
        let debiut = cells[2] ? cells[2].textContent.trim() : '';

        if (country && note) {
          let fullNote = note;
          if (debiut) {
            fullNote += ` (${debiut})`;
          }
          if (!dataMap.has(country)) {
            dataMap.set(country, []);
          }
          dataMap.get(country).push(fullNote);
        }
      }
    });

    // Podmień treść w <span>
    document.querySelectorAll('span').forEach(span => {
      const country = span.textContent.trim();
      if (dataMap.has(country)) {
        const allNotes = dataMap.get(country).join(', ');
        span.innerHTML = `${country}<br>(${allNotes})`;
      }
    });

  } catch (error) {
    console.error('Błąd podczas ładowania danych z arkusza:', error);
  }
}

loadSheetData();
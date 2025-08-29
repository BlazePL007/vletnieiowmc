const sheetUrl = 'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vQ5S2B50uLXxdeKPCZKJHmC2xRA2SD-sUxC_qtivRPhvX2JTYQvvyNZhZ4yYtpDHB-3KmcPEpy-DoWv/pubhtml/sheet?headers=false&gid=0';

const sheetUrl2 = 'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vQ5S2B50uLXxdeKPCZKJHmC2xRA2SD-sUxC_qtivRPhvX2JTYQvvyNZhZ4yYtpDHB-3KmcPEpy-DoWv/pubhtml/sheet?headers=false&gid=635160100';

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

    window.playerCountryMap = {};
    for (let [country, players] of dataMap.entries()) {
      players.forEach(p => {
        // wyciągamy tylko nick (bo może być z debiutem w nawiasie)
        let nick = p.split(" (")[0];
        window.playerCountryMap[nick] = country;
      });
    }

  } catch (error) {
    console.error('Błąd podczas ładowania danych z arkusza:', error);
  }
}

async function loadMedals(sheetUrl2) {
  try{
    const res = await fetch(sheetUrl2);
    const htmlText = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const rows = Array.from(doc.querySelectorAll('table tr'));

    let medalTable = {};

    rows.forEach(row =>{
      const cells = row.querySelectorAll('td');
      let gold = cells[0]?.textContent.trim();
      let silver = cells[1]?.textContent.trim();
      let bronze = cells[2]?.textContent.trim();
      
      if (gold) assignMedal(gold, "gold", medalTable);
      if (silver) assignMedal(silver, "silver", medalTable);
      if (bronze) assignMedal(bronze, "bronze", medalTable);
    });

    let sorted = Object.values(medalTable).sort((a, b) => {
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      if (b.bronze !== a.bronze) return b.bronze - a.bronze;
      return 0;
    });

    renderMedalTable(sorted);
  }catch(error){
    console.error("Błąd podczas ładowania klasyfikacji medalowej:", error);
  }
}

function assignMedal(player, type, medalTable) {
  let country = window.playerCountryMap[player] || "Nieznany kraj";

  if (!medalTable[player]) {
    medalTable[player] = { 
      player, 
      gold: 0, silver: 0, bronze: 0,
      country
    };
  }

  medalTable[player][type]++;
}

function renderMedalTable(data) {
  const container = document.getElementById("medal-table");
  container.innerHTML = "";

  let table = document.createElement("table");
  table.className = "medal-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th>Pozycja w Klasyfikacji</th>
        <th>Zawodnik</th>
        <th>Złote</th>
        <th>Srebrne</th>
        <th>Brązowe</th>
        <th>Razem</th>
      </tr>
    </thead>
    <tbody>
      ${data.map((row, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${row.country}(${row.player})</td>
          <td>${row.gold}</td>
          <td>${row.silver}</td>
          <td>${row.bronze}</td>
          <td>${row.gold + row.silver + row.bronze}</td>
        </tr>
      `).join("")}
    </tbody>
  `;

  container.appendChild(table);
}

async function init() {
  await loadSheetData();
  await loadMedals(sheetUrl2);
}

init();
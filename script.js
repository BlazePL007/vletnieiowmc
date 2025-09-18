const sheetUrl = 'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vQ5S2B50uLXxdeKPCZKJHmC2xRA2SD-sUxC_qtivRPhvX2JTYQvvyNZhZ4yYtpDHB-3KmcPEpy-DoWv/pubhtml/sheet?headers=false&gid=0';

const sheetUrl2 = 'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vQ5S2B50uLXxdeKPCZKJHmC2xRA2SD-sUxC_qtivRPhvX2JTYQvvyNZhZ4yYtpDHB-3KmcPEpy-DoWv/pubhtml/sheet?headers=false&gid=635160100';

const sheetUrl3 = 'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vQ5S2B50uLXxdeKPCZKJHmC2xRA2SD-sUxC_qtivRPhvX2JTYQvvyNZhZ4yYtpDHB-3KmcPEpy-DoWv/pubhtml/sheet?headers=false&gid=287910486';

const countryFlags = {
  "Czad" :"https://flagcdn.com/td.svg",
  "Madagaskar":"https://flagcdn.com/mg.svg",
  "Niger":"https://flagcdn.com/ne.svg",
  "Nigeria":"https://flagcdn.com/ng.svg",
  "Albania":"https://flagcdn.com/al.svg",
  "Austria":"https://flagcdn.com/at.svg",
  "Belgia":"https://flagcdn.com/be.svg",
  "Czechy":"https://flagcdn.com/cz.svg",
  "Dania":"https://flagcdn.com/dk.svg",
  "Estonia":"https://flagcdn.com/ee.svg",
  "Finlandia":"https://flagcdn.com/fi.svg",
  "Francja":"https://flagcdn.com/fr.svg",
  "Grecja":"https://flagcdn.com/gr.svg",
  "Hiszpania":"https://flagcdn.com/es.svg",
  "Irlandia":"https://flagcdn.com/ie.svg",
  "Kosowo":"https://upload.wikimedia.org/wikipedia/commons/1/1f/Flag_of_Kosovo.svg",
  "Malta":"https://flagcdn.com/mt.svg",
  "Niemcy":"https://flagcdn.com/de.svg",
  "Niderlandy": "https://flagcdn.com/nl.svg",
  "Norwegia":"https://flagcdn.com/no.svg",
  "Polska": "https://flagcdn.com/pl.svg",
  "Portugalia":"https://flagcdn.com/pt.svg",
  "Serbia":"https://flagcdn.com/rs.svg",
  "Szwajcaria":"https://flagcdn.com/ch.svg",
  "Szwecja":"https://flagcdn.com/se.svg",
  "Turcja":"https://flagcdn.com/tr.svg",
  "Węgry":"https://flagcdn.com/hu.svg",
  "Wielka Brytania": "https://flagcdn.com/gb.svg",
  "Włochy": "https://flagcdn.com/it.svg",
  "Watykan": "https://flagcdn.com/va.svg",
  "Afganistan": "https://flagcdn.com/af.svg",
  "Japonia":"https://flagcdn.com/jp.svg",
  "Katar":"https://flagcdn.com/qa.svg",
  "Korea Południowa": "https://flagcdn.com/kr.svg",
  "Korea Północna": "https://flagcdn.com/kp.svg",
  "Nepal": "https://flagcdn.com/np.svg",
  "Tajlandia": "https://flagcdn.com/th.svg",
  "Brytyjskie Wyspy Dziewicze": "https://flagcdn.com/vg.svg",
  "Grenada":"https://flagcdn.com/gd.svg",
  "Kanada":"https://flagcdn.com/ca.svg",
  "Meksyk":"https://flagcdn.com/mx.svg",
  "Nikaragua":"https://flagcdn.com/ni.svg",
  "Stany Zjednoczone":"https://flagcdn.com/us.svg",
  "Wyspy Dziewicze Stanów Zjednoczonych":"https://flagcdn.com/vi.svg",
  "Nowa Zelandia": "https://flagcdn.com/nz.svg",
  "Argentyna":"https://flagcdn.com/ar.svg",
  "Brazylia":"https://flagcdn.com/br.svg",
  "Chile":"https://flagcdn.com/cl.svg",
  "Reprezentacja Uchodźców": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Olympic_flag.svg"
};

async function preloadSheetData() {
  try {
    const res = await fetch(sheetUrl);
    const htmlText = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const rows = Array.from(doc.querySelectorAll('table tr'));
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

    // 🔥 uzupełnianie sekcji w cache
    for (let name of Object.keys(cache)) {
      let html = cache[name];
      // parsujemy stringa jako DOM
      const dom = new DOMParser().parseFromString(html, 'text/html');
      dom.querySelectorAll('span').forEach(span => {
        const country = span.textContent.trim();
        if (dataMap.has(country)) {
          const allNotes = dataMap.get(country).join(', ');
          span.innerHTML = `${country}<br>(${allNotes})`;
        }
      });
      // zapisujemy zmodyfikowany HTML z powrotem do cache
      cache[name] = dom.body.innerHTML;
    }

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

      let dyscyplina = cells[4]?.textContent.trim();
      let konkurencja = cells[5]?.textContent.trim();
      
      let competition = dyscyplina;
      if (konkurencja) {
        competition += ` (${konkurencja})`;
      }

      if (gold) assignMedal(gold, "gold", medalTable, competition);
      if (silver) assignMedal(silver, "silver", medalTable, competition);
      if (bronze) assignMedal(bronze, "bronze", medalTable, competition);
    });

    let sorted = Object.values(medalTable).sort((a, b) => {
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      if (b.bronze !== a.bronze) return b.bronze - a.bronze;
      return 0;
    });

    renderMedalTable(sorted, "medale");
  }catch(error){
    console.error("Błąd podczas ładowania klasyfikacji medalowej:", error);
  }
}

function assignMedal(player, type, medalTable, competition) {
  let country = window.playerCountryMap[player] || "Nieznany kraj";

  if (!medalTable[player]) {
    medalTable[player] = { 
      player, 
      gold: 0, silver: 0, bronze: 0,
      country,
      medals:[]
    };
  }

  medalTable[player][type]++;
  medalTable[player].medals.push({type, competition});
}

function renderMedalTable(data, sectionName) {
  const dom = new DOMParser().parseFromString(cache[sectionName], "text/html");
  const container = dom.getElementById("medal-table");
  container.innerHTML = "";

  let table = dom.createElement("table");
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
      ${data.map((row, i) => {
        const sortedMedals = row.medals.sort((a, b) => {
          const order = { gold: 1, silver: 2, bronze: 3 };
          return order[a.type] - order[b.type];
        });
        
        return `
        <tr class="player-row" data-player="${row.player}">
          <td>${i + 1}</td>
          <td>${countryFlags[row.country] ? `<img src="${countryFlags[row.country]}" width="30">`: ""} ${row.country} (${row.player})</td>
          <td>${row.gold}</td>
          <td>${row.silver}</td>
          <td>${row.bronze}</td>
          <td>${row.gold + row.silver + row.bronze}</td>
        </tr>
        <tr class="details-row" id="details-${row.player}">
          <td colspan="6">
            <div class="details-content">
              <ul>
                ${sortedMedals.map(m => `
                    <li class="${m.type.toUpperCase()}"><strong>${m.type.toUpperCase()}:</strong> ${m.competition}</li>
                  `).join("")}
              </ul>
            </div>
          </td>
        </tr>
      `}).join("")}
    </tbody>
  `;

  container.appendChild(table);
  cache[sectionName] = dom.body.innerHTML;
}

function activateMedalTableEvents() {
  // teraz bierzemy już "żywy" DOM
  const container = document.getElementById("medal-table");
  if (!container) return;

  container.querySelectorAll(".player-row").forEach(row => {
    row.addEventListener("click", () => {
      const details = container.querySelector("#details-" + row.dataset.player);
      if (details) details.classList.toggle("open");
    });
  });
}

let actualnapostrona = "";
const cache = {};
async function loadSection(name) {
  if (actualnapostrona !== name) {
    try {
      if (cache[name]) {
        document.getElementById("content").innerHTML = cache[name];
      } else {
        const res = await fetch(`${name}.html`);
        const html = await res.text();
        cache[name] = html; // zapis do cache
        document.getElementById("content").innerHTML = html;
      }
      actualnapostrona = name;

      if(name==="medale"){
        activateMedalTableEvents();
      }
    } catch (error) {
      console.error("Błąd ładowania sekcji:", error);
    }
  }
}

async function preloadSections(names) {
  for (const name of names) {
    if (!cache[name]) {
      const res = await fetch(`${name}.html`);
      cache[name] = await res.text();
    }
  }
}

async function loadRecords(sheetUrl3) {
  try{
    const res = await fetch(sheetUrl3);
    const htmlText = await res.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const rows = Array.from(doc.querySelectorAll('table tr'));

    let records = {}

    rows.forEach(row =>{
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
      let data = cells[0].textContent.trim();
      let Dyscyplina = cells[1].textContent.trim();
      let konkurencja = cells[2].textContent.trim();
      let faza = cells[3].textContent.trim();
      let zawodnik = cells[4]?.textContent.trim();
      let rekord = cells[5]?.textContent.trim();
      let jednostka = cells[6]?.textContent.trim();

      let country = window.playerCountryMap[zawodnik] || "Nieznany kraj";

      if(!records[`${Dyscyplina} ${konkurencja}`])
        records[`${Dyscyplina} ${konkurencja}`] = {
          data,
          Dyscyplina,
          konkurencja,
          faza,
          zawodnicy:[],
          rekord,
          jednostka
        }
      if(zawodnik)
        records[`${Dyscyplina} ${konkurencja}`].zawodnicy.push(`${countryFlags[country] ? `<img src="${countryFlags[country]}" width="30">`: ""}${country}(${zawodnik})`)

      }
    });

    renderRecordTable(Object.values(records), "rekordy")
  }catch(error){
    console.error("Błąd podczas ładowania rekordów:", error);
  }
}

function renderRecordTable(data, sectionName) {
  const dom = new DOMParser().parseFromString(cache[sectionName], "text/html");
  const container = dom.getElementById("record-table");
  container.innerHTML = "";
  let table = dom.createElement("table");
  table.className = "record-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th>Data</th>
        <th>Zawody</th>
        <th>Zawodnicy</th>
        <th>Rekord</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(row => `
        <tr>
          <td>${row.data}</td>
          <td><img src="${row.Dyscyplina}.png" width="50" style="vertical-align: middle;">${row.Dyscyplina} (${row.konkurencja} - ${row.faza})</td>
          <td>${row.zawodnicy.map(zawodnik => `${zawodnik}`).join("<br>")}</td>
          <td>${row.rekord} ${row.jednostka}</td>
        </tr>
      `).join("")}
    </tbody>
  `;

  container.appendChild(table);
  cache[sectionName] = dom.body.innerHTML;
}

async function init() {
  await preloadSections(["wstęp", "dyscypliny", "panstwa", "symbole", "medale", "rekordy", "obiekty", "harmonogram", "zaprzyjaźnieni"]);
  await preloadSheetData();
  await loadMedals(sheetUrl2);
  await loadRecords(sheetUrl3);
  await loadSection("wstęp")
}

init();
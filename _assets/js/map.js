(function(config) {

  var map;
  var tiles;

  var eventCount = 0;
  var timerEl;
  var statEventsEl;
  var logEl;
  var toggleEl;
  var contentEl;

  var icons = {};

  function init() {
    findEls();
    createMap();
    createIcons();
    createToggle();
    loadData();
  }

  function findEls() {
    timerEl = document.querySelector('.timer');
    statEventsEl = document.querySelector('.stat-events');
    logEl = document.querySelector('.log');
    toggleEl = document.querySelector('.table-toggle');
    contentEl = document.querySelector('.content');
  }

  function createMap() {
    map = L.map('map', {}).setView([config.map.lat, config.map.lon], config.map.zoom);
    map.scrollWheelZoom.disable();

    tiles = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  }

  function createIcons() {
    var types = {
      'Astronomy': 'blue',
      'Other event': 'green',
      'Other club': 'orange',
      'Curiosity Sussex': 'violet',
    };

    for (var [topic, colour] of Object.entries(types)) {
      icons[topic] = new L.Icon({
        iconUrl: '../_assets/img/marker-icon-2x-' + colour + '.png',
        shadowUrl: '../_assets/img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    }
  }

  function createToggle() {
    toggleEl.addEventListener("click", toggleTable);
  }

  function toggleTable() {
    contentEl.classList.toggle('show-table');
    var tableToggleStateEl = document.querySelector(".table-toggle-state");
    if (tableToggleStateEl.textContent === "Show") {
      tableToggleStateEl.textContent = "Hide";
    } else {
      tableToggleStateEl.textContent = "Show";
    }
  }

  function loadData() {
    timerEl.classList.remove('is-waiting');

    var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + config.spreadsheet.id + '/values/' + config.spreadsheet.sheet + '!' + config.spreadsheet.range + '?key=' + config.spreadsheet.apiKey;

    request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();
    request.onreadystatechange = updateData;
  }

  function updateData() {
    if (this.readyState === 4) {
      if (this.status === 200 || this.status === 0) {
        try {
          var response = JSON.parse(this.response);
          if (response.values) {

            // extract just the new responses to update the map
            if (response.values.length > eventCount) {
              var newEvents = response.values.slice(eventCount);
              eventCount = response.values.length;
              updateMap(newEvents);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }

      // update every 30 seconds
      setTimeout(loadData, 1000 * 30);
      timerEl.classList.add('is-waiting');
    }
  }

  function updateMap(newEvents) {
    newEvents.forEach(function(newEvent) {

      var data = {
        name: newEvent[1],
        url: newEvent[2],
        type: newEvent[3],
        date: new Date(newEvent[4]),
        startTime: newEvent[5],
        endTime: newEvent[6],
        address: newEvent[7],
        postcode: newEvent[8],
        lat: newEvent[9],
        lon: newEvent[10],
        visible: newEvent[11],
      };

      // check the event is visible
      if (data.visible !== "TRUE") return false;

      // check the event is in the future
      var today = new Date().setHours(0,0,0,0);
      if (data.date.getTime() < today) return false;

      addMarker(data);
      addTableRow(data);
      logEvent(newEvent);
    });
  }

  function addMarker(data) {

    // set icon based on event type
    var icon = icons[data.type];

    // add marker to map
    var marker = L.marker([data.lat, data.lon], {icon: icon}).addTo(map);

    // set popup content
    var popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");

    var popupLink = document.createElement("a");
    popupLink.href = data.url;
    popupLink.target = "_blank";
    popupLink.classList.add("popup-link");
    popupContent.appendChild(popupLink);

    var popupName = document.createElement("p");
    popupName.textContent = data.name;
    popupName.classList.add("popup-name");
    popupLink.appendChild(popupName);

    var popupDate = document.createElement("p");
    popupDate.textContent = data.date.toDateString() + " (" + data.startTime + "-" + data.endTime + ")";
    popupDate.classList.add("popup-date");
    popupContent.appendChild(popupDate);

    var popupAddress = document.createElement("p");
    popupAddress.textContent = data.address + ", " + data.postcode;
    popupAddress.classList.add("popup-address");
    popupContent.appendChild(popupAddress);

    marker.bindPopup(popupContent);
  }

  function addTableRow(data) {
    var tableRow = document.createElement("tr");
    var tableBody = document.querySelector(".event-table-list");
    tableBody.appendChild(tableRow);

    var tableName = document.createElement("td");
    tableRow.appendChild(tableName);

    var tableLink = document.createElement("a");
    tableLink.href = data.url;
    tableLink.target = "_blank";
    tableLink.textContent = data.name;
    tableLink.classList.add("table-link");
    tableName.appendChild(tableLink);

    var tableType = document.createElement("td");
    tableType.textContent = data.type;
    tableType.classList.add("table-type");
    tableRow.appendChild(tableType);

    var tableDate = document.createElement("td");
    tableDate.textContent = data.date.toDateString() + " (" + data.startTime + "-" + data.endTime + ")";
    tableDate.classList.add("table-date");
    tableRow.appendChild(tableDate);

    var tableAddress = document.createElement("td");
    tableAddress.textContent = data.address + ", " + data.postcode;
    tableAddress.classList.add("table-address");
    tableRow.appendChild(tableAddress);
  }

  function logEvent(newEvent) {
    var eventCount = parseInt(statEventsEl.textContent, 10);
    statEventsEl.textContent = eventCount + 1;

    // var logItemEl = document.createElement("li");
    // var logItemText = document.createTextNode(newEvent[1] + " added");
    // logItemEl.appendChild(logItemText);
    // logEl.appendChild(logItemEl);

    // setTimeout(emptyLog, 1000 * 10);
  }

  function emptyLog() {
    while (logEl.firstChild) {
      logEl.removeChild(logEl.firstChild);
    }
  }

  init();
})(window.CONFIG);

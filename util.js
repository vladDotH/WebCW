/** @param {string} name
 * @param {number} time */
export function saveRecord(name, time) {
  let records = getRecords();
  records.push([name, time]);
  localStorage.setItem("game.records", JSON.stringify(records));
}

/** @returns {Array<[string, number]>} */
export function getRecords() {
  return JSON.parse(localStorage.getItem("game.records") ?? "[]");
}

/** @param {HTMLTableElement} records */
export function renderRecords(records) {
  let table = records.querySelector("table");
  for (let i = 0; i < table.tBodies.length; i++) {
    table.tBodies.item(i).remove();
  }
  let body = table.createTBody();
  for (let [name, time] of getRecords().sort((a, b) => a[1] - b[1])) {
    let row = document.createElement("tr"),
      nameCol = document.createElement("td"),
      timeCol = document.createElement("td");
    nameCol.appendChild(document.createTextNode(name));
    timeCol.appendChild(document.createTextNode(`${time} сек.`));
    row.appendChild(nameCol);
    row.appendChild(timeCol);
    body.appendChild(row);
  }
}

/** @param {HTMLElement} elem */
export function hide(elem) {
  elem.style.display = "none";
}

/** @param {HTMLElement} elem */
export function show(elem) {
  elem.style.display = "block";
}

/** @param {HTMLElement} elem */
export function disappear(elem) {
  elem.style.opacity = "0";
}

/** @param {HTMLElement} elem */
export function appear(elem) {
  elem.style.opacity = "1";
}

/** @param {number} time
 * @returns {Promise<void>} */
export function delay(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

let roulettes = [[]];
let currentRoulette = 0;
let spinIntervals = [];

function renderList() {
  const container = document.getElementById("rouletteList");
  container.innerHTML = "";

  roulettes.forEach((items, index) => {
    const div = document.createElement("div");
    div.className = "roulette";
    div.setAttribute("data-index", index);

    const resultId = `result-${index}`;

    div.innerHTML = `
      <h2>ルーレット${index + 1} <button class="delete-btn" onclick="deleteRoulette(${index})">削除</button></h2>
      <ul>
        ${items.map((item, i) => `
          <li class="roulette-item">
            <span>${item}</span>
            <button class="delete-btn" onclick="deleteItem(${index}, ${i})">×</button>
          </li>
        `).join('')}
      </ul>
      <button onclick="startSpin(${index})">スタート</button>
      <button onclick="stopSpin(${index})">ストップ</button>
      <div class="result" id="${resultId}"></div>
    `;
    container.appendChild(div);
  });

  Sortable.create(container, {
    animation: 150,
    onEnd: function (evt) {
      const movedRoulette = roulettes.splice(evt.oldIndex, 1)[0];
      roulettes.splice(evt.newIndex, 0, movedRoulette);
      renderList();
    }
  });

  updateRouletteSelector();
}

function updateRouletteSelector() {
  const selector = document.getElementById("rouletteSelector");
  selector.innerHTML = roulettes.map((_, i) => `<option value="${i}" ${i === currentRoulette ? "selected" : ""}>ルーレット${i + 1}</option>`).join("");
}

function addItem() {
  const input = document.getElementById("newItem");
  if (input.value.trim()) {
    if (roulettes[currentRoulette].length < 10) {
      roulettes[currentRoulette].push(input.value.trim());
      input.value = "";
      renderList();
    } else {
      alert("このルーレットは最大10要素までです");
    }
  }
}

function deleteItem(rouletteIndex, itemIndex) {
  roulettes[rouletteIndex].splice(itemIndex, 1);
  renderList();
}

function deleteRoulette(index) {
  roulettes.splice(index, 1);
  if (currentRoulette >= roulettes.length) {
    currentRoulette = roulettes.length - 1;
  }
  if (roulettes.length === 0) {
    roulettes = [[]];
    currentRoulette = 0;
  }
  renderList();
}

function addRoulette() {
  if (roulettes.length < 10) {
    roulettes.push([]);
    currentRoulette = roulettes.length - 1;
    renderList();
  } else {
    alert("ルーレットは最大10個までです");
  }
}

function switchRoulette() {
  currentRoulette = parseInt(document.getElementById("rouletteSelector").value);
  renderList();
}

function startSpin(index) {
  const resultElement = document.getElementById(`result-${index}`);
  const items = roulettes[index];
  if (items.length === 0) {
    alert("要素がありません");
    return;
  }
  let i = 0;
  spinIntervals[index] = setInterval(() => {
    resultElement.innerText = items[i % items.length];
    i++;
  }, 100);
}

function stopSpin(index) {
  clearInterval(spinIntervals[index]);
}

function spinAll() {
  const results = roulettes.map((items) => {
    if (items.length === 0) return '';
    return items[Math.floor(Math.random() * items.length)];
  });
  document.getElementById("resultDisplay").innerText = `すべての結果: ${results.join('')}`;
}

function saveCode() {
  const code = JSON.stringify(roulettes);
  document.getElementById("codeArea").value = code;
}

function loadCode() {
  try {
    const code = document.getElementById("codeArea").value;
    roulettes = JSON.parse(code);
    currentRoulette = 0;
    renderList();
  } catch (e) {
    alert("無効なコードです");
  }
}

function saveToLocalStorage() {
  localStorage.setItem('savedRoulettes', JSON.stringify(roulettes));
  alert("ローカルに保存しました");
}

function loadFromLocalStorage() {
  const data = localStorage.getItem('savedRoulettes');
  if (data) {
    roulettes = JSON.parse(data);
    currentRoulette = 0;
    renderList();
    alert("ローカルから読み込みました");
  } else {
    alert("保存データがありません");
  }
}

document.getElementById("darkModeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark", this.checked);
});

renderList();

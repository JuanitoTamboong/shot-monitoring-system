let members = [];
let punishments = ['Dance!', 'Sing!', 'Truth', 'Dare'];
let currentRotation = 0;

function addMember() {
  const name = document.getElementById("memberName").value;
  const imgFile = document.getElementById("memberImage").files[0];

  if (!name || !imgFile) return alert("Enter both name and image.");

  const reader = new FileReader();
  reader.onload = function (e) {
    const imgURL = e.target.result;
    members.push({ name, img: imgURL, shots: 0 });
    renderMembers();
    updateShotSummary();
  };
  reader.readAsDataURL(imgFile);

  document.getElementById("memberName").value = "";
  document.getElementById("memberImage").value = "";
}

function renderMembers() {
  const container = document.getElementById("members");
  container.innerHTML = "";
  members.forEach((m, index) => {
    container.innerHTML += `
      <div class="member-card">
        <img src="${m.img}" alt="${m.name}" />
        <p><strong>${m.name}</strong></p>
        <p>Shots: ${m.shots}</p>
        <button onclick="takeShot(${index})">Take Shot</button>
        <button onclick="spinWheel('${m.name}')">Pass</button>
      </div>
    `;
  });
}

function takeShot(index) {
  members[index].shots++;
  renderMembers();
  updateShotSummary();
}

function updateShotSummary() {
  const summary = document.getElementById("shotSummary");
  summary.innerHTML = "";
  const maxShots = Math.max(...members.map(m => m.shots));
  members.forEach(m => {
    const diff = maxShots - m.shots;
    const note = diff > 0 ? `🔻 ${diff} behind` : "✅ Even";
    const li = document.createElement("li");
    li.textContent = `${m.name}: ${m.shots} shots — ${note}`;
    summary.appendChild(li);
  });
}

function drawPunishmentsOnWheel() {
  const wheel = document.getElementById("wheel");
  wheel.innerHTML = '';

  const anglePerSegment = 360 / punishments.length;
  punishments.forEach((text, i) => {
    const angle = i * anglePerSegment + anglePerSegment / 2;
    const span = document.createElement("span");

    span.innerText = text;
    span.style.left = `${50 + 40 * Math.cos((angle - 90) * Math.PI / 180)}%`;
    span.style.top = `${50 + 40 * Math.sin((angle - 90) * Math.PI / 180)}%`;
    span.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    wheel.appendChild(span);
  });
}

function spinWheel(passer = "Someone") {
  const wheel = document.getElementById("wheel");
  const segmentAngle = 360 / punishments.length;
  const randIndex = Math.floor(Math.random() * punishments.length);

  // Align the punishment with the top arrow
  const angleToStop = 360 - (randIndex * segmentAngle + segmentAngle / 2);
  const fullRotations = 5 * 360;
  const totalRotation = fullRotations + angleToStop;

  currentRotation += totalRotation;
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  const member = members.find(m => m.name === passer) || { name: passer, img: "" };

  setTimeout(() => {
    document.getElementById("punishedName").textContent = member.name;
    document.getElementById("punishedImage").src = member.img || "https://via.placeholder.com/100";
    document.getElementById("punishmentText").textContent = punishments[randIndex];
    document.getElementById("punishmentModal").style.display = "block";
  }, 4000);
}

function closeModal() {
  document.getElementById("punishmentModal").style.display = "none";
}

function addPunishment() {
  const input = document.getElementById("newPunishment");
  const newPunish = input.value.trim();
  if (newPunish) {
    punishments.push(newPunish);
    input.value = "";
    drawPunishmentsOnWheel();
  }
}

drawPunishmentsOnWheel();

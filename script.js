const DIFFICULTIES = {
  1: { name: "Easy Demon", className: "easy" },
  2: { name: "Medium Demon", className: "medium" },
  3: { name: "Hard Demon", className: "hard" },
  4: { name: "Insane Demon", className: "insane" },
  5: { name: "Extreme Demon", className: "extreme" }
};

const listElement = document.getElementById("level-list");
const searchInput = document.getElementById("search");
const difficultyFilter = document.getElementById("difficulty-filter");
const sortOrder = document.getElementById("sort-order");
const countElement = document.getElementById("level-count");
const emptyElement = document.getElementById("empty-state");
const errorElement = document.getElementById("error-state");

let levels = [];

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function isValidImageUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function createLevelCard(level, rank) {
  const difficulty = DIFFICULTIES[level.TypeOfDemon] ?? {
    name: "Unrated Demon", className: "easy"
  };
  const thumbnail = isValidImageUrl(level.Thumbnail)
    ? `<img class="thumbnail" src="${escapeHTML(level.Thumbnail)}" alt="${escapeHTML(level.LevelName)} level thumbnail" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'), {className:'thumbnail-placeholder', textContent:'NO IMAGE'}))">`
    : `<div class="thumbnail-placeholder">NO IMAGE</div>`;

  const verifier = level.Verificator
    ? `<span class="verificator">Verified by ${escapeHTML(level.Verificator)}</span>`
    : "";
  const difficultyValue = Number.isFinite(Number(level.ClubstepDifficulty)) && level.ClubstepDifficulty !== null
    ? `<span class="difficulty-value">${escapeHTML(level.ClubstepDifficulty)}× Clubstep</span>`
    : "";

  return `
    <article class="level-card">
      ${thumbnail}
      <div class="level-info">
        <div class="level-top">
          <span class="rank">#${rank}</span>
          <div>
            <h3 class="level-name">${escapeHTML(level.LevelName)}</h3>
            <p class="creator">by ${escapeHTML(level.CreatorUser)}</p>
            <div class="meta">
              <span class="difficulty ${difficulty.className}">${difficulty.name}</span>
              ${verifier}
              ${difficultyValue}
            </div>
          </div>
        </div>
      </div>
    </article>`;
}

function getSortedFilteredLevels() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const selectedDifficulty = difficultyFilter.value;

  const filtered = levels.filter(level => {
    const searchable = [
      level.LevelName, level.CreatorUser, level.Verificator,
      DIFFICULTIES[level.TypeOfDemon]?.name
    ].join(" ").toLocaleLowerCase();

    const matchesSearch = searchable.includes(query);
    const matchesDifficulty = selectedDifficulty === "all" ||
      String(level.TypeOfDemon) === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  filtered.sort((a, b) => {
    const aValue = Number.isFinite(Number(a.ClubstepDifficulty)) && a.ClubstepDifficulty !== null
      ? Number(a.ClubstepDifficulty) : null;
    const bValue = Number.isFinite(Number(b.ClubstepDifficulty)) && b.ClubstepDifficulty !== null
      ? Number(b.ClubstepDifficulty) : null;

    // Levels without a ClubstepDifficulty stay at the bottom.
    if (aValue === null && bValue === null) return a.LevelName.localeCompare(b.LevelName);
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    return sortOrder.value === "hardest" ? bValue - aValue : aValue - bValue;
  });

  return filtered;
}

function renderLevels() {
  const visibleLevels = getSortedFilteredLevels();
  listElement.innerHTML = visibleLevels.map((level, index) =>
    createLevelCard(level, index + 1)
  ).join("");

  countElement.textContent = `${visibleLevels.length} ${visibleLevels.length === 1 ? "level" : "levels"}`;
  emptyElement.hidden = visibleLevels.length !== 0;
}

async function loadLevels() {
  try {
    const response = await fetch("./levels.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!data.Levels || typeof data.Levels !== "object") {
      throw new Error("levels.json must contain a Levels object.");
    }

    levels = Object.values(data.Levels).filter(level =>
      level && typeof level.LevelName === "string" &&
      typeof level.CreatorUser === "string"
    );

    renderLevels();
  } catch (error) {
    console.error("Aether Demonlist:", error);
    countElement.textContent = "Unavailable";
    errorElement.hidden = false;
  }
}

searchInput.addEventListener("input", renderLevels);
difficultyFilter.addEventListener("change", renderLevels);
sortOrder.addEventListener("change", renderLevels);

loadLevels();

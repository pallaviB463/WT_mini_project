// Render all ideas, provide search + sort controls, and allow liking
const ideasContainerEl = document.getElementById('ideasContainer');

function loadIdeas() {
  return JSON.parse(localStorage.getItem('ideas')) || [];
}

function saveIdeas(arr) {
  localStorage.setItem('ideas', JSON.stringify(arr));
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildControls(onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'controls';

  const left = document.createElement('div');
  left.className = 'left';

  const search = document.createElement('input');
  search.placeholder = 'Search ideas...';
  search.className = 'search-input';

  const sort = document.createElement('select');
  sort.className = 'sort-select';
  sort.innerHTML = `
    <option value="top">Sort: Top (likes)</option>
    <option value="new">Sort: Newest</option>
    <option value="old">Sort: Oldest</option>
  `;

  left.appendChild(search);
  left.appendChild(sort);

  wrapper.appendChild(left);

  function change() { onChange({ q: search.value.trim(), sort: sort.value }); }

  search.addEventListener('input', change);
  sort.addEventListener('change', change);

  return { el: wrapper, controls: { search, sort } };
}

function render() {
  const ideas = loadIdeas();
  ideasContainerEl.innerHTML = '';

  const controls = buildControls(({ q, sort }) => {
    renderList(ideas, q, sort);
  });

  ideasContainerEl.parentNode.insertBefore(controls.el, ideasContainerEl);

  if (!ideas || ideas.length === 0) {
    ideasContainerEl.innerHTML = '<div class="empty-state"><p>No ideas yet. Be the first to submit one!</p></div>';
    return;
  }

  renderList(ideas, '', 'top');
}

function renderList(ideas, q, sortMode) {
  // remove existing cards
  ideasContainerEl.innerHTML = '';

  let list = ideas.slice();

  if (q) {
    const low = q.toLowerCase();
    list = list.filter(i => (i.title || '').toLowerCase().includes(low) || (i.desc || '').toLowerCase().includes(low));
  }

  if (sortMode === 'top') list.sort((a,b) => (b.likes||0) - (a.likes||0));
  else if (sortMode === 'new') list.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
  else if (sortMode === 'old') list.sort((a,b) => (a.createdAt||0) - (b.createdAt||0));

  list.forEach((idea, idx) => {
    const card = document.createElement('div');
    card.className = 'idea-card';
    card.innerHTML = `
      <div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="rank">#${idx + 1}</span>
          <h3>${escapeHtml(idea.title)}</h3>
        </div>
        <p>${escapeHtml(idea.desc)}</p>
      </div>
      <div class="idea-meta">
        <div class="count">❤️ ${idea.likes || 0}</div>
        <div>
          <button class="like-btn">Like</button>
          <button class="secondary delete-btn">Delete</button>
        </div>
      </div>
    `;

    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      // find index in original stored array and update
      const stored = loadIdeas();
      const i = stored.findIndex(s => s.id === idea.id);
      if (i > -1) {
        stored[i].likes = (stored[i].likes || 0) + 1;
        saveIdeas(stored);
        // re-render current view (keep search/sort state if any)
        const search = document.querySelector('.search-input');
        const sort = document.querySelector('.sort-select');
        renderList(stored, search ? search.value.trim() : '', sort ? sort.value : 'top');
      }
    });

    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      if (!confirm('Delete this idea? This action cannot be undone.')) return;
      const stored = loadIdeas();
      const idx = stored.findIndex(s => s.id === idea.id);
      if (idx > -1) {
        stored.splice(idx, 1);
        saveIdeas(stored);
        const search = document.querySelector('.search-input');
        const sort = document.querySelector('.sort-select');
        renderList(stored, search ? search.value.trim() : '', sort ? sort.value : 'top');
      }
    });

    ideasContainerEl.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', render);
const container = document.getElementById("ideasContainer");
let ideas = JSON.parse(localStorage.getItem("ideas")) || [];

if (ideas.length === 0) {
  container.innerHTML = "<p>No ideas yet! Be the first to <a href='submit.html'>submit one</a>.</p>";
}

ideas.forEach((idea, index) => {
  const card = document.createElement("div");
  card.className = "idea-card";
  card.innerHTML = `
    <h3>${idea.title}</h3>
    <p>${idea.desc}</p>
    <button class="like-btn" onclick="likeIdea(${index})">❤️ ${idea.likes}</button>
  `;
  container.appendChild(card);
});

function likeIdea(i) {
  ideas[i].likes++;
  localStorage.setItem("ideas", JSON.stringify(ideas));
  location.reload();
}

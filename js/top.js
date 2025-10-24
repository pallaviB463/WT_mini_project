const topContainer = document.getElementById("topIdeasContainer");

function loadIdeas() {
  return JSON.parse(localStorage.getItem("ideas")) || [];
}

function saveIdeas(arr) {
  localStorage.setItem("ideas", JSON.stringify(arr));
}

function render() {
  const ideas = loadIdeas();
  topContainer.innerHTML = "";

  if (!ideas || ideas.length === 0) {
    topContainer.innerHTML = '<div class="empty-state"><p>No ideas ranked yet. Submit and vote to see top ideas!</p></div>';
    return;
  }

  // sort by likes desc then by createdAt
  ideas.sort((a, b) => (b.likes || 0) - (a.likes || 0) || (b.createdAt || 0) - (a.createdAt || 0));

  ideas.forEach((idea, index) => {
    const card = document.createElement("div");
    card.className = "idea-card";
    card.innerHTML = `
      <div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="rank">#${index + 1}</span>
          <h3>${escapeHtml(idea.title)}</h3>
        </div>
        <p>${escapeHtml(idea.desc)}</p>
      </div>
      <div class="idea-meta">
        <div class="count">❤️ ${idea.likes || 0}</div>
        <div>
          <button class="like-btn small">Like</button>
          <button class="secondary delete-btn">Delete</button>
        </div>
      </div>
    `;

    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      // increment by id to avoid issues with sorting index
      const stored = loadIdeas();
      const i = stored.findIndex(s => s.id === idea.id);
      if (i > -1) {
        stored[i].likes = (stored[i].likes || 0) + 1;
        saveIdeas(stored);
      }
      // re-render to update ranking
      render();
    });

    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      if (!confirm('Delete this idea? This action cannot be undone.')) return;
      const stored = loadIdeas();
      const i = stored.findIndex(s => s.id === idea.id);
      if (i > -1) {
        stored.splice(i, 1);
        saveIdeas(stored);
      }
      render();
    });

    topContainer.appendChild(card);
  });
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

document.addEventListener('DOMContentLoaded', render);

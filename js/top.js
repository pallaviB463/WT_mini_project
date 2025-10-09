function showTopIdeas() {
  const container = document.getElementById("top-ideas");
  const ideas = JSON.parse(localStorage.getItem("ideas")) || [];

  if (ideas.length === 0) {
    container.innerHTML = "<p>No ideas yet!</p>";
    return;
  }

  const sorted = ideas.sort((a, b) => b.likes - a.likes);

  sorted.forEach((idea, index) => {
    const card = document.createElement("div");
    card.className = "idea-card";
    card.innerHTML = `
      <h3>${idea.title}</h3>
      <p><strong>By:</strong> ${idea.author}</p>
      <p>${idea.description}</p>
      <p><strong>Likes:</strong> ${idea.likes}</p>
      <p>Rank: #${index + 1}</p>
    `;
    container.appendChild(card);
  });
}

showTopIdeas();

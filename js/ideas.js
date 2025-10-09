function displayIdeas() {
  const container = document.getElementById("ideas-container");
  const ideas = JSON.parse(localStorage.getItem("ideas")) || [];

  container.innerHTML = ideas.length === 0 
    ? "<p>No ideas yet. Submit one!</p>" 
    : "";

  ideas.forEach(idea => {
    const card = document.createElement("div");
    card.className = "idea-card";
    card.innerHTML = `
      <h3>${idea.title}</h3>
      <p><strong>By:</strong> ${idea.author}</p>
      <p>${idea.description}</p>
      <p><strong>Likes:</strong> ${idea.likes}</p>
      <button onclick="likeIdea(${idea.id})">👍 Like</button>
    `;
    container.appendChild(card);
  });
}

function likeIdea(id) {
  let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
  const idea = ideas.find(i => i.id === id);
  if (idea) {
    idea.likes++;
    localStorage.setItem("ideas", JSON.stringify(ideas));
    displayIdeas();
  }
}

displayIdeas();

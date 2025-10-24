document.getElementById("ideaForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("ideaTitle").value.trim();
  const desc = document.getElementById("ideaDescription").value.trim();

  if (!title || !desc) return alert("Please fill out all fields.");

  const ideas = JSON.parse(localStorage.getItem("ideas")) || [];
  const newIdea = {
    id: Date.now().toString(36),
    title,
    desc,
    likes: 0,
    createdAt: Date.now()
  };
  ideas.push(newIdea);
  localStorage.setItem("ideas", JSON.stringify(ideas));

  // friendly confirmation then redirect to ideas page
  alert("✅ Idea submitted successfully! Redirecting to Ideas...");
  e.target.reset();
  // go to ideas page so user can see and vote
  window.location.href = 'ideas.html';
});

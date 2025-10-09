document.getElementById("ideaForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value.trim();

  if (!title || !author || !description) {
    alert("Please fill all required fields.");
    return;
  }

  const newIdea = {
    id: Date.now(),
    title,
    author,
    description,
    category,
    likes: 0
  };

  let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
  ideas.push(newIdea);
  localStorage.setItem("ideas", JSON.stringify(ideas));

  alert("Idea submitted successfully!");
  document.getElementById("ideaForm").reset();
});

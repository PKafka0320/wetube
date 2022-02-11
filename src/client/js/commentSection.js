const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const removeBtn = document.getElementsByClassName("comment__remove");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const span = document.createElement("span");
  span.innerText = `${text}`;
  newComment.appendChild(span);
  const spanBtn = document.createElement("span");
  spanBtn.innerText = "✖";
  spanBtn.className = "comment__remove";
  spanBtn.addEventListener("click", handleRemove);
  newComment.appendChild(spanBtn);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleRemove = async (event) => {
  const videoId = videoContainer.dataset.id;
  const comment = event.target.parentNode;
  const commentId = comment.dataset.id;
  await fetch(`/api/videos/${videoId}/commentRemove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });
  comment.remove();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (removeBtn) {
  for (const Btn of removeBtn) {
    Btn.addEventListener("click", handleRemove);
  }
}

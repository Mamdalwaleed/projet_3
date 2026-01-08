// Récupération de l'utilisateur connecté
const connectedUser = localStorage.getItem("token");

const modal = document.getElementById("modalOverlay");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const backArrow = document.getElementById("backArrow");

const deletePage = document.getElementById("deletePage");
const addPage = document.getElementById("addPage");
const openAddPageBtn = document.getElementById("openAddPage");
const loginLink = document.getElementById("login-link");
const logoutLink = document.getElementById("logout");

if (!connectedUser) {
  openBtn.style.display = "none";
  loginLink.style.display = "block";
  logoutLink.style.display = "none";
} else {
  openBtn.style.display = "block";
  loginLink.style.display = "none";
  logoutLink.style.display = "block";
}

// ---------------------- DECONNEXION ----------------------
logoutLink.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});
// ---------------------- OUVRIR ----------------------
openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  deletePage.style.display = "block";
  addPage.style.display = "none";
  backArrow.style.display = "none";

  displayWorksInModal();
});

// ---------------------- FERMER ----------------------
const closeModal = () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
};

closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ---------------------- PAGE 1 → PAGE 2 ----------------------
openAddPageBtn.addEventListener("click", () => {
  deletePage.style.display = "none";
  addPage.style.display = "block";
  backArrow.style.display = "inline";

  fillCategoriesSelect();
});

// ---------------------- PAGE 2 → PAGE 1 ----------------------
backArrow.addEventListener("click", () => {
  deletePage.style.display = "block";
  addPage.style.display = "none";
  backArrow.style.display = "none";
  displayWorksInModal();
});

// ---------------------- AFFICHAGE WORKS ----------------------
async function displayWorksInModal() {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = "";

  const works = await fetch("http://localhost:5678/api/works").then((res) =>
    res.json()
  );

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const trash = document.createElement("button");
    trash.classList.add("trash-btn");
    trash.textContent = "🗑";
    trash.addEventListener("click", () => deleteWork(work.id));

    figure.appendChild(img);
    figure.appendChild(trash);
    modalGallery.appendChild(figure);
  });
}

// ---------------------- DELETE 1 ----------------------
async function deleteWork(id) {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  displayWorksInModal();
  displayWorks("all");
}
// TO DO:
// ---------------------- DELETE MULTIPLE ----------------------
// const deleteAllBtn = document.getElementById("deleteAllBtn");
// const modalGallery = document.querySelector(".modal-gallery");

// modalGallery.addEventListener("click", (e) => {
//   const fig = e.target.closest("figure");
//   if (!fig) return;
//   fig.classList.toggle("selected");
// });

// deleteAllBtn.addEventListener("click", async () => {
//   const selected = modalGallery.querySelectorAll("figure.selected");
//   if (selected.length === 0) return alert("Sélectionnez des images à supprimer");

//   for (const fig of selected) {
//     const id = fig.dataset.id;

//     await fetch(`http://localhost:5678/api/works/${id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`
//       }
//     });

//     fig.remove();
//   }

//   displayWorks("all");
// });

// ---------------------- REMPLIR CATEGORIES ----------------------
async function fillCategoriesSelect() {
  const select = document.getElementById("categorySelect");
  select.innerHTML = "";

  const categories = await fetch("http://localhost:5678/api/categories").then(
    (res) => res.json()
  );

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

// ---------------------- AJOUT PHOTO ----------------------
const addForm = document.getElementById("addForm");
const imageInput = document.getElementById("imageInput");
const titleInput = document.getElementById("titleInput");
const categorySelect = document.getElementById("categorySelect");
const submitBtn = document.getElementById("addPageSubmitBtn");

addForm.addEventListener("input", () => {
  submitBtn.disabled =
    !imageInput.files[0] || !titleInput.value || !categorySelect.value;
});

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("image", imageInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", categorySelect.value);

  await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  displayWorks("all");
  addForm.reset();
  backArrow.click();
});

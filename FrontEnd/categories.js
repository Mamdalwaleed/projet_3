// Récupération et affichage des catégories
async function displayCategories() {
    const container = document.querySelector(".categories");
    const gallery = document.querySelector(".gallery");

    const categories = await (await fetch("http://localhost:5678/api/categories")).json();
    const works = await (await fetch("http://localhost:5678/api/works")).json();

    // Ajouter le bouton "Tous"
    const allBtn = document.createElement("button");
    allBtn.textContent = "Tous";
    allBtn.dataset.id = "all";
    container.appendChild(allBtn);

    // Boutons par catégorie
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat.name;
        btn.dataset.id = cat.id;
        container.appendChild(btn);
    });

    // Fonction pour afficher les works
    function showWorks(filteredWorks) {
        gallery.innerHTML = "";
        filteredWorks.forEach(work => {
            const fig = document.createElement("figure");
            fig.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}"><figcaption>${work.title}</figcaption>`;
            gallery.appendChild(fig);
        });
    }

    // Affichage initial
    showWorks(works);
}
// Lancer la fonction pour afficher les catégories et boutons
displayCategories();

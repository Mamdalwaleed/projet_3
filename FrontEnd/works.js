async function displayWorks() {

    // 1. Récupération des works depuis Swagger API
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();

    // 2. Sélection de la galerie
    const gallery = document.querySelector(".gallery");

    // 3. Vider la galerie
    gallery.innerHTML = "";

    // 4. Boucle FOR pour afficher chaque work
    for (let i = 0; i < works.length; i++) {

        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = works[i].imageUrl;
        img.alt = works[i].title;

        const caption = document.createElement("figcaption");
        caption.textContent = works[i].title;

        figure.appendChild(img);
        figure.appendChild(caption);
        gallery.appendChild(figure);
    }
}

// Lancer la fonction
displayWorks();
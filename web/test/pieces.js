
document.querySelector(".fiches").innerHTML = '';
// Récupération des pièces depuis le fichier JSON
const reponse = await fetch('pieces-autos.json');
const pieces = await reponse.json();
// Création des balises 
function creerpiece(pieces){
for(let i = 0; i < pieces.length ; i++){
const sectionFiches = document.querySelector(".fiches");
// Création d’une balise dédiée à une pièce automobile
const pieceElement = document.createElement("article");
// On crée l’élément img.
const imageElement = document.createElement("img");
// On accède à l’indice i de la liste pieces pour configurer la source de l’image.
imageElement.src = pieces[i].image;
const nomElement = document.createElement("h2");
nomElement.innerText = pieces[i].nom;
const prixElement = document.createElement("p");
prixElement.innerText = `Prix: ${pieces[i].prix} € (${pieces[i].prix < 35 ? "€" : "€€€"})`;
const categorieElement = document.createElement("p");
categorieElement.innerText = pieces[i].categorie ?? "(aucune catégorie)";
const descriptionElement = document.createElement("p");
descriptionElement.innerText = pieces[i].description ?? "Pas de description disponible.";
const dispo = document.createElement("p");
dispo.innerText = pieces[i].disponibilite ? "En Stock" : "Rupture";
sectionFiches.appendChild(pieceElement);
pieceElement.appendChild(imageElement);
pieceElement.appendChild(nomElement);
pieceElement.appendChild(prixElement);
pieceElement.appendChild(categorieElement);
pieceElement.appendChild(descriptionElement);
pieceElement.appendChild(dispo);
}
}

const range = document.querySelector("#prix-max");
const affichage = document.querySelector("#valeur-prix");

// Affiche la valeur dès le chargement
affichage.innerText = range.value;

// Met à jour à chaque mouvement du curseur
range.addEventListener("input", () => {
  affichage.innerText = range.value;
});

const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function () {
    const pieceS = Array.from(pieces);
    pieceS.sort(function (a, b) {
        return a.prix - b.prix;
    });
   document.querySelector(".fiches").innerHTML = '';
    creerpiece(pieceS);
});

const boutonFiltrer = document.querySelector(".btn-filtrer");

boutonFiltrer.addEventListener("click", function () {
   const piecesFiltrees = pieces.filter(function (piece) {
       return piece.prix <= 35;
});
   document.querySelector(".fiches").innerHTML = '';
    creerpiece(piecesFiltrees);
});

const boutonDecr = document.querySelector(".btn-prix-decroissant");
boutonDecr.addEventListener("click", function(){
    const PPiece = Array.from(pieces);
    PPiece.sort(function(a,b){
        return b.prix - a.prix;
    });
    document.querySelector(".fiches").innerHTML = '';
    creerpiece(PPiece);
});

const boutondescription = document.querySelector(".btn-desc");
boutondescription.addEventListener("click", function() {
 const piecesdesc = pieces.filter(function (piece) {
       return piece.description;
});
   document.querySelector(".fiches").innerHTML = '';
    creerpiece(piecesdesc);
});

const boutonAll = document.querySelector(".btn-ALL");
boutonAll.addEventListener("click", function() {
   document.querySelector(".fiches").innerHTML = '';
    creerpiece(pieces);
});

const inputPrixMax = document .querySelector('#prix-max');
inputPrixMax.addEventListener("input", function() {
    const valeurPrixMax = pieces.filter(function (piece) {
        return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML = '';
    creerpiece(valeurPrixMax);
});




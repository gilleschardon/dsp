//L'objectif de ces fonctions est de créer une listes de couleurs de la taille du nombre de clusters

//Fonction renvoyant une couleur aléatoire 
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
    }


// Création d'une banque couleurs bien distinctes
var banqueDeCouleur = ['#0000ff','#ff0000','#00ff00','#cc0099','#cc6600','#ffff00','#00ffff','#ffcc66'];

// Création d'une listes de k couleurs (k étant le nombre de clusters)
function initColors(){ 
    k = document.getElementById("Nombredeclusters").value;
    
    var i = 0;
    var tailleBanqueCouleur = banqueDeCouleur.length
    clustersColors = [];

    if (k <= tailleBanqueCouleur){ //On utilise une banque de couleur pour les premières valeurs des means
        for (i=0;i<k;i++){ 
            clustersColors[i] = banqueDeCouleur[i];

        }
    }
    else{
        for (var j=0; j<tailleBanqueCouleur;j++){
            clustersColors[j] = banqueDeCouleur[j];
        }
        for (var j=tailleBanqueCouleur;j<k;j++){ //Si on épuise toute les couleurs de la banque alors on attribue une couleur aléatoire !
            clustersColors[j] = getRandomColor();
    }
    
    }
}
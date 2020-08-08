// Chaud pour que tu commentes

let actualId='1';
let slider = document.getElementById('etapeParEtape-slide');
let image = document.getElementById('etapeParEtape-image');
let src = "slides/";
let extension = ".PNG";

function changerSlider(){
  txt="<tr>";
  for (let i = 1; i <= 9; i++){
    if (i!=actualId){
      txt+='<td>'+i+'</td>';
    }else{
      txt+='<td style="color:red;">'+i+'</td>';
    }
  }
  txt+='</tr>';
  document.getElementById('etapeParEtape-valeurs').innerHTML = txt
}

//Les fonctions qui permettent de modifier les paramêtres des datasets générés
//Il y a une fonction poour chaque type de dataset établi:
//Gauss = Des clusters répartis de façon gaussienne autour de centre choisi aléatoirement
//Droite = Des points répartis autour d'une droite
//Uni = Des points répartis aléatoirement
function changeDataGauss(){
    var Nombredepoints =  document.getElementById("Nombredepoints").value;
    var NombreN =  Math.floor(document.getElementById("NombreN").value);
    data = clustersDataset(NombreN, Nombredepoints,40,40);
}

function changeDataDroite(){
  var Nombredepoints =  document.getElementById("Nombredepoints2").value;
  var coefDir_a =  Math.floor(document.getElementById("CoefDir").value);
  var ordOri_b =  Math.floor(document.getElementById("OrdOri").value);
  data = linearDataset (coefDir_a , ordOri_b, Nombredepoints, 40, 40);
}

function changeDataUni(){
  var Nombredepoints =  document.getElementById("Nombredepoints3").value;
  data = uniformDataset (Nombredepoints, 40, 40);
}

function changerEtape() {
    let id = slider.value;
    if (id!=actualId){
        actualId= id;
        image.src = src + id + extension;
        changerSlider()
    }
}
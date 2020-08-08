//Les fonctions suivantes vont permettre d'effectuer l'algorithme étape par étape sur notre dataset "data"
//Fonctions basiques pour simlifier l'algorythme
{
function max(x,y){
    if (x>y){
        return x;
    }
    else {
        return y
    }
}
function getDataRanges(extremes) {
    var ranges = [];

    for (var dimension in extremes)
    {
        ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
    }

    return ranges;

}
function getDataExtremes(myData) {

    var extremes = [];

    for (var i in myData)
    {
        var point = myData[i];

        for (var dimension in point)
        {
            if ( ! extremes[dimension] )
            {
                extremes[dimension] = {min: point[dimension], max: 0};
            }

            if (point[dimension] < extremes[dimension].min)
            {
                extremes[dimension].min = point[dimension];
            }

            if (point[dimension] > extremes[dimension].max)
            {
                extremes[dimension].max = point[dimension];
            }
        }
    }

    return extremes;

}
}

//Début du K-means, on réinitialise tout les clusters associé à chaque points à 0
//Cette fonction permet entre autre de relancer un K-means sur un même dataset
function initialiserData(){
    for (var i  = 0; i<data.length; i++){
        data[i][2] = null;
    }
}

//Initialisation des centres de nos clusters, chaque 'mean' un point choisi aléatoirement dans le dataset
function initMeans() {

    means = []; // On vérifie que la liste des means est bien vide
    for (var i =0; i<k ; i++)
    {
        var mean = [];
        mean = data[Math.floor(data.length*(Math.random()))]
        mean[2]=i;
        means.push(mean);
    }
};

//On attribue à chaque point un cluster qui correspond au centre de cluster dont il est le plus proche
//Ce cluster est représenté sous la forme d'un nombre stocké dans la troisième dimension d'un élément de notre dataset
function makeAssignments() {

    for (var i in data)
    {
        var nombredeclusters = means.length;
        var nombredepoints = data.length;

        for (var i = 0; i<nombredepoints ; i++ ){
            var distanceMin = 1000000000000;
            for (var j = 0 ; j< nombredeclusters ; j++){
                var distanceCluster = Math.pow((data[i][0] - means[j][0]),2)+Math.pow((data[i][1] - means[j][1]),2);

                if (distanceCluster < distanceMin) {
                    distanceMin = distanceCluster;
                    data[i][2] = j;
                }
            }
        }
    }
}


//Chaque mean est redéfini comme le centre de tout les points qui lui ont été attribués
//Si un mean n'avait aucun point dans son cluster il prend aléatoirement la valeur d'une donnée du dataset
function moveMeans() {

    var nombredeclusters = means.length;
    var nombredepoints = data.length;
    var tailleclusters = Array(nombredeclusters).fill(0);
    for (var i = 0; i< nombredeclusters; i++){
        means[i] = [0,0,i];
    }

    for (var i = 0; i<nombredepoints ; i++){
        var j = data[i][2];

        means[j][0] += data[i][0];
        means[j][1] += data[i][1];
        tailleclusters[j]++ ;
    }
    for (var i = 0; i< nombredeclusters; i++){
        if (tailleclusters[i] != 0){
            means[i][0] = (means[i][0]/tailleclusters[i])
            means[i][1] = (means[i][1]/tailleclusters[i])
        }
        else {
            var index = Math.floor(nombredepoints*Math.random())
            means[i][0] = data[index][0];
            means[i][1] = data[index][1];
            data[index][2] = i;
        }
    }

    return(means);

}

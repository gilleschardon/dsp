// L'idée de ce fichier est d'avoir nos variables initialisée dès l'ouverture 
//de la page sans avoir à soumettre des valeurs

var data = clustersDataset(4, 120,40,40); // Notre dataset
var datasetChoisi = "Cluster"; //Nous identifions quel type de dataset nous sommes en train d'étudier, Cluster par défault !

var height = 400; 
var width = 400; // Dimensions de notre SVG

var assignments = [];

var dataExtremes = getDataExtremes(data);
var dataRange = getDataRanges(dataExtremes); //Dimensions de nos données

var etape = 0; // Initialisation pour le bouton "Etape Suivante"

var k = 3; // Nombre de clusters

var means = []; // Centre de nos clusters
var clustersColors = []; // Couleurs de nos clusters
var barycentres = []; // Centre de nos clusters

// Creation du SVG avec axes gradués
{
    var svg = d3.select(".svgTest")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "svgTest2");            
        
        var xScale = d3.scaleLinear()
            .domain([dataExtremes[0].min, dataExtremes[0].max])
            .range([0, 0.9*width]);
        
        var yScale = d3.scaleLinear()
            .domain([dataExtremes[1].min, dataExtremes[1].max])
            .range([0.9*height, 0]);
                     
        var x_axis = d3.axisBottom()
            .scale(xScale);
                
        var y_axis = d3.axisRight()
            .scale(yScale);
        
        svg.append("g")
            .attr("transform", "translate("+ 0.05*width +", "+ 0.05*height +")")
            .call(y_axis);
                 
        svg.append("g")
            .attr("transform", "translate("+ 0.05*width +", "+ 0.95*height  +")")
            .call(x_axis);
        
        var coefMultiplicateurX = 0.9*width/(max(dataRange[0],dataExtremes[0].max));
        var coefMultiplicateurY = 0.9*height/(max(dataRange[1],dataExtremes[1].max));
        console.log(coefMultiplicateurX,coefMultiplicateurY);
        console.log(dataRange[0],dataRange[1]);
        console.log((max(dataRange[0],dataExtremes[0].max)));
}
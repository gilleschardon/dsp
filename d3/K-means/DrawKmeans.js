//Les fonctions suivantes servent à représenter le dataset au cours du Kmeans dans un svg

//A chaque fois que le dataset est changé, une nouvelle echelle adapté au dataset est mise sur le svg
//Grace à cette fonction
function createSVG(data){   
    dataExtremes = getDataExtremes(data);
    dataRange = getDataRanges(dataExtremes);
    
    svg.selectAll("*").remove();
    {
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

        coefMultiplicateurX = 0.9*width/(max(dataRange[0],dataExtremes[0].max));
        coefMultiplicateurY = 0.9*height/(max(dataRange[1],dataExtremes[1].max));
        console.log(coefMultiplicateurX,coefMultiplicateurY);
        console.log(dataRange[0],dataRange[1]);
        console.log((max(dataRange[0],dataExtremes[0].max)));
    }   
    return(dataExtremes,dataRange)    
}


//Cette fonction va représenter le dataset sous formes de points colorés, chaque couleur corresspondant à un cluster
function drawData(){
    // Avant chaque itération on clean les points précédents (on redessine par dessus)
    d3.selectAll("svg > circle").remove();
    console.log(data);
    svg/*.select("#init")*/.selectAll("circleData") //Tracer le nuage de points
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return 0.05*width + d[0]*coefMultiplicateurX;
        })
        .attr("cy", function(d) {
            return 0.95*height - d[1]*coefMultiplicateurY; //On place l'ordonnée à l'origine de l'axe y  en bas à gauche
        })
        .attr("r", 3)
        .attr("fill", function(d) {
            return clustersColors[d[2]];
        });
    
    barycentres = svg.selectAll("circleBarycentre")
        .data(means)
        .enter()
        .append("circle")
            .attr("cx", function(d) {
                return 0.05*width + d[0]*coefMultiplicateurX;
            })
            .attr("cy", function(d) {
                return height - (0.05*height + d[1]*coefMultiplicateurY); //On place l'ordonnée à l'origine de l'axe y  en bas à gauche
            })
            .attr("r", 5)
            .attr("fill", function(d) {
                return clustersColors[d[2]];
            });
}

//Chaud pour que tu commentes
function drawMeans(){
    //On initialise le draw des barycentres !
     //On recalcule les nouveaux barycentres
    moveMeans(); //On déplace les barycentres (coordonnées stockées dans means2)
    barycentres.exit().remove(); // remove unneeded barycentres

    barycentres.data(means)
        .merge(barycentres)
        .transition()
        .duration(2000)
        .attr("cx", function(d) {
            return 0.05*width + d[0]*coefMultiplicateurX;
        })
        .attr("cy", function(d) {
            return height - (0.05*height + d[1]*coefMultiplicateurY); //On place l'ordonnée à l'origine de l'axe y  en bas à gauche
        })
        .attr("r", 5)
        .attr("fill", function(d) {
            return clustersColors[d[2]];
        });
    }

//Cette fonction initialise l'algorithme Kmeans et la représentation du dataset sur un svg
function initialiser(){
    initialiserData();
    initColors();
    initMeans();
    drawData();
    makeAssignments();
    etape =0;
}
// Cette fonction sert à effectuer les étapes de calculs de l'algorithme et de représentation du dataset
function etapeSuivante(){
    if (etape == 0){
        makeAssignments();
        drawData();
        etape = 1;
    }
    else if (etape == 1){
        drawMeans();
        etape = 0;
    }
}
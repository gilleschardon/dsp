//Crée un data set uniformément réparti
function uniformDataset (Nombredepoints, width, height) {
    var mydata = Array(Nombredepoints).fill([0,0]).map(function(n) {return [Math.floor(Math.random()*width) , Math.floor(Math.random()*height)];});
    return(mydata)
}

//Permet de créer une fonction Gaussienne
function CreateGaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;               
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }

       var retval = mean + stdev * y1;
       if(retval > 0) 
           return retval;
       return -retval;
   }
}
//Crée un data set avec des Gaussiennes centrées sur des points aléatoirements répartis
function clustersDataset(Nombredeclusters, Nombredepoints, width, height){
    
    var VarianceX = width/(Math.sqrt(Nombredeclusters)*9);
    var VarianceY = height/(Math.sqrt(Nombredeclusters)*9);
    var centreClusters = Array(Nombredeclusters).fill(0).map(function(n) {return [3*VarianceX + Math.floor(Math.random()*(width-6*VarianceX)) ,3*VarianceY + Math.floor(Math.random()*(height-6*VarianceY))];});

    var mydata = Array(Nombredepoints).fill([50,50]);
    var k = 0;

    for (let i=0; i<Nombredeclusters; i++) {
        var clusterGaussianX = CreateGaussian(centreClusters[i][0], VarianceX);
        var clusterGaussianY = CreateGaussian(centreClusters[i][1], VarianceY);
        while (k < (i+1)*Nombredepoints/Nombredeclusters && k<Nombredepoints ){
            mydata[k] = [clusterGaussianX() , clusterGaussianY()];
            k++;
        }
    }
    return(mydata)
    
}

//Crée un data set reparti de façon gaussienne autour de la droite y = a*x + b
function linearDataset (a , b, Nombredepoints, width, height) {
    var GaussianY = CreateGaussian(0, height/10);

    var mydata = Array(Nombredepoints).fill([0,0])
    for (let i=0; i<Nombredepoints; i++) {
        var x = Math.floor(Math.random()*width);
        mydata[i] = [x,a*x+b+GaussianY()]

    }
    return(mydata)
}

//La fonction qui permet de changer de dataset généré pour l'expérience
function affiche_button(id){
    document.getElementById("gaussienne").style.display="none";
    document.getElementById("droite").style.display="none";
    document.getElementById("homogene").style.display="none";
    if (id==1){
        document.getElementById("gaussienne").style.display="block";
    }
    if (id==2){
        document.getElementById("droite").style.display="block";
    }
    if (id==3){
        document.getElementById("homogene").style.display="block";
    }
}
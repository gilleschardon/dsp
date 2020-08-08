// G. Chardon, T. Badoz, A. Dubourg, 2020
// No licence yet, work in progress

//Initialisation des centres de nos clusters, chaque 'mean' un point choisi aléatoirement dans le dataset
function initMeans(data, K) {

    means = []; // On vérifie que la liste des means est bien vide
    for (var i =0; i<K ; i++)
    {
        var mean = [];
        mean = data[Math.floor(data.length*(Math.random()))]
        means.push(mean);
    }
    return means;
}

//On attribue à chaque point un cluster qui correspond au centre de cluster dont il est le plus proche
//Ce cluster est représenté sous la forme d'un nombre stocké dans la troisième dimension d'un élément de notre dataset
function makeAssignments(data, means)
{
  var K = means.length;
  var L = data.length;

  var assignments = new Array()

  const distances = new Float32Array()
  distances.length = K
  for (var i = 0; i < L ; i++ )
  {
    idx = 0
    distmin = Math.pow((data[i][0] - means[0][0]),2)+Math.pow((data[i][1] - means[0][1]),2);
    for (var j = 1 ; j < K ; j++)
    {
      dist = Math.pow((data[i][0] - means[j][0]),2)+Math.pow((data[i][1] - means[j][1]),2);

      if (dist < distmin)
      {
        idx = j;
        distmin = dist
      }
    }
    assignments[i] = idx
  }
  return assignments;
}


//Chaque mean est redéfini comme le centre de tout les points qui lui ont été attribués
//Si un mean n'avait aucun point dans son cluster il prend aléatoirement la valeur d'une donnée du dataset
function updateMeans(data, assignments)
{
  var clusters = [...new Set(assignments)]
  K = clusters.length
  var L = data.length;

  var sizes = Array(K).fill(0);

  var mmeans = Array(K)

  for (var i = 0; i< K; i++){

        mmeans[i] = Array.of(0,0)

    }
  for (var i = 0; i<L ; i++){


        mmeans[assignments[i]][0] = mmeans[assignments[i]][0] + data[i][0]
        mmeans[assignments[i]][1] = mmeans[assignments[i]][1] + data[i][1]
        sizes[assignments[i]]++ ;

    }


    for (var i = 0; i< K; i++){

          mmeans[i][0] = mmeans[i][0] / sizes[i]
          mmeans[i][1] = mmeans[i][1] / sizes[i]

      }

    return mmeans ;

}

data = Array()
var rx = d3.randomNormal(0, 1)
var ry = d3.randomNormal(0, 1)

for(var i = 0 ; i < 20 ; i++)
{
  d = Array(2)
  d[0] = rx()
  d[1] = ry()

  data.push(d)
}

var rx = d3.randomNormal(4, 1)
var ry = d3.randomNormal(4, 1)

for(var i = 0 ; i < 20 ; i++)
{
  d = Array(2)
  d[0] = rx()
  d[1] = ry()

  data.push(d)
}

var rx = d3.randomNormal(4, 1)
var ry = d3.randomNormal(-4, 1)

for(var i = 0 ; i < 20 ; i++)
{
  d = Array(2)
  d[0] = rx()
  d[1] = ry()

  data.push(d)
}
var margins = {
  left: 50,
  right: 20,
  bottom: 20,
  top: 30
};

var rx = d3.randomNormal(10, 0.5)
var ry = d3.randomNormal(0, 0.5)

for(var i = 0 ; i < 20 ; i++)
{
  d = Array(2)
  d[0] = rx()
  d[1] = ry()

  data.push(d)
}
var margins = {
  left: 50,
  right: 20,
  bottom: 20,
  top: 30
};


var rx = d3.randomNormal(10, 2)
var ry = d3.randomNormal(10, 2)

for(var i = 0 ; i < 40 ; i++)
{
  d = Array(2)
  d[0] = rx()
  d[1] = ry()

  data.push(d)
}
var margins = {
  left: 50,
  right: 20,
  bottom: 20,
  top: 30
};

xrange = [-4,20];
yrange = [-4, 20]

dataz = d3.transpose(data)

datazz = {x: dataz[0], y: dataz[1], r: Array(40).fill(20)}

axis = new Axis("#plot", 600, 600, margins, xrange, yrange)

K  = 5

var means = initMeans(data, K)

meansz = d3.transpose(means)
meanszz = {x: meansz[0], y: meansz[1], r: Array(K).fill(20)}

A = makeAssignments(data, means)

datazz = Array(K)

for (var k = 0 ; k < K ; k++)
{
    datazz[k] = {x: [], y: [], r: []}
}

for (var i = 0; i < 120 ; i++)
{
  datazz[A[i]].x.push(data[i][0])
  datazz[A[i]].y.push(data[i][1])
  datazz[A[i]].r.push(10)
}

axis.scatter("data1", datazz[0])
axis.scatter("data2", datazz[1])
axis.scatter("data3", datazz[2])

axis.scatter("data4", datazz[3])
axis.scatter("data5", datazz[4])

axis.scatter("means", meanszz,false, null, true)

function step()
{
  d3.select('#plot').selectAll("*").remove();

  means = updateMeans(data, A)
  A = makeAssignments(data, means)

  for (var k = 0 ; k < K ; k++)
  {
      datazz[k] = {x: [], y: [], r: []}
  }

  for (var i = 0; i < 120 ; i++)
  {
    datazz[A[i]].x.push(data[i][0])
    datazz[A[i]].y.push(data[i][1])
    datazz[A[i]].r.push(10)
  }
  axis = new Axis("#plot", 600, 600, margins, xrange, yrange)
  meansz = d3.transpose(means)

meanszz = {x: meansz[0], y: meansz[1], r: Array(K).fill(20)}

  axis.scatter("data1", datazz[0])
  axis.scatter("data2", datazz[1])
  axis.scatter("data3", datazz[2])
  axis.scatter("data4", datazz[3])
  axis.scatter("data5", datazz[4])

  axis.scatter("means", meanszz,false, null, true)

}

d3.select('#step').on("click", step)

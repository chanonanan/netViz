var nodes = []
var edges = []
var size = {};
var names = {}
var ans = [];
var startSize = 3;
var json;
var graphName;
var graphType = 'none';
var type = [];
var categories = [];
var colors = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
$(document).ready(function(){
   $("#international").click(function(){
       nodes = [];
       edges = [];
       size = {};
       names = {}
       ans = [];
       type = [];
       categories = [];
       Papa.parse('/assets/csv/2018-07-International Exchange - _Index.csv',{
           header: true,
           download: true,
           skipEmptyLines: true,
           complete: function(results) {
               // console.log("results:", results);
               genGraph(results);
           }
       });
   });
   $("#domestic").click(function(){
       nodes = [];
       edges = [];
       size = {};
       names = {}
       ans = [];
       type = [];
       categories = [];
       Papa.parse('/assets/csv/2018-07-Domestic Exchange - Index.csv',{
           header: true,
           download: true,
           skipEmptyLines: true,
           complete: function(results) {
               // console.log("results:", results);

               genGraph(results);
           }
       });
   });

 })
 function genGraph(results){
   var max = 0;
   var numNode = 0;
   for (var i = 0; i < results.data.length; i++) {
     if(!(type.includes(results.data[i]['Type']))){
       type.push(results.data[i]['Type']);
       categories.push({name:results.data[i]['Type'],base:results.data[i]['Type'],keyword:{}});
     }
     var color = colors[type.indexOf(results.data[i]['Type'])];
     // var color = '#'+ Math.floor(Math.random()*16777215).toString(16);
     if( ans.indexOf(results.data[i]['ASN']) === -1 ){
       numNode +=1;
         var node = {
           'type': results.data[i]['Type'],
           'id': results.data[i]['ASN'],
           'x': Math.floor(Math.random() * (1000 - (-1000) + 1)) + (-1000),
           'y': Math.floor(Math.random() * (1000 - (-1000) + 1)) + (-1000),
           'attributes': {},
           'label': results.data[i]['ASN'],
           'color': color,
           'size': startSize,
           'category': type.indexOf(results.data[i]['Type']),
         }
         nodes.push(node);
        // size[results.data[i]['ASN']] = startSize;
        // names[results.data[i]['ASN']] = results.data[i]['Name'];
        ans.push(results.data[i]['ASN']);
        // console.log("not duplicate",results.data[i]);
      }else{
       //  if (Object.values(nodes).includes(results.data[i]['ASN']) > -1) {
       //
       //    console.log('has test1');
       // }
       Object.keys(nodes).forEach(function(key) {
         // console.log(key);
         if (nodes[key].id == results.data[i]['ASN']) {
           nodes[key].size += 0.3;
           if(nodes[key].size>max){max = nodes[key].size;}
           // console.log('has test2');
         }
       });
        // size[results.data[i]['ASN']] += 1;
      }
      if( ans.indexOf(results.data[i]['ASN-source']) === -1 ){
        numNode +=1;

          var node = {
            'type': results.data[i]['Type'],
            'id': results.data[i]['ASN-source'],
            'x': Math.floor(Math.random() * (1000 - (-1000) + 1)) + (-1000),
            'y': Math.floor(Math.random() * (1000 - (-1000) + 1)) + (-1000),
            'attributes': {},
            'label': results.data[i]['ASN-source'],
            'color': color,
            'size': startSize
          }
          nodes.push(node);
         ans.push(results.data[i]['ASN-source']);
       }else{
        Object.keys(nodes).forEach(function(key) {
          // console.log(key);
          if (nodes[key].id == results.data[i]['ASN-source']) {
            nodes[key].size += 0.3;
            if(nodes[key].size>max){max = nodes[key].size;}
          }
        });
       }
     var edge = {
       'sourceID': results.data[i]['ASN-source'],
       'targetID':  results.data[i]['ASN'],
       // 'attributes': {},
       'size': results.data[i]['Bandwidth']*0.1
     }
     edges.push(edge);

     if(type.indexOf(results.data[i]['Type']) === -1){
       // console.log(results.data[i]['Type']);
       type.push(results.data[i]['Type']);
     }
   }
   // console.log('max size',max);
   // console.log('num node',numNode);
   // console.log('ans',ans);
   var jsonData = {'nodes':nodes,'edges':edges};
   var jsonString = JSON.stringify(jsonData);
   json = jsonData;
   draw();

 }
 function draw() {
   console.log(categories,json);
   var dom = document.getElementById("container");
   var myChart = echarts.init(dom);
   var app = {};
   option = null;
   myChart.setOption(option = {
       title: {
           text: graphName
       },
       legend: {
         data: categories.map(function (a) {
              return a.name;
          })
       },
       tooltip: {},
       animationDurationUpdate: 1500,
       animationEasingUpdate: 'quinticInOut',
       series : [
           {
               // name: 'ISP-Inter',
               // name: function () {
               //   console.log('ISP-Inter');
               //     return 'ISP-Inter';
               // },
               type: 'graph',
               layout: graphType,
               legendHoverLink: true,
               progressiveThreshold: 700,
               draggable: true,
               circular: {
                    rotateLabel: true
                },
               force: {
                   // initLayout: 'circular',
                   edgeLength: 200,
                   repulsion: 500,
                   gravity: 0.000000000002,
                   layoutAnimation: true,
               },
               categories: categories,
               data: json.nodes.map(function (node) {
                 // console.log(node);
                   return {
                       x: node.x,
                       y: node.y,
                       id: node.id,
                       name: node.label,
                       symbolSize: node.size,
                       itemStyle: {
                           normal: {
                               color: node.color
                           }
                       },
                       categories: node.category,
                       label: {
                          normal: {
                              show: node.size > 6,
                              position: 'right',
                              backgroundColor:'white',
                              formatter: '{b}'
                              // textBorderColor: 'black',
                              // textborderWidth: 5
                          },
                           emphasis: {
                               position: 'right',
                               show: true
                           }
                       },
                   };
               }),
               edges: json.edges.map(function (edge) {
                   if(edge.size<=0.5){
                     return {
                       source: edge.sourceID,
                       target: edge.targetID,
                       lineStyle: {
                           normal: {
                               width: 0.5,
                               // curveness: 0.3,
                               opacity: 0.7
                           }
                       }
                     };
                   }else{
                     return {
                       source: edge.sourceID,
                       target: edge.targetID,
                       lineStyle: {
                           normal: {
                               width: 0.5,
                               // curveness: 0.3,
                               opacity: 0.7
                           },
                           emphasis: {
                               width: edge.size,
                               // curveness: 0.3,
                               opacity: 0.7
                           }
                       }
                     };
                   }

                   // return {
                   //     source: edge.sourceID,
                   //     target: edge.targetID,
                   //
                   // };
               }),

               roam: true,
               focusNodeAdjacency: true,

           }
       ]
   }, true);
   if (option && typeof option === "object") {
       myChart.setOption(option, true);
   }
 }
 function changeType() {
     graphType = document.getElementById("graphType").value;
     draw();
 }

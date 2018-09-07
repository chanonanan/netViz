var host = {'egress':[],'ingress':[]};
var hostName = {'egress':[],'ingress':[]};
var type = {'egress':[],'ingress':[]};
var typeName = {'egress':[],'ingress':[]};


$(document).ready(function(){
   // $("#loadCSV").click(function(){
   $.get('/assets/json/irr.json', function (data) {
     drawTree(data,"percentage");
   })
   $.get('/assets/json/fileType.json', function (data) {
     drawTree(data.filetype_egress,"type-egress");
     drawTree(data.filetype_ingress,"type-ingress");
   })
   $.get('/assets/json/topMost.json', function (data) {
     var schema = [
        {name: 'TIME', index: 0, text: 'TIME'},
        {name: 'username', index: 1, text: 'USER'},
        {name: 'IP_SRC', index: 2, text: 'IP_SRC'},
        {name: 'IP_DEST', index: 3, text: 'IP_DEST'},
        {name: 'PORT_DEST', index: 4, text: ' PORT_DEST'},
        {name: 'HOSTNAME', index: 5, text: 'HOSTNAME'},
    ];
    console.log('te');
    drawParallel(data,schema,"timeline");
  })
   Papa.parse('/assets/web_log/web-anon-201704100300.0.txt',{
       delimiter: " ",
       header: false,
       download: true,
       skipEmptyLines: true,
       complete: function(results) {
         console.log("results:", results);
         for(var i=0;i<results.data.length;i++){
           if(results.data[i][11].startsWith("158.108") || results.data[i][11].startsWith("10.") || results.data[i][11].startsWith("2406:") ){
             if(!(hostName.ingress.includes(results.data[i][16]))){
               hostName.ingress.push(results.data[i][16]);
               host.ingress.push({
                 name: results.data[i][16],
                 value: 1
               });
             }else{
               host.ingress[hostName.ingress.indexOf(results.data[i][16])]['value']++;
             }
             var split = results.data[i][17].split('/');
             var lastSplit = split[split.length - 1].split('.');
             var reqType = lastSplit[lastSplit.length - 1];
             if(!(typeName.ingress.includes(reqType))){
               typeName.ingress.push(reqType);
               type.ingress.push({
                 name: results.data[i][17],
                 value: 1
               });
             }else{
               type.ingress[typeName.ingress.indexOf(reqType)]['value']++;
             }
           }else{
             if(!(hostName.egress.includes(results.data[i][16]))){
               hostName.egress.push(results.data[i][16]);
               host.egress.push({
                 name: results.data[i][16],
                 value: 1
               });
             }else{
               host.egress[hostName.egress.indexOf(results.data[i][16])]['value']++;
             }
           }
         }
         console.log(type);
         drawTree(host.ingress,"ingress");
         drawTree(host.egress,"egress");

             // drawTree(percentage,"percentage");
             drawBar("irregular");
           }
   });
 })

 function drawTree(user,element) {
   var dom = document.getElementById('container-'+element);
   var myChart = echarts.init(dom);
   var app = {};
   option = null;
   option = {
     tooltip: {
        },
       series: [{
           type: 'treemap',
           name: element,
           data: user
       }],
       color: ['#afbab2','#00b7c6','#8499a5','#f9c9a3','#6d87a8','#00a0c4','#dbe06b','#076d54','#3f7c9d','#f94f8e']
   };
   ;
   if (option && typeof option === "object") {
       myChart.setOption(option, true);
   }

 }

 function drawBar(element) {
   var dom = document.getElementById('container-'+element);
   var myChart = echarts.init(dom);
   var app = {};
   option = null;
   option = {
       tooltip: {
           trigger: 'axis',
           axisPointer: {
               type: 'shadow'
           }
       },
       yAxis: {
           type: 'value'
       },
       xAxis: {
            type: 'category',
            data: ['03.00', '03.01','03.02','03.03','03.04','03.05','03.06','03.07','03.08','03.09','03.10','03.11',
            '03.12','03.13','03.14','03.15','03.16','03.17','03.18','03.19','03.20','03.21','03.22','03.23','03.24',
            '03.25','03.26','03.27','03.28','03.29','03.30','03.31','03.32','03.33','03.34','03.35','03.36','03.37',
            '03.38','03.39','03.40','03.41','03.42','03.43','03.44','03.45','03.46','03.47','03.48','03.49','03.50',
            '03.51','03.52','03.53','03.54','03.55','03.56','03.57','03.58','03.59'],
            boundaryGap: [0, 0.01]
        },
        series: [{
            name: 'Login Server',
            type: 'bar',
            data: [5790, 5193,6195,5829,5839,6253,5736,8454,5447,5235,5630,6138,5411,5510,5101,5587,5701,5527,5241,
              5000,5205,4925,4179,4649,4481,4882,4856,4798,4688,4739,4755,4768,4452,4509,4335,4049,3412,3262,3340,
              3612,3041,3071,3001,3136,3156,3166,2962,3193,3107,3032,2614,2772,2687,2664,2663,2707,2667,2977,2941,2564],
            // label: {
            //     normal: {
            //         show: true,
            //         position: 'inside'
            //     }
            // },
        }],
        color: ['#afbab2']
   };
   ;
   if (option && typeof option === "object") {
       myChart.setOption(option, true);
   }

 }

 function drawParallel(datas,schema,element) {
   console.log(datas,schema,element);
   var dom = document.getElementById('container-'+element);
   var myChart = echarts.init(dom);
   var app = {};
   option = null;
   option = {
 //     backgroundColor: new echarts.graphic.RadialGradient(0.5, 0.5, 0.4, [{
 //     offset: 0,
 //     color: '#4b5769'
 // }, {
 //     offset: 1,
 //     color: '#404a59'
 // }]),
        legend: {
            bottom: 30,
            data: ["RMUn6owxz3Npjow@ku.ac.th", "RMUjtMPNJ6aT3TB@ku.ac.th", "RMUpKGYn9d5by4N@ku.ac.th"],
            itemGap: 20,
            textStyle: {
                color: '#fff',
                fontSize: 14
            }
        },
        tooltip: {
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: function (obj) {
                var value = obj[0].value;
                return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                    + obj[0].seriesName + ' ' + value[0] + '日期：'
                    + value[7]
                    + '</div>'
                    + schema[1].text + '：' + value[1] + '<br>'
                    + schema[2].text + '：' + value[2] + '<br>'
                    + schema[3].text + '：' + value[3] + '<br>'
                    + schema[4].text + '：' + value[4] + '<br>'
                    + schema[5].text + '：' + value[5] + '<br>'
                    + schema[6].text + '：' + value[6] + '<br>';
            }
        },
        parallelAxis: [
            {dim: 0, name: schema[0].text, inverse: true, nameLocation: 'start', data: datas.time, type: 'category'},
            {dim: 1, name: schema[1].text,
            type: 'category', data: ["RMUn6owxz3Npjow@ku.ac.th", "RMUjtMPNJ6aT3TB@ku.ac.th", "RMUpKGYn9d5by4N@ku.ac.th"]},
            {dim: 2, name: schema[2].text,
            type: 'category', data: datas.ip_src},
            {dim: 3, name: schema[3].text ,
            type: 'category', data: datas.ip_dest},
            {dim: 4, name: schema[4].text ,
            type: 'category', data: datas.port_dest},
            {dim: 5, name: schema[5].text ,
            type: 'category', data: datas.hostname},
       ],
        // visualMap: {
        //     show: true,
        //     min: 0,
        //     max: 150,
        //     dimension: 2,
        //     inRange: {
        //         color: ['#d94e5d','#eac736','#50a3ba'].reverse(),
        //         // colorAlpha: [0, 1]
        //     }
        // },
        parallel: {
            left: '5%',
            right: '18%',
            bottom: 100,
            parallelAxisDefault: {
                type: 'value',
                name: 'AQI指数',
                nameLocation: 'end',
                nameGap: 20,
                nameTextStyle: {
                    color: 'black',
                    fontSize: 12
                },
                axisLine: {
                    lineStyle: {
                        color: 'black'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: 'black'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: 'black'
                    }
                }
            }
        },
        series: [
            {
                name: '北京',
                type: 'parallel',
                smooth: true,
                data: datas.lists,
                lineStyle: {
                    normal: {
                        color: '#afbab2',
                        width: 0.5,
                        // opacity: 0.6
                    }
                },
                // blendMode: 'lighter',
            },
        ]
    };;
   if (option && typeof option === "object") {
     console.log('assas');
       myChart.setOption(option, true);
   }

 }

var active = {};
var blockIP = [];
$(document).ready(function(){
  for(var i=0;i<256;i++){
    active[i] = {};
    blockIP.push({'name': 'Faculty'+i, 'ip': '158.108.'+i+'.0/24'})
    for(var j=0;j<256;j++){
      active[i][j] = 0;
    }
  }
  console.log(blockIP);
  console.log("ip",inSubNet('192.31.252.63', '192.30.252.0/22'));
  Papa.parse('/assets/csv/login-20170102-anon.csv',{
     delimiter: " ",
     header: false,
     download: true,
     skipEmptyLines: true,
     complete: function(results) {
       // console.log("results:", results);
       for(var i=0;i<results.data.length;i++){
         var ipv4 = results.data[i][5].split('.');
         if(ipv4[0] == '158' && ipv4[1] == '108'){
           // var blocked = false;
           // for(var j of blockIP){
           //
           //   if(inSubNet(results.data[i][5], j)){
           //     blocked = true;
           //     console.log(results.data[i][5],j);
           //   }
           // }
           // if(blocked){
           //   active[ipv4[2]][ipv4[3]] = -1;
           // }else{
           //   if(active[ipv4[2]][ipv4[3]] >= 0){
           //     active[ipv4[2]][ipv4[3]]++;
           //   }
           // }
           active[ipv4[2]][ipv4[3]]++;

           // console.log('add',active[ipv4[2]][ipv4[3]]);
         }
       }
       var data = [];
       var x = [];
       var max = 0;
       for(var i=0;i<256;i++){
         x.push(i+'');
         for(var j=0;j<256;j++){
           if(active[i][j]>0){
             data.push([j,i,active[i][j]]);
           }else{
             data.push([j,i,'-']);
           }

           if(active[i][j]>max){
             max = active[i][j];
           }
         }
       }
       drawActive(data,x,x,max);
     }
  });
})

function drawActive(data,x,y,max) {
  var dom = document.getElementById("container");
  var myChart = echarts.init(dom);
  option = null;

  //
  // data = data.map(function (item) {
  //   // console.log(item);
  //     return [item[1], item[0], item[2] || '-'];
  // });

  option = {
      tooltip: {
          position: 'top',
          // formatter: '{c}'
          formatter: function (obj) {
            var value = obj.value;
            // console.log(value);
            var ip = '158.108.' + value[1] + '.' + value[0];
            var faculty ='';
            for(var j of blockIP){
              if(inSubNet(ip, j.ip)){
                faculty = j.name;
              }
            }
            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                + faculty
                + '</div>'
                + '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                + 'IP : 158.108.' + value[1] + '.' + value[0]
                + '</div>'
                + 'count ：' + value[2]
        }
      },
      animation: false,
      dataZoom: [{
            type: 'slider',
            xAxisIndex: 0,
            // filterMode: 'weakFilter',
            height: 10,
            bottom: 0,
            start: 0,
            end: 100,
            // handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: 0,
            showDetail: false,
            show: false
        }, {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            start: 0,
            end: 100,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true
        }, {
            type: 'slider',
            yAxisIndex: 0,
            zoomLock: true,
            width: 10,
            right: 10,
            top: 70,
            bottom: 20,
            start: 0,
            end: 100,
            handleSize: 0,
            showDetail: false,
            show: false
        }, {
            type: 'inside',
            yAxisIndex: 0,
            start: 0,
            end: 100,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            moveOnMouseWheel: true
        }],
      grid: {
          height: '95%',
          y: '2%'
      },
      xAxis: {
          type: 'category',
          data: x,
          axisLine: {
              lineStyle: {
                  color: '#eee'
              }
          }
          // splitArea: {
          //     show: true,
          //     interval: 0
          // }
      },
      yAxis: {
          type: 'category',
          data: y,
          axisLine: {
              lineStyle: {
                  color: '#eee'
              }
          }
          // splitArea: {
          //     show: true,
          //     interval: 0
          // }
      },
      visualMap: {
        type: 'piecewise',
        min: 0,
        max: 100,
        calculable: true,
        realtime: false,
        splitNumber: 8,
        // text: ['High', 'Low'],
        textStyle: {
          color: '#eee',
        },
        // inRange: {
        //     color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        // }
    },
      series: [
        {
            name: 'Active IP',
            type: 'heatmap',
            // coordinateSystem: 'geo',
            data: data,
            // label: {
            //     normal: {
            //         show: true
            //     }
            // },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        },
      ]
  };;
  if (option && typeof option === "object") {
      myChart.setOption(option, true);
  }
}

function ip2long(ip){
    var components;

    if(components = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/))
    {
        var iplong = 0;
        var power  = 1;
        for(var i=4; i>=1; i-=1)
        {
            iplong += power * parseInt(components[i]);
            power  *= 256;
        }
        return iplong;
    }
    else return -1;
};

function inSubNet(ip, subnet)
{
    var mask, base_ip, long_ip = ip2long(ip);
    if( (mask = subnet.match(/^(.*?)\/(\d{1,2})$/)) && ((base_ip=ip2long(mask[1])) >= 0) )
    {
        var freedom = Math.pow(2, 32 - parseInt(mask[2]));
        return (long_ip > base_ip) && (long_ip < base_ip + freedom - 1);
    }
    else return false;
};

var user = {};
var numUser = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var numLogin = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var numLogout = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var numIP = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var numIPv6 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var numIPdual = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var sumIP = 0;
var sumIPv6 = 0;
var sumIPdual = 0;
var IPv4 = {};
var IPv6 = {};
var IPdual = {};
var numServer = {};
var numActivity = {};
$(document).ready(function(){
   // $("#loadCSV").click(function(){
       Papa.parse('assets/csv/login-20170102-anon.csv',{
           delimiter: " ",
           header: false,
           download: true,
           skipEmptyLines: true,
           complete: function(results) {
             // console.log("results:", results);
             var first_login = true;
             var first_logout = true;
             var first_timeout = true;
             var first_relogin = true;
             for(var i=0;i<results.data.length;i++){
               var login_timestamp = results.data[i][1];
               var logout_timestamp = results.data[i][3];
               if(results.data[i][1] != '-'){
                 results.data[i][1] = moment(parseInt(results.data[i][1])).format("DD-MM-YYYY HH:mm:ss");
               }
               if(results.data[i][3] != '-'){
                 results.data[i][3] = moment(parseInt(results.data[i][3])).format("DD-MM-YYYY HH:mm:ss");
               }
               if(results.data[i][18] != '-'){
                 results.data[i][18] = moment(parseInt(results.data[i][18])).format("DD-MM-YYYY HH:mm:ss");
               }
               if(results.data[i][8] == 'TIMEOUT' && first_timeout){
                 console.log(results.data[i]);
                 first_timeout = false;
               }
               if(results.data[i][8] == 'logout-page' && first_logout){
                 console.log(results.data[i][1],results.data[i][3],results.data[i][1]);
                 first_logout = false;
               }
               if(results.data[i][8] == 'login-page' && first_login){
                 console.log(results.data[i]);
                 first_login = false;
               }
               if(results.data[i][8] == 'RE-LOGIN' && first_relogin){
                 console.log(results.data[i]);
                 first_relogin = false;
               }
               var dmp;
              if(results.data[i][3] != '-'){
                if(results.data[i][2] in user){
                  if(user[results.data[i][2]].includes(login_timestamp)){
                    user[results.data[i][2]].splice(user[results.data[i][2]].indexOf(login_timestamp),1)
                  }else{
                    //login from outside log
                  }
                }else{
                  //login from outside log
                }
                var count =0;
                Object.keys(user).forEach(function(key) {
                  if (user[key] > 0) {
                    count++;
                  }
                });
                dmp = parseInt(results.data[i][3].split(' ')[1].split(':')[0]);


              }else{
                if(results.data[i][2] in user){
                  user[results.data[i][2]].push(login_timestamp);
                }else{
                  user[results.data[i][2]] = [login_timestamp];
                }
                var count =0;
                Object.keys(user).forEach(function(key) {
                  if (user[key] > 0) {
                    count++;
                  }
                });
                dmp = parseInt(results.data[i][1].split(' ')[1].split(':')[0]);
                // numUser[dmp] = count;
                // numLogin[dmp]++;

              }
              numUser[dmp] = count;
              numLogout[dmp]++;
              if(results.data[i][5] != '-' && results.data[i][6] == '-'){
                numIP[dmp]++;

                if(results.data[i][5] in IPv4){
                  IPv4[results.data[i][5]]++;
                }else{
                  IPv4[results.data[i][5]] = 1;
                  sumIP++;
                }
              }
              if(results.data[i][6] != '-' && results.data[i][5] == '-'){
                numIPv6[dmp]++;
                // sumIPv6++;
                if(results.data[i][6] in IPv6){
                  IPv6[results.data[i][6]]++;
                }else{
                  IPv6[results.data[i][6]] = 1;
                  sumIPv6++;
                }
              }
              if(results.data[i][5] != '-' && results.data[i][6] != '-'){
                numIPdual[dmp]++;
                // sumIPdual++;
                if(results.data[i][6] in IPdual){
                  IPdual[results.data[i][6]]++;
                }else{
                  IPdual[results.data[i][6]] = 1;
                  sumIPdual++;
                }
              }
             if (results.data[i][7] in numServer){
               numServer[results.data[i][7]]++;
             }else{
               numServer[results.data[i][7]] = 1;
             }
             if (results.data[i][8] in numActivity){
               numActivity[results.data[i][8]]++;
             }else{
               numActivity[results.data[i][8]] = 1;
             }

             }
             // console.log(numUser);
             var resultServer = Object.keys(numServer).map(function(key) {
               return {'name':key, 'value':numServer[key]};
             });
             var serverName = Object.keys(numServer).map(function(key) {
               return key;
             });
             var resultActivity = Object.keys(numActivity).map(function(key) {
               return {'name':key, 'value':numActivity[key]};
             });
             var activityName = Object.keys(numActivity).map(function(key) {
               return key;
             });
             var resultIP = [{'name':'IPv4', 'value':sumIP},{'name':'IPv6', 'value':sumIPv6},{'name':'dualIP', 'value':sumIPdual}];
             var ipName = ['IPv4','IPv6','dualIP'];
             drawUser(numUser);
             drawIp(numIP,numIPv6,numIPdual);
             drawIp2(resultIP,ipName);
             drawLogin(numLogin,numLogout);
             drawServer(resultServer,serverName);
             drawActivity(resultActivity,activityName);
           }
       });
   // });

 })
 function drawUser(numUser) {
   var dom = document.getElementById("container-user");
   var myChart = echarts.init(dom);
   var app = {};
   option = null;
   option = {
     title : {
         text: '#USER',
         x:'left'
     },
     legend: {
         data:['#USER'],
     },
     tooltip: {
          trigger: 'axis',
      },
       xAxis: {
           type: 'category',
           data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
           '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
       },
       yAxis: {
           type: 'value'
       },
       series: [
         {
             name:'#USER',
             data: numUser,
             type: 'line'
         }
     ],
     color: ['#afbab2','#00b7c6','#8499a5','#f9c9a3','#6d87a8','#00a0c4','#dbe06b','#076d54','#00335b','#f94f8e']
   };
   ;
   if (option && typeof option === "object") {
       myChart.setOption(option, true);
   }
 }
 function drawLogin(numLogin,numLogout) {
   var dom = document.getElementById("container-login");
   var myChart = echarts.init(dom);
   var app = {};
   option = null;
   option = {
     title : {
         text: 'Login/Logout',
         x:'left'
     },
     legend: {
         data:['Login','Logout'],
     },
     tooltip: {
          trigger: 'axis',
      },
       xAxis: {
           type: 'category',
           data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
           '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
       },
       yAxis: {
           type: 'value'
       },
       series: [
         {
             name:'Login',
             data: numLogin,
             type: 'line',
             // color: '#afbab2'
         },
         {
             name:'Logout',
             data: numLogout,
             type: 'line',
             // color: '#00b7c6'
         },
     ],
     color: ['#afbab2','#00b7c6','#8499a5','#f9c9a3','#6d87a8','#00a0c4','#dbe06b','#076d54','#00335b','#f94f8e']
   };
   ;
   if (option && typeof option === "object") {
       myChart.setOption(option, true);
   }
 }
 function drawIp(numIP,numIPv6,numIPdual) {
   var dom = document.getElementById("container-ip");
   var myChart = echarts.init(dom);
   var app = {};
   option = null;
   option = {
     title : {
         text: 'IP',
         x:'left'
     },
     legend: {
         data:['IPv4','IPv6','Dual'],
     },
     tooltip: {
          trigger: 'axis',
      },
       xAxis: {
           type: 'category',
           data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
           '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
       },
       yAxis: {
           type: 'value'
       },
       series: [
         {
             name:'IPv4',
             data: numIP,
             type: 'line'
         },
         {
             name:'IPv6',
             data: numIPv6,
             type: 'line'
         },
         {
             name:'Dual',
             data: numIPdual,
             type: 'line'
         },
     ],
     color: ['#afbab2','#00b7c6','#8499a5','#f9c9a3','#6d87a8','#00a0c4','#dbe06b','#076d54','#00335b','#f94f8e']
   };
   ;
   if (option && typeof option === "object") {
       myChart.setOption(option, true);
   }
 }
 function drawServer(resultServer,serverName) {
   var dom = document.getElementById("container-server");
   var myChart = echarts.init(dom);
   var app = {};
   option = null;
   option = {
     title : {
         text: 'Server',
         x:'left'
     },
         tooltip: {
             trigger: 'axis',
             axisPointer: {
                 type: 'shadow'
             }
         },
         // legend: {
         //     data: serverName
         // },
         grid: {
             left: '3%',
             right: '4%',
             bottom: '3%',
             containLabel: true
         },
         xAxis: {
             type: 'value',
             boundaryGap: [0, 0.01]
         },
         yAxis: {
             type: 'category',
             data: serverName
         },
         series: [{
                 name: 'Server',
                 type: 'bar',
                 data: resultServer
         }],
         color: ['#afbab2']
     };
   ;
   if (option && typeof option === "object") {
       myChart.setOption(option, true);
   }
 }
 function drawIp2(resultIP,ipName) {
   // console.log(resultIP,ipName);
   var dom = document.getElementById("container-ip2");
   var myChart = echarts.init(dom);
   var app = {};
   option = null;
   option = {
     title : {
         text: 'IP',
         x:'left'
     },
     tooltip : {
         trigger: 'item',
         formatter: "{a} <br/>{b} : {c} ({d}%)"
     },
     legend: {
         orient: 'vertical',
         left: 'right',
         data: ipName
     },
     series : [
         {
             name: 'IP',
             type: 'pie',
             radius : '55%',
             // center: ['50%', '60%'],
             data:resultIP,
             itemStyle: {
                 emphasis: {
                     shadowBlur: 10,
                     shadowOffsetX: 0,
                     shadowColor: 'rgba(0, 0, 0, 0.5)'
                 }
             }
         }
     ],
     color: ['#afbab2','#00b7c6','#8499a5','#f9c9a3','#6d87a8','#00a0c4','#dbe06b','#076d54','#00335b','#f94f8e']
 };
   ;
   if (option && typeof option === "object") {
       myChart.setOption(option, true);
   }
 }
 function drawActivity(resultActivity,activityName) {
   var dom = document.getElementById("container-activity");
   var myChart = echarts.init(dom);
   var app = {};
   option = null;
   option = {
     title : {
         text: 'Activity',
         x:'left'
     },
     tooltip : {
         trigger: 'item',
         formatter: "{a} <br/>{b} : {c} ({d}%)"
     },
     legend: {
         orient: 'vertical',
         left: 'right',
         data: activityName
     },
     series : [
         {
             name: 'Activity',
             type: 'pie',
             radius : '55%',
             // center: ['50%', '60%'],
             data:resultActivity,
             itemStyle: {
                 emphasis: {
                     shadowBlur: 10,
                     shadowOffsetX: 0,
                     shadowColor: 'rgba(0, 0, 0, 0.5)'
                 }
             }
         }
     ],
     color: ['#afbab2','#00b7c6','#8499a5','#f9c9a3','#6d87a8','#00a0c4','#dbe06b','#076d54','#00335b','#f94f8e']
 };
   ;
   if (option && typeof option === "object") {
       myChart.setOption(option, true);
   }
 }

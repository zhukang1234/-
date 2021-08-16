var app = getApp();
var deviceId=[];
var i=0;
var serviceId=[];
var characteristicId=[];
var score=0;
const myaudio = wx.createInnerAudioContext(true);
const myaudio2 = wx.createInnerAudioContext(true);
const myaudio3 = wx.createInnerAudioContext(true);
var delay=500;

Page({
data: {
   score: 0,
   isplay: false,//是否播放
   loading: false,
   start:false,
},
onLoad:function(){
wx.onBluetoothAdapterStateChange(function (res) {
console.log('adapterState changed, now is', res)
})
myaudio.onPlay(() => {
  console.log('录音播放中');
})
myaudio.onCanplay(()=>{
  console.log("播放准备完成")
})
myaudio.onWaiting(() => {
  console.log('录音缓存中');
})
myaudio.onEnded(() => {
  console.log('录音结束');
})
myaudio.onError((res)=>{
  console.log(res)
})
//第二段
myaudio2.onPlay(() => {
  console.log('录音播放中');
})
myaudio2.onCanplay(()=>{
  console.log("播放准备完成")
})
myaudio2.onWaiting(() => {
  console.log('录音缓存中');
})
myaudio2.onEnded(() => {
  console.log('录音结束');
})
myaudio2.onError((res)=>{
  console.log(res)
})
//第三段
myaudio3.onPlay(() => {
  console.log('录音播放中');
})
myaudio3.onCanplay(()=>{
  console.log("播放准备完成")
})
myaudio3.onWaiting(() => {
  console.log('录音缓存中');
})
myaudio3.onEnded(() => {
  console.log('录音结束');
})
myaudio3.onError((res)=>{
  console.log(res)
})
},
//打开适配器
openadapter:function(){
wx.openBluetoothAdapter({
success: function(res) {
console.log(res,"success")
},
fail: function (res) {
console.log(res,"fail")
},
})
// wx.getBluetoothAdapterState({
// complete: function (res) {
// console.log("currentstate:",res)
// }
// })
},
closeadapter: function () {
wx.closeBluetoothAdapter({
success: function (res) {
console.log(res, "success")
},
fail: function (res) {
console.log(res, "fail")
},
})
// wx.getBluetoothAdapterState({
// complete: function (res) {
// console.log("currentstate:", res)
// }
// })
},
//开始搜索
opendiscovery:function(){
wx.startBluetoothDevicesDiscovery({
services: [],
success: function (res) {
console.log(res)
},
fail: function (res) {
console.log(res, "fail")
},
})
},
closediscovery:function(){
wx.stopBluetoothDevicesDiscovery({
success: function (res) {
console.log(res)
},
fail: function (res) {
console.log(res, "fail")
},
})
},
//获取设备id
getdevice:function(){
function ab2hex(buffer) {
var hexArr = Array.prototype.map.call(
new Uint8Array(buffer),
function (bit) {
return ('00' + bit.toString(16)).slice(-2)
}
)
return hexArr.join('');
}
//连接我的设备
wx.getBluetoothDevices({
success: function (res) {
console.log(res)
i=0;
while (res.devices[i]) {
console.log(i);
console.log(res.devices[i].name,res.devices[i].deviceId);
if(res.devices[i].name=='PocketDrum_Lite-32792acb'){
deviceId[0]=res.devices[i].deviceId;
console.log(deviceId[0]);
}
if(res.devices[i].name=='PocketDrum_Lite-e6cef5ea'){
  deviceId[1]=res.devices[i].deviceId;
  console.log(deviceId[1]);
  }

i++;
}
}
})
},
//连接设备
connecteddevice:function(){
wx.createBLEConnection({
deviceId: deviceId[0],
success: function(res) {
console.log(res.deviceId.name);
},
fail: function(res){
  console.log(res)
}
})
wx.createBLEConnection({
  deviceId: deviceId[1],
  success: function(res) {
  console.log(res.deviceId.name);
  },
  fail: function(res){
    console.log(res)
  }
  })
},
//获取设备服务
getservice:function(){
wx.getBLEDeviceServices({
deviceId: deviceId[0],
success: function(res) {
console.log(res.services);
i=0;
while(res.services[i]){
serviceId[i]=res.services[i].uuid;
console.log(serviceId[i]);
i++;
}
},
})
wx.getBLEDeviceServices({
  deviceId: deviceId[1],
  success: function(res) {
  console.log(res.services);
  i=0;
  while(res.services[i]){
  serviceId[i]=res.services[i].uuid;
  console.log(serviceId[i]);
  i++;
  }
  },
  })
},
//获取特征值
getcharacteristics:function(){

wx.getBLEDeviceCharacteristics({
deviceId: deviceId[0],
serviceId: serviceId[0],
success: function (res) {
i=0;
while(res.characteristics[i]){
characteristicId[i]=res.characteristics[i].uuid;
console.log(res.characteristics[i].prototype);
i++;
}
},
fail: function(res){
  console.log('getfail!!!!')
}
})
wx.getBLEDeviceCharacteristics({
  deviceId: deviceId[1],
  serviceId: serviceId[0],
  success: function (res) {
  i=0;
  while(res.characteristics[i]){
  characteristicId[i]=res.characteristics[i].uuid;
  console.log(res.characteristics[i].prototype);
  i++;
  }
  },
  fail: function(res){
    console.log('getfail!!!!')
  }
  })
},
//开启notify
startnotify:function(){
wx.notifyBLECharacteristicValueChange({
state: true,
deviceId: deviceId[0],
serviceId: serviceId[0],
characteristicId: characteristicId[1],
success: function (res) {
console.log('notifyBLECharacteristicValueChange success', res)
},
fail:function(res){
console.log(res)
}
})
wx.notifyBLECharacteristicValueChange({
  state: true,
  deviceId: deviceId[1],
  serviceId: serviceId[0],
  characteristicId: characteristicId[1],
  success: function (res) {
  console.log('notifyBLECharacteristicValueChange success', res)
  },
  fail:function(res){
  console.log(res)
  }
  })
function arrayBufferToString(arr){
  if(typeof arr === 'string') {  
      return arr;  
  }  
  var dataview=new DataView(arr);
  var ints=new Uint8Array(arr.byteLength);
  for(var i=0;i<ints.length;i++){
    ints[i]=dataview.getUint8(i);
  }
  arr=ints;
  var str = '',  
      _arr = arr;  
  for(var i = 0; i < _arr.length; i++) {  
      var one = _arr[i].toString(2),  
          v = one.match(/^1+?(?=0)/);  
      if(v && one.length == 8) {  
          var bytesLength = v[0].length;  
          var store = _arr[i].toString(2).slice(7 - bytesLength);  
          for(var st = 1; st < bytesLength; st++) {  
              store += _arr[st + i].toString(2).slice(2);  
          }  
          str += String.fromCharCode(parseInt(store, 2));  
          i += bytesLength - 1;  
      } else {  
          str += String.fromCharCode(_arr[i]);  
      }  
  }  
  return str; 
}
//转换16进制
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
  new Uint8Array(buffer),
  function (bit) {
  return ('00' + bit.toString(16)).slice(-2)
  }
  )
  return hexArr.join('');
  }
//播放
function play () {
  myaudio.play();
}
// 停止
function stop() {
  myaudio2.stop();
  myaudio3.stop();
  myaudio.stop();
}
wx.onBLECharacteristicValueChange(function(res) {
  let info=ab2hex(res.value);
  console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
  console.log(ab2hex(res.value))
  //分设备播放声音或暂停
    if(res.deviceId==deviceId[0]){
      if(info[3]==3||info[3]==4){
        stop();
        myaudio3.play();
      }
      else if(info[3]==7||info[3]==1){
        stop();
        play();
      }
      else if(info[3]==2||info[3]==6){
        stop();
        myaudio2.play();
        
      }
    }
    if(res.deviceId==deviceId[1]){
      if(info[3]==3||info[3]==4){
        stop();
        myaudio3.play();
      }
      else if(info[3]==7||info[3]==1){
        stop();
        play();
      }
      else if(info[3]==2||info[3]==6){
        stop();
        myaudio2.play();
      }
    }
})
this.setData({
  loading: true
})
},
//打开设备
open: function(){
  this.openadapter();
  this.opendiscovery();
},
//关闭设备连接
close: function(){
  wx.closeBLEConnection({
    deviceId: deviceId
  })
  wx.closeBluetoothAdapter({
    success: (res) => {
      console.log(res);
    },
  })
  this.setData({
    start:false,
    loading:false
  })
},
start: function(){
  var that=this;
  that.setData({
    start: true
  })
  that.open();//打开适配器
  setTimeout(()=>{that.getdevice()},delay)
  setTimeout(()=>{that.connecteddevice()},delay+2000)
  setTimeout(()=>{that.connecteddevice()},delay+4000)
  setTimeout(()=>{that.getservice()},delay+5000)
  setTimeout(()=>{that.getcharacteristics()},delay+5500)
  setTimeout(()=>{that.startnotify()},delay+7500)
},
//需要绝对路径
onShow: function () {
  myaudio.src = "/pages/music_game/aduio/bgm.mp3"
  myaudio2.src="/pages/music_game/aduio/boom.mp3"
  myaudio3.src="/pages/music_game/aduio/bullet.mp3"
}
})
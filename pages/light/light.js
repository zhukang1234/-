var app = getApp();
var deviceId;
var i=0;
var serviceId=[];
var characteristicId=[];

var time=0;
var newDateTime = (new Date()).valueOf();//获取当前毫秒数
var newDateTime_2 = (new Date()).valueOf();
Page({
data: {
  rgb: 'rgb(0,154,97)',//初始值
  page:false,//防止一打开界面就调用点灯
  pick: true,
  initColor:'rgb(255,0,0)',
  maskClosable:true,
  mask:true,
  show:true,
  load:false
},
onLoad:function(){
wx.onBluetoothAdapterStateChange(function (res) {
console.log('adapterState changed, now is', res)
})
let { initColor} = this.data;
      this.setData({
        hueColor: this.hsv2rgb((this.rgb2hsv(initColor)).h,100,100)
      })
      const $ = this.createSelectorQuery()
      const target = $.select('.target')
      target.boundingClientRect()
      $.exec((res) => {
        const rect = res[0]
        if (rect) {

          this.SV = {
            W: rect.width - 28, //block-size=28
            H: rect.height - 28,
            Step: (rect.width - 28) / 100
          }
          let { h, s, v } = this.rgb2hsv(this.data.initColor)
          //开始点灯
          this.whole();
          // 初始化定位
          this.setData({
            hsv:{
              h,s,v
            },
            x: Math.round(50 * this.SV.Step),
            y: Math.round((100-50 )* this.SV.Step),
            showview: false,
            option: true,
            load: false
          })
        }
      })
    

},

onUnload:function () {
  this.close()//关闭适配器
},
onEnd() {
  this.triggerEvent('changeColor', {
    color: this.data.colorRes
  })
},
setBlack: function () {
  
  this.light('rgb(0,0,0)')
},
setWhite: function () {
  
  this.light('rgb(255,255,255)')
},
changeHue: function (e) {
  let huv = e.detail.value;
  this.setData({
    "hsv.v":huv,
    hueColor: this.hsv2rgb(360, 100,huv),
    colorRes: this.hsv2rgb(this.data.hsv.h, this.data.hsv.s,huv)
  })
  var that=this
  newDateTime_2 = (new Date()).valueOf();
  if(newDateTime_2-newDateTime>=20){
    
    if (that.data.page) {
      that.light(that.data.colorRes)
    }
    time=0;
    newDateTime = (new Date()).valueOf();//获取当前毫秒数
  }
  
},
start: function(){
  if(time==0){
    time=1;
    newDateTime = (new Date()).valueOf();//获取当前毫秒数
  }
},
changeSV: function (e) {
  var that=this
  
  let {
    x,
    y
  } = e.detail;
  x = Math.round(x / this.SV.Step);
  y = 100 - Math.round(y / this.SV.Step);
  var X=x-50
  var Y=y-50
  var X_pow
  var Y_pow
  if(Y>0){
    X_pow=Math.acos(X/Math.sqrt(X*X+Y*Y))
    Y_pow=Math.sqrt(X*X+Y*Y)*2
  }
  else{
    if(X==0&&Y==0){
    }
    else if(Y<0){
      X_pow=Math.acos(-X/Math.sqrt(X*X+Y*Y))+Math.PI
      Y_pow=Math.sqrt(X*X+Y*Y)*2         
    }
  }
  if (Math.floor(Y_pow)>100) {
    this.setData({
      x:Math.floor((45*Math.cos(X_pow)+50)*this.SV.Step),
      y:Math.floor((50-45*Math.sin(X_pow))*this.SV.Step)
    })
  }
  this.setData({
    "hsv.h":Math.floor(X_pow/Math.PI*180),
    "hsv.s": Math.floor(Y_pow),
    colorRes: this.hsv2rgb(Math.floor(X_pow/Math.PI*180), Math.floor(Y_pow),this.data.hsv.v)
  })
  newDateTime_2 = (new Date()).valueOf();
  if(newDateTime_2-newDateTime>=20){
  if (that.data.page) {
      that.light(that.data.colorRes)
    }
    time=0;
    newDateTime = (new Date()).valueOf();//获取当前毫秒数
  }
},
close: function close(e) {
  if (this.data.maskClosable) {
    this.setData({
      show: false
    });
    this.triggerEvent('close');
  }
},
preventdefault:function() {
  
},
hsv2rgb: function (h, s, v) {
  let hsv_h = (h / 360).toFixed(2);
  let hsv_s = (s / 100).toFixed(2);
  let hsv_v = (v / 100).toFixed(2);

  var i = Math.floor(hsv_h * 6);
  var f = hsv_h * 6 - i;
  var p = hsv_v * (1 - hsv_s);
  var q = hsv_v * (1 - f * hsv_s);
  var t = hsv_v * (1 - (1 - f) * hsv_s);

  var rgb_r = 0,
    rgb_g = 0,
    rgb_b = 0;
  switch (i % 6) {
    case 0:
      rgb_r = hsv_v;
      rgb_g = t;
      rgb_b = p;
      break;
    case 1:
      rgb_r = q;
      rgb_g = hsv_v;
      rgb_b = p;
      break;
    case 2:
      rgb_r = p;
      rgb_g = hsv_v;
      rgb_b = t;
      break;
    case 3:
      rgb_r = p;
      rgb_g = q;
      rgb_b = hsv_v;
      break;
    case 4:
      rgb_r = t;
      rgb_g = p;
      rgb_b = hsv_v;
      break;
    case 5:
      rgb_r = hsv_v, rgb_g = p, rgb_b = q;
      break;
  }

  return 'rgb(' + (Math.floor(rgb_r * 255) + "," + Math.floor(rgb_g * 255) + "," + Math.floor(rgb_b * 255)) + ')';
},
rgb2hsv: function (color) {
  let rgb = color.split(',');
  let R = parseInt(rgb[0].split('(')[1]);
  let G = parseInt(rgb[1]);
  let B = parseInt(rgb[2].split(')')[0]);

  let hsv_red = R / 255, hsv_green = G / 255, hsv_blue = B / 255;
  let hsv_max = Math.max(hsv_red, hsv_green, hsv_blue),
    hsv_min = Math.min(hsv_red, hsv_green, hsv_blue);
  let hsv_h, hsv_s, hsv_v = hsv_max;

  let hsv_d = hsv_max - hsv_min;
  hsv_s = hsv_max == 0 ? 0 : hsv_d / hsv_max;

  if (hsv_max == hsv_min) hsv_h = 0;
  else {
    switch (hsv_max) {
      case hsv_red:
        hsv_h = (hsv_green - hsv_blue) / hsv_d + (hsv_green < hsv_blue ? 6 : 0);
        break;
      case hsv_green:
        hsv_h = (hsv_blue - hsv_red) / hsv_d + 2;
        break;
      case hsv_blue:
        hsv_h = (hsv_red - hsv_green) / hsv_d + 4;
        break;
    }
    hsv_h /= 6;
  }
  return {
    h: (hsv_h * 360).toFixed(),
    s: (hsv_s * 100).toFixed(),
    v: (hsv_v * 100).toFixed()
  }
},
//打开适配器
openadapter:function(){
  var that=this
  return new Promise(function (resolve, reject) {
wx.openBluetoothAdapter({
success: (res)=> {
console.log(res,"success")
resolve('done')

},
fail: function (res) {
console.log(res,"fail")
reject('fail')
},
})

  })
},
//关闭适配器
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
  return new Promise(function (resolve, reject) {
wx.startBluetoothDevicesDiscovery({
services: [],
success: function (res) {
console.log(res)
console.log('second')
  resolve('done')
},
fail: function (res) {
console.log(res, "fail")
  reject('fail')
},
})

  })
},
//获取连接设备
getdevice:function(){
//连接我的设备
return new Promise(function (resolve, reject) {
wx.getBluetoothDevices({
success: function (res) {
console.log(res)
i=0;
while (res.devices[i]) {
console.log(i);
console.log(res.devices[i].localName,res.devices[i].deviceId);
if(res.devices[i].localName=='THE9_FEC150D7'){
deviceId=res.devices[i].deviceId;
console.log(deviceId);
}
i++;
}
resolve('done')
},
})

})
},
//连接设备
connectdevice:function(){
  return new Promise(function (resolve, reject) {
wx.createBLEConnection({
deviceId: deviceId,
success: (res) =>{

wx.stopBluetoothDevicesDiscovery({
  success: () => {
    console.log("连接结束，关闭搜索");
    resolve('done')
  },
})
resolve('done')
},
fail: function(res){
  console.log(res)
  reject('fail')
}
})
})
},
//获取服务
getservice:function(){
  return new Promise(function (resolve, reject) {
wx.getBLEDeviceServices({
deviceId: deviceId,
success: function(res) {
console.log(res.services);
i=0;
while(res.services[i]){
serviceId[i]=res.services[i].uuid;
console.log(serviceId[i]);
i++;
}
that.setData({
  page: true//实时更换颜色
})
resolve('done')
},
fail: function(){
  reject('fail')
}
})

  })
},
//获取特征值
getcharacteristics:function(){
  return new Promise(function (resolve, reject) {
wx.getBLEDeviceCharacteristics({
deviceId: deviceId,
serviceId: serviceId[1],
success: function (res) {
i=0;
while(res.characteristics[i]){
characteristicId[i]=res.characteristics[i].uuid;
console.log(res.characteristics[i].prototype);
i++;
}
resolve('done')
},
fail: function(res){
  console.log('getfail!!!!')
  reject('fail')
}
})

})
},
//开启notify
startnotify:function(){
  return new Promise(function (resolve, reject) {
wx.notifyBLECharacteristicValueChange({
state: true,
deviceId: deviceId,
serviceId: serviceId[1],
characteristicId: characteristicId[0],
success: function (res) {
console.log('notifyBLECharacteristicValueChange success', res)
},
fail:function(res){
console.log(res)
reject('fail')
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
wx.onBLECharacteristicValueChange(function(res) {
  console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
  console.log(arrayBufferToString(res.value))
})
resolve('done')
  })
},
//点灯
light:function(rgb_now){
let buf ='APP+COR+';
const rgb2hex = (color) => {
  let rgb = color.split(',');
  let R = parseInt(rgb[0].split('(')[1]);
  let G = parseInt(rgb[1]);
  let B = parseInt(rgb[2].split(')')[0]);
  let hex = ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
  return hex;
}
function stringToArrayBuffer(str) {
	var bytes = new Array(); 
	var len,c;
	len = str.length;
	for(var i = 0; i < len; i++){
		c = str.charCodeAt(i);
		if(c >= 0x010000 && c <= 0x10FFFF){
			bytes.push(((c >> 18) & 0x07) | 0xF0);
			bytes.push(((c >> 12) & 0x3F) | 0x80);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		}else if(c >= 0x000800 && c <= 0x00FFFF){
			bytes.push(((c >> 12) & 0x0F) | 0xE0);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		}else if(c >= 0x000080 && c <= 0x0007FF){
			bytes.push(((c >> 6) & 0x1F) | 0xC0);
			bytes.push((c & 0x3F) | 0x80);
		}else{
			bytes.push(c & 0xFF);
		}
  }
  var array = new Int8Array(bytes.length);
  for(var i in bytes){
    array[i] =bytes[i];
  }
	return array.buffer;
}
console.log(rgb_now)
  //写入rgb
wx.writeBLECharacteristicValue({
    deviceId: deviceId,
    serviceId: serviceId[1],
    characteristicId: characteristicId[1],
    value: stringToArrayBuffer(buf+rgb2hex(rgb_now)),
    success:  (res)=> {
    console.log('writeBLECharacteristicValue success', res.errMsg),
    console.log(buf+rgb2hex(rgb_now))
    },
    fail: function(res){
      console.log(res)
    }
    })

},
write: function(){
  let buf='APP+MOD+FRE';
  function stringToArrayBuffer(str) {
    var bytes = new Array(); 
    var len,c;
    len = str.length;
    for(var i = 0; i < len; i++){
      c = str.charCodeAt(i);
      if(c >= 0x010000 && c <= 0x10FFFF){
        bytes.push(((c >> 18) & 0x07) | 0xF0);
        bytes.push(((c >> 12) & 0x3F) | 0x80);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      }else if(c >= 0x000800 && c <= 0x00FFFF){
        bytes.push(((c >> 12) & 0x0F) | 0xE0);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      }else if(c >= 0x000080 && c <= 0x0007FF){
        bytes.push(((c >> 6) & 0x1F) | 0xC0);
        bytes.push((c & 0x3F) | 0x80);
      }else{
        bytes.push(c & 0xFF);
      }
    }
    var array = new Int8Array(bytes.length);
    for(var i in bytes){
      array[i] =bytes[i];
    }
    return array.buffer;
  }
  //写入开始数据
  return new Promise(function (resolve, reject) {
  wx.writeBLECharacteristicValue({
  deviceId: deviceId,
  serviceId: serviceId[1],
  characteristicId: characteristicId[1],
  value: stringToArrayBuffer(buf),
  success: function (res) {
  console.log('writeBLECharacteristicValue success', res.errMsg)
  resolve('done')
  },
  fail: function(res){
    console.log(res)
    reject('fail')
  }
  })
})
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
    page:false,
    start:false,
    loading:false
  })
},
//总和测试
async whole(){
  var that=this;
  that.setData({
    start: true
  })
  const adapter=await that.openadapter();
  const discovery= await that.opendiscovery();
  const device=await that.getdevice()
  const connect=await that.connectdevice()
  const service=await that.getservice()
  const character=await that.getcharacteristics()
  const notify=await that.startnotify()
  const write=await that.write()
  that.setData({
    load:true
  })
},
//基础颜色设置
setRed: function () {
  this.light('rgb(255,0,0)')
},
setBlue: function () {
  this.light('rgb(0,0,255)')
},
setGreen: function () {
  this.light('rgb(0,255,0)')
},
setBlack: function () {
  this.light('rgb(0,0,0)')
},
setWhite: function () {
  this.light('rgb(255,255,255)')
},
setYellow: function () {
  this.light('rgb(255,255,0)')
},
setPurple: function () {
  this.light('rgb(255,0,255)')
},
setLightBlue: function () {
  this.light('rgb(0,255,255)')
},
})
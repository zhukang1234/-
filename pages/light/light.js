var app = getApp();
var newDateTime = (new Date()).valueOf();//获取当前毫秒数
var newDateTime_2 = (new Date()).valueOf();
//return new Promise(function (resolve, reject) { 为异步处理
Page({
data: {
  rgb: 'rgb(0,154,97)',//初始值
  page:false,//页边加载是否完成（防止一打开界面就调用点灯）
  initColor:'rgb(255,0,0)',//初始颜色
  case:-1,//蓝牙连接是否成功
  deviceId:0,//设备ID
  i:0,//计数器
  serviceId:[],//服务id
  characteristicId:[],//特征值ID
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
  var that=this
  let huv = e.detail.value;
  //定义颜色
  that.setData({
    "hsv.v":huv,
    hueColor: that.hsv2rgb(0, 0,huv),
    colorRes: that.hsv2rgb(that.data.hsv.h, that.data.hsv.s,huv),
  })
  newDateTime_2 = (new Date()).valueOf();
  //设置每20毫秒发送
  if(newDateTime_2-newDateTime>=20){
    if (that.data.page) {
      that.light(that.data.colorRes)
    }
    newDateTime = (new Date()).valueOf();//获取当前毫秒数
  }
  
},
//改变sv
changeSV: function (e) {
  var that=this
  let {
    x,
    y
  } = e.detail;
  //初始化坐标
  x = Math.round(x / that.SV.Step);
  y = 100 - Math.round(y / that.SV.Step);
  //制作极坐标系
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
    that.setData({
      x:Math.floor((45*Math.cos(X_pow)+50)*that.SV.Step),
      y:Math.floor((50-45*Math.sin(X_pow))*that.SV.Step)
    })
  }
  //极坐标系定义sv
  that.setData({
    "hsv.h":Math.floor(X_pow/Math.PI*180),
    "hsv.s": Math.floor(Y_pow),
    colorRes: that.hsv2rgb(Math.floor(X_pow/Math.PI*180), Math.floor(Y_pow),that.data.hsv.v)
  })
  //每20毫秒发送数据
  newDateTime_2 = (new Date()).valueOf();
  if(newDateTime_2-newDateTime>=20){
  if (that.data.page) {
      that.light(that.data.colorRes)
    }
    newDateTime = (new Date()).valueOf();//获取当前毫秒数
  }
},
//转换函数（无需更改）
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
//转换函数
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
  var that=this
//连接我的设备（在这里修改连接设备名称）
return new Promise(function (resolve, reject) {
  //延时2秒执行（防止没有搜索到设备）
setTimeout(()=> {wx.getBluetoothDevices({
success: function (res) {
console.log(res)
that.setData({
  i:0
})
//遍历查找设备
while (res.devices[that.data.i]) {
console.log(that.data.i);
console.log(res.devices[that.data.i].localName,res.devices[that.data.i].deviceId);
//localname就是需要连接设备名称
if(res.devices[that.data.i].localName=='THE9_FEC150D7'){
  that.setData({
    deviceId:res.devices[that.data.i].deviceId
  })
console.log(that.data.deviceId);
}
that.setData({
  i:that.data.i+1
})
}
if (that.data.deviceId==null) {
  that.setData({
    case:1
  })
}
resolve('done')
},
})},2000)

})
},
//连接设备
connectdevice:function(){
  var that=this
  return new Promise(function (resolve, reject) {
wx.createBLEConnection({
deviceId: that.data.deviceId,
success: (res) =>{
  //连上后关闭搜索设备，防止继续占用资源
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
  this.setData({
    page: true//实时更换颜色
  })
  var that=this
  return new Promise(function (resolve, reject) {
wx.getBLEDeviceServices({
deviceId: that.data.deviceId,
success: (res)=> {
console.log(res.services);
that.setData({
  i:0
})
//便利获取全部服务
while(res.services[that.data.i]){
  that.setData({
    ['serviceId[that.data.i]']:res.services[that.data.i].uuid
  })
console.log(that.data.serviceId[that.data.i]);
that.setData({
  i:that.data.i+1
})
}
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
  var that=this
  return new Promise(function (resolve, reject) {
wx.getBLEDeviceCharacteristics({
deviceId: that.data.deviceId,
serviceId: that.data.serviceId[1],
success: function (res) {
that.setData({
  i:0
})
//遍历获取所有特征值
while(res.characteristics[that.data.i]){
  that.setData({
    ['characteristicId[that.data.i]']:res.characteristics[that.data.i].uuid
  })
console.log(res.characteristics[that.data.i].prototype);
that.setData({
  i:that.data.i+1
})
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
  var that=this
  return new Promise(function (resolve, reject) {
wx.notifyBLECharacteristicValueChange({
state: true,
deviceId: that.data.deviceId,
serviceId: that.data.serviceId[1],
characteristicId: that.data.characteristicId[0],
success: function (res) {
console.log('notifyBLECharacteristicValueChange success', res)
},
fail:function(res){
console.log(res)
reject('fail')
}
})
//转换函数
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
//监听收到的数据
wx.onBLECharacteristicValueChange(function(res) {
  console.log(arrayBufferToString(res.value))
})
resolve('done')
  })
},
//点灯
light:function(rgb_now){
var that=this
let buf ='APP+COR+';
//转换函数
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
  //写入rgb（发送协议数据）
wx.writeBLECharacteristicValue({
    deviceId: that.data.deviceId,
    serviceId: that.data.serviceId[1],
    characteristicId: that.data.characteristicId[1],
    value: stringToArrayBuffer(buf+rgb2hex(rgb_now)),
    success:  (res)=> {
    console.log(buf+rgb2hex(rgb_now))
    },
    fail: function(res){
      console.log(res)
      that.setData({
        case:1
      })
    }
    })

},
//写入开始数据
write: function(){
  var that=this
  let buf='APP+MOD+FRE';
  //转换函数
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
  deviceId: that.data.deviceId,
  serviceId: that.data.serviceId[1],
  characteristicId: that.data.characteristicId[1],
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
  wx.closeBluetoothAdapter({
    success: (res) => {
      console.log(res);
    },
  })
},
//总和测试
async whole(){
  var that=this;
  const adapter=await that.openadapter();//开启适配器
  const discovery= await that.opendiscovery();//打开蓝牙搜索
  const device=await that.getdevice()//获取设备名称
  if (that.data.case==-1) {
    const connect=await that.connectdevice()//连接设备
    const service=await that.getservice()//获取服务
    const character=await that.getcharacteristics()//获取特征值
    const notify=await that.startnotify()//开启notify
    const write=await that.write()//写入开始数据
    that.setData({
      case:0//重置case，用于界面显示蓝牙已连接
    })
  }else if (that.data.case==1) {
    const reconnect=await that.reconnect('未找到设备，是否重连')
  }
},
//是否重连
reconnect: function (content) {
  var that=this
  return new Promise(function (resolve, reject) {
  wx.showModal({
    title: '提示',
    content: content,
    success (res) {
      //选择确认
      if (res.confirm) {
        that.setData({
          case:-1
        })
        that.whole()
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
      resolve('done')
    },
    fail(){
      reject('fail')
    }
  })
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
  this.light('rgb(10,10,10)')
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
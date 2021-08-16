var app = getApp();

Page({
data: {
   score: 0
},
onLoad:function(){
wx.onBluetoothAdapterStateChange(function (res) {
console.log('adapterState changed, now is', res)
})

},
//跳转音乐游戏
Topage:function(){
wx.redirectTo({
  url: '../music_game/music_game',
})
},
//跳转计分器
Topage1:function(){
  wx.redirectTo({
    url: '../score/score',
  })
  },
//跳转点灯
Topage2:function(){
    wx.redirectTo({
      url: '../light/light',
    })
    }
})
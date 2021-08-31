// pages/function_modul/function_modul.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
//跳转至音乐游戏
  Topage:function(){
    wx.navigateTo({
      url: '../music_game/music_game',
    })
    },
    //跳转计分器
    Topage1:function(){
      wx.navigateTo({
        url: '../score/score',
      })
      },
    //跳转点灯
    Topage2:function(){
        wx.navigateTo({
          url: '../light/light',
        })
        },
        //跳转至tcp通讯
    Topage3:function(){
          wx.navigateTo({
            url: '../tcp/tcp',
          })
          }
})
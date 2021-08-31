// pages/tcp/tcp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tcp: wx.createTCPSocket()//创建tcp对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //当连接上时运行
    tcp.onConnect(()=>{
      console.log('coonect')
    })
    //当出错时运行
    tcp.onError((res)=>{
      console.log('error\n'+res.errMsg)
    })
    //当收到到信息时运行
    tcp.onMessage((res)=>{
      console.log('message\n'+res.message)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //连接IP
  connect: function () {
    tcp.connect({address: this.data.ip, port: this.data.port})
  },
  //写入信息
  write: function () {
    tcp.write(this.data.command)
  },
  //设置IP地址
  bindKeyInput_ip: function (e) {
    this.setData({
      ip: e.detail.value
    })
  },
  //设置端口号
  bindKeyInput_port: function (e) {
    this.setData({
      port: e.detail.value*1
    })
    console.log(this.data.port+3)
  },
  //写入命令
  bindKeyInput_command: function (e) {
    this.setData({
      command: e.detail.value
    })
  },
})
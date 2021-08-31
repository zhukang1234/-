var app = getApp();
//创建audio对象
const myaudio = wx.createInnerAudioContext(true);
const myaudio2 = wx.createInnerAudioContext(true);
const myaudio3 = wx.createInnerAudioContext(true);
const myaudio4 = wx.createInnerAudioContext(true);
const myaudio5 = wx.createInnerAudioContext(true);
const myaudio6 = wx.createInnerAudioContext(true);


Page({
  //初始化数据
  data: {
    start: true, //是否进入操作时间
    case: 10, //连接模式
    show: true, //是否显示连接中界面
    start_time: [], //是否建立计时器
    touch_case: [true, true, true, true, true, true], //击鼓键位设置
    deviceId: [],//设备id
    i:0,//计数器
    serviceId : [],//服务ID
    characteristicId : []//特征值ID
  },
  onLoad: function () {
    //这里都是监视数据变化的，不用管
    wx.onBluetoothAdapterStateChange(function (res) {
      console.log('adapterState changed, now is', res)
    })
    myaudio.onPlay(() => {
      console.log('录音播放中');
    })
    myaudio.onCanplay(() => {
      console.log("播放准备完成")
    })
    myaudio.onWaiting(() => {
      console.log('录音缓存中');
    })
    myaudio.onEnded(() => {
      console.log('录音结束');
    })
    myaudio.onError((res) => {
      console.log(res)
    })
    //第二段
    myaudio2.onPlay(() => {
      console.log('录音播放中');
    })
    myaudio2.onCanplay(() => {
      console.log("播放准备完成")
    })
    myaudio2.onWaiting(() => {
      console.log('录音缓存中');
    })
    myaudio2.onEnded(() => {
      console.log('录音结束');
    })
    myaudio2.onError((res) => {
      console.log(res)
    })
    //第三段
    myaudio3.onPlay(() => {
      console.log('录音播放中');
    })
    myaudio3.onCanplay(() => {
      console.log("播放准备完成")
    })
    myaudio3.onWaiting(() => {
      console.log('录音缓存中');
    })
    myaudio3.onEnded(() => {
      console.log('录音结束');
    })
    myaudio3.onError((res) => {
      console.log(res)
    })
  },
  onUnload: function () {
    //当界面关闭时，执行此函数
    this.close()
  },
  //打开适配器
  openadapter: function () {
    //进入无法操作时间
    this.setData({
      start: false
    })
    return new Promise(function (resolve, reject) {
      wx.openBluetoothAdapter({
        success: function (res) {
          console.log(res, "success")
          resolve('done')
        },
        fail: function (res) {
          console.log(res, "fail")
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
  },
  //开始搜索
  opendiscovery: function () {
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
  //关闭搜索
  closediscovery: function () {
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
  getdevice: function () {
    //连接我的设备
    var that = this
    return new Promise(function (resolve, reject) {
      //延时函数，防止没搜索到设备
      setTimeout(() => {
        wx.getBluetoothDevices({
          success: (res) => {
            console.log(res)
            that.setData({i:0})
            while (res.devices[that.data.i]) {
              console.log(that.data.i)
              //修改设备一名称
              if (res.devices[that.data.i].localName == 'PocketDrum_Lite-32792acb') {
                that.data.deviceId[0] = res.devices[that.data.i].deviceId;
                console.log(that.data.deviceId[0])
              }
              //修改设备二名称
              if (res.devices[that.data.i].localName == 'PocketDrum_Lite-e6cef5ea') {
                that.data.deviceId[1] = res.devices[that.data.i].deviceId;
                console.log(that.data.deviceId[1])
              }
              that.setData({i:that.data.i+1})
            }
            //判断是否重连
            if (that.data.case == 10||that.data.case == -1) {
              if (that.data.deviceId[0] == null && that.data.deviceId[1] == null) {
                that.setData({
                  case: -1
                })
              } else if (that.data.deviceId[0] == null) {
                that.setData({
                  case: 0
                })
              } else if (that.data.deviceId[1] == null) {
                that.setData({
                  case: 1
                })
              } else {
                that.setData({
                  case: 2
                })
              }
            }
            resolve('done')
          },
          fail: function () {
            reject('fail')
          }
        })
      }, 2000)
    })
  },
  //连接设备
  connecteddevice_first: function () {
    var that=this;
    return new Promise(function (resolve, reject) {
      wx.createBLEConnection({
        deviceId: that.data.deviceId[0],
        success: function (res) {
          resolve('done')
        },
        fail: function (res) {
          console.log(res)
          reject('fail')
        }
      })
    })
  },
  connecteddevice_second: function () {
    var that=this;
    return new Promise(function (resolve, reject) {
      wx.createBLEConnection({
        deviceId: that.data.deviceId[1],
        success: function () {
          resolve('done')
        },
        fail: function (res) {
          console.log(res)
          reject('fail')
        }
      })
    })
  },
  //获取设备服务
  getservice_first: function () {
    var that=this;
    return new Promise(function (resolve, reject) {
      wx.getBLEDeviceServices({
        deviceId: that.data.deviceId[0],
        success: function (res) {
          //连接成功后关闭蓝牙搜索
          wx.stopBluetoothDevicesDiscovery({
            success: (res) => {
              console.log(res)
            },
          })
          console.log(res.services);
          that.setData({i:0})
          //遍历获取服务
          while (res.services[that.data.i]) {
            that.data.serviceId[that.data.i] = res.services[that.data.i].uuid;
            console.log(that.data.serviceId[that.data.i]);
            that.setData({i:that.data.i+1})
          }
          resolve('done')
        },
        fail: function () {
          reject('fail')
        }
      })
    })
  },
  getservice_second: function () {
    var that=this;
    return new Promise(function (resolve, reject) {
      wx.getBLEDeviceServices({
        deviceId: that.data.deviceId[1],
        success: function (res) {
          console.log(res.services);
          that.setData({i:0})
          while (res.services[that.data.i]) {
            that.data.serviceId[that.data.i] = res.services[that.data.i].uuid;
            console.log(that.data.serviceId[that.data.i]);
            that.setData({i:that.data.i+1})
          }
          resolve('done')
        },
        fail: function () {
          reject('fail')
        }
      })
    })
  },
  //获取特征值
  getcharacteristics_first: function () {
    var that=this;
    return new Promise(function (resolve, reject) {
      wx.getBLEDeviceCharacteristics({
        deviceId: that.data.deviceId[0],
        serviceId: that.data.serviceId[0],
        success: function (res) {
          that.setData({i:0})
          //遍历获取特征值
          while (res.characteristics[that.data.i]) {
            that.data.characteristicId[that.data.i] = res.characteristics[that.data.i].uuid;
            console.log(res.characteristics[that.data.i].prototype);
            that.setData({i:that.data.i+1})
          }
          resolve('done')
        },
        fail: function (res) {
          console.log('getfail!!!!')
          reject('fail')
        }
      })
    })
  },
  getcharacteristics_second: function () {
    var that=this;
    return new Promise(function (resolve, reject) {
      wx.getBLEDeviceCharacteristics({
        deviceId: that.data.deviceId[1],
        serviceId: that.data.serviceId[0],
        success: function (res) {
          that.setData({i:0})
          while (res.characteristics[that.data.i]) {
            that.data.characteristicId[that.data.i] = res.characteristics[that.data.i].uuid;
            console.log(res.characteristics[that.data.i].prototype);
            that.setData({i:that.data.i+1})
          }
          resolve('done')
        },
        fail: function (res) {
          console.log('getfail!!!!')
          reject('fail')
        }
      })
    })
  },
  //开启notify
  startnotify_first: function () {
    var that=this;
    return new Promise(function (resolve, reject) {
      wx.notifyBLECharacteristicValueChange({
        state: true,
        deviceId: that.data.deviceId[0],
        serviceId: that.data.serviceId[0],
        characteristicId: that.data.characteristicId[1],
        success: function (res) {
          console.log('notifyBLECharacteristicValueChange success', res)
          resolve('done')
        },
        fail: function (res) {
          console.log(res)
          reject('fail')
        }
      })
    })
  },
  startnotify_second: function () {
    var that=this;
    return new Promise(function (resolve, reject) {
      wx.notifyBLECharacteristicValueChange({
        state: true,
        deviceId: that.data.deviceId[1],
        serviceId: that.data.serviceId[0],
        characteristicId: that.data.characteristicId[1],
        success: function (res) {
          console.log('notifyBLECharacteristicValueChange success', res)
          resolve('done')
        },
        fail: function (res) {
          console.log(res)
          reject('fail')
        }
      })
    })
  },
  //实时监听数据
  startread: function () {
    var that = this
    return new Promise(function (resolve, reject) {
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
      //声音播放操作
      function operation() {
        //敲击3号位
        if (info[3] == 3) {
          myaudio3.stop();
          myaudio3.play();
          if (that.data.start_time[2]) {
            clearTimeout(that.data.time[2])//删除计时器，避免击中回弹延时
          } else {
            that.setData({
              ['start_time[2]']: true//设置计时器
            })
          }
          that.setData({
            ['touch_case[2]']: true//设置未击中键位
          })
          //定义计时器编号
          var timer_2 = setTimeout(() => {
            that.setData({
              ['touch_case[2]']: false
            })
          }, 50)
          that.setData({
            ['time[2]']: timer_2,
          })
        } else if (info[3] == 4) {
          myaudio4.stop();
          myaudio4.play();
          if (that.data.start_time[3]) {
            clearTimeout(that.data.time[3])
          } else {
            that.setData({
              ['start_time[3]']: true
            })
          }
          that.setData({
            ['touch_case[3]']: true
          })
          var timer_3 = setTimeout(() => {
            that.setData({
              ['touch_case[3]']: false
            })
          }, 50)
          that.setData({
            ['time[3]']: timer_3,
          })
        } else if (info[3] == 1) {
          myaudio.stop();
          myaudio.play();
          if (that.data.start_time[0]) {
            clearTimeout(that.data.time[0])
          } else {
            that.setData({
              ['start_time[0]']: true
            })
          }
          that.setData({
            ['touch_case[0]']: true
          })
          var timer_0 = setTimeout(() => {
            that.setData({
              ['touch_case[0]']: false
            })
          }, 50)
          that.setData({
            ['time[0]']: timer_0,
          })
        } else if (info[3] == 7) {
          myaudio6.stop();
          myaudio6.play();
          if (that.data.start_time[5]) {
            clearTimeout(that.data.time[5])
          } else {
            that.setData({
              ['start_time[5]']: true
            })
          }
          that.setData({
            ['touch_case[5]']: true
          })
          var timer_5 = setTimeout(() => {
            that.setData({
              ['touch_case[5]']: false
            })
          }, 50)
          that.setData({
            ['time[5]']: timer_5,
          })
        } else if (info[3] == 2) {
          myaudio2.stop();
          myaudio2.play();
          if (that.data.start_time[1]) {
            clearTimeout(that.data.time[1])
          } else {
            that.setData({
              ['start_time[1]']: true
            })
          }
          that.setData({
            ['touch_case[1]']: true
          })
          var timer_1 = setTimeout(() => {
            that.setData({
              ['touch_case[1]']: false
            })
          }, 50)
          that.setData({
            ['time[1]']: timer_1,
          })
        } else if (info[3] == 6) {
          myaudio5.stop();
          myaudio5.play();
          if (that.data.start_time[4]) {
            clearTimeout(that.data.time[4])
          } else {
            that.setData({
              ['start_time[4]']: true
            })
          }
          that.setData({
            ['touch_case[4]']: true
          })
          var timer_4 = setTimeout(() => {
            that.setData({
              ['touch_case[4]']: false
            })
          }, 50)
          that.setData({
            ['time[4]']: timer_4,
          })
        }
      }
      wx.onBLECharacteristicValueChange((res) => {
        let info = ab2hex(res.value); //收到的信号
        console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
        console.log(ab2hex(res.value))
        //分设备播放声音或暂停
        //一号设备
        if (res.deviceId == that.data.deviceId[0] && info[1] == 2) {
          operation();//敲击播放声音
        }
        //二号设备
        if (res.deviceId == that.data.deviceId[1] && info[1] == 2) {
          operation();//敲击播放声音
        }
      })
      resolve('done')
    })
  },
  //是否重连
  reconnect: function (content) {
    var that = this
    return new Promise(function (resolve, reject) {
      wx.showModal({
        title: '提示',
        content: content,
        success(res) {
          if (res.confirm) {
            if (content=='未找到设备1，是否重连') {
              that.setData({
                case:3//设置连接模式
              })
            }
            else if (content=='未找到设备2，是否重连') {
              that.setData({
                case:4
              })
            }
            that.start()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
          resolve('done')
        },
        fail() {
          reject('fail')
        }
      })
    })
  },
  //关闭设备连接
  close: function () {
    wx.closeBluetoothAdapter({
      success: (res) => {
        console.log(res);
      },
    })
  },
  async start() {
    var that = this;
    const adapter = await that.openadapter();//开启适配器
    const discovery = await that.opendiscovery();//开启蓝牙搜索
    const device = await that.getdevice()//获取设备ID
    switch (that.data.case) {
      case -1:
        that.setData({
          start: true//开始界面操作
        })
        await that.reconnect('未找到设备，是否重连');
        break;
        //设备二连接程序
      case 0:
      case 4:
        await that.connecteddevice_second()
        await that.getservice_second()
        await that.getcharacteristics_second()
        await that.startnotify_second()
        if (that.data.case == 0) {
          that.setData({
            start: true//开始界面操作
          })
          await that.reconnect('未找到设备1，是否重连');
          break;
        }
        that.setData({
          case: 2
        })
        break;
        //设备一连接程序
      case 1:
      case 3:
        await that.connecteddevice_first()
        await that.getservice_first()
        await that.getcharacteristics_first()
        await that.startnotify_first()
        if (that.data.case == 1) {
          that.setData({
            start: true//开始界面操作
          })
          await that.reconnect('未找到设备2，是否重连');
          break;
        }
        that.setData({
          case: 2
        })
        break;
        //设备一二连接程序
      case 2:
        await that.connecteddevice_first()
        await that.connecteddevice_second()
        await that.getservice_first()
        await that.getservice_second()
        await that.getcharacteristics_first()
        await that.getcharacteristics_second()
        await that.startnotify_first()
        await that.startnotify_second()
        break;
      default:
        break;
    }
    //隐藏连接界面，加判断防止出现重连时掩藏了连接中界面
    if (that.data.case != -1&&that.data.case <3) {
      await that.startread()
      that.setData({
        show: false,
        start: true
      })
    }
  },
  //获取音频，需要绝对路径
  onShow: function () {
    myaudio.src = "/pages/music_game/aduio/OIP-c.mp3"
    myaudio2.src = "/pages/music_game/aduio/TOM.mp3"
    myaudio3.src = "/pages/music_game/aduio/Hi-Hat.mp3"
    myaudio4.src = "/pages/music_game/aduio/Crash-Cymbal.mp3"
    myaudio5.src = "/pages/music_game/aduio/Ride-Cymbal.mp3"
    myaudio6.src = "/pages/music_game/aduio/TOM-dumb.mp3"
  }
})
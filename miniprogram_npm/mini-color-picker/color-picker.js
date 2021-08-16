var time=0;
var newDateTime = (new Date()).valueOf();//获取当前毫秒数
var newDateTime_2 = (new Date()).valueOf();
Component({
  properties: {
    initColor: {
      type: String,
      value:'rgb(0,0,0)'
    },
    maskClosable: {
      type: Boolean,
      value: true
    },
    mask: {
      type: Boolean,
      value: true
    },
    show: {
      type: Boolean,
      value: false
    },
  },
  data: {

  },
  lifetimes: {
    attached() {
      let { initColor} = this.data;
      this.setData({
        hueColor: this.hsv2rgb((this.rgb2hsv(initColor)).h,100,100)
      })
    },
    ready() {
      
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
          var allpages = getCurrentPages();//获取全部页面数据
          var nowpage = allpages[allpages.length - 1];//获取页面，包括数据和方法
          nowpage.whole()
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
    }
  },
  methods: {
    onEnd() {
      this.triggerEvent('changeColor', {
        color: this.data.colorRes
      })
    },
    setBlack: function () {
      var allpages = getCurrentPages();//获取全部页面数据
      var nowpage = allpages[allpages.length - 1];//获取页面，包括数据和方法
      nowpage.light('rgb(0,0,0)')
    },
    setWhite: function () {
      var allpages = getCurrentPages();//获取全部页面数据
      var nowpage = allpages[allpages.length - 1];//获取页面，包括数据和方法
      nowpage.light('rgb(255,255,255)')
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
        var allpages = getCurrentPages();//获取全部页面数据
        var nowpage = allpages[allpages.length - 1];//获取页面，包括数据和方法
        if (nowpage.data.page) {
          nowpage.light(this.data.colorRes)
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
      
      newDateTime_2 = (new Date()).valueOf();
      if(newDateTime_2-newDateTime>=20){
        var allpages = getCurrentPages();//获取全部页面数据
        var nowpage = allpages[allpages.length - 1];//获取页面，包括数据和方法
        if (nowpage.data.page) {
          nowpage.light(that.data.colorRes)
          console.log(that.data.colorRes)
        }
        time=0;
        newDateTime = (new Date()).valueOf();//获取当前毫秒数
      }
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
  }
})

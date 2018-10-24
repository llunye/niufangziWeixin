//app.js
//2018-08-14 yef changeDetail中，点击户型图拷贝lianjia官网链接至剪贴板
//2018-08-02 yef 增加changeDetail页面，展示户型图和调价历史
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.getScreenWidth();
    this.getCity(); 

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function (options){
    //console.log('onShow:',options)
    //console.log(this.globalData);
  },
  onHide: function(){
    console.log('onHide')
  },
  onError: function (msg) {
    console.log('error:',msg)
  },

  //获取屏幕宽度
  getScreenWidth: function () {  
    try {
      var res = wx.getSystemInfoSync();
      this.globalData.windowWidth = res.windowWidth;
      this.globalData.wxChartsOpt.width = res.windowWidth;
      //console.log('screen width is : ', res.windowWidth);
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
  },
  getCity: function() {
    try { //从本地缓存读取城市信息
      var value = wx.getStorageSync('cityIndex');
      if (value) {
        this.globalData.cityIndex = value;
      }
    } catch (e) {
      console.log('getStorageSync error', e);
    }
  },

  globalData: {
    userInfo: null,
    windowWidth: 320, //默认屏幕宽度
    niufangziURL: "https://www.niufangzi.com/api/rpt",
    cityNameArray: ['北京', '武汉', '廊坊'],
    cityCodeArray: ['bj', 'wh', 'lf'],
    cityIndex: 0,
    maxRecordCount: 10, //chart报表每次返回的最大记录数
    wxChartsOpt: {  //wxCharts报表默认样式
      canvasId: 'canvasId',
      type: 'line',
      legend: false,  //是否显示图表下方各类别的标识
      animation: true,
      categories: [],
      series: [{
        name: ' ',
        data: [],
        format: function (val, name) {
          //return val.toFixed(2) + '万';
          return val;
        }
      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        title: '金额/数量',
        format: function (val) {
          //return val.toFixed(2);
          return val;
        },
        min: 0
      },
      width: 320,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    } 

  }
})
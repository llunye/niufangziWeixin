//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎访问牛房子！',
    userInfo: {},
    hasUserInfo: false,
    cityNameArray: [],
    cityIndex: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  bindViewTap: function() {
    console.log('I am bindViewTap:');
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () 
  {
    this.setData({ cityNameArray: app.globalData.cityNameArray,
                    cityIndex: app.globalData.cityIndex });

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log("globalData:", app.globalData.userInfo)
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      /* wx.getUserInfo 此接口现在已不再支持
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      */
    }
  },
  getUserInfoA: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onTabItemTap: function(item) {
    console.log('onTabItem:',item.index, item.pagePath, item.text)
  },
  
  onShow: function()
  {
    //
  },

  //选择'统计城市'
  bindPickerChange: function (e) {
    var idx = e.detail.value;
    this.setData({ cityIndex: idx });
    app.globalData.cityIndex = idx;  //更新全局变量值
    try { //存储在本地缓存
      wx.setStorageSync('cityIndex', idx);
    } catch (e) {
      console.log('setStorageSync error', e);
    }
  }

})

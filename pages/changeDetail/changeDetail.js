// pages/changeDetail/changeDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseId: '',
    xiaoqu: '',
    photoWidth: 100,
    changeHistory: [],
    photoContent: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var width = getApp().globalData.windowWidth;
    var houseIdTmp = options.houseId;
    this.setData({ photoWidth: width, xiaoqu: options.xiaoqu, houseId: houseIdTmp});
    this.loadHuXingPhoto(houseIdTmp);
    this.loadChangeHistory(houseIdTmp);
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

  // 点击户型图，将此套房屋的lianjia官网链接拷贝到剪切板。可执行打开浏览器，粘贴查看详情。
  photoTap: function (event) {
    var app = getApp();
    var cityCode = app.globalData.cityCodeArray[app.globalData.cityIndex];
    var houseURL = "https://" + cityCode + ".lianjia.com/ershoufang/" 
                    + this.data.houseId + ".html";
    //console.log('houseURL: ', houseURL);
    wx.setClipboardData({
      data: houseURL,
      success() {
        wx.hideToast();   //剪贴成功后隐藏提示
      },
      fail() {
        wx.hideToast();   //隐藏提示
      },
      complete() {
        wx.hideToast();   //隐藏提示
      }
    });
  },

  //获取户型图(base64编码)
  loadHuXingPhoto: function (houseId) {
    var apiURL = getApp().globalData.niufangziURL;
    var tmpContent = '';
    //var tmpContent1 = this.data.photoContent3;

    var that = this; //进入wx.request函数内部后， this的含义发生了改变，所以需要先保存当前this
    wx.request({
      url: apiURL,
      data: {
        Method: "HuxingPhotoContent",
        HouseId: houseId,
        HouseType: 0
      },
      header: {
        //'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        if (res.data.ReturnCode == '000000') {
          tmpContent = res.data.PhotoContent;
          // I don't known why
          tmpContent = tmpContent.replace('data:image/jpg;base64,', '');
          var array = wx.base64ToArrayBuffer(tmpContent);
          var base64 = wx.arrayBufferToBase64(array);
          that.setData({ photoContent: 'data:image/jpeg;base64,' + base64 }); 
        }
      },
      fail: function (res) {
        console.log("fail");
        that.setData({ pageText: "网络访问出错！" });
      },
      complete: function (res) {
        //console.log("complete")
      }
    })
  },

  //获取调价历史记录
  loadChangeHistory: function (houseId) {
    var records = [];
    var apiURL = getApp().globalData.niufangziURL;
    var that = this; //进入wx.request函数内部后， this的含义发生了改变，所以需要先保存当前this
    wx.request({
      url: apiURL,
      data: {
        Method: 'ChangeHistory',
        HouseId: houseId
      },
      header: {
        //'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        //console.log(res.data);
        if (res.data.ReturnCode == '000000') {
          records = res.data.Records;

          //1. 计算调价幅度信息
          var nCount = records.length; //记录条数 
          for (var i = 0; i < nCount; i++)    //挨个取出数组值 
          {
            var rec = records[i];
            var rate = 0;
            if (rec.oldPrice != 0) {
              rate = Math.round((rec.newPrice - rec.oldPrice) * 10000 / rec.oldPrice) / 100;
            }
            var strRate = '';
            var strColor = 'red';
            if (rate > 0) {
              strRate = '↑' + String(rate) + "%";
            }
            else if (rate < 0) {
              strRate = '↓' + String(rate) + "%";
              strColor = 'green';
            }
            records[i].rate = strRate;
            records[i].color = strColor;
          }

          that.setData({ changeHistory: records });
        }
      },
      fail: function (res) {
        console.log("fail");
        that.setData({ pageText: "网络访问出错！" });
      },
      complete: function (res) {
        //console.log("complete")
      }
    })
  }



})
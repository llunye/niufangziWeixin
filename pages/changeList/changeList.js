// pages/changeList/changeList.js

var touchDot = 0;//触摸时的原点  
var touchTime = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = "";// 记录/清理时间记录  
var currPageNo = 1;    //当前页号
var totalPage = 1; //总页数
var quFilter = ""; //区
var apiURL = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeRecords: [],
    pageText : ' / 页',    //页码信息
    quArray: ['全部'],
    quIndex: 0,
    cityName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
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
    var app = getApp();
    var cityCode = app.globalData.cityCodeArray[app.globalData.cityIndex];
    apiURL = app.globalData.niufangziURL + "?City=" + cityCode;
    var cName = app.globalData.cityNameArray[app.globalData.cityIndex];
    this.setData({ cityName: cName });
    this.loadArea();
    this.loadChangeList();
  },

  recTap: function(event) {
    var detailURL = "../changeDetail/changeDetail?houseId=" + event.currentTarget.id
        + "&xiaoqu=" + event.currentTarget.dataset.xiaoqu;  
    wx.navigateTo({ url: detailURL });
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

  //获取调价详情列表
  loadChangeList: function () {
    var records = [];
    var that = this; //进入wx.request函数内部后， this的含义发生了改变，所以需要先保存当前this
    wx.request({
      url: apiURL, 
      data: {
        Method: 'ChangeList',
        PageSize: 5,
        PageNo: currPageNo,
        Qu: quFilter
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
          totalPage = res.data.TotalPage;
          var tmpText = currPageNo + '/' + totalPage + ' 页';

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

          that.setData({ changeRecords: records, pageText: tmpText });
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

  //获取(市下)区域列表
  loadArea: function () {
    var records = [];
    var that = this; //进入wx.request函数内部后， this的含义发生了改变，所以需要先保存当前this
    wx.request({
      url: apiURL,
      data: {
        Method: 'QuInCity',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        //console.log(res.data);
        var quArrayTmp = ['全部'];
        var recs = res.data.Records;
        var nCount = recs.length; //记录条数 
        for (var i = 0; i < nCount; i++)    //挨个取出数组值 
        {
          quArrayTmp = quArrayTmp.concat(recs[i].qu);
        }
        that.setData({ quArray: quArrayTmp, quIndex: 0 });
      },
      fail: function (res) {
        console.log("fail");
        //that.setData({ pageText: "网络访问出错！" });
      },
      complete: function (res) {
        //console.log("complete")
      }
    })
  },

  // 触摸开始事件  
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点  
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      touchTime++;
    }, 100);
  },

  // 触摸结束事件  
  touchEnd: function (e) {
    if (touchTime < 10) { //1秒内
      var diffX = e.changedTouches[0].pageX - touchDot;
      if (diffX <= -40) {  //向左滑动(显示后一页)
        //console.log('向左滑动A');
        if (currPageNo < totalPage) {
          currPageNo = currPageNo + 1;
          this.loadChangeList();
        }
      }
      else if (diffX >= 40) {  //向右滑动(显示前一页)
        //console.log('向右滑动A');
        if (currPageNo > 1) {
          currPageNo = currPageNo - 1;
          this.loadChangeList();
        }
      }
    } 
    clearInterval(interval); // 清除setInterval  
    touchTime = 0;
  },

  //选择区域
  bindPickerChange: function (e) {
    var idx = e.detail.value;
    if (idx == 0)
      quFilter = "";
    else
      quFilter = this.data.quArray[idx];
    currPageNo = 1;
    this.setData({ quIndex: e.detail.value});
    this.loadChangeList();
  },


})
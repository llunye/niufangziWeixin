var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var apiURL = '';
var maxCount = app.globalData.maxRecordCount;
var chartCount = null;
var chartPrice = null;
Page({
    data: {
      periodArray: ['天', '周', '月', '季度'],
      periodIndex: 0,
      cityName: ''
    },
    touchHandlerCount: function (e) {
        chartCount.scrollStart(e);
    },
    moveHandlerCount: function (e) {
        chartCount.scroll(e);
    },
    touchEndHandlerCount: function (e) {
        chartCount.scrollEnd(e);
        chartCount.showToolTip(e, {
            format: function (item, category) {
                //return category + ' ' + item.name + ':' + item.data 
                return item.data;
            }
        });        
    },
    touchHandlerPrice: function (e) {
      chartPrice.scrollStart(e);
    },
    moveHandlerPrice: function (e) {
      chartPrice.scroll(e);
    },
    touchEndHandlerPrice: function (e) {
      chartPrice.scrollEnd(e);
      chartPrice.showToolTip(e, {
        format: function (item, category) {
          //return category + ' ' + item.name + ':' + item.data 
          return item.data;
        }
      });
    },

    drawChartCount: function (records) {
      //var opt = app.globalData.wxChartsOpt; //此种赋值为浅拷贝，错误！
      var opt = JSON.parse(JSON.stringify(app.globalData.wxChartsOpt));
      opt.canvasId = 'canvasCount';
      opt.series.name = '调价套数';
      opt.yAxis.title = '调价套数';
      var nCount = records.length; //记录条数 
      for (var i = nCount - 1; i >= 0; i--)    //挨个取出数组值 
      {
        opt.series[0].data.push(records[i].Count);
        opt.categories.push(records[i].Date);
      }
      chartCount = new wxCharts(opt);
    },

    drawChartPrice: function (records) {
      //var opt = app.globalData.wxChartsOpt;   //此种赋值为浅拷贝，错误！
      var opt = JSON.parse(JSON.stringify(app.globalData.wxChartsOpt));
      opt.canvasId = 'canvasPrice';
      opt.series.name = '平均调价幅度';
      opt.yAxis.title = '平均调价幅度';
      var nCount = records.length; //记录条数 
      for (var i = nCount - 1; i >= 0; i--)    //挨个取出数组值 
      {
        var rateFixed = Math.round(records[i].Rate * 100) / 100;
        opt.series[0].data.push(rateFixed);
        opt.categories.push(records[i].Date);
      }
      chartPrice = new wxCharts(opt);
    },

    //调用http接口获取调价套数JSON数据
    loadChangeCount: function (period) {
      var records = [];
      var that = this; //进入wx.request函数内部后， this的含义发生了改变，所以需要先保存当前this
      wx.request({
        url: apiURL,
        data: {
          Method: 'ChangeCount',
          PeriodType: period,
          MaxCount: maxCount
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
            that.drawChartCount(records);
          }
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

    //调用http接口获取平均调价幅度JSON数据
    loadChangePrice: function (period) {
      var records = [];
      var that = this; //进入wx.request函数内部后， this的含义发生了改变，所以需要先保存当前this
      wx.request({
        url: apiURL,
        data: {
          Method: 'ChangeRate',
          PeriodType: period,
          MaxCount: maxCount
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
            that.drawChartPrice(records);
          }
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

    //选择'统计周期'
    bindPickerChange: function (e) {
      var idx = e.detail.value;
      this.setData({ periodIndex: idx });
      this.loadChangeCount(idx);
      this.loadChangePrice(idx);
    },

    onLoad: function (e) {
      //
    },

    onShow: function (e) {
      var cityCode = app.globalData.cityCodeArray[app.globalData.cityIndex];
      apiURL = app.globalData.niufangziURL + "?City=" + cityCode;
      var cName = app.globalData.cityNameArray[app.globalData.cityIndex];
      this.setData({ cityName: cName });
      this.loadChangeCount(0);
      this.loadChangePrice(0);
    }

});
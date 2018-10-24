import * as echarts from '../../ec-canvas/echarts';

var option = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%'];
    }
  },

  toolbox: {
    feature: {
      saveAsImage: { type: 'jpg' }
    },
    right: 30
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: []  //空数据
    }
  ],
  yAxis: [
    {
      type: 'value',
      boundaryGap: [0, '1%']
    }
  ],
  dataZoom: [
    {
      start: 50,
      end: 100,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '100%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }
  ],
  series: [
    {
      name: '成交',
      type: 'line',
      smooth: true,
      symbol: 'emptyCircle',
      sampling: 'average',
      itemStyle: {
        normal: {
          color: 'rgb(255, 70, 131)'
        }
      },
      data: [] //空数据
    }
  ]
};

Page({
  onShareAppMessage: function (res) {
    return {
      title: '牛房子-房价信息！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ecPrice: {
      lazyLoad: true  // 将 lazyLoad 设为 true 后，需要手动初始化图表
    },
    ecCount: {
      lazyLoad: true  // 将 lazyLoad 设为 true 后，需要手动初始化图表
    }
  },

  // 初始化图表(成交套数)
  initChartCount: function (records) {
    this.ecCount.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      chart.setOption(option);

      var counts = [];       //成交价格数组
      var dates = [];        //时间数组
      var nCount = records.length; //记录条数 
      for (var i = nCount - 1; i >= 0; i--)    //挨个取出数组值 
      {
        counts.push(records[i].Count);
        dates.push(records[i].Date);
      }

      chart.setOption({        //载入数据
        title: {
          text: '成交套数'
        },
        xAxis: {
          data: dates    //填入X轴数据
        },
        series: [    //填入数据
          {
            name: '成交套数',
            data: counts
          }
        ]
      });

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chartCount = chart;
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

  // 初始化图表(成交均价)
  initChartPrice: function (records) {
    console.log('initprice, step a');
    this.ecPrice.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      console.log('initprice, step b');
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      console.log('initprice, step c');
      canvas.setChart(chart);
      console.log('initprice, step d');
      chart.setOption(option);

      console.log('initprice, step e');
      var prices = [];       //成交价格数组
      var dates = [];        //时间数组
      var nCount = records.length; //记录条数 
      for (var i = nCount - 1; i >= 0; i--)    //挨个取出数组值 
      {
        prices.push(records[i].Price);
        dates.push(records[i].Date);
      }
      console.log('initprice, step f');
      chart.setOption({        //载入数据
        title: {
          text: '成交均价'
        },
        xAxis: {
          data: dates    //填入X轴数据
        },
        series: [    //填入数据
          {
            name: '成交均价',
            data: prices
          }
        ]
      });
      console.log('initprice, step g');
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chartPrice = chart;
      console.log('initprice, step h');
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

  //调用http接口获取成交套数JSON数据
  loadSoldCount: function (period) {
    var app = getApp();
    var cityCode = app.globalData.cityCodeArray[app.globalData.cityIndex];
    var apiURL = app.globalData.niufangziURL + "?City=" + cityCode;
    var records = [];
    var that = this; //进入wx.request函数内部后， this的含义发生了改变，所以需要先保存当前this
    wx.request({
      url: apiURL,
      data: {
        Method: 'SoldCount',
        PeriodType: period,
        MaxCount: 100
      },
      header: {
        //'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res.data);
        if (res.data.ReturnCode == '000000') {
          records = res.data.Records;
          console.log(records);
          that.initChartCount(records);
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

  //调用http接口获取成交均价JSON数据
  loadSoldPrice: function (period) {
    console.log('price, step 1');
    var app = getApp();
    var cityCode = app.globalData.cityCodeArray[app.globalData.cityIndex];
    var apiURL = app.globalData.niufangziURL + "?City=" + cityCode;
    var records = [];
    var that = this; //进入wx.request函数内部后， this的含义发生了改变，所以需要先保存当前this
    console.log('price, step 2');
    wx.request({
      url: apiURL,
      data: {
        Method: 'SoldPrice',
        PeriodType: period,
        MaxCount: 100
      },
      header: {
        //'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res.data);
        console.log('price, step 3');
        if (res.data.ReturnCode == '000000') {
          records = res.data.Records;
          console.log('price, step 4');
          that.initChartPrice(records);
          console.log('price, step 5');
        }
      },
      fail: function (res) {
        console.log("fail");
        that.setData({ pageText: "网络访问出错！" });
      },
      complete: function (res) {
        console.log("complete")
      }
    })
  },

  onReady() {
    //this.ecCount = this.selectComponent('#mychart-sold-count');  // 获取组件
    //this.loadSoldCount(0);  //0:按天; 1：按周; 2:按月; 3:按季度
    //this.ecPrice = this.selectComponent('#mychart-sold-price');  // 获取组件
    //this.loadSoldPrice(0);  //0:按天; 1：按周; 2:按月; 3:按季度
  },

  onShow() {
    console.log('I am onShow()');
    this.ecCount = this.selectComponent('#mychart-sold-count');  // 获取组件
    this.loadSoldCount(0);  //0:按天; 1：按周; 2:按月; 3:按季度
    //this.ecPrice = this.selectComponent('#mychart-sold-price');  // 获取组件
    //this.loadSoldPrice(0);  //0:按天; 1：按周; 2:按月; 3:按季度
  }

});


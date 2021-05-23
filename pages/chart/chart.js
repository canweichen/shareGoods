// pages/chart/chart.js
import * as echarts from '../../ec-canvas/echarts';
// function setOption() {
//   var option = {
//     title: {
//       text: 'ECharts 入门示例'
//     },
//     tooltip: {},
//     legend: {
//       data: ['销量']
//     },
//     xAxis: {
//       data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
//     },
//     yAxis: {},
//     series: [{
//       name: '销量',
//       type: 'bar',
//       data: [5, 20, 36, 10, 10, 20]
//     }]
//   };
//   return option;
// }
let chart = null;
let chart_ = null;
let chart_c = null;
var width = '';
var height = '';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: function(canvas, width, height) {
        chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart);
        return chart;
      }
    },
    ecc: {
      onInit: function (canvas, width, height) {
        chart_ = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart_);
        return chart_;
      }
    },
    eccc: {
      onInit: function (canvas, width, height) {
        chart_c = echarts.init(canvas, null, {
          width: '414',
          height: '200'
        });
        canvas.setChart(chart_c);
        return chart_c;
      }
    },
    t_id:1,
    is_show:false,
    
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(this.showEchartContent,1000);
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
   * 顶部tab样式切换和内容切换
   */
  switchChartTab:function(e){
    //console.log(e);
    let is_s = true;
    if(e.currentTarget.dataset.id == 1){
      is_s = false;
    }
    this.setData({
      t_id:e.currentTarget.dataset.id,
      is_show:is_s
    });
    this.showEchartContent();
  },
  /**
   * 显示当天的数据处理
   */
  localDay:function(){
    var option = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['与昨日比', '与上周同期比']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        fontSize: '13px',
        containLabel: true
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {}
      //   }
      // },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
      },
      yAxis: {
        type: 'value',
        max: 6
      },
      series: [
        {
          name: '与昨日比',
          type: 'line',
          stack: '总量',
          data: [65 / 59, 10 / 18, 1 / 5, 10 / 2, 36 / 18, 100 / 68, 89 / 89, 160 / 80, 189 / 189, 263 / 163, 199 / 100, 245 / 49, 213 / 213]
        },
        {
          name: '与上周同期比',
          type: 'line',
          stack: '总量',
          data: [65 / 25, 10 / 25, 1 / 10, 10 / 42, 36 / 15, 100 / 168, 89 / 189, 160 / 180, 189 / 180, 263 / 63, 199 / 200, 245 / 249, 213 / 177]
        }
      ]
    };
    chart.setOption(option);
    var option_ = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['与昨日比', '与上周同期比']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        fontSize: '13px',
        containLabel: true
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {}
      //   }
      // },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
      },
      yAxis: {
        type: 'value',
        max: 6
      },
      series: [
        {
          name: '与昨日比',
          type: 'line',
          stack: '总量',
          data: [65 / 59, 10 / 18, 1 / 5, 10 / 2, 36 / 18, 100 / 68, 89 / 89, 160 / 80, 189 / 189, 263 / 163, 199 / 100, 245 / 49, 213 / 213]
        },
        {
          name: '与上周同期比',
          type: 'line',
          stack: '总量',
          data: [65 / 250, 100 / 25, 10 / 10, 10 / 42, 36 / 15, 100 / 168, 89 / 189, 160 / 160, 189 / 80, 263 / 63, 199 / 200, 245 / 249, 213 / 177]
        }
      ]
    };
    chart_.setOption(option_);
  },
  /**
   * 显示其它时间
   */
  localOtherDay: function () {

    var option_c = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['与昨日比', '与上周同期比']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        fontSize: '13px',
        containLabel: true
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {}
      //   }
      // },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
      },
      yAxis: {
        type: 'value',
        max: 6
      },
      series: [
        {
          name: '与昨日比',
          type: 'line',
          stack: '总量',
          data: [65 / 59, 10 / 18, 1 / this.data.t_id, 10 / 2, 36 / 18, 100 / 68, 89 / 89, 160 / 80, 189 / 189, 263 / 163, 199 / 100, 245 / 49, 213 / 213]
        },
        {
          name: '与上周同期比',
          type: 'line',
          stack: '总量',
          data: [65 / 250, 100 / 25, 10 / 10, 10 / 42, 36 / 15, 100 / 168, 89 / 189, 160 / 160, 189 / 80, 263 / 63, 199 / 200, 245 / 249, 213 / 177]
        }
      ]
    };
    console.log(chart_c);
    chart_c.setOption(option_c);
   },
  /**
   * 报表内容显示
   */
  showEchartContent:function(){
    wx.showLoading({
      title: '加载中',
    })
   if(this.data.is_show){
      this.localOtherDay();
   }else{
     this.localDay();
   }
   wx.hideLoading();
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
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
})
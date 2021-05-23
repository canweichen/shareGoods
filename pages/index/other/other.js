// pages/index/other/other.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locObj: {},
    img_url:[
      { url: 'http://selfcenter.top/tp_front/public/uploader/0.jpg', navBar: '今日新品', color:'#33ccff'},
      { url: 'http://selfcenter.top/tp_front/public/uploader/1.jpg', navBar: '日用快消', color:'#99ccff'},
      { url: 'http://selfcenter.top/tp_front/public/uploader/2.jpg', navBar: '超级拼"拼着赚"', color:'#6633ff'},
      { url: 'http://selfcenter.top/tp_front/public/uploader/3.jpg', navBar: '聚划算热销榜', color:'#ff3399'},
      { url: 'http://selfcenter.top/tp_front/public/uploader/4.jpg', navBar: '人气榜', color:'#cc66cc'},
      { url: 'http://selfcenter.top/tp_front/public/uploader/5.jpg', navBar: '品牌尖货', color:'#669933'},
      { url: 'http://selfcenter.top/tp_front/public/uploader/6.jpg', navBar: '全球母婴专场', color:'#ff3366'},
      { url: 'http://selfcenter.top/tp_front/public/uploader/7.jpg', navBar: '好货高佣榜', color:'#ff9933'},
      { url: 'http://selfcenter.top/tp_front/public/uploader/8.jpg', navBar: '超级大额优惠券榜', color:'#3399cc'}
      ],//banner图数组
    type:0,//既是数据请求的类型ID又是banner图数组索引下标
    gList:[],
    URL_PATH:'',
    def_img:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const appInstance = getApp();
    this.setData({
      URL_PATH: appInstance.globalData.url_path
    })
    this.setData({
      type:options.type,
      locObj: this.data.img_url[options.type]
    })
   // wx.showNavigationBarLoading();
    //动态修改标题
    wx.setNavigationBarTitle({
      title: this.data.locObj.navBar
    })
    //动态修改导航栏颜色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.locObj.color,
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    //获取相应栏位数据
    this.getOtherTypeGoodsList();
  },
  getOtherTypeGoodsList:function(){
    const _this = this;
    wx.request({
      url: this.data.URL_PATH+'/index.php/wechat/Index/getOtherTypeGoodsList',
      data:{
        type:this.data.type
      },
      success:function(res){
        if(res.data.status ==1){
            _this.setData({
              gList:res.data.data,
              def_img:true
            })
        }else{
          //说明无数据
        }
      }
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

  }
})
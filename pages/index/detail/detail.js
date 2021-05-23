// pages/index/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid:'600',
    cid:1,
    goods:[],
    gList:[],
    def_img:false,
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
    //console.log(options);
    this.setData({
      gid:options.gid,
       cid:options.cid
    })
    //获取商品信息
    this.getGoodsDetail();
  },
  getGoodsDetail:function(){
    const _this = this;
    wx.request({
      url: this.data.URL_PATH+'/index.php/wechat/Index/getGoodsDetail',
      data:{
        gid:this.data.gid,
        cid:this.data.cid
      },
      header:{
        'content-type': 'application/json'
      },
      success(res){
        //相似商品列表数据绑定
        _this.setData({
          gList:res.data.list,
          def_img:true
        })
        if(res.data.status == 1){
          _this.setData({
            goods:res.data.data
          })
        }else{
          wx.showToast({
            title: '失败',
            icon: 'fail',
            duration: 2000
          })
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
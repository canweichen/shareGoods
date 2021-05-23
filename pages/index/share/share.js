// pages/index/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid:'',
    goods:'',
    URL_PATH:'',
    def_img: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const appInstance = getApp();
    this.setData({
      URL_PATH: appInstance.globalData.url_path
    });
    this.setData({
      gid:options.gid
    });
    this.getGoods();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 获取商品数据
   */
  getGoods(){
    let that = this;
    wx.request({
      url: this.data.URL_PATH+'/index.php/wechat/Index/getShareGoods',
      data:{gid:this.data.gid},
      header: { 'content-type': 'application/json'},
      dataType:'json',
      success:function(res){
        //console.log(res);
        if(res.statusCode == 200){
          that.setData({
            goods: res.data,
            def_img: true
          })
        }else{
          //请求失败返回上一页
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  /**
   * 复制分享内容
   */
  copyContent(){
    let str = this.data.goods.title + "\n" + "【在售价】" + this.data.goods.price + "元" + "\n" + "【券后价】" + this.data.goods.org_price + "元" + "\n" + "【下单链接】{选择分享渠道后自动生成链接}" + "\n" + "-----------------------" + "\n" +"复制这条信息，{￥选择分享渠道后自动生成淘口令￥}，到【手机淘宝】即可查看";
    wx.setClipboardData({
      data: str,
      success:function(res){
        wx.showToast({
          title: '复制成功',
          icon:'success',
          duration:2000
        })
      }
    })
  },
  /**
   * 分享到微信 
   */
  shareWeChat(){
    //分享给好友
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        // 分享成功
        console.log(res);
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    });
  },
  /**
  * 分享到微博
  */
  shareWeBo() {
    wx.showModal({
      content: '分享到微博接口暂未开通',
    })
  },
  /**
  * 分享到QQ 
  */
  shareQQ() {
    wx.showModal({
      title: '',
      content: '分享到QQ接口暂未开通',
    })
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
  onShareAppMessage: function (res) {
    var vm = this;
    /**判断分享位置*/
    if (res.from === 'button') {
      console.log("onShareAppMessage()==>>来自页面内转发按钮");
      console.log(res.target);
    } else {
      console.log("onShareAppMessage()==>>来自右上角转发菜单")
    }
    //自定义信息
    let sendinfo = {
      openId: "6598741", //分享人的openId
      nickName: "BRUCE", //分享人的昵称
    }
    let str = JSON.stringify(sendinfo);
    let string = this.data.goods.title;
    return {
      title: string,
      path: 'pages/index/index?userShare=' + str,
      imageUrl: "../../image/milk.png",
      success: function (res) {
        console.log("分享success()");
        console.log("onShareAppMessage()==>>转发成功", res);
        //分享的是群还是个人
        app.setInfo(res);
      },
      fail: (res) => {
        console.log("onShareAppMessage()==>>转发失败", res);
      }
    }
  },
  
})
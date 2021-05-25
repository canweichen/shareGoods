// pages/person/person.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    token:'',
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  _getUserProfile:function(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    let _this = this;
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
       _this. _updateUserInfo(res.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail:() =>{
        wx.showToast({
          title: '授权失败',
          icon: 'fail',
          duration: 1500
        })
      }
    })
  },

  _updateUserInfo:function($userInfo){
      //获取token
      let token = wx.getStorageSync('token');
      console.log(token);
      wx.request({
        url: getApp().globalData.url_path+"/index.php/wechat/Login/update",
        method:"POST",
        header:{
          'x-token':token,
          'content-type':'application/json'
        },
        data:$userInfo,
        success (res){
          wx.showToast({
            title: '更新成功',
          })
        },
        fail (res){
          wx.showToast({
            title: res.msg,
            icon:'fail',
            duration:1500
          })
        }
      })
  },
  _checkUserInfoIsOk:function(){
    const that = this;
    wx.request({
      url: getApp().globalData.url_path+'/index.php/wechat/Login/me',
      method:'GET',
      header:{
        'x-token' : wx.getStorageSync('token'),
        'content-type':'application/json'
      },
      success (res){
        if(res.data.status == 200){
          that.setData({
            hasUserInfo:res.data.is_ok
          })
        }
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._checkUserInfoIsOk();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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
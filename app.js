//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.checkSession({
      success () {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          fail: res => {
            wx.request({
              url: 'https://selfcenter.top/tp_front/public/index.php/wechat/Login/index',
              data:{code:res.code},
              success:function(data){
                if(data.data.status == 200){
                  wx.setStorage({
                    key: 'token',
                    data: data.data.token,
                  });
                  wx.setStorage({
                    key: 'is_ok',
                    data: data.data.is_ok,
                  })
                }else{
                  wx.showToast({
                    title: data.data.msg,
                    icon: 'fail',
                    duration: 1500
                  })
                }
              }
            })
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
          }
        })
      }
    })
  
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.getUserInfo({
                success: res =>{
                  this.globalData.userInfo = res.userInfo
                }
                // 可以将 res 发送给后台解码出 unionId
              
              })
            }
          })
        }
      }
    })
  },
  onShow (option){

  },
  globalData: {
    token: null,
    userInfo:null,
    url_path:'https://selfcenter.top/tp_front/public'
  }
})
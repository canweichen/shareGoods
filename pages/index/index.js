//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      'https://selfcenter.top/tp_front/public/uploader/cc3333.jpg?v=1',
      'http://selfcenter.top/tp_front/public/uploader/cc9966.jpg?v=2',
      'http://selfcenter.top/tp_front/public/uploader/ccccff.jpg?v=3'
    ],
    rgbArr:['#cc3333','#ffcccc','#cc99ff'],
    indicatorDots: true,//是否设置小圆点
    autoplay: true,//是否自动播放
    interval: 5000,//轮播时间间隔
    duration: 1000,//轮播
    grids:[0,1,2,3,4],//主菜单
    switch_on:0,//开关样式按钮
    switch_first:false,//是否首次点击类型切换按钮
    scroll_top:0,//页面滚动高度
    goodsList:[],//券列表
    page:0,//页码
    goLoading:true,//继续加载更多
    emptyData:true,//没有更多数据咯
    pullRefresh:false,
    swiperId:0,//轮播id
    URL_PATH:'',//域名全局路由配置
  },
  onLoad: function () {
    const appInstance = getApp();
    this.setData({
      URL_PATH:appInstance.globalData.url_path
    })
    console.log(appInstance.globalData) // I am global data
    this.getGoodsList();
  },
  onReady:function(){
    // const _this = this;
    // setInterval(function(){
    //   if(_this.data.swiperId > 2){
    //       _this.setData({
    //         swiperId:-1
    //       })
    //   }
    //   const colo = _this.data.rgbArr[_this.data.swiperId++];
    //   wx.setNavigationBarColor({
    //     frontColor: '#ffffff',
    //     backgroundColor: colo,
    //     animation: {
    //       duration: 400,
    //       timingFunc: 'easeIn'
    //     }
    //   })
    // },5000)
    
  },
  //切换轮播图的背景色与顶部导航栏背景色一致
  bannerChange:function(e){
    //console.log(e);
    this.setData({
      swiperId:e.detail.current
    })
    const colo = this.data.rgbArr[this.data.swiperId];
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: colo,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  //切换分类菜单栏样式
  switchAndGetGoods:function(e){
    //console.log(e.currentTarget.id);
    this.setData({
      switch_on: e.currentTarget.id,
      page: 0,
     
      switch_first:true
    })
    //显示顶部导航加载样式
    wx.showNavigationBarLoading();
    this.getGoodsList();
  },
  //监听页面滚动事件
  onPageScroll: function (e) {
    //console.log(e);
    this.setData({
      scroll_top:e.scrollTop
    })
  },
  //页面跳转
  goToPage:function(e){
    const path = '/pages/index/other/other?type='+e.currentTarget.dataset.id
    wx.navigateTo({
      url:path
    })
  },
  //获取活动商品列表
  getGoodsList:function(){
    let _this = this;
    //页码处理
    _this.setData({
      page: _this.data.page+1,
    })
    wx.request({
      url: this.data.URL_PATH+'/index.php/wechat/Index/getGoodsList',
      data:{
        page:_this.data.page,
        cid:_this.data.switch_on
      },
      success(res){
        //隐藏顶部导航加载样式
        wx.hideNavigationBarLoading();
        //判断是否成功获取数据
        if(res.data.status == 1){
          //判断是否是第一次获取
          if(_this.data.page == 1){
            _this.setData({
              goodsList: res.data.data
            })
            if(_this.data.switch_first){
              wx.pageScrollTo({
                scrollTop: 800
              })
            }
          }else{
            //循环追加数据
            _this.changeStyle(0);
            _this.setData({
              goodsList: _this.data.goodsList.concat(res.data.data)
            })
          }
        }else{
          //隐藏加载动画 显示没有更多数据
           _this.changeStyle(2);
        }
      }
    })
  },
  //下拉刷新页面
  onPullDownRefresh:function(){
    const _this = this;
    _this.setData({
      pullRefresh:true
    })
    setTimeout(function(){
      wx.stopPullDownRefresh();
      _this.setData({
        pullRefresh: false
      })
    }, 2000);
  },
  //滑动触底获取分页数据
  onReachBottom:function(){
    //为true说明还有数据 继续请求
    if(this.data.emptyData){
      this.changeStyle(1);
      this.getGoodsList();
    }
  },
  //正在加载 没有更多数据动画切换
  changeStyle:function(id){
    if(id == 1){
      //显示正在加载动画
      this.setData({
        goLoading: false,
        emptyData: true
      })
    }else if(id == 2){
      //显示没有更多数据
      this.setData({
        goLoading: true,
        emptyData: false
      })
    } else {
      //隐藏
      this.setData({
        goLoading: true,
        emptyData: true
      })
    }

  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    //轮播定时开启
    this.setData({
      autoplay:true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //轮播图定时关闭
    this.setData({
      autoplay: false
    })
  },
  
})

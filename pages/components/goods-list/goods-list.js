// pages/components/goods-list/goods-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    gList:{
      type:'Array',
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _goToDetail(e){
      wx.navigateTo({
        url: '/pages/index/detail/detail?gid=' + e.currentTarget.dataset.gid + '&cid=' + e.currentTarget.dataset.cid,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    _goToShare(e){
      wx.navigateTo({
        url: '/pages/index/share/share?gid=' + e.currentTarget.dataset.gid,
      })
    }
  }
})

// component/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showNav: Boolean,
    fixed: Boolean,
    color: {
      type: String,
      value: '#000'
    },
    backgroundColor: {
      type: String,
      value: '#fff'
    },
    back: {
      type: null,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isx: /iphone10|iphone x/i.test(wx.getSystemInfoSync().model),
    isAndroid: /android/i.test(wx.getSystemInfoSync().system),
    showMuLu: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //导航
    showNav() {
      if (this.data.showMuLu == true) {
        this.setData({
          showMuLu: false
        })
      } else {
        this.setData({
          showMuLu: true
        })
      }
    },
    //跳转平台首页
    goPlatFormIndex: function () {
      wx.switchTab({
        url: '/pages/index/index',
      })
      this.setData({
        showNav: true
      })
    },
    //跳转购物车
    goCart: function () {
      wx.switchTab({
        url: '/pages/cart/cart',
      })
      this.setData({
        showNav: true
      })
    },
    //跳转我的收藏
    goFavorite: function () {
      wx.navigateTo({
        url: '/pages/favorite/favorite',
      })
      this.setData({
        showNav: true
      })
    },

    //跳转个人中心
    goMember: function () {
      wx.switchTab({
        url: '/pages/member/member',
      })
      this.setData({
        showNav: true
      })
    },

    backFunction: function() {
      wx.navigateBack({
        delta: this.data.back
      })
    }
  }
})
// pages/home/home.js

let swiperAutoHeight = require("../../template/swiper/swiper.js"),
  Product = require("../../service/product.js"),
  Cart = require("../../service/cart.js"),
  Coupon = require("../../service/coupon.js"),
  Tenant = require("../../service/tenant.js"),
  lbs = require('../../service/lbs.js'),
  Ad = require("../../service/ad.js"),
  app = getApp(),
  util = require("../../utils/util.js")

Page(Object.assign({}, swiperAutoHeight, {

  /**
   * 页面的初始数据
   */
  data: {
    scrollTo: '', //页面跳转到
    sys: app.globalData.sys,
    homeLoadReady: false,
    winHeight: 0, //用于scroll-view高度
    bottomHeight: 60, //用于scroll-view高度，当显示bottom
    storyTitle: '',
    pageNumber: 1,
    toUpShow: false,
    showSearch: true,
    articleList: [],
    communityId: 211
  },
  onReady() {
    this.setData({
      winHeight: wx.getSystemInfoSync().windowHeight
    })
  },
  // 前往搜索页
  goSearch(e) {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },
  // //关闭广告位表单提交
  // formSubmitClose(e) {
  //   console.log(e.detail.formId)
  //   var index = e.currentTarget.dataset.index
  //   var formId = e.detail.formId
  //   var topImgs = this.data.topImgs
  //   topImgs.data.splice(index, 1)
  //   this.setData({
  //     topImgs: topImgs
  //   })
  // },
  // //图片点击广告位表单提交
  // formSubmit(e) {
  //   console.log(e.detail.formId)
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var extension = options.extension;
    if (extension) {
      wx.setStorageSync('extension', extension)
    }

    if (app.globalData.LOGIN_STATUS) {
      this.getData()
    } else {
      app.loginOkCallbackList.push(() => {
        this.getData()
      })
    }
  },
  scroll(e) {
    this.data.scroll = e.detail.scrollTop
    this.setData({
      toUpShow: e.detail.scrollTop > 650
    })
  },
  touchstart: function (e) {
    this.data.startTouches = e.changedTouches[0]
  },
  touchmove: function (e) {
    this.data.moveTouches = e.changedTouches[0]
  },
  touchend: function (e) {
    var startTouch = this.data.startTouches,
      Y = e.changedTouches[0].pageY - startTouch.pageY,
      X = Math.abs(e.changedTouches[0].pageX - startTouch.pageX)

    if (this.data.scroll > 10) {
      return false
    }
    this.data.endTouches = e.changedTouches[0]
    if (Y > 50 && X < 200) {
      wx.startPullDownRefresh()
      wx.showLoading({
        title: '刷新中',
      })
      this.getData()
    }
  },

  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1200)
  },
  //跳转商品详情页
  toDetail(e) {
    let id = e.currentTarget.dataset.id
    util.navigateTo({
      url: '/pages/product/details/details?id=' + id,
    })
  },
  //跳转店铺详情
  toTenant(e) {
    let id = e.currentTarget.dataset.id
    util.navigateTo({
      url: '/pages/home/home?tenantId=' + id,
    })
  },
  // 搜索店铺
  searchProduct(e) {
    let v = e.detail.value
    if (v === '') return
    wx.navigateTo({
      url: `../search/result?type=0&keyword=${v}`
    })
  },
  //加入购物车
  addCart(e) {
    let id = e.currentTarget.dataset.id

    new Cart((res) => {

    }).add({
      id: id,
      quantity: 1
    })
  },
  //获取数据
  getData() {
    var that = this
    //更新当前地理位置
    new lbs(function () {
      that.getLocationSuccess()
    }).update({
      areaId: 1029
    })
  },
  getLocationSuccess() {
    let that = this,
      promiseList = []
    //广告位(顶部)
    promiseList.push(new Promise((resolve, reject) => {
      new Ad(res => {
        resolve(res)
      }).do(187)
    }))

    Promise.all(promiseList).then(res => {
      this.setData({
        topImgs: {
          data: res[0].data,
          key: 'image'
        }
      })
      setTimeout(() => {
        wx.hideLoading()
        this.setData({
          homeLoadReady: true
        })
      }, 500)
    }, err => {
      this.setData({
        homeLoadReady: true
      })
    })

    // 横屏广告位
    new Ad(res => {
      this.setData({
        Ad206: res.data
      })
    }).do(206)

    //商圈基本资料
    new Tenant(res => {
      this.setData({
        tenantListData: res.data
      })
    }).firstRecommend({
      tagId: 28,
      pageSize: 10,
      pageNumber: 1
    })


    //广告位1,2,3
    var adList = {}
    for (var j = 1; j <= 3; j++) {
      adList['ad' + j] = []

      function adTopLoad(j) {
        new Ad(res => {
          adList['ad' + j] = {
            'linkType': res.data[0] ? res.data[0].linkType : '',
            'linkId': res.data[0] ? res.data[0].linkId : '',
            'image': res.data[0] ? res.data[0].image : ''
          }
          that.setData({
            adList: adList
          })
        }).do(229 + j);
      }
      adTopLoad(j);
    }
    new Cart(res => {
      if (res.data > 0) {
        wx.setTabBarBadge({
          index: 1,
          text: res.data.toString()
        })
      } else if (res.data == 0) {
        wx.removeTabBarBadge({
          index: 1
        })
      }
    }).count()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  toLower: function () {
    var that = this;
    var pageNumber = this.data.pageNumber
    wx.showNavigationBarLoading();
    var tenantListData = this.data.tenantListData;
    new Tenant(function (data) {
      wx.hideNavigationBarLoading() //完成停止加载
      if (data.data.length < 10) {
        return
      } else {
        tenantListData = tenantListData.concat(data.data)
        that.setData({
          tenantListData: tenantListData,
          pageNumber: pageNumber
        })
      }
    }).firstRecommend({
      tagId: 28,
      pageSize: 10,
      pageNumber: ++pageNumber
    });
  },
  //广告位跳转
  toAdLink(e) {
    var linkType = e.currentTarget.dataset.linktype
    var linkId = e.currentTarget.dataset.linkid
    if (linkType == 'tenant') {
      util.navigateTo({
        url: '/pages/home/home?tenantId=' + linkId,
      })
    } else if (linkType == 'product') {
      util.navigateTo({
        url: '/pages/product/details/details?id=' + linkId,
      })
    }
  },
  //新闻资讯跳转
  goNewView(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/businessCircle/article/article?id=' + id,
    })
  },
  //楼层跳转
  goFloorView(e) {
    var communityid = e.currentTarget.dataset.communityid
    var tagId = e.currentTarget.dataset.id
    util.navigateTo({
      url: 'floor/index?tagId=' + tagId + '&communityId=' + communityid,
    })
  },

  //加载更多商品
  loadingMore: function (e) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isChangeTenantId) {
      app.globalData.isChangeTenantId = false
      this.setData({
        loading: true,
        homeLoadReady: false
      })
      this.getData()
    }
    new Cart(res => {
      if (res.data > 0) {
        wx.setTabBarBadge({
          index: 1,
          text: res.data.toString()
        })
      } else if (res.data == 0) {
        wx.removeTabBarBadge({
          index: 1
        })
      }
    }).count()
  },



  scrollto(e) {
    let to = e.currentTarget.dataset.to
    this.setData({
      scrollIntoId: to
    })
  },
  adTap(e) {
    let linkid = e.currentTarget.dataset.linkid
    if (!linkid) return
    util.navigateTo({
      url: '/pages/product/details/details?id=' + linkid,
    })
  },
  //前往技术支持
  technical() {
    wx.navigateTo({
      url: '/pages/technical/technical',
    })
  },
  //分享
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮

    }
    return {
      title: that.data.tenantData.name,
      path: 'pages/businessCircle/index?&extension=' + app.globalData.memberInfo.id,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success'
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
}))
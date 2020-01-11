let app = getApp(),
  Product = require("../../../service/product.js"),
  util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTabIndex: 0,
    showType: false, //false块显示true行显示
    productData: [], //数据
    sortType: ['weight', 'priceAsc', 'priceDesc', 'monthSalesDesc'], //排序 {综合排序 weight, 置顶降序 topDesc, 价格升序 priceAsc, 价格降序 priceDesc, 销量降序 salesDesc, 评分降序 scoreDesc, 日期降序 dateDesc, 人气降序 hitsDesc}
    showUp: false,
    getDataComplete: false
  },
  technical() {
    wx.navigateTo({
      url: '/pages/technical/technical?tenantId=' + this.data.tenantId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.page = options.page
    this.data.keyWord = options.keyWord
    this.data.cateid = options.page == 'cate' ? options.cateid : ''
    this.setData({
      page: this.data.page,
      keyWord: this.data.keyWord,
      cateid: this.data.cateid,
      tenantId: options.tenantId
    })
    this.onPullDownRefresh()
  },
  // 搜索商品
  searchProduct: function(e) {
    this.data.keyWord = e.detail.value
    this.data.page = 'index'
    this.setData({
      keyWord: this.data.keyWord,
      page: this.data.page
    })
    this.onPullDownRefresh()
  },
  sortToggle(e) {
    let index = e.currentTarget.dataset.index,
      showUp = this.data.showUp
    if (index == 1) {
      showUp = false
      index = 2
    } else if (index == 2) {
      showUp = true
      index = 1
    }
    if (this.data.activeTabIndex == index) return
    this.data.activeTabIndex = index
    this.setData({
      activeTabIndex: index,
      showUp: showUp
    })
    this.onPullDownRefresh()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.page == "index") {
      var that = this;
      new Product(function(data) {
        var item = [];
        var productData = data.data
        that.setData({
          productData: productData,
          pageModel: data.pageModel,
          getDataComplete: true,
          tips: data.data.length == 0 ? '此分类下还没有商品哦~' : data.pageModel.pageNumber >= data.pageModel.totalPages ? '没有更多啦~' : '加载更多'
        });
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        that.data.pageModel = data.pageModel
      }).listT({
        id: that.data.tenantId,
        keyword: that.data.keyWord,
        pageSize: 6,
        pageNumber: 1,
        orderType: that.data.sortType[that.data.activeTabIndex]
      })
    } else {
      let cateid = this.data.cateid
      this.setData({
        cateid: cateid
      })
      new Product((res) => {
        this.setData({
          productData: res.data,
          pageModel: res.pageModel,
          getDataComplete: true,
          tips: res.data.length == 0 ? '此分类下还没有商品哦' : res.pageModel.pageNumber >= res.pageModel.totalPages ? '没有更多啦~' : '加载更多'
        })
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
      }).listT({
        id: this.data.tenantId,
        productCategoryTenantId: cateid,
        orderType: this.data.sortType[this.data.activeTabIndex],
        pageSize: 6,
        pageNumber: 1,
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    wx.showNavigationBarLoading();
    var pageModel = this.data.pageModel;
    var productData = this.data.productData;
    if (pageModel.pageNumber > pageModel.total) {
      wx.hideNavigationBarLoading() //完成停止加载
      return
    }

    if (this.data.page == "index") {
      new Product(function(data) {
        wx.hideNavigationBarLoading() //完成停止加载
        if (data.pageModel.totalPages < data.pageModel.pageNumber) {
          that.setData({
            tips: '没有更多啦~',
            showtips: false
          })
        } else {
          productData = productData.concat(data.data)
          that.setData({
            productData: productData,
            loading: false,
            tips: '努力加载中',
            showtips: false
          })
        }
      }).listT({
        id: that.data.tenantId,
        keyword: that.data.keyWord,
        pageSize: 6,
        pageNumber: ++pageModel.pageNumber,
        orderType: that.data.sortType[that.data.activeTabIndex]
      });
    } else if (this.data.page == "cate") {
      new Product(function(data) {
        wx.hideNavigationBarLoading() //完成停止加载
        if (data.pageModel.totalPages < data.pageModel.pageNumber) {
          that.setData({
            tips: '没有更多啦~',
            showtips: false
          })
        } else {
          productData = productData.concat(data.data)
          that.setData({
            productData: productData,
            loading: false,
            tips: '努力加载中',
            showtips: false
          })
        }
      }).listT({
        id: that.data.tenantId,
        productCategoryTenantId: that.data.cateid,
        pageSize: 6,
        pageNumber: ++pageModel.pageNumber,
        orderType: that.data.sortType[that.data.activeTabIndex]
      });
    }



  },


  //首页扫一扫进商品详情
  wxscan: function() {
    wx.scanCode({
      success: (res) => {
        util.navigateTo({
          url: '/pages/product/details/details?id=' + res.result,
        })
      }
    })
  },


  checkoutShowType() {
    this.setData({
      showType: !this.data.showType
    })
  },
  __pt_toDetail(e) {
    wx.navigateTo({
      url: '/pages/product/details/details?id=' + e.currentTarget.dataset.id + '&tenantId=' + this.data.tenantId,
    })
  }
})
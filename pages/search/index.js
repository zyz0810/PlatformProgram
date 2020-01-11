// pages/search/index.js
// pages/home/home.js

let swiperAutoHeight = require("../../template/swiper/swiper.js"),
  Product = require("../../service/product.js"),
  Cart = require("../../service/cart.js"),
  Coupon = require("../../service/coupon.js"),
  Tenant = require("../../service/tenant.js"),
  Ad = require("../../service/ad.js"),
  app = getApp(),
  util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    history: [
      [],
      []
    ],
    searchValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 历史搜索
    const history = this.data.history
    const storge0 = wx.getStorageSync('search:history:0')
    const storge1 = wx.getStorageSync('search:history:1')
    if (storge0 !== '') history[0] = storge0.split(':,:')
    if (storge1 !== '') history[1] = storge1.split(':,:')
    this.setData({
      history: history
    })

    // 热门搜索
    new Tenant(res => {
      this.setData({
        hotSearch: res.data
      })
    }).hot_search()



    // 热门好货
    new Product(res => {
      this.setData({
        dataListProduct: res.data
      })
    }).list({
      tagIds: 19,
      pageSize: 40
    })

    // 热门好店
    new Tenant(res => {
      this.setData({
        dataListTenant: res.data
      })
    }).areaList({
      tagIds: 32,
      pageSize: 40
    })


  },
  //导航切换
  selectTab(e) {
    var tab = e.currentTarget.dataset.tab
    if (tab == this.data.tab) {
      return
    } else {
      this.setData({
        tab: tab
      })
    }
  },
  //获取实时搜索内容
  setVal(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  //搜索发起
  search(e) {
    let v = e.detail.value
    if (v === '') return
    let historyData = this.data.history[this.data.tab]
    if (!historyData.some(hv => hv === v)) {
      if (historyData.length > 20) {
        historyData.shift()
      }
      historyData.push(v)
    }
    wx.setStorageSync(`search:history:${this.data.tab}`, historyData.join(':,:'))
    wx.navigateTo({
      url: `result?type=${this.data.tab}&keyword=${v}`
    })
  },
  //点击搜索按钮
  clickSearch(e) {
    let v = this.data.searchValue
    if (v === '') return
    let historyData = this.data.history[this.data.tab]
    if (!historyData.some(hv => hv === v)) {
      if (historyData.length > 20) {
        historyData.shift()
      }
      historyData.push(v)
    }
    wx.setStorageSync(`search:history:${this.data.tab}`, historyData.join(':,:'))
    wx.navigateTo({
      url: `result?type=${this.data.tab}&keyword=${v}`
    })
  },
  // 清除历史搜索
  clearHistory() {
    var that = this
    wx.showModal({
      title: '提示',
      content: `是否确认清空${this.data.tab === 0 ? ' 好货 ' : ' 好店 '}历史搜索`,
      success: res => {
        if (res.confirm) {
          var history = that.data.history
          history[that.data.tab] = []
          that.setData({
            history: history
          })
          wx.removeStorageSync(`search:history:${that.data.tab}`)
        }
      }
    })
  },
  gotoProduct(e) {
    util.navigateTo({
      url: '/pages/product/details/details?id=' + e.currentTarget.dataset.id,
    })
  },
  gotoTenant(e) {
    util.navigateTo({
      url: '/pages/home/home?tenantId=' + e.currentTarget.dataset.id,
    })
  },
  // 点击历史搜索，热门搜索
  goSearch(e) {
    var keyword = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `result?type=${this.data.tab}&keyword=${keyword}`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})
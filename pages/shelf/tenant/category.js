// pages/shop/category/index.js
let app = getApp(),
  util = require("../../../utils/util.js"),
  tenant = require('../../../service/tenant.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCategory: true,
    activeIndex: 0,
    loading: true,
    noCategory: false,
    category: [],
    activeID: 3155,
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCategory();
    // new tenant(function (res) {
    //   console.log('进来')
    //   console.log(res)
    // }).tenantCategoryTree()
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
    var chooseCategoryName = wx.getStorageSync('chooseCategoryName')
    this.setData({
      chooseCategoryName: chooseCategoryName
    })
  },
  click:function(e){
    console.log(e)
    console.log('点击点击')
    wx.setStorageSync('chooseCategoryName', e.currentTarget.dataset.name)
    wx.setStorageSync('shopCategoryId', e.currentTarget.dataset.id)
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.setData({
      shopCategory: e.currentTarget.dataset.name, // 假数据
      shopCategoryId: e.currentTarget.dataset.id
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 500)
  },
  // radioChange: function(e) {
  //   console.log(e)
  //   console.log('radio发生change事件，携带value值为：', e.detail.value)
  //   wx.setStorageSync('chooseCategoryName', e.detail.value)
  //   var pages = getCurrentPages(); // 获取页面栈
  //   var currPage = pages[pages.length - 1]; // 当前页面
  //   var prevPage = pages[pages.length - 2]; // 上一个页面
  //   prevPage.setData({
  //     shopCategory: e.detail.value // 假数据
  //   })
  //   setTimeout(function() {
  //     wx.navigateBack({
  //       delta: 1
  //     })
  //   }, 500)
  // },
  getCategory() {
    let that = this,
      activeID, cateDepth = 1
    new tenant((res) => {
      if (res.data.length === 0) {
        this.setData({
          category: [],
          loading: false,
          noCategory: true
        })
        return
      }
      activeID = res.data[0].id
  
      this.setData({
        category: res.data,
        activeID: activeID,
        loading: false
      })
    }).tenantCategory()
  },
  //左分类切换
  checkout(e) {
    let index = e.currentTarget.dataset.index,
      activeID = e.currentTarget.dataset.id
    this.data.activeID = activeID
    this.data.activeIndex = index
    this.setData({
      activeID: this.data.activeID,
      activeIndex: this.data.activeIndex
    })
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

  },
})
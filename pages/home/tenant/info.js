// pages/member/join/index.js
let Tenant = require("../../../service/tenant.js"),
  WxParse = require('../../wxParse/wxParse.js'),
  app = getApp(),
  util = require("../../../utils/util.js"),
  config = require("../../../utils/config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productData: {
      unionData: '1'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    new Tenant(res => {
      this.setData({
        productData: res.data
      })
      var unionData = res.data.unionData ? res.data.unionData.replace(/embed(?=\s+)/gi, 'video') : res.data.unionData;
      if (unionData != null) {
        WxParse.wxParse('unionData', 'html', unionData, that, 5);
      }
    }).view({
      id: options.tenantId
      // id: 349
    })
  },
  preview() {
    var that = this
    var imgArr = []
    imgArr.push(that.data.productData.businessLic)
    wx.previewImage({
      current: that.data.productData.businessLic, // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
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

  },

})
let app = getApp();
let util = require('../../utils/util.js');
let coupon = require('../../service/coupon.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {


  },


  onLoad: function (options) {
    var that = this;
    new coupon(function (data) {
      that.setData({
        data: data.data
      })
    }).list({
      // tenantId: wx.getStorageSync('tenantId') ? wx.getStorageSync('tenantId') : app.globalData.tenantId
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
  }



})
// pages/purse/cash/status.js
let config = require('../../../utils/config'),
  app = getApp(),
  util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var time = new Date().getTime() + 3 * 24 * 60 * 60 * 1000 //获取提交后三天的日期
    this.setData({
      month: new Date(time).getMonth() + 1,
      day: new Date(time).getDate(),
      moneyNum: options.moneyNum,
      fee: options.fee,
      tax: options.tax ? options.tax : 0
    })
  },
  goIndex: function() {
    wx.navigateBack({
      delta: 2
    })
  }
})
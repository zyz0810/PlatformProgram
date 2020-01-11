// pages/member/join/index.js
let Shelf = require("../../../service/shelf.js"),
  WxParse = require('../../wxParse/wxParse.js'),
  app = getApp(),
  util = require("../../../utils/util.js"),
  config = require("../../../utils/config.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    new Shelf(res => {
      this.setData({
        tenantData: res.data
      })
      var tenantIntroduce = res.data.tenantIntroduce ? res.data.tenantIntroduce.replace(/embed(?=\s+)/gi, 'video') : res.data.tenantIntroduce;
      if (tenantIntroduce != null) {
        WxParse.wxParse('tenantIntroduce', 'html', tenantIntroduce, that, 5);
      }
    }).tenant_info({
      tenantId: options.tenantId
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

  }

})
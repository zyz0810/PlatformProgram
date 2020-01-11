// pages/home/article/article.js
let kuaixun = require("../../../service/kuaixun.js"),
  WxParse = require('../../wxParse/wxParse.js'),
  config = require('../../../utils/config.js'),
  app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    article: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var baseUrl = config.BASE_URL
    let id = options.id
    let that = this;
    new kuaixun(function(data) {
      var article = data.data.content.replace(/embed(?=\s+)/gi, 'video');
      that.setData({
        title: data.data.title,
        article: data.data.content
      })
      wx.setNavigationBarTitle({
        title: data.data.title
      })
      WxParse.wxParse('article', 'html', article, that, 5);
    }).view({
      id: id ? id : 1038
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
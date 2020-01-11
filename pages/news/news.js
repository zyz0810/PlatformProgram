let news = require("../../service/news.js"),
  app = getApp(),
  util = require("../../utils/util.js")
// pages/home/news/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var tenantId = options.tenantId;
    var categoryId = options.categoryId;
    that.setData({
      tenantId: tenantId,
      categoryId: categoryId
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
  },

  gonewsView:function(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'view/view?id='+id,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    new news(function (data) {
      that.setData({
        newsList: data.data,
        pageModel: data.pageModel
      })
      if (data.data.length <= 10) {
        that.setData({
          tips: '没有更多啦~',
          showtips: false
        })
      }
    }).newsList({
      tenantId: that.data.tenantId,
      categoryId: that.data.categoryId,
      pageSize:10,
      pageNumber:1
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that=this;
    new news(function (data) {
      wx.stopPullDownRefresh();
      that.setData({
        newsList: data.data
      })
      if (data.data.length <= 10) {
        that.setData({
          tips: '没有更多啦~',
          showtips: false
        })
      }
    }).newsList({
      tenantId: that.data.tenantId,
      categoryId: that.data.categoryId,
      pageSize:10,
      pageNumber: 1
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    wx.showNavigationBarLoading();
    var pageModel = this.data.pageModel;
    var newsList = this.data.newsList;
    new news(function (data) {
      wx.hideNavigationBarLoading() //完成停止加载
      if (data.pageModel.totalPages < data.pageModel.pageNumber) {
        that.setData({
          tips: '没有更多啦~',
          showtips: false
        })
      } else {
        newsList = newsList.concat(data.data)
        that.setData({
          newsList: newsList,
          loading: false,
          tips: '努力加载中',
          showtips: false
        })
      }
    }).newsList({
      pageSize:10,
      pageNumber: ++pageModel.pageNumber,
      tenantId: app.globalData.tenantId
    });
  }
})
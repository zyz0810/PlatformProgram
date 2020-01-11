// pages/member/favorite/favorite.js
let app = getApp()
let Member = require('../../service/member.js')
let util = require('../../utils/util.js')
let __productListTemp = require('../../template/productList/productListTemp')
Page(Object.assign({},__productListTemp, {

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
    new Member(function (data) {

      var item = [];
      var collectList = data.data
      that.setData({
        collectList: collectList,
        pageModel: data.pageModel
      });
      if (data.data.length == 0) {
        that.setData({
          tips: '这里已经空空如也~',
          showtips: false
        })
      }
    }).productList({
      pageNumber: 1,
      pageSize: 6
      // tenantId: app.globalData.tenantId
    });
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
    var that = this;
    wx.showNavigationBarLoading();  //加载的状态
    new Member(function (data) {

      var item = [];
      var collectList = data.data
      that.setData({
        collectList: collectList,
        pageModel: data.pageModel
      });
      if (data.data.length == 0) {
        that.setData({
          tips: '',
          showtips: false
        })
      }
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()

    }).productList({
      pageNumber: 1,
      pageSize: 6
      // tenantId: app.globalData.tenantId
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

    wx.showNavigationBarLoading();
    var pageModel = this.data.pageModel;
    var collectList = this.data.collectList;
    new Member(function (data) {
      wx.hideNavigationBarLoading() //完成停止加载
      if (data.pageModel.totalPages < data.pageModel.pageNumber) {
        that.setData({
          tips: '',
          showtips: false
        })
      } else {
        collectList = collectList.concat(data.data)
        that.setData({
          collectList: collectList,
          loading: false,
          tips: '努力加载中',
          showtips: false
        })
      }
    }).productList({
      pageSize: 6,
      pageNumber: ++pageModel.pageNumber
      // tenantId: app.globalData.tenantId
    });
  }
}))

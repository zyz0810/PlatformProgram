
// pages/shelf/member.js.
let app = getApp();
let util = require('../../../utils/util.js');
let order = require('../../../service/order.js');
// pages/shelf/order/order.js
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
    new order(function (data) {
      that.setData({
        orderList: data.data,
        pageModel: data.pageModel
      })
      if (data.data.length == 0) {
        that.setData({
          tips: '没有更多啦~',
          showtips: false
        })
      }
    }).orderShelvesList({
      pageNumber: 1,
      pageSize: 8
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

  goOrderView:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shelf/orderDetail/orderDetail?id=' + id,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    new order(function (data) {
      wx.stopPullDownRefresh()
      that.setData({
        orderList: data.data,
        pageModel: data.pageModel
      })
      if (data.data.length == 0) {
        that.setData({
          tips: '没有更多啦~',
          showtips: false
        })
      }
    }).orderShelvesList({
      pageNumber: 1,
      pageSize: 8
    })
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

    wx.showNavigationBarLoading();
    var pageModel = this.data.pageModel;
    var orderList = this.data.orderList;
    new order(function (data) {
      wx.hideNavigationBarLoading() //完成停止加载
      if (data.pageModel.totalPages < data.pageModel.pageNumber) {
        that.setData({
          tips: '没有更多啦~',
          showtips: false
        })
      } else {
        orderList = orderList.concat(data.data)
        that.setData({
          orderList: orderList,
          loading: false,
          tips: '努力加载中',
          showtips: false
        })
      }
    }).orderShelvesList({
      pageSize: 6,
      pageNumber: ++pageModel.pageNumber,
      tenantId: app.globalData.tenantId
    });
  }
})
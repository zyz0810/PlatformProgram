// pages/pay/success.js
let app=getApp();
let order = require('../../service/order.js');
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
    var sn=options.sn;
    var that=this;
      new order(function(data){
        that.setData({
          sn:data.data.sn,
          memo: data.data.memo,
          createDate: data.data.createDate,
          amount: data.data.amount,
          tenantName: data.data.tenantName,
          discount: data.data.discount,
          paymentMethod: data.data.paymentMethod
        })
      }).paymentView({
        sn: sn
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})
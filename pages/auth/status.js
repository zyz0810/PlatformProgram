// pages/purse/auth/status.js
var app = getApp();
var util = require("../../utils/util.js");
var member = require("../../service/member.js");
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
      where: options.where
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
  goIndex: function(e) {
    if (e.detail.formId) {
      new member(res => {}).addFormId({
        formIds: e.detail.formId
      })
    }
    if (this.data.where == 'auth' || this.data.where == 'purse') {
      wx.navigateBack({})
    } else {
      wx.switchTab({
        url: '/pages/member/member',
      })
    }
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

  }
})
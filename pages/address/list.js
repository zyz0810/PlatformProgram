// pages/member/address/list.js
let app = getApp()
let Receiver = require('../../service/receiver.js')
let util = require('../../utils/util.js')
let config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainColor: '',
    list: [],
    isIphoneX: app.globalData.isIphoneX,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      page: options.page ? options.page : ''
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
    var that = this;
    if (app.globalData.LOGIN_STATUS) {
      this.getInfoWhenLogin()
    } else {
      app.loginOkCallback = res => {
        this.getInfoWhenLogin()
      }
    }
  },
  getInfoWhenLogin() {
    var that = this
    new Receiver(function(data) {

      var list = data.data
      for (var i = 0; i < list.length; i++) {
        list[i].name = list[i].consignee.substr(0,1);
      }
      that.setData({
        list: list,
        mainColor: app.globalData.mainColor
      })
    }).list()

  },
  goEdit: function(e) {
    util.navigateTo({
      url: 'edit?id=' + e.currentTarget.dataset.id,
    })
  },
  goAdd: function() {
    util.navigateTo({
      url: 'add',
    })
  },
  choose: function(e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var that = this
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      receiver: that.data.list[e.currentTarget.dataset.index]
    })
    // if (this.data.page == 'pay') {
    //   util.navigateTo({
    //     url: '../../pay/pay',
    //   })
    // } else {
      wx.navigateBack({
        delta: 1
      })
    // }
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
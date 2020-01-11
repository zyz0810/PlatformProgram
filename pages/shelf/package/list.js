// pages/shelf/package/list.js
let app = getApp(),
  Shelf = require("../../../service/shelf")
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
    if (app.globalData.LOGIN_STATUS) {
      this.getData(options)
    } else {
      app.loginOkCallbackList.push(() => {
        this.getData(options)
      })
    }
  },
  getData(options) {
    new Shelf(res => {
      this.setData({
        packageList: res.data,
        mainColor: app.globalData.mainColor
      })
    }).list({
      tenantId: options.tenantId,
      extensionId: options.extensionId ? options.extensionId : '',
      pageSize: 100
    })
  },
  goView(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'view?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  }
})
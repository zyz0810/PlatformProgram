let Order = require("../../../service/order")
let Shelf = require("../../../service/shelf")
let util = require("../../../utils/util")
let app = getApp()
Page(Object.assign({}, {

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    isPay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    this.setData({
      orderId: id
    })

  },

  //立即付款
  goPay: function(e) {
    var that = this
    wx.showLoading({
      title: '付款请求中',
    })
    if (this.data.isPay) {
      return
    }
    this.setData({
      isPay: true
    })
    setTimeout(function() {
      that.setData({
        isPay: false
      }, 2000)
    })
    var id = e.currentTarget.dataset.info;
    new Shelf(a => {
      new Order(submitData => {
        wx.hideLoading()
        wx.requestPayment({
          'timeStamp': submitData.data.timeStamp,
          'nonceStr': submitData.data.nonceStr,
          'package': submitData.data.package,
          'signType': submitData.data.signType,
          'paySign': submitData.data.paySign,
          'success': function(res) {
            wx.redirectTo({
              url: "/pages/pay/success?sn=" + a.data,
            })
          }
        })
      }).paymentSubmit({
        paymentPluginId: 'chinaumsPlatformAppletPayPlugin',
        sn: a.data
      })
    }).tradePayment({
      id: id
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
    new Shelf(res => {
      res.data.createDate = res.data.createDate ? util.formatTimeTwo(res.data.createDate, 'Y-M-D h:m:s') : ''
      res.data.payDate = res.data.payDate ? util.formatTimeTwo(res.data.payDate, 'Y-M-D h:m:s') : ''
      this.setData({
        data: res.data
      })
    }).shelvesOrderDetails({
      shelvesOrderId: this.data.orderId
    })
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

  },
}))
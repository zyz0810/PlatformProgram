let app = getApp()
let Member = require('../../service/member.js')
let coupon = require('../../service/coupon.js')
let util = require('../../utils/util.js')
let message = require('../../service/message.js')
let config = require('../../utils/config.js')
Page({
  data: {
    memberInfo: {},
    loading: true
  },
  onLoad: function (options) {
    if (app.globalData.LOGIN_STATUS) {
      this.getData(options)
    } else {
      app.loginOkCallbackList.push(() => {
        this.getData(options)
      })
    }
  },
  getData(options) {
    let that = this;
    let id = options.id;
    let username = options.username
    new coupon(function (data) {
      that.setData({
        isSatisfied: data.data.isSatisfied,
        getManList: data.data.list,
        couponCode: data.data.couponCode,
        desc: data.data.desc,
        loading: false
      })
    }).firstCoupon({
      id: id,
      username: username
    })
  },

  //去使用红包
  goUseCoupon: function () {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  onShow: function () {
    var that = this;

  }
})
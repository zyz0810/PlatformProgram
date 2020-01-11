let app = getApp();
let actionsheet = require("../../template/actionsheet/payactionsheet.js");
let util = require('../../utils/util.js');
let receiver = require('../../service/receiver.js');
let order = require('../../service/order.js');
let tenant = require('../../service/tenant.js');
let product = require('../../service/product.js');
Page(Object.assign({}, actionsheet, {
  data: {

  },
  init(options) {
    var that = this;
    var sn = options.sn;
    new order(function (res) {
      wx.hideLoading()
      that.ActionsheetShow(Object.assign({}, res.data, {
        closeJump: () => {
          wx.navigateBackMiniProgram()
        },
        successJump: '/pages/pay/success'
      }))
    }).paymentView({
      sn: sn
    })

  },
  onLoad: function (options) {
    if (app.globalData.LOGIN_STATUS) {
      this.init(options)
    } else {
      app.loginOkCallbackList.push(() => {
        this.init(options)
      })
    }
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  }
}))
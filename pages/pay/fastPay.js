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
    var scene = decodeURIComponent(options.scene);
    // var scene = '42479#A1111'
    // var scene = '25097#A1722'
    var id = scene.split("#")[0];
    var shelvesNo = scene.split("#")[1];
    new product(function (data) {
      that.setData({
        dataView: data.data
      })
    }).view({
      id: id
    })
    new order(function (data) {
      new order(function (a) {
        new order(function (res) {
          wx.hideLoading()
          that.ActionsheetShow(Object.assign({}, res.data, {
            closeJump: '/pages/index/index',
            successJump: '/pages/pay/success'
          }))
        }).paymentView({
          sn: a.data
        })
      }).payment({ sn: data.data })
    }).createShelbes({
      id: id,
      shelvesNo: shelvesNo,
      cartType: 'shelves'
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
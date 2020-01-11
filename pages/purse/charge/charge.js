//获取应用实例
let app = getApp();
let member = require('../../../service/member.js')
let order = require('../../../service/order.js')
let balance = require('../../../service/balance.js')
let util = require('../../../utils/util.js')
let config = require('../../../utils/config.js')
Page({
  data: {
    payShow: true,
    amount: '',
    isCharge: false
  },
  onLoad: function(info) {
    this.setData({
      mainColor: app.globalData.mainColor
    })
    var that = this;

  },

  onShow: function() {

  },

  amount: function(e) {
    this.setData({
      amount: e.detail.value
    })
  },

  //充值提交
  formSubmit: function(e) {
    let formId = e.detail.formId,
      that = this,
      isCharge = this.data.isCharge
    if (isCharge) {
      return
    }
    this.data.isCharge = true
    if (!that.data.amount) {
      util.errShow('请输入充值金额')
    } else {
      new balance(function(data) {
        var sn = data.data;
        new order(function(data) {
          wx.requestPayment({
            'timeStamp': data.data.timeStamp,
            'nonceStr': data.data.nonceStr,
            'package': data.data.package,
            'signType': data.data.signType,
            'paySign': data.data.paySign,
            'success': function(res) {
              that.data.isCharge = false
              wx.navigateBack({
                delta: 1
              })
            },
            'fail': function(res) {
              that.data.isCharge = false
            },
            'complete': function(res) {
              that.data.isCharge = false
            }
          })
        }).paymentSubmit({
          paymentPluginId: 'chinaumsPlatformAppletPayPlugin',
          sn: sn
        })
      }).fillWallet({
        amount: that.data.amount,
        formId: formId
      })
    }
  }

})
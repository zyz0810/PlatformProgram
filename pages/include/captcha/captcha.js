// pages/include/captcha/captcha.js

var member = require('../../../service/member.js')
var util = require('../../../utils/util');
var countdown = util.countdown//验证码计时;
//获取应用实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    focus: true,
    count: 60,
    tips: '发送验证码',
    codetype: '',
    receivePhone: ''
  },

  /**1
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var codetype = options.type;
    this.setData({
      codetype: options.type
    })


    //修改支付密码
    if (codetype == 'password') {
      wx.setNavigationBarTitle({
        title: '重置支付密码'
      })
      new member(function (data) {

        that.setData({
          receivePhone: data.data
        })
        countdown(that);
        wx.showToast({
          title: '发送成功',
          duration: 1000
        })
      }).resetPaySendCode({})

      //绑定银行卡发送验证码
    } else if (codetype == 'bank') {
      wx.setNavigationBarTitle({
        title: '绑定银行卡'
      });
      that.setData({
        bankInfoId: options.bankInfoId,
        cardNo: options.cardNo,
        name: options.name,
        phone: options.phone
      });
      new member(function (data) {

        that.setData({
          receivePhone: data.data
        })
        wx.showToast({
          title: '发送成功',
          duration: 1000
        })
      }).bindCardSendCode({
        mobile: that.data.phone
      })

    }
  },
  beFocus: function () {
    this.setData({
      focus: true
    })
  },
  codeInput: function (e) {
    var val = e.detail.value.toString();
    var that = this;
    this.setData({
      code: val
    })
    if (e.detail.value.length == 6) {

      //重置支付密码提交
      if (that.data.codetype == 'password') {
        new member(function (data) {

          wx.redirectTo({
            url: '/pages/password/password?captcha=' + that.data.code,
          })
        }, function (data) {
          if (data.message.type == 'error') {
            that.setData({
              code: ''
            })
          }
        }).resetPayCheckCode({
          captcha: that.data.code
        })

        //绑定银行卡提交
      } else if (that.data.codetype == 'bank') {
        new member(function (data) {

          wx.showToast({
            title: '添加成功',
            duration: 1000
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 3
            })
          }, 2000)

        }, function (data) {
          if (data.message.type == 'error') {
            that.setData({
              code: ''
            })
          }
        }).bindCard({
          captcha: that.data.code,
          cardNo: that.data.cardNo,
          bankInfoId: that.data.bankInfoId,
          name: that.data.name
        })
      }
    }
  },

  //重新发送验证码
  sendAgain: function () {
    var that = this;
    if (that.data.tips.indexOf('验证码') > -1) {
      if (that.data.codetype == 'password') {
        new member(function (data) {

          countdown(that);
          wx.showToast({
            title: '发送成功',
            duration: 1000
          })
        }).resetPaySendCode({})
      } else if (that.data.codetype == 'bank') {
        new member(function (data) {

          wx.showToast({
            title: '发送成功',
            duration: 1000
          })
        }).bindCardSendCode({
          mobile: that.data.phone
        })
      }
    }
  }



})
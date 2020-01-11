var app = getApp();
var util = require("../../utils/util.js");
var member = require('../../service/member.js');
var getPwd = require('../../utils/getPassword.js');
var password = require('../../service/common.js');

Page({
  data: {
    len: 0,
    pay: false,
    focus: false,
    captch: '',
    newPwd: '',
    newPwdCon: ''
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      captcha: options.captcha
    })
  },
  onShow: function () {

  },

  newPwd: function (e) {
    this.setData({
      newPwd: e.detail.value.trim()
    })
  },
  newPwdCon: function (e) {
    this.setData({
      newPwdCon: e.detail.value.trim()
    })
  },

  //提交修改密码
  submit: function () {
    var that = this;
    var sessionId = wx.getStorageSync('sessionId');
    var captch = that.data.captch;
    var pwd = that.data.newPwd;
    var pwdCon = that.data.newPwdCon;
    if (pwd == '' || pwdCon == '') {
      util.errShow("请输入密码");
      return false;
    } else if (pwd.length != 6 || isNaN(pwd)){
      util.errShow("密码应6位数");
      return false;
    } else if (pwd != pwdCon) {
      util.errShow("密码不一致");
      return false;
    }  else {
      getPwd(pwd, function (pwd) {
          new member(function (res) {
            wx.showToast({
              title: res.message.content,
              icon: 'success',
              duration: 1000,
              mask: true,
            });
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1200)
          }).resetPay({
            captcha: that.data.captcha,
            newPass: pwd
          })

      })
    }
  }
});

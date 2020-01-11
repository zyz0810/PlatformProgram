var app = getApp();
var util = require("../../utils/util.js");
var member = require("../../service/member.js");

Page({
  data: {
    zhengmian: 'http://cdn.laiyijia.com/upload/image/201904/ff0c8c58-bf26-4401-89bb-46a5a096f2da.png',
    fanmian: 'http://cdn.laiyijia.com/upload/image/201904/6f664167-628a-44fa-b591-c0e01382dad8.png',
    name: '',
    idCard: '',
    whereFrom: '',
    next: '下一步',
    backgroundBtn: 'default',
    bgBtn: '#9CE6BF'
  },
  onLoad: function(opt) {
    var that = this
    this.setData({
      where: opt.where ? opt.where : ''
    })

  },
  onShow: function() {

  },

  checkFillout() {
    if (this.data.name && this.data.idCard && this.data.fontUrl && this.data.backUrl) {
      this.setData({
        bgBtn: '#1AAD19'
      })
    } else {
      this.setData({
        bgBtn: '#9CE6BF'
      })
    }
  },
  //上传正面照片
  uploadzheng: function() {
    var that = this;
    util.getUrlAfterUpload(function(data, tempFilePaths) {
      console.log(data)
      that.setData({
        fontUrl: data,
        zhengmian: tempFilePaths
      })
      that.checkFillout()
    }, '', '', '', 'idcard')
  },

  //上传反面照片
  uploadfan: function() {
    var that = this;
    util.getUrlAfterUpload(function(data, tempFilePaths) {
      that.setData({
        backUrl: data,
        fanmian: tempFilePaths
      }, '', '', '', 'idcard')
      that.checkFillout()
    })
  },

  //输入姓名
  name: function(e) {
    this.setData({
      name: e.detail.value.trim()
    })
    this.checkFillout()
  },

  //输入证件号
  idCard: function(e) {
    this.setData({
      idCard: e.detail.value.trim()
    })
    this.checkFillout()
  },

  //实名认证提交
  submit: function(e) {
    var that = this;
    if (that.data.name == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写真实姓名'
      })
    } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(that.data.idCard))) {
      wx.showToast({
        icon: 'none',
        title: '证件号错误'
      })
    } else if (that.data.zhengmian == 'http://cdn.laiyijia.com/upload/image/201904/ff0c8c58-bf26-4401-89bb-46a5a096f2da.png') {
      wx.showToast({
        icon: 'none',
        title: '请上传身份证正面照片'
      })
    } else if (that.data.fanmian == 'http://cdn.laiyijia.com/upload/image/201904/6f664167-628a-44fa-b591-c0e01382dad8.png') {
      wx.showToast({
        icon: 'none',
        title: '请上传身份证反面照片'
      })
    } else {
      if (e.detail.formId) {
        new member(res => { }).addFormId({
          formIds: e.detail.formId
        })
      }
      new member(function(data) {
        wx.showToast({
          title: '提交成功，等待审核',
          icon: 'none',
        })
        setTimeout(function() {
          wx.redirectTo({
            url: 'status?where=' + that.data.where
          })
        }, 2000)
      }).idcardSave({
        name: that.data.name,
        idcard: that.data.idCard,
        pathFront: that.data.fontUrl,
        pathBack: that.data.backUrl
      })
    }
  }
});
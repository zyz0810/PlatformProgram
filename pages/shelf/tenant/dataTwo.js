//获取应用实例
var app = getApp()
var Member = require("../../../service/member.js")
var Shelf = require("../../../service/shelf.js")
var util = require("../../../utils/util")
var countdown = util.countdown //验证码计时
Page({
  data: {
    tips: '获取验证码',
    count: 60,
    formContent: {
      phone: '',
      code: '',
    },
  },
  onLoad: function(options) {
    this.setData({
      mainColor: app.globalData.mainColor
    })
    this.data.shelvesOrderId = options.shelvesOrderId
    this.data.linkman = options.linkman
    this.data.deliveryCenterName = options.deliveryCenterName
    this.data.areaId = options.areaId
    this.data.address = options.address
    this.data.pic = options.pic
    this.data.lng = options.lng
    this.data.lat = options.lat
  },

  onShow: function() {

  },


  //输入框变化
  bindChange: function(e) {
    var form = this.data.formContent;
    form[e.currentTarget.id] = e.detail.value.trim();
    this.setData({
      formContent: form
    })
  },

  //发送验证码
  getcode: function() {
    var that = this;
    if (!(/^1\d{10}$/.test(that.data.formContent.phone))) {
      util.errShow('手机号格式错误');
    } else {
      new Member(function() {
        countdown(that);
      }).sendMsgToBindPhone({
        mobile: that.data.formContent.phone
      })
    }
  },


  submit: function() { //提交
    var form = this.data.formContent
    var that = this
    if (!(/^1\d{10}$/.test(form.phone))) {
      util.errShow('手机号格式错误')
    } else if (form.code == '') {
      util.errShow('请输入验证码')
    } else if (!form.shelfQrcodeId) {
      wx.showToast({
        title: '请输入二维码编号',
        icon: 'none'
      })
    } else {
      new Shelf(function(res) {
        wx.showModal({
          title: '提示',
          content: '货架网点注册成功，审核结果会短信发送到您手机上。',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 3
                })
              })
            }
          }
        })

      }).confirmOrder({
        shelvesOrderId: that.data.shelvesOrderId,
        linkman: that.data.linkman,
        deliveryCenterName: that.data.deliveryCenterName,
        areaId: that.data.areaId,
        address: that.data.address,
        pic: that.data.pic,
        lng: that.data.lng,
        lat: that.data.lat,
        captcha: form.code,
        shelfQrcodeId: form.shelfQrcodeId,
        mobile: form.phone
      })
    }
  }
})
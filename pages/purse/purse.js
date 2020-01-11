let app = getApp();
let member = require('../../service/member.js')
let balance = require('../../service/balance.js')
let util = require('../../utils/util.js')
let config = require('../../utils/config.js')


Page({
  data: {
    balance: 0.00,
    freezeBalance: 0.00,
    authStatus: 'success',
    canClick: true
  },
  onLoad: function(options) {

  },
  onShow: function() {
    var that = this;
    new balance(function(data) {
      that.setData({
        balance: data.data.balance,
        freezeBalance: data.data.freezeBalance,
        mainColor: app.globalData.mainColor
      })
    }).balance()
    new member(res => {
      if (res.data.bindMobile != "binded") {
        wx.showModal({
          title: '提示',
          content: '为了您的账户资金安全，建议您绑定手机号！',
          cancelText: '暂不绑定',
          confirmText: '立即绑定',
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/bind/bind?where=purse',
              })
            }
          }
        })
      }
      this.setData({
        authStatus: res.data.authStatus,
        bindMobile: res.data.bindMobile
      })
    }).view()
  },

  //充值
  charge: function() {
    util.navigateTo({
      url: 'charge/charge',
    })
  },

  //提现
  goCash: function(e) {
    if (e.detail.formId) {
      new member(res => {}).addFormId({
        formIds: e.detail.formId
      })
    }
    var that = this
    if (!this.data.canClick) {
      return
    }
    this.data.canClick = false
    setTimeout(function() {
      that.data.canClick = true
    }, 2000)
    if (this.data.bindMobile != "binded") {
      // wx.showModal({
      //   title: '提示',
      //   content: '绑定手机后才可提现',
      //   cancelText: '暂不绑定',
      //   confirmText: '立即绑定',
      //   success: function(res) {
      //     if (res.confirm) {
      //       wx.navigateTo({
      //         url: '/pages/member/bind/bind?where=purse',
      //       })
      //     }
      //   }
      // })
      wx.navigateTo({
        url: '/pages/bind/bind?where=auth',
      })
    } else if (this.data.authStatus == 'success') {
      util.navigateTo({
        url: 'cash/cash',
      })
    } else if (this.data.authStatus == 'wait') {
      wx.showToast({
        title: '实名认证中，时间若过长请致电0551-63676688',
        icon: 'none'
      })
    } else if (this.data.authStatus == 'fail') {
      wx.showToast({
        title: '认证失败，请重新认证',
        icon: 'none'
      })
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/auth/auth?where=purse',
        })
      }, 2000)
    } else if (this.data.authStatus == 'none') {
      wx.showToast({
        title: '实名认证后才可提现',
        icon: 'none'
      })
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/auth/auth?where=purse',
        })
      }, 2000)
    }
  },
  //前往实名认证
  goAuth() {
    if (this.data.bindMobile != "binded") {
      // wx.showModal({
      //   title: '提示',
      //   content: '绑定手机后才可提现',
      //   cancelText: '暂不绑定',
      //   confirmText: '立即绑定',
      //   success: function(res) {
      //     if (res.confirm) {
      //       wx.navigateTo({
      //         url: '/pages/member/bind/bind?where=purse',
      //       })
      //     }
      //   }
      // })
      wx.navigateTo({
        url: '/pages/bind/bind?where=auth',
      })
    } else if (this.data.authStatus == 'wait') {
      wx.showToast({
        icon: 'none',
        title: '实名认证审核中，请耐心等待'
      })
    } else if (this.data.authStatus == 'fail') {
      wx.showToast({
        icon: 'none',
        title: '审核未通过，请重新提交审核'
      })
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/auth/auth?where=purse',
        })
      }, 2000)
    } else if (this.data.authStatus == 'none') {
      wx.navigateTo({
        url: '/pages/auth/auth?where=purse',
      })
    }
  },
  //银行卡
  toBankList: function() {
    if (this.data.authStatus == 'success') {
      util.navigateTo({
        url: '/pages/purse/bank/list/list',
      })
    } else if (this.data.authStatus == 'wait') {
      wx.showToast({
        title: '实名认证中，时间若过长请致电0551-63676688',
        icon: 'none'
      })
    } else if (this.data.authStatus == 'fail') {
      wx.showToast({
        title: '认证失败，请重新认证',
        icon: 'none'
      })
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/auth/auth?where=purse',
        })
      }, 2000)
    } else if (this.data.authStatus == 'none') {
      wx.showToast({
        title: '实名认证后可使用银行卡功能',
        icon: 'none'
      })
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/auth/auth?where=purse',
        })
      }, 2000)
    }
  },
  //账单
  toBill: function() {
    util.navigateTo({
      url: 'bill/bill',
    })
  },
  //冻结金额账单
  goFreezing() {
    util.navigateTo({
      url: 'freezeBill/bill',
    })
  }
});
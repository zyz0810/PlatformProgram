let app = getApp()
let Member = require('../../service/member.js')
let Cart = require('../../service/cart.js')
let coupon = require('../../service/coupon.js')
let util = require('../../utils/util.js')
let message = require('../../service/message.js')
let config = require('../../utils/config.js')
let navCart = require("../../template/cart/cart.js")
Page(Object.assign({}, navCart, {
  data: {
    memberInfo: {},
    showToggle: false
  },
  onLoad: function(options) {

  },
  getInfoWhenLogin() {
    let that = this;
    new Member(data => {
      this.setData({
        memberInfo: data.data
      })
    }).view({
      appid: config.APPID
    })

    new Cart(res => {
      if (res.data > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: res.data.toString()
        })
      } else if (res.data == 0) {
        wx.removeTabBarBadge({
          index: 2
        })
      }
    }).count()

    //收藏商品数量
    new Member(data => {
      this.setData({
        favoriteProductCout: data.data.length
      })
    }).productList({
      // tenantId: app.globalData.tenantId
    });

    //优惠券数量
    new coupon(data => {
      this.setData({
        couponLength: data.data.length
      })
    }).list({
      // tenantId: app.globalData.tenantId
    })

    //会员卡数量
    // new coupon(data => {
    //   this.setData({
    //     cardLength: data.data.cards.length
    //   })
    // }).cardlist({
    //   // tenantId: app.globalData.tenantId
    // })

    //未读消息数量
    new message(data => {
      var count = parseInt(data.data.account) + parseInt(data.data.message) + parseInt(data.data.order);
      this.setData({
        count: count
      })
    }).count()
  },
  // technical() {
  //   wx.navigateTo({
  //     url: '/pages/technical/technical',
  //   })
  // },
  onShow: function() {
    var that = this;
    if (app.globalData.LOGIN_STATUS) {
      this.getInfoWhenLogin()
    } else {
      app.loginOkCallback = res => {
        this.getInfoWhenLogin()
      }
    }
  },
  //我的钱包
  purse: function() {
    util.navigateTo({
      url: '/pages/purse/purse',
    })
  },
  //进收藏页面
  goFavorite: function() {
    util.navigateTo({
      url: '/pages/favorite/favorite',
    })
  },
  goAddress: function () {
    util.navigateTo({
      url: '/pages/address/list',
    })
  },
  //进入券包
  goCoupon: function() {
    util.navigateTo({
      url: '/pages/coupon/list',
    })
  },
  //进入微信会员卡
  // goMemberCard: function() {
  //   util.navigateTo({
  //     url: '/pages/card/list',
  //   })
  //   // if (!wx.canIUse('web-view')){
  //   //   util.errShow("微信版本不支持")
  //   //   return
  //   // }
  //   // util.navigateTo({
  //   //   url: '/pages/card/card',
  //   // })
  // },
  //进消息页面
  goMessage: function() {
    util.navigateTo({
      url: '/pages/message/index',
    })
  },
  //我的订单
  toOrder: function(e) {
    var id = e.currentTarget.dataset.current
    util.navigateTo({
      url: '/pages/order/order?id=' + id,
    })
    // wx.navigateToMiniProgram({
    //   appId: 'wx441dd0c007894173',
    //   path: 'pages/member/order/order?id=' + id + '&tenantId=' + app.globalData.tenantId,
    //   extraData: {},
    //   // envVersion: 'develop',
    //   success(res) {
    //     // 打开成功
    //     console.log(res)
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })
  },
  //收货地址
  chooseAddress: function() {
    try {
      wx.chooseAddress({
        success: function(res) {








        },
        fail: function(err) {

          if (err.errMsg.indexOf('auth') > -1) {
            wx.showModal({
              title: '提示',
              content: '未授予地址权限，是否前往设置',
              success: function(res) {
                if (res.confirm) {
                  wx.openSetting()
                }
              }
            })
          }
        }
      })
    } catch (e) {
      util.errShow('微信版本过低')
    }
  },

  //修改密码
  password: function() {
    if (this.data.memberInfo.bindMobile !== 'binded') {
      util.errShow('您还未绑定手机', 1000, function() {
        util.navigateTo({
          url: '/pages/bind/bind',
        })
      })
      return;
    }
    util.navigateTo({
      url: '/pages/include/captcha/captcha?type=password&title=修改支付密码',
    })
  },

  //绑定手机
  bindPhone: function() {
    if (this.data.memberInfo.bindMobile !== 'binded') {
      util.navigateTo({
        url: '/pages/bind/bind',
      })
    } else {

      util.errShow('您已绑定', 1500);
    }

  },

  //联系我们
  callUs: function() {
    wx.makePhoneCall({
      phoneNumber: '0551-67698098',
      success(res) {

      },
      fail(err) {
        if (err.errMsg.indexOf('cancel') === -1) {
          util.errShow('0551-67698098', 5000)
        }

      }
    })
  },
  
  //查看服务协议
  goAgreement() {
    util.navigateTo({
      url: '/pages/agreement/agreement',
    })
  },
  //实名认证
  goAuth() {
    if (this.data.memberInfo.authStatus == 'none' || this.data.memberInfo.authStatus == 'fail') {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    } else if (this.data.memberInfo.authStatus == 'wait') {
      wx.showToast({
        title: '认证中',
        icon: 'none'
      })
    } else if (this.data.memberInfo.authStatus == 'success') {
      wx.showToast({
        title: '已认证',
        icon: 'none'
      })
    }
  }

}))
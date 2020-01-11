const Order = require("../../../service/order")
const Member = require("../../../service/member")
const util = require("../../../utils/util")
const config = require('../../../utils/config')
const actionsheet = require("../../../template/actionsheet/payactionsheet.js")
const app = getApp()
Page(Object.assign({}, actionsheet, {

  /**
   * 页面的初始数据
   */
  data: {
    selectCoupon: {},
    availableCoupons: [],
    showCouponSelect: false,
    isSubmit: false,
    guideList: [], //导购列表
    guideSelected: {}, //已选择导购
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const shelvesNo = options.shelvesNo
    this.setData({
      shelvesNo
    })
    new Order(res => {
      let availableCoupons = res.data.order.trades[0].availableCoupons
      let selectCoupon = {}
      for (let i = 0; i < availableCoupons.length; i++) {
        if (availableCoupons[i].used) {
          selectCoupon = {
            title: availableCoupons[i].title,
            code: availableCoupons[i].code
          }
        }
      }
      var shelfName = res.data.order.trades[0].tenantName + '--' + options.shelvesNo
      this.setData({
        availableCoupons: availableCoupons,
        shelvsName: res.data.shelvsName,
        order: res.data.order,
        selectCoupon: selectCoupon,
        shelfName: shelfName
      })
    }).confirmOrderShelves({
      shelvesNo: shelvesNo,
      cartType: 'shelves',
      tenantId: wx.getStorageSync('tenantId') ? wx.getStorageSync('tenantId') : getApp().globalData.tenantId
    })
    // 获取导购信息
    new Member(res => {
      this.setData({
        guideList: res.data,
        guideSelected: res.data ? res.data[0] : ''
      })
    }).employeeShelves({
      shelvesNo: this.data.shelvesNo || wx.getStorageSync('shelvesNo'),
      cartType: 'shelves'
    })
  },
  //显示
  toogleCouponSelect() {
    this.setData({
      showCouponSelect: !this.data.showCouponSelect
    })
  },
  guideChange(e) {
    this.setData({
      guideSelected: this.data.guideList[e.detail.value]
    })
  },
  //选择优惠券
  selectCoupon(e) {
    let code = e.currentTarget.dataset.code,
      name = e.currentTarget.dataset.name,
      codes = [];
    codes.push(code);
    this.setData({
      selectCoupon: {
        code: code ? code : '',
        title: name ? name : (code ? '已使用' : '未使用')
      },
      showCouponSelect: false,
      codes: codes
    })
    new Order(res => {
      this.setData({
        "order.amount": res.data.trades[0].amount
      })
    }).calculateShelves({
      shelvesNo: this.data.shelvesNo,
      codes: [this.data.selectCoupon.code],
      cartType: 'shelves'
    })
  },
  submit(e) {
    new Member(res => {

    }).addFormId({
      formIds: e.detail.formId
    })
    let that = this
    if (that.data.isSubmit) {
      return
    }

    wx.showModal({
      title: '货架取货提醒',
      content: '请确认是否从门店货架现场取走货物?',
      success: function(res) {
        if (res.cancel) {
          that.setData({
            isSubmit: false
          })
        } else if (res.confirm) {
          wx.showLoading({
            title: '付款请求中',
          })
          that.setData({
            isSubmit: true
          })
          new Order(data => {
            if (data.data === null) {
              wx.hideLoading()
              util.errShow('订单已失效')
              return
            }
            if (that.data.amount == '0') {
              wx.hideLoading()
              wx.redirectTo({
                url: '/pages/pay/payZero?sn=' + data.data,
              })
            } else {
              new Order(function(a) {
                //存储导购为永久推广人
                new Member(res => {
                  wx.setStorageSync('extension', that.data.guideSelected ? that.data.guideSelected.id : '')
                }).saveShelf({
                  appId: config.APPID,
                  shelfNo: '',
                  extensionId: that.data.guideSelected ? that.data.guideSelected.id : ''
                })
                new Order(submitData => {
                  wx.hideLoading()
                  wx.requestPayment({
                    'timeStamp': submitData.data.timeStamp,
                    'nonceStr': submitData.data.nonceStr,
                    'package': submitData.data.package,
                    'signType': submitData.data.signType,
                    'paySign': submitData.data.paySign,
                    'success': function(res) {
                      wx.redirectTo({
                        url: "/pages/pay/success?sn=" + a.data,
                      })
                    },
                    'fail': function() {
                      wx.redirectTo({
                        url: "/pages/order/order",
                      })
                    }
                  })
                }).paymentSubmit({
                  paymentPluginId: 'chinaumsPlatformAppletPayPlugin',
                  sn: a.data
                })
              }).payment({
                sn: data.data
              })
            }
          }).createShelves({
            codes: [that.data.selectCoupon.code ? that.data.selectCoupon.code : ''],
            shelvesNo: that.data.shelvesNo,
            cartType: 'shelves',
            extensionId: that.data.guideSelected.id || ''
          })
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
}))
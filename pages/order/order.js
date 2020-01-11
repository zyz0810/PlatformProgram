//获取应用实例
var app = getApp()
var Order = require('../../service/order')
var member = require('../../service/member')
var util = require('../../utils/util')
var actionsheet = require('../../template/actionsheet/actionsheet')
var payTemp = require("../../template/password/payPassword")
var Balance = require("../../service/balance")
var getPwd = require("../../utils/getPassword")
var util = require("../../utils/util")

Page(Object.assign({}, actionsheet, payTemp, {
  data: {
    winHeight: 0, //设备高度度
    all: [], //全部
    unpaid: [], //待支付
    unreciver: [], //待签收
    unreview: [], //待评价
    unshipped: [], //待发货
    currentTab: 0, //显示全部
    allTips: '下拉刷新',
    unpaidTips: '下拉刷新',
    unreciverTips: '下拉刷新',
    unreviewTips: '下拉刷新',
    unshippedTips: '下拉刷新',
    sType: ['all', 'unpaid', 'unshipped', 'unreciver', 'unreview'],
    scroll: [0, 0, 0, 0, 0],
    isIphoneX: app.globalData.isIphoneX,
  },
  technical: function () {
    wx.navigateTo({
      url: '/pages/technical/index',
    })
  },
  bindChange: function (e) { //滑动选项卡
    var that = this;
    if (app.globalData.LOGIN_STATUS) {
      this.setData({
        mainColor: app.globalData.mainColor,
        currentTab: e.detail.current
      });
      let index = this.data.currentTab,
        sTypeList = this.data.sType
      paging(this, sTypeList[index], 'up', function () {
        wx.stopPullDownRefresh()
      })
    } else {
      app.loginOkCallback = res => {
        this.setData({
          mainColor: app.globalData.mainColor,
          currentTab: e.detail.current
        });
        let index = this.data.currentTab,
          sTypeList = this.data.sType
        paging(this, sTypeList[index], 'up', function () {
          wx.stopPullDownRefresh()
        })
      }
    }

  },
  swichNav: function (e) { //点击选项卡
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
      let index = this.data.currentTab,
        sTypeList = this.data.sType
      paging(this, sTypeList[index], 'up', function () {
        wx.stopPullDownRefresh()
      })
    }
  },
  touchstart: function (e) {
    this.data.startTouches = e.changedTouches[0]
  },
  touchmove: function (e) {
    this.data.moveTouches = e.changedTouches[0]
  },
  touchend: function (e) {
    let index = this.data.currentTab,
      sTypeList = this.data.sType,
      startTouch = this.data.startTouches,
      Y = e.changedTouches[0].pageY - startTouch.pageY,
      X = Math.abs(e.changedTouches[0].pageX - startTouch.pageX)

    if (this.data.scroll[index] > 10) {
      return false
    }
    this.data.endTouches = e.changedTouches[0]
    if (Y > 50 && X < 200) {
      if (wx.startPullDownRefresh) {
        wx.startPullDownRefresh()
        paging(this, sTypeList[index], 'up', function () {
          wx.stopPullDownRefresh()
        })
      } else {
        wx.showLoading({
          title: '加载中...',
        })
        paging(this, sTypeList[index], 'up', function () {
          wx.hideLoading()
        })
      }
    }
  },
  onPullDownRefresh() {
    // let index = this.data.currentTab,
    //   sTypeList = this.data.sType
    // paging(this, sTypeList[index], 'up', function() {
    //   wx.stopPullDownRefresh()
    // })
  },
  scroll: function (e) {
    let index = this.data.currentTab
    this.data.scroll[index] = e.detail.scrollTop
  },
  lower: function () {
    var index = this.data.currentTab
    var sTypeList = this.data.sType
    paging(this, sTypeList[index], 'down')
  },
  onLoad: function (options) { //页面加载

    var that = this;
    var id = options.id ? options.id : 0
    var systemInfo = wx.getSystemInfoSync()
    this.ActionsheetSet({
      item: [{
        name: '支付类型',
        content: '转账',
        more: false,
        fn: '',
        index: 0,
        data: null
      },
      {
        name: '付款方式',
        content: '微信支付',
        more: true,
        fn: 'changeMethod',
        index: 1,
        data: null
      }
      ]
    })

    this.PayTempSet({
      iconFn: 'returnChangeMethod'
    })
    this.setData({
      currentTab: id,
      winHeight: systemInfo.windowHeight
    })
    // var id = that.data.currentTab
    // paging(that, that.data.sType[id], 'up', function() {
    //   for (var i = 0; i < that.data.sType.length; i++) {
    //     if (i == id) {
    //       continue
    //     }
    //     paging(that, that.data.sType[i], 'up')
    //   }
    // })
  },
  onShow() {
    var that = this
    var sType = this.data.sType[this.data.currentTab]
    var tips = that.data[sType + 'Tips']
    var info = []
    if (this.pageModel[sType].pageNumber > 1) {
      new Order(function (data) {
        // that.pageModel[sType].totalPages = data.pageModel.totalPages
        info = info.concat(data.data)
        that.setData({
          [sType + 'Tips']: '',
          [sType]: info
        })
      }).list({
        type: sType,
        pageNumber: 1,
        pageSize: that.pageModel[sType].pageSize * that.pageModel[sType].pageNumber
      })
    } else {
      if (app.globalData.LOGIN_STATUS) {
        this.setData({
          mainColor: app.globalData.mainColor
        })
        paging(that, sType, 'up')
      } else {
        app.loginOkCallback = res => {
          this.setData({
            mainColor: app.globalData.mainColor
          })
          paging(that, sType, 'up')
        }
      }
    }
    // var id = that.data.currentTab
    // paging(that, that.data.sType[id], 'up', function() {
    //   for (var i = 0; i < that.data.sType.length; i++) {
    //     if (i == id) {
    //       continue
    //     }
    //     paging(that, that.data.sType[i], 'up')
    //   }
    // })
  },
  PayTempSuccess(val) {
    var that = this
    var sTypeList = this.data.sType
    var index = this.data.currentTab
    var sn = this.ActionsheetGetItem(1).sn
    wx.showToast({
      title: '支付请求中',
      icon: 'loading',
      mask: true,
      duration: 50000
    })
    getPwd(val, function (pwd) {
      new Order(function (data) {
        wx.showToast({
          title: data.message.content,
          icon: 'success'
        })
        setTimeout(() => {
          util.navigateTo({
            url: '/pages/pay/success?sn=' + sn
          })
        }, 500)
        paging(that, sTypeList[index], 'up')
        that.PayTempClose()
      }, function () {
        that.PayTempClear()
      }).paymentSubmit({
        paymentPluginId: 'balancePayPlugin',
        enPassword: pwd,
        sn: sn
      })
    })
  },
  returnChangeMethod() {
    this.PayTempClose()
    this.ActionsheetShow()
  },
  changeMethod() { //修改支付方式
    var data = ['微信支付', '余额支付'],
      that = this
    wx.showActionSheet({
      itemList: data,
      success: function (res) {
        if (typeof res.tapIndex !== 'undefined') {
          that.ActionsheetSetItem({
            fn: 'changeMethod',
            content: data[res.tapIndex],
            more: true,
            data: {
              type: res.tapIndex == 0 ? 'chinaumsPlatformAppletPayPlugin' : 'balancePayPlugin',
              sn: that.ActionsheetGetItem(1).sn
            }
          }, 1)
        }
      },
      fail: function (res) {
        that.ActionsheetSetItem({
          content: data[0]
        }, 1)
      }
    })
  },
  weixinPayCanClick: true,
  actionsheetConfirm(e) { //弹框确定
    var selectData = this.ActionsheetGetItem(1)
    var that = this
    var bindex = this.data.delList
    var sTypeList = this.data.sType
    var index = this.data.currentTab
    if (selectData.type == 'chinaumsPlatformAppletPayPlugin') {
      if (!this.weixinPayCanClick) {
        return
      }
      that.weixinPayCanClick = false
      wx.showLoading({
        title: '支付请求中',
        icon: 'none'
      })
      new Order(function (data) {
        wx.hideLoading()
        if (data.data) {
          wx.requestPayment({
            'timeStamp': data.data.timeStamp,
            'nonceStr': data.data.nonceStr,
            'package': data.data.package,
            'signType': data.data.signType,
            'paySign': data.data.paySign,
            'success': function (res) {
              that.weixinPayCanClick = true
              paging(that, sTypeList[index], 'up')
              that.ActionsheetHide()

              var data = that.data
              data[sTypeList[index]][bindex].finalOrderStatus.status = 'refund'
              data[sTypeList[index]][bindex].finalOrderStatus.desc = '取消订单'
              that.setData(data)
              if (index == 1) { //代付款tab页面取消订单，从当前页删除当前订单
                var unpaidList = that.data.unpaid
                unpaidList.splice(bindex, 1)
                that.setData({
                  unpaid: unpaidList
                })
              }

            },
            'fail': function (res) {
              that.weixinPayCanClick = true

            },
            'complete': function () {
              that.weixinPayCanClick = true
            }
          })
        } else {
          wx.showToast({
            title: '支付参数获取失败',
            duration: 2000,
            icon: 'none'
          })
          that.weixinPayCanClick = true
        }
      }, function () {
        wx.hideLoading()
        wx.showToast({
          title: '支付参数获取失败',
          duration: 2000,
          icon: 'none'
        })
      }).paymentSubmit({
        paymentPluginId: 'chinaumsPlatformAppletPayPlugin',
        sn: selectData.sn
      })
      return
    }
    this.ActionsheetHide()
    this.PayTempShow()
  },

  //用于表单提交模板推送
  formSubmit(e) {

    var formId = e.detail.formId;
    var info = e.detail.target.dataset.info
    var sTypeList = this.data.sType
    var index = this.data.currentTab
    var that = this
    wx.showToast({
      title: '信息获取中',
      icon: 'loading',
      duration: 50000
    })
    new Order((res) => {
      new Order((data) => {
        wx.hideToast()
        that.ActionsheetSet({
          "header": "￥" + data.data.amount.toFixed(2)
        })
        that.ActionsheetSetItem({
          content: data.data.memo
        }, 0)
        that.ActionsheetSetItem({
          fn: data.data.useBalance ? 'changeMethod' : '',
          content: '微信支付',
          more: data.data.useBalance,
          data: {
            type: 'chinaumsPlatformAppletPayPlugin',
            sn: res.data
          }
        }, 1)
        that.ActionsheetShow()
      }).paymentView({
        sn: res.data
      })
    }).tradePayment({
      id: info,
      formId: formId
    })
  },
  goScan() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //订单底部操作按钮（传formid模式）
  orederMethodBtn(e) {
    if (e.detail.formId) {
      new member(res => { }).addFormId({
        formIds: e.detail.formId
      })
    }
    var that = this
    var info = e.detail.target.dataset.info
    var bindex = e.detail.target.dataset.index
    this.setData({
      delList: bindex
    })
    var opType = e.detail.target.dataset.type
    var sTypeList = this.data.sType
    var index = this.data.currentTab
    if (!opType || !info) return
    switch (opType) {
      case 'waitpay':
        wx.showToast({
          title: '信息获取中',
          icon: 'loading',
          duration: 50000
        })
        new Order((res) => {
          new Order((data) => {
            wx.hideToast()
            that.ActionsheetSet({
              "header": "￥" + data.data.amount.toFixed(2)
            })
            that.ActionsheetSetItem({
              content: data.data.memo
            }, 0)
            that.ActionsheetSetItem({
              fn: data.data.useBalance ? 'changeMethod' : '',
              content: '微信支付',
              more: data.data.useBalance,
              data: {
                type: 'chinaumsPlatformAppletPayPlugin',
                sn: res.data
              }
            }, 1)
            that.ActionsheetShow()
          }).paymentView({
            sn: res.data
          })
        }).tradePayment({
          id: info,
          formId: e.detail.formId
        })
        break;
      case 'refundWaitPay': //取消未付款订单
        wx.showModal({
          title: '提示',
          content: '是否确认取消该订单',
          success: function (res) {
            if (res.confirm) {
              new Order((data) => {
                wx.showToast({
                  title: data.message.content,
                  icon: 'success',
                  duration: 1000
                })
                var data = that.data
                data[sTypeList[index]][bindex].finalOrderStatus.status = 'cancelled'
                data[sTypeList[index]][bindex].finalOrderStatus.desc = '已取消'
                that.setData(data)
                if (index == 1) { //代付款tab页面取消订单，从当前页删除当前订单
                  var unpaidList = that.data.unpaid
                  unpaidList.splice(bindex, 1)
                  that.setData({
                    unpaid: unpaidList
                  })
                }
              }).refund({
                id: info
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 'refund': //取消订单
        wx.showModal({
          title: '提示',
          content: '是否确认取消该订单',
          success: function (res) {
            if (res.confirm) {
              new Order((data) => {
                wx.showToast({
                  title: data.message.content,
                  icon: 'success',
                  duration: 1000
                })
                var data = that.data
                data[sTypeList[index]][bindex].finalOrderStatus.status = 'waitReturn'
                data[sTypeList[index]][bindex].finalOrderStatus.desc = '待退货'
                that.setData(data)
              }).refund({
                id: info
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 'return': //退货
        wx.showModal({
          title: '提示',
          content: '是否确认申请退货',
          success: function (res) {
            if (res.confirm) {
              new Order((data) => {
                wx.showToast({
                  title: data.message.content,
                  icon: 'success',
                  duration: 1000
                })
                var data = that.data
                data[sTypeList[index]][bindex].finalOrderStatus.status = 'waitReturn'
                data[sTypeList[index]][bindex].finalOrderStatus.desc = '待退款'
                that.setData(data)
              }).return({
                id: info
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 'confirm': //签收
        wx.showModal({
          title: '提示',
          content: '是否确认收货',
          success: function (res) {
            if (res.confirm) {
              new Order((data) => {
                wx.showToast({
                  title: data.message.content,
                  icon: 'success',
                  duration: 1000
                })
                var data = that.data
                data[sTypeList[index]][bindex].finalOrderStatus.status = 'toReview'
                data[sTypeList[index]][bindex].finalOrderStatus.desc = '已签收'
                that.setData(data)
              }).confirm({
                id: info
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 'remind': //提醒卖家发货/退货
        new Order((data) => {
          wx.showToast({
            title: '已提醒',
            icon: 'success',
            duration: 1000
          })
        }).remind({
          id: info
        })
        break;
      case 'evaluate': // 前去评价
        util.navigateTo({
          url: 'orderEvaluate/orderEvaluate?id=' + info,
        })
        break;
      case 'logistics':
        var name = e.detail.target.dataset.name
        var cname = e.detail.target.dataset.cname
        var no = e.detail.target.dataset.no
        var phone = e.detail.target.dataset.phone.substr(e.detail.target.dataset.phone.length - 4)
        util.navigateTo({
          url: '/pages/order/logistics/logistics?no=' + no + '&name=' + name + '&phone=' + phone + '&cname=' + cname,
        })
        break;
    }
  },
  methodBtn(e) {
    var info = e.currentTarget.dataset.info
    var bindex = e.currentTarget.dataset.index
    var opType = e.currentTarget.dataset.type
    var sTypeList = this.data.sType
    var index = this.data.currentTab
    var that = this
    if (!opType || !info) return
    switch (opType) {
      case 'refundWaitPay': //取消未付款订单
        wx.showModal({
          title: '提示',
          content: '是否确认取消该订单',
          success: function (res) {
            if (res.confirm) {
              new Order((data) => {
                wx.showToast({
                  title: data.message.content,
                  icon: 'success',
                  duration: 1000
                })
                var data = that.data
                data[sTypeList[index]][bindex].finalOrderStatus.status = 'cancelled'
                data[sTypeList[index]][bindex].finalOrderStatus.desc = '已取消'
                that.setData(data)
                if (index == 1) { //代付款tab页面取消订单，从当前页删除当前订单
                  var unpaidList = that.data.unpaid
                  unpaidList.splice(bindex, 1)
                  that.setData({
                    unpaid: unpaidList
                  })
                }
                // paging(that, sTypeList[index], 'up')
              }).refund({
                id: info
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 'refund': //取消订单
        wx.showModal({
          title: '提示',
          content: '是否确认取消该订单',
          success: function (res) {
            if (res.confirm) {
              new Order((data) => {
                wx.showToast({
                  title: data.message.content,
                  icon: 'success',
                  duration: 1000
                })
                var data = that.data
                data[sTypeList[index]][bindex].finalOrderStatus.status = 'waitReturn'
                data[sTypeList[index]][bindex].finalOrderStatus.desc = '待退货'
                that.setData(data)
                // paging(that, sTypeList[index], 'up')
              }).refund({
                id: info
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 'return': //退货
        wx.showModal({
          title: '提示',
          content: '是否确认申请退货',
          success: function (res) {
            if (res.confirm) {
              new Order((data) => {
                wx.showToast({
                  title: data.message.content,
                  icon: 'success',
                  duration: 1000
                })

                var data = that.data
                data[sTypeList[index]][bindex].finalOrderStatus.status = 'waitReturn'
                data[sTypeList[index]][bindex].finalOrderStatus.desc = '待退款'
                that.setData(data)

                // paging(that, sTypeList[index], 'up')
              }).return({
                id: info
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 'confirm': //签收
        wx.showModal({
          title: '提示',
          content: '是否确认收货',
          success: function (res) {
            if (res.confirm) {
              wx.showLoading({
                title: '签收中',
                mask: true
              })
              new Order((data) => {
                wx.hideLoading()
                wx.showToast({
                  title: data.message.content,
                  icon: 'success',
                  duration: 1000
                })
                var data = that.data
                data[sTypeList[index]][bindex].finalOrderStatus.status = 'toReview'
                data[sTypeList[index]][bindex].finalOrderStatus.desc = '已签收'
                that.setData(data)

                // paging(that, sTypeList[index], 'up')
              }).confirm({
                id: info
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 'remind': //提醒卖家发货/退货
        new Order((data) => {
          wx.showToast({
            title: data.message.content,
            icon: 'success',
            duration: 1000
          })
        }).remind({
          id: info
        })
        break;
      case 'evaluate': // 前去评价
        util.navigateTo({
          url: 'orderEvaluate/orderEvaluate?id=' + info,
        })
        break;
      case 'logistics':
        console.log(121)
        var name = e.currentTarget.dataset.name
        var cname = e.currentTarget.dataset.cname
        var no = e.currentTarget.dataset.no
        var phone = e.currentTarget.dataset.phone.substr(e.currentTarget.dataset.phone.length - 4)
        util.navigateTo({
          url: '/pages/order/logistics/logistics?no=' + no + '&name=' + name + '&phone=' + phone + '&cname=' + cname,
        })
        break;
    }
  },
  pageModel: {
    'all': {
      pageNumber: 0,
      pageSize: 5,
      totalPages: 999
    },
    'unpaid': {
      pageNumber: 0,
      pageSize: 5,
      totalPages: 999
    },
    'unshipped': {
      pageNumber: 0,
      pageSize: 5,
      totalPages: 999
    },
    'unreciver': {
      pageNumber: 0,
      pageSize: 5,
      totalPages: 999
    },
    'unreview': {
      pageNumber: 0,
      pageSize: 5,
      totalPages: 999
    }
  }
}))

function paging(that, sType, direction, cb) {
  var tips = that.data[sType + 'Tips']
  var info = that.data[sType]
  if (direction == 'up') {
    info = []
  }
  if (direction !== 'up' && that.pageModel[sType].pageNumber + 1 > that.pageModel[sType].totalPages) {
    return
  }
  that.setData({
    [sType + 'Tips']: '加载中...'
  })
  new Order(function (data) {
    that.pageModel[sType].totalPages = data.pageModel.totalPages
    if (data.pageModel.totalPages == 0) {
      that.setData({
        // [sType + 'Tips']: '您还没有相关的订单！',
        [sType + 'Tips']: '',
        [sType]: [],
        [sType + 'load']: true
      })
      cb ? cb() : ''
      return
    }
    info = info.concat(data.data)
    if (data.pageModel.totalPages <= data.pageModel.pageNumber) {
      that.setData({
        [sType + 'Tips']: '',
        [sType]: info,
        [sType + 'load']: true
      })
      if (data.pageModel.totalPages < data.pageModel.pageNumber) {
        cb ? cb() : ''
        return
      }
    } else {
      that.setData({
        [sType + 'Tips']: "上拉加载",
        [sType]: info,
        [sType + 'load']: true
      })
    }
    cb ? cb() : ''
  }).list({
    type: sType,
    pageNumber: direction == 'up' ? that.pageModel[sType].pageNumber = 1 : ++that.pageModel[sType].pageNumber,
    pageSize: that.pageModel[sType].pageSize
  })
}
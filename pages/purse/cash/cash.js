// pages/purse/cash/index.js
let member = require('../../../service/member.js')
let balance = require('../../../service/balance.js')
let getPwd = require('../../../utils/getPassword.js')
let util = require('../../../utils/util.js')
let config = require('../../../utils/config.js')
let payTemp = require("../../../template/password/payPassword")
Page(Object.assign({}, payTemp, {

  /**
   * 页面的初始数据
   */
  data: {
    actionSheet: false,
    moneyNum: '',
    fee: 0,
    tax:0
  },
  onLoad: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    new member(function(data) {
      that.setData({
        mybank: data.data,
        cardId: data.data.length > 0 ? data.data[0].id : ''
      })
      if (!that.data.mybank.length > 0) {
        wx.hideToast()
        wx.showModal({
          title: '',
          content: '请先绑定银行卡后才可提现',
          cancelText: '不了',
          confirmText: '前去绑定',
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/purse/bank/add/add'
              })
            } else {
              wx.navigateBack({})
            }
          }
        })
      }
    }).bankList()
    new balance((data) => {
      this.setData({
        cash: parseFloat(data.data.balance),
        cashedMoney: Number(data.data.monthlyWithdrawalAmount),
        feelv: data.data.withdrawRate
      })
    }).balance()
  },
  choose: function() {
    this.setData({
      actionSheet: true
    })
  },
  close: function() {
    this.setData({
      actionSheet: false
    })
  },
  cashMoney: function(e) {
    var cash = this.data.cash
    this.setData({
      moneyNum: e.detail.value
    })
    this.calculateFee(e.detail.value)
  },
  totalCash: function() {
    var cash = this.data.cash
    this.setData({
      moneyNum: cash
    })
    this.calculateFee(cash)
  },
  chooseCard: function(e) {
    var cardId = e.currentTarget.dataset.id
    this.setData({
      cardId: cardId,
      actionSheet: false
    })
  },
  addCard: function() {
    util.navigateTo({
      url: '/pages/purse/bank/add/add'
    })
  },
  //点击提现按钮
  cashBtn: function(e) {
    if (e.detail.formId) {
      new member(res => {}).addFormId({
        formIds: e.detail.formId
      })
    }
    var that = this
    if (that.data.moneyNum < 2) {
      util.errShow('提现金额需大于2元')
      return
    } else if ((Number(that.data.moneyNum) + Number(that.data.cashedMoney)) > 800) {
      var tax = that.data.cashedMoney > 800 ? Number(that.data.moneyNum) * 0.2 : (Number(that.data.moneyNum) + Number(that.data.cashedMoney) - 800) * 0.2
      this.setData({
        tax: tax
      })
      wx.showModal({
        title: '提示',
        content: '当月提现金额已累计超800，本次提现预计将扣取税费' + tax + '元，建议您银联入网或下月再进行提现',
        cancelText: '下月提现',
        confirmText: '继续提现',
        success: function(res) {
          if (res.confirm) {
            that.PayTempShow()
            that.PayTempSet({
              price: that.data.moneyNum
            })
          }
        }
      })
    } else {
      this.PayTempShow()
      this.PayTempSet({
        price: that.data.moneyNum
      })
    }
  },
  //计算提现手续费
  calculateFee(money) {
    this.setData({
      fee: Math.floor(money * this.data.feelv * 100) / 100
    })
  },
  //密码框输入完毕
  PayTempSuccess(val) {
    var that = this
    wx.hideKeyboard();
    wx.showToast({
      title: '- 请求中 -',
      icon: 'loading',
      duration: 20000,
      mask: true
    })
    getPwd(val, function(pwd) {
      new balance(function(res) {
        wx.hideToast()
        wx.showToast({
          title: '提现成功',
          icon: 'success',
          duration: 1000,
          mask: true,
        });
        that.PayTempClose()
        new balance((data) => {
          that.setData({
            cash: Number(data.data.balance),
            moneyNum: ''
          })
        }).balance()
        util.navigateTo({
          url: 'status?moneyNum=' + that.data.moneyNum + '&fee=' + that.data.fee + '&tax=' + that.data.tax
        })
      }, function(data) {
        that.PayTempClear()
      }).cashBank({
        memberBankId: that.data.cardId,
        amount: that.data.moneyNum,
        enPassword: pwd
      })
    })
  }
}))
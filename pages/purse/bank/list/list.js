let app = getApp();
let member = require('../../../../service/member.js')
let balance = require('../../../../service/balance.js')
let util = require('../../../../utils/util.js')
let config = require('../../../../utils/config.js')

Page({
  data: {
    bankInfoList: [],
    showNoneCard: false,
    isIphoneX: app.globalData.isIphoneX,
  },
  onLoad: function() {

  },
  onShow: function() {
    var that = this;
    new member(function(data) {

      if (data.data.length == 0) {
        that.setData({
          showNoneCard: true
        })
      } else {
        that.setData({
          showNoneCard: false
        })
      }
      that.setData({
        bankInfoList: data.data
      })
    }).bankList()

  },

  //删除银行卡
  deleteCard: function(e) {
    var cardId = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '',
      content: '确认删除该银行卡？',
      success: function(res) {
        if (res.confirm) {
          new member(function(res) {
            new member(function(data) {
              if (data.data.length == 0) {
                that.setData({
                  showNoneCard: true
                })
              } else {
                that.setData({
                  showNoneCard: false
                })
              }
              that.setData({
                bankInfoList: data.data
              })
            }).bankList()
          }).deleteCard({
            id: cardId
          })
        }
      }
    })
  },


  //添加银行卡
  addBank: function() {
    util.navigateTo({
      url: '/pages/purse/bank/add/add',
    })
  }


});
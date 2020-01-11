let app = getApp();
let member = require('../../../service/member.js')
let balance = require('../../../service/balance.js')
let util = require('../../../utils/util.js')
let config = require('../../../utils/config.js')
let countdown = util.countdown
let shareGetTime = util.shareGetTime
let Bill = require("../../../service/balance.js")

Page({
  data: {
    billList: '',
    pageModel: {},
    loading: true,
    tips: '没有更多账单啦~'
  },
  onLoad: function() {
    var that = this;
    //获取当前的年月日
    new balance(res => {
      that.setData({
        billList: res.data,
        pageModel: res.pageModel
      });
    }).freezeBalance({
      // tenantId: wx.getStorageSync('tenantIdNow'),
      pageSize: 20,
      pageNumber: 1
    })
  },
  onShow: function() {

  },

  //下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    wx.showNavigationBarLoading(); //加载的状态
    //默认加载当前月份的账单明细
    new balance(function(res) {
      wx.stopPullDownRefresh()
      that.setData({
        billList: res.data,
        pageModel: res.pageModel
      });
    }).freezeBalance({
      // tenantId: wx.getStorageSync('tenantIdNow'),
      pageSize: 20,
      pageNumber: 1
    })
  },
  //账单明细分页加载
  onReachBottom: function() {
    var that = this;
    wx.showNavigationBarLoading();
    var pageModel = this.data.pageModel;
    var billList = this.data.billList;
    new balance(function(data) {
      wx.hideNavigationBarLoading() //完成停止加载
      if (data.pageModel.totalPages < data.pageModel.pageNumber) {
        that.setData({
          tips: '没有更多账单啦~',
          showtips: false
        })
      } else {
        billList = billList.concat(data.data)
        that.setData({
          billList: billList,
          loading: false,
          tips: '正在加载',
          showtips: false
        })
      }
    }).freezeBalance({
      pageSize: 20,
      // tenantId: wx.getStorageSync('tenantIdNow'),
      pageNumber: ++pageModel.pageNumber
    });
  },
  goOrder(e) {
    var id = e.currentTarget.dataset.tradeid
    if (id > 0) {
      wx.navigateTo({
        url: '../../order/orderDetails/orderDetails?id=' + id + '&tradeType=bill',
      })
    }
  }
});
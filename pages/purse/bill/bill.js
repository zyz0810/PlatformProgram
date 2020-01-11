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
    nowyear: '',
    nowmonth: '',
    nowdate: '',
    year: '',
    month: '',
    date: '',
    billList: '',
    begin: '',
    end: '',
    income: '',
    pageModel: {},
    loading: true,
    tips: '没有更多账单啦~',
    currentTab: 0,
  },
  technical: function() {
    wx.navigateTo({
      url: '/pages/technical/index',
    })
  },
  swiperChange(e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  swichNav(e) { //点击选项卡
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
  },
  onLoad: function() {
    var that = this;
    //获取当前的年月日
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var date = new Date().getDate();
    var systemInfo = wx.getSystemInfoSync()
    that.setData({
      nowyear: year,
      nowmonth: month,
      nowdate: date,
      year: year,
      month: month,
      date: date,
      begin: year + '-' + month + '-1',
      end: year + '-' + month + '-31',
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight,
    })

    //默认加载当前月份的账单明细
    new Bill(function(data) {
      var billList = data.data
      for (var i = 0; i < billList.length; i++) {
        // billList[i].amount = billList[i].amount.toFixed(2)
        billList[i].balance = billList[i].balance.toFixed(2)
        billList[i].create_date = shareGetTime(billList[i].create_date)
      }
      that.setData({
        billList: billList,
        pageModel: data.pageModel
      });
    }).billList({
      begin_date: that.data.begin,
      end_date: that.data.end
    });

    //账单收入支出详情
    new Bill(function(data) {
      var billTotal = data.data
      for (var key in billTotal) {
        billTotal[key] = billTotal[key].toFixed(2)
      }
      that.setData({
        billTotal: billTotal,
        income: billTotal.total_income,
        outcome: billTotal.total_outcome
      });
    }).billSumer({
      begin_date: that.data.begin,
      end_date: that.data.end
    })

  },
  onShow: function() {

  },
  //日期选择器
  bindDateChange: function(e) {
    var that = this;
    var selectDate = e.detail.value;
    var selectYear = selectDate.split("-")[0];
    var selectMonth = selectDate.split("-")[1];
    var selectDay = selectDate.split("-")[2];
    this.setData({
      year: selectYear,
      month: selectMonth,
      date: selectDay,
      begin: selectYear + '-' + selectMonth + '-1',
      end: selectYear + '-' + selectMonth + '-31'
    });

    //默认加载当前月份的账单明细
    new Bill(function(data) {
      var billList = data.data
      for (var i = 0; i < billList.length; i++) {
        // billList[i].amount = billList[i].amount.toFixed(2)
        billList[i].balance = billList[i].balance.toFixed(2)
        billList[i].create_date = shareGetTime(billList[i].create_date)
      }
      that.setData({
        billList: billList,
        pageModel: data.pageModel
      });
    }).billList({
      begin_date: that.data.begin,
      end_date: that.data.end
    });

    //账单收入支出详情
    new Bill(function(data) {
      var billTotal = data.data
      for (var key in billTotal) {
        billTotal[key] = billTotal[key].toFixed(2)
      }
      that.setData({
        billTotal: billTotal,
        income: billTotal.total_income,
        outcome: billTotal.total_outcome
      });
    }).billSumer({
      begin_date: that.data.begin,
      end_date: that.data.end
    })

  },
  //下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    wx.showNavigationBarLoading(); //加载的状态

    //默认加载当前月份的账单明细
    new Bill(function(data) {
      var billList = data.data
      for (var i = 0; i < billList.length; i++) {
        // billList[i].amount = billList[i].amount.toFixed(2)
        billList[i].balance = billList[i].balance.toFixed(2)
        billList[i].create_date = shareGetTime(billList[i].create_date)
      }
      that.setData({
        billList: billList,
        pageModel: data.pageModel
      });
      if (that.data.currentTab == 0) {
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
      }
    }).billList({
      begin_date: that.data.begin,
      end_date: that.data.end
    });

    //账单收入支出详情
    new Bill(function(data) {
      var billTotal = data.data
      for (var key in billTotal) {
        billTotal[key] = billTotal[key].toFixed(2)
      }
      that.setData({
        billTotal: billTotal,
        income: billTotal.total_income,
        outcome: billTotal.total_outcome
      });
      if (that.data.currentTab == 1) {
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
      }
    }).billSumer({
      begin_date: that.data.begin,
      end_date: that.data.end
    })
  },

  //上拉加载
  onReachBottom: function() {
    var that = this;
    if (that.data.currentTab == 1) return
    wx.showNavigationBarLoading();
    var pageModel = this.data.pageModel;
    var billList = this.data.billList;
    new Bill(function(data) {
      wx.hideNavigationBarLoading() //完成停止加载
      if (data.pageModel.totalPages <= data.pageModel.pageNumber) {
        that.setData({
          tips: '到底了亲',
          showtips: false
        })
      } else {
        for (var i = 0; i < data.data.length; i++) {
          // data.data[i].amount = data.data[i].amount.toFixed(2)
          data.data[i].balance = data.data[i].balance.toFixed(2)
          data.data[i].create_date = shareGetTime(data.data[i].create_date)
        }
        billList = billList.concat(data.data)
        that.setData({
          billList: billList,
          loading: false,
          tips: '正在加载',
          showtips: false
        })
      }
    }).billList({
      begin_date: that.data.begin,
      end_date: that.data.end,
      pageNumber: ++pageModel.pageNumber
    });
  }
});
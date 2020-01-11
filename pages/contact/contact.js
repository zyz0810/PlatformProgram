let app = getApp();
let util = require('../../utils/util.js');
let tenant = require('../../service/tenant.js');
let lbs = require('../../service/lbs.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {


  },
  onShow: function () {
    if (app.globalData.LOGIN_STATUS) {
      this.getData()
    } else {
      app.loginOkCallback = res => {
        this.getData()
      }
    }
  },


  onLoad: function (options) {
    this.setData({
      tenantId: options.tenantId
    })
  },
  //自定义底部导航点击事件
  Navigation(e) {
    var tenantId = e.currentTarget.dataset.tenantid
    var src = e.currentTarget.dataset.src
    wx.redirectTo({
      url: src + '?tenantId=' + tenantId,
    })
  },
  getData() {
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        new lbs(function (data) {
          new lbs(function () {
            new tenant(function (data) {
              that.setData({
                listData: data.data
              })
            }).deliveryCenterList({
              id: that.data.tenantId,
              isCurrentArea: true
            })
          }).update({
            lat: latitude,
            lng: longitude,
            areaId: data.data.bd_area.cityId ? data.data.bd_area.cityId : 1029
          })
        }).get({
          lat: latitude,
          lng: longitude
        })
      },
      fail: function (err) {
        new tenant(function (data) {
          that.setData({
            listData: data.data
          })
        }).deliveryCenterList({
          id: that.data.tenantId,
          isCurrentArea: true
        })
        console.log(err)
        if (err.errMsg.indexOf('auth') > -1) {
          wx.showModal({
            title: '提示',
            content: '未授予定位权限，是否前往设置',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
      }
    })
    new tenant(function (data) {
      that.setData({
        logo: data.data.logo
      })
    }).view({
      id: this.data.tenantId
    })
  },
  goNav: function (e) {
    var lng = e.currentTarget.dataset.lng;
    var lat = e.currentTarget.dataset.lat;
    var name = e.currentTarget.dataset.name;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: lat,
          longitude: lng,
          scale: 28,
          name: name
        })
      },
      fail: function (err) {
        if (err.errMsg.indexOf('auth') > -1) {
          wx.showModal({
            title: '提示',
            content: '未授予定位权限，是否前往设置',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
      }
    })
  },
  goCall: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success(res) { },
      fail(err) { }
    })
  }
})
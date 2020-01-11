let app = getApp(),
  Order = require('../../../service/order.js'),
  util = require("../../../utils/util.js")
Page({
  data: {
    list: [],
    no: ''
  },
  onLoad: function (options) {
    this.setData({
      mainColor: '#fd407a',
      no: options.no,
      cname: options.cname
    })
    new Order(res => {
      this.setData({
        dataList: JSON.parse(res.data)
      })
    }).logistics({
      no: options.no,
      name: options.name,
      phone: options.phone
    })
  }
})
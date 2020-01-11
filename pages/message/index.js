let Message = require('../../service/message.js'),
  util = require("../../utils/util.js")

Page({
  data: {
    order: {},
    account: {},
    message: {}
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    new Message((res) => {
      this.data.order.content = res.data.order
      this.data.account.content = res.data.account
      this.data.message.content = res.data.message
      this.setData({
        order: this.data.order,
        account: this.data.account,
        message: this.data.message
      })
    }).firstMessage()

    new Message(res => {
      this.data.order.showDot = res.data.order > 0
      this.data.account.showDot = res.data.account > 0
      this.data.message.showDot = res.data.message > 0
      this.setData({
        order: this.data.order,
        account: this.data.account,
        message: this.data.message
      })
    }).count()
  },
  toOrder() {
    util.navigateTo({
      url: './pushMsg/pushMsg?type=order',
    })
  },
  toAccount() {
    util.navigateTo({
      url: './pushMsg/pushMsg?type=account',
    })
  },
  toMessage() {
    // if (!this.data.message.content) return
    util.navigateTo({
      url: './pushMsg/pushMsg?type=message',
    })
  }
})
// pages/shelf/feedback/feedback.js
let util = require("../../../utils/util")
let Feedback = require("../../../service/feedback")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [
      {
        name: '想吃什么',
        ftype: 'eat'
      }, {
        name: '投诉建议',
        ftype: 'suggest'
      }, {
        name: '其它',
        ftype: 'other'
      }
    ],
    sftype: 'eat',
    content: '',
    mobile: ''
  },
  toggleftype(e) {
    const ftype = e.currentTarget.dataset.ftype
    this.setData({
      sftype: ftype
    })
  },
  input(e) {
    this.setData({
      [e.currentTarget.dataset.itype]: e.detail.value
    })
  },
  submit() {
    if (this.data.content === '') {
      util.errShow('反馈内容为空')
      return
    }
    if (!(/^1[3456789]\d{9}$/.test(this.data.mobile))) {
      util.errShow('手机号错误')
      return
    }
    new Feedback(res => {
      wx.showModal({
        title: '',
        showCancel: false,
        content: '您的反馈已提交成功，我们会尽快处理！',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }).save({
      type: this.data.sftype,
      mobile: this.data.mobile,
      content: this.data.content
    })
  },
  onLoad: function (options) {

  }
})
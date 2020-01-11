let Member = require("../../service/member.js"),
  util = require("../../utils/util.js"),
  config = require("../../utils/config.js")

module.exports = {
  //初始化
  PayTempInitData() {
    if (this.data.__payTemplate) return
    let data = {
      show: false,//密码框显示
      price: null,//显示金额
      focus: false,//自动焦点
      len: 0,//密码已输入长度
      losepwd: 'PayTempLosePwd',
      iconFn: 'PayTempClose',
      value: ''//密码值
    }
    this.data.__payTemplate = data
    this.setData({
      __payTemplate: data
    })
  },
  //输入事件
  PayTempInput(e) {
    this.PayTempInitData()
    let val = e.detail.value
    this.setData({
      __payTemplate: Object.assign({}, this.data.__payTemplate, {
        focus: val.length == 6 ? false : true,
        value: val,
        len: val.length
      })
    })
    if (val.length == 6 && this.PayTempSuccess)
      this.PayTempSuccess(val)
  },
  PayTempMaskCatchMove() {
    return false;
  },
  //显示
  PayTempShow() {
    this.PayTempInitData()
    this.setData({
      __payTemplate: Object.assign({}, this.data.__payTemplate, {
        show: true,
        focus: true
      })
    })
  },
  //关闭
  PayTempClose() {
    this.PayTempInitData()
    this.setData({
      __payTemplate: Object.assign({}, this.data.__payTemplate, {
        show: false,
        focus: false,
        len: 0,
        value: ''
      })
    })
  },
  //设置数据
  PayTempSet(options) {
    this.PayTempInitData()
    this.setData({
      __payTemplate: Object.assign({}, this.data.__payTemplate, options)
    })
  },
  PayTempClear() {
    this.setData({
      __payTemplate: Object.assign({}, this.data.__payTemplate, {
        len: 0,
        value: '',
        focus: true
      })
    })
  },
  //忘记密码
  PayTempLosePwd() {

    new Member(function (data) {
      if (data.data.bindMobile !== 'binded') {
        wx.showModal({
          title: '',
          content: '您还没有绑定手机，先去绑定手机吧',
          success: function (res) {
            if (res.confirm) {
              util.navigateTo({
                url: '/pages/bind/bind?where=paying',
              })
            } else if (res.cancel) {

            }
          }
        })
      } else if (data.data.bindMobile == 'binded') {
        util.navigateTo({
          url: '/pages/include/captcha/captcha?type=password&title=修改支付密码',
        })
      }
    }).view({
      appid: config.APPID
    })
  }
}
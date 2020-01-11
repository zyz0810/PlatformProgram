/**
 * @options
 * title:标题
 * header:数字
 * show:显示（boolean）
 * btnFn:function||ActionsheetConfirm//确认函数
 * localIndex:当前item行
 * item:[ 显示行
 *  {
 *     name：左名
 *     content：右名
 *     more：显示箭头（boolean）
 *  }
 * ]
 *
 */
var app = getApp()
let getPwd = require("../../utils/getPassword.js"),
    order = require("../../service/order.js"),
    member = require("../../service/member.js"),
    util = require("../../utils/util.js"),
    balance = require("../../service/balance.js"),
    config = require("../../utils/config.js")
module.exports = {
    //初始化
    ActionsheetInitData() {
        if (this.data.__actionsheet) {
            return
        }
        let initdata = {
            title: '确认付款',
            canClick: true,
            header: '0.00',
            show: false,
            submit: 'payConfirm',
            useBalance: false,
            useCardMember: false,
            sn: '',
          paytype: 'chinaumsPlatformAppletPayPlugin',
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
                    more: false,
                    fn: 'changePayMethod',
                    index: 1,
                    data: null
                },
            ]
        }
        this.setData({
            __actionsheet: initdata
        })
    },
    ActionsheetCatchMove() {
        return false;
    },
    //显示
    ActionsheetShow(options) {
        this.ActionsheetInitData()
        this.data.__actionsheet.useBalance = options.useBalance
        this.data.__actionsheet.useCardMember = options.useCardMember
        this.data.__actionsheet.header = "￥" + options.amount
        this.data.__actionsheet.item[0].content = options.memo
        this.data.__actionsheet.item[1].more = options.useBalance || options.useCardMember
        this.data.__actionsheet.sn = options.sn
        this.data.__actionsheet.closeJump = options.closeJump ? options.closeJump : ''
        this.data.__actionsheet.successJump = options.successJump ? options.successJump : ''
        this.data.__actionsheet.navType = options.navType ? options.navType : 'redirectTo'
        this.setData({
            __actionsheet: Object.assign({}, this.data.__actionsheet, {
                show: true
            })
        })
    },
    //隐藏
    ActionsheetHide(noJump) {
        if (noJump && noJump.detail) {
            noJump = false
        }
        this.ActionsheetInitData()
        if (!noJump) {
            const jtype = typeof this.data.__actionsheet.closeJump
            if (jtype === 'string') {
                if (this.data.__actionsheet.navType === 'redirectTo') {
                    wx.redirectTo({
                        url: this.data.__actionsheet.closeJump
                    })
                } else if (this.data.__actionsheet.navType === 'navigateTo') {
                    util.navigateTo({
                        url: this.data.__actionsheet.closeJump
                    })
                }
            } else if (jtype === 'function') {
                setTimeout(() => {
                    this.data.__actionsheet.closeJump()
            }, 0)
            }
        }
        this.setData({
            __actionsheet: Object.assign({}, this.data.__actionsheet, {
                show: false
            })
        })
    },
    //修改支付方式
    changePayMethod() {
        let itemList = ['微信支付'],
          paytype = ['chinaumsPlatformAppletPayPlugin', 'balancePayPlugin', 'cardMemberPayPlugin'],
            that = this
        if (!(this.data.__actionsheet.useBalance || this.data.__actionsheet.useCardMember)) {
            return
        }
        if (this.data.__actionsheet.useBalance && !this.data.__actionsheet.useCardMember) {
            itemList = ['微信支付', '余额支付']
        } else if (!this.data.__actionsheet.useBalance && this.data.__actionsheet.useCardMember) {
            itemList = ['微信支付', '会员卡支付']
        } else {
            itemList = ['微信支付', '余额支付', '会员卡支付']
        }
        wx.showActionSheet({
            itemList: itemList,
            success: function(res) {
                if (typeof res.tapIndex !== 'undefined') {
                    if (itemList.length === 3) {
                        that.data.__actionsheet.paytype = paytype[res.tapIndex]
                    } else if (that.data.__actionsheet.useBalance) {
                        that.data.__actionsheet.paytype = res.tapIndex == 0 ? paytype[0] : paytype[1]
                    } else if (that.data.__actionsheet.useCardMember) {
                        that.data.__actionsheet.paytype = res.tapIndex == 0 ? paytype[0] : paytype[2]
                    }
                    that.data.__actionsheet.item[1].content = itemList[res.tapIndex]
                    that.setData({
                        __actionsheet: that.data.__actionsheet
                    })
                }
            },
            fail: function(res) {

            }
        })
    },
    //确定
    payConfirm() {
        if (!this.data.__actionsheet.canClick) return
      if (this.data.__actionsheet.paytype === 'chinaumsPlatformAppletPayPlugin') {
            this.data.__actionsheet.canClick = false
            this.weixinPay()
            return
        }
        // if (this.data.__actionsheet.paytype === 'balancePayPlugin') {
        this.PayTempShow()
        // }
    }, //初始化
    PayTempInitData() {
        if (this.data.__payTemplate) return
        let data = {
            show: false, //密码框显示
            price: null, //显示金额
            focus: false, //自动焦点
            len: 0, //密码已输入长度
            losepwd: 'PayTempLosePwd',
            iconFn: 'PayTempClose',
            close: 'PayTempClose',
            value: '', //密码值
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
        if (val.length == 6) {
            wx.showLoading({
                title: '支付请求中',
                mask: true
            })
            getPwd(val, pwd => {
                new order(res => {
                    wx.showToast({
                    title: res.message.content,
                    icon: 'success',
                    mask: true
                })
                setTimeout(() => {
                wx.hideToast()
                this.PayTempClose()
                this.ActionsheetHide()
                if (this.data.__actionsheet.successJump) {
                    if (this.data.__actionsheet.navType === 'redirectTo') {
                        wx.redirectTo({
                            url: this.data.__actionsheet.successJump + '?sn=' + this.data.__actionsheet.sn,
                            success: () => {
                            this.setData({
                            __payTemplate: Object.assign({}, this.data.__payTemplate, {
                                len: 0,
                                value: '',
                                val: '',
                                focus: false
                            })
                        })
                    }
                    })
                    } else if (this.data.__actionsheet.navType === 'navigateTo') {
                        util.navigateTo({
                            url: this.data.__actionsheet.successJump + '?sn=' + this.data.__actionsheet.sn,
                            success: () => {
                            this.setData({
                            __payTemplate: Object.assign({}, this.data.__payTemplate, {
                                len: 0,
                                value: '',
                                val: '',
                                focus: false
                            })
                        })
                    }
                    })
                    }
                }
            }, 1000)
        }, (err) => {
                this.setData({
                    __payTemplate: Object.assign({}, this.data.__payTemplate, {
                        len: 0,
                        value: '',
                        val: '',
                        focus: false
                    })
                })
            }).paymentSubmit({
                sn: this.data.__actionsheet.sn,
                paymentPluginId: this.data.__actionsheet.paytype,
                enPassword: pwd
            })
        })
        }
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

    weixinPay() {
        let that = this
        new order(function(data) {

            wx.requestPayment({
                'timeStamp': data.data.timeStamp,
                'nonceStr': data.data.nonceStr,
                'package': data.data.package,
                'signType': data.data.signType,
                'paySign': data.data.paySign,
                'success': function(res) {
                    that.ActionsheetHide(true)
                    that.data.__actionsheet.canClick = true
                    if (that.data.__actionsheet.successJump) {
                        let successUrl = that.data.__actionsheet.successJump.indexOf('?') > -1 ?
                            that.data.__actionsheet.successJump + '&sn=' + that.data.__actionsheet.sn :
                            that.data.__actionsheet.successJump + '?sn=' + that.data.__actionsheet.sn
                        if (that.data.__actionsheet.navType === 'redirectTo') {
                            wx.redirectTo({
                                url: successUrl,
                                success: () => {
                                that.setData({
                                __payTemplate: Object.assign({}, that.data.__payTemplate, {
                                    len: 0,
                                    value: '',
                                    val: '',
                                    focus: false
                                })
                            })
                        }
                        })
                        } else if (that.data.__actionsheet.navType === 'navigateTo') {
                            util.navigateTo({
                                url: successUrl,
                                success: () => {
                                that.setData({
                                __payTemplate: Object.assign({}, that.data.__payTemplate, {
                                    len: 0,
                                    value: '',
                                    val: '',
                                    focus: false
                                })
                            })
                        }
                        })
                        }
                    }
                },
                'fail': function(res) {
                    that.data.__actionsheet.canClick = true
                }
            })
        }, function(err) {
            that.data.__actionsheet.canClick = true
        }).paymentSubmit({
          paymentPluginId: 'chinaumsPlatformAppletPayPlugin',
            sn: this.data.__actionsheet.sn
        })
    },
    //关闭
    PayTempClose() {
        this.PayTempInitData()
        this.setData({
            __payTemplate: Object.assign({}, this.data.__payTemplate, {
                show: false,
                focus: false
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

    //忘记密码
    PayTempLosePwd() {
        new member(function(data) {
            if (data.data.bindMobile !== 'binded') {
                wx.showModal({
                    title: '',
                    content: '您还没有绑定手机，先去绑定手机吧',
                    success: function(res) {
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
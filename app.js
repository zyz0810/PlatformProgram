let aldstat = require("./utils/ald-stat.js");
let Member = require('/service/member.js')
let CartShelves = require('/service/cartShelves')
let util = require('/utils/util.js')
let config = require('/utils/config.js')

App({
  globalData: {
    LOGIN_STATUS: false,
    sys: wx.getSystemInfoSync(),
    isIphoneX: /iphone10|iphone x/i.test(wx.getSystemInfoSync().model)
  },
  onShow(opData) {
    
  },
  loginOkCallbackList: [],
  onLaunch(opData) {
    let that = this
    let username = '',
      headImg = '';
    const shelvesNo = opData.query.scene && decodeURIComponent(opData.query.scene).split("#")[1];
    wx.login({
      success(data) {
        //用户登陆成功
        tryLogin({
          code: data.code,
          username,
          headImg,
          shelvesNo
        }, (res) => {
          that.globalData.LOGIN_STATUS = true
          that.globalData.tenantId = res.data.tenantId
          that.globalData.mainColor = res.data.colour ? res.data.colour : '#d0bca4'
          wx.setStorageSync('tenantId', res.data.tenantId)
          wx.setStorageSync('shelvesNo', res.data.shelfNo ? res.data.shelfNo : wx.getStorageSync('shelvesNo'))
          // wx.setStorageSync('shelvesNo', '')
          wx.setStorageSync('extension', res.data.extensionId ? res.data.extensionId : wx.getStorageSync('extension'))
          new CartShelves(res => {
              console.log('清空货架购物车')
          }).clear({
            shelvesNo: wx.getStorageSync('shelvesNo'),
            cartType: 'shelves'
          })
          new Member(res => {
            that.globalData.memberInfo = res.data
            wx.setStorageSync('memberInfo', res.data)
            if (that.loginOkCallback) {
              that.loginOkCallback()
            }
            if (that.loginOkCallbackList.length > 0) {
              for (let i = 0; i < that.loginOkCallbackList.length; i++) {
                if (typeof that.loginOkCallbackList[i] === 'function') {
                  that.loginOkCallbackList[i]()
                }
                continue
              }
            }
          }).view({
            appid: config.APPID
          })
        })
      }
    })
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})

//登陆，获取sessionid
var tryLogin = (function () {
  let count = 0
  return function (data, fn) {
    if (count >= config.LOGIN_ERROR_TRY_COUNT) {
      util.errShow('登陆超时')
      return
    }
    new Member(function (res) {
      if (res.data.login || res.data.sessionId !== null) {
        //设置请求session到本地
        wx.setStorageSync('JSESSIONID', res.data.sessionId)

        fn ? fn(res) : ''
      } else {
        setTimeout(function () {
          tryLogin(data.code)
          count++
        }, config.LOGIN_ERROR_TRY_TIMEOUT)
      }
    }, function (err) {
      util.errShow('登陆失败', 50000)
    }).login({
      js_code: data.code,
      cid: 1,
      appid: config.APPID,
      nickName: data.username,
      headImg: data.headImg,
      shelvesNo: data.shelvesNo ? data.shelvesNo : ''
    })
  }
})()
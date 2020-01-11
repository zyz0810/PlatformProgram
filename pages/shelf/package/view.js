let swiperAutoHeight = require("../../../template/swiperProduct/swiper.js"),
  Member = require("../../../service/member.js"),
  Shelf = require("../../../service/shelf.js"),
  WxParse = require('../../wxParse/wxParse.js'),
  app = getApp(),
  util = require("../../../utils/util.js"),
  config = require("../../../utils/config.js")

Page(Object.assign({}, swiperAutoHeight, {
  onReady: function(res) {
    this.videoContext = wx.createVideoContext('myVideo')
    this.animation = wx.createAnimation()
  },
  /**
   * 页面的初始数据
   */
  data: {
    sys: app.globalData.sys, //系统信息
    showAction: false, //显示弹窗
    pageLoad: false, //页面加载完成
    quantity: 1
  },
  catchActionMask(e) {
    return false;
  },
  scroll(e) {
    this.setData({
      toUpShow: e.detail.scrollTop > 650
    })
  },
  scrollto(e) {
    let to = e.currentTarget.dataset.to
    this.setData({
      scrollIntoId: to
    })
  },
  onLoad: function(options) {
    if (app.globalData.LOGIN_STATUS) {
      this.getData(options)
    } else {
      app.loginOkCallbackList.push(() => {
        this.getData(options)
      })
    }
  },
  getData(options) {
    var that = this
    this.setData({
      tenantId: options.tenantId
    })
    this.data.id = options.id
    if (options.extensionId) {
      wx.setStorageSync('shelfExtensionId', options.extensionId)
    }
    new Shelf((res) => {
      wx.setNavigationBarTitle({
        title: res.data.name
      })
      var packDesc = res.data.packDesc ? res.data.packDesc.replace(/embed(?=\s+)/gi, 'video') : res.data.packDesc;
      if (packDesc != null) {
        WxParse.wxParse('packDesc', 'html', packDesc, that, 5);
      }
      this.setData({
        packageData: res.data,
        pageLoad: true,
        mainColor: app.globalData.mainColor
      })
    }).view({
      id: options.id
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.navigateTo({
    //         url: '/pages/member/scope/index',
    //       })
    //     }
    //   }
    // })
  },


  //加入购物车和立即购买确认按钮
  paySubmit: function(e) {
    if (e.detail.formId) {
      new Member(res => { }).addFormId({
        formIds: e.detail.formId
      })
    }
    let that = this;
    new Member(res => {
      app.globalData.memberInfo = res.data
      if (res.data.bindMobile != 'binded') {
        wx.showToast({
          icon: 'none',
          title: '绑定手机后可购买'
        })
        setTimeout(function() {
          wx.navigateTo({
            url: '/pages/bind/bind',
          })
        }, 1500)
      } else {
        wx.navigateTo({
          url: 'orderPay?quantity=' + this.data.quantity + '&id=' + this.data.id+'&tenantId='+this.data.tenantId,
        })
      }
    }).view()
  },

  //弹出框toggle
  toggleMask(e) {
    if (e.detail.formId) {
      new member(res => {}).addFormId({
        formIds: e.detail.formId
      })
    }
    this.setData({
      showAction: !this.data.showAction,
    })
  },
  revisenum(e) {
    let stype = e.currentTarget.dataset.type,
      min = 1,
      max = 99,
      quantity = parseInt(this.data.quantity)
    switch (stype) {
      case 'input':
        quantity = (!isNaN(e.detail.value) && e.detail.value >= min && e.detail.value <= max) ? e.detail.value : this.data.quantity
        break;
      case 'add':
        quantity = quantity + 1 <= max ? (quantity < min ? min : ++quantity) : max
        if (quantity == max) {
          wx.showToast({
            title: '限购99',
          })
        }
        break;
      case 'reduce':
        quantity = quantity - 1 < min ? 1 : --quantity
        break;
    }
    this.setData({
      quantity: quantity
    })
  },
  onShareAppMessage: function(res) {
    var that = this;
    return {
      title: that.data.packageData.name,
      path: 'pages/shelf/package/view?id=' + that.data.id + '&extensionId=' + app.globalData.memberInfo.id,
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success'
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  //预览商品主图
  adSwiperTap(e) {
    var currentImg = e.currentTarget.dataset.imgsrc
    var imgArr = [];
    for (var i = 0; i < this.data.packageData.packImage.length; i++) {
      imgArr.push(this.data.packageData.packImage[i])
    }
    wx.previewImage({
      current: currentImg, // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
    })
  }

}))
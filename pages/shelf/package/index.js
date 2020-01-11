let app = getApp(),
  Tenant = require('../../../service/tenant'),
  Shelf = require('../../../service/shelf'),
  WxParse = require('../../wxParse/wxParse.js')
Page(Object.assign({}, {

  /**
   * 页面的初始数据
   */
  data: {
    pageLoad: false //页面加载完成
  },
  goPackageList() {
    wx.navigateTo({
      url: 'list',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
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
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      // this.data.tenantId = scene.split("#")[0]
      this.data.shelfExtensionId = scene.split("#")[1]
      wx.setStorageSync('shelfExtensionId', scene.split("#")[1])
    } else {
      this.data.tenantId = options.tenantId
      if (options.extensionId) {
        wx.setStorageSync('shelfExtensionId', options.extensionId)
      }
      this.data.shelfExtensionId = options.extensionId ? options.extensionId : wx.getStorageSync('shelfExtensionId') ? wx.getStorageSync('shelfExtensionId') : ''
    }
    new Shelf(res => {
      this.setData({
        tenantData: res.data,
        pageLoad: true,
        mainColor: app.globalData.mainColor
      })

      var tenantData = res.data
      // for (var i = 0; i < res.data.length; i++) {
      //   var tenantIntroduce = res.data[i].tenantIntroduce ? res.data[i].tenantIntroduce.replace(/embed(?=\s+)/gi, 'video') : res.data.tenantIntroduce;
      //   if (tenantIntroduce != null) {
      //     console.log(tenantIntroduce)
      //     console.log('好0')
      //     WxParse.wxParse('tenantIntroduce', 'html', tenantIntroduce, that, 5);
      //     console.log(WxParse.wxParse('tenantIntroduce', 'html', tenantIntroduce, that, 5))
      //     tenantData[i].tenantIntroduce = WxParse.wxParse('tenantIntroduce', 'html', tenantIntroduce, that, 5);
      //     that.setData({
      //       tenantData: tenantData
      //     })
      //   }

      // }





      //处理富文本
      for (let i = 0; i < tenantData.length; i++) {
        if (tenantData[i].tenantIntroduce == null) { 
          tenantData[i].tenantIntroduce='<p></p>'
        }
          WxParse.wxParse('tenantIntroduce' + i, 'html', tenantData[i].tenantIntroduce, that);
          //delete newData[i].content;
          if (i === tenantData.length - 1) {
            WxParse.wxParseTemArray("WxParseListArr", 'tenantIntroduce', tenantData.length, that)
          }
        
      }



      console.log(that.data.WxParseListArr);

    }).tenant_info({
      // tenantId: this.data.tenantId,
      extensionId: this.data.shelfExtensionId
    })
  },
  //进入订单列表
  goOrder() {
    var that = this

    wx.navigateTo({
      url: 'order',
    })


  },
  //进入品牌介绍详情
  goIntroduce(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'info?tenantId='+id,
    })
  },
  //进入货架套餐详情
  goView(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var tenantId = e.currentTarget.dataset.tenantid
    wx.navigateTo({
      url: 'view?id=' + id + '&tenantId=' + tenantId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.navigateTo({
    //         url: '/pages/member/scope/index',
    //       })
    //     }
    //   }
    // })
    var that = this;


    wx.getSetting({
      success(res) {
        wx.hideToast();
        if (!res.authSetting['scope.userInfo']) {

        } else {


        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    return {
      title: '来一架邀您加盟',
      path: 'pages/shelf/package/index?extensionId=' + app.globalData.memberInfo.id,
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
  //联系我们
  callUs: function() {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.tenantData.linkMethod ? that.data.tenantData.linkMethod : '0551-63676688',
      success(res) {},
      fail(err) {
        if (err.errMsg.indexOf('cancel') === -1) {
          util.errShow(that.data.tenantData.linkMethod ? that.data.tenantData.linkMethod : '0551-63676688', 5000)
        }
      }
    })
  }
}))
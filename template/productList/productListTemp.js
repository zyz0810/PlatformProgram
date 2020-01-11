
module.exports = {
  __pt_toDetail(e) {
    wx.navigateTo({
      url: '/pages/product/details/details?id=' + e.currentTarget.dataset.id,
    })
    // wx.navigateToMiniProgram({
    //   appId: 'wx441dd0c007894173',
    //   path: 'pages/home/productDetails/productDetails?id=' + e.currentTarget.dataset.id + '&tenantId=' + (getApp().globalData.tenantId || wx.getStorageSync('tenantId')),
    //   extraData: {},
    //   // envVersion: 'develop',
    //   success(res) {
    //     // 打开成功
    //     console.log(res)
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })
  }
}

// pages/home/article/article.js
let Tenant = require("../../service/tenant.js"),
    WxParse = require('../wxParse/wxParse.js'),
    app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    content:'',
    article:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let that = this;
    

    // 页面初始化 options为页面跳转所带来的参数
    
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    // let article = 'wrewt';
    // var article = '<div style="color:red">我是<br>HTML代码</div>';
    // WxParse.wxParse('article', 'html', article, that, 5);

    new Tenant(function (data) {
      var article = data.data.content;
      that.setData({
        title: data.data.title,
        article: data.data.content
      })
      WxParse.wxParse('article', 'html', article, that, 5);
    }).article({ id: id })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})
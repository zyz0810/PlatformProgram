const Category = require('../../service/category')
const Product = require('../../service/product')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topAcIndex: 0,
    topAcId: null,
    leftAcIndex: 0,
    leftAcId: '',
    keyword: '',
    pageNumber: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    new Category(res => {
      wx.INIT_CATEGORY_ID = wx.INIT_CATEGORY_ID ? wx.INIT_CATEGORY_ID : res.data[0].id
      const topAcId = wx.INIT_CATEGORY_ID ? wx.INIT_CATEGORY_ID : res.data[0].id
      that.setData({
        channelList: res.data,
        topAcId,
        topAcIndex: res.data.findIndex(({
          id
        }) => id == topAcId),
        topScrollId: `top${topAcId}`
      })
      new Category(res => {
        const leftAcId = wx.INIT_CATEGORY_GROUPID ? wx.INIT_CATEGORY_GROUPID : res.data[0] ? res.data[0].id : ''
        this.setData({
          secondList: res.data,
          leftAcId,
          leftAcIndex: res.data.findIndex(v => v.id == leftAcId)
        })
        this.productListLoad()
      }).twoList({
        id: this.data.topAcId
      })
      // wx.INIT_CATEGORY_ID = res.data[0].id
    }).list()
  },
  onShow() {
    if (wx.INIT_CATEGORY_ID) {
      this.onLoad()
    }
  },

  onHide() {
    // wx.INIT_CATEGORY_ID = ''
    this.selectComponent('#productList').closeSpecMask()
  },
  onUnload() {
    // wx.INIT_CATEGORY_ID = ''
    this.selectComponent('#productList').closeSpecMask()
  },

  //点击顶部导航
  topBindtap(e) {
    var that = this
    const index = e.target.dataset.index
    const id = e.target.dataset.id
    if (typeof index === 'undefined') return
    const topList = this.data.channelList
    const topScrollId = topList[index - 2 > 0 ? index - 2 : 0].id
    this.setData({
      topAcIndex: index,
      topAcId: id,
      leftAcIndex: 0,
      topScrollId: `top${topScrollId}`
    })
    new Category(res => {
      this.setData({
        secondList: res.data,
        leftAcId: res.data[0] ? res.data[0].id : ''
      })
      this.productListLoad()
    }).twoList({
      id: that.data.topAcId
    })
    // wx.INIT_CATEGORY_ID = id
  },
  //点击左边导航
  leftBindtap(e) {
    const index = e.target.dataset.index
    const id = e.target.dataset.id
    if (typeof index === 'undefined') return
    this.setData({
      leftAcIndex: index,
      leftAcId: id
    })
    this.productListLoad()
  },

  //商品加载
  productListLoad() {
    new Product(res => {
      this.setData({
        productList: res.data
      })
      if (res.data.length < 10) {
        this.setData({
          loading: false,
          tips: '没有更多了~',
          showtips: false
        })
      } else if (res.data.length >= 10) {
        this.setData({
          loading: false,
          tips: '加载更多...',
          showtips: false
        })
      }
    }).categoryProduct({
      categoryId: this.data.topAcId,
      keyword: this.data.keyword,
      pageNumber: 1,
      pageSize: 10
    })
  },

  searchInput(e) {
    this.setData({
      keyword: e.detail.value
    })
    this.productListLoad()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    new Product(res => {
      wx.stopPullDownRefresh()
      this.setData({
        productList: res.data
      })
      if (res.data.length < 10) {
        this.setData({
          loading: false,
          tips: '没有更多了~',
          showtips: false
        })
      } else if (res.data.length > 10) {
        this.setData({
          loading: false,
          tips: '加载更多...',
          showtips: false
        })
      }
    }).categoryProduct({
      categoryId: this.data.topAcId,
      keyword: this.data.keyword,
      pageNumber: 1,
      pageSize: 10
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  loadMore: function () {
    var that = this
    var pageNumber = this.data.pageNumber
    var productList = this.data.productList
    new Product(res => {
      if (res.data.length == 0) {
        that.setData({
          tips: '没有更多了~',
          showtips: false
        })
      } else {
        productList = productList.concat(res.data)
        that.setData({
          productList: productList,
          loading: false,
          tips: '正在加载...',
          showtips: false,
          pageNumber: pageNumber
        })
      }
    }).categoryProduct({
      categoryId: this.data.topAcId,
      keyword: this.data.keyword,
      pageSize: 10,
      pageNumber: ++pageNumber
    })
  }
})
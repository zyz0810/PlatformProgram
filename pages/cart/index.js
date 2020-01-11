var app = getApp()
let util = require('../../utils/util.js')
let Cart = require('../../service/cart.js')

// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [], //购物车列表
    total: 0, //计算总价
    checkAll: false, //是否选择全部
    selectedId: [], //已选择商品id
    mailPromotion: null, //包邮信息
  },
  //商品check事件
  checkItemChange(e) {
    console.log(e)
    //tip:setData设置数据会响应到页面，但会有延时，this.data不响应页面
    let value = e.detail.value
    let cartList = this.data.cartList
    let productLength = 0
    for (let i = 0, j = cartList.length; i < j; i++) {

      productLength += cartList[i].cartItems.length
      for (let x = 0, y = cartList[i].cartItems.length; x < y; x++) {
        if (value.indexOf(cartList[i].cartItems[x].id + '') + 1 || value.indexOf(cartList[i].cartItems[x].id) + 1) {
          cartList[i].cartItems[x].selected = true
        } else {
          cartList[i].cartItems[x].selected = false
        }
      }
    }
    new Cart(res => {
      this.data.cartList = cartList
      this.data.selectedId = value
      this.setData({
        checkAll: [...new Set(e.detail.value)].length === productLength,
        cartList: cartList
      })
      this.calcTotal()
    }).selected({
      ids: value
    })
  },
  deleteItem(e) {
    let cartList = this.data.cartList
    let name = e.currentTarget.dataset.name
    let id = e.currentTarget.dataset.id
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否确定删除该商品(' + name + ')',
      success: function (res) {
        if (res.confirm) {
          new Cart((res) => {
            that.onShow()
          }).delete({
            ids: [id]
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  //添加、减少商品数目
  revisenum(e) {
    let that = this
    let data = e.currentTarget.dataset
    let id = data.id,
      rtype = data.type,
      min = data.min
    let localnum = this.getItemById(id).quantity
    let result = min
    if (localnum < min) {
      this.setNum(id, min)
      return
    }
    if (rtype == 'add') {
      this.setNum(id, ++localnum)
      return
    }
    if (rtype == 'reduce') {
      this.setNum(id, localnum - 1 <= min ? min : --localnum)
      return
    }

  },
  //通过id获取商品
  getItemById(id) {
    let cartList = this.data.cartList
    let cartItem
    cartList.forEach(v => {
      v.cartItems.forEach(item => {
        if (item.id == id) {
          cartItem = item
        }
      })
    })
    return cartItem
  },
  //输入商品数目
  inputnum(e) {
    let id = e.currentTarget.dataset.id
    let val = e.detail.value
    if (isNaN(val)) {
      this.setNum(id, val)
      return
    }
    this.setNum(id, val)
  },

  //全选check事件
  checkAllChange(e) {
    let that = this
    let selectAll = e.detail.value.length
    let cartList = this.data.cartList
    let selectedId = []
    for (let i = 0, j = cartList.length; i < j; i++) {
      for (let x = 0, y = cartList[i].cartItems.length; x < y; x++) {
        if (selectAll == 0) {
          cartList[i].cartItems[x].selected = false
          selectedId.push(cartList[i].cartItems[x].id)
        } else if (selectAll == 1) {
          cartList[i].cartItems[x].selected = true
          selectedId.push(cartList[i].cartItems[x].id)
        }
      }
    }
    new Cart(res => {
      //设置已选择商品
      this.data.selectedId = selectAll ? selectedId : []
      this.setData({
        cartList: cartList
      })
      that.calcTotal()
    }).selected({
      ids: selectAll ? selectedId : []
    })
  },
  //计算总价
  calcTotal() {
    let selectedId = this.data.selectedId,
      total = 0
    new Cart(res => {
      if (res.data > 0) {
        wx.setTabBarBadge({
          index: 1,
          text: res.data.toString()
        })
      } else if (res.data == 0) {
        wx.removeTabBarBadge({
          index: 1
        })
      }
    }).count()
    if (selectedId.length == 0) {
      this.setData({
        total: total
      })
      return
    }
    selectedId = [...new Set(selectedId)]
    selectedId.forEach((val, index) => {
      let item = this.getItemById(val)
      if (item)
        total += item.quantity * item.price
    })
    this.setData({
      total: total.toFixed(2)
    })

  },
  //设置商品数量
  setNum(id, num) {
    let cartList = this.data.cartList
    let that = this
    if (this.getItemById(id).quantity == num) return
    //编辑数目调用接口
    new Cart(function (data) {
      let cartItem
      cartList.forEach(v => {
        v.cartItems.forEach(item => {
          if (item.id == id) {
            cartItem = item
          }
        })
      })
      cartItem.quantity = num
      that.data.cartList = cartList
      that.setData({
        cartList: that.data.cartList
      })
      that.calcTotal()
    }, function (err) {
      util.errShow(err.message.content)
      that.setData({
        cartList: that.data.cartList
      })
    }).edit({
      id: id,
      quantity: num
    })
  },

  onLoad: function (options) {

  },
  getCartDataWhenLogin() {
    var that = this
    new Cart(function (data) {
      let selectedId = [],
        cartList = data.data.tenants ? data.data.tenants : ['']
      let productLength = 0
      for (let i = 0, j = cartList.length; i < j; i++) {
        productLength += cartList[i].cartItems.length
        for (let x = 0, y = cartList[i].cartItems.length; x < y; x++) {
          if (cartList[i].cartItems[x].selected) {
            selectedId.push(cartList[i].cartItems[x].id)
          }
        }
      }
      that.data.selectedId = selectedId
      that.setData({
        cart: data.data,
        cartList: data.data.tenants,
        checkAll: [...new Set(selectedId)].length === productLength,
        selectedId: selectedId
      })
      that.calcTotal()
    }).list()
  },
  onShow: function () {
    this.setData({
      getDataComplete: false
    })
    if (app.globalData.LOGIN_STATUS) {
      this.getCartDataWhenLogin()
    } else {
      app.loginOkCallbackList.push(() => {
        this.getCartDataWhenLogin()
      })
    }
  },
  //点击去逛逛
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //结算
  submit: function () {
    if (this.data.selectedId.length <= 0) {
      util.errShow('请选择结算商品')
    } else {
      util.navigateTo({
        url: '../pay/pay',
      })
    }
  },

  //购物车点击进商品详情
  goProductDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    util.navigateTo({
      url: '/pages/product/details/details?id=' + id,
    })
  },
  //购物车点击进店铺首页
  goTenantDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    util.navigateTo({
      url: '/pages/home/home?tenantId=' + id,
    })
  }


})
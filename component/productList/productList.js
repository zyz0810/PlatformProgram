const Cart = require('../../service/cart.js')
const Member = require('../../service/member.js')
const util = require('../../utils/util.js')
Component({
  properties: {
    list: {
      type: Array,
      value: [],
      observer(nv, ov) {
        const cartData = this.data.cartData
        nv.map(v => {
          cartData[v.id] = v
        })
        this.setData({
          cartData
        })
      }
    }
  },
  data: {
    cartData: {
      // [key:number] : Array
    }
  },
  methods: {
  
    closeSpecMask() {
      this.selectComponent('#popup').close()
    },
    
    showSpecMask(e) {
      const {
        index,
        id
      } = e.currentTarget.dataset
      this.setData({
        popupId: id
      })
      this.selectComponent('#popup').show()
    },
    //计算购物车数量，设置导航角标
    calcCount() {
      new Cart(res => {
        this.setData({
          cartCount: res.data
        })
        if (res.data > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: res.data.toString()
          })
        } else if (res.data == 0) {
          wx.removeTabBarBadge({
            index: 2
          })
        }
      }).count()
    },
    isRequesting: false,
    cartOp(e) {
      const {
        id,
        pid,
        t,
        min,
        max,
        quantity,
        orderid
      } = e.currentTarget.dataset
      const selectedData = this.data.cartData[pid].specificationProducts.find(v => v.productId == id)
      let result
      const addFn = () => {
        if (this.isRequesting) {
          this.setData({
            cartData: this.data.cartData
          })
          return
        }
        this.isRequesting = true
        new Cart(({
          data
        }) => {
          selectedData.orderItemQuantity = result
          selectedData.orderItemId = data.cartItemId
          this.setData({
            cartData: this.data.cartData
          })
          this.isRequesting = false
          this.calcCount()
        }, err => {
          this.isRequesting = false
          }).addnew({
          id,
          quantity: result
        })
      }
      const delFn = () => {
        if (this.isRequesting) {
          this.setData({
            cartData: this.data.cartData
          })
          return
        }
        this.isRequesting = true
        new Cart(res => {
          selectedData.orderItemQuantity = 0
          this.setData({
            cartData: this.data.cartData
          })
          this.isRequesting = false
          this.calcCount()
        }, err => {
          this.isRequesting = false
        }).delete({
          ids: orderid
        })
      }
      switch (t) {
        case '0':
          result = quantity - 1
          if (result - min < 0) {
            if (quantity < min) return
            result = 0
            delFn()
            return
          }
          addFn()
          break
        case '1':
          result = e.detail.value
          if (result > max) {
            util.errShow('库存不足')
            this.setData({
              cartData: this.data.cartData
            })
            return
          }
          if (result < min) {
            delFn()
            return
          }
          addFn()
          break
        case '2':
          result = parseInt(quantity) + 1
          if (result < min) {
            result = min
          }
          if (result > max) {
            result = quantity
            util.errShow('库存不足')
            return
          }
          addFn()
          break
      }
    },
    // 前往详情页
    goProductDetail(e) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/product/details/details?id=' + id,
      })
    },
    //去购物车
    bindgetuserinfoCart(e) {
      let that = this
      if (e.detail.errMsg.indexOf('fail') > -1) {
        wx.showToast({
          title: '请授权用户信息!',
          icon: 'none'
        })
      } else {
        new Member(res => {
          const globalMemberInfo = getApp().globalData.memberInfo
          globalMemberInfo.username = e.detail.userInfo.nickName
          globalMemberInfo.userhead = e.detail.userInfo.avatarUrl
          wx.switchTab({
            url: '/pages/cart/cart',
          })
        }).update({
          headImg: e.detail.userInfo.avatarUrl,
          nickName: e.detail.userInfo.nickName
        })
      }
    },
    //去结算
    bindgetuserinfoPay(e) {
      let that = this
      if (e.detail.errMsg.indexOf('fail') > -1) {
        wx.showToast({
          title: '请授权用户信息!',
          icon: 'none'
        })
      } else {
        new Member(res => {
          const globalMemberInfo = getApp().globalData.memberInfo
          globalMemberInfo.username = e.detail.userInfo.nickName
          globalMemberInfo.userhead = e.detail.userInfo.avatarUrl
          new Cart(res => {
            if (res.data > 0) {
              util.navigateTo({
                url: '/pages/pay/pay',
              })
            } else if (res.data == 0) {
              wx.showToast({
                title: '购物车为空',
                icon: 'none'
              })
            }
          }).count()
        }).update({
          headImg: e.detail.userInfo.avatarUrl,
          nickName: e.detail.userInfo.nickName
        })
      }
    }
  }
})
let app = getApp()
let util = require('../../utils/util')
let config = require('../../utils/config')
let Product = require('../../service/product')
let tenant = require('../../service/tenant')
let member = require('../../service/member')
let order = require('../../service/order')
let CartShelves = require('../../service/cartShelves')
let Cart = require("../../service/cart.js")
let coupon = require('../../service/coupon')
let Ad = require("../../service/ad.js")
let swiperAutoHeight = require("../../template/swiperIndex/swiper.js")

function throttle(fn, delay, mustRunDelay) {
  var timer = null;
  var t_start;
  return function() {
    var context = this,
      args = arguments,
      t_curr = +new Date();
    clearTimeout(timer);
    if (!t_start) {
      t_start = t_curr;
    }
    if (t_curr - t_start >= mustRunDelay) {
      fn.apply(context, args);
      t_start = t_curr;
    } else {
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    }
  }
}

Page(Object.assign({}, swiperAutoHeight, {
  data: {
    sys: app.globalData.sys,
    showModel: 'bigImage',
    winHeight: 0, //用于scroll-view高度
    bottomHeight: 60, //用于scroll-view高度，当显示bottom
    asAnimation: {}, //
    asMaskAnimation: {},
    dialogAnimation: {},
    dialogMaskAnimation: {},
    actionsheetShow: false,
    dialogShow: false,
    list: [], //商品列表
    listAll: [], //商品列表
    swiperCurrentIndex: 0, //swiper当前index
    //购物车
    cartList: [],
    cartListById: {},
    effectivePrice: 0, //已选价格
    btnDisable: {},
    hidePage: false,
    cartNum: 0,
    couponShow: false,
    canLoad: false,
    scope: false,
    myTime: '',
    isIphoneX: app.globalData.isIphoneX,
  },
  asToggle() {
    // var asAnimation = wx.createAnimation({
    //     duration: 300,
    //     timingFunction: 'ease',
    // })
    // this.data.actionsheetShow ?
    //     asAnimation.bottom("-100%").step() :
    //     asAnimation.bottom(50).step()

    this.setData({
      // asAnimation: asAnimation.export(),
      actionsheetShow: !this.data.actionsheetShow
    })
  },
  dialogToggle() {
    // var animation = wx.createAnimation({
    //     duration: 300,
    //     timingFunction: 'ease',
    // })
    // this.data.dialogShow ?
    //     animation.left("100%").step()
    //     : animation.left(0).step()
    this.setData({
      // dialogAnimation: animation.export(),
      dialogShow: !this.data.dialogShow
    })
  },
  //滚动至
  scrollInto(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      scrollIntoId: `to${id}`,
      tagActiveId: id
    })
  },
  /**
   * swiper
   */
  //滚动显示active
  setActiveFloor: throttle(function() {
    const list = this.data.list
    const query = wx.createSelectorQuery()
    const scrollHeight = this.data.winHeight - this.data.bottomHeight - 60
    try {
      query.selectAll('.lineTitleSign').boundingClientRect((rect) => {
        if (rect.length === 0) return
        if (rect.length === 1) {
          this.setData({
            tagActiveId: rect[0].id
          })
          return
        }
        for (let i = 0; i < rect.length - 1; i++) {
          if (rect[i].top < 0 && rect[i + 1].top > 0 && rect[i + 1].top < this.data.winHeight / 2) {
            this.setData({
              tagActiveId: rect[i + 1].id
            })
            return
          }
          if (rect[i].top < 0 && rect[i + 1].top > 0 && rect[i + 1].top > this.data.winHeight / 2) {
            this.setData({
              tagActiveId: rect[i].id
            })
            return
          }
        }
        if (rect[rect.length - 1].bottom < this.data.winHeight / 2) {
          this.setData({
            tagActiveId: rect[rect.length - 1].id
          })
          return
        }
        this.setData({
          tagActiveId: rect[0].id
        })
      }).exec()
    } catch (error) {
      console.log(error)
    }
  }, 30, 50),
  swiperChange(e) {
    this.setData({
      swiperCurrentIndex: e.detail.current
    })
  },
  //swiper control
  swiperControl(e) {
    const direction = e.currentTarget.dataset.direction
    const swiperCurrentIndex = this.data.swiperCurrentIndex
    this.setData({
      swiperCurrentIndex: direction === 'left' ?
        (swiperCurrentIndex == 0 ? this.data.listAll.length - 1 : swiperCurrentIndex - 1) :
        (swiperCurrentIndex == this.data.listAll.length - 1 ? 0 : swiperCurrentIndex + 1)
    })
  },
  //swiper
  // showSwiper(e) {
  //   const {
  //     id,
  //     tagname
  //   } = e.currentTarget.dataset
  //   const listAll = this.data.listAll
  //   for (let i = 0, j = listAll.length; i < j; i++) {
  //     if (listAll[i].id == id && listAll[i].tagName == tagname) {
  //       this.setData({
  //         swiperCurrentIndex: i
  //       })
  //       break
  //     }
  //   }
  //   this.dialogToggle()
  // },
  touchstart: function (e) {
    this.data.startTouches = e.changedTouches[0]
  },
  touchmove: function (e) {
    this.data.moveTouches = e.changedTouches[0]
  },
  touchend: function (e) {
    var that = this
    var startTouch = this.data.startTouches,
      Y = e.changedTouches[0].pageY - startTouch.pageY,
      X = Math.abs(e.changedTouches[0].pageX - startTouch.pageX)

    if (this.data.scroll > 10) {
      return false
    }
    this.data.endTouches = e.changedTouches[0]
    if (Y < -200 && X < 200) {
      wx.navigateTo({
        url: '/pages/home/home?tenantId=' + that.data.tenantId,
      })
    }
  },
  //跳转商品详情
  goProductDetail: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/details/details?type=shelf&id=' + id + '&shelvesNo=' + that.data.shelvesNo,
    })
  },


  //取消优惠券
  cancelCoupon: function(e) {
    this.setData({
      couponShow: false
    })
  },


  getLocationSuccess(tenantId) {
    let that = this,
      promiseList = []
    //广告位(顶部)
    promiseList.push(new Promise((resolve, reject) => {
      new Ad(res => {
        resolve(res)
      }).doT(80, tenantId)
    }))

    Promise.all(promiseList).then(res => {
      this.setData({
        topImgs: {
          data: res[0].data,
          key: 'image'
        }
      })

    }, err => {
      this.setData({
        homeLoadReady: true
      })
    })


  },



  //领取优惠券
  reviceCoupon: function(e) {
    var id = e.currentTarget.dataset.id

    var that = this


    new coupon((res) => {
      wx.showToast({
        title: '领取成功',
        duration: 1000
      })

      //加载优惠券
      new coupon(data => {
        var item = [];
        var couponList = data.data
        this.setData({
          couponList: couponList
        });
      }).listT({
        tenantId: that.data.tenantId
      });


    }).pickup({
      id: id
    })







  },

  //前往我的券包
  myCoupon: function(e) {
    var that = this

    util.navigateTo({
      url: '/pages/member/coupon/list',
    })

  },


  //收藏商品
  favorite: function(e) {
    var id = e.currentTarget.dataset.id
    var hasFavorite = e.currentTarget.dataset.status
    var that = this

    const setFavorite = bool => {
      that.data.list.forEach(v => {
        v.productListModels && v.productListModels.length > 0 && v.productListModels.forEach(vc => {
          if (vc.id === id) {
            vc.hasFavorite = bool
          }
        })
      })
      that.setData({
        list: that.data.list
      })
    }
    if (hasFavorite) {
      new Product((res) => {
        wx.showToast({
          title: '取消成功',
          duration: 1000
        })
        setFavorite(false)
      }).delFavorite({
        id: id
      })
    } else {
      new Product((res) => {
        wx.showToast({
          title: '收藏成功',
          duration: 1000
        })
        setFavorite(true)
      }).favorite({
        id: id
      })
    }

  },

  /**
   * cart
   */
  //获取购物车列表并设值
  getCartList() {
    return new Promise((resolve, reject) => {
      //购物车列表
      new CartShelves(res => {
        this.data.cartListById = {}
        let cartNum = 0
        res.data.cartItems && res.data.cartItems.length > 0 && res.data.cartItems.forEach(item => {
          this.data.cartListById[item.productId] = item
          cartNum += item.quantity
        })
        this.setData({
          cartListById: this.data.cartListById,
          cartList: res.data.cartItems || [],
          effectivePrice: res.data.effectivePrice && res.data.effectivePrice.toFixed(2),
          cartId: res.data.id,
          cartNum
        })
        resolve && resolve(res.data)
      }, err => {
        reject && reject(err)
      }).list({
        tenantId: this.data.tenantId,
        shelvesNo: this.data.shelvesNo,
        cartType: 'shelves'
      })
    })
  },
  //编辑购物车
  editCart(id, cartItemId, quantity) {
    return new Promise((resolve, reject) => {
      new CartShelves(res => {
        this.data.cartListById[id].quantity = quantity
        this.setData({
          cartListById: this.data.cartListById,
          effectivePrice: res.data.effectivePrice.toFixed(2)
        })
        resolve(res)
      }, err => {
        reject && reject(err)
      }).edit({
        id: cartItemId,
        quantity,
        shelvesNo: this.data.shelvesNo,
        cartType: 'shelves'
      })
    })
  },
  //添加购物车
  addCart(id, quantity) {
    return new Promise((resolve, reject) => {
      new CartShelves(res => {
        this.getCartList().then(() => {
          resolve && resolve(res)
        })
      }, (err) => {
        reject && reject(err)
      }).add({
        'type': '',
        'quantity': quantity || 1,
        id,
        shelvesNo: this.data.shelvesNo,
        cartType: 'shelves'
      })
    })
  },
  //删除购物车
  delCart(id) {
    return new Promise((resolve, reject) => {
      new CartShelves(res => {
        this.getCartList().then(() => {
          resolve && resolve(res)
          if (this.data.actionsheetShow && Object.keys(this.data.cartListById).length === 0) {
            this.asToggle()
          }
        })
      }, err => {
        reject && reject(err)
      }).delete({
        ids: [id],
        shelvesNo: this.data.shelvesNo,
        cartType: 'shelves'
      })
    })
  },
  //清空购物车
  clearCart() {
    wx.showModal({
      title: '提示',
      content: '是否确认清空购物车',
      success: res => {
        if (res.confirm) {
          new CartShelves(res => {
            this.getCartList().then(() => {
              this.data.actionsheetShow && this.asToggle()
            })
          }).clear({
            shelvesNo: this.data.shelvesNo,
            cartType: 'shelves'
          })
        }
      }
    })
  },
  //edit事件
  editCartFnBt(e) {
    const {
      id,
      utype
    } = e.currentTarget.dataset
    const cartListById = this.data.cartListById
    let quantity = -1,
      cartItemId
    //按钮多击禁止
    if (this.data.btnDisable[id]) return
    this.data.btnDisable[id] = true

    if (this.data.cartListById[id] && this.data.cartListById[id].id) {
      quantity = parseInt(cartListById[id].quantity)
      cartItemId = cartListById[id].id
    } else {
      this.data.cartListById[id] = {
        quantity: 0
      }
    }
    switch (utype) {
      case 'add':
        if (quantity === -1) {
          this.addCart(id).then(res => {
            this.data.btnDisable[id] = false
          }, err => {
            this.data.btnDisable[id] = false
            delete this.data.cartListById[id]
          })
        } else {
          this.editCart(id, cartItemId, quantity + 1).then(res => {
            this.data.btnDisable[id] = false
            this.setData({
              cartNum: this.data.cartNum + 1
            })
          }, err => {
            this.data.btnDisable[id] = false
          })
        }
        break
      case 'reduce':
        if (quantity === -1 || quantity - 1 === -1) {
          this.data.btnDisable[id] = false
          return false
        } else if (quantity - 1 === 0) {
          this.delCart(cartItemId).then(res => {
            this.data.btnDisable[id] = false
            this.setData({
              cartNum: this.data.cartNum - 1
            })
          }, err => {
            this.data.btnDisable[id] = false
          })
        } else {
          this.editCart(id, cartItemId, quantity - 1).then(res => {
            this.data.btnDisable[id] = false
            this.setData({
              cartNum: this.data.cartNum - 1
            })
          }, err => {
            this.data.btnDisable[id] = false
          })
        }
        break
      default:
        this.data.btnDisable[id] = false
    }
  },

  //edit事件
  editCartFn(e) {
    this.getProductInfo(e.currentTarget.dataset.id)

  },

  //切换购物车列表
  cartListToggle() {
    if (Object.keys(this.data.cartListById).length === 0) return
    if (this.data.actionsheetShow) {
      this.asToggle()
    } else {
      this.getCartList().then(res => {
        this.asToggle()
      })
    }
  },


  //确认购买
  orderCreat: function(e) {
    let that = this
    if (e.detail.errMsg.indexOf('fail') > -1) {
      wx.showToast({
        title: '请授权用户信息!',
        icon: 'none'
      })
    } else {
      new member(res => {
        const globalMemberInfo = getApp().globalData.memberInfo
        globalMemberInfo.username = e.detail.userInfo.nickName
        globalMemberInfo.userhead = e.detail.userInfo.avatarUrl
        wx.showLoading({
          title: '提交中',
          mask: true
        })
        if (!this.data.actionsheetShow) {
          this.asToggle()
          wx.hideLoading()
          return
        }
        util.navigateTo({
          url: './pay/pay?shelvesNo=' + this.data.shelvesNo
        })
        wx.hideLoading()
      }).update({
        headImg: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    console.log('加载完成')
    this.data.options = options
    // if (options.scene && this.data.scope) {
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      this.getLocationSuccess(scene.split("#")[0])
      new Product(res => {
        new member(res2 => {
          wx.setStorageSync('tenantId', scene.split("#")[0])
          wx.setStorageSync('shelvesNo', res.data)
        }).saveShelf({
          appId: config.APPID,
          shelfNo: res.data,
          extensionId: ''
        })
        this.setData({
          tenantId: scene.split("#")[0],
          shelvesNo: res.data,
          canLoad: true
        })
        if (app.globalData.LOGIN_STATUS) {
          this.loginSuccessCallback()
        } else {
          app.loginOkCallbackList.push(() => {
            this.loginSuccessCallback()
          })
        }
        this.getCartList().then(res => {
          if (!res.cartItems || res.cartItems.length === 0) {
            this.setData({
              actionsheetShow: false
            })
          }
        })
      }).getShelfNoByCode({
        id: scene.split("#")[1]
      })
      
    }

  },
  loginSuccessCallback() {
    this.setData({
      mainColor: app.globalData.mainColor
    })
    var that = this

    //获取限时抢购商品
    new Product(res => {
      var len = res.data.length
      if (len == 0) {
        this.setData({
          limitLength: true
        })
      } else {
        this.setData({
          limitLength: false
        })
      }

      function time1() {
        var limitsell = res.data
        for (var i = 0; i < limitsell.length; i++) {
          // 活动是否已经开始
          var totalSecond = limitsell[i].beginDate / 1000 - Date.parse(new Date()) / 1000;
          // 活动是否已经结束
          var endSecond = limitsell[i].endDate / 1000 - Date.parse(new Date()) / 1000;
          // 秒数
          if (totalSecond < 0 && endSecond > 0) {
            var second = endSecond;
          } else {
            var second = totalSecond;
          }
          // 天数位
          var day = Math.floor(second / 3600 / 24);
          var dayStr = day.toString();
          if (dayStr.length == 1) dayStr = '0' + dayStr;
          // 小时位
          var hr = Math.floor((second - day * 3600 * 24) / 3600);
          // var hr = Math.floor(second / 3600);
          var hrStr = hr.toString();
          if (hrStr.length == 1) hrStr = '0' + hrStr;
          // 分钟位
          var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
          // var min = Math.floor((second - hr * 3600) / 60);
          var minStr = min.toString();
          if (minStr.length == 1) minStr = '0' + minStr;
          // 秒位
          var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
          // var sec = second - hr * 3600 - min * 60;
          var secStr = sec.toString();
          if (secStr.length == 1) secStr = '0' + secStr;
          totalSecond--;
          if (totalSecond < 0 && endSecond > 0) {
            limitsell[i].txt = '马上秒'
            limitsell[i].countDownDay = dayStr
            limitsell[i].countDownHour = hrStr
            limitsell[i].countDownMinute = minStr
            limitsell[i].countDownSecond = secStr
            that.setData({
              limitsell: limitsell
            });
          } else if (totalSecond > 0) {
            limitsell[i].txt = '即将开秒'
            limitsell[i].countDownDay = dayStr
            limitsell[i].countDownHour = hrStr
            limitsell[i].countDownMinute = minStr
            limitsell[i].countDownSecond = secStr
            that.setData({
              limitsell: limitsell
            });
          } else if (totalSecond < 0 && endSecond < 0) {
            limitsell[i].txt = '去看看'
            limitsell[i].countDownDay = '00'
            limitsell[i].countDownHour = '00'
            limitsell[i].countDownMinute = '00'
            limitsell[i].countDownSecond = '00'
            that.setData({
              limitsell: limitsell
            });
          }
        }
        that.setData({
          limitsell: limitsell,
        })
      }
      time1();
      this.data.myTime = setInterval(time1, 1000)

    }).listL({
      tenantId: this.data.tenantId
    })

    wx.setStorageSync('extension', '')
    //判断货架商品模板
    new CartShelves(res => {
      if (res.data == 'smallImage') {
        this.setData({
          showModel: 'smallImage'
        })
      } else {
        this.setData({
          showModel: 'bigImage'
        })
      }
    }).productModel({
      shelvesNo: this.data.shelvesNo
    })


    //每次进来清空购物车
    // new CartShelves(res => {}).clear({
    //   shelvesNo: this.data.shelvesNo,
    //   cartType: 'shelves'
    // })

    //商品列表
    new Product(res => {
      let list = res.data,
        listAll = []
      for (let i = 0; i < list.length; i++) {
        listAll = listAll.concat(list[i].productListModels)
      }
      if (listAll.length == 0) {
        console.log('跳转调试')
        wx.redirectTo({
          url: '/pages/home/home?tenantId=' + this.data.tenantId + '&topBack=false',
        })
      }
      this.setData({
        list,
        listAll,
        tagActiveId: res.data.length > 0 && res.data[0].id
      }, this.setActiveFloor)
    }).shelvesList({
      shelvesNo: this.data.shelvesNo,
      cartType: 'shelves',
      tenantId: this.data.tenantId,
      appid: config.APPID
    })


    //获取购物车
    this.getCartList().then(({
      storeName,
      address,
      headImg
    }) => {
      wx.setStorageSync('storeName', storeName)
      // wx.setNavigationBarTitle({
      //   title: storeName
      // })
      this.setData({
        storeName,
        address,
        headImg
      })
    })

    //是否显示优惠券
    new coupon(data => {
      this.setData({
        couponShow: data.data
      })

    }).tenantCoupon({
      tenantId: this.data.tenantId
    })

    //加载优惠券
    new coupon(data => {
      var item = [];
      var couponList = data.data
      this.setData({
        couponList: couponList
      });
    }).listT({
      tenantId: this.data.tenantId
    });

    // 记录用户浏览记录
    new member(function () { }).tenatBrowseHistory({
      tenantId: this.data.tenantId
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //设置winheigh
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winHeight: res.windowHeight
        })
      }
    })
  },

  adTap(e) {
    let linkid = e.currentTarget.dataset.linkid
    if (!linkid) return
    util.navigateTo({
      url: '/pages/product/details/details?id=' + linkid,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    // that.onLoad(options)
    that.onLoad(that.data.options)
    //商品列表
    // new Product(res => {
    //   let list = res.data,
    //     listAll = []
    //   for (let i = 0; i < list.length; i++) {
    //     listAll = listAll.concat(list[i].productListModels)
    //   }
    //   if (listAll.length == 0) {
    //     console.log('跳转调试')
    //     wx.redirectTo({
    //       url: '/pages/home/home?tenantId=' + this.data.tenantId,
    //     })
    //   }
    //   this.setData({
    //     list,
    //     listAll,
    //     tagActiveId: res.data.length > 0 && res.data[0].id
    //   }, this.setActiveFloor)
    // }).shelvesList({
    //   shelvesNo: that.data.shelvesNo,
    //   cartType: 'shelves',
    //   tenantId: that.data.tenantId,
    //   appid: config.APPID
    // })
    wx.getSetting({
      success(res) {
        wx.hideToast();
        if (that.data.canLoad) {
          that.getCartList().then(res => {
            if (!res.cartItems || res.cartItems.length === 0) {
              that.setData({
                actionsheetShow: false
              })
            }
          })
        }
      }
    })
    

   



  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // this.setData({
    //   hidePage: true
    // })
    clearInterval(this.data.myTime)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.myTime)
    new CartShelves(res => {
    }).clear({
      shelvesNo: wx.getStorageSync('shelvesNo'),
      cartType: 'shelves'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  goTenant(){
    var that = this
    wx.navigateTo({
      url: '/pages/home/home?tenantId=' + that.data.tenantId,
    })
  },
  scrollBottom() {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {



  },
  //分享
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮

    }
    return {
      title: '好友给您的分享',
      path: 'pages/home/home?&extension=' + app.globalData.memberInfo.id + '&shelvesNo=' + wx.getStorageSync('shelvesNo')+'&tenantId='+that.data.tenantId,
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
  // 获取商品规格资料
  getProductInfo(id) {
    new Product((res) => {
      this.setData({
        showAction: true
      })
      let select = res.data.specification,
        all = res.data.specifications,
        selectList = res.data.productSpecifications,
        selectArr = []
      if (select.length == 1) {
        selectArr = [select[0].specificationValueId]
      } else if (select.length == 2) {
        selectArr = [select[0].specificationValueId, select[1].specificationValueId]
      }
      this.setData({
        productData: res.data,
        selectArr: selectArr,
        specification: {
          select: res.data.specification,
          all: res.data.specifications,
          selectList: res.data.productSpecifications,
        }
      })
      this.getSpecifications();
      setTimeout(res => {
        this.setData({
          pageLoad: true
        })
      }, 200)
    }).view({
      id: id,
      appid: config.APPID,
      tenantId: this.data.tenantId
    })
  },

  //可选组合判断并修改值
  getSpecifications() {
    let selectArr = this.data.selectArr,
      selectList = this.data.specification.selectList,
      canClick = {},
      selectData = {},
      len = selectArr.length
    if (len === 0) {
      selectData = this.data.specification.selectList[0]
      selectData.quantity = selectData.cartItemQuantity == 0 ? selectData.minReserve : selectData.cartItemQuantity
      this.setData({
        selectData: selectData
      })
    } else if (len === 1) {

      for (let i = 0, j = selectList.length; i < j; i++) {
        if (selectList[i].specifications[0].specificationValueId == selectArr[0]) {
          selectData = selectList[i]
          break
        }
      }
      selectData.quantity = selectData.cartItemQuantity == 0 ? selectData.minReserve : selectData.cartItemQuantity
      this.setData({
        selectData: selectData
      })
    } else if (len === 2) {
      selectArr.forEach((val, idx) => {
        selectList.forEach((vals, idxs) => {
          if (val == vals.specifications[idx].specificationValueId) {
            if (selectArr[1 - idx] == vals.specifications[1 - idx].specificationValueId) {
              selectData = vals
            }
            if (!canClick[val]) canClick[val] = []
            canClick[val].push(vals.specifications[1 - idx].specificationValueId)
          }
        })
      })
      this.data.canClick = canClick
      selectData.quantity = selectData.cartItemQuantity == 0 ? selectData.minReserve : selectData.cartItemQuantity
      this.data.selectData = selectData
      this.setData({
        canClick: this.data.canClick,
        selectData: this.data.selectData
      })
    }
  },
  //选择规格
  checkout(e) {
    let id = e.currentTarget.dataset.id,
      idx = e.currentTarget.dataset.idx,
      can = e.currentTarget.dataset.can
    if (!can) return
    if (id == this.data.selectArr[idx]) {
      this.data.selectArr[idx] = ''
    } else {
      this.data.selectArr[idx] = id
    }
    this.setData({
      selectArr: this.data.selectArr
    })
    this.getSpecifications()
  },
  revisenum(e) {
    let stype = e.currentTarget.dataset.type,
      min = this.data.selectData.minReserve,
      max = this.data.selectData.availableStock,
      quantity = parseInt(this.data.selectData.quantity)

    switch (stype) {
      case 'input':
        quantity = (!isNaN(e.detail.value) && e.detail.value >= min && e.detail.value <= max) ? e.detail.value : this.data.selectData.quantity
        break;
      case 'add':
        quantity = quantity + 1 <= max ? (quantity < min ? min : ++quantity) : max
        if (quantity == max) {
          wx.showToast({
            title: '已达最大库存',
          })
        }
        break;
      case 'reduce':
        quantity = quantity - 1 < min ? 0 : --quantity
        break;
    }
    this.data.selectData.quantity = quantity
    this.setData({
      selectData: this.data.selectData
    })
  },
  //加入购物车确认按钮
  paySubmit: function() {
    let that = this;
    for (var i = 0; i < that.data.selectArr.length; i++) {
      if (!that.data.selectArr[i]) {
        wx.showToast({
          title: '请选择' + that.data.specification.all[i].name,
          icon: 'none'
        })
        return false
      }
    }
    var id = that.data.selectData.id
    if (that.data.btnDisable[id]) return
    that.data.btnDisable[id] = true
    that.addCart(id, that.data.selectData.quantity).then(res => {
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1000
      })
      that.setData({
        showAction: false
      })
      that.data.btnDisable[id] = false
    }, err => {
      that.data.btnDisable[id] = false
      delete that.data.cartListById[id]
    })



  },
  //弹出框toggle
  toggleMask(e) {
    this.setData({
      showAction: !this.data.showAction,
    })
  },
  // paySubmit: function () {
  //   let that = this;
  //   for (var i = 0; i < that.data.selectArr.length; i++) {
  //     if (!that.data.selectArr[i]) {
  //       wx.showToast({
  //         title: '请选择' + that.data.specification.all[i].name,
  //         icon: 'none'
  //       })
  //       return false
  //     }
  //   }
  //   var id = that.data.selectData.id
  //   if (that.data.btnDisable[id]) return
  //   that.data.btnDisable[id] = true
  //   that.addCart(id, that.data.selectData.quantity).then(res => {
  //     wx.showToast({
  //       title: '添加成功',
  //       icon: 'success',
  //       duration: 1000
  //     })
  //     that.setData({
  //       showAction: false
  //     })
  //     that.data.btnDisable[id] = false
  //   }, err => {
  //     that.data.btnDisable[id] = false
  //     delete that.data.cartListById[id]
  //   })
  // },


 //立即购买
  buyCreat: function(e) {
    let that = this
    if (e.detail.errMsg.indexOf('fail') > -1) {
      wx.showToast({
        title: '请授权用户信息!',
        icon: 'none'
      })
    } else {
      for (var i = 0; i < that.data.selectArr.length; i++) {
        if (!that.data.selectArr[i]) {
          wx.showToast({
            title: '请选择' + that.data.specification.all[i].name,
            icon: 'none'
          })
          return false
        }
      }
      var id = that.data.selectData.id
      if (that.data.btnDisable[id]) return
      that.data.btnDisable[id] = true



      //添加购物车
      // addCart(id, quantity) {
      //   return new Promise((resolve, reject) => {
      //     new CartShelves(res => {
      //       this.getCartList().then(() => {
      //         resolve && resolve(res)
      //       })
      //     }, (err) => {
      //       reject && reject(err)
      //     }).add({
      //       'type': 'buy',
      //       'quantity': quantity || 1,
      //       id,
      //       shelvesNo: this.data.shelvesNo,
      //       cartType: 'shelves'
      //     })
      //   })
      // }



      new CartShelves(function () {
        that.setData({
          showAction: false
        })
        
        new member(res => {
          const globalMemberInfo = getApp().globalData.memberInfo
          globalMemberInfo.username = e.detail.userInfo.nickName
          globalMemberInfo.userhead = e.detail.userInfo.avatarUrl
          wx.showLoading({
            title: '提交中',
            mask: true
          })
          that.setData({
            showAction: false
          })
          // if (!this.data.actionsheetShow) {
          //   this.asToggle()
          //   wx.hideLoading()
          //   return
          // }
          util.navigateTo({
            url: './pay/pay?shelvesNo=' + that.data.shelvesNo
          })
          wx.hideLoading()
        }).update({
          headImg: e.detail.userInfo.avatarUrl,
          nickName: e.detail.userInfo.nickName
        })
        that.data.btnDisable[id] = false


      }).add({
        'type': 'buy',
        'quantity': that.data.selectData.quantity || 1,
        id:id,
        shelvesNo: that.data.shelvesNo,
        cartType: 'shelves'
      })


      // that.addCart(id, that.data.selectData.quantity).then(res => {
      //   new member(res => {
      //     const globalMemberInfo = getApp().globalData.memberInfo
      //     globalMemberInfo.username = e.detail.userInfo.nickName
      //     globalMemberInfo.userhead = e.detail.userInfo.avatarUrl
      //     wx.showLoading({
      //       title: '提交中',
      //       mask: true
      //     })
      //     that.setData({
      //       showAction: false
      //     })
      //     // if (!this.data.actionsheetShow) {
      //     //   this.asToggle()
      //     //   wx.hideLoading()
      //     //   return
      //     // }
      //     util.navigateTo({
      //       url: './pay/pay?shelvesNo=' + this.data.shelvesNo
      //     })
      //     wx.hideLoading()
      //   }).update({
      //     headImg: e.detail.userInfo.avatarUrl,
      //     nickName: e.detail.userInfo.nickName
      //   })
      //   that.data.btnDisable[id] = false
      // }, err => {
      //   that.data.btnDisable[id] = false
      //   delete that.data.cartListById[id]
      // })
    }
  }
  
}))
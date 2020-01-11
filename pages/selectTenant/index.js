// pages/home/home.js

let swiperAutoHeight = require("../../template/swiperIndex/swiper.js"),
  Product = require("../../service/product.js"),
  Cart = require("../../service/cart.js"),
  member = require("../../service/member.js"),
  config = require('../../utils/config'),
  Coupon = require("../../service/coupon.js"),
  Tenant = require("../../service/tenant.js"),
  Ad = require("../../service/ad.js"),
  app = getApp(),
  util = require("../../utils/util.js"),
  navCart = require("../../template/cart/cart.js")

Page(Object.assign({}, swiperAutoHeight, navCart, {

  /**
   * 页面的初始数据
   */
  data: {
    scrollTo: null, //页面跳转到
    hotsell: [], //热销商品
    newsell: [], //新品
    recommendsell: [], //推荐商品
    limitsell: [],
    sys: app.globalData.sys,
    paging: {
      recommend: {},
      hotsell: {},
      newsell: {}
    },
    scrollX: true,
    homeLoadReady: false,
    storyTitle: '',
    toUpShow: false,
    nav: [],
    hotLength: '',
    recommendLength: '',
    newLength: '',
    limitLength: '',
    showShareBtn: false,
    showNav: true,
    canvasw: '0px',
    canvash: '0px',
    canvasHide: true,
    topBack: true
  },
  onReady() {
    this.setData({
      winHeight: wx.getSystemInfoSync().windowHeight
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.hideShareMenu()
    new Tenant(res => {
      this.setData({
        tenantData: res.data,
        tenantId: res.data.id
      })
      wx.setNavigationBarTitle({
        // title: wx.getStorageSync('storeName') ? wx.getStorageSync('storeName') : res.data.name
        title: res.data.fullName
      })
      
      if (app.globalData.LOGIN_STATUS) {
        this.getData()
      } else {
        app.loginOkCallbackList.push(() => {
          this.getData()
        })
      }
    }).excellentStore({
      shelvesNo: wx.getStorageSync('shelvesNo')
    })



   
  },
  //跳转详情页
  toDetail(e) {
    let id = e.currentTarget.dataset.id
    util.navigateTo({
      url: '/pages/product/details/details?id=' + id,
    })
  },



  //加入购物车
  addCart(e) {
    let id = e.currentTarget.dataset.id

    new Cart((res) => {

    }).add({
      id: id,
      quantity: 1
    })
  },

  //获取数据
  getData() {
    wx.showShareMenu()
    let that = this,
      promiseList = []
    //商家小程序码和分享海报获取
    new Tenant(res => {
      console.log('获取海报1111')
      if (res.data.poster) {
        //获取海报图片宽高
        wx.getImageInfo({
          src: res.data.poster ? res.data.poster.replace('http', 'https') : '',
          success(res) {
            that.setData({
              imageWidth: res.width / 2,
              imageHeight: res.height / 2
            })
            console.log('获取海报22222')
          }
        })

        //获取海报图片临时地址
        wx.downloadFile({
          url: res.data.poster ? res.data.poster.replace('http', 'https') : '',
          success: function(res2) {
            that.data.shareTenantBg = res2.tempFilePath
            console.log('获取海报成功')
            console.log(that.data.showShareBtn)
            that.setData({
              showShareBtn: res.data.poster ? true : false
            })
          }
        })
      }
      if (res.data.appletQrcode) {
        //获取小程序码图片临时地址
        wx.downloadFile({
          url: res.data.appletQrcode ? res.data.appletQrcode.replace('http', 'https') : '',
          success: function(res) {
            that.data.qrcode = res.tempFilePath
          }
        })
      }
    }).tenantShare({
      tenantId: that.data.tenantId,
      shelvesNo: wx.getStorageSync('shelvesNo')
    })
    // 记录用户浏览记录
    new member(function() {}).tenatBrowseHistory({
      tenantId: that.data.tenantId,
    })
    //广告位(顶部)
    promiseList.push(new Promise((resolve, reject) => {
      new Ad(res => {
        resolve(res)
      }).doT(80, that.data.tenantId)
    }))

    // //商家数据
    // promiseList.push(new Promise((resolve, reject) => {
    //   new Tenant(res => {
    //     this.setData({
    //       tenantData: res.data
    //     })
    //     wx.setNavigationBarTitle({
    //       // title: wx.getStorageSync('storeName') ? wx.getStorageSync('storeName') : res.data.name
    //       title: res.data.name
    //     })
    //     resolve(res)
    //   }).view({
    //     shelvesNo: wx.getStorageSync('shelvesNo')
    //   })
    // }))

    Promise.all(promiseList).then(res => {
      this.setData({
        topImgs: {
          data: res[0].data.length === 0 ? [{
            image: res[1].data.thumbnail
          }] : res[0].data,
          key: 'image'
        }
      })
      setTimeout(() => {
        this.setData({
          homeLoadReady: true
        })
      }, 500)
    }, err => {
      this.setData({
        homeLoadReady: true
      })
    })

    //加载优惠券
    new Coupon(data => {
      var item = [];
      var couponList = data.data
      this.setData({
        couponList: couponList
      });
    }).listT({
      tenantId: that.data.tenantId
    });

    //获取热销商品
    new Product(res => {
      this.data.paging.hotsell = res.pageModel
      var len = res.data.length
      if (len == 0) {
        this.data.shows = false
        this.setData({
          hotLength: true
        })
      } else {
        this.data.shows = true
        this.setData({
          hotLength: false
        })
      }
      this.setData({
        hotsell: res.data,
        paging: this.data.paging,
        showHot: this.data.shows
      })
      if (res.pageModel.pageNumber < res.pageModel.totalPages) {
        this.setData({
          hotsellTips: '加载更多'
        })
      } else {
        this.setData({
          hotsellTips: ''
        })
      }
    }).listT({
      id: that.data.tenantId,
      pageSize: 10,
      tagIds: 1
    })


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
          // limitsell[i].beginDate = util.formatTimeTwo(limitsell[i].beginDate, 'Y/M/D h:m:s')
          // limitsell[i].endDate = util.formatTimeTwo(limitsell[i].endDate, 'Y/M/D h:m:s')

          // 活动是否已经开始
          var totalSecond = limitsell[i].beginDate / 1000 - Date.parse(new Date()) / 1000;
          // 活动是否已经结束
          var endSecond = limitsell[i].endDate / 1000 - Date.parse(new Date()) / 1000;

          // var interval = setInterval(function() {
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
            clearInterval(time1);
            // wx.showToast({
            //   title: '活动已结束',
            // });
            limitsell[i].txt = '去看看'
            limitsell[i].countDownDay = '00'
            limitsell[i].countDownHour = '00'
            limitsell[i].countDownMinute = '00'
            limitsell[i].countDownSecond = '00'
            that.setData({
              limitsell: limitsell
            });
          }
          // }.bind(this), 1000);
        }

        that.setData({
          limitsell: limitsell,
        })
      }

      time1();
      var timer = setInterval(time1, 1000);

    }).listL({
      tenantId: that.data.tenantId
    })


    //频道分类
    new Tenant(data => {
      this.setData({
        nav: data.data
      })
    }).productCategoryTree({
      tenantId: that.data.tenantId
    })
    //更多推荐
    // new Product((data) => {
    //   this.setData({
    //     tenantRecomList: data.data,
    //     pageModel: data.pageModel
    //   })
    // }).recommend({
    //   id: this.data.id,
    //   pageNumber: 1,
    //   pageSize: 6
    // })


    //品牌故事
    // new Tenant(data => {
    //   this.setData({
    //     storyTitle: data.data.title,
    //     storyId: app.globalData.tenantId
    //   })
    // }).article({ id: app.globalData.tenantId })

    //获取新品商品
    new Product(res => {
      this.data.paging.newsell = res.pageModel
      var len = res.data.length
      if (len == 0) {
        this.data.shows = false
        this.setData({
          newLength: true
        })
      } else {
        this.data.shows = true
        this.setData({
          newLength: false
        })
      }
      this.setData({
        newsell: res.data,
        paging: this.data.paging,
        // showRecommd: this.data.shows,
        pageModel: res.pageModel
      })
    }).listT({
      id: that.data.tenantId,
      pageSize: 8,
      pageNumber: 1,
      tagIds: 2
    })



    // new Product(res => {
    //   this.data.paging.newsell = res.pageModel
    //   var len = res.data.length
    //   if (len == 0) {
    //     this.data.shows = false
    //   } else {
    //     this.data.shows = true
    //   }
    //   this.setData({
    //     newsell: res.data,
    //     paging: this.data.paging,
    //     showNew: this.data.shows
    //   })
    //   if (res.pageModel.pageNumber < res.pageModel.totalPages) {
    //     this.setData({
    //       newsellTips: '加载更多'
    //     })
    //   } else {
    //     this.setData({
    //       newsellTips: ''
    //     })
    //   }
    // }).listT({
    //   id: app.globalData.tenantId,
    //   pageSize: 10,
    //   tagIds: 2
    // })







    //获取推荐商品
    new Product(res => {
      this.data.paging.recommend = res.pageModel
      var len = res.data.length
      if (len == 0) {
        this.setData({
          recommendLength: true
        })
      } else {
        this.setData({
          recommendLength: false
        })
      }
      this.setData({
        recommendsell: res.data,
        paging: this.data.paging,
        // showRecommd: this.data.shows,
        pageModel: res.pageModel
      })
      if (res.pageModel.pageNumber < res.pageModel.totalPages) {
        this.setData({
          recommendsellTips: '加载更多'
        })
      } else {
        this.setData({
          recommendsellTips: ''
        })
      }
    }).listT({
      id: that.data.tenantId,
      pageSize: 10,
      tagIds: 5
    })

    //广告位(故事下)
    // new Ad(res => {
    //   this.setData({
    //     storyAdImgs: res.data
    //   })
    // }).doT(211, app.globalData.tenantId)

    //广告位(促销)
    new Ad(res => {
      var len = res.data.length
      if (len == 0) {
        this.data.shows = false
      } else {
        this.data.shows = true
      }
      this.setData({
        promotionAdImgs: {
          data: res.data,
          key: 'image',
          show: this.data.shows
        }
      })
    }).doT(214, that.data.tenantId)

    // 广告位(新品)
    new Ad(res => {
      var len = res.data.length
      if (len == 0) {
        this.data.shows = false
      } else {
        this.data.shows = true
      }
      this.setData({
        newproductAdImgs: {
          data: res.data,
          key: 'image',
          show: this.data.shows
        }
      })
    }).doT(213, that.data.tenantId)

    //广告位(推荐)
    new Ad(res => {
      var len = res.data.length
      if (len == 0) {
        this.data.shows = true
      } else {
        this.data.shows = false
      }
      this.setData({
        recommendAdImgs: {
          data: res.data,
          key: 'image',
          show: this.data.shows
        }
      })
    }).doT(215, that.data.tenantId)


    //进店成为会员
    new Tenant(res => {

    }).becomeVip({
      id: that.data.tenantId,
      extension: wx.getStorageSync('extension')
    })





  },


  specialtoupper: function(e) {
    var that = this
    console.log('商家：' + that.data.tenantId)
    this.setData({
      scrollX: false
    })
    var tagIds = e.currentTarget.dataset.tagids;
    if (tagIds == '1') {
      this.setData({
        hotsellTipsLoad: true
      })
      var pageModel = this.data.paging.hotsell;
      var hotsell = this.data.hotsell;
      new Product((res) => {
        hotsell = hotsell.concat(res.data)
        this.setData({
          scrollX: true,
          hotsell: hotsell,
          hotsellTipsLoad: false
        });
        if (res.pageModel.totalPages < res.pageModel.pageNumber) {
          this.setData({
            hotsellTips: '',
          })
        }
      }).listT({
        id: that.data.tenantId,
        pageSize: 10,
        tagIds: tagIds,
        pageNumber: ++pageModel.pageNumber
      })
    } else if (tagIds == '2') {
      this.setData({
        newsellTipsLoad: true
      })
      var pageModel = this.data.paging.newsell;
      var newsell = this.data.newsell;
      new Product((res) => {
        newsell = newsell.concat(res.data)
        this.setData({
          newsell: newsell,
          newsellTipsLoad: false
        })
        if (res.pageModel.totalPages < res.pageModel.pageNumber) {
          this.setData({
            newsellTips: '',
          })
        }
      }).listT({
        id: that.data.tenantId,
        pageSize: 8,
        tagIds: tagIds,
        pageNumber: ++pageModel.pageNumber
      })
    } else if (tagIds == '5') {
      this.setData({
        recommendsellTipsLoad: true
      })
      var pageModel = this.data.paging.recommend;
      var recommendsell = this.data.recommendsell;


      // console.log(pageModel.pageSize)
      new Product((res) => {
        this.setData({
          scrollX: true
        })
        wx.hideToast()
        recommendsell = recommendsell.concat(res.data)
        console.log(pageModel.pageNumber)
        console.log(recommendsell.length)

        this.setData({
          recommendsell: recommendsell,
          recommendsellTipsLoad: false
        })
        if (res.pageModel.totalPages < res.pageModel.pageNumber) {
          this.setData({
            recommendsellTips: '没有更多啦~',
          })
        }
      }).listT({
        id: that.data.tenantId,
        pageSize: 10,
        tagIds: tagIds,
        pageNumber: ++pageModel.pageNumber
      })
    }

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  // toLower: function () {
  //   var that = this;
  //   wx.showNavigationBarLoading();
  //   var pageModel = this.data.pageModel;
  //   var recommendsell = this.data.recommendsell;
  //   new Product(function (data) {
  //     wx.hideNavigationBarLoading() //完成停止加载
  //     if (data.pageModel.totalPages < data.pageModel.pageNumber) {
  //       that.setData({
  //         tips: '',
  //         showtips: false
  //       })
  //     } else {
  //       recommendsell = recommendsell.concat(data.data)
  //       that.setData({
  //         recommendsell: recommendsell,
  //         loading: false,
  //         tips: '努力加载中',
  //         showtips: false
  //       })
  //     }
  //   }).listT({
  //     id: app.globalData.tenantId,
  //     pageNumber: ++pageModel.pageNumber,
  //     pageSize: 10,
  //     tagIds: 5
  //   })
  // },

  /**
   * 页面上拉触底事件的处理函数
   */

  onReachBottom: function() {
    var that = this;
    wx.showNavigationBarLoading();
    // var pageModel = this.data.pageModel;
    var newPageModel = this.data.paging.newsell;
    var newsell = this.data.newsell;
    new Product(function(data) {
      wx.hideNavigationBarLoading() //完成停止加载
      if (data.pageModel.totalPages < data.pageModel.pageNumber) {
        that.setData({
          tips: '',
          showtips: false
        })
      } else {
        newsell = newsell.concat(data.data)
        that.setData({
          newsell: newsell,
          loading: false,
          tips: '努力加载中',
          showtips: false
        })
      }
    }).listT({
      id: that.data.tenantId,
      pageNumber: ++newPageModel.pageNumber,
      pageSize: 8,
      tagIds: 2
    })
  },





  //加载更多商品
  loadingMore: function(e) {
    var tagIds = e.currentTarget.dataset.tagids;
    if (tagIds == '1') {
      this.setData({
        hotsellTipsLoad: true
      })
      var pageModel = this.data.paging.hotsell;
      var hotsell = this.data.hotsell;
      new Product((res) => {
        hotsell = hotsell.concat(res.data)
        this.setData({
          hotsell: hotsell,
          hotsellTipsLoad: false
        });
        if (res.pageModel.totalPages < res.pageModel.pageNumber) {
          this.setData({
            hotsellTips: '',
          })
        }
      }).listT({
        id: that.data.tenantId,
        pageSize: 10,
        tagIds: tagIds,
        pageNumber: ++pageModel.pageNumber
      })
    } else if (tagIds == '2') {
      this.setData({
        newsellTipsLoad: true
      })
      var pageModel = this.data.paging.newsell;
      var newsell = this.data.newsell;
      new Product((res) => {
        newsell = newsell.concat(res.data)
        this.setData({
          newsell: newsell,
          newsellTipsLoad: false
        })
        if (res.pageModel.totalPages < res.pageModel.pageNumber) {
          this.setData({
            newsellTips: '',
          })
        }
      }).listT({
        id: that.data.tenantId,
        pageSize: 8,
        tagIds: tagIds,
        pageNumber: ++pageModel.pageNumber
      })
    } else if (tagIds == '5') {
      this.setData({
        recommendsellTipsLoad: true
      })
      var pageModel = this.data.paging.recommend;
      var recommendsell = this.data.recommendsell;
      new Product((res) => {
        recommendsell = recommendsell.concat(res.data)
        this.setData({
          recommendsell: recommendsell,
          recommendsellTipsLoad: false
        })
        if (res.pageModel.totalPages < res.pageModel.pageNumber) {
          this.setData({
            recommendsellTips: '没有更多啦~',
          })
        }
      }).listT({
        id: that.data.tenantId,
        pageSize: 10,
        tagIds: tagIds,
        pageNumber: ++pageModel.pageNumber
      })
    }

  },

  technical() {
    // wx.navigateTo({
    //   url: '/pages/technical/technical',
    // })
  },



  onPageScroll: function(e) { // 获取滚动条当前位置
    if (e.scrollTop > 150) {
      this.setData({
        toUpShow: true
      })
    } else {
      this.setData({
        toUpShow: false
      })
    }
  },
  scrollto() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
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
  },
  // scroll({ detail }) {
  //   if (detail) {
  //     this.setData({
  //       toUpShow: detail.scrollTop > 150
  //     })
  //   }
  // },
  // scrollto(e) {
  //   let to = e.currentTarget.dataset.to
  //   this.setData({
  //     scrollTo: to
  //   })
  // },
  /**
   * 品牌故事跳转
   */
  storyView: function(e) {
    var that = this;
    new Tenant(function(data) {
      util.navigateTo({
        url: './article/article?id=' + that.data.storyId
      })
    }).article({
      id: that.data.tenantId
    })
  },
  /**
   * 领取优惠券
   */

  receiveCoupon: function(e) {

    let id = e.currentTarget.dataset.id
    var that = this;
    new Coupon(function(data) {
      new Coupon(function(data) {
        var item = [];
        var couponList = data.data
        that.setData({
          couponList: couponList
        });
      }).listT({
        tenantId: that.data.tenantId
      });

      wx.showToast({
        title: '领取成功',
        icon: 'success',
        duration: 2000
      })
    }).pickup({
      id: id
    })
  },
  searchWord(e) {
    this.setData({
      searchWord: e.detail.value
    })
  },
  searchImg() {
    util.navigateTo({
      url: '/pages/product/productList/productList?keyWord=' + this.data.searchWord + '&page=index'
    })
  },
  // 搜索商品
  searchProduct: function(e) {
    util.navigateTo({
      url: '/pages/product/productList/productList?tenantId=' + this.data.tenantId + '&keyWord=' + e.detail.value + '&page=index'
    })
  },
  toList() {
    util.navigateTo({
      url: '/pages/product/productList/productList?tenantId=' + this.data.tenantId + '&keyWord=&page=index'
    })
  },
  adTap(e) {
    let linkid = e.currentTarget.dataset.linkid
    if (!linkid) return
    util.navigateTo({
      url: '/pages/product/details/details?id=' + linkid,
    })
  },

  //首页扫一扫进商品详情
  wxscan: function() {
    wx.scanCode({
      success: (res) => {
        util.navigateTo({
          url: '/pages/product/details/details?id=' + res.result,
        })
      }
    })
  },
  //分享
  onShareAppMessage: function(res) {
    // console.log(app.globalData.memberInfo.id)
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮

    }
    return {
      title: that.data.tenantData.fullName,
      path: 'pages/home/home?extension=' + app.globalData.memberInfo.id + '&shelvesNo=' + wx.getStorageSync('shelvesNo') + '&tenantId=' + this.data.tenantId +'&topBack=false',
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
  //跳转
  toDetail(e) {
    if (e.detail.formId) {
      new member(res => {

      }).addFormId({
        formIds: e.detail.formId
      })
    }
    let id = e.currentTarget.dataset.id
    util.navigateTo({
      url: '/pages/product/productList/productList?tenantId=' + this.data.tenantId + '&page=cate&cateid=' + id,
    })
  },
  __pt_toDetail(e) {
    wx.navigateTo({
      url: '/pages/product/details/details?id=' + e.currentTarget.dataset.id,
    })
  },

  // 打开店铺信息
  goTenantInfo() {
    var that = this
    wx.navigateTo({
      url: "/pages/home/tenant/info?tenantId=" + that.data.tenantId
    })
  },
  //点击分享获取商家海报
  shareTenant(e) {
    var that = this
    if (e.detail.errMsg.indexOf('fail') > -1) {
      wx.showToast({
        title: '请授权用户信息!',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '海报生成中~',
      })
      setTimeout(function() {
        wx.hideLoading()
      }, 10000)
      console.log(e.detail.userInfo.nickName)
      //获取用户头像昵称
      new member(res => {
        that.setData({
          nickName: e.detail.userInfo.nickName
        })
        wx.downloadFile({
          url: e.detail.userInfo.avatarUrl,
          success: function(res) {
            that.setData({
              headImg: res.tempFilePath,
            })
            that.setData({
              canvasHide: false,
              canvasw: that.data.imageWidth + 'px',
              canvash: that.data.imageHeight + 'px'
            })
            var w = that.data.imageWidth;
            var h = that.data.imageHeight;
            const ctx = wx.createCanvasContext('myCanvas')
            ctx.beginPath()
            ctx.fillRect(0, 0, w, h)
            ctx.drawImage(that.data.shareTenantBg, 0, 0, w, h) //商家海报底图
            ctx.save();
            //头像裁剪成圆形
            // ctx.arc(0.4 * w + 0.2 * w / 2, 0.05 * w + 0.2 * w / 2, 0.2 * w / 2, 0, 2 * Math.PI);
            // ctx.setStrokeStyle('#ffffff')
            // ctx.clip();
            ctx.drawImage(that.data.headImg, 0.09 * w, 0.78 * h, 0.12 * w, 0.12 * w) //头像
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            //canvas推荐人昵称头像填充
            ctx.setTextAlign('center')
            ctx.setFillStyle('rgb(255,255, 255)')
            ctx.setFontSize(16)
            // ctx.fillText(that.data.nickName, w / 2, 0.3 * w)
            ctx.drawImage(that.data.qrcode, 0.63 * w, 0.78 * h, 0.3 * w, 0.3 * w)
            ctx.draw();
            setTimeout(function() {
              //将cavas变成图片
              wx.canvasToTempFilePath({
                //通过id 指定是哪个canvas
                canvasId: 'myCanvas',
                success(res) {
                  wx.hideTabBar()
                  wx.hideLoading()
                  that.setData({
                    canvasHide: true,
                    showAction: true,
                    shareImageSrc: res.tempFilePath
                  })
                }
              })
            }, 500)
          }
        })
      }).view()
    }
  },
  //关闭分享弹窗
  closeMask() {
    wx.showTabBar()
    this.setData({
      canvasHide: true,
      showAction: !this.data.showAction
    })
  },
  //保存图片
  saveImage() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImageSrc,
      success: function(res) {
        wx.showToast({
          title: '图片已保存相册',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {

      }
    })
  },
  // 防止滑动穿透
  stopPageScroll() {
    return false
  }
}))
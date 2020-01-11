let swiperAutoHeight = require("../../template/swiperIndex/swiper.js"),
  Category = require('../../service/category'),
  Product = require("../../service/product.js"),
  Cart = require("../../service/cart.js"),
  Coupon = require("../../service/coupon.js"),
  Tenant = require("../../service/tenant.js"),
  lbs = require('../../service/lbs.js'),
  Ad = require("../../service/ad.js"),
  member = require("../../service/member.js"),
  app = getApp(),
  config = require('../../utils/config'),
  util = require("../../utils/util.js")

Page(Object.assign({}, swiperAutoHeight, {
  /**
   * 页面的初始数据
   */
  data: {
    scrollTo: '', //页面跳转到
    sys: app.globalData.sys,
    homeLoadReady: false,
    winHeight: 0, //用于scroll-view高度
    bottomHeight: 60, //用于scroll-view高度，当显示bottom
    storyTitle: '',
    pageNumber: 1,
    toUpShow: false,
    showSearch: true,
    articleList: [],
    communityId: 211,
    limitPage: 0,
    limitTotalPage: 0,
    scrollX: true,
    newDots: false,
    channelListDots: false,
    showShareBtn: false,
    canvasHide: true,
    // shareImg:[],
    shareImages: [],
    currentIndex: 0,
    drawList:[]
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
    // if (options.scene && !options.extension) {
    //   var scene = decodeURIComponent(options.scene)
    //   console.log('货架号：'+scene.split("#")[0])
    //   wx.setStorageSync('shelvesNo', scene.split("#")[0])
    //   wx.setStorageSync('extension', scene.split("#")[1])
    //   new member(res => {}).saveShelf({
    //     appId: config.APPID,
    //     shelfNo: scene.split("#")[0] ? scene.split("#")[0] : '',
    //     extensionId: scene.split("#")[1] ? scene.split("#")[1] : ''
    //   })
    // } else {
    //   var extension = options.extension;
    //   if (extension) {
    //     wx.setStorageSync('extension', extension)
    //   }
    //   if (options.shelvesNo) {
    //     wx.setStorageSync('shelvesNo', options.shelvesNo)
    //   }
    //   new member(res => {}).saveShelf({
    //     appId: config.APPID,
    //     shelfNo: options.shelvesNo ? options.shelvesNo : '',
    //     extensionId: options.extension ? options.extension : ''
    //   })
    // }
    if (app.globalData.LOGIN_STATUS) {
      this.getData(options)
    } else {
      app.loginOkCallbackList.push(() => {
        this.getData(options)
      })
    }
  },
  //设置顶部背景（红色）距离顶部的距离
  scroll(e) {
    this.data.scroll = e.detail.scrollTop
    this.setData({
      toUpShow: e.detail.scrollTop > 650,
      topBg: -360 - e.detail.scrollTop,
    })
  },
  touchstart: function(e) {
    this.data.startTouches = e.changedTouches[0]
  },
  touchmove: function(e) {
    this.data.moveTouches = e.changedTouches[0]
  },
  touchend: function(e) {
    var startTouch = this.data.startTouches,
      Y = e.changedTouches[0].pageY - startTouch.pageY,
      X = Math.abs(e.changedTouches[0].pageX - startTouch.pageX)

    if (this.data.scroll > 10) {
      return false
    }
    this.data.endTouches = e.changedTouches[0]
    if (Y > 50 && X < 200) {
      wx.startPullDownRefresh()
      wx.showLoading({
        title: '刷新中',
      })
      this.getDataRefresh()
    }
  },

  onPullDownRefresh: function() {
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 1200)
  },
  //跳转商品详情页
  toDetail(e) {
    let id = e.currentTarget.dataset.id
    util.navigateTo({
      url: '/pages/product/details/details?id=' + id,
    })
  },
  //跳转店铺详情
  toTenant(e) {
    let id = e.currentTarget.dataset.id
    util.navigateTo({
      url: '/pages/home/home?tenantId=' + id,
    })
  },
  // 前往搜索页
  goSearch(e) {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },
  // 搜索
  searchProduct(e) {
    let v = e.detail.value
    if (v === '') return
    wx.navigateTo({
      url: `../search/result?type=0&keyword=${v}`
    })
  },
  //加入购物车
  addCart(e) {
    let id = e.currentTarget.dataset.id
    new Cart((res) => {}).add({
      id: id,
      quantity: 1
    })
  },
  //限时折扣换一批
  loadMore(page) {
    var that = this;
    var timer;
    let limitPage
    if (page == 1) {
      limitPage = page;
      that.setData({
        limitPage: limitPage
      })
    } else {
      limitPage = that.data.limitPage + 1;
      if (limitPage <= that.data.limitTotalPage) {
        limitPage = that.data.limitPage + 1
        that.setData({
          limitPage: limitPage
        })
      } else {
        limitPage = 1
        that.setData({
          limitPage: limitPage
        })
      }

    }
    this.setData({
      limitPage: limitPage
    })
    //获取限时抢购商品
    new Product(res => {
      clearInterval(that.data.timer);
      var len = res.data.length
      if (res.pageModel.total <= 3) {
        this.setData({
          limitBtnShow: true
        })
      } else {
        this.setData({
          limitBtnShow: false
        })
      }
      if (len == 0) {
        this.setData({
          limitLength: true
        })
      } else {
        this.setData({
          limitLength: false
        })
      }
      this.setData({
        limitTotalPage: res.pageModel.totalPages
      })

      function time() {
        var limitsell = res.data
        for (var i = 0; i < limitsell.length; i++) {
          // 活动是否已经开始
          var totalSecond = limitsell[i].beginDate / 1000 - Date.parse(new Date()) / 1000;
          // 活动是否已经结束
          var endSecond = limitsell[i].endDate / 1000 - Date.parse(new Date()) / 1000;
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
            limitsell[i].txt = '去抢购'
            limitsell[i].countDownDay = dayStr
            limitsell[i].countDownHour = hrStr
            limitsell[i].countDownMinute = minStr
            limitsell[i].countDownSecond = secStr
            that.setData({
              limitsell: limitsell
            });
          } else if (totalSecond > 0) {
            limitsell[i].txt = '即将开始'
            limitsell[i].countDownDay = dayStr
            limitsell[i].countDownHour = hrStr
            limitsell[i].countDownMinute = minStr
            limitsell[i].countDownSecond = secStr
            that.setData({
              limitsell: limitsell
            });
          } else if (totalSecond < 0 && endSecond < 0) {
            // clearInterval(time1);
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
      that.data.timer = setInterval(time, 1000);
    }).platFormSeckill({
      pageNumber: limitPage,
      pageSize: 3
    })
  },
  //获取数据
  getData(options) {
    var that = this
    if (options.scene && !options.extension) {
      var scene = decodeURIComponent(options.scene)
      // console.log('货架号：' + scene.split("#")[0])
      wx.setStorageSync('shelvesNo', scene.split("#")[0])
      wx.setStorageSync('extension', scene.split("#")[1])
      console.log('货架码')
      new member(res => {
        console.log('更新货架码')
      }).saveShelf({
        appId: config.APPID,
        shelfNo: scene.split("#")[0] ? scene.split("#")[0] : '',
        extensionId: scene.split("#")[1] ? scene.split("#")[1] : ''
      })
    } else {
      var extension = options.extension;
      if (options.hasOwnProperty('extension') > 0) {
        // if (extension) {
        wx.setStorageSync('extension', extension)
      }
      // if (options.shelvesNo) {
      if (options.hasOwnProperty('shelvesNo') > 0) {
        wx.setStorageSync('shelvesNo', options.shelvesNo)
      }
      //从来一架商家版跳转，检测未绑定手机号的情况下，立即绑定手机号
      if (options.hasOwnProperty('memberIdTenant') > 0){
        new member(data => {
          if (data.data.bindMobile != 'binded'){
            console.log('未绑定')
            new member(function(res){
              console.log('绑定手机号')
              console.log(res)
            }).bindByB2BMember({b2bMemberId: options.memberIdTenant})
          }
        }).view({
          appid: config.APPID
        })
      }
      new member(res => {}).saveShelf({
        appId: config.APPID,
        shelfNo: options.shelvesNo ? options.shelvesNo : wx.getStorageSync('shelvesNo'),
        extensionId: options.extension ? options.extension : ''
      })
    }
    this.loadMore(1)
    //更新当前地理位置
    new lbs(function() {
      that.getLocationSuccess()
    }).update({
      areaId: 1029
    })
  },
  getDataRefresh() {
    var that = this
    this.loadMore(1)
    //更新当前地理位置
    new lbs(function() {
      that.getLocationSuccess()
    }).update({
      areaId: 1029
    })
  },
  getLocationSuccess() {
    let that = this,
      promiseList = []
    //广告位(顶部)
    promiseList.push(new Promise((resolve, reject) => {
      new Ad(res => {
        resolve(res)
      }).do(187)
    }))

    Promise.all(promiseList).then(res => {
      this.setData({
        topImgs: {
          data: res[0].data,
          key: 'image'
        }
      })
      setTimeout(() => {
        wx.hideLoading()
        this.setData({
          homeLoadReady: true
        })
      }, 500)
    }, err => {
      this.setData({
        homeLoadReady: true
      })
    })

    //分类
    // new Category(res => {
    //   if (res.data.length > 8) {
    //     this.setData({
    //       channelListDots: true
    //     })
    //   }
    //   this.setData({
    //     channelList: res.data
    //   })
    // }).list()


    //获取新品商品
    // new Product(res => {
    //   if (res.pageModel.total <= 3) {
    //     this.setData({
    //       newsell: res.data,
    //       newHeight: 420,
    //       newDots: false
    //     })
    //   } else if (res.pageModel.total <= 6 && res.pageModel.total > 3) {
    //     this.setData({
    //       newsell: res.data,
    //       newHeight: 710,
    //       newDots: false
    //     })
    //   } else {
    //     this.setData({
    //       newsell: res.data,
    //       newDots: true
    //     })
    //   }

    // }).goodNew({
    //   pageSize: 18,
    //   pageNumber: 1
    // })

    //获取好物推荐商品
    // new Product(res => {
    //   var len = res.data.length
    //   if (len == 0) {
    //     this.setData({
    //       goodRecListLength: true
    //     })
    //   } else {
    //     this.setData({
    //       goodRecListLength: false
    //     })
    //   }
    //   this.setData({
    //     goodRecPageModle: res.pageModel,
    //     goodRecList: res.data
    //   })
    // }).goodRecommend({
    //   pageSize: 9,
    //   pageNumber: 1
    // })

    //获取猜你喜欢商品
    // new Product(res => {
    //   this.setData({
    //     recomsell: res.data
    //   })
    // }).goodLike({
    //   pageSize: 6,
    //   pageNumber: 1
    // })

    //商圈推荐商家列表
    // new Tenant(res => {
    //   this.setData({
    //     tenantListData: res.data,
    //     pageModel: res.pageModel
    //   })
    // }).firstRecommend({
    //   tagId: 28,
    //   pageSize: 10,
    //   pageNumber: 1
    // })


    //广告位1,2,3
    // var adList = {}
    // for (var j = 1; j <= 3; j++) {
    //   adList['ad' + j] = []

    //   function adTopLoad(j) {
    //     new Ad(res => {
    //       adList['ad' + j] = {
    //         'linkType': res.data[0] ? res.data[0].linkType : '',
    //         'linkId': res.data[0] ? res.data[0].linkId : '',
    //         'image': res.data[0] ? res.data[0].image : ''
    //       }
    //       that.setData({
    //         adList: adList
    //       })
    //     }).do(229 + j);
    //   }
    //   adTopLoad(j);
    // }

    //// 单图分享海报
    // new Ad(res => {
    //   // console.log(res.data[0] ? res.data[0].image : '')
    //   if (res.data[0]) {
    //     //获取海报图片宽高
    //     wx.getImageInfo({
    //       src: res.data[0].image ? res.data[0].image.replace('http', 'https') : '',
    //       success(res) {
    //         that.setData({
    //           imageWidth: res.width / 2,
    //           imageHeight: res.height / 2
    //         })
    //       }
    //     })
    //     //获取海报图片临时地址
    //     wx.downloadFile({
    //       url: res.data[0].image ? res.data[0].image.replace('http', 'https') : '',
    //       success: function(res2) {
    //         that.data.shareTenantBg = res2.tempFilePath
    //         that.setData({
    //           showShareBtn: res.data[0].image ? true : false
    //         })
    //       },
    //       fail: function(data2) {

    //       },
    //       complete: function(data3) {

    //       }
    //     })
    //   }
    // }).do(265);



    //商家小程序码和分享海报获取
    new Tenant(res => {
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
      shelvesNo: wx.getStorageSync('shelvesNo')
    })


    // 多图分享海报
    new Ad(res => {
      if (res.data[0]) {
        //获取海报图片宽高
        wx.getImageInfo({
          src: res.data[0].image ? res.data[0].image.replace('http', 'https') : '',
          success(res1) {
            that.setData({
              imageWidth: res1.width / 2,
              imageHeight: res1.height / 2
            })
          }
        })
        //获取海报图片临时地址
        var arr = []
        for(var i =0;i<res.data.length;i++){
          wx.downloadFile({
            url: res.data[i].image ? res.data[i].image.replace('http', 'https') : '',
            success: function (res2) {
              arr.push(res2.tempFilePath)
              that.setData({
                shareImg: arr,
                showShareBtn: res.data[0].image ? true : false
              })
            },
            fail: function (data2) {

            },
            complete: function (data3) {

            }
          })
        }
        
      }
    }).do(265);




    // 新人特惠
    new Product(res => {
      that.setData({
        newPreferential: res.data
      })
    }).newPreferential()

    //品牌馆
    new Tenant(function(res) {
      that.setData({
        firstRecommend: res.data,
        pageModel: res.pageModel
      })
    }).firstRecommend({
      tagId: 28,
      pageNumber: 1,
      pageSize: 6
    })

    new Cart(res => {
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

  /**
   * 页面上拉触底事件的处理函数
   */

  toLower: function() {
    var that = this;
    wx.showNavigationBarLoading();

    // // var pageModel = this.data.pageModel;
    // var pageModel = this.data.pageModel;
    // var recomsell = this.data.recomsell;
    // new Product(function(data) {
    //   wx.hideNavigationBarLoading() //完成停止加载
    //   if (data.pageModel.totalPages < data.pageModel.pageNumber) {
    //     that.setData({
    //       tips: '',
    //       showtips: false
    //     })
    //   } else {
    //     recomsell = recomsell.concat(data.data)
    //     that.setData({
    //       recomsell: recomsell,
    //       loading: false,
    //       tips: '努力加载中',
    //       showtips: false
    //     })
    //   }
    // }).goodLike({
    //   pageNumber: ++pageModel.pageNumber,
    //   pageSize: 6
    // })



    var pageModel = this.data.pageModel;
    var firstRecommend = this.data.firstRecommend;
    new Tenant(function(data) {
      wx.hideNavigationBarLoading() //完成停止加载
      if (data.pageModel.totalPages < data.pageModel.pageNumber) {
        that.setData({
          tips: '',
          showtips: false
        })
      } else {
        firstRecommend = firstRecommend.concat(data.data)
        that.setData({
          firstRecommend: firstRecommend,
          loading: false,
          tips: '努力加载中',
          showtips: false
        })
      }
    }).firstRecommend({
      tagId: 28,
      pageNumber: ++pageModel.pageNumber,
      pageSize: 6
    })


  },

  //广告位跳转
  toAdLink(e) {
    var linkType = e.currentTarget.dataset.linktype
    var linkId = e.currentTarget.dataset.linkid
    if (linkType == 'tenant') {
      util.navigateTo({
        url: '/pages/home/home?tenantId=' + linkId,
      })
    } else if (linkType == 'product') {
      util.navigateTo({
        url: '/pages/product/details/details?id=' + linkId,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.LOGIN_STATUS) {
      new Cart(res => {
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
      // 最近访问的品牌
      new member(res => {
        this.setData({
          findTenatBrowseHistory: res.data
        })
      }).findTenatBrowseHistory()
    } else {
      app.loginOkCallbackList.push(() => {
        new Cart(res => {
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
        // 最近访问的品牌
        new member(res => {
          this.setData({
            findTenatBrowseHistory: res.data
          })
        }).findTenatBrowseHistory()
      })
    }



  },

  scrollto(e) {
    let to = e.currentTarget.dataset.to
    this.setData({
      scrollIntoId: to
    })
  },
  adTap(e) {
    let linkid = e.currentTarget.dataset.linkid,
      linkType = e.currentTarget.dataset.linktype
    if (linkType == 'shelfPackage') {
      wx.navigateTo({
        url: '/pages/shelf/package/index',
      })
    } else {
      if (!linkid) return
      if (linkType == 'tenant') {
        util.navigateTo({
          url: '/pages/home/home?tenantId=' + linkid,
        })
      } else if (linkType == 'product') {
        util.navigateTo({
          url: '/pages/product/details/details?id=' + linkid,
        })
      }
    }


  },
  //前往技术支持
  technical() {
    wx.navigateTo({
      url: '/pages/technical/technical',
    })
  },
  //分享
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '来一架  边购物，边赚钱！',
      path: '/pages/index/index?extension=' + app.globalData.memberInfo.id + '&shelvesNo=' + wx.getStorageSync('shelvesNo'),
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: '转发成功',
          icon: 'success'
        })
      },
      fail: function(res) {
        // 转发失败
        console.log('分享失败')
      }
    }
  },
  __pt_toDetail(e) {
    wx.navigateTo({
      url: '/pages/product/details/details?id=' + e.currentTarget.dataset.id,
    })
  },
  goCategory(e) {
    var id = e.currentTarget.dataset.id;
    wx.INIT_CATEGORY_ID = id
    wx.navigateTo({
      url: '/pages/category/category',
    })
  },
  specialtoupper: function(e) {
    this.setData({
      scrollX: false
    })
    this.setData({
      newsellTipsLoad: true
    })
    var pageModel = this.data.goodRecPageModle;
    var goodRecList = this.data.goodRecList;
    new Product((res) => {
      goodRecList = goodRecList.concat(res.data)
      this.setData({
        goodRecList: goodRecList,
        newsellTipsLoad: false
      })
      if (res.pageModel.totalPages < res.pageModel.pageNumber) {
        this.setData({
          newsellTips: '',
        })
      }
    }).goodRecommend({
      pageSize: 9,
      pageNumber: ++pageModel.pageNumber
    })
  },
  // 点击分享获取商家海报
  // shareTenant(e) {
  //   var that = this
  //   if (e.detail.errMsg.indexOf('fail') > -1) {
  //     wx.showToast({
  //       title: '请授权用户信息!',
  //       icon: 'none'
  //     })
  //   } else {
  //     wx.showLoading({
  //       title: '海报生成中~',
  //     })
  //     setTimeout(function() {
  //       wx.hideLoading()
  //     }, 10000)
  //     console.log(e.detail.userInfo.nickName)
  //     //获取用户头像昵称
  //     new member(res => {
  //       that.setData({
  //         nickName: e.detail.userInfo.nickName
  //       })
  //       wx.downloadFile({
  //         url: e.detail.userInfo.avatarUrl,
  //         success: function(res) {
  //           that.setData({
  //             headImg: res.tempFilePath,
  //           })
  //           that.setData({
  //             canvasHide: false,
  //             canvasw: that.data.imageWidth + 'px',
  //             canvash: that.data.imageHeight + 'px'
  //           })
  //           var w = that.data.imageWidth;
  //           var h = that.data.imageHeight;
  //           const ctx = wx.createCanvasContext('myCanvas')
  //           ctx.beginPath()
  //           ctx.fillRect(0, 0, w, h)
  //           ctx.drawImage(that.data.shareTenantBg, 0, 0, w, h) //商家海报底图
  //           ctx.save();
  //           //头像裁剪成圆形
  //           // ctx.arc(0.4 * w + 0.2 * w / 2, 0.05 * w + 0.2 * w / 2, 0.2 * w / 2, 0, 2 * Math.PI);
  //           // ctx.setStrokeStyle('#ffffff')
  //           // ctx.clip();
  //           ctx.drawImage(that.data.headImg, 0.09 * w, 0.78 * h, 0.12 * w, 0.12 * w) //头像
  //           ctx.stroke();
  //           ctx.closePath();
  //           ctx.restore();
  //           //canvas推荐人昵称头像填充
  //           ctx.setTextAlign('center')
  //           ctx.setFillStyle('rgb(255,255, 255)')
  //           ctx.setFontSize(16)
  //           // ctx.fillText(that.data.nickName, w / 2, 0.3 * w)
  //           ctx.drawImage(that.data.qrcode, 0.63 * w, 0.78 * h, 0.3 * w, 0.3 * w)
  //           ctx.draw();
  //           setTimeout(function() {
  //             //将cavas变成图片
  //             wx.canvasToTempFilePath({
  //               //通过id 指定是哪个canvas
  //               canvasId: 'myCanvas',
  //               success(res) {
  //                 wx.hideTabBar()
  //                 wx.hideLoading()
  //                 that.setData({
  //                   canvasHide: true,
  //                   showAction: true,
  //                   shareImageSrc: res.tempFilePath
  //                 })
  //               }
  //             })
  //           }, 500)
  //         }
  //       })
  //     }).view()
  //   }
  // },
  // 多图分享
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
      // setTimeout(function() {
      //   wx.hideLoading()
      // }, 10000)
      // if (that.data.drawList.length == 0){
        //获取用户头像昵称
        console.log('获取获取')
        new member(res => {
          that.setData({
            nickName: e.detail.userInfo.nickName
          })
          wx.downloadFile({
            url: e.detail.userInfo.avatarUrl,
            success: function (res) {
              console.log('down成功')
              console.log(res)
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

              var drawList = []
              that.data.shareImg.forEach((u, i) => {
                drawList.push(drawPoster('myCanvas' + i, u))
              })

              // 统一更新数据
              Promise.all(drawList).then((valuse) => {
                wx.hideLoading()
                console.log(drawList)
                console.log(valuse)
                that.setData({
                  drawList: valuse
                })
              });

              function drawPoster(canvasId, bgUrl) {
                return new Promise((resolve, reject) => {
                  var w = that.data.imageWidth;
                  var h = that.data.imageHeight;
                  const ctx = wx.createCanvasContext(canvasId)
                  ctx.beginPath()
                  ctx.fillRect(0, 0, w, h)
                  // ctx.drawImage(that.data.shareTenantBg, 0, 0, w, h) //商家海报底图
                  ctx.drawImage(bgUrl, 0, 0, w, h)
                  ctx.save();
                  //头像裁剪成圆形
                  ctx.drawImage(that.data.headImg, 0.09 * w, 0.78 * h, 0.12 * w, 0.12 * w) //头像
                  ctx.stroke();
                  ctx.closePath();
                  ctx.restore();
                  //canvas推荐人昵称头像填充
                  ctx.setTextAlign('center')
                  ctx.setFillStyle('rgb(255,255, 255)')
                  ctx.setFontSize(16)
                  // ctx.fillText(that.data.nickName, w / 2, 0.3 * w)
                  ctx.drawImage(that.data.qrcode, 0.61 * w, 0.765 * h, 0.3 * w, 0.3 * w)
                  ctx.draw();
                  setTimeout(function () {
                    //将cavas变成图片
                    wx.canvasToTempFilePath({
                      //通过id 指定是哪个canvas
                      canvasId: canvasId,
                      success(res) {
                        wx.hideTabBar()
                        wx.hideLoading()
                        that.setData({
                          canvasHide: true,
                          showAction: true
                        })
                        resolve(res.tempFilePath);
                      }
                    })
                  }, 500)
                });
              }
            }
          })
        }).view()
      // }else{
      //   console.log('nonono')
      //   wx.hideLoading()
      //   that.setData({
      //     canvasHide: true,
      //     showAction: true
      //   })
      // }
      
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



  // //单图保存图片
  // saveImage() {
  //   var that = this
  //   wx.saveImageToPhotosAlbum({
  //     filePath: that.data.shareImageSrc,
  //     success: function(res) {
  //       wx.showToast({
  //         title: '图片已保存相册',
  //         icon: 'success',
  //         duration: 2000
  //       })
  //     },
  //     fail: function(res) {

  //     }
  //   })
  // },
  
  shareImgChange(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  //多图保存图片
  saveImages() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.drawList[that.data.currentIndex],
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
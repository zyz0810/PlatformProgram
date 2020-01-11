// pages/search/result.js

let swiperAutoHeight = require("../../template/swiper/swiper.js"),
    Product = require("../../service/product.js"),
    nearBy = require("../../service/nearBy.js"),
    Cart = require("../../service/cart.js"),
    Coupon = require("../../service/coupon.js"),
    Tenant = require("../../service/tenant.js"),
    Ad = require("../../service/ad.js"),
    app = getApp(),
    util = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        areaSelect: {
            title: '全城',
            data: [],
            show: false,
            rightData: []
        },
        categorySelect: {
            title: '全部',
            data: [],
            show: false,
            rightData: []
        },
        sortSelect: {
            title: '智能排序',
            data: [{
                id: 'weight',
                name: '智能排序'
            },
                {
                    id: 'hitsDesc',
                    name: '点击最高'
                },
                {
                    id: 'scoreDesc',
                    name: '评价最高'
                },
                {
                    id: 'distance',
                    name: '距离优先'
                }
            ],
            show: false,
            rightData: []
        },
        selectedData: {
            areaId: '',
            tenantCategoryId: '',
            productCategoryId: '',
            orderType: 'weight',
            communityId: '',
            keyword: '',
            pageSize: 10,
            pageNumber: 1,
            lat: 0,
            lng: 0
        },
        productListLine: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        this.setData({
            showTempType: options.type,
            'selectedData.keyword': options.keyword
        })
        if (options.type == 1) {
            this.setData({
                title: '智能排序',
                data: [{
                    id: 'weight',
                    name: '智能排序'
                },
                    {
                        id: 'hitsDesc',
                        name: '点击最高'
                    },
                    {
                        id: 'scoreDesc',
                        name: '评价最高'
                    },
                    {
                        id: 'distance',
                        name: '距离优先'
                    }
                ],
                show: false,
                rightData: []
            })
        } else {
            var sortSelect = {
                title: '智能排序',
                data: [{
                    id: 'weight',
                    name: '智能排序'
                },
                    {
                        id: 'priceAsc',
                        name: '价格由低到高'
                    },
                    {
                        id: 'priceDesc',
                        name: '价格由高到低'
                    },
                    {
                        id: 'salesDesc',
                        name: '销量优先'
                    },
                    {
                        id: 'scoreDesc',
                        name: '评论最高'
                    }
                ],
                show: false,
                rightData: []
            }
            this.setData({
                sortSelect: sortSelect
            })
        }

        new nearBy(res => {
            res.data.area.unshift({
                name: '热门商圈',
                notUseAll: true,
                id: 1029,
                communities: res.data.hotCommunity
            })
            res.data.area.unshift({
                name: '全城',
                notUseAll: true,
                id: -1,
                communities: [{
                    id: -1,
                    name: '全部'
                }]
            })
            this.data.areaSelect.data = res.data.area
        }).areaList()

        if (options.type == 1) {
            wx.setNavigationBarTitle({
                title: '搜索店铺',
            })
            new nearBy(res => {
                res.data.unshift({
                    name: '全部',
                    id: -1,
                    notUseAll: true,
                    childrens: [{
                        id: -1,
                        name: '全部'
                    }]
                })
                this.data.categorySelect.data = res.data
            }).category()
        } else if (options.type == 0) {
            wx.setNavigationBarTitle({
                title: '搜索商品',
            })
            new nearBy(res => {
                res.data.unshift({
                    name: '全部',
                    id: -1,
                    notUseAll: true,
                    childrens: [{
                        id: -1,
                        name: '全部'
                    }]
                })
                this.data.categorySelect.data = res.data
            }).productCategory()
        }


        wx.getLocation({
            type: 'wgs84 ',
            success: function(res) {
                var longitude = res.longitude
                var latitude = res.latitude
                that.setData({
                    'selectedData.lng': longitude,
                    'selectedData.lat': latitude
                })
                that.goSearchResult()
            },
            fail: function(err) {
                if (err.errMsg.indexOf('auth') > -1) {
                    wx.showModal({
                        title: '提示',
                        content: '未授予定位权限，是否前往设置',
                        success: function(res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    success: function(res) {
                                        if (!res.authSetting["scope.userLocation"]) {

                                            that.goSearchResult()

                                        } else if (res.authSetting["scope.userLocation"]) {
                                            wx.getLocation({
                                                type: 'wgs84 ',
                                                success: function(res) {
                                                    var longitude = res.longitude
                                                    var latitude = res.latitude
                                                    that.setData({
                                                        'selectedData.lng': longitude,
                                                        'selectedData.lat': latitude
                                                    })
                                                    that.goSearchResult()
                                                }
                                            })
                                        }
                                    }
                                })
                            } else {
                                // wx.showModal({
                                //   title: '提示',
                                //   content: '定位失败，将默认智能排序',
                                //   success: function() {
                                //     that.goSearchResult()
                                //   }
                                // })
                                that.goSearchResult()
                            }
                        }
                    })
                } else {
                    // wx.showModal({
                    //   title: '提示',
                    //   content: '定位失败，将默认智能排序',
                    //   success: function() {
                    //     that.goSearchResult()
                    //   }
                    // })
                    that.goSearchResult()
                }
            }
        })



    },

    //获取实时搜索内容
    setVal(e) {
        this.setData({
            'selectedData.keyword': e.detail.value
        })
    },
    //搜索发起
    search(e) {
        let v = e.detail.value
        if (v === '') return
        this.setData({
            'selectedData.keyword': v
        })
        this.goSearchResult()
    },
    //点击搜索按钮
    clickSearch(e) {
        this.goSearchResult()
    },

    selectShowChange(e) {
        var keyName = e.currentTarget.dataset.name
        const keyList = ['areaSelect', 'categorySelect', 'sortSelect']
        this.setData({
            clickSelectType: keyName
        })
        keyList.map(key => {
            var data = this.data
            if (key === keyName) {
                data[key].show = !data[key].show
                this.setData(data)
            } else {
                data[key].show = false
                this.setData(data)
            }
        })
    },
    //选择左边
    changeLeft(e) {
        var id = e.currentTarget.dataset.id
        var childname = e.currentTarget.dataset.childname
        var name = e.currentTarget.dataset.name
        var hideright = e.currentTarget.dataset.hideright
        const ddata = this.data[this.data.clickSelectType].data
        this.setData({
            leftAc: id
        })
        if (hideright == 'true') {
            this.close()
            this.setData({
                'selectedData.orderType': id
            })
            var data = this.data
            data[this.data.clickSelectType].title = name
            this.setData(data)
            this.goSearchResult()
            return
        }
        for (let i = 0; i < ddata.length; i++) {
            if (ddata[i].id === id) {
                const rightData = ddata[i][childname] instanceof Array ? [].concat(ddata[i][childname]) : []
                if (!ddata[i].notUseAll) {
                    rightData.unshift({
                        name: '全部',
                        id: '0',
                        allName: name
                    })
                }
                var data = this.data
                data[this.data.clickSelectType].rightData = rightData
                data[this.data.clickSelectType].leftAc = id
                this.setData(data)
                break
            }
        }

    },

    // 选择右边
    change(e) {
        console.log(e)
        var id = e.currentTarget.dataset.id
        var name = e.currentTarget.dataset.name
        this.setData({
            leftSelecte: this.data.leftAc,
            rightSelected: id
        })
        var data = this.data
        data[this.data.clickSelectType].title = name
        this.setData(data)

        this.close()
        var clickSelectType = this.data.clickSelectType
        switch (clickSelectType) {
            case 'areaSelect':
                this.setData({
                    'selectedData.areaId': this.data.leftAc > 0 ? this.data.leftAc : '',
                    'selectedData.communityId': id > 0 ? id : ''
                })
                break
            case 'sortSelect':
                this.setData({
                    'selectedData.orderType': id > 0 ? id : ''
                })
                break
            case 'categorySelect':
                this.setData({
                    'selectedData.tenantCategoryId': id > 0 ? id : '',
                    'selectedData.productCategoryId': id > 0 ? id : '',
                })
                break
        }
        this.goSearchResult()
    },
    //关闭选择框
    close(e) {
        var data = this.data
        data['areaSelect'].show = false
        data['categorySelect'].show = false
        data['sortSelect'].show = false
        this.setData(data)
    },
    // 改变商品列表样式
    changeProductListType() {
        this.setData({
            productListLine: !this.data.productListLine
        })
    },
    //搜索内容
    goSearchResult() {
        this.setData({
            'selectedData.pageNumber': 1
        })
        if (this.data.showTempType == 0) {
            wx.stopPullDownRefresh()
            new Product(res => {
                if (res.data.length < this.data.selectedData.pageSize) {
                    this.setData({
                        tips: '没有更多啦~',
                        showtips: false
                    })
                }
                this.setData({
                    dataList: res.data
                })
            }).list(this.data.selectedData)
        } else if (this.data.showTempType == 1) {
            wx.stopPullDownRefresh()
            new Tenant(res => {
                if (res.data.length < this.data.selectedData.pageSize) {
                    this.setData({
                        tips: '没有更多啦~',
                        showtips: false
                    })
                }
                this.setData({
                    dataList: res.data
                })
            }).areaList(this.data.selectedData)
        }
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.goSearchResult()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this;
        wx.showNavigationBarLoading();
        var pageModel = this.data.selectedData.pageModel;
        that.setData({
            'selectedData.pageNumber': ++that.data.selectedData.pageNumber
        })
        var dataList = this.data.dataList;
        if (this.data.showTempType == 0) {
            new Product(data => {
                wx.hideNavigationBarLoading() //完成停止加载
                if (data.pageModel.totalPages < data.pageModel.pageNumber) {
                    that.setData({
                        tips: '没有更多啦~',
                        showtips: false
                    })
                } else {
                    dataList = dataList.concat(data.data)
                    that.setData({
                        dataList: dataList,
                        loading: false,
                        tips: '努力加载中',
                        showtips: false
                    })
                }
            }).list(this.data.selectedData)
        } else if (this.data.showTempType == 1) {
            new Tenant(data => {
                wx.hideNavigationBarLoading() //完成停止加载
                if (data.pageModel.totalPages < data.pageModel.pageNumber) {
                    that.setData({
                        tips: '没有更多啦~',
                        showtips: false
                    })
                } else {
                    dataList = dataList.concat(data.data)
                    that.setData({
                        dataList: dataList,
                        loading: false,
                        tips: '努力加载中',
                        showtips: false
                    })
                }
            }).areaList(this.data.selectedData)
        }
    },

    //点击去商品详情
    goToproduct(e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/pages/product/details/details?id=' + id,
        })
    },
    //点击去店铺详情
    gotoTennat(e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/home/home?tenantId=' + id,
        })
    }
})
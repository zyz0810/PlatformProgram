// pages/shop/register/index.js
let app = getApp(),
  util = require("../../../utils/util.js"),
  member = require('../../../service/member.js'),
  Shelf = require("../../../service/shelf.js")
var countdown = util.countdown //验证码计时
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    objectMultiArray: [],
    addressIndexArray: [0, 0, 0],
    shopCategoryId: '',
    shopCategory: '请选择所属行业',
    fullName: '请选择店铺所在区域',
    tips: '验证码',
    count: 60,
    province: '',
    city: '',
    district: '',
    formContent: {
      masterName: '',
      phone: '',
      code: '',
      shopName: '',
      shopAddress: '',
      latitude: '',
      longitude: '',
    },
    bg: false,
    areaId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getCategory()
    var that = this
    if (options.category) {
      console.log(options.category)
      var shopCategory = unescape(options.category)
      that.setData({
        shopCategory: shopCategory
      })
    } else {
      console.log(555)
    }
    new member(function(res) {
      var objectMultiArray = that.data.objectMultiArray
      objectMultiArray[0] = res.data
      that.setData({
        objectMultiArray: objectMultiArray
      })
      new member(function(res) {
        var objectMultiArray = that.data.objectMultiArray
        objectMultiArray[1] = res.data
        that.setData({
          objectMultiArray: objectMultiArray
        })
        new member(function(res) {
          var objectMultiArray = that.data.objectMultiArray
          objectMultiArray[2] = res.data
          that.setData({
            objectMultiArray: objectMultiArray
          })
        }).provinceList({
          areaId: res.data[0].id
        });
      }).provinceList({
        areaId: res.data[0].id
      });
    }).provinceList();
  },
  chooseCategory: function() {
    util.navigateTo({
      url: '/pages/shelf/tenant/category',
    })
  },
  //选择地址滚动
  bindMultiPickerColumnChange(e) {
    var that = this
    var column = e.detail.column
    var index = e.detail.value
    var areaId = that.data.objectMultiArray[column][index].id
    this.setData({
      changeAddress: false
    })
    if (column == 0) {
      new member(function(res) {
        var objectMultiArray = that.data.objectMultiArray
        objectMultiArray[1] = res.data
        that.setData({
          objectMultiArray: objectMultiArray
        })
        new member(function(res) {
          var objectMultiArray = that.data.objectMultiArray
          objectMultiArray[2] = res.data
          that.setData({
            objectMultiArray: objectMultiArray
          })
        }).provinceList({
          areaId: res.data[0].id
        });
      }).provinceList({
        areaId: areaId
      });
    } else if (column == 1) {
      new member(function(res) {
        var objectMultiArray = that.data.objectMultiArray
        objectMultiArray[2] = res.data
        that.setData({
          objectMultiArray: objectMultiArray
        })
      }).provinceList({
        areaId: areaId
      });
    }
  },
  //选择地址区域确定
  bindMultiPickerChange(e) {
    var that = this
    var addressIndexArray = this.data.addressIndexArray
    this.data.addressIndexArray[0] = e.detail.value[0] ? e.detail.value[0] : this.data.addressIndexArray[0]
    this.data.addressIndexArray[1] = e.detail.value[1] ? e.detail.value[1] : this.data.addressIndexArray[1]
    this.data.addressIndexArray[2] = e.detail.value[2] ? e.detail.value[2] : this.data.addressIndexArray[2]
    var areaId = this.data.objectMultiArray[2].length > 0 ? this.data.objectMultiArray[2][this.data.addressIndexArray[2]].id : this.data.objectMultiArray[1][this.data.addressIndexArray[1]].id
    this.setData({
      addressIndexArray: addressIndexArray,
      areaId: areaId,
      province: that.data.objectMultiArray[0][this.data.addressIndexArray[0]].name,
      city: that.data.objectMultiArray[1][this.data.addressIndexArray[1]].name,
      district: that.data.objectMultiArray[2].length > 0 ? that.data.objectMultiArray[2][this.data.addressIndexArray[2]].name : ''
    })
    if (this.data.formContent.masterName != '' && this.data.formContent.phone != '' && this.data.formContent.code != '' && this.data.formContent.shopName != '' && this.data.formContent.shopAddress != '' && this.data.shopCategory != '请选择所属行业' && this.data.province != '' && that.data.checked == true) {
      that.setData({
        bg: true
      })
    } else {
      that.setData({
        bg: false
      })
    }
  },

  goMap: function() {
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var name = res.name
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude)
        wx.chooseLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28,
          name: name,
          success: function(data) {
            console.log(data)
            console.log('dhaj af')
            var formContent = that.data.formContent
            that.data.formContent.shopAddress = data.address
            that.setData({
              formContent: formContent
            })
            if (that.data.formContent.masterName != '' && that.data.formContent.phone != '' && that.data.formContent.code != '' && that.data.formContent.shopName != '' && that.data.formContent.shopAddress != '' && that.data.shopCategory != '请选择所属行业' && that.data.province != '' && that.data.checked == true) {
              that.setData({
                bg: true
              })
            } else {
              that.setData({
                bg: false
              })
            }
          }
        })
      },
      fail: function(err) {
        if (err.errMsg.indexOf('auth') > -1) {
          wx.showModal({
            title: '提示',
            content: '未授予定位权限，是否前往设置',
            success: function(res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
      }
    })


  },
  submit: function() {
    let that = this
    if (that.data.formContent.masterName == '') {
      wx.showToast({
        title: '请输入店主真实姓名',
        icon: 'none'
      })
    } else if (that.data.formContent.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } else if (!(/^1[3456789]\d{9}$/.test(that.data.formContent.phone))) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'none'
      })
    } else if (that.data.formContent.code == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else if (that.data.formContent.shopName == '') {
      wx.showToast({
        title: '请输入店铺营业名称',
        icon: 'none'
      })
    } else if (that.data.shopCategory == '请选择所属行业') {
      wx.showToast({
        title: '请选择店铺所属行业',
        icon: 'none'
      })
    } else if (that.data.province == '' || that.data.city == '' || that.data.district == '') {
      wx.showToast({
        title: '请选择店铺区域',
        icon: 'none'
      })
    } else if (that.data.formContent.shopAddress == '') {
      wx.showToast({
        title: '请输入店铺详细地址',
        icon: 'none'
      })
    } else if (that.data.checked == false) {
      wx.showToast({
        title: '请先阅读并同意《服务协议》',
        icon: 'none'
      })
    } else {
      new Shelf(function(res) {
        if (res.data == null) {
          wx.showModal({
            title: '提示',
            content: '该手机号已被注册，请重新填写信息',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                that.setData({
                  shopCategoryId: '',
                  shopCategory: '请选择所属行业',
                  fullName: '请选择店铺所在区域',
                  tips: '验证码',
                  count: 60,
                  province: '',
                  city: '',
                  district: '',
                  formContent: {
                    masterName: '',
                    phone: '',
                    code: '',
                    shopName: '',
                    shopAddress: '',
                    latitude: '',
                    longitude: '',
                  },
                  bg: false,
                  areaId: ''
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您已成功注册，请返回轻加盟界面确认下单！',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.setStorageSync('chooseCategoryName', '')
                wx.setStorageSync('shopCategoryId', '')
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                })
              }
            }
          })
        }
      }).createDeliveryCenter({
        name: that.data.formContent.masterName,
        mobile: that.data.formContent.phone,
        verifyCode: that.data.formContent.code,
        deliveryCenterName: that.data.formContent.shopName,
        tenantCategoryId: that.data.shopCategoryId,
        areaId: that.data.areaId,
        areaAddress: that.data.formContent.shopAddress,
        lng: that.data.formContent.latitude,
        lat: that.data.formContent.longitude
      })
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
    var that = this;
    if (this.data.formContent.masterName != '' && this.data.formContent.phone != '' && this.data.formContent.code != '' && this.data.formContent.shopName != '' && this.data.formContent.shopAddress != '' && this.data.shopCategory != '请选择所属行业' && this.data.province != '' && that.data.checked == true) {
      that.setData({
        bg: true
      })
    } else {
      that.setData({
        bg: false
      })
    }
  },
  //输入框变化
  bindChange: function(e) {
    var that = this
    var form = this.data.formContent;
    form[e.currentTarget.id] = e.detail.value.trim();
    this.setData({
      formContent: form
    })
    if (this.data.formContent.masterName != '' && this.data.formContent.phone != '' && this.data.formContent.code != '' && this.data.formContent.shopName != '' && this.data.formContent.shopAddress != '' && this.data.shopCategory != '请选择所属行业' && this.data.province != '' && that.data.checked == true) {
      that.setData({
        bg: true
      })
    } else {
      that.setData({
        bg: false
      })
    }
  },

  //发送验证码
  getcode: function() {
    var that = this;
    if (!(/^1[3456789]\d{9}$/.test(that.data.formContent.phone))) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'none'
      })
    } else {
      new member(res => {
        countdown(that);
      }).sendMsgToBindPhone({
        mobile: that.data.formContent.phone
      })

    }

  },

  checkboxChange: function(e) {
    let that = this
    if (e.detail.value == '') {
      that.setData({
        checked: false
      })
      if (this.data.formContent.masterName != '' && this.data.formContent.phone != '' && this.data.formContent.code != '' && this.data.formContent.shopName != '' && this.data.formContent.shopAddress != '' && this.data.shopCategory != '请选择所属行业' && this.data.province != '' && that.data.checked == true) {
        that.setData({
          bg: true
        })
      } else {
        that.setData({
          bg: false
        })
      }
    } else {
      that.setData({
        checked: true
      })
      if (this.data.formContent.masterName != '' && this.data.formContent.phone != '' && this.data.formContent.code != '' && this.data.formContent.shopName != '' && this.data.formContent.shopAddress != '' && this.data.shopCategory != '请选择所属行业' && this.data.province != '' && that.data.checked == true) {
        that.setData({
          bg: true
        })
      } else {
        that.setData({
          bg: false
        })
      }
    }
  },
  goAgreement: function() {
    wx.navigateTo({
      url: '/pages/shelf/tenant/agreement'
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})
// pages/member/address/edit.js
let app = getApp()
let member = require('../../../service/member.js')
let Receiver = require('../../../service/receiver.js')
let util = require('../../../utils/util.js')
let config = require('../../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectMultiArray: [],
    addressIndexArray: [0, 0, 0],
    province: '',
    fullName: '请选择所在地区',
    consignee: '',
    canAdd: true,
    imgdefault: 'https://cdn.laiyijia.com/upload/image/201906/0cd8d842-4232-4f83-8cc0-5035619e9174.png',
    linkman: '',
    deliveryCenterName: '',
    address: '',
    pic: '',
    uploadPic: false,
    latitude: '',
    longitude: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.data.shelvesOrderId = options.shelvesOrderId
    if (app.globalData.LOGIN_STATUS) {
      this.getInfoWhenLogin()

    } else {
      app.loginOkCallback = res => {
        this.getInfoWhenLogin()
      }
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //门店联系人
  linkman(e) {
    this.setData({
      linkman: e.detail.value
    })
  },
  //店铺名称
  deliveryCenterName(e) {
    this.setData({
      deliveryCenterName: e.detail.value
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
  },



  getInfoWhenLogin() {
    var that = this
    that.setData({
      mainColor: app.globalData.mainColor
    })

  },
  //输入姓名
  consignee: function(e) {
    this.setData({
      consignee: e.detail.value.trim()
    })
  },
  //手机号
  phone: function(e) {
    this.setData({
      phone: e.detail.value.trim()
    })
  },
  address: function(e) {
    this.setData({
      address: e.detail.value.trim()
    })
  },
  chooseAddress(e) {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.data.latitude = res.latitude
        that.data.longitude = res.longitude
        that.setData({
          address: res.address
        })
      },
    })

  },

  //上传门头照片
  uploadImg: function() {
    var that = this;
    util.getUrlAfterUpload(function(data, tempFilePaths) {
      that.setData({
        uploadPic: true,
        imgdefault: tempFilePaths,
        pic: data
      })
    })
  },
  //删除上传的门头照片
  deletePic() {
    this.setData({
      uploadPic: false,
      imgdefault: 'https://cdn.laiyijia.com/upload/image/201906/0cd8d842-4232-4f83-8cc0-5035619e9174.png',
      pic: ''
    })
  },
  submit: function() {
    var that = this;
    if (this.data.canAdd) {
      this.data.canAdd = false
      if (that.data.linkman == '') {
        wx.showToast({
          title: '请填写门店联系人',
          icon: 'none',
          duration: 2000
        })
        this.data.canAdd = true
      } else if (that.data.deliveryCenterName == '') {
        wx.showToast({
          title: '请填写店铺名称',
          icon: 'none',
          duration: 2000
        })
        this.data.canAdd = true
      } else if (!that.data.areaId) {
        wx.showToast({
          title: '请选择店铺区域位置',
          icon: 'none',
          duration: 2000
        })
        this.data.canAdd = true
      } else if (that.data.address == '') {
        wx.showToast({
          title: '请填写店铺详细地址',
          icon: 'none',
          duration: 2000
        })
        this.data.canAdd = true
      } else if (!that.data.uploadPic) {
        wx.showToast({
          title: '请上传门头照片',
          icon: 'none',
          duration: 2000
        })
        this.data.canAdd = true
      } else {
        wx.navigateTo({
          url: 'dataTwo?shelvesOrderId=' + that.data.shelvesOrderId + '&linkman=' + that.data.linkman + '&deliveryCenterName=' + that.data.deliveryCenterName + '&areaId=' + that.data.areaId + '&address=' + that.data.address + '&pic=' + that.data.pic + '&lng=' + that.data.longitude + '&lat=' + that.data.latitude,
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.data.latitude = res.latitude
        that.data.longitude = res.longitude
        new Receiver(function(res) {
          that.setData({
            fullName: res.data.bd_area.fullName,
            areaId: res.data.bd_area.id
            // address: res.data.area.sematic_description
          })
        }).get({
          lat: latitude,
          lng: longitude
        })
      },
      fail(err) {
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  }
})
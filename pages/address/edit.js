// pages/member/address/edit.js
let app = getApp()
let member = require('../../service/member.js')
let Receiver = require('../../service/receiver.js')
let util = require('../../utils/util.js')
let config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectMultiArray: [],
    addressIndexArray: [0, 0, 0],
    province: '',
    consignee: '',
    editShow: false,
    canClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var id = options.id
    this.setData({
      id: id
    })
    if (app.globalData.LOGIN_STATUS) {
      this.getInfoWhenLogin(id)

    } else {
      app.loginOkCallback = res => {
        this.getInfoWhenLogin(id)
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




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  getInfoWhenLogin(id) {
    var that = this
    new Receiver(function(data) {
      that.setData({
        editShow: true,
        consignee: data.data.consignee,
        phone: data.data.phone,
        areaId: data.data.area.id,
        fullName: data.data.area.fullName,
        address: data.data.address,
        mainColor: app.globalData.mainColor,
        isDefault: data.data.isDefault
      })
    }).view({
      id: id
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


  submit: function() {
    var that = this;
    if (this.data.canClick) {
      this.data.canClick = false
      if (that.data.consignee == '') {
        wx.showToast({
          title: '请填写收货人姓名',
          icon: 'none',
          duration: 2000
        })
        this.data.canClick = true
      } else if (!(/^1[3456789]\d{9}$/.test(that.data.phone))) {
        wx.showToast({
          title: '手机号格式错误',
          icon: 'none',
          duration: 2000
        })
        this.data.canClick = true
      } else if (that.data.address == '') {
        wx.showToast({
          title: '请填写详细地址',
          icon: 'none',
          duration: 2000
        })
        this.data.canClick = true
      } else {
        new Receiver(function(res) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 2200)
          that.data.canClick = true
        }, function() {
          that.data.canClick = true
        }).update({
          id: that.data.id,
          areaId: that.data.areaId,
          consignee: that.data.consignee,
          address: that.data.address,
          phone: that.data.phone
        })
      }
    }

  },
  setDefault: function() {
    var that = this
    if (this.data.canClick) {
      this.data.canClick = false
      new Receiver(function(data) {
        wx.showToast({
          title: '已设为默认地址',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function() {
          wx.navigateBack({})
        }, 1500)
        this.data.canClick = true
      }, function() {
        this.data.canClick = true
      }).setDefault({
        id: that.data.id
      })
    }
  },
  delete: function() {
    var that = this
    wx.showModal({
      title: '',
      content: '确认要删除该地址吗？',
      confirmText: '删除',
      confirmColor: "#fd407a",
      success: function(res) {
        if (res.confirm) {
          new Receiver(function(data) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }).delete({
            id: that.data.id
          })
        }
      }
    })
  }
})
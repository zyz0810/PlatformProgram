// pages/member/order/orderEvaluate/orderEvaluate.js
//获取应用实例
var app = getApp()
var order = require('../../../service/order.js')
var member = require('../../../service/member.js')
var Review = require('../../../service/review.js')
var util = require('../../../utils/util')
var config = require("../../../utils/config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: {
      shop: 5
    },
    imgList: {},
    imgUploadSuccessList: {},
    content: {},
    isAnonym: false
  },
  // 评分修改
  scoreChange(e) {
    let index = e.currentTarget.dataset.index,
      id = e.currentTarget.dataset.id
    this.data.score[id] = ++index
    this.setData({
      score: this.data.score
    })
  },
  preview(e) {
    let id = e.currentTarget.dataset.id,
      src = e.currentTarget.dataset.src
    wx.previewImage({
      urls: this.data.imgList[id],
      current: src
    })
  },
  checkIsAnonym(e) {
    this.setData({
      isAnonym: e.detail.value[0] == 1 ? true : false
    })
  },
  inputEval(e) {
    let id = e.currentTarget.dataset.id
    this.data.content[id] = e.detail.value
    this.setData({
      content: this.data.content
    })
  },
  deleteImg(e) {
    let id = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index
    this.data.imgList[id].splice(index, 1)
    this.setData({
      imgList: this.data.imgList
    })
  },
  addImg(e) {
    let id = e.currentTarget.dataset.id, tempFilePaths = []
    wx.chooseImage({
      count: 9 - this.data.imgList[id].length,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success: res => {
        // 去重无效，真机选择同一文件文件名不一致
        // tempFilePaths = res.tempFilePaths
        // res.tempFilePaths.forEach((v, i) => {
        //   if (this.data.imgList[id].includes(v)) {
        //     tempFilePaths.splice(i, 1)
        //   }
        // })
        // this.data.imgList[id] = this.data.imgList[id].concat(tempFilePaths)
        this.data.imgList[id] = this.data.imgList[id].concat(res.tempFilePaths)
        this.setData({
          imgList: this.data.imgList
        })
      }
    })
  },
  upLoadImg(imgList, callback) {
    let that = this
    function upLoadImgPromise(url, id) {
      return new Promise(function (resolve, reject) {

        wx.uploadFile({
          url: config.BASE_URL + config.UPLOAD_URL,
          name: 'file',
          filePath: url,
          success: function (res) {
            let resAddress = JSON.parse(res.data).data
            that.data.imgUploadSuccessList[id].push(resAddress)
            that.setData({
              imgUploadSuccessList: that.data.imgUploadSuccessList
            })
            resolve(res)
          },
          fail: function (err) {
            reject(err)
          }
        })
      })
    }
    var promiseList = []
    for (var key in imgList) {
      promiseList = promiseList.concat(imgList[key].map(function (val, index) {
        return upLoadImgPromise(val, key)
      }))
    }
    Promise.all(promiseList).then((data) => {
      callback(data)
    }).catch((err) => {

    })
  },
  //确认
  reviewSubmit() {
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    this.upLoadImg(this.data.imgList, res => {
      let products = this.data.orderItems.map((v, i) => {
        return {
          score: this.data.score[v.orderItemId],
          content: this.data.content[v.orderItemId] ? this.data.content[v.orderItemId] : '系统默认好评',
          orderItemId: v.orderItemId,
          images: this.data.imgUploadSuccessList[v.orderItemId]
        }
      })
      let options = {
        tradeId: this.data.tradeId,
        score: this.data.score.shop,
        isAnonym: this.data.isAnonym,
        products: products
      }

      new Review(res => {

        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }).submit({
        params: JSON.stringify(options)
      })
      wx.hideLoading()
    })
  },
  onLoad: function (options) {
    let that = this, tradeId = options.id, score = this.data.score, imgList = {}, content = {}, imgUploadSuccessList = {}
    new Review(res => {
      res.data.orderItems.forEach((v, i) => {
        score[v.orderItemId] = 5
        imgList[v.orderItemId] = []
        imgUploadSuccessList[v.orderItemId] = []
        content[v.orderItemId] = ''
      })
      that.setData({
        orderItems: res.data.orderItems,
        tradeId: tradeId,
        score: score,
        imgList: imgList,
        imgUploadSuccessList: imgUploadSuccessList,
        content: content
      })
    }).view({
      tradeId: tradeId
    })
  },
  //确认提交评价
  bindgetuserinfo(e) {
    let that = this
    console.log(e)
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
        this.upLoadImg(this.data.imgList, res => {
          let products = this.data.orderItems.map((v, i) => {
            return {
              score: this.data.score[v.orderItemId],
              content: this.data.content[v.orderItemId] ? this.data.content[v.orderItemId] : '系统默认好评',
              orderItemId: v.orderItemId,
              images: this.data.imgUploadSuccessList[v.orderItemId]
            }
          })
          let options = {
            tradeId: this.data.tradeId,
            score: this.data.score.shop,
            isAnonym: this.data.isAnonym,
            products: products
          }
          new Review(res => {
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 2000,
              success: function () {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }).submit({
            params: JSON.stringify(options)
          })
          wx.hideLoading()
        })
      }).update({
        headImg: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName
      })
    }
  }
})

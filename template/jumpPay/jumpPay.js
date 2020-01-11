module.exports = {
  _jumpPayInit: {
    show: false,
    cancel: "jumpPayHidden"
  },
  jumpPayShow() {
    this.setData({
      __tpljumpPayShow: Object.assign(this._jumpPayInit, this.data.__tpljumpPayShow, {
        show: true
      })
    })
  },
  jumpPayHidden() {
    this.setData({
      __tpljumpPayShow: Object.assign(this._jumpPayInit, this.data.__tpljumpPayShow, {
        show: false
      })
    })
  },
  close(e) {
    this.setData({
      __tpljumpPayShow: Object.assign(this._jumpPayInit, this.data.__tpljumpPayShow, {
        show: false
      })
    })
    this.clickNavJump(e)
  },
  clickNavJump(e) {
    var url = e.currentTarget.dataset.url
    wx.redirectTo({
      url: url,
    })
  }
}
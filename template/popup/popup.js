module.exports = {
  _tplPopupInit: {
    show: false,
    cancel: "popupHidden"
  },
  popupShow() {
    this.setData({
      __tplPopup: Object.assign(this._tplPopupInit, this.data.__tplPopup, { show: true })
    })
  },
  popupHidden() {
    this.setData({
      __tplPopup: Object.assign(this._tplPopupInit, this.data.__tplPopup, { show: false })
    })
  }
}
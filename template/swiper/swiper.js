

module.exports = {
  _adswiperimageload(e) {
    let screenWidth = wx.getSystemInfoSync().screenWidth
    let name = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index
    let imageWidth = e.detail.width
    let imageHeight = e.detail.height
    let height = (screenWidth / imageWidth) * imageHeight
    let _swiper = this.data._swiper ? this.data._swiper : {}
    _swiper[name] = _swiper[name] || {
      isLoad: [],
      height: 0
    }
    _swiper[name].isLoad[index] = true
    if (_swiper[name] && _swiper[name].height !== 0 && _swiper[name].height <= height) {
      this.setData({
        _swiper: _swiper
      })
      return
    }
    _swiper[name].height = height
    this.setData({
      _swiper: _swiper
    })
  }
}
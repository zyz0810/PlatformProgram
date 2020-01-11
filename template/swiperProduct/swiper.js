module.exports = {
  _swiper_video_toogle(e) {
    let stype = e.currentTarget.dataset.type
    this.setData({
      videoShow: stype == 1 ? true : false
    })
  }
}

let Ajax = require('./ajax.js')

module.exports = class lbs extends Ajax {
  /**
    * 区域--当前地理位置
    */
  current() {
    super.get({
      url: "weixin/lbs/current.jhtml",
      success: this.fn
    });
  }
  /**
   * 经纬度获取城市
   * lat 纬度
   * lng 经度
   */
  get(data) {
    super.get({
      url:"weixin/lbs/get.jhtml",
      data: data,
      success: this.fn
    });
  }
  /**
   * 更新当前城市
   * lat 纬度
   * lng 经度
   * areaId 区域Id
   * username 用户名
   */
  update(data) {
    super.post({
      url: 'weixin/lbs/update.jhtml',
      data: data,
      success: this.fn
    });
  }

}
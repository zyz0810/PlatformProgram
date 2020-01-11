let Ajax = require('./ajax.js')

module.exports = class Receiver extends Ajax {
  /**
   * 根据收货地址国家码获取区域编码
   * code 国家码
   */
  getAreaId(data) {
    super.get({
      url: 'applet/area/getAreaIdByCode.jhtml',
      data: data
    });
  }


  /**
   * 收货地址列表
   */
  list(data) {
    super.get({
      url: 'weixin/member/receiver/list.jhtml',
      data: data
    });
  }

  /**
   * 保存收货地址
   * areaId 区域Id
   * consignee 收货人
   * address 详细地址
   * phone 电话
   */
  save(data) {
    super.post({
      url: 'weixin/member/receiver/save.jhtml',
      data: data
    });
  }

  /**
   * 编辑收货地址页面
   * id 收货地址Id
   */
  view(data) {
    super.get({
      url: 'weixin/member/receiver/view.jhtml',
      data: data
    });
  }

  /**
   * 修改收货地址
   * id 收货地址Id
   * areaId 区域Id
   * consignee 收货人
   * address 详细地址
   * phone 电话
   */
  update(data) {
    super.post({
      url: 'weixin/member/receiver/update.jhtml',
      data: data
    });
  }

  /**
   * 删除收货地址
   * id 收货地址Id
   */
  delete(data) {
    super.post({
      url: 'weixin/member/receiver/delete.jhtml',
      data: data
    });
  }


  /**
   * 收货地址设为默认
   * id 收货地址Id
   */
  setDefault(data) {
    super.post({
      url: 'weixin/member/receiver/setIsDefault.jhtml',
      data: data
    });
  }

  /**
   * 经纬度获取城市
   * lat 纬度
   * lng 经度
   */
  get(data) {
    super.get({
      url: 'weixin/lbs/get.jhtml',
      data: data
    });
  }
}
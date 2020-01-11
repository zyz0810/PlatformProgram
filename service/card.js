let Ajax = require('./ajax.js')

module.exports = class Cart extends Ajax {
  /**
   * 会员卡列表
   */
  list(data) {
    super.get({
      url: 'applet/member/card/list.jhtml',
      data: data
    });
  }

  /**
   * 会员卡详情
   * id 会员卡id
   */
  view(data) {
    super.get({
      url: 'applet/member/card/view.jhtml',
      data: data
    });
  }


  /**
   * 会员卡一维码
   * id 会员卡id
   */
  barcode(data) {
    super.get({
      url: 'applet/member/card/barcode.jhtml',
      data: data
    });
  }


  /**
   * 会员卡返利详情
   * id 会员卡id
   */
  bonus(data) {
    super.get({
      url: 'applet/member/card/rebate/list.jhtml',
      data: data
    });
  }

}
let Ajax = require('./ajax.js')
let config = require('../utils/config.js')
module.exports = class Shelf extends Ajax {

  /**
   * 获取套餐首页
   * tenantId  店铺id
   */
  tenant_info(data) {
    super.get({
      url: 'weixin/shelves_package/tenant_info.jhtml',
      data: data
    });
  }


  /**
   * 获取货架套餐列表
   * tenantId  店铺id
   */
  list(data) {
    super.get({
      url: 'weixin/shelves_package/list.jhtml',
      data: data
    });
  }

  /**
   * 获取货架套餐详情
   * id  货架套餐id
   *
   */
  view(data) {
    super.get({
      url: 'weixin/shelves_package/getShelvesPackage.jhtml',
      data: data
    });
  }

  /**
   * 货架套餐确认订单页
   * id  货架套餐id
   *
   */
  confirm(data) {
    super.get({
      url: 'weixin/shelves_package/confirm.jhtml',
      data: data
    });
  }

  /**
   * 货架套餐订单提交
   * id  货架套餐id
   * extensionId
   * tenantId
   * count
   * mobile
   *
   */
  createOrder(data) {
    super.post({
      url: 'weixin/shelves_package/createOrder.jhtml',
      data: data
    });
  }

  /**
   * 货架套餐订单列表
   *
   *
   */
  listShelvesOrder(data) {
    super.get({
      url: 'weixin/shelves_package/listShelvesOrder.jhtml',
      data: data
    });
  }

  /**
   * 货架套餐订单详情
   * shelvesOrderId  货架套餐id
   *
   */
  shelvesOrderDetails(data) {
    super.get({
      url: 'weixin/shelves_package/shelvesOrderDetails.jhtml',
      data: data
    });
  }

  /**
   * 发起支付（单个子订单）
   * id 子订单Id
   */
  tradePayment(data) {
    super.post({
      url: 'applet/member/order/paymentShelvesOrder/' + data.id + '.jhtml?appid=' + config.APPID,
      data: data

    });
  }


  /**
   * 货架套餐订单补全信息
   * shelvesOrderId  货架套餐id
   *
   */
  confirmOrder(data) {
    super.post({
      url: 'weixin/shelves_package/confirmOrder.jhtml',
      data: data
    });
  }


  /**
   * 购买货架套餐验证是否已经注册店铺
   * mobile  手机号
   *
   */
  validDeliveryCenter(data) {
    super.get({
      url: 'weixin/shelves_package/validDeliveryCenter.jhtml',
      data: data
    });
  }

  /**
   * 购买货架套餐时注册店铺
   * name: 联系人
   * mobile: 手机号
   * verifyCode: 验证码
   * deliveryCenterName: 店铺名
   * tenantCategoryId: 所属行业
   * areaId: 区域Id
   * areaAddress: 详细信息
   * lng:
   * lat:
   *
   */
  createDeliveryCenter(data) {
    super.post({
      url: 'weixin/shelves_package/createDeliveryCenter.jhtml',
      data: data
    });
  }

}
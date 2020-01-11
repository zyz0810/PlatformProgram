let Ajax = require('./ajax.js')

module.exports = class Member extends Ajax {
  /**
   * 登陆接口
   * @param String js_code wx.login获得
   * @param Number cid 1
   */
  login(data) {
    super.post({
      url: 'applet/login.jhtml',
      hideErrorTip: true,
      data: data
    })
  }

  /**
   * 获取用户基本信息
   */
  view(data) {
    super.get({
      url: 'applet/member/view.jhtml',
      hideErrorTip: true,
      data: data
    })
  }

  /**
   * 更新用户基本信息
   * headImg   nickName
   */
  update(data) {
    super.post({
      url: 'applet/member/update.jhtml',
      hideErrorTip: true,
      data: data
    })
  }




  /**
   * 绑定手机号发送短信
   * @param:
   * mobile  手机号
   */
  sendMsgToBindPhone(data) {
    super.post({
      url: "applet/member/mobile/send_mobile.jhtml",
      data: data
    })
  }

  /**
   * 绑定手机号确定
   * @param:
   * captcha  验证码
   */
  bindPhone(data) {
    super.post({
      url: "applet/member/mobile/binded.jhtml",
      data: data
    })
  }

  /**
   * 卡号获取银行信息
   * @param cardNo 卡号
   */
  getCardInfoByCardNo(data) {
    super.get({
      url: "applet/member/bankcard/bank_info.jhtml",
      data: data
    })
  }

  /**
   * 绑定银行卡发送短信
   *  @param mobile 手机号
   */
  bindCardSendCode(data) {
    super.post({
      url: "applet/member/bank/sendCode.jhtml",
      data: data
    })
  }

  /**
   * 绑定银行卡
   * @param captcha 验证码
   * @param cardNo  卡号
   *
   * @param bankInfoId 银行Id
   * @param name     开户名
   */
  bindCard(data) {
    super.post({
      url: "applet/member/bankcard/save.jhtml",
      data: data
    })
  }


  /**
   * 我的银行卡列表
   */
  bankList() {
    super.get({
      url: 'applet/member/bankcard/list.jhtml'
    });
  }

  /**
   * 我的银行卡列表
   */
  canbankList() {
    super.get({
      url: 'applet/member/bank/bank_info/list.jhtml'
    });
  }
  /**
   * 删除银行卡
   * @param data
   * id 银行卡Id
   */
  deleteCard(data) {
    super.post({
      url: 'applet/member/bank/delete.jhtml',
      data: data
    });
  }


  /**
   * 重置支付密码发送短信
   */
  resetPaySendCode(data) {
    super.post({
      url: "applet/member/password/send_mobile.jhtml"
    })
  }

  /**
   * 检查重置密码的验证码是否正确
   @param captcha  验证码
   */
  resetPayCheckCode(data) {
    super.post({
      url: "applet/member/password/check_captcha.jhtml",
      data: data
    })
  }

  /**
   * 重置支付密码
   * @param captcha  验证码
   * @param newPass   加密后的密码
   */
  resetPay(data) {
    super.post({
      url: "applet/member/password/update.jhtml",
      data: data
    })
  }

  /**
   * 我收藏的商品
   * pageSize 页大小
   * pageNumber 页码
   */
  productList(data) {
    super.get({
      url: 'applet/member/favorite/product/list.jhtml',
      data: data
    });
  }

  /**
   * 根据货架号获取所属店铺员工数据
   * shelvesNo 货架号
   */
  employeeShelves(data) {
    super.get({
      hideErrorTip: true,
      url: 'applet/member/shelves/employee.jhtml',
      data: data
    })
  }

  /**
   * 模板推送前获取formId
   * formIds
   */
  addFormId(data) {
    super.post({
      hideErrorTip: true,
      url: 'applet/member/addFormId.jhtml',
      data: data
    })
  }

  /**
   * 永久存储货架号和推广图
   */
  saveShelf(data) {
    super.post({
      hideErrorTip: true,
      url: 'applet/member/updateShelfNoAndExtension.jhtml',
      data: data
    })
  }

  /**
   * 实名认证
   */
  idcardSave(data) {
    super.post({
      url: 'weixin/member/idcard/save.jhtml',
      data: data
    })
  }

  /**
   * 银行卡开户行所属地区
   * areaId
   */
  provinceList(data) {
    super.get({
      hideErrorTip: true,
      url: 'weixin/area/children.jhtml',
      data: data
    })
  }
  /**
   * 记录用户浏览记录
   * tenantId  商家Id
   */
  tenatBrowseHistory(data) {
    super.post({
      url: 'weixin/tenant/tenatBrowseHistory.jhtml',
      data: data
    })
  }
  /**
   * 我的浏览记录
   * 
   */
  findTenatBrowseHistory(data) {
    super.get({
      url: 'weixin/tenant/findTenatBrowseHistory.jhtml',
      data: data
    })
  }

  /**
  * 来一架商家版跳转绑定手机号
  * @param:
  * b2bMemberId  来一架商家版memberId
  */
  bindByB2BMember(data) {
    super.post({
      url: "applet/member/mobile/bindByB2BMember.jhtml",
      data: data
    })
  }

}
let Ajax = require('./ajax.js')

module.exports = class nearBy extends Ajax {

  areaList() {
    super.get({
      url: "weixin/area/community.jhtml"
    });

  }


  category() {
    super.get({
      url: "weixin/tenantCategory/all.jhtml"
    });

  }

  // 商品搜索分类
  productCategory() {
    super.get({
      url: "weixin/productCategory/roots.jhtml",
      hideErrorTip: true
    });

  }

}
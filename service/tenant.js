let Ajax = require('./ajax.js')

module.exports = class Tenant extends Ajax {

  /**
   * 商家列表
   * tenantCategoryId 店铺分类Id
   * areaId           区域Id
   * channelId        频道Id
   * lat         坐标
   * lng         坐标
   * distatce         距离内
   * tagIds           标签Ids
   * communityId      商圈Id
   * isPromotion      优惠商家true，全部商家false或null
   * isUnion          是否是联盟商家
   * keyword          关键字
   * orderType        排序方式（默认排序 weight,点击降序 hitsDesc,评分降序 scoreDesc,日期降序 dateDesc,距离优先 distance）
   * pageSize         分页参数（pageSize每页记录数,pageNumber页码）
   * pageNumber         分页参数（pageSize每页记录数,pageNumber页码）
   * communityId       商圈id
   * communityZdyTagId 自定义标签id
   */
  areaList(data) {
    super.get({
      url: 'weixin/tenant/list.jhtml',
      data: data
    });
  }

  /**
   * 商家详情
   * id 店铺ID
   * lat 纬度
   * lng 经度
   */
  view(data) {
    super.get({
      url: 'applet/tenant/view.jhtml',
      data: data
    });
  }


  /**
   * 优惠买单分享
   * id 商家Id
   */
  offerToPayShare(data) {
    super.get({
      url: 'applet/tenant/offerToPay/share.jhtml',
      data: data
    });
  }


  /**
   * 获取商家商品分类
   * tenantId 店铺Id
   */
  productCategory(data) {
    super.get({
      url: 'applet/productCategoryTenant/all.jhtml',
      data: data
    });
  }

  /**
   * 获取商家商品分类(树形结构)
   * tenantId 店铺Id
   */
  productCategoryTree(data) {
    super.get({
      url: 'applet/productCategoryTenant/alll.jhtml',
      data: data
    });
  }

  /**
   * 获取商家商品分类
   * tenantId 店铺Id
   */
  productCategoryRoot(data) {
    super.get({
      url: 'applet/productCategoryTenant/roots.jhtml',
      data: data
    });
  }
  /**
   * 是否全部一级分类
   * tenantId 店铺Id
   */
  allFirstGrade(data) {
    super.get({
      url: 'applet/productCategoryTenant/allFirstGrade.jhtml',
      data: data
    })
  }

  /**
   * 获取商家门店列表
   * id 店铺Id
   * pageSize 每页记录数
   * pageNumber页码
   */
  deliveryCenterList(data) {
    super.get({
      url: 'applet/tenant/deliveryCenter/list.jhtml',
      data: data
    });
  }

  /**
   * 获取商家门店列表
   * ids 店铺Id（数组）
   * pageSize 每页记录数
   * pageNumber页码
   */
  deliveryCenterLists(data) {
    super.get({
      url: 'applet/tenant/deliveryCenter/lists.jhtml',
      data: data
    });
  }



  /**
   * 添加店铺到收藏
   * id 店铺Id
   */
  favorite(data) {
    super.post({
      url: 'applet/member/favorite/tenant/add.jhtml',
      data: data
    });
  }

  /**
   * 取消店铺收藏
   * id 店铺ID
   */
  delFavorite(data) {
    super.post({
      url: 'applet/member/favorite/tenant/delete.jhtml',
      data: data
    });
  }

  /**
   * 店铺软文
   * id 店铺Id
   */
  article(data) {
    super.get({
      url: 'applet/tenant/article.jhtml',
      data: data,
    });
  }


  /**
   * 进店成为会员
   * id 店铺Id
   * extension  推广人
   */
  becomeVip(data) {
    super.post({
      url: 'applet/tenant/becomeVip.jhtml',
      data: data,
      hideErrorTip: true
    });
  }
  /**
   * 用户访问小荐货商家记录
   */
  newest(data) {
    super.get({
      hideErrorTip: true,
      url: 'applet/member/appletRecord/list.jhtml',
      data: data
    });
  }
  /**
   * 商家热门搜索词
   */
  hot_search(data) {
    super.get({
      hideErrorTip: true,
      url: '/weixin/tenant/hot_search.jhtml',
      data: data
    });
  }

  /**
   * 首页城市优选推荐
   * tagId=2
   * 首页品牌馆
   * tagId=92
   * 
   */
  firstRecommend(data) {
    super.get({
      url: 'weixin/tenant/firstRecommend.jhtml',
      data: data,
    });
  }

  /**
   * 店铺海报分享的图片和小程序码生产
   * tenantId 店铺Id
   * shelvesNo  货架号
   */
  tenantShare(data) {
    super.get({
      url: 'applet/tenant/share.jhtml',
      data: data,
      hideErrorTip: true
    });
  }
  /**
   * 获取平台商家分类
   * 
   */
  tenantCategory(data) {
    super.get({
      url: 'weixin/tenantCategory/all.jhtml',
      data: data
    });
  }
  /**
   * 商家详情
   * id 店铺ID
   * lat 纬度
   * lng 经度
   */
  excellentStore(data) {
    super.get({
      url: 'applet/tenant/excellentStore.jhtml',
      data: data
    });
  }
}
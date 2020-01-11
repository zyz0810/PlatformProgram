let Ajax = require('./ajax.js')
let config = require('../utils/config.js')
module.exports = class Product extends Ajax {

  /**
   * 商品详情
   * id 商品Id
   */
  view(data) {
    super.get({
      url: 'applet/product/view.jhtml',
      data: data

    });
  }

  /**
   * 商品详情（好物圈）
   * id 商品Id
   */
  viewFriend(data) {
    super.post({
      url: 'applet/member/productshare/import.jhtml?appid=' + config.APPID,
      hideErrorTip: true,
      data: data

    });
  }

  /**
   * 商品详情页分享
   * id 商品Id
   */
  share(data) {
    super.get({
      url: 'applet/product/share.jhtml',
      data: data

    });
  }

  /**
   * 商品列表
   * productCategoryId 平台分类 id
   * communityId 商圈
   * keyword 搜索关键词
   * tagIds 商品签标
   * brandId 品牌
   * startPrice endPrice 介位段
   * isTop 是否置顶
   * isGift 是否是赠品
   * isOutOfStock 是否库存不足
   * orderType 排序 {综合排序 weight,置顶降序 topDesc, 价格升序 priceAsc,价格降序 priceDesc,销量降序 salesDesc,评分降序 scoreDesc, 日期降序 dateDesc,人气降序 hitsDesc}
   */
  list(data) {
    super.get({
      url: 'weixin/product/list.jhtml',
      data: data,
      hideErrorTip: true
    })
  }

  /**
   * 获取指定商家的商品列表
   * id 商家编号
   * productCategoryTenantId 商家分类 id
   * keyword 搜索关键词
   * tagIds 商品签标(2新品,5推荐,1热销)
   * brandId 品牌
   * startPrice endPrice 介位段
   * orderType 排序 {综合排序 weight,置顶降序 topDesc, 价格升序 priceAsc,价格降序 priceDesc,销量降序 salesDesc,评分降序 scoreDesc, 日期降序 dateDesc,人气降序 hitsDesc}
   */
  listT(data) {
    super.get({
      url: 'applet/product/list/' + data.id + '.jhtml',
      data: data,
      hideErrorTip: true
    })
  }

  /**
   * tenantId 商家编号
   * count 商品条数
   */
  listL(data) {
    super.get({
      url: 'weixin/product/seckill/list.jhtml',
      data: data
    })
  }

  /**
   * 商家促销商品
   * tenantId 商家Id
   * location 经纬度
   * pageable 分页
   */
  promotionList(data) {
    super.get({
      url: 'applet/product/promotion/list.jhtml',
      data: data

    });
  }

  /**
   * 邻家好货，指联盟商品的商品
   * id 商家Id
   */
  unions(data) {
    super.get({
      url: 'applet/product/unions.jhtml',
      data: data

    });
  }

  /**
   * 获取推荐，搭配商品列表
   * id 商品Id
   */
  recommend(data) {
    super.get({
      url: 'applet/product/recommend.jhtml',
      data: data

    });
  }

  /**
   * 商品热门搜索词
   */
  hot_search() {
    super.get({
      url: 'applet/product/hot_search.jhtml'

    });
  }

  /**
   * 添加商品到收藏
   * id 商品Id
   */
  favorite(data) {
    super.post({
      url: 'applet/member/favorite/product/add.jhtml',
      data: data
    })
  }

  /**
   * 取消商品收藏
   * id 商品Id
   */
  delFavorite(data) {
    super.post({
      url: 'applet/member/favorite/product/delete.jhtml',
      data: data
    })
  }


  /**
   * 搭配销售
   * id 商品Id
   */
  tieinsale(data) {
    super.get({
      url: 'applet/product/tieinsale.jhtml',
      data: data

    });
  }

  /**
   * 获取推荐，搭配商品列表
   * id 商品Id
   */
  recommend(data) {
    super.get({
      url: 'applet/product/recommend.jhtml',
      data: data
    });
  }

  /**
   * 货架商品
   *  货架号:shelvesNo
   * 商家id :tenantId
   */
  shelvesList(data) {
    super.get({
      url: 'applet/productShelves/list.jhtml',
      data: data
    });
  }


  /**
   * 货架编号转货架号
   * 编号id :tenantId
   */
  getShelfNoByCode(data) {
    super.get({
      url: 'applet/member/orderShelves/getShelfNoByCode.jhtml',
      data: data
    });
  }

  /**
   * 商品访问记录
   * 商家id :tenantId
   * 商品id：productId
   * visitType   访问类型  (无线网wifi,C端app,购物屏pad,微信weixin)
   * machineType 设备类型  (手机mobile,平板pad,电脑pc)
   */
  record(data) {
    super.post({
      url: 'weixin/visitRecord/add.jhtml',
      data: data
    });
  }

  /**
   * 商品分享码获取
   * 商家id :tenantId
   * 商品id：productId
   */
  code(data) {
    super.get({
      url: 'applet/productShelves/code.jhtml',
      data: data,
      hideErrorTip: true
    });
  }

  /**
   * 分类商品
   * @param keyword  关键字搜索
   * @param categoryId  分类id
   */
  categoryProduct(data) {
    super.get({
      url: 'applet/product/category_product.jhtml',
      data: data
    });
  }

  /**
   * 平台新品商品
   */
  platFormProductNew(data) {
    super.get({
      url: 'weixin/product/news/page.jhtml',
      data: data
    });
  }

  /**
   * 平台推荐商品
   */
  platFormProductRec(data) {
    super.get({
      url: 'weixin/product/recommend/page.jhtml',
      data: data
    });
  }


  /**
   * 平台活动限时折扣
   */
  platFormSeckill(data) {
    super.get({
      url: 'weixin/product/seckill/page.jhtml',
      data: data
    });
  }

  /**
   * 平台好物推荐商品
   */
  goodRecommend(data) {
    super.get({
      url: 'weixin/product/goodRecommend/page.jhtml',
      data: data
    });
  }

  /**
   * 平台新品商品（新）
   */
  goodNew(data) {
    super.get({
      url: 'weixin/product/goodNew/page.jhtml',
      data: data
    });
  }

  /**
   * 平台猜你喜欢商品
   */
  goodLike(data) {
    super.get({
      url: 'weixin/product/goodLike/page.jhtml',
      data: data
    });
  }
  /**
    * 平台新人特惠
    */
  newPreferential(data) {
    super.get({
      url: 'weixin/product/newPreferential.jhtml',
      data: data
    });
  }

}
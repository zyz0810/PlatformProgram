let Ajax = require('./ajax.js')

module.exports = class Category extends Ajax {
  /**
   * 获取channel
   */
  // list(data) {
  //   super.get({
  //     data: data,
  //     url: "b2bwx/categoryGroup/index_group.jhtml?id=1",
  //   });
  // }

  // /**
  //    * 获取二级分类
  //    * groupId
  //    */
  // twoList(data) {
  //   super.get({
  //     data: data,
  //     url: "b2bwx/category/find_category_by_group.jhtml",
  //   });
  // }

  /**
    * 获取channel
    */
  list(data) {
    super.get({
      data: data,
      url: "b2b/applet/productCategory/roots.jhtml",
    });
  }

  /**
      * 获取二级分类
      * groupId
      */
  twoList(data) {
    super.get({
      data: data,
      url: "b2b/applet/productCategory/children.jhtml",
    });
  }

}
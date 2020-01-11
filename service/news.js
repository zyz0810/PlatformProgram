let Ajax = require('./ajax.js')

module.exports = class news extends Ajax {


    /**
     * 店铺文章分类
     * tenantId 店铺ID
     */
    calssify(data) {
        super.get({
            url:  'applet/tenantArticleCategory/list.jhtml',
            data: data
        });
    }

    /**
     * 店铺文章列表
     * tenantId 店铺ID
     * categoryId 分类id
     */
    newsList(data) {
        super.get({
            url:  'applet/tenantArticle/list.jhtml',
            data: data
        });
    }

    /**
     * 店铺文章详情
     * id 文章ID
     */
    newsView(data) {
        super.get({
            url:  'applet/tenantArticle/view.jhtml',
            data: data
        });
    }


}
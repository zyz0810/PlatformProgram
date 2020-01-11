let Ajax = require('./ajax.js')

module.exports = class kuaixun extends Ajax {
    /**
     * 列表
     * pageSize 页大小
     * pageNumber 页号
     * tenantId 店铺Id
     */
    list(data) {
        super.get({
            url: 'applet/kuaixun/list.jhtml',
            data: data
        });
    }
    /**
     * 详情
     * id 快讯Id
     */
    view(data) {
        super.get({
            url: 'applet/kuaixun/view.jhtml',
            data: data
        });
    }
    /**
     * 点赞/取消点赞
     * id 文章id
     */
    praise(data) {
        super.post({
            url: 'applet/kuaixun/praise.jhtml',
            data: data
        })
    }
    /**
     * 收藏/取消收藏
     * id 文章id
     */

    favorite(data) {
        super.post({
            url: '/applet/kuaixun/favorite.jhtml',
            data: data
        })
    }
    /**
     * 访问
     */
    visit(data) {
        super.get({
            url: 'applet/kuaixun/visit_number.jhtml',
            data: data

        })
    }

}
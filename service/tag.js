let Ajax = require('./ajax.js')

module.exports = class Tag extends Ajax {


    /**
     * 获取标签列表
     * type=shelves
     */
    list(data) {
        super.get({
            url:  '/applet/tag/list.jhtml',
            data: data
        });
    }
}
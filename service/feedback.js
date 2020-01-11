let Ajax = require('./ajax.js')

module.exports = class Feedback extends Ajax {


    /**
     * 意见反馈
     * type 反馈类型（ 建议：suggest,想吃什么：eat，其他：other）
     * content 反馈内容
     * images[{file 文件}]  图片集合
     * mobile   手机号
     */
    save(data) {
        super.post({
            url:'/applet/member/feedback/save.jhtml',
            data:data
        });
    }

}
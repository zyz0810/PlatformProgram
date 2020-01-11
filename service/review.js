let Ajax = require('./ajax.js')

module.exports = class review extends Ajax {
    /**
     * 订单评价页
     * tradeId 子订单Id
     */
    view(data) {
        super.get({
            url:'applet/member/review/view.jhtml',
            data: data
        });
    }
    /**
     * 订单、商品评价提交（使用FormData方式提交）
     * tradeId    子订单Id(订单评论时传)
     * orderItemId    商品项Id(商品评论时传)
     * score  商品、商家评分
     * assistant    导购评分
     * content    内容
     * flag  评论对象(trade订单评论,product商品评论)
     * images[{file 文件}]  图片集合
     * isAnonym 是否匿名
     */
    submit(data) {
        super.post({
            url:'applet/member/review/add.jhtml',
            data: data
        });
    }


    /**
     * 商品评价列表
     * id 商品Id
     * pageSize 页大小
     * pageNumber 页码
     */
    list(data) {
        super.get({
            url:'applet/member/review/list.jhtml',
            data: data
        });
    }
  

}
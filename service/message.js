let Ajax = require('./ajax.js')

module.exports = class Message extends Ajax {
    /**
     * 消息列表
     * type 消息类型（订单提醒order,账单提醒account,系统消息message）
     * pageSize 页大小
     * pageNumber 页码
     */
    list(data) {
        super.get({
            url:'applet/member/message/list.jhtml',
            data: data
        });
    }

    /**
     * 获取第一条消息
     */
    firstMessage() {
        super.get({
            url: 'applet/member/message/first_message.jhtml'
        });
    }

    /**
     * 未读消息数
     */
    count(data) {
      super.get({
        url: 'applet/member/message/count.jhtml',
        data: data
      });
    }


}
let Ajax = require('./ajax.js')

module.exports = class AppletRecord extends Ajax {


    /**
     * 小荐货最新一条记录
     */
    newest(data) {
        super.get({
            url:  '/applet/member/appletRecord/newest.jhtml',
            data: data
        });
    }




}
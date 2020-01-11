let Ajax = require('./ajax.js')

module.exports = class Ad extends Ajax {
    /**
     * 获取同城广告
     * @param position 广告位Id
     */
    do(position) {
        super.get({
            url:  "applet/ad.jhtml?position=" + position
        });

    }
    /**
     * 获取商家广告
     * @param position 广告位id
     * @param tenantId 商家Id
     */
    doT(position, tenantId) {
        super.get({
            url: "applet/ad/" + tenantId + ".jhtml?position=" + position
        });

    }
    /**
     * 获取频道广告位
     * id 广告位Id(顶部banner 143,中间部位 144)
     * productChannelId 频道id
     * areaId 区域Id
     * count 数量
     * tenantCategoryId 商家分类Id
     */
    channel(data) {
        super.get({
            url: 'applet/ad/channel.jhtml',
            data: data
        });

    }

}
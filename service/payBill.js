let Ajax = require('./ajax.js')

module.exports = class payBill extends Ajax {
    /**
     * 根据用户输入的金额，获取平台立减和店铺优惠券
     * id 店铺Id
     * amount 消费金额
     * noAmount 不参与金额
     */
    getAmount(data){
        super.post({
            url:'applet/pay/bill/get/amount.jhtml',
            data:data
        });
    }
    /**
     * 买单立减订单提交
     * id 店铺Id
     * amount 消费金额
     * noAmount 不参与金额
     * deliveryCenterId 门店Id
     * type 支付类型（1:微信扫码支付；原功能不传此参数）
     */
    submit(data) {
        super.post({
            url:'applet/member/pay/bill/get/amount.jhtml',
            data:data
        })
    }
    /**
     * 根据经纬度获取实体店地址
     * id 店铺Id
     * lat 纬度
     * lng 经度
     */
    deliveryCenter(data) {
        super.get({
            url:'applet/pay/bill/deliver/center.jhtml',
            data:data
        });
    }
    /**
     * 查询支付状态
     * sn 支付单号
     * @return 0:处理中，1支付成功，2支付失败
     */
    query(data) {
        super.get({
            url:'applet/member/pay/bill/query.jhtml',
            data:data
        })
    }
}
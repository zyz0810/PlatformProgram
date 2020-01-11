let Ajax = require('./ajax.js')

module.exports = class CartShelves extends Ajax {
    /**
     * 购物车列表
     * shelvesNo 货架号
     */
    list(data) {
        super.get({
            url: 'applet/cartShelves/list.jhtml',
            data: data
        });
    }
    /**
     * 编辑数量
     * id 购物项Id
     * quantity 数量
     * shelvesNo 货架号
     */
    edit(data) {
        super.post({
            url:   'applet/cartShelves/edit.jhtml',
            data: data
        });
    }

    /**
     * 添加至购物车
     * id 商品Id
     * quantity 数量
     * type (buy为立即购买)
     * shelvesNo 货架号
     */
    add(data) {
        super.post({
            url:   'applet/cartShelves/add.jhtml',
            data: data
        });
    }

    /**
     * 删除
     * ids 购物项id(数组)
     * shelvesNo 货架号
     */
    delete(data) {
        super.post({
            url:  'applet/cartShelves/delete.jhtml',
            data: data,
            traditional: true
        });
    }
    /**
     * 删除
     * ids 商品id(数组)
     * shelvesNo 货架号
     */
    del(data) {
        super.post({
            url:  'applet/cartShelves/del.jhtml',
            data: data,
            traditional: true
        });
    }

    /**
     * 购物车商品数量
     * shelvesNo 货架号
     */
    count(data) {
        super.get({
            url:  'applet/cartShelves/count.jhtml',
            data: data
        })
    }

    /**
     * 清空购物车
     * shelvesNo 货架号
     */
    clear(data) {
        super.post({
            url:  'applet/cartShelves/clear.jhtml',
            data: data
        })
    }

    /**
     * 查询货架商品模板
     * shelvesNo 货架号
     */
    productModel(data) {
        super.get({
            hideErrorTip: true,
            url:  'applet/productShelves/imageType.jhtml',
            data: data
        })
    }

}
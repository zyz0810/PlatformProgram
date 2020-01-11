/**
 * @options
 * title:标题
 * header:数字
 * show:显示（boolean）
 * btnFn:function||ActionsheetConfirm//确认函数
 * localIndex:当前item行
 * item:[ 显示行
 *  {
 *     name：左名
 *     content：右名
 *     more：显示箭头（boolean）
 *  }
 * ]
 * 
 */
module.exports = {
  //初始化
  ActionsheetInitData() {
    if (this.data.__actionsheet) {
      return
    }
    let initdata = {
      title: '确认付款',
      header: '0.00',
      show: false,
      submit: 'actionsheetConfirm',
      item: [
        {

          name: '订单消息',
          content: '转账',
          more: false,
          fn: '',
          index: 0,
          data: null
        },
        {
          name: '付款方式',
          content: '微信支付',
          more: true,
          fn: 'changePayMethod',
          index: 1,
          data: null
        },
      ]
    }
    this.setData({
      __actionsheet: initdata
    })
  },
  ActionsheetCatchMove(){
    return false;
  },
  //显示
  ActionsheetShow() {
    this.ActionsheetInitData()
    this.setData({
      __actionsheet: Object.assign({}, this.data.__actionsheet, {
        show: true
      })
    })
  },
  //隐藏
  ActionsheetHide() {
    this.ActionsheetInitData()
    this.setData({
      __actionsheet: Object.assign({}, this.data.__actionsheet, {
        show: false
      })
    })
  },
  //设置数据
  ActionsheetSet(options) {
    this.ActionsheetInitData()
    this.setData({
      __actionsheet: Object.assign({}, this.data.__actionsheet, options)
    })
  },
  //设置行数据
  ActionsheetSetItem(item, index) {
    this.ActionsheetInitData()
    let data = this.data.__actionsheet
    data.item[index] = Object.assign({}, data.item[index], item)
    this.setData({
      __actionsheet: data
    })
  },
  //获取行数据
  ActionsheetGetItem(index, name = 'data') {
    return this.data.__actionsheet.item[index][name]
  }
}
var app = getApp();
var countdown = require("../../../../utils/util.js").countdown;
var util = require("../../../../utils/util.js");
var member = require("../../../../service/member.js");

Page({
  data: {
    tips: "验证码",
    choose: false,
    info: [],
    nowBank: '点我选择银行',
    id: '',
    count: 60,
    captcha: '',
    bankInfoId: '',
    cardNo: '',
    name: '',
    phone: '',
    from: '',
    nowArea: '点我选择开户行所属地区',
    province: [],
    nowCity: '',
    city: [],
    hasChildren: ''
  },
  onLoad: function(options) {
    this.setData({
      mainColor: app.globalData.mainColor
    })
    var that = this;
    if (options.from) {
      this.setData({
        from: options.from
      })
    }
    new member(function(res) {
      that.setData({
        info: res.data
      })
    }).canbankList();

    new member(function(res) {
      that.setData({
        province: res.data
      })
    }).provinceList();


  },
  onShow: function() {

  },

  //展示可选银行列表
  chooseBank: function() {
    var that = this;
    that.setData({
      choose: true
    })
  },
  //展示银行卡开户行省份
  chooseProvince: function() {
    var that = this;
    that.setData({
      provinceShow: true
    })
  },
  //展示银行卡开户行城市
  chooseArea: function() {
    var that = this;
    that.setData({
      provinceShow: false,
      cityShow: true
    })
  },

  //选择银行
  bankCS: function(e) {
    var that = this;
    that.setData({
      nowBank: e.currentTarget.dataset.name,
      choose: false,
      id: e.currentTarget.dataset.id
    })
  },
  //选择开户行所属省份
  provinceCS: function(e) {
    var that = this;
    console.log(e.currentTarget.dataset.haschildren)
    that.setData({
      cityShow: true,
      nowArea: e.currentTarget.dataset.name,
      provinceShow: false,
      provinceId: e.currentTarget.dataset.id,
      hasChildren: e.currentTarget.dataset.haschildren
    })

    if (that.data.hasChildren == true) {
      new member(function(res) {
        that.setData({
          city: res.data
        })
      }).provinceList({
        areaId: e.currentTarget.dataset.id
      });
    }



  },
  //选择开户行所属城市
  cityCS: function(e) {
    var that = this;
    that.setData({
      nowCity: e.currentTarget.dataset.name,
      cityShow: false,
      cityId: e.currentTarget.dataset.id
    })
  },

  //输入卡号
  cardNo: function(e) {
    this.setData({
      cardNo: e.detail.value.trim()
    })
  },

  //输入姓名
  name: function(e) {
    this.setData({
      name: e.detail.value.trim()
    })
  },

  //输入证件号
  idCard: function(e) {
    this.setData({
      idCard: e.detail.value.trim()
    })
  },

  //输入手机号
  phone: function(e) {
    this.setData({
      phone: e.detail.value.trim()
    })
  },

  captcha: function(e) {
    this.setData({
      captch: e.detail.value.trim()
    })
  },

  //发送验证码
  sendcode: function() {
    var that = this;
    var truemobile = that.data.phone;
    if (!(/^1[3456789]\d{9}$/.test(truemobile))) { //手机号检测
      util.errShow('手机号格式错误')
    } else {
      new member(function(res) {
        countdown(that);
      }).bindCardSendCode({
        mobile: that.data.phone
      })
    }

  },
  //提交银行卡添加
  submit: function() {
    var that = this;
    if (that.data.id == '') {
      util.errShow('请选择银行');
    } else if (!util.luhmCheck(that.data.cardNo)) {
      util.errShow('非正确银行卡号');
    } else if (that.data.name == '') {
      util.errShow('请输入姓名');
    } else if (!(/^1[3456789]\d{9}$/.test(that.data.phone))) { //手机号检测
      util.errShow('手机号格式错误')
    } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(that.data.idCard))) {
      util.errShow('证件号错误')
    } else if (that.data.captch == '' || that.data.id == '' || that.data.cardNo == '' || that.data.name == '') {
      util.errShow('请填写信息完整')
    } else {
      new member(function(res) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 2200)

      }).bindCard({
        captcha: that.data.captch,
        bankInfoId: that.data.id,
        cardNo: that.data.cardNo,
        depositUser: that.data.name,
        idCardNo: that.data.idCard,
        bankProvince: that.data.nowArea,
        bankCity: that.data.nowCity,
        phone: that.data.phone
        // captcha: that.data.captch,
        // bankInfoId: 8,
        // cardNo: 6216913401702312,
        // depositUser: '宛明',
        // idCardNo: 111111111111111111,
        // bankProvince: '安徽',
        // bankCity: '合肥'
      })
    }
  }

});
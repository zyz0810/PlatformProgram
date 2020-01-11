var config = require('config.js')

function countdown2(that, count, tips) {
  var setTime = count ? count : 60
  var time = setTime
  var tips = tips ? tips : "验证码"
  return (function timeFn(o) {
    if (time == 0) {
      that.setData({
        tips: tips,
        disabled: false
      })
      time = setTime
    } else {
      that.setData({
        disabled: true,
        tips: time + "s重试"
      })
      time--;
      setTimeout(function() {
        timeFn(o)
      }, 1000)
    }
  })()
}
/**
 * 判断是否是emoji
 */
function isEmojiCharacter(substring) {
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
        hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
        hs == 0x2b50) {
        return true;
      }
    }
  }
}

function countdown(that) {
  var count = that.data.count
  if (count == 0) {
    that.setData({
      tips: "发送验证码",
      count: 60,
      disabled: false
    })
    clearTimeout(time);
    return false;
  } else if (that.data.count == 60) {
    that.setData({
      disabled: true,
      tips: "60s重试"
    })
  } else {
    that.setData({
      disabled: true
    })
  }
  var time = setTimeout(function() {
    that.setData({
      count: count - 1,
      tips: count - 1 + "s重试",
    })
    countdown(that);
  }, 1000)

}

function getVersion() {
  return wx.getSystemInfoSync().SDKVersion || '1.0.0'
}

function errShow(text, duration = 1000, callback = function() {}) {
  const SDKVersion = wx.getSystemInfoSync().SDKVersion || '1.0.0'
  const [MAJOR, MINOR, PATCH] = SDKVersion.split('.').map(Number)
  if (MAJOR >= 1 && MINOR >= 1) { //兼容处理
    wx.showToast({
      title: text,
      icon: 'none',
      // icon: 'error',
      // image: '/resources/images/x.png',
      duration: duration
    })
    setTimeout(function() {
      callback()
    }, duration)
  } else {
    wx.showModal({
      title: '提示',
      content: text,
      showCancel: false,
      success: function(res) {
        if (!callback) return
        if (res.confirm) {
          callback()
        }
      }
    })
  }
}

function noHideShow(content, duration = 1000, callback = function() {}) {
  let _compData = {
    '_toast_.isHide': false,
    '_toast_.icon': '',
    '_toast_.content': ''
  }
  let pages = getCurrentPages()
  pages[pages.length - 1].setData({
    '_toast_.isHide': true,
    '_toast_.icon': 'icon-jinggao',
    '_toast_.content': content
  })
  setTimeout(function() {
    pages[pages.length - 1].setData({
      '_toast_.isHide': false
    })
    callback()
  }, 1500)
}


//银行卡号校验

//Description:  银行卡号Luhm校验

//Luhm校验规则：16位银行卡号（19位通用）:

// 1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
// 2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
// 3.将加法和加上校验位能被 10 整除。
function luhmCheck(bankno) {
  if (bankno.length < 16 || bankno.length > 19) {
    return false;
  }
  var num = /^\d*$/; //全数字
  if (!num.exec(bankno)) {
    return false;
  }
  //开头6位
  var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
  if (strBin.indexOf(bankno.substring(0, 2)) == -1) {
    return false;
  }
  var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhm进行比较）

  var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
  var newArr = new Array();
  for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1));
  }
  var arrJiShu = new Array(); //奇数位*2的积 <9
  var arrJiShu2 = new Array(); //奇数位*2的积 >9

  var arrOuShu = new Array(); //偶数位数组
  for (var j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 == 1) { //奇数位
      if (parseInt(newArr[j]) * 2 < 9)
        arrJiShu.push(parseInt(newArr[j]) * 2);
      else
        arrJiShu2.push(parseInt(newArr[j]) * 2);
    } else //偶数位
      arrOuShu.push(newArr[j]);
  }

  var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
  var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
  for (var h = 0; h < arrJiShu2.length; h++) {
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
  }

  var sumJiShu = 0; //奇数位*2 < 9 的数组之和
  var sumOuShu = 0; //偶数位数组之和
  var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
  var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
  var sumTotal = 0;
  for (var m = 0; m < arrJiShu.length; m++) {
    sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
  }

  for (var n = 0; n < arrOuShu.length; n++) {
    sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
  }

  for (var p = 0; p < jishu_child1.length; p++) {
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
  }
  //计算总和
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

  //计算Luhm值
  var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
  var luhm = 10 - k;

  if (lastNum == luhm) {
    return true;
  } else {
    return false;
  }
}

function checkSystem() {
  var systemInfo = wx.getSystemInfoSync()
  if (systemInfo.system.indexOf('iOS') > -1) {
    return 'ios'
  } else {
    return 'android'
  }
}

function getTime(date) {
  var date = new Date(date)
  var Y = date.getFullYear()
  var M = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var Mi = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  var W = date.getDay();
  if (W == 0) {
    W = "周日";
  } else if (W == 1) {
    W = "周一";
  } else if (W == 2) {
    W = "周二";
  } else if (W == 3) {
    W = "周三";
  } else if (W == 4) {
    W = "周四";
  } else if (W == 5) {
    W = "周五";
  } else if (W == 6) {
    W = "周六";
  }
  return {
    Y,
    M,
    D,
    H,
    Mi,
    S,
    W,
    date
  }
}
/**
 * 判断是不是昨天
 */
function isYestday(theDate) {
  var date = (new Date()); //当前时间
  var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
  var yestday = new Date(today - 24 * 3600 * 1000).getTime();
  return theDate.getTime() < today && yestday <= theDate.getTime();
}
/**
 * 判断是不是今天
 */
function isToday(date) {
  // var date = new Date(str);
  var todaysDate = new Date();
  if (date.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
    return true;
  } else {
    return false;
  }
}

function shareGetTime(time) {
  var date = new Date(time.replace(/-/g, '/'))
  var Y = date.getFullYear()
  var M = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var Mi = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  if (isToday(date)) {
    return "今天 " + H + ':' + Mi
  }
  if (isYestday(date)) {
    return "昨天 " + H + ':' + Mi
  }
  if (date.getFullYear() == new Date().getFullYear()) {
    return M + '月' + D + '日 ' + H + ':' + Mi
  }
  return Y + '年' + M + '月' + D + '日 ' + H + ':' + Mi
}

function navigateTo(options) {
  if (getCurrentPages().length >= 10) {
    wx.redirectTo(options)
  } else {
    wx.navigateTo(options)
  }
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */
function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

/**
 * getUrlAfterUpload选择图片上传
 * fn上传成功函数，failChooseFn选择图片取消，failFn上传图片失败，url上传地址
 */
function getUrlAfterUpload(fn, failChooseFn, failFn, url) {
  var url = url ? url : config.BASE_URL + '/weixin/file/upload_image.jhtml'
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function(res) {
      var tempFilePaths = res.tempFilePaths[0]
      wx.uploadFile({
        url: url,
        filePath: tempFilePaths,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        success: function(res) {
          var data = JSON.parse(res.data)
          if (data.message && data.message.type == 'success') {
            if (fn) fn(data.data, tempFilePaths)
          } else {
            errShow('上传失败！服务器或网络错误')
          }
        },
        fail: function(res) {
          if (failFn) failFn(res, tempFilePaths)
          errShow('上传失败！服务器或网络错误')
        }
      })
    },
    fail: function(res) {
      errShow('未选择图片', 500)
      if (failChooseFn) failChooseFn(res)
    }
  })
}
module.exports = {
  countdown,
  errShow,
  countdown2,
  luhmCheck,
  checkSystem,
  getTime,
  isEmojiCharacter,
  shareGetTime,
  getVersion,
  noHideShow,
  navigateTo,
  formatTimeTwo,
  getUrlAfterUpload
}
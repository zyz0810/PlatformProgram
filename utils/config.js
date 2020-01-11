module.exports = {
  //ajax请求baseurl
  // BASE_URL: "https://www.laiyijia.com/",
  BASE_URL: "https://dev.tiaohuo.com/",
  // BASE_URL: "http://192.168.1.126:8080/",
  // BASE_URL: "http://192.168.1.6:8089/",
  // BASE_URL: "http://192.168.1.154:8089/",
  //登陆失败后尝试重复登陆次数
  LOGIN_ERROR_TRY_COUNT: 5,
  //登陆失败后多长时间间隔重新发起登陆请求
  LOGIN_ERROR_TRY_TIMEOUT: 1000,
  //上传接口地址
  UPLOAD_URL: "/applet/file/upload2local.jhtml",
  //上传临时文件接口地址                                           
  UPLOAD_TEMP_URL: "applet/file/upload_temp.jhtml",
  //i来一架小程序id
  // APPID: "wx1854eb32a95e1e37"
  //来一架测试小程序id
  APPID: "wx2077547f21716759"
  // d5d59271b38647a2177bd4c23eee7f50
}
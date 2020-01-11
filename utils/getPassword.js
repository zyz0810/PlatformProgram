let Common = require("../service/common.js"),
  RSAKey = require("./rsa.js").RSAKey,
  base64 = require("./base64.js"),
  hex2b64 = base64.hex2b64,
  b64tohex = base64.b64tohex

module.exports = function (pwd, fn) {
  new Common(res => {
    let rsaKey = new RSAKey()
    rsaKey.setPublic(b64tohex(res.data.modulus), b64tohex(res.data.exponent))
    let enPassword = hex2b64(rsaKey.encrypt(pwd))
    fn(enPassword)
  }).getPublicKey()
}

let Ajax = require("./ajax.js")

module.exports = class Commom extends Ajax {
  getPublicKey(data) {
    super.get({
      url: "applet/common/public_key.jhtml",
      data: data
    })
  }
}
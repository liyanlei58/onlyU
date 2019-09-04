const app = getApp()
var common = require('../../js/common.js');
Page({
  data: {
    skin: app.globalData.skin,
    modalName: "home",
    PageCur: ''
  },
  onLoad: function (options) {
    var that = this
    var pageCur = "home"
    if (options.pageCur != null){
      pageCur = "me"
    }
    that.setData({
      PageCur: pageCur
    })

    //背景设置
    if (app.globalData.skin == "") {
      common.setBackground(app.globalData.openid, function (globalSkin) {
        app.globalData.skin = globalSkin
        that.setData({
          skin: globalSkin
        })
      })
    }

  },

  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    //设置背景颜色
    var that = this
    that.setData({
      skin: app.globalData.skin
    })
  },

  NavChange(e) {
    console.log(e.currentTarget.dataset.cur)
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: 'OnlyU - Meet the right person',
      imageUrl: '/images/app.jpeg',
      path: '/pages/index/index'
    }
  },
})
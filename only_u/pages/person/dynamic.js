const app = getApp();
var sysUserDb = require('../../js/db/sysUser.js')
var common = require('../../js/common.js')
var Const = require('../../js/const.js')

Page({
  data: {
    skin: app.globalData.skin,
    modalName: "love",
    FEMALE: Const.Gender.Female.VALUE,
    HAS_CAR: Const.Car.Have.VALUE,
    houseArray: ['请选择', '无房', '北京有房', '北京周边有房', '天津有房', '老家有房', '其他城市有房'],
    person: {},
    // 文字是否收起，默认收起
    textHidden: true,
    score: {},
    activity: {}
  },
  onLoad: function (options) {
    var that = this;
    var p_openid = options.p_openid;

    if (p_openid == null || p_openid == "") {
      common.toastError('人员ID为空')
      return;
    }

    //获取人员信息
    that.getPersonByOpenid(p_openid);

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

  //获取人员信息
  getPersonByOpenid: function (p_openid, activityId) {
    var that = this;
    sysUserDb.getUserByOpenid(p_openid, function (data) {
      if (data.length > 0) {
        that.setData({
          person: data[0]
        })

      }
    });
  },

  /**
       * 收起/展开按钮点击事件
       */
  textShow() {
    console.log("ellipsis")
    var that = this
    let value = !that.data.textHidden;
    that.setData({
      textHidden: value
    })
  },

  ViewImage(e) {
    var cur = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [cur],
      current: cur
    });
  },

  toPersonInfo(e) {
    console.log(e)
    var ds = e.currentTarget.dataset;
    console.log(ds)
    wx.navigateTo({
      url: '../person/info?p_openid=' + ds.openid
    })
  },



})
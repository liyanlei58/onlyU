const app = getApp();
var scoreDb = require('../../js/db/score.js');
var Const = require('../../js/const.js');
var pageSize = 20;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    skin: app.globalData.skin,
    modalName: "love",
    hasMore: false,
    showLoading: true,
    start: 0,
    messageList: [],
    loveList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var messageList = [{
      id: 9000,
      type: 1,
      _openid: "1111111",
      gender: 2,
      nickName: "来自星星的你",
      photoId: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg",
      title: "对你心动了",
      createTime: "2019-08-09"
    }, {
        id: 9001,
        type: 2,
        _openid: "1111112",
        gender: 1,
        nickName: "苏秦",
        photoId: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg",
        title: "关注了你",
        createTime: "2019-08-08"
    }, {
        id: 9002,
        type: 3,
        _openid: "1111113",
        nickName: "张仪",
        photoId: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg",
        title: "赞了你的评论",
        content: "飞流直下三千尺，疑是银河落九天",
        createTime: "2019-08-07"
      }, {
        id: 9003,
        type: 4,
        _openid: "1111115",
        gender: 1,
        nickName: "孙膑",
        photoId: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg",
        title: "评论了你的动态",
        content: "曾经有一份真诚的爱情放在我面前，我没有珍惜",
        createTime: "2019-08-06"
      }, {
        id: 9009,
        type: 4,
        _openid: "1111118",
        gender: 1,
        nickName: "孙膑",
        photoId: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg",
        title: "评论了你的动态",
        content: "等我失去的时候我才后悔莫及，人世间最痛苦的事莫过于此。",
        createTime: "2019-08-06"
      },{
        id: 9004,
        type: 3,
        _openid: "1111115",
        gender: 1,
        nickName: "关羽",
        photoId: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg",
        title: "赞了你的评论",
        content: "如果上天能够给我一个再来一次的机会，我会对那个女孩子说三个字：我爱你。",
        createTime: "2019-08-05"
      }, {
        id: 9005,
        type: 3,
        _openid: "1111115",
        gender: 1,
        nickName: "刘备",
        photoId: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg",
        title: "赞了你的评论",
        content: "如果非要在这份爱上加上一个期限，我希望是……一万年！",
        createTime: "2019-08-04"
      }, {
        id: 9006,
        type: 3,
        _openid: "1111115",
        gender:1,
        nickName: "孔明",
        photoId: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg",
        title: "赞了你的评论",
        content: "如果上天给我再来一次的机会，我会对那个女孩说三个字:我爱你",
        createTime: "2019-08-03"
      }];
    //查询被打分人员
    var love = {
      activity: {
        date: "2019-06-12"
      },
      messageList: messageList
    }
    var love2 = {
      activity: {
        date: "2019-06-13"
      },
      messageList: messageList
    }
    console.log(love)
    that.setData({
      skin: app.globalData.skin,
      messageList: messageList,
      start: 0,
      showLoading: false,
    })
    // that.findNextPage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //查询下一页的数据
  findNextPage() {
    console.log("openid: ", app.globalData.openid);
    var that = this
    scoreDb.findPageScoreByOpenid(app.globalData.openid, Const.Score.Nice.VALUE, that.data.start, pageSize, function (data) {
      if (data.length == 0) {
        that.setData({
          showLoading: false,
          hasMore: false
        });
      } else {
        if (data.length < pageSize) { //最后一页
          that.setLoveList(data, function (loveList) {
            that.setData({
              showLoading: false,
              loveList: loveList,
              start: that.data.start + data.length,
              hasMore: false
            });
          })
        } else { //非最后一页
          that.setLoveList(data, function (loveList) {
            that.setData({
              showLoading: false,
              loveList: loveList,
              start: that.data.start + data.length,
              hasMore: true
            });
          })
        }
      }
    });
  },

  // ListTouch触摸开始
  setLoveList(data, callback) {
    var that = this
    var lastLoveList = that.data.loveList
    var lastLove = data[0];
    var scoreList = []
    if (lastLoveList.length > 0) { //加载非第一页的内容
      lastLove = lastLoveList.pop()
      scoreList = lastLove.scoreList
    }
    var currActivity = lastLove.activity
    // var loveListNext = []
    for (var i = 0; i < data.length; i++) {
      if (currActivity._id == data[i].activity._id) { //同一个活动
        scoreList.push(data[i])
      } else { //不同的活动
        var love = {
          activity: currActivity,
          scoreList: scoreList
        }
        that.data.loveList.push(love)

        currActivity = data[i].activity
        scoreList = [data[i]];
      }
    }

    //最后一次的组合
    var love = {
      activity: currActivity,
      scoreList: scoreList
    }
    that.data.loveList.push(love)

    callback(that.data.loveList)
  },

  toPersonInfo(e) {
    var ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../person/info?p_openid=' + ds.id
    })
  },

  toDynamicDetail(e) {
    var ds = e.currentTarget.dataset;
    var type = ds.type
    var id = ds.id
    if(type < 3){
      return
    }
    wx.navigateTo({
      url: '../dynamic/detail?id=' + ds.id
    })
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  }


})
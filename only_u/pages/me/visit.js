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
    loveList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var scoreList = [{
      user: {
        _openid: "1111111",
        nickName: "馥钰",
        photoId: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg",
        gender: "2",
        birthday: "1990-09-10",
        hometown: ['山东', '济南', '历下'],
        job: "人事",
        address: "大望路"
      }
    }, {
      user: {
        _openid: "1111211",
        nickName: "孙俪",
        photoId: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg",
        gender: "1",
        birthday: "1990-09-10",
        hometown: ['山东', '济南', '历下'],
        job: "人事",
        address: "大望路"
      }
    }, {
      user: {
        _openid: "11112119999",
        nickName: "海清",
        photoId: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg",
        gender: "2",
        birthday: "1990-09-10",
        hometown: ['山东', '济南', '历下'],
        job: "人事",
        address: "大望路"
      }
    }];
    //查询被打分人员
    var love = {
      activity: {
        date: "2019-06-12"
      },
      scoreList: scoreList
    }
    var love2 = {
      activity: {
        date: "2019-06-13"
      },
      scoreList: scoreList
    }
    console.log(love)
    that.setData({
      skin: app.globalData.skin,
      loveList: [love, love2],
      start: 0,
      showLoading: false,
    })
    // that.findNextPage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //查询下一页的数据
  findNextPage() {
    console.log("openid: ", app.globalData.openid);
    var that = this
    scoreDb.findPageScoreByOpenid(app.globalData.openid, Const.Score.Nice.VALUE, that.data.start, pageSize, function(data) {
      if (data.length == 0) {
        that.setData({
          showLoading: false,
          hasMore: false
        });
      } else {
        if (data.length < pageSize) { //最后一页
          that.setLoveList(data, function(loveList) {
            that.setData({
              showLoading: false,
              loveList: loveList,
              start: that.data.start + data.length,
              hasMore: false
            });
          })
        } else { //非最后一页
          that.setLoveList(data, function(loveList) {
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

  viewDetail(e) {
    var ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../person/info?p_openid=' + ds.id
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
      console.log(e.currentTarget.dataset.target)
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
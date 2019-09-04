const app = getApp();
var activityDb = require('../../js/db/activity.js');
var util = require('../../js/util.js');
var common = require('../../js/common.js');
var Const = require('../../js/const.js');
var pageSize = 20;
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    skin: app.globalData.skin,
    modalName: "activity",
    today: util.formatDay(new Date()),
    openid: '',
    activityList: [],
    hasMore: false,
    showLoading: true,
    start: 0,

    // 文字是否收起，默认收起
    textHidden: true,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    },
    {
      id: 7,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }
    ],

    //卡片数组
    areaList: [{
      id: '01',
      area: '高收入专区',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJltRVImIW2zlAAHXjFLKAuwAAp4IwJkrCwAAdek616.jpg'
    },
    {
      id: '02',
      area: '名校专区',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVIyIQrBRAAGd-mPfORQAAp4IwJ7S8oAAZ4S405.jpg'
    },
    {
      id: '03',
      area: '海龟专区',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVIyIFCYzAALE_K5nOeUAAp4IwJ3ieUAAsUU601.jpg'
    },
    {
      id: '04',
      area: '公务员事业编专区',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVIuIZ3lMAAF25lP1lrcAAp4IwJvtbwAAXb-774.jpg'
    },
    {
      id: '05',
      area: '高颜值专区',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVIuIIywCAAFsGkgldiMAAp4IwJqL9kAAWwy219.jpg'
    },
    {
      id: '06',
      area: '高校专区',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVImIeKV-AAHbYF_NgJQAAp4IwJi0LQAAdt4390.jpg'
    },
    {
      id: '07',
      area: '医护专区',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVIuIZ3lMAAF25lP1lrcAAp4IwJvtbwAAXb-774.jpg'
    },
    {
      id: '08',
      area: 'IT·互联网专区',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVIyIQrBRAAGd-mPfORQAAp4IwJ7S8oAAZ4S405.jpg'
    },
    ],

  },
  onLoad: function (options) {
    var areaId = options.areaId;
    var that = this;
    if (app.globalData.openid) {
      that.setData({
        skin: app.globalData.skin,
        openid: app.globalData.openid
      })
    }
    //背景设置
    if (app.globalData.skin == "") {
      common.setBackground(app.globalData.openid, function (globalSkin) {
        app.globalData.skin = globalSkin
        that.setData({
          skin: globalSkin
        })
      })
    }

    //查询活动列表
    that.setData({
      activityList: [],
      start: 0
    })
    that.findNextPage();

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

  toTop() {
    wx.navigateTo({
      url: '../area/top'
    })
  },

  toAuth() {
    //授权成功后，跳转进入小程序首页
    wx.navigateTo({
      url: '../auth/auth'
    })
  },


  toPersonInfo(e) {
    console.log(e)
    var ds = e.currentTarget.dataset;
    console.log(ds)
    wx.navigateTo({
      url: '../person/info?p_openid=' + ds.openid
    })
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

  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },


  //查询下一页的数据
  findNextPage() {
    var that = this
    activityDb.findActivity(that.data.start, pageSize, function (data) {
      if (data.length == 0) {
        that.setData({
          showLoading: false,
          hasMore: false
        });
      } else {
        if (data.length < pageSize) {
          that.setData({
            showLoading: false,
            activityList: that.data.activityList.concat(data),
            start: that.data.start + data.length,
            hasMore: false
          });
        } else {
          that.setData({
            showLoading: false,
            activityList: that.data.activityList.concat(data),
            start: that.data.start + data.length,
            hasMore: true
          });
        }
      }
    });
  },


})
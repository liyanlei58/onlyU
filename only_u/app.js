//app.js
var sysUserDb = require('./js/db/sysUser.js');
var init = require('./js/cloud/init.js');
var Const = require('./js/const.js');
var common = require('./js/common.js');
App({
  globalData: {
    openid: '13dba11c5d2d35ee086e896b56e564ab',
    niceScore: 60, //打分超过60，代表有好感
    userInfo: '',
    skin: '',
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ]
  },

  onLaunch: function() {
    var that = this
    //检查是否可以使用云能力 // pro-omk03
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      //dev-lotsi
      //pro-e1wx0
      wx.cloud.init({
        traceUser: true,
        env: 'dev-lotsi'
      })
    }

    //检查是否授权, 若未授权，则跳转到授权页面；否则获取用户信息
    common.checkAuthFromWx(function() {
      //已经授权
      that.getOpenid(function(openid) {
        //获取用户信息
        that.getUserInfo()
      })
    }, function() {
      that.globalData.skin = Const.Background.PINK
      //未授权，跳转到授权页面
      that.toAuth();
    })

    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

  },

  //获取openid
  getOpenid: function(callback) {
    var that = this
    init.getOpenid(function(openid) {
      that.globalData.openid = openid
      callback(openid)
    })
  },

  //获取userInfo, 
  getUserInfo: function() {
    var that = this
    //从数据库获取用户信息
    sysUserDb.getUserByOpenid(that.globalData.openid, function(data) {
      if (data == null || data.length == 0) {
        //数据库中不存在此用户，则从微信获取用户信息
        init.getUserInfoFromWx(function(wxUserInfo) {
          //查到用户信息
          that.globalData.userInfo = wxUserInfo;
          //添加到数据库
          sysUserDb.addUser(wxUserInfo, function(dataId) {
            if (dataId != null) { //添加成功
            } else {
              console.log("add userWxInfo fail");
            }
          });
        });
        return;
      }
      //数据库中存在用户信息
      that.globalData.userInfo = data[0]
      var glbUserInfo = data[0]
      if (glbUserInfo.nickName == null || glbUserInfo.avatarUrl) {
        init.getUserInfoFromWx(function(wxUserInfo) {
          //查到用户信息
          glbUserInfo.nickName = wxUserInfo.nickName
          glbUserInfo.avatarUrl = wxUserInfo.avatarUrl
          glbUserInfo.province = wxUserInfo.province
          glbUserInfo.city = wxUserInfo.city
          glbUserInfo.country = wxUserInfo.country
          glbUserInfo.gender = wxUserInfo.gender

          that.globalData.userInfo = glbUserInfo
        })
      }
    })
  },

  //跳转到授权页面
  toAuth: function() {
    //授权成功后，跳转进入小程序首页
    wx.redirectTo({
      url: '/pages/auth/auth'
    })
  }

})
const app = getApp();
var Const = require('../../js/const.js');

var winWidth = 314;
var winHeight = 336;

Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    skin: app.globalData.skin,
    modalName: "seek",
    
    x: winWidth,
    y: winHeight,
    distance: 0,
    animationData: {},

    curIndex: 6,

    //卡片数组
    content: [{
      id: '01',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJltRVImIW2zlAAHXjFLKAuwAAp4IwJkrCwAAdek616.jpg'
    },
    {
      id: '02',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVIyIQrBRAAGd-mPfORQAAp4IwJ7S8oAAZ4S405.jpg'
    },
    {
      id: '03',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVIyIFCYzAALE_K5nOeUAAp4IwJ3ieUAAsUU601.jpg'
    },
    {
      id: '04',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVIuIZ3lMAAF25lP1lrcAAp4IwJvtbwAAXb-774.jpg'
    },
    {
      id: '05',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVIuIIywCAAFsGkgldiMAAp4IwJqL9kAAWwy219.jpg'
    },
    {
      id: '06',
      img: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/0F/06/ChMkJ1tRVImIeKV-AAHbYF_NgJQAAp4IwJi0LQAAdt4390.jpg'
    },
    ],

  },

  lifetimes: {
    //在组件实例进入页面节点树时执行
    attached() {
      var that = this;
      console.log(that.data.skin);

      var res = wx.getSystemInfoSync();
      winWidth = res.windowWidth;
      winHeight = res.windowHeight;
      that.setData({
        skin: app.globalData.skin,
        x: winWidth,
        y: winHeight
      })

    },
    moved: function () { },
    detached: function () { },
  },

  methods: {
    

    tap: function (e) {
      var that = this;
      var distance = that.data.distance;
      if (distance <= 0) {
        that.setData({
          x: winWidth,
          y: winHeight,
        });
      } else if ((distance > (winWidth + winWidth / 2)) || (distance < (winWidth - winWidth / 2))) {
        that.next()
        that.setData({
          x: winWidth,
          y: winHeight,
        });
        
      } else {
        that.setData({
          x: winWidth,
          y: winHeight
        })
      }
    },

    next: function () {
      var that = this
      var content = that.data.content;
      var index = that.data.curIndex

      var imgObj = content[index];
      content.splice(index, 1);
      if (index == 0) {
        index = 6
      }
      content.push(imgObj)
      that.setData({
        curIndex: index - 1,
        content: content
      });
    },
    
    onChange: function (e) {
      console.log("======onChange======")
      var that = this;
      that.setData({
        distance: e.detail.x
      })
    },
    onScale: function (e) {
    }



  },
})
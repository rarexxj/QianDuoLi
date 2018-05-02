// pages/serviceTime/serviceTime.js
let app = getApp();
Page({
  data: {
    config: app.config,
    id: '',
    info: {},
    viewst: [
      {
        time: '7:00~8:00',
        minTime: '',
        maxTime: '',
        index: 1
      },
      {
        time: '8:00~9:00',
        minTime: '',
        maxTime: '',
        index: 2
      },
      {
        time: '9:00~10:00',
        minTime: '',
        maxTime: '',
        index: 3
      },
      {
        time: '10:00~11:00',
        minTime: '',
        maxTime: '',
        index: 4
      },
      {
        time: '11:00~12:00',
        minTime: '',
        maxTime: '',
        index: 5
      },
      {
        time: '12:00~13:00',
        minTime: '',
        maxTime: '',
        index: 6
      },
      {
        time: '13:00~14:00',
        minTime: '',
        maxTime: '',
        index: 7
      },
      {
        time: '14:00~15:00',
        minTime: '',
        maxTime: '',
        index: 8
      },
      {
        time: '15:00~16:00',
        minTime: '',
        maxTime: '',
        index: 9
      }
      ,
      {
        time: '16:00~17:00',
        minTime: '',
        maxTime: '',
        index: 10
      },
      {
        time: '17:00~18:00',
        minTime: '',
        maxTime: '',
        index: 11
      },
      {
        time: '18:00~19:00',
        minTime: '',
        maxTime: '',
        index: 12
      },
      {
        time: '19:00~20:00',
        minTime: '',
        maxTime: '',
        index: 13
      },
      {
        time: '20:00~21:00',
        minTime: '',
        maxTime: '',
        index: 14
      },
      {
        time: '21:00~22:00',
        minTime: '',
        maxTime: '',
        index: 15
      },
      {
        time: '22:00~23:00',
        minTime: '',
        maxTime: '',
        index: 16
      },
      {
        time: '23:00~24:00',
        minTime: '',
        maxTime: '',
        index: 17,
        canClick: ''
      }
    ],
    weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    nowDate: {
      dateTime: '',
      year: '',
      month: '',
      date: '',
      day: ''
    },  //今天日期
    othersDate: {
      twoDay: {},
      threeDay: {},
      fourDay: {},
      fiveDay: {},
      sixDay: {},
      sevenDay: {}
    },   //后面6天日期
    navIndex: '1',  //第几天
    lastTimeIndex: '',  //第几个时间
    nowTime: new Date().getTime(),
    msgShow: false,
    msgTitle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    t.setData({
      id: options.id
    })
    t.getNowTime();
    t.getOthersTime();
    t.infoAjax();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let t = this;

  },
  chioce: function () {

  },
  infoAjax: function () {
    let t = this;
    wx.request({
      method: 'GET',
      url: t.data.config.api_url + 'api/v1/mall/servicegoods/' + t.data.id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res = res.data;
        if (res.ReturnCode == '200') {
          t.setData({
            info: res.Data
          })

        } else {
          t.msgShow(res.Msg)
        }

      }
    })
  },
  getNowTime: function () {
    //得到今天的日期
    let t = this;
    let date = new Date();
    let day = date.getDate()
    let nowDate = {
      dateTime: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate(),
      day: t.data.weeks[date.getDay()]
    }
    t.setData({
      nowDate: nowDate
    })
    t.toNowTime(t.data.nowDate.dateTime);
  },
  getOthersTime: function () {    //得到剩余的日期
    let t = this;
    let date = new Date();
    let dateTwo = new Date((date.getTime() + 60 * 60 * 24 * 1000));  //明天
    let dateThree = new Date((date.getTime() + 60 * 60 * 24 * 1000 * 2)); //第三天
    let dateFour = new Date((date.getTime() + 60 * 60 * 24 * 1000 * 3));//第四天
    let dateFive = new Date((date.getTime() + 60 * 60 * 24 * 1000 * 4));  //第五天
    let dateSix = new Date((date.getTime() + 60 * 60 * 24 * 1000 * 5));  //第六天
    let dateSeven = new Date((date.getTime() + 60 * 60 * 24 * 1000 * 6));  //第七天

    console.log(dateTwo)
    let othersDate = {
      twoDay: {
        dateTime: dateTwo.getFullYear() + '/' + (dateTwo.getMonth() + 1) + '/' + dateTwo.getDate(),
        year: dateTwo.getFullYear(),
        month: dateTwo.getMonth() + 1,
        date: dateTwo.getDate(),
        day: t.data.weeks[dateTwo.getDay()]
      },
      threeDay: {
        dateTime: dateThree.getFullYear() + '/' + (dateThree.getMonth() + 1) + '/' + dateThree.getDate(),
        year: dateThree.getFullYear(),
        month: dateThree.getMonth() + 1,
        date: dateThree.getDate(),
        day: t.data.weeks[dateThree.getDay()]
      },
      fourDay: {
        dateTime: dateFour.getFullYear() + '/' + (dateFour.getMonth() + 1) + '/' + dateFour.getDate(),
        year: dateFour.getFullYear(),
        month: dateFour.getMonth() + 1,
        date: dateFour.getDate(),
        day: t.data.weeks[dateFour.getDay()]
      },
      fiveDay: {
        dateTime: dateFive.getFullYear() + '/' + (dateFive.getMonth() + 1) + '/' + dateFive.getDate(),
        year: dateFive.getFullYear(),
        month: dateFive.getMonth() + 1,
        date: dateFive.getDate(),
        day: t.data.weeks[dateFive.getDay()]
      },
      sixDay: {
        dateTime: dateSix.getFullYear() + '/' + (dateSix.getMonth() + 1) + '/' + dateSix.getDate(),
        year: dateSix.getFullYear(),
        month: dateSix.getMonth() + 1,
        date: dateSix.getDate(),
        day: t.data.weeks[dateSix.getDay()]
      },
      sevenDay: {
        dateTime: dateSeven.getFullYear() + '/' + (dateSeven.getMonth() + 1) + '/' + dateSeven.getDate(),
        year: dateSeven.getFullYear(),
        month: dateSeven.getMonth() + 1,
        date: dateSeven.getDate(),
        day: t.data.weeks[dateSeven.getDay()]
      }
    }

    t.setData({
      othersDate: othersDate
    })

    console.log(t.data.othersDate)
  },
  toNowTime: function (date) {  //得到现在最后的时间 格子黑掉
    let t = this;
    let viewst = [];
    for (var i of t.data.viewst) {
      i.minTime = new Date(date + ' ' + i.time.split('~')[0]).getTime();
      i.maxTime = new Date(date + ' ' + i.time.split('~')[1]).getTime();

      //添加过去的时间无法点击
      if (i.minTime < t.data.nowTime) {
        // console.log(nowTime)
        i.canClick = false
      } else {
        i.canClick = true;
      };
      viewst.push(i);
    }
    t.setData({
      viewst: viewst
    })
    console.log(t.data.viewst)

  },
  chioceDate: function (e) {  //日期切换
    let t = this;
    t.setData({
      navIndex: e.currentTarget.dataset.index,
      lastTimeIndex: ''
    })
    console.log(e)
    t.toNowTime(e.currentTarget.dataset.date);
  },
  chioceLastTime: function (e) { //选择最后时间
    let t = this;
    console.log(e)
    if (e.currentTarget.dataset.canclick) {
      t.setData({
        lastTimeIndex: e.currentTarget.dataset.index
      })
    } else {
      app.oppo('时间不可预约')
    }
  },
  //msg
  msgShow(msgTitle = '请填写提示文字', time, callback) {
    let _this = this;

    _this.setData({
      msgShow: true,
      msgTitle: msgTitle
    });

    clearTimeout(_this.timeBox);
    _this.timeBox = setTimeout(() => {
      _this.setData({
        msgShow: false
      });

      if (typeof (callback) == 'function') {
        callback()
      } else {

      }
    }, (time ? time : 1) * 2000);
  }
})
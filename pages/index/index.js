// pages/regard/regard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AK: 'EWU8Qjmbdy5INdYpmMkqdhqAq0roRdd9',
    city: '',
    nowTemp:'',
    temp: '',
    todayDayImg: '',
    todayNightImg: '',
    weather: '',
    todayDate: '',
    todayTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadInfo();
  },
  loadInfo: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var AK = that.data.AK;
        that.loadCity(latitude, longitude, AK, that.loadWeather);
        //    that.loadWeather(that.data.city, AK);
        wx.showLoading({
          title: '数据加载中...',
        })
      }
    })
  },
  loadCity: function (latitude, longitude, AK, callback) {
    var that = this;
    var url = 'https://api.map.baidu.com/geocoder/v2/?location=' + latitude + ',' + longitude + '&output=json&ak=' + AK;
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var city = res.data.result.addressComponent.city;
        that.setData({ city: city });
        callback && callback(city, AK);
        wx.setStorage({
          key: 'city',
          data: city
        })
      }
    })
  },
  loadWeather: function (city, AK) {
    var that = this;
    var url = 'https://api.map.baidu.com/telematics/v3/weather?location=' + city + '&output=json&ak=' + AK;
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var future = res.data.results[0].weather_data.filter(function (ele, index) {
          var futureTypeIcon = '../../assets/img/refesh.png';         
          ele['futureTypeIcon'] = that.chooseIcon(ele.dayPictureUrl);
          return index > 0;
        });
        var temReg = /\d+℃/;
        that.setData({
          temp: res.data.results[0].weather_data[0].temperature,
          nowTemp: res.data.results[0].weather_data[0].date.match(temReg)[0],
          todayDayImg: that.chooseIcon(res.data.results[0].weather_data[0].dayPictureUrl),
          todayNightImg: res.data.results[0].weather_data[0].nightPictureUrl,
          weather: res.data.results[0].weather_data[0].weather + ' | ' + res.data.results[0].weather_data[0].wind,
          des: res.data.results[0].index[0].des,
          future: future
        });
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 改变地理位置
   */
  changeMap: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var AK = that.data.AK;
        wx.showLoading({
          title: '数据加载中...',
        })
        that.loadCity(res.latitude, res.longitude, AK, that.loadWeather);
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  chooseIcon(icon){
    var typeIcon = '../../assets/img/refesh.png'
    switch (icon) {
      case 'http://api.map.baidu.com/images/weather/day/duoyun.png': typeIcon = '../../assets/img/duoyun.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/mai.png': typeIcon = '../../assets/img/mai.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/qing.png': typeIcon = '../../assets/img/qing.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/wu.png': typeIcon = '../../assets/img/wu.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/leizhenyu.png': typeIcon = '../../assets/img/leizhenyu.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/daxue.png': typeIcon = '../../assets/img/daxue.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/dayu.png': typeIcon = '../../assets/img/dayu.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/baoxue.png': typeIcon = '../../assets/img/baoxue.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/baoyu.png': typeIcon = '../../assets/img/baoyu.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/bingbao.png': typeIcon = '../../assets/img/bingbao.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/xiaoxue.png': typeIcon = '../../assets/img/xiaoxue.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/xiaoyu.png': typeIcon = '../../assets/img/xiaoyu.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/yin.png': typeIcon = '../../assets/img/yin.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/yujiaxue.png': typeIcon = '../../assets/img/yujiaxue.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/zhenyu.png': typeIcon = '../../assets/img/zhenyu.png'; break;
      case 'http://api.map.baidu.com/images/weather/day/zhongyu.png': typeIcon = '../../assets/img/zhongyu.png'; break;
    }
    return typeIcon;
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
    var that = this;
    var AK = that.data.AK;
    wx.showLoading({
      title: '数据加载中...',
    })
    wx.getStorage({
      key: 'city',
      success(res) {
        var city = res.data;
        that.setData({ city: city });
        that.loadWeather(city, AK);
      }
    })
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

  }
})
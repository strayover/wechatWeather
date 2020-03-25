// pages/regard/regard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    life: [],
    AK: 'EWU8Qjmbdy5INdYpmMkqdhqAq0roRdd9',
    city: '',
    nowTemp: '',
    lifeImgBaseUrl: '../../assets/img/',
    lifeImg: ['cloth.png', 'car.png', 'medicine.png', 'sport.png', 'uv.png']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  lookCity(){
    var that = this;
    var AK = that.data.AK;
    wx.getStorage({
      key: 'city',
      success(res) {
        var city = res.data;
        if (city != that.data.city){
          wx.showLoading({
            title: '数据加载中...',
          })
          that.setData({ city: city });
          that.loadWeather(city, AK);
        }
      }
    })
  },
  loadWeather: function (city, AK) {
    var that = this;
    var url = 'https://api.map.baidu.com/telematics/v3/weather?location=' + city + '&output=json&ak=' + AK;
    console.log(url);
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        for (var i = 0, max = res.data.results[0].index.length; i < max; i++) {
          res.data.results[0].index[i].img = that.data.lifeImgBaseUrl + that.data.lifeImg[i];
        }
        var temReg = /\d+℃/;
        that.setData({
          life: res.data.results[0].index,
          nowTemp: res.data.results[0].weather_data[0].date.match(temReg)[0]
        });
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
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
    this.lookCity();
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
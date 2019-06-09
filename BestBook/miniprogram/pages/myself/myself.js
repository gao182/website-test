// miniprogram/pages/myself/myself.js
import { showsucc, showerr, adduser, getuser } from "../../src/database"
const app = getApp()
Page({
  data: {
    logged: false,
    userInfo: {
      avatarUrl: './user-unlogin.png',
      nickName: '点击头像'
    },
    sociality: {
      popularity: 0,
      attention: 0,
      fan: 0
    }
  },
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //设置用户头像
              this.setData({
                userInfo: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName
                }
              })
              app.globalData.userInfo = this.data.userInfo

              //得到openid
              wx.cloud.callFunction({
                name: 'login',
                data: {}
              }).then(res => {
                app.globalData.openid = res.result.openid
                this.getAllQuery()
              }).catch(err => {
                console.error(err.Error)
              })
            }
          })
        }
      }
    })
  },
  getAllQuery() {
    getuser(app.globalData.openid).then(res => {
      if (res.data.length <= 0) {
        adduser(this.data.userInfo)
      } else {
        this.setData({
          sociality: {
            popularity: res.data[0].popularity,
            attention: res.data[0].attention,
            fan: res.data[0].fan
          }
        })

      }
    }).catch(()=>showerr('查询用户失败'))
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

  /*点击获取用户信息*/
  onGetUserInfo(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        userInfo: {
          avatarUrl: e.detail.userInfo.avatarUrl,
          nickName: e.detail.userInfo.nickName
        }
      })
    }
    this.onLoad()
  }
})
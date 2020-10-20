<template>
  <div class="login">
    <div class="left"></div>
    <div class="loginContainer">
      <h1 class="title">千锋管理系统</h1>
      <i :class="['jiaobiao', 'iconfont',isWechat?'icon-diannaojiaobiao':'icon-erweimajiaobiao']"
         @click="checkoutLoginType"></i>
      <transition>
        <!-- 二维码 -->
        <div class="wechatLogin"
             v-if="isWechat">
          <div class="scancode">
            <div class="marsk"
                 v-if="isScan">
              <i class="iconfont icon-saomachenggong"></i>
            </div>
            <img src="../../assets/imgs/erwei.png"
                 width="200"
                 alt="">
          </div>
          <p>请使用微信扫码登入</p>
        </div>
        <el-form v-else
                 :model="loginForm"
                 status-icon
                 :rules="rules"
                 ref="loginForm"
                 label-width="100px"
                 class="demo-loginForm">
          <el-form-item label="用户名"
                        prop="username">
            <el-input type="text"
                      v-model="loginForm.username"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password">
            <el-input type="password"
                      @keydown.native.enter="submitForm('loginForm')"
                      v-model="loginForm.password"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('loginForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </transition>
    </div>
    <video class="bg_video"
           muted
           src="../../assets/video/bg_video.mp4"
           autoplay
           loop
           preload="auto"></video>
  </div>
</template>
<script>
import { login, wechatLogin } from '@/api'
import io from 'socket.io-client'
export default {
  data () {
    // 校验用户名
    var validateUsername = (rule, value, callback) => {
      // 用户名正则，4到16位（字母，数字，下划线，减号）
      // var uPattern = /^[a-zA-Z0-9_-]{4,16}$/
      if (value === '') {
        console.log(123)
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    // 校验用户密码
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      isScan: false, // 是否扫码
      isWechat: false,
      jiaobiao: 'icon-diannaojiaobiao',
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 微信登入
    // 点击切换登入方式
    checkoutLoginType () {
      this.isWechat = !this.isWechat
      if (this.isWechat) {
        // 说明是微信登入
        // 通过socket.io和服务器建立socket连接
        const socket = io('ws://chst.vip')
        const _this = this
        const r = fetch('/api/users/getScancode')
          .then(body => body.json())
          .then(res => {

          })// 展示二维码
        socket.on('connect', function () {
          console.log('连接成功')
          socket.on('scancodeSuccess', data => { // 扫码成功事件
            console.log(data)
            console.log(this.isScan)
            if (data.state) {
              _this.isScan = true
              const wechatCode = data.wechatCode
              wechatLogin(wechatCode)
                .then(res => {
                  if (res.data && res.data.state) {
                    console.log(res)
                    if (data.state) {
                      // 登入成功
                      // 将token保存到loalstorage
                      localStorage.setItem('wf-token', res.data.token)
                      // 将userInfo存到localstorage
                      localStorage.setItem('wf-userInfo', JSON.stringify(res.data.userInfo))
                      // 用户按钮
                      localStorage.setItem('wf-permission-buttons', JSON.stringify(res.data.permission.buttons))
                      // 将用户信息储存到vuex中
                      _this.$store.commit('SET_USERINFO', res.data.userInfo)
                      // 将用户权限按钮保存在vuex中
                      _this.$store.commit('SET_PERMISSION_BUTTONS', res.data.permission.buttons)
                      // 页面跳转到欢迎页
                      _this.$router.push('/Welcome')
                    }
                  }
                })
            }
          })
        })
        socket.on('getScancode', data => { // 切换成功微信登入事件 可以获得二维码
          console.log(data)
        })

        // socket.on('wechatLoginSuccess', data => {//扫码登入成功
        //   console.log(data)
        //   if (data.state) {
        //     //登入成功
        //     //将token保存到loalstorage
        //     localStorage.setItem('wf-token', data.token)
        //     //将userInfo存到localstorage
        //     localStorage.setItem("wf-userInfo", JSON.stringify(data.userInfo))
        //     //页面跳转到欢迎页
        //     this.$router.push("/Welcome")
        //   }
        // })

        // 调用微信登入接口
        // wechatLogin()
        //   .then(res => {
        //     if (res.data && res.data.state) { }
        //     // console.log(res)
        //     //可以得到后端返回的二维码
        //   })
      }
    },
    // 点击提交按钮触发的方法
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) { // 本地校验通过
          // 打开加载框
          const loginLoading = this.$loading({
            lock: true,
            text: '拼命加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          // 发送登入请求
          login(this.loginForm.username, this.loginForm.password)
            .then(res => {
              // 关闭加载框
              loginLoading.close()
              if (res.data && res.data.state) {
                // 表示用户名密码正确
                // 将用户信息储存到vuex中
                this.$store.commit('SET_USERINFO', res.data.userInfo)
                // 将用户权限按钮保存在vuex中
                this.$store.commit('SET_PERMISSION_BUTTONS', res.data.permission.buttons)
                // 将token存入本地
                localStorage.setItem('wf-token', res.data.token)
                localStorage.setItem('wf-userInfo', JSON.stringify(res.data.userInfo))
                localStorage.setItem('wf-permission-buttons', JSON.stringify(res.data.permission.buttons))
                // 页面跳转到主页
                this.$router.push('/Welcome')
                this.$message.success('登入成功,正则跳转...')
              } else {
                // 提示用户 账户密码错误
                this.$message.error('账户密码错误')
              }
            })
            .catch(err => {
              // 关闭加载框
              loginLoading.close()
              this.$message.error('登入出错')
              console.log(err)
            })
        } else { // 本地校验不通过
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped lang="less">
  i.icon-saomachenggong {
    font-size: 50px;
    color: #26c28f;
    line-height: 200px;
  }
  .scancode {
    position: relative;
    height: 220px;
  }
  .v-enter,
  .v-leave-to {
    opacity: 0;
  }
  .v-enter-to,
  .v-leave {
    opacity: 1;
  }
  .v-enter-active,
  .v-leave-active {
    transition: all 2s;
  }
  .login {
    height: 100%;
    width: 100%;
    background: url("../../assets/imgs/bg.jpg");
    overflow: hidden;
  }

  .loginContainer {
    position: relative;
    z-index: 9;
    width: 25rem;
    height: 30.47619048rem;
    position: absolute;
    top: 50%;
    left: 75%;
    /* -webkit-transform: translate(-50%, -50%); */
    transform: translate(-50%, -50%);
    border-radius: 11px;
    background: rgba(83, 107, 182, 0.46);
    background: rgba(0, 0, 0, 0.2);
    text-align: center;
    .jiaobiao {
      width: 80px;
      height: 80px;
      overflow: hidden;
      position: absolute;
      right: -1px;
      top: -2px;
      font-size: 50px;
      text-align: right;
      color: #e2e2e2;
      cursor: pointer;
    }
    .wechatLogin {
      width: 100%;
      text-align: center;
      position: absolute;
      color: #fff;
      .marsk {
        position: absolute;
        width: 200px;
        height: 200px;
        left: 25%;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0.9);
      }
      img {
        position: absolute;
        left: 25%;
      }
      p {
        text-align: center;
      }
    }
    .title {
      color: #fff;
      margin-top: 100px;
      margin-bottom: 50px;
    }
    .el-button.el-button--primary {
      width: 100%;
      background: linear-gradient(90deg, #1596fb, #002dff);
    }
    .bg_video {
      display: block;
      margin: auto;
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.5;
    }
  }
  .left {
    width: 50%;
    height: 100%;
    background-image: url("../../assets/imgs/bg2.png");
    background-repeat: no-repeat;
    background-size: 50%;
    // float: left;
    position: absolute;
    opacity: 0.7;
    background-position: 60% 65%;
  }
  .el-form.demo-loginForm {
    position: absolute;
  }
</style>

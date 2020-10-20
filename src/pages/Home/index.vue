<template>
  <div class="home">
    <el-container>
      <!-- 侧边菜单栏 -->
      <el-aside width="200">
        <h1 class="logo"></h1>
        <el-menu :default-active="$route.path"
                 class="el-menu-vertical-demo"
                 text-color="#4e5bf8"
                 ref="sideMenu"
                 active-text-color="#E47833"
                 :collapse="isCollapse">
          <subMenu :sideMenu='sideMenu'></subMenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 顶栏布局 -->
        <el-header>
          <el-row type="flex"
                  class="row-bg"
                  justify="space-between">
            <el-col :span="6">
              <div class="shouqi grid-content">
                <i :class="['iconfont',isCollapse?'icon-zhankai':'icon-shouqi']"
                   @click="isCollapse=!isCollapse"></i>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                千锋管理系统
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-avatar shape="circle"
                           :size="35"
                           fit="fill"
                           :src="userInfo.headimgurl"></el-avatar>
                <span>欢迎您:</span>
                <span class="nickname"
                      @click="$router.push('/Mine')">{{$store.state.userInfo.nickname}}</span>
                <span class="quit"
                      @click="quit">退出</span>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <!-- main内容布局 -->
        <el-main>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="item in crumb"
                                :to="{ path: item.path || '/Welcome'
                                }">
              {{item.meta.name || "首页"}}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import subMenu from '../../components/subMenu'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      // 控制menu是否收起
      isCollapse: false
    }
  },
  computed: {
    ...mapState(['sideMenu', 'crumb', 'userInfo'])
  },
  methods: {
    quit () {
      // 情况localstorage中的token
      localStorage.removeItem('wf-token')
      // 清空vuex中 sideMenu的数据
      this.$store.commit('CLEAR_SIDEMENU')
      // 跳转到登入页
      this.$router.push('/login')
      // 刷新页面
      window.location.reload()
    }
  },
  mounted () {
    // this.$refs['sideMenu'].open({ index: "/welcome" })
  },
  components: {
    subMenu
  }
}
</script>
<style scoped>
  .nickname {
    margin-left: 10px;
    color: #fff;
    font-weight: 700;
    font-size: 15px;
    text-decoration: underline;
    cursor: pointer;
  }
  /* 退出按钮 */
  .quit {
    color: hotpink;
    cursor: pointer;
    margin-left: 10px;
  }
  /* asside样式 */
  .logo {
    height: 60px;
    background: linear-gradient(135deg, #4c67ff, #5635df);
    background-image: url("../../assets/imgs/logo.png");
    background-size: 80%;
    background-repeat: no-repeat;
    background-position: center;
  }
  /* header模块样式 */
  .shouqi {
    padding-left: 10px;
    text-align: left;
  }
  .icon-shouqi,
  .icon-zhankai {
    font-size: 30px;
    cursor: pointer;
    color: #fff;
  }
  /* 修改avatar的样式 */
  .el-avatar.el-avatar--shouqiuare,
  .el-avatar.el-avatar--circle {
    vertical-align: middle;
    margin-right: 10px;
  }
  /* layout顶栏样式 */
  .grid-content {
    border-radius: 4px;
    min-height: 60px;
  }
  .row-bg {
    /* background-color: #41b883; */
  }

  /* container样式 */
  .el-header {
    background: linear-gradient(135deg, #4c67ff, #5635df);
    -webkit-box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.29);
    box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.29);
    padding-left: 0;
    background-color: #41b883;
    color: #fff;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background: linear-gradient(135deg, #5635df, #4c67ff);
  }
  .el-menu {
    border-right: solid 1px #48a916 !important;
  }
  .el-main {
    background-color: #fff;
    color: #333;
    -webkit-box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.29);
    box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.29);
    text-align: center;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 500px;
  }
</style>

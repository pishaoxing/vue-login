<template>
  <div class="welcome">
    <template>
      <el-table :data="welcomeData"
                border
                v-loading="loading"
                style="width: 100%">
        <el-table-column prop="username"
                         label="登入账户"
                         align="center"
                         width="180">
        </el-table-column>
        <el-table-column prop="lastLogin.ip"
                         label="上次登入ip"
                         align="center"
                         width="180">
        </el-table-column>
        <el-table-column prop="lastLogin.loginTime"
                         align="center"
                         label="上次登入时间">
        </el-table-column>
        <el-table-column prop="nowLogin.ip"
                         align="center"
                         label="本次登入ip">
        </el-table-column>
        <el-table-column prop="nowLogin.loginTime"
                         align="center"
                         label="本次登入时间">
        </el-table-column>
      </el-table>
    </template>

  </div>
</template>
<script>
  import { getLoginLog } from "@/api"
  export default {
    data() {
      return {
        loading:true,
        welcomeData: []
      }
    },
    created() {
      getLoginLog()
        .then(res => {
          if (res.data && res.data.state) {
            // console.log(res)
            this.welcomeData = res.data.data
            this.loading = false
          }
        })
    }
  }
</script>
<style>
  .welcome {
    margin-top: 20px;
    width: 100%;
    height: 100%;
    background-size: 100%;
    background-repeat: no-repeat;
  }
</style>
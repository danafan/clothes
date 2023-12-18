<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  import resource from '@/api/resource.js'
  export default {
    created(){
      //获取用户信息
      resource.getUserInfo().then(res => {
        if (res.data.code == 1) {
          this.$store.commit('setUserInfo',res.data.data);
          this.$router.replace('/nav_menu');
        }else{
          this.$message.warning(res.data.msg)
        }
      })
      
    }

  }
</script>
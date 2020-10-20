<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data () {
    return {
      input: ''
    }
  },
  methods: {
    getD () {
      this.$store.dispatch('FETCH_MENULIST')
    }
  },
  mounted () {

  }
}
</script>

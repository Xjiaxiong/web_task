<script setup lang="ts">
import Swiper from './components/Swiper.vue'
import { ref } from 'vue'
const autoPlay = ref(false)
</script>

<template>
  <Swiper :autoPlay="autoPlay" :duration="1500" />
  <div class="footer">
    <p>手写轮播图示例</p>
    <div class="btn" @click="autoPlay = !autoPlay">{{ autoPlay ? `停止自动轮播` : `自动轮播` }}</div>
  </div>
</template>

<style scoped>

.btn {
  color: #fff;
  padding: 5px 12px;
  background-color: #cb4444;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 6px;
}
.btn:hover {
  color: #fff;
  background-color: #d11515;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer p {
  font-size: 16px;
}
</style>

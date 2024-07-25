<script setup lang="ts">
import { ref, shallowReactive, onMounted, onUnmounted, watch } from "vue";
import { getData } from "../services";

interface Props {
  autoPlay?: boolean;
  duration?: number;
}
const props = withDefaults(defineProps<Props>(), { 
  autoPlay: false,
  duration: 3000
})

watch(() => props.autoPlay, (newValue) =>{ 
  if (newValue) {
    startSlide();
  } else {
    clearInterval(interval.value);
  }
})

interface Slide {
  imageUrl: string;
  title: string;
}

const slides = ref<Slide[]>([]);
const currentSlide = ref<number>(1);
const slideWidth = ref<number>(0);
const interval = ref<number>(0);
const container = ref<HTMLInputElement | null>(null)
const slidesStyle = shallowReactive({
    transform: `translate3d(-${currentSlide.value * slideWidth.value}px, 0px, 0px)`,
    transition: `none`
})

// 更新位置
const updateSlide = () => {
  slidesStyle.transition = `transform 0.5s ease`
  slidesStyle.transform = `translate3d(-${currentSlide.value * slideWidth.value}px, 0px, 0px)`;
};

// 下一页
const nextSlide = () => {
  currentSlide.value++;
  if (currentSlide.value === slides.value.length - 1) {
    // 无限轮播处理
    currentSlide.value = 0;
    slidesStyle.transition = `none`
    slidesStyle.transform = `translate3d(0px, 0px, 0px)`;
    // 强制浏览器重新计算宽度
    // container.value?.offsetWidth
    setTimeout(() => { 
      slidesStyle.transition = `transform 0.5s ease`
      slidesStyle.transform = `translate3d(-${++currentSlide.value * slideWidth.value}px, 0px, 0px)`;
    },30)
  } else { 
    updateSlide();
  }
};
// 上一页
const prevSlide = () => {
  currentSlide.value--;
  if (currentSlide.value === 0) {
    // 无限轮播处理
    currentSlide.value = slides.value.length - 1;
    slidesStyle.transition = `none`
    slidesStyle.transform = `translate3d(-${(slides.value.length - 1) * slideWidth.value}px, 0px, 0px)`;
    // 强制浏览器重新计算宽度
    container.value?.offsetWidth
    setTimeout(() => { 
      slidesStyle.transition = `transform 0.5s ease`
      slidesStyle.transform = `translate3d(-${--currentSlide.value * slideWidth.value}px, 0px, 0px)`;
    },30)
  } else { 
    updateSlide();
  }

};
// 轮播
const startSlide = () => {
  clearInterval(interval.value);
  interval.value = setInterval(nextSlide, props.duration);
};
// 组件渲染后
onMounted( async () => {
  // 轮播获取数据
  const data = await getData();
  data.map(item => { 
    slides.value.push({
      imageUrl: ``,
      title: item.content
    })
  })

  // 获取容器宽度
  slideWidth.value = container.value?.offsetWidth || 0;
  // 初始化轮播图数据
  const firstItem = slides.value[0];
  const lastItem = slides.value[slides.value.length - 1];
  slides.value = [lastItem, ...slides.value, firstItem];
  setTimeout(() => {
    slidesStyle.transform = `translate3d(-${slideWidth.value}px, 0px, 0px)`;
  }, 0);
});
// 组件卸载后
onUnmounted(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div class="swiper-wrapper" ref="container">
    <div class="swiper-btn prev" @click="prevSlide"><</div>
    <div class="swiper-btn next" @click="nextSlide">></div>
    <div class="swiper-slides" :style="slidesStyle">
      <div
        class="swiper-slide"
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ 'slide-active': index === currentSlide }">
        <img :src="slide.imageUrl" alt="" />
        <div class="swiper-slide-title">{{ slide.title }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.swiper-wrapper {
  position: relative;
  border: 1px solid #f5f5f5;
  width: 50vw;
  height: 50vh;
  margin: 5vh auto;
  overflow: hidden;
}
.swiper-slides {
  width: 100%;
  display: flex;
}
.swiper-slide {
  position: relative;
  flex: 0 0 100%;
  min-width: 100%;
  height: 50vh;
}
.swiper-slide-title {
  font-size: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9;
}
.swiper-btn {
  color: #333;
  font-size: 30px;
  font-weight: 700;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 10;
}
.prev {
  left: 10px;
}
.next {
  right: 10px;
}
</style>

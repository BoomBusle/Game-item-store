<template>
  <div class="main-wrapper">
    <div class="slider">
      <div
        class="slides"
        :style="{ transform: 'translateX(' + -currentIndex * 100 + '%)' }"
      >
        <div class="slide" v-for="(image, index) in images" :key="index">
          <div class="image-container">
            <img
              :src="require('@/assets/slides/' + image.src)"
              :alt="image.alt"
              class="slide-image"
            />
            <div class="overlay"></div>
          </div>
        </div>
      </div>
      <div class="controls">
        <button class="prev" @click="prevSlide">&#10094;</button>
        <div class="dots">
          <span
            v-for="(image, index) in images"
            :key="index"
            class="dot"
            :class="{ active: currentIndex === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
        <button class="next" @click="nextSlide">&#10095;</button>
      </div>
    </div>
    <div class="info-slide">
      <p :key="currentIndex" class="slide-text">{{ slideTexts[currentIndex] }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { src: "slide1.jpg", alt: "Slide 1" },
        { src: "slide2.jpg", alt: "Slide 2" },
        { src: "slide3.jpg", alt: "Slide 3" },
        { src: "slide4.jpg", alt: "Slide 4" },
        { src: "slide5.jpg", alt: "Slide 5" }
      ],
      currentIndex: 0,
      slideTexts: [
        "Сюжетні ігри",
        "Файтинги",
        "Soulslike ігри",
        "Екшени",
        "Перегони"
      ]
    };
  },
  methods: {
    prevSlide() {
      this.currentIndex =
        this.currentIndex === 0
          ? this.images.length - 1
          : this.currentIndex - 1;
    },
    nextSlide() {
      this.currentIndex =
        this.currentIndex === this.images.length - 1
          ? 0
          : this.currentIndex + 1;
    },
    goToSlide(index) {
      this.currentIndex = index;
    }
  }
};
</script>

<style scoped>
.slider {
  position: relative;
  max-width: 50%;
  height: 75vh;
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
@media (max-width: 1300px) {
    height: 60vh;
}
@media (max-width: 900px) {
    height: 50vh;
}
@media (max-width: 768px) {
    height: 30vh;
}
@media (max-width: 500px) {
    height: 20vh;
}
}
.main-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}
.info-slide {
  filter: invert(1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40vw;
  height: 20vh;
  background: url("@/assets/image/divbg.png") center center / cover no-repeat;
  transition: opacity 0.5s ease; 
  opacity: 1;
}

.slides {
  display: flex;
  transition: transform 0.5s ease;
}

.slide {
  flex: 0 0 100%;
  height: auto;
  position: relative;
}

.image-container {
  position: relative;
  overflow: hidden;
}

.slide-image {
  filter: none;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition-duration: 1s;
}

.controls {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.prev,
.next {
  background-color: transparent;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.dots {
  display: flex;
  margin: 0 10px;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
}

.dot.active {
  background-color: white;
}

.slide-text {
  animation: slideText 0.5s ease forwards;
  font-size: 36px;
  font-family: "Marck Script", cursive;
  font-weight: 400;
  font-style: normal;
  width: 40vw;
  @media (max-width: 1000px){
    font-size: 32px;
  }
  @media (max-width: 730px){
    font-size: 25px;
  }
  @media (max-width: 550px){
    font-size: 22px;
  }
  @media (max-width: 430px){
    font-size: 20px;
  }
}

@keyframes slideText {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
}
</style>

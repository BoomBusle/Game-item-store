<template>
  <div class="v-main">
    <div class="blob-wrapper">
      <img class="blob-background" src="@/assets/image/background5.png" />
      <div class="blob">
        <img src="@/assets/image/fullLogo.png" />
      </div>
    </div>
    <div class="allPersons">
      <div class="stepPersons">
        <img class="right-img" src="@/assets/image/gifs/Person1.gif" />
      </div>
      <div class="stepPersons">
        <img class="left-img" src="@/assets/image/gifs/Person2.gif" />
      </div>
      <div class="stepPersons">
        <img class="right-img" src="@/assets/image/gifs/Person3.gif" />
      </div>
      <div class="stepPersons">
        <img class="left-img" src="@/assets/image/gifs/Person4.gif" />
      </div>
      <div class="stepPersons">
        <img class="right-img" src="@/assets/image/gifs/Person5.gif" />
      </div>
      <div class="stepPersons">
        <img class="left-img" src="@/assets/image/gifs/Person6.gif" />
      </div>
      <div class="stepPersons">
        <img class="right-img" src="@/assets/image/gifs/Person7.gif" />
      </div>
      <div class="stepPersons">
        <img class="left-img" src="@/assets/image/gifs/Person8.gif" />
      </div>
      <div class="stepPersons">
        <img class="right-img" src="@/assets/image/gifs/Person9.gif" />
      </div>
      <div class="stepPersons">
        <img class="left-img" src="@/assets/image/gifs/Person10.gif" />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
p {
  font-size: calc(2vw + 20px);
  color: #000;
  text-wrap: wrap;
  width: 20vw;
}
.v-main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  height: 110vh;
  max-width: 100%;
  background-color: #000;
  .blob-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 70vw;
    .blob-background {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow-x: hidden;
      height: auto;
      max-height: 60vw;
      width: 60vw;
      // @media (max-width: 768px) {
      //   height: 50vh;
      //   width: 100vw;
      // }
      @media (max-width: 500px) {
        max-height: 80vw;
      width: 80vw;
      }
      position: absolute;
      z-index: 2;
      animation: rotate 60s 0s linear infinite;
      @keyframes rotate {
        to {
          transform: rotate(360deg);
        }
      }
    }
  }
  .allPersons {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    flex-direction: column;
    width: 100vw;
    max-width: 100%;
    height: 100vh;
    overflow-x: hidden;
    .stepPersons {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100vw;
      max-width: 100%;
      height: 10vh;
      .right-img {
        z-index: 1;
        height: 10vh;
        transform: translate(-10vw, 0);
        animation: walk 10s infinite;
        @keyframes walk {
          to {
            transform: translate(100vw, 0);
          }
        }
      }
      .left-img {
        z-index: 1;
        height: 10vh;
        transform: translate(100vw, 0) scaleX(-1);
        animation: walk2 10s infinite;
        @keyframes walk2 {
          to {
            transform: translate(-10vw, 0) scaleX(-1);
          }
        }
      }
    }
  }
  .blob {
    height: 35vw;
    width: 35vw;
    img {
      max-width: 60vw;
      filter: invert(1);
      @media (max-width: 768px) {
        width: 50vw;
      }
      @media (max-width: 500px) {
        width: 100vw;
      }
    }
    // @media (max-width: 768px) {
    //   height: 25vh;
    //   width: 35vw;
    // }
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin: 10px;
    // height: 42vh;
    // width: 20vw;
    box-shadow: 0 0 0 0 rgb(255, 196, 0, 1);
    transform: scale(1);
    animation: pulse 5s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.9);
      box-shadow: 0 0 0 0 rgb(204, 156, 0, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 200px rgb(127, 97, 0, 0);
    }
    100% {
      transform: scale(0.9);
      box-shadow: 0 0 0 0 rgb(204, 156, 0, 0.7);
    }
  }
}
</style>

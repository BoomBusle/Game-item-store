<template>
  <div class="v-deliver">
    <div class="game">
      <div class="blur-box">
        <p>Ігри</p>
      </div>
    </div>
    <div class="item">
      <div class="blur-box">
        <p>Товари</p>
      </div>
    </div>
    <div class="account">
      <div class="blur-box">
        <p>Акаунти</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
p {
  color: #fff;
  font-size: calc(2vw + 20px);
  width: auto;
  display: flex;
  border: 3px solid #f1f1f1;
  backdrop-filter: blur(10px);
  padding: 1vw;
  margin: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    border: 0px solid #f1f1f1;
    margin-right: 8vw;
}
}
.blur-box{
  backdrop-filter: blur(10px);
  display: flex; 
  margin-right: 7vw;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 15vh;
  border-radius: 15px;
  @media (max-width: 768px) {
    width: 100vw;
    margin-right: 0vw;
    border-radius: 0px;
}
}
.v-deliver {
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  justify-content: space-between;
}

.v-deliver::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  display: flex;
  justify-content: space-between;
}
.game{
  display: flex;
  align-items: center;
  justify-content: center;
  justify-items: center;
  clip-path: polygon(0 0, 100% 0%, 75% 100%, 0% 100%);
  background-image: url("@/assets/image/game.jpg");
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 500px;
  width: 33vw;
}
.item {
  position: absolute;
  display: flex;
  align-items: center;
  z-index: -1;
  justify-content: center;
  clip-path: polygon(15% 0%, 100% 0%, 75% 100%, 0% 100%);
  background-image: url("@/assets/image/item.jpg");
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 500px;
  width: 66vw;
  margin-left: 20vw;
}
.account {
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%);
  background-image: url("../../assets/image/account.png");
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 500px;
  width: 33vw;
  padding-left: 5vw;
}
</style>

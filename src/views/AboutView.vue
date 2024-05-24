<template>
  <div class="about-us">
    <h1 class="title">Про нас</h1>
    <p>
      Магазин <span style="color: #00b500">Game Treasure</span> - це молода
      компанія, яка спеціалізується на продажу ігрових цінностей. Наш магазин
      пропонує широкий асортимент ігрових товарів для всіх типів гравців.
    </p>
    <p>
      Ми прагнемо створити унікальне досвід для наших клієнтів, надаючи якісні
      продукти та найкращий сервіс.
    </p>
    <p>Завітайте до нас і відкрийте для себе світ ігрових цінностей!</p>
    <img src="../assets/image/fullLogo.png" alt="Game Treasure Лого" />
  </div>
</template>

<script>
export default {
  name: "About"
};
</script>

<style lang="scss" scoped>
.about-us {
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  p {
    font-size: 30px;
  }
  img {
    width: 40vw;
  }
}

.title {
  font-size: 60px;
  font-weight: bold;
}
</style>

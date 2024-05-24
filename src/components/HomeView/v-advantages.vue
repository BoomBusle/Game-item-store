<template>
  <div class="v-advantages">
      <div>
        <img src="@/assets/image/game.webp" />
        <p>67</p>
        <p>Ігор на вибір</p>
      </div>
      <div class="cartblur">
        <img src="@/assets/image/map.webp" />
        <p>50</p>
        <p>Можливих країн для купівлі
          (крім кацапії та її союзників)
        </p>
      </div>
      <div>
        <img src="@/assets/image/market.webp" />
        <p>273</p>
        <p>Покупок</p>
      </div>
      <div class="cartblur">
        <img src="@/assets/image/ticet.webp" />
        <p>711</p>
        <p>Товарів</p>
      </div>
      <div>
        <img src="@/assets/image/clients.webp" />
        <p>317</p>
        <p>Задоволених клієнтів</p>
      </div>
      <div class="cartblur">
        <img src="@/assets/image/orders.webp" />
        <p>7</p>
        <p>Офіційних дилерів</p>
      </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
p{
    font-weight: bold;
    font-size: 20px;
    color: inherit;
    @media (max-width: 768px) {
      font-size: 16px;
  }
  }
.v-advantages {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    min-height: 80vh;
    max-width: 100vw;
    width: 100%;
    div{
      flex: 0 1 30%;
    border-radius: 10px;
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    color: #00B500;
    &:nth-child(even){
      color: #FFC400;
      background-color: #fff;      
    }
}
}
.cartblur{
    -webkit-box-shadow: 0px 0px 30px 0px rgba(0,0,0,0.75);
-moz-box-shadow: 0px 0px 30px 0px rgba(0,0,0,0.75);
box-shadow: 0px 0px 30px 0px rgba(0,0,0,0.75);
}
</style>

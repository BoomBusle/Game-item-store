<template>
    <div class="v-date-container">
        <div>
            <img class="phone-img" src="@/assets/image/phone.png" />
            <p>+380 50 139 3361</p>
        </div>
        <div>
            <img class="map-img" src="@/assets/image/map.webp" />
            <p>вулиця Жовтнева, 21, Перечин, Закарпатська область, 89200</p>
        </div>
        <div>
            <img class="clock-img" src="@/assets/image/clock.png" />
            <p>з 9:00 до 23:00</p>
        </div>
    </div>
    <div class="v-map-container">
        <iframe class="google-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2631.460958432442!2d22.47261871237672!3d48.734890809269466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47391399291a49ef%3A0x27d1f4ecce156ef4!2z0KTQtdC80LXQu9C4INC_0LjRhtGG0LA!5e0!3m2!1sru!2sus!4v1710938137860!5m2!1sru!2sus" width="1000" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" hl="uk"></iframe>
    </div>
  </template>
  
  <script>
  export default {
    }
  </script>
  
  <style lang="scss">
  .v-date-container{
    display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: row;
    width: 100%;
    height: 20vh; 
    background-color: #fff;
    div{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: column;
        height: 100%;
        .phone-img{
            width: 30px;
            height: 40px;
        }
        .map-img{
            width: 24px;
        }
        .clock-img{
            width: 40px;
            height: 40px;
        }

    p{
        width: 10vw;
    }
    }
  }
  .v-map-container {
    width: 100%;
    height: 80vh; /* Розмір контейнера карти */
  }
  
  .google-map {
    width: 100%;
    height: 100%; /* Розмір самої карти */
  }
  </style>
  
<template>
  <div>
    <footer>
      <div class="important">
        <p>Важлива інформація</p>
        <nav>
          <router-link to="/about">Про нас</router-link>
          <router-link to="/privacy_policy">Політика конфіденційності</router-link>
          <router-link to="/reviews">Відгуки</router-link>
          <router-link to="/FAQ">FAQ</router-link>
        </nav>
      </div>
      <div class="contact">
        <p>Напишіть нам</p>
        <nav class="massenger">
          <a href="https://www.instagram.com/boombusle?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">
            <img src="../assets/image/instagram.webp" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100016121449134&locale=uk_UA">
            <img src="../assets/image/facebook.png" />
          </a>
          <a href="https://x.com/BoomBusle">
            <img src="../assets/image/twitter.png" />
          </a>
          <a href="https://t.me/BoomBusle">
            <img src="../assets/image/telegram.png" />
          </a>
        </nav>
      </div>
      <div class="category">
        <p>Каталог</p>
        <nav>
          <a href="https://store.steampowered.com/">Steam</a>
          <a href="https://www.ea.com/">EA store</a>
          <a href="https://www.ubisoft.com/">Uplay</a>
          <a href="https://www.gog.com">GOG</a>
        </nav>
      </div>
    </footer>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
nav a.router-link-exact-active {
  color: #ffc400;
}
a {
  color: #9b9b9b;
  font-weight: normal;
  text-decoration: none;
  margin-right: 20px;
  &:active {
    color: #ffc400;
  }
  &:focus {
    color: #ffc400;
  }
}
img {
  max-width: 40px;
  height: auto;
}
p {
  color: #fff;
  font-weight: bold;
}
footer {
  display: flex;
  justify-content: center;
  background-color: #000;
  align-items: flex-start;
  flex-wrap: wrap;
  max-width: 100vw;
  width: 100%;
  padding: 20px 0;

  .important,
  .contact,
  .category {
    margin: 2%;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    nav {
      flex-wrap: wrap;
      flex-direction: row;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }
  }

  .important {
    order: 1;
  }
  .contact {
    order: 2;
  }
  .category {
    order: 3;
  }
}

@media (max-width: 768px) {
  footer {
    flex-direction: column;
    align-items: center;

    .important,
    .contact,
    .category {
      width: 90%;
      margin: 10px 0;
    }

    .important {
      order: 1;
    }
    .contact {
      order: 2;
    }
    .category {
      order: 3;
    }
    nav {
      flex-direction: column;
      align-items: center;

      a {
        margin: 5px 0;
      }
    }
  }
}
</style>

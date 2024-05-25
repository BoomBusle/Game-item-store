<template>
  <div>
    <header class="v-header">
      <div>
        <button class="menu-button" @click="toggleMenu">☰</button>
        <nav class="main-nav" v-if="!showMenu">
          <router-link to="/">На головну</router-link>
          <router-link to="/catalog">Каталог</router-link>
          <router-link to="/about">Про нас</router-link>
          <router-link to="/reviews">Відгуки</router-link>
        </nav>
      </div>
      <div class="user-wrapper">
        <div class="cart-wrapper" @click="toggleCart">
          <img src="../assets/image/cart.png" alt="Shopping Cart Icon" />
          <span v-if="cartItems.length > 0" class="cart-count">{{
            cartItems.length
          }}</span>
          <div class="cart-overlay" v-if="showCart">
            <h2 class="null-cart" v-if="cartItems.length == 0">
              Кошик порожній
            </h2>
            <div class="cart-items">
              <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <img
                  :src="require('@/assets/image/game/' + item.image_path)"
                  alt="Product Image"
                  class="cart-item-image"
                />
                <div class="cart-item-details">
                  <p>{{ item.product_name }}</p>
                  <p>{{ item.price }} грн</p>
                  <button @click="removeFromCart(item.id)">Видалити</button>
                </div>
              </div>
              <div class="create-order">
                <router-link
                  class="order-router"
                  v-if="cartItems.length > 0"
                  to="/order"
                  >Зробити замовлення</router-link
                >
              </div>
            </div>
          </div>
        </div>
        <template v-if="isLoggedIn">
          <router-link :to="{ name: 'user-account' }" class="user-info">
            <span>{{ username }}</span>
          </router-link>
          <img
            @click="logout"
            class="logout-icon"
            src="../assets/image/logout.png"
            alt="Logout Icon"
          />
        </template>
        <template v-else>
          <a class="v-log-in" @click="openModal">Увійти</a>
        </template>
      </div>
    </header>
    <VLoginForm v-if="showModal" @close="closeModal" :username="username" />
    <div class="mobile-menu" :class="{ open: showMenu }">
      <nav class="mobile-nav">
        <button @click="navigateTo('/')">На головну</button>
        <button @click="navigateTo('/catalog')">Каталог</button>
        <button @click="navigateTo('/about')">Про нас</button>
        <button @click="navigateTo('/reviews')">Відгуки</button>
      </nav>
    </div>
  </div>
</template>

<script>
import VLoginForm from "@/forms/LoginForm.vue";
import axios from "axios";

export default {
  components: {
    VLoginForm
  },
  data() {
    return {
      showModal: false,
      isLoggedIn: false,
      username: "",
      showCart: false,
      cartItems: [],
      showMenu: false
    };
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    navigateTo(route) {
      this.$router.push(route);
      this.showMenu = false;
    },
    scrollToAboutMenu() {
      this.scrollToElement("menu");
    },
    scrollToAbout() {
      this.scrollToElement("about-us");
    },
    scrollToElement(id) {
      if (this.$route.path == "/") {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        this.$router.push("/").then(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    logout() {
      this.$cookies.remove("userToken");
      this.$cookies.remove("username");
      this.isLoggedIn = false;
      this.username = "";
      this.$router.push("/");
    },
    toggleCart() {
      console.log(this.cartItems);
      this.showCart = !this.showCart;
    },
    removeFromCart(id) {
      this.cartItems = this.cartItems.filter((item) => item.id !== id);
      axios
        .delete(`http://localhost:3000/remove_from_cart/${id}`)
        .then((response) => {
          console.log("Item removed from cart:", response.data);
        })
        .catch((error) => {
          console.error("Error removing item from cart:", error);
        });
    },
    updateCartItems(cartItems) {
      axios
        .put("http://localhost:3000/update_cart", { cartItems })
        .then((response) => {
          console.log("Cart updated:", response.data);
        })
        .catch((error) => {
          console.error("Error updating cart:", error);
        });
    }
  },
  mounted() {
    if (this.$cookies.isKey("userToken")) {
      this.isLoggedIn = true;
      this.username = this.$cookies.get("username");
      const userId = this.$cookies.get("userToken");
      axios
        .get(`http://localhost:3000/user_cart/${userId}`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            this.cartItems = response.data;
          } else {
            console.error("Invalid response format:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    }
  },
  updated() {
    if (this.$cookies.isKey("userToken")) {
      this.isLoggedIn = true;
      this.username = this.$cookies.get("username");
      const userId = this.$cookies.get("userToken");
      axios
        .get(`http://localhost:3000/user_cart/${userId}`)
        .then((response) => {
          if (response.data && response.data.length > 0) {
            this.cartItems = response.data;
          } else {
            console.error("Invalid response format:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    }
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Jura:wght@300..700&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');
.create-order {
  padding: 10px;
  .order-router {
    color: #000;
  }
}
.main-nav {
  margin: 10px 0;
  a {
    text-transform: uppercase;
    font-family: "Raleway", sans-serif;

    letter-spacing: 1.5px;
  }
}
.null-cart {
  font-weight: bold;
  margin: 20px;
}
.cart-wrapper {
  position: relative;
  cursor: pointer;
  img {
    width: 2vw;
  }
  .cart-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ff0000;
    color: #fff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
  .cart-overlay {
    position: absolute;
    top: 100%;
    right: 0;
    width: 300px;
    border-radius: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    z-index: 100;
    display: none;
  }
  &:hover .cart-overlay {
    display: block;
  }
  @media (max-width: 768px) {
    .cart-overlay {
      top: 130%;
      right: -40px;
    }
  }
}
.cart-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  &:last-child {
    border-bottom: none;
  }
  .cart-item-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-right: 10px;
  }
  .cart-item-details {
    flex: 1;
    p {
      margin: 0;
    }
    button {
      color: #fff;
      border-color: transparent;
      background-color: #ff0000;
      border-radius: 5px;
    }
  }
}
nav a.router-link-exact-active {
  color: #ffc400;
}
.scroll-to-top {
  transition: scroll-behavior 0.5s ease-in-out;
}
a {
  cursor: pointer;
  color: #fff;
  font-weight: bold;
  text-decoration: none;
  margin-left: 10px;
  &:active {
    color: #ffc400;
    background-color: #5e5e5e;
  }
  &:focus {
    color: #ffc400;
  }
}
.user-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 10px;
  margin-right: 10px;
  img {
    width: 2vw;
  }
  @media (max-width: 768px) {
    img {
      width: 5vw;
    }
  }
}
.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  .user-img {
    width: 2vw;
  }
}

.v-header {
  display: flex;
  justify-content: space-between;
  background-color: #000;
  align-items: center;
  max-width: 100vw;
  width: 100%;
  height: 5vh;
  .v-log-in {
    margin-right: 20px;
  }
}
.menu-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #fff;
  &.active {
    background-color: #5e5e5e;
  }
}
.mobile-menu {
  overflow: hidden;
  max-height: 0;
  transition: max-height 2s ease-out;
}
.mobile-menu.open {
  max-height: 500px;
}
@media (min-width: 768px) {
  .menu-button {
    display: none;
  }

  nav {
    display: flex;
  }
}
@media (max-width: 768px) {
  .menu-button {
    display: block;
  }
  .mobile-nav {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    gap: 5px;
    background-color: #000;
    button {
      background-color: #000;
      border: 0;
      width: 100%;
      height: 100%;
      font-size: 25px;
      color: #fff;
      text-align: left;
      padding: 10px;
      &:active {
        background-color: #6e6e6e;
      }
    }
  }
  .main-nav {
    display: none;
  }
}
</style>

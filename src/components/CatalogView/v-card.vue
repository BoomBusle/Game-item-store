<template>
  <div class="v-card" @click="redirectToProductPage">
    <img
      :src="require('@/assets/image/game/' + product.photo)"
      alt="Product Photo"
    />
    <div class="card-content">
      <h2>{{ product.name }}</h2>
      <p>{{ product.price }} грн</p>
      <button class="add-to-cart-button" @click.stop="addToCart">
        В кошик
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    redirectToProductPage() {
      const productId = this.product.id;
      this.$router.push({ name: "product", params: { productId: productId } });
    },
    addToCart() {
      const user_id = this.$cookies.get("userToken");

      if (!user_id) {
        console.error("User ID not found in cookies");
        return;
      }

      const cartItem = {
        user_id: user_id,
        product_id: this.product.id,
        price: this.product.price,
        quantity: 1, //this.quantity
        image_path: this.product.photo,
        product_name: this.product.name
      };
      axios
        .post("http://localhost:3000/add_to_cart", cartItem)
        .then((response) => {
          console.log("Product added to cart:", response.data);
          this.$emit("update-cart");
        })
        .catch((error) => {
          console.error("Error adding product to cart:", error);
        });
    },
    transliterate(text) {
      const cyrillic = "абвгдежзийклмнопрстуфхцчшщіьэюя";
      const latin = [
        "a",
        "b",
        "v",
        "g",
        "d",
        "e",
        "yo",
        "zh",
        "z",
        "i",
        "y",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "r",
        "s",
        "t",
        "u",
        "f",
        "h",
        "ts",
        "ch",
        "sh",
        "shch",
        "",
        "y",
        "",
        "e",
        "yu",
        "ya"
      ];
      return text
        .split("")
        .map((char) => {
          const index = cyrillic.indexOf(char.toLowerCase());
          if (index !== -1) {
            return char === char.toUpperCase()
              ? latin[index].toUpperCase()
              : latin[index];
          }
          return char;
        })
        .join("");
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: "Speed Rush";
  src: local('Speed Rush'),
    url('../../assets/font/SpeedRush-JRKVB.ttf') format('ttf'),

}
.add-to-cart-button {
  background-color: #4caf50;
  color: white;
  padding: 9px 9px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart-button:hover {
  background-color: #45a049;
}

.quantity-input {
  padding: 8px 2px;
  border: 1px solid #ccc;
  border-radius: 0px 5px 5px 0px;
}
.v-card {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  cursor: pointer;
  padding: 10px;
  max-width: 22%;
  transition: background-color 0.3s;
  font-family: "Speed Rush" !important;
  &:hover {
    background-color: #949494;
  }
  img {
    filter: none;
    max-width: 90%;
    width: 200px;
    height: auto;
    border-radius: 10px 10px 0px 0px;
  }
}

.v-card:hover {
  background-color: #949494;
}

.card-content {
  padding: 10px;
  font-weight: bold;
  text-align: center;
  font-family: "Speed Rush" !important;
  p {
    margin: 10px;
  }
}

.modal {
  display: flex;
  position: fixed;
  flex-direction: row;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.modal img {
  filter: none;
  width: 500px;
  height: 470px;
  border-radius: 10px 0px 0px 10px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  background-color: #fefefe;
  border: 1px solid #888;
  border-radius: 0px 10px 10px 0px;
  width: 50%;
  height: 50%;
  overflow: auto;
  .name-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 1vw 1vw 0vw 1vw;
    height: 10%;
  }
  .descr-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 1vw 1vw 0vw 1vw;
    height: 60%;
  }
  .bot-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1vw;
    height: 30%;
  }
  .charct-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    width: 50%;
    select {
      padding: 5px;
      border-radius: 3px;
      border: 1px solid #ccc;
      &:focus {
        outline: none;
        border-color: #007bff;
      }
    }
  }
  .price-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 50%;
  }
}
.close-button {
  color: #fff;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 28px;
  font-weight: bold;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>

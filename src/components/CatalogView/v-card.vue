<template>
  <div class="v-card" @click="redirectToProductPage">
    <img
      :src="require('@/assets/image/game/' + product.photo)"
      alt="Product Photo"
    />
    <div class="card-content">
      <h2 class="card-name">{{ product.name }}</h2>
      <div v-if="averageRating === 0" class="rating">
        <h2>Оцінок немає</h2>
      </div>
      <div v-else class="rating">
        <h2 class="card-rating">{{ averageRating }}/5</h2>
        <span class="star">&#9733</span>
      </div>
      <h2 class="card-body">Тип : {{ product.body }}</h2>
    </div>
    <div class="card-footer">
      <p>{{ product.price }} грн</p>
      <button class="add-to-cart-button" >
        До товару
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
  data() {
    return {
      comments: [],
      averageRating: 0
    };
  },
  created() {
    this.fetchComments();
  },
  methods: {
    calculateAverageRating() {
      if (this.comments.length === 0) {
        this.averageRating = 0;
        return;
      }

      const totalRating = this.comments.reduce((acc, comment) => {
        return acc + parseInt(comment.body.split(" ")[0]);
      }, 0);

      this.averageRating = totalRating / this.comments.length;
    },
    fetchComments() {
      const productId = this.product.id;
      axios
        .get(`http://localhost:3000/comments/${productId}`)
        .then((response) => {
          this.comments = response.data;
        })
        .catch((error) => {
          console.error("Помилка отримання коментарів:", error);
        });
    },
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
  },
  watch: {
    comments: {
      handler() {
        this.calculateAverageRating();
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
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
  width: 50%;
  border-radius: 10px 0px 10px 0px;
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
  max-width: 220px;
  transition: background-color 0.3s;
  font-family: "Speed Rush" !important;
  transition: transform 0.3s;
  overflow: hidden;
  &:hover {
    transform: translateY(-10px);
  }
  img {
    padding: 10px;
    background-color: #d6d6d6;
    width: 200px;
    height: 200px; 
    object-fit: fill; 
  }
  .card-footer{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    p{
      font-weight: bold;
      width: 50%;
    }
  }
}

.card-content {
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  text-align: center;
  font-family: "Speed Rush" !important;
  .card-name{
    text-align: start;
    font-weight: bold;
  }
  .card-body{
    font-weight: 400;
  }
  .rating{
    display: flex;
    align-items: center;
    justify-content: center;
    .star{
      padding-left: 0.2vw;
      font-size: 20px;
      color: #ffd700;
    }
  }
  h2 {
    padding-left: 1vw;
  }
}


</style>

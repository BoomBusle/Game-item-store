<template>
  <div class="product-page" v-for="product in product">
    <div class="product-details" v-if="product">
      <div class="img-wrapper">
        <img
          :src="
            product.photo ? require(`@/assets/image/game/${product.photo}`) : ''
          "
          alt="Фото товару"
        />
        <h1>{{ product.name }}</h1>
      </div>
      <div class="info-wrapper">
        <p>Опис: {{ product.description }}</p>
        <p>Оцінка {{ averageRating }}</p>
        <p>Ціна: {{ product.price }} грн</p>
        <p>
          Доступність:
          {{ product.enable ? "В наявності" : "Немає в наявності" }}
        </p>
        <p>Створено: {{ new Date(product.created_at).toLocaleString() }}</p>
        <p>Оновлено: {{ new Date(product.updated_at).toLocaleString() }}</p>
        <div v-if="product.body === 'Прокачка'">
          <div class="form-input">
            <input type="text" id="login" v-model="login" placeholder="Логін" />
            <label for="login">Логін</label>
          </div>
          <div class="form-input">
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Пароль"
            />
            <label for="password">Пароль</label>
          </div>
        </div>
        <div v-else-if="product.body === 'Предмети'">
          <div class="form-input">
            <input type="text" v-model="tradeLink" placeholder="Трейд силка" />
            <label>Трейд силка</label>
          </div>
        </div>
        <button
          class="add-to-cart-button"
          @click.stop="addToCart"
          :disabled="!product.enable"
        >
          В кошик
        </button>
      </div>
    </div>
    <div class="reviews_wrapper">
      <div v-if="isLoggedIn" class="review-section">
        <h2>Залишити відгук</h2>
        <textarea
          v-model="reviewBody"
          placeholder="Введіть ваш відгук"
        ></textarea>
        <h2 for="reviewBody">Оцінка:</h2>
        <div class="rating">
          <span
            v-for="(n, index) in 5"
            :key="n"
            @click="rating = n"
            :class="['filled', `star-${index}`, { dark: index >= rating - 1 }]"
            @mouseover="highlightStars(index)"
          >
            &#9733;
          </span>
        </div>
        <button @click="submitReview">Надіслати відгук</button>
      </div>
      <div class="comments-section">
        <h2>Коментарі</h2>
        <div v-if="comments.length < 1">
          <p>Поки що немає коментарів.</p>
        </div>
        <div class="comments-wrapper" v-else>
          <div
            class="comment"
            v-for="(comment, index) in paginatedComments"
            :key="comment.id"
          >
            <div class="main-comment-wrapper">
              <template
                v-if="
                  comment.user_id &&
                  users &&
                  users.find((user) => user.id === comment.user_id)
                "
              >
                <p class="user-name">
                  {{ users.find((user) => user.id === comment.user_id).login }}
                </p>
              </template>
              <p class="rating-wrapper">
                Оцінка: {{ comment.body.split(" ")[0] }}
                <span
                  class="ratingSee"
                  v-for="n in 1"
                  :key="n"
                  v-if="n <= parseInt(comment.body.split(' ')[0])"
                  >&#9733;</span
                >
              </p>
            </div>
            <p class="body-wrapper">
              "{{ removeRatingFromComment(comment.body) }}"
            </p>
            <p class="time-wrapper">
              Створено: {{ new Date(comment.created_at).toLocaleString() }}
            </p>
          </div>
          <div v-if="totalPages > 1">
            <button
              class="pageBtn"
              @click="prevPage"
              :disabled="currentPage === 1"
            >
              <span>&#8592;</span>
            </button>
            <span>Сторінка {{ currentPage }} з {{ totalPages }}</span>
            <button
              class="pageBtn"
              @click="nextPage"
              :disabled="currentPage === totalPages"
            >
              <span>&#8594;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  data() {
    return {
      product: null,
      reviewBody: "",
      comments: [],
      rating: 1,
      users: [],
      currentPage: 1,
      login: "",
      password: "",
      tradeLink: "",
      itemsPerPage: 5,
      averageRating: 0
    };
  },
  created() {
    this.fetchProductDetails();
    this.fetchComments();
    this.fetchUsers();
  },
  methods: {
    addToCart() {
      const user_id = this.$cookies.get("userToken");

      if (!user_id) {
        console.error("User ID not found in cookies");
        return;
      }
      let userInfoString = "";
      if (this.product[0].body === "Прокачка") {
        userInfoString = `Логін: ${this.login} Пароль: ${this.password}`;
      } else if (this.product[0].body === "Предмети") {
        userInfoString = `Трейд силка: ${this.tradeLink}`;
      }
      const cartItem = {
        user_id: user_id,
        product_id: this.$route.params.productId,
        price: this.product[0].price,
        quantity: 1,
        image_path: this.product[0].photo,
        product_name: this.product[0].name,
        product_user_info: userInfoString
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
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3000/users");
        this.users = response.data;
      } catch (error) {
        console.error("Помилка отримання користувачів:", error);
      }
    },
    async fetchProductDetails() {
      const productId = this.$route.params.productId;
      try {
        const response = await axios.get(
          `http://localhost:3000/products/${productId}`
        );
        this.product = response.data;
        if (["Ігри", "Акаунти"].includes(this.product[0].body)) {
          await this.checkProductAvailability(productId);
        }
      } catch (error) {
        console.error("Помилка отримання деталей товару:", error);
      }
    },
    async checkProductAvailability(productId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/check_product_availability/${productId}`
        );
        if (response.data.available) {
          this.product[0].enable = 1;
        } else {
          this.product[0].enable = 0;
        }
      } catch (error) {
        console.error("Error checking product availability:", error);
      }
    },
    fetchComments() {
      const productId = this.$route.params.productId;
      axios
        .get(`http://localhost:3000/comments/${productId}`)
        .then((response) => {
          this.comments = response.data;
        })
        .catch((error) => {
          console.error("Помилка отримання коментарів:", error);
        });
    },
    submitReview() {
      const reviewText = `${this.rating} ${this.reviewBody}`;
      if (reviewText.trim() === "") {
        console.error("Текст відгуку порожній");
        return;
      }

      const reviewData = {
        body: reviewText,
        user_id: VueCookies.get("userToken"),
        parent_id: this.$route.params.productId
      };

      axios
        .post("http://localhost:3000/add_comment", reviewData)
        .then((response) => {
          this.reviewBody = "";
          this.rating = 1;
          this.fetchComments();
        })
        .catch((error) => {
          console.error("Помилка відправлення відгуку:", error);
        });
    },
    removeRatingFromComment(comment) {
      return comment.split(" ").slice(1).join(" ");
    },
    highlightStars(index) {
      for (let i = index + 1; i < 5; i++) {
        document.querySelector(`.star-${i}`).classList.remove("dark");
      }
      for (let i = 0; i <= index; i++) {
        document.querySelector(`.star-${i}`).classList.add("dark");
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    calculateAverageRating() {
      if (this.comments.length === 0) {
        this.averageRating = 0;
        return;
      }

      const totalRating = this.comments.reduce((acc, comment) => {
        return acc + parseInt(comment.body.split(" ")[0]);
      }, 0);

      this.averageRating = totalRating / this.comments.length;
    }
  },
  computed: {
    isLoggedIn() {
      const username = VueCookies.get("username");
      return !!username;
    },
    reversedComments() {
      return this.comments.slice().reverse();
    },
    paginatedComments() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.reversedComments.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.comments.length / this.itemsPerPage);
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

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Jura:wght@300..700&display=swap");

.form-input {
  padding: 10px;
  position: relative;
  width: 70%;
}

.form-input input::placeholder {
  opacity: 0;
}

.form-input input {
  width: 100%;
  height: 4vh;
  font-size: 1.2rem;
  padding: 10px;
  outline: none;
  border: 1px solid gray;
  box-sizing: border-box;
  border-radius: 5px;
}

.form-input label {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: gray;
  letter-spacing: 1px;
  transition: 0.3s;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
}

.form-input input:focus + label,
.form-input input:not(:placeholder-shown) + label {
  top: 0;
  font-size: 0.8rem;
  color: gray;
  padding: 7px;
}

.form-input input:focus {
  border: 2px solid #bebebe;
}
button {
  background-color: #fff;
  border: transparent;
  border-radius: 5px;
  margin-bottom: 20px;
  margin-left: 1vw;
  margin-right: 1vw;
  padding: 5px;
  -webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.25);
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.25);
  font-weight: bold;
}
.product-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.product-details {
  z-index: 100;
  background: #fff;
  min-height: 50vh;
  // background-color: #bebebe;
  font-family: "Jura", sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  max-width: 100vw;
  width: 90vw;
  border-radius: 0 0 1rem 1rem;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px,
    rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px,
    rgba(0, 0, 0, 0.09) 0px 32px 16px;
  // border-radius: 10px;
  // -webkit-box-shadow: -10px 10px 0px 0px rgba(110, 110, 110, 0.7);
  // -moz-box-shadow: -10px 10px 0px 0px rgba(110, 110, 110, 0.7);
  // box-shadow: -10px 10px 0px 0px rgba(110, 110, 110, 0.7);
}
.product-details img {
  max-height: 30vh;
  width: auto;
  filter: drop-shadow(0 0 0.75rem);
}
.img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 50vw;
  width: 100%;
  gap: 10px;
  border-right: 1px solid rgba($color: #000000, $alpha: 0.2);
  h1 {
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 2px;
    font-family: "Jura", sans-serif;
    background: #000;
    color: #fff;
    padding: 10px;
    border-radius: 20px;
  }
}
.info-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  font-weight: bold;
  gap: 10px;
  text-align: start;
  width: -webkit-fill-available;
  padding: 20px;
  p {
    font-family: "Comfortaa", sans-serif;
  }
}
.reviews_wrapper {
  display: flex;
  flex-direction: column;
  background: #fff;
  padding-top: 50px;
  margin-top: -40px;
  width: 100%;
  max-width: 100vw;
  z-index: 1;
  gap: 15px;
  border-radius: 20px 20px 0 0;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
    justify-content: center;
    align-items: center;
  .review-section {
    // max-width: 50%;
    width: -webkit-fill-available;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10px;
    gap: 5px;
    h2 {
      font-weight: bold;
    }
    textarea {
      min-width: 50vw;
    }
    .rating {
      color: #e3a520;
      font-size: 24px;
      cursor: pointer;
    }
    button {
      padding: 7px;
      cursor: pointer;
    }
  }
  .comments-section {
    display: flex;
    width: -webkit-fill-available;
    min-width: 50%;
    max-width: 960px;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .comments-wrapper {
      width: 100%;
      .comment {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-bottom: 2vw;
        padding: 10px;
        border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        .main-comment-wrapper {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: flex-start;
          gap: 10px;
          .rating-wrapper {
            margin-top: -0.1vw;
          }
        }
        .body-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          width: 95%;
          font-style: italic;
          font-weight: 300;
          text-wrap: wrap;
          text-align: justify;
        }
        .time-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          width: 100%;
          margin-right: 2vw;
        }
      }
    }
  }
}

textarea {
  height: 100px;
  margin-bottom: 10px;
  resize: none;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.ratingSee {
  color: #ffd700;
  font-size: 24px;
}

.rating .filled {
  color: #e3a520;
}

.comments-section h2 {
  margin-bottom: 10px;
}

.comments-section p {
  margin: 5px 0;
}

.comments-section p:first-child {
  font-weight: bold;
}

.comments-section .ratingSee {
  margin-left: 5px;
}

.review-section h2 {
  margin-bottom: 10px;
}
.dark {
  color: #ffd700 !important;
}
</style>

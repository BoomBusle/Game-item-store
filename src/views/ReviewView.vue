<template>
  <div class="review-page">
    <div class="header">
      <img
        src="../assets/image/fullLogo.png"
        alt="Логотип сайту"
        class="logo"
      />
      <div class="average-rating">
        <h2>Середня оцінка</h2>
        <div>
          <p>{{ averageRating.toFixed(1) }}</p>
          <span class="star"> &#9733;</span>
        </div>
      </div>
    </div>
    <h1>Відгуки</h1>
    <div class="review-section">
      <h2>Залишити відгук</h2>
      <div v-if="isLoggedIn">
        <textarea
          v-model="reviewBody"
          placeholder="Введіть ваш відгук"
        ></textarea>
        <h2>Оцінка:</h2>
        <div class="rating">
          <span
            v-for="(n, index) in 5"
            :key="n"
            @click="rating = n"
            :class="['star', { filled: index < rating }]"
          >
            &#9733;
          </span>
        </div>
        <button class="submit-button" @click="submitReview">Надіслати відгук</button>
      </div>
      <div v-else>
        <p>Щоб написати відгук, зареєструйтесь будь ласка.</p>
      </div>
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
            <p class="user-name">
              {{ getUsername(comment.user_id) }}
            </p>
            <p class="rating-wrapper">
              Оцінка: {{ comment.body.split(" ")[0] }}
              <span
                class="ratingSee"
                v-for="n in parseInt(comment.body.split(' ')[0])"
                :key="n"
              >
                &#9733;
              </span>
            </p>
          </div>
          <p class="body-wrapper">
            "{{ removeRatingFromComment(comment.body) }}"
          </p>
          <p class="time-wrapper">
            Створено: {{ new Date(comment.created_at).toLocaleString() }}
          </p>
        </div>
        <div v-if="totalPages > 1" class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">
            &#8592;
          </button>
          <span>Сторінка {{ currentPage }} з {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">
            &#8594;
          </button>
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
      reviewBody: "",
      comments: [],
      rating: 1,
      users: [],
      currentPage: 1,
      itemsPerPage: 5
    };
  },
  created() {
    this.fetchComments();
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3000/users");
        this.users = response.data;
      } catch (error) {
        console.error("Помилка отримання користувачів:", error);
      }
    },
    fetchComments() {
      const productId = 29102005;
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
      if (!this.isLoggedIn) {
        alert("Щоб написати відгук, зареєструйтесь будь ласка.");
        return;
      }

      const reviewText = `${this.rating} ${this.reviewBody}`;
      if (reviewText.trim() === "") {
        console.error("Текст відгуку порожній");
        return;
      }

      const reviewData = {
        body: reviewText,
        user_id: VueCookies.get("userToken"),
        parent_id: 29102005
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
    getUsername(userId) {
      const user = this.users.find((user) => user.id === userId);
      return user ? user.login : "Невідомий користувач";
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
    },
    averageRating() {
      if (this.comments.length === 0) {
        return 0;
      }
      const totalRating = this.comments.reduce((sum, comment) => {
        const rating = parseInt(comment.body.split(" ")[0]);
        return sum + rating;
      }, 0);
      const average = totalRating / this.comments.length;
      return Math.round(average * 10) / 10;
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  .logo {
    width: 60%;
  }
  .average-rating {
    font-size: 30px;
    font-weight: bold;
    width: 40%;
    div {
      font-size: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      .star {
        color: #ffd700;
      }
    }
  }
  @media (max-width: 750px) {
    flex-direction: column;
  }
}

.review-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  font-family: Arial, sans-serif;
  width: 100vw;
}

.review-section,
.comments-section {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.review-section h2,
.comments-section h2 {
  margin-top: 0;
}

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  resize: none;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.rating {
  display: flex;
  font-size: 24px;
  cursor: pointer;
}

.rating .star {
  color: #ddd;
}

.rating .star.filled {
  color: #ffd700;
}

.submit-button {
  background-color: #c4c4c4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: 10px;
  &:hover {
  background-color: #afafaf;
  }
  &:active{
    background-color: #6e6e6e;
  }
}

.comment {
  background-color: #fff;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.comment .main-comment-wrapper {
  display: flex;
  justify-content: space-between;
}

.comment .user-name {
  font-weight: bold;
}

.comment .rating-wrapper .ratingSee {
  color: #ffd700;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination button {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

<template>
  <div class="v-form-wrapper">
    <form @submit.prevent="register" class="form">
      <div class="form-group">
        <label for="username">Ім'я користувача:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
          pattern="\w{5,16}"
        />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
        />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          minlength="4"
          pattern="(?=.*[A-Z]).{7,}"
        />
      </div>
      <button type="submit" class="register-button">Зареєструватися</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      email: "",
      phone: "",
      password: "",
      errorMessage: "",
      successMessage: ""
    };
  },
  methods: {
    register() {
      axios.post('http://localhost:3000/register', {
        username: this.username,
        email: this.email,
        password: this.password
      })
      .then(response => {
        console.log('Відповідь сервера:', response.data);
        if (response.data.error) {
          this.errorMessage = response.data.error;
        } else {
          this.username = "";
          this.email = "";
          this.password = "";
          this.successMessage = response.data.message;
          this.errorMessage = ""; 
          this.$router.push('/');
        }
      })
      .catch(error => {
        console.error('Помилка під час реєстрації користувача:', error);
        this.errorMessage = error.response.data; 
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-form-wrapper {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form {
  width: 90%;
  max-width: 400px;
  padding: 20px;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  color: #000;
  margin-bottom: 5px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button.register-button {
  width: 50%;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #3d3d3d;
  }
}

.error-message {
  color: red;
}

.success-message {
  color: green;
}
</style>

<template>
  <div class="v-form-wrapper">
    <form @submit.prevent="register" class="form">
      <div class="form-group">
        <label for="username">Ім'я користувача:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          @input="validateUsername"
          required
        />
        <div v-if="usernameError" class="error-message">{{ usernameError }}</div>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          @input="validateEmail"
          required
        />
        <div v-if="emailError" class="error-message">{{ emailError }}</div>
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          @input="validatePassword"
          required
        />
        <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
      </div>
      <button type="submit" class="register-button">Зареєструватися</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import sha256 from 'crypto-js/sha256';

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      usernameError: "",
      emailError: "",
      passwordError: "",
      errorMessage: "",
      successMessage: ""
    };
  },
  methods: {
    validateUsername() {
      const usernamePattern = /^\w{5,16}$/;
      if (!this.username) {
        this.usernameError = "Ім'я користувача обов'язкове";
      } else if (!usernamePattern.test(this.username)) {
        this.usernameError = "Ім'я користувача повинно містити від 5 до 16 символів";
      } else {
        this.usernameError = "";
      }
    },
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email) {
        this.emailError = "Email обов'язковий";
      } else if (!emailPattern.test(this.email)) {
        this.emailError = "Некоректний формат email (example@mail.com)";
      } else {
        this.emailError = "";
      }
    },
    validatePassword() {
      const passwordPattern = /^(?=.*[A-Z]).{7,}$/;
      if (!this.password) {
        this.passwordError = "Пароль обов'язковий";
      } else if (this.password.length < 7) {
        this.passwordError = "Пароль повинен містити щонайменше 7 символів";
      } else if (!passwordPattern.test(this.password)) {
        this.passwordError = "Пароль повинен містити щонайменше одну велику літеру ";
      } else {
        this.passwordError = "";
      }
    },
    register() {
      this.validateUsername();
      this.validateEmail();
      this.validatePassword();

      if (this.usernameError || this.emailError || this.passwordError) {
        this.errorMessage = "Будь ласка, виправте помилки у формі";
        return;
      }

      const hashedPassword = sha256(this.password).toString(); 
      axios.post('http://localhost:3000/register', {
        username: this.username,
        email: this.email,
        password: hashedPassword
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

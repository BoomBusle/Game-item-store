<template>
  <div class="v-form-wrapper" v-if="isVisible">
    <button class="close-button" @click="closeForm">&times;</button>
    <form @submit.prevent="login" class="form" @click.stop>
      <div class="form-group">
        <label for="username">Ім'я користувача:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="login-button">Увійти</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}


        
      </div>
    </form>
    <p class="register-link" @click="goToRegistration">
      Ще не зареєстровані? Зареєструватися
    </p>
    <p class="register-link">Або</p>
    <GoogleLogin :callback="callback" />
  </div>
</template>

<script>
import axios from "axios";
import { decodeCredential } from "vue3-google-login";

export default {
  data() {
    return {
      id: "",
      username: "",
      password: "",
      isVisible: true,
      errorMessage: "",
      successMessage: "",
      userDataFromGoogleLogin: null,
      callback: (response) => {
        this.userDataFromGoogleLogin = decodeCredential(response.credential);
        this.loginForGoogle();
      }
    };
  },
  methods: {
    loginForGoogle(){
      const googleUserData = this.userDataFromGoogleLogin;
      axios
        .post("http://localhost:3000/login", {
          username: googleUserData.name,
          password: googleUserData.sub
        })
        .then((response) => {
          if (response && response.data) {
            if (response.data.error === "user_not_found") {
              this.register();
            }  else {
              const userId = response.data.id;
              this.$cookies.set("userToken", userId);
              console.log(userId);
              this.$cookies.set("username", googleUserData.name);
              this.$emit("close");
              this.isVisible = false;
              
            }
          } else {
            console.error("Сервер не повернув відповідь або дані.");
          }
        })
        .catch((error) => {
          console.error("Помилка під час авторизації користувача:", error);
          if (error.response && error.response.data) {
            if (error.response.data.error === "user_not_found") {
              this.errorMessage = "Такого користувача не існує";
            } else if (error.response.data.error === "incorrect_password") {
              this.errorMessage = "Невірий пароль";
            } else {
              this.errorMessage = "Сталася помилка під час авторизації";
            }
          } else {
            this.errorMessage = "Сталася помилка під час авторизації";
          }
        });
    },
    register() {
      const googleUserData = this.userDataFromGoogleLogin;
      axios
        .post("http://localhost:3000/register", {
          username: googleUserData.name,
          email: googleUserData.email,
          password: googleUserData.sub
        })
        .then((response) => {
          console.log("Відповідь сервера:", response.data);
          if (response.data.error) {
            this.errorMessage = response.data.error;
          } else {
            this.username = "";
            this.email = "";
            this.password = "";
            this.successMessage = response.data.message;
            this.errorMessage = "";
          }
        })
        .catch((error) => {
          console.error("Помилка під час реєстрації користувача:", error);
          this.errorMessage = error.response.data;
        });
    },
    login() {
      axios
        .post("http://localhost:3000/login", {
          username: this.username,
          password: this.password
        })
        .then((response) => {
          if (response && response.data) {
            if (response.data.error === "user_not_found") {
              this.errorMessage = "Такого користувача не існує";
            } else if (response.data.error === "incorrect_password") {
              this.errorMessage = "Невірний пароль";
            } else {
              const userId = response.data.id;
              this.$cookies.set("userToken", userId);
              this.$cookies.set("username", this.username);
              this.$emit("close");
              this.isVisible = false;
            }
          } else {
            console.error("Сервер не повернув відповідь або дані.");
          }
        })
        .catch((error) => {
          console.error("Помилка під час авторизації користувача:", error);
          if (error.response && error.response.data) {
            if (error.response.data.error === "user_not_found") {
              this.errorMessage = "Такого користувача не існує";
            } else if (error.response.data.error === "incorrect_password") {
              this.errorMessage = "Невірий пароль";
            } else {
              this.errorMessage = "Сталася помилка під час авторизації";
            }
          } else {
            this.errorMessage = "Сталася помилка під час авторизації";
          }
        });
    },

    closeForm() {
      this.$emit("close");
      this.isVisible = false;
    },
    goToRegistration() {
      this.$emit("close");
      this.$router.push("/registration");
    }
  },
  beforeMount() {
    document.body.style.overflow = "hidden";
  },
  beforeUnmount() {
    document.body.style.overflow = "auto";
  }
};
</script>

<style lang="scss" scoped>
.v-form-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
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
  color: #fff;
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button.login-button {
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

.register-link {
  text-align: center;
  color: #fff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

.close-button {
  position: absolute;
  top: 1px;
  right: 12px;
  font-size: 50px;
  color: #fff;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.error-message {
  color: #ff0000;
}

.success-message {
  color: #1fd64d;
}
</style>

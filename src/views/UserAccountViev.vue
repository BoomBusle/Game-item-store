<template>
  <div class="user-account-view">
    <div class="user-info">
      <h2>Мій обліковий запис</h2>
      <p><strong>Ім'я користувача:</strong> <span v-if="!editMode">{{ userData.login }}</span></p>
      <input v-model="editedUserData.login" type="text" v-if="editMode && !saving" placeholder="Введіть нове ім'я користувача">
      <p><strong>Пошта:</strong> {{ userData.email }}</p>
      <button @click="toggleEditMode">{{ editMode ? 'Зберегти' : 'Редагувати' }}</button>
    </div>
    <div class="user-orders">
      <h3>Мої замовлення</h3>
      <table>
        <thead>
          <tr>
            <th>Замовлення</th>
            <th>Ціна</th>
            <th>Дата замовлення</th>
            <th>Дані замовлення</th>
            <th>Статус замовлення</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in reversedUserOrders" :key="order.id">
            <td data-label="Замовлення">{{ order.products_name }}</td>
            <td data-label="Ціна">{{ order.products_price }} грн</td>
            <td data-label="Дата замовлення">{{ new Date(order.created_at).toLocaleString() }}</td>
            <td data-label="Дані замовлення">{{ order.order_descr }}</td>
            <td data-label="Статус замовлення">{{ order.order_status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
  data() {
    return {
      userData: {}, 
      userOrders: [],
      editedUserData: {},
      editMode: false,
      saving: false
    };
  },
  computed: {
    reversedUserOrders() {
      return this.userOrders.slice().reverse();
    }
  },
  methods: {
    async toggleEditMode() {
      if (this.editMode) {
        await this.saveChanges();
      } else {
        this.editMode = true;
        this.editedUserData = { ...this.userData }; 
      }
    },
    async saveChanges() {
      this.saving = true;
      try {
        await axios.put(`http://localhost:3000/update_user/${this.userData.id}`, this.editedUserData);
        this.userData = { ...this.editedUserData };
        this.editMode = false;
      } catch (error) {
        console.error('Error updating user:', error);
      } finally {
        this.saving = false;
      }
    },
    async fetchUserData() {
      const userId = VueCookies.get('userToken');
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3000/user/${userId}`);
          this.userData = response.data;
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.error('User token not found in cookies');
      }
    },
    async fetchUserOrders() {
      const userId = VueCookies.get('userToken');
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3000/user_orders/${userId}`);
          this.userOrders = response.data;
        } catch (error) {
          console.error('Error fetching user orders:', error);
        }
      } else {
        console.error('User token not found in cookies');
      }
    }
  },
  
  mounted() {
    this.fetchUserData();
    this.fetchUserOrders();

    if (this.$cookies.get('username') == 'Admin' && this.$cookies.get('password') == '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2') {
      this.$router.push('/adminpanel');
    }
  }
};
</script>

<style scoped>
.user-account-view {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 20px;
  font-weight: bold;
}

button {
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #555;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

@media (max-width: 600px) {
  .user-account-view {
    padding: 10px;
  }

  .user-orders table {
    display: block;
    width: 100%;
    overflow-x: auto;
  }

  .user-orders table thead {
    display: none;
  }

  .user-orders table tr {
    display: block;
    margin-bottom: 10px;
    width: 90vw;
  }

  .user-orders table td {
    display: block;
    text-align: right;
    position: relative;
    padding-left: 50%;
  }

  .user-orders table td::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 50%;
    padding-left: 10px;
    font-weight: bold;
    text-align: left;
  }
}
</style>

<template>
  <div>
    <div class="order-summary">
      <h1>Замовлення</h1>
      <div v-if="cart.length > 0" class="cart-items">
        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <p>{{ item.product_name }} - {{ item.product_user_info || 'Немає інформації' }} - {{ item.price }} грн</p>
        </div>
        <p class="total">Загалом до сплати: {{ total }} грн</p>
      </div>
      <div v-else>
        <p>Кошик порожній</p>
      </div>
      <button @click="handleOrder">Зробити замовлення</button>
    </div>
    <div v-if="liqpayForm">
      <form :action="liqpayUrl" method="post" ref="liqpayForm">
        <input type="hidden" name="data" :value="liqpayForm.data">
        <input type="hidden" name="signature" :value="liqpayForm.signature">
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cart: [],
      saveAddress: false,
      isShippingAddressValid: true,
      amount: this.total,
      currency: 'UAH',
      description: '',
      order_id: '',
      liqpayForm: null,
      liqpayUrl: 'https://www.liqpay.ua/api/3/checkout',
      showPaymentForm: true
    };
  },
  computed: {
    total() {
      return this.cart.reduce((acc, item) => acc + item.price, 0);
    }
  },
  methods: {
    handleOrder() {
      this.placeOrder();
    },
    async placeOrder() {
      try {
        for (let item of this.cart) {
          if (!item.product_user_info) {
            const credentials = await this.fetchAndDeleteProductCredentials(item.product_id);
            if (credentials) {
              item.product_user_info = credentials;
            }
          }
        }

        const orderData = {
          user_id: this.$cookies.get("userToken"),
          products_price: this.total,
          order_status: "В процесі",
          products_name: this.cart.map(item => item.product_name).join(", "),
          order_descr: this.cart.map(item => item.product_user_info).join(", ")
        };

        const response = await axios.post(`http://localhost:3000/place_order`, orderData);
        console.log("Order placed successfully:", response.data);
        this.orderId = response.data.id;
        this.amount = this.total;
        this.submitPayment();
        this.clearCart();
        this.showPaymentForm = false;
      } catch (error) {
        console.error("Error placing order:", error);
      }
    },
    async fetchAndDeleteProductCredentials(productId) {
      try {
        const response = await axios.get(`http://localhost:3000/get_product_credentials/${productId}`);
        const credentials = response.data.credentials;

        await axios.delete(`http://localhost:3000/delete_product_credentials/${productId}`);

        return credentials;
      } catch (error) {
        console.error("Error fetching and deleting product credentials:", error);
        return null;
      }
    },
    fetchCartData() {
      const userId = this.$cookies.get("userToken");
      axios.get(`http://localhost:3000/user_cart/${userId}`)
        .then(response => {
          this.cart = response.data;
        })
        .catch(error => {
          console.error("Error fetching cart data:", error);
        });
    },
    clearCart() {
      const userId = this.$cookies.get("userToken");
      axios.delete(`http://localhost:3000/remove_all_cart/${userId}`)
        .then(response => {
          console.log("Removed from cart successfully:", response.data);
          this.cart = [];
        })
        .catch(error => {
          console.error("Error removing from cart:", error);
        });
    },
    async submitPayment() {
      try {
        const response = await axios.post('http://localhost:3000/api/liqpay', {
          amount: this.amount,
          currency: this.currency,
          description: "Придбання товару",
          order_id: this.cart.id
        });

        this.liqpayForm = response.data;

        this.$nextTick(() => {
          this.$refs.liqpayForm.submit();
        });
      } catch (error) {
        console.error('Payment Error:', error);
      }
    }
  },
  mounted() {
    this.fetchCartData();
  }
};
</script>

<style lang="scss" scoped>
.error-message {
  color: red;
  font-size: 14px;
  font-weight: bold;
}
h1{
  font-weight: bold;
}
.order-summary {
  background-color: #fff;
  margin: auto;
  padding: 20px;
  height: 100vh;
}

.cart-items {
  width: 70%;
  margin-left: 15%;
  margin-bottom: 20px;
}

.cart-item {
  margin-bottom: 10px;
}

.total {
  font-weight: bold;
}

.shipping-address {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>

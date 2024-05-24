<template>
  <div class="orders">
    <table class="order-table">
      <thead>
        <tr>
          <th>Ціна</th>
          <th>Назва товарів</th>
          <th>Данні товару</th>
          <th>Контактні дані</th>
          <th>Статус</th>
          <th>Змінити статус</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in reversedOrders" :key="order.id">
          <td>{{ order.products_price }} грн</td>
          <td>{{ order.products_name }}</td>
          <td>{{ order.order_descr }}</td>
          <td>
            <template v-if="order.user_id && users.find(user => user.id === order.user_id)">
              {{ users.find(user => user.id === order.user_id).login }} - {{ users.find(user => user.id === order.user_id).email }}
            </template>
            <template v-else>
              Немає даних про користувача
            </template>
          </td>
          <td>{{ order.order_status }}</td>
          <td>
            <select v-model="order.order_status" @change="updateOrderStatus(order)">
              <option value="В процесі">В процесі</option>
              <option value="Виконано">Виконано</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['orders', 'users'],
  computed: {
    reversedOrders() {
      return [...this.orders].reverse();
    }
  },
  methods: {
    updateOrderStatus(order) {
      this.$emit('updateOrderStatus', order);
    }
  }
};
</script>

<style lang="scss" scoped>
.orders {
  margin-top: 10px;
}

.order-table {
  width: 95%;
  border-collapse: collapse;
  margin-left: auto;
  margin-right: auto;
}

.order-table th,
.order-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.order-table th {
  background-color: #f2f2f2;
}

.order-table select {
  width: 100%;
  padding: 5px;
  border-radius: 3px;
  border: 1px solid #ccc;
}

.order-table select:focus {
  outline: none;
  border-color: #007bff;
}

@media (max-width: 600px) {
  .order-table thead {
    display: none;
  }

  .order-table tbody tr {
    display: block;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .order-table tbody tr:last-child {
    margin-bottom: 0;
  }

  .order-table tbody td {
    display: block;
    padding: 10px;
  }

  .order-table tbody td:first-child {
    border-top: 1px solid #ddd;
    border-radius: 5px 5px 0 0;
  }

  .order-table tbody td:last-child {
    border-bottom: 1px solid #ddd;
    border-radius: 0 0 5px 5px;
  }

  .order-table tbody td::before {
    content: attr(data-label);
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  .order-table select {
    width: calc(100% - 20px);
    margin: 0 auto;
  }
}

.order-table td[data-label="Ціна"]::before {
  content: "Ціна:";
}

.order-table td[data-label="Назва їжі"]::before {
  content: "Назва їжі:";
}

.order-table td[data-label="Контактні дані"]::before {
  content: "Контактні дані:";
}

.order-table td[data-label="Адреса"]::before {
  content: "Адреса:";
}

.order-table td[data-label="Статус"]::before {
  content: "Статус:";
}

.order-table td[data-label="Змінити статус"]::before {
  content: "Змінити статус:";
}

</style>

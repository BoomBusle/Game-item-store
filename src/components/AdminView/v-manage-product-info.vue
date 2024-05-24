<template>
    <div class="manage-products">
      <form @submit.prevent="addProductInfo" class="product-form">
        <select v-model="newProductInfo.product_id" class="product-select" required>
          <option disabled value="">Виберіть продукт</option>
          <option v-for="product in filteredProducts" :key="product.id" :value="product.id">
            {{ product.name }} - {{ product.body }}
          </option>
        </select>
        <input type="text" v-model="newProductInfo.credentials" placeholder="Дані" required>
        <button type="submit" class="addProductBtn">Додати</button>
      </form>
      <table class="product-table">
        <thead>

        </thead>
        <tbody>
          <tr v-for="info in productInfos" :key="info.id" class="product-item">
            <th>ID :</th>
            <td>{{ info.id }}</td>

            <th>Назва :</th>
            <td>{{ getProductByIdResult(info.product_id).name }}</td>

            <th>Тіло :</th>
            <td>{{ getProductByIdResult(info.product_id).body }}</td>

            <th>Дані :</th>
            <td>{{ info.credentials }}</td>

            <td class="product-actions">
              <button class="editBtn" @click="editProductInfo(info)">Edit</button>
              <button class="deleteBtn" @click="deleteProductInfo(info.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: ['productInfos', 'products'],
    data() {
      return {
        newProductInfo: {
          product_id: '',
          credentials: ''
        },
        productResults: {}
      };
    },
    computed: {
      filteredProducts() {
        return this.products.filter(product => product.body === "Акаунти" || product.body === "Ігри");
      }
    },
    methods: {
      async addProductInfo() {
        try {
          await axios.post('http://localhost:3000/add_product_info', this.newProductInfo);
          this.$emit('refreshProductInfos');
          this.clearInputs();
        } catch (error) {
          console.error('Error adding product info:', error);
        }
      },
      async deleteProductInfo(id) {
        try {
          await axios.delete(`http://localhost:3000/delete_product_info/${id}`);
          this.$emit('refreshProductInfos');
        } catch (error) {
          console.error('Error deleting product info:', error);
        }
      },
      async editProductInfo(info) {
        const newCredentials = prompt('Enter new credentials:', info.credentials);
        if (newCredentials !== null) {
          try {
            await axios.put(`http://localhost:3000/edit_product_info/${info.id}`, {
              product_id: info.product_id,
              credentials: newCredentials
            });
            this.$emit('refreshProductInfos');
          } catch (error) {
            console.error('Error updating product info:', error);
          }
        }
      },
      clearInputs() {
        this.newProductInfo.credentials = '';
      },
      async getProductById(productId) {
        if (!this.productResults[productId]) {
          try {
            const response = await axios.get(`http://localhost:3000/products/${productId}`);
            this.productResults[productId] = response.data[0] || { name: '', body: '' };
          } catch (error) {
            console.error('Error fetching product:', error);
            this.productResults[productId] || { name: '', body: '' };
          }
        }
      },
      getProductByIdResult(productId) {
        this.getProductById(productId);
        return this.productResults[productId] || { name: '', body: '' };
      }
    }
  };
  </script>
  
  <style scoped>
  .addProductBtn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;
    background-color: #4CAF50;
    transition: background-color 0.3s;
  }
  
  .addProductBtn:hover {
    background-color: #45a049;
  }
  
  .manage-products {
    margin-top: 20px;
    margin-left: 3vw;
  }
  
  .manage-products input[type="text"],
  .manage-products button {
    margin: 5px;
  }
  
  .product-list {
    width: 95%;
    list-style-type: none;
    padding: 0;
    padding-left: 2%;
  }

  .product-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 80vw;
    margin-bottom: 10px;
    gap: 1vw;
    padding: 10px;
  }
  
  .product-column {
    flex: 1;
  }
  
  .column-title {
    font-weight: bold;
  }
  
  th {
    font-weight: bold;
  }
  .product-actions button {
    margin-left: 10px;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;
    background-color: #007bff;
    transition: background-color 0.3s;
  }
  
  .product-actions button:hover {
    background-color: #0056b3;
  }
  
  @media (max-width: 600px) {
    .product-item {
      display: flex;
      flex-wrap: wrap;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-bottom: 10px;
      padding: 10px;
      background-color: #f9f9f9;
    }
  
    .product-column {
      width: 100%;
      margin-bottom: 10px;
    }
  
    .column-title {
      font-weight: bold;
    }
  
    .product-actions {
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }
  
    .product-actions button {
      margin-left: 10px;
      padding: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      color: #fff;
      background-color: #007bff;
    }
  
    .product-actions button:hover {
      background-color: #0056b3;
    }
  }
  </style>
  
<template>
  <div class="manage-products">
    <input type="text" v-model="newProductName" placeholder="Назва">
    <input type="text" v-model="newProductPrice" placeholder="Ціна">
    <input type="text" v-model="newProductDescription" placeholder="Опис">
    <select v-model="newProductBody" class="category-select">
      <option disabled value="">Виберіть категорію</option>
      <option v-for="category in categories" :key="category.id" :value="category.name">{{ category.name }}</option>
    </select>
    <input type="text" v-model="newProductPhoto" placeholder="Фото">
    <input type="text" v-model="newProductEnable" placeholder="Enable">
    <button class="addProductBtn" @click="addProduct">Додати товар</button>
    <ul class="product-list">
      <li v-for="(product, index) in products" :key="product.id" class="product-item">
        <div class="product-column">
          <span class="column-title">Назва: </span>
          <span class="column-content">{{ product.name }}</span>
        </div>
        <div class="product-column">
          <span class="column-title">Ціна: </span>
          <span class="column-content">{{ product.price }} грн</span>
        </div>
        <div class="product-column">
          <span class="column-title">Опис: </span>
          <span class="column-content">{{ product.description }}</span>
        </div>
        <div class="product-column">
          <span class="column-title">Тіло: </span>
          <span class="column-content">{{ product.body }}</span>
        </div>
        <div class="product-column">
          <span class="column-title">Фото: </span>
          <span class="column-content">{{ product.photo }}</span>
        </div>
        <div class="product-column">
          <span class="column-title">Enable: </span>
          <span class="column-content">{{ product.enable }}</span>
        </div>
        <div class="product-actions">
          <button class="editBtn" @click="editProduct(product)">Редагувати</button>
          <button class="deleteBtn" @click="deleteProduct(product.id)">Видалити</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['products', 'categories'],        
  data() {
    return {
      newProductName: "",
      newProductPrice: "",
      newProductDescription: "",
      newProductBody: "",
      newProductPhoto: "",
      newProductEnable: "",
    };
  },
  methods: {
    addProduct() {
      if (this.newProductName.trim() !== '' && this.newProductPrice !== "" && this.newProductBody !== "") {
        this.$emit('addProduct', {
          name: this.newProductName,
          price: this.newProductPrice,
          description: this.newProductDescription,
          body: this.newProductBody,
          photo: this.newProductPhoto,
          enable: this.newProductEnable,
        });
        this.clearInputs();
      }
    },
    editProduct(product) {
      const newName = prompt('Введіть нову назву:', product.name);
      const newPrice = prompt('Введіть нову ціну:', product.price);
      const newDescription = prompt('Введіть новий опис:', product.description);
      const newBody = prompt('Введіть нове тіло:', product.body);
      const newPhoto = prompt('Введіть нове фото:', product.photo);
      const newEnable = prompt('Введіть новий статус:', product.enable);
      
      if (newName !== null && newName.trim() !== '') {
        product.name = newName.trim();
      }
      if (newPrice !== null) {
        product.price = newPrice.trim();
      }
      if (newDescription !== null) {
        product.description = newDescription.trim();
      }
      if (newBody !== null) {
        product.body = newBody.trim();
      }
      if (newPhoto !== null) {
        product.photo = newPhoto.trim();
      }
      if (newEnable !== null) {
        product.enable = newEnable.trim();
      }
      this.$emit('editProduct', product);
    },
    deleteProduct(productId) {
      if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
        this.$emit('deleteProduct', productId);
      }
    },
    clearInputs() {
      this.newProductName = "";
      this.newProductPrice = "";
      this.newProductDescription = "";
      this.newProductBody = "";
      this.newProductPhoto = "";
      this.newProductEnable = "";
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : '';
    }
  }
};
</script>

<style scoped>
.addProductBtn {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  color: #fff;
  background-color: #007bff;
}
.addProductBtn:hover {
  background-color: #0056b3;
}
.manage-products {
  margin-top: 20px;
}

.manage-products input,
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
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px;
}

.product-column {
  flex: 1;
}

.column-title {
  font-weight: bold;
}

.product-actions {
  margin-left: auto;
}

.product-actions button {
  margin-left: 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  color: #fff;
  background-color: #007bff;
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
  margin-left: 5px;
  padding: 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  color: #fff;
  background-color: #007bff;
}

.product-actions button:hover {
  background-color: #0056b3;
}
}
</style>
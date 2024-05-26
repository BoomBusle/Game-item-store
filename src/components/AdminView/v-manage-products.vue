<template>
  <div class="manage-products">
    <input type="text" v-model="newProductName" placeholder="Назва" />
    <input type="text" v-model="newProductPrice" placeholder="Ціна" />
    <input type="text" v-model="newProductDescription" placeholder="Опис" />
    <select v-model="newProductBody" class="category-select">
      <option disabled value="">Виберіть категорію</option>
      <option
        v-for="category in categories"
        :key="category.id"
        :value="category.name"
      >
        {{ category.name }}
      </option>
    </select>
    <input type="file" @change="onFileChange" placeholder="Фото" />
    <input type="text" v-model="newProductEnable" placeholder="Enable" />
    <button class="addProductBtn" @click="addProduct">Додати товар</button>
    <ul class="product-list">
      <li
        v-for="(product, index) in products"
        :key="product.id"
        class="product-item"
      >
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
          <span class="column-content"
            ><img
              class="product-img"
              :src="require('@/assets/image/game/' + product.photo)"
              alt="Product Image"
          /></span>
        </div>
        <div class="product-column">
          <span class="column-title">Enable: </span>
          <span class="column-content">{{ product.enable }}</span>
        </div>
        <div class="product-actions">
          <button class="editBtn" @click="openEditProductModal(product)">
            Редагувати
          </button>
          <button class="deleteBtn" @click="deleteProduct(product.id)">
            Видалити
          </button>
        </div>
      </li>
    </ul>

    <div v-if="showEditModal" class="modal-overlay" @click="closeEditProductModal">
      <div class="edit-modal" @click.stop>
        <h2>Редагувати продукт</h2>
        <input type="text" v-model="editProductName" placeholder="Назва" />
        <input type="text" v-model="editProductPrice" placeholder="Ціна" />
        <input type="text" v-model="editProductDescription" placeholder="Опис" />
        <select v-model="editProductBody" class="category-select">
          <option disabled value="">Виберіть категорію</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
        <input type="text" v-model="editProductEnable" placeholder="Enable" />
        <button class="saveProductBtn" @click="saveEditedProduct">
          Зберегти зміни
        </button>
        <button class="cancelBtn" @click="closeEditProductModal">
          Скасувати
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["products", "categories"],
  data() {
    return {
      newProductName: "",
      newProductPrice: "",
      newProductDescription: "",
      newProductBody: "",
      newProductPhoto: "",
      newProductEnable: "",
      selectedFile: null,
      showEditModal: false,
      editProductId: null,
      editProductName: "",
      editProductPrice: "",
      editProductDescription: "",
      editProductBody: "",
      editProductEnable: "",
      editProductPhoto: ""
    };
  },
  methods: {
    onFileChange(e) {
      this.selectedFile = e.target.files[0];
    },
    async addProduct() {
      if (
        this.newProductName.trim() !== "" &&
        this.newProductPrice !== "" &&
        this.newProductBody !== "" &&
        this.selectedFile
      ) {
        const formData = new FormData();
        formData.append("name", this.newProductName);
        formData.append("price", this.newProductPrice);
        formData.append("description", this.newProductDescription);
        formData.append("body", this.newProductBody);
        formData.append("photo", this.selectedFile);
        formData.append("enable", this.newProductEnable);

        await this.$emit("addProduct", formData);
        this.clearInputs();
      }
    },
    openEditProductModal(product) {
      this.showEditModal = true;
      this.editProductId = product.id;
      this.editProductName = product.name;
      this.editProductPrice = product.price;
      this.editProductDescription = product.description;
      this.editProductBody = product.body;
      this.editProductEnable = product.enable;
      this.editProductPhoto = product.photo;
    },
    async saveEditedProduct() {
  const product = {
    id: this.editProductId,
    name: this.editProductName,
    price: this.editProductPrice,
    description: this.editProductDescription,
    body: this.editProductBody,
    enable: this.editProductEnable,
  };

  await this.$emit("editProduct", product);
  this.closeEditProductModal();
},




    closeEditProductModal() {
      this.showEditModal = false;
      this.editProductId = null;
      this.editProductName = "";
      this.editProductPrice = "";
      this.editProductDescription = "";
      this.editProductBody = "";
      this.editProductEnable = "";
      this.editProductPhoto = "";
      this.selectedFile = null;
    },
    async deleteProduct(productId) {
      if (confirm("Ви впевнені, що хочете видалити цей товар?")) {
        await this.$emit("deleteProduct", productId);
      }
    },
    clearInputs() {
      this.newProductName = "";
      this.newProductPrice = "";
      this.newProductDescription = "";
      this.newProductBody = "";
      this.newProductPhoto = "";
      this.newProductEnable = "";
      this.selectedFile = null;
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
.product-img {
  width: 5vw;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.edit-modal {
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  position: relative;
}

.saveProductBtn,
.cancelBtn {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  color: #fff;
  background-color: #007bff;
  margin: 5px;
}

.saveProductBtn:hover,
.cancelBtn:hover {
  background-color: #0056b3;
}
</style>

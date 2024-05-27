<template>
  <div>
    <div class="v-main-wrapper">
      <div class="filter-wrapper">
        <label for="name">Назва:</label>
        <input
          type="text"
          id="name"
          v-model.trim="selectedName"
          @change="applyFilters"
          placeholder="Назва товару"
        />
        <div class="separator"></div>
        <label for="category">Категорія:</label>
        <select id="category" v-model="selectedCategory" @change="applyFilters">
          <option value="">Усі категорії</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
        <div class="separator"></div>
        <label for="price">Ціна:</label>
        <div class="slider">
          <vue-slider
            v-model="priceRange"
            :min="minPrice"
            :max="maxPrice"
            @change="applyFilters"
          ></vue-slider>
        </div>
        <div class="separator"></div>
        <button
          class="filter-button"
          @click="applyFilters"
          @mouseover="isHovered = true"
          @mouseleave="isHovered = false"
          @mousedown="isPressed = true"
          @mouseup="isPressed = false"
        >
          Прийняти фільтри
        </button>
      </div>
      <div class="v-second-wrapper">
        <div>
          <div class="v-card-wrapper">
            <VCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VCard from "@/components/CatalogView/v-card.vue";
import axios from "axios";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

export default {
  components: {
    VCard,
    VueSlider
  },
  data() {
    return {
      products: [],
      categories: [],
      selectedName: "",
      selectedCategory: "",
      minPrice: 0,
      maxPrice: 0,
      priceRange: [0, 0]
    };
  },
  created() {
    this.fetchProducts();
    this.fetchCategories();
  },
  methods: {
    fetchProducts() {
      axios
        .get("http://localhost:3000/products_card")
        .then((response) => {
          this.products = response.data;
          this.setPriceRange();
        })
        .catch((error) => console.error("Error fetching products:", error));
    },
    fetchCategories() {
      axios
        .get("http://localhost:3000/categories")
        .then((response) => {
          this.categories = response.data;
        })
        .catch((error) => console.error("Error fetching categories:", error));
    },
    filterProducts() {
      let filteredProducts = this.products;

      if (this.selectedName !== "") {
        filteredProducts = filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(this.selectedName.toLowerCase())
        );
      }

      if (this.selectedCategory !== "") {
        filteredProducts = filteredProducts.filter((product) =>
          product.body
            .toLowerCase()
            .includes(this.selectedCategory.toLowerCase())
        );
      }

      filteredProducts = filteredProducts.filter(
        (product) =>
          product.price >= this.priceRange[0] &&
          product.price <= this.priceRange[1]
      );

      return filteredProducts;
    },
    applyFilters() {
      this.filteredProducts = this.filterProducts();
    },
    setPriceRange() {
      const prices = this.products.map((product) => product.price);
      this.minPrice = Math.min(...prices);
      this.maxPrice = Math.max(...prices);
      this.priceRange = [this.minPrice, this.maxPrice];
    }
  },
  computed: {
    filteredProducts() {
      return this.filterProducts();
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-wrapper {
  display: flex;
  margin: 2vw 0vw 2vw 2vw;
  padding: 2vw;
  border-radius: 10px;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  background: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f1f1f1;
  }
  
  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  input,
  select {
    width: 100%;
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;
    
    &:focus {
      border-color: #4caf50;
      outline: none;
    }
  }
  
  .separator {
    width: 100%;
    height: 1px;
    background-color: #ddd;
    margin: 1rem 0;
  }
  
  .slider {
    width: 100%;
  }
  
  .filter-button {
    background-color: #4caf50;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.1s ease;
    
    &:hover {
      background-color: #45a049;
    }
    
    &:active {
      background-color: #388e3c;
      transform: scale(0.98);
    }
  }
}

.v-main-wrapper {
  padding: 1%;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-direction: row;
  gap: 5vw;
  background-color: #fff;
  min-height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
}

.v-second-wrapper {
  width: 75vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2vw;
  margin-left: -10vw;
}

.v-card-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 5vw;
  justify-content: center;
  width: 75vw;
}
</style>

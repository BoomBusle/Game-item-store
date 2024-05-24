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
          product.body.toLowerCase().includes(this.selectedCategory.toLowerCase())
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
  margin-left: 2vw;
  margin-top: 2vw;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 2vw;
  border-radius: 10px;
  gap: 10px;
  .separator {
    width: 100%;
    height: 2px;
    background-color: gray;
  }
  -webkit-box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.75);
  label {
    font-weight: bold;
    margin-right: 7vw;
  }
  .slider {
    width: 10vw;
    @media (max-width: 768px) {
      width: 30vw;

  }
  }
  .filter-button {
    background-color: transparent;
    border: 1px solid #ffc400;
    color: #ffc400;
    padding: 10px 20px;
    border-radius: 10px;
    transition: background-color 0.3s, color 0.3s;
    cursor: pointer;
    font-weight: bold;
  }

  .filter-button:hover {
    background-color: #ffc400;
    color: white;
  }

  .filter-button:active {
    background-color: #e0a800;
  }
}
.v-main-wrapper {
  padding-bottom: 5%;
  background-color: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  gap: 5vw;
  height: auto;
  min-height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
}
.v-second-wrapper {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-direction: column;
  width: 75vw;
  max-width: 100%;
  margin-top: 2vw;
  h2 {
    text-align: start;
    margin-bottom: 1vw;
    margin-top: 1vw;
    font-weight: bold;
  }
}
.v-card-wrapper {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 75vw;
  width: 100%;
  gap: 5vw;
  @media (max-width: 768px) {
justify-content: center;
  }
}
</style>

<template>
  <div>
    <button
      v-for="category in categories"
      :key="category.id"
      @click="selectCategory(category.id)"
      :class="{ active: selectedCategory === category.id }"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedCategory: null
    };
  },
  methods: {
    selectCategory(categoryId) {
      const element = document.getElementById("category" + categoryId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }
};
</script>

<style scoped>
button {
  -webkit-box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  background-color: #000;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  transition: all 200ms ease-in-out;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
button.active {
  background-color: #444444;
}
</style>

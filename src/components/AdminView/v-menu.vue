<template>
    <div class="menu">
      <ul>
        <li @click="selectFunction('analytics')">Аналітика</li>
        <li @click="selectFunction('orders')">Замовлення</li>
        <li @click="selectFunction('manageCategories')">Менеджер Категорій</li>
        <li @click="selectFunction('manageProducts')">Менеджер Продуктів</li>
        <li @click="selectFunction('manageProductInfo')">Менеджер Акаунтів та Ключів</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      selectFunction(selectedFunction) {
        this.$emit('selectFunction', selectedFunction);
      }
    }
  };
  </script>
  
  <style scoped>
  .menu {
    width: 200px;
  }
  
  .menu ul {
    list-style-type: none;
    padding: 0;
  }
  
  .menu li {
    cursor: pointer;
    padding: 10px;
    background-color: #f0f0f0;
    margin-bottom: 5px;
  }
  
  .menu li:hover {
    background-color: #e0e0e0;
  }
  </style>
  
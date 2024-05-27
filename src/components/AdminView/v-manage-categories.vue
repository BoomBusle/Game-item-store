<template>
  <div class="manage-categories">
    <div class="add-category-wrapper">
      <input type="text" v-model="newCategoryName" placeholder="Назва категорії">
    <button @click="addCategory">Додати категорію</button>
    </div>
    <table class="category-table">
      <thead>
        <tr>
          <th>Назва категорії</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="category.id">
          <td>{{ category.name }}</td>
          <td>
            <button @click="editCategory(category)">Редагувати</button>
            <button @click="deleteCategory(category.id)">Видалити</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: ['categories'],
  data() {
    return {
      newCategoryName: ''
    };
  },
  methods: {
    addCategory() {
      if (this.newCategoryName.trim() !== '') {
        this.$emit('addCategory', this.newCategoryName.trim());
        this.newCategoryName = '';
      }
    },
    editCategory(category) {
      const newName = prompt('Введіть нову назву для категорії:', category.name);
      if (newName !== null && newName.trim() !== '') {
        category.name = newName.trim();
        this.$emit('editCategory', category);
      }
    },
    deleteCategory(categoryId) {
      if (confirm('Ви впевнені, що хочете видалити цю категорію?')) {
        this.$emit('deleteCategory', categoryId);
      }
    }
  }
};
</script>
<style scoped>
.add-category-wrapper{
  display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-bottom: 1vw;

  input,
  select {
    display: flex;
      align-items: center;
      justify-content: center;
    width: 30%;
    padding: 0.5rem;
    border-radius: 5px;
    margin-right: 1vw;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;
    
    &:focus {
      border-color: #4caf50;
      outline: none;
    }
    @media (max-width: 600px) {
      width: 60%;
    }
  }
  @media (max-width: 600px) {
      flex-direction: column;
    }
}
.manage-categories {
  margin-top: 20px;
}

.manage-categories input,
.manage-categories button {
  margin: 5px;
}

.category-table {
  width: 95%;
  border-collapse: collapse;
  margin-top: 10px;
  margin-left: 2%;
}

.category-table th,
.category-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.category-table th {
  background-color: #f2f2f2;
}

.manage-categories button {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
}


.manage-categories button:hover {
  background-color: #0056b3;
}

</style>

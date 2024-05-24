<template>
  <div class="manage-categories">
    <input type="text" v-model="newCategoryName" placeholder="Назва категорії">
    <button @click="addCategory">Додати категорію</button>

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

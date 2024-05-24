<template>
  <div class="admin-panel">
    <VMenu @selectFunction="selectFunction" />
    <div class="admin-content">
      <VAnalytics v-if="selectedFunction === 'analytics'" :orders="orders" :registeredUsers="registeredUsers" />
      <VOrders v-if="selectedFunction === 'orders'" :orders="orders" :users="users" @updateOrderStatus="updateOrderStatus" />
      <VManageCategories v-if="selectedFunction === 'manageCategories'" :categories="categories" @addCategory="addCategory" @deleteCategory="deleteCategory" @editCategory="editCategory" />
      <VManageProducts v-if="selectedFunction === 'manageProducts'" :products="products" :categories="categories" @addProduct="addProduct" @editProduct="editProduct" @deleteProduct="deleteProduct" />
      <VManageProductInfo v-if="selectedFunction === 'manageProductInfo'" :productInfos="productInfos" :products="products" @refreshProductInfos="fetchProductInfos" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VMenu from "@/components/AdminView/v-menu.vue";
import VAnalytics from "@/components/AdminView/v-analytics.vue";
import VOrders from "@/components/AdminView/v-order.vue";
import VManageCategories from "@/components/AdminView/v-manage-categories.vue";
import VManageProducts from "@/components/AdminView/v-manage-products.vue";
import VManageProductInfo from "@/components/AdminView/v-manage-product-info.vue";

export default {
  components: {
    VMenu,
    VAnalytics,
    VOrders,
    VManageCategories,
    VManageProducts,
    VManageProductInfo
  },
  data() {
    return {
      categories: [],
      orders: [],
      products: [],
      productInfos: [],
      users: [],
      registeredUsers: 0,
      selectedFunction: "income"
    };
  },
  methods: {
    async fetchRegisteredUsers() {
      try {
        const response = await axios.get("http://localhost:3000/users");
        this.registeredUsers = response.data.length; 
      } catch (error) {
        console.error("Error fetching registered users:", error);
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3000/users");
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async fetchOrders() {
      try {
        const response = await axios.get("http://localhost:3000/orders");
        this.orders = response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:3000/products");
        this.products = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    async fetchProductInfos() {
      try {
        const response = await axios.get("http://localhost:3000/product_info");
        this.productInfos = response.data;
      } catch (error) {
        console.error("Error fetching product infos:", error);
      }
    },
    async addCategory(name) {
      try {
        await axios.post("http://localhost:3000/add_category", { name });
        this.fetchCategories();
      } catch (error) {
        console.error("Error adding category:", error);
      }
    },
    async addProduct(productData) {
      try {
        await axios.post("http://localhost:3000/add_product", productData);
        this.fetchProducts(); 
      } catch (error) {
        console.error("Error adding product:", error);
      }
    },
    async editProduct(product) {
      try {
        await axios.put(`http://localhost:3000/edit_product/${product.id}`, product);
        console.log('Product updated successfully');
        this.fetchProducts();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    },
    async deleteProduct(productId) {
      try {
        await axios.delete(`http://localhost:3000/delete_product/${productId}`);
        console.log('Product deleted successfully');
        this.fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    },
    async updateOrderStatus(order) {
      try {
        const response = await axios.put(`http://localhost:3000/update_order_status/${order.id}`, {
          order_status: order.order_status
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    },
    selectFunction(selectedFunction) {
      this.selectedFunction = selectedFunction;
    },
    async deleteCategory(categoryId) {
      try {
        await axios.delete(`http://localhost:3000/delete_category/${categoryId}`);
        console.log('Category deleted successfully');
        this.fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    },
    async editCategory(category) {
      try {
        await axios.put(`http://localhost:3000/edit_category/${category.id}`, { name: category.name });
        console.log('Category updated successfully');
        this.fetchCategories();
      } catch (error) {
        console.error('Error updating category:', error);
      }
    }
  },
  mounted() {
    this.fetchCategories();
    this.fetchOrders();
    this.fetchProducts(); 
    this.fetchUsers();
    this.fetchProductInfos();
    this.fetchRegisteredUsers();
    if (this.$cookies.get('username') !== 'Admin') {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.admin-panel {
  background-color: #fff;
  display: flex;
  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.admin-content {
  flex: 1;
}
</style>

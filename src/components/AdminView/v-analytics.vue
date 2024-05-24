<template>
  <div>
    <Bar
      :style="myStyles"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
    <div class="statistics-wrapper">
      <div class="statistics">
        <h3>Загальний заробіток</h3>
        <h2>{{ totalEarnings }} грн</h2>
      </div>
      <div class="statistics">
        <h3>Кількість замовлень</h3>
        <h2>{{ totalOrders }}</h2>
      </div>
      <div class="statistics">
        <h3>Зареєстрованих користувачів</h3>
        <h2>{{ registeredUsers }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";
import axios from "axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: { Bar },
  props: {
    orders: {
      type: Array,
      required: true
    },
    registeredUsers: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      chartData: {
        labels: [
          "Понеділок",
          "Вівторок",
          "Середа",
          "Четвер",
          "П’ятниця",
          "Субота",
          "Неділя"
        ],
        datasets: [
          {
            label: "Грн",
            backgroundColor: "#ffc400",
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true
      }
    };
  },
  computed: {
    myStyles() {
      return {
        height: `${window.innerHeight * 0.4}px`,
        width: `${window.innerWidth * 0.8}px`
      };
    },
    totalEarnings() {
      return this.orders.reduce(
        (total, order) => total + order.products_price,
        0
      );
    },
    totalOrders() {
      return this.orders.length;
    }
  },
  watch: {
    orders: {
      handler: "updateChartData",
      immediate: true
    },
    "$window.innerWidth": "updateStyles",
    "$window.innerHeight": "updateStyles"
  },
  methods: {
    updateChartData() {
      const ordersByDay = this.aggregateOrdersByDay();
      this.chartData.datasets[0].data = Object.values(ordersByDay);
    },
    aggregateOrdersByDay() {
      const ordersByDay = {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0
      };

      if (Array.isArray(this.orders)) {
        this.orders.forEach((order) => {
          const orderDate = new Date(order.created_at);
          const dayOfWeek = this.getDayOfWeek(orderDate);

          ordersByDay[dayOfWeek] += order.products_price;
        });
      }

      return ordersByDay;
    },
    getDayOfWeek(date) {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      return daysOfWeek[date.getDay()];
    },
    updateStyles() {
      this.$forceUpdate();
    }
  },
  mounted() {
    window.addEventListener("resize", this.updateStyles);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateStyles);
  }
};
</script>

<style lang="scss" scoped>
@media (max-width: 600px) {
  .chart {
    width: 70% !important;
    height: auto !important;
  }
}
.statistics-wrapper {
  margin-top: 4vh;
  margin-bottom: 3vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  gap: 5vw;
  @media (max-width: 600px) {
    flex-direction: column;
  }
}
.statistics {
  display: flex;
  align-items: center;
  gap: 1vw;
  justify-content: center;
  flex-direction: column;
  padding: 2vw;
  text-align: center;
  border-radius: 10px;
  background-color: #e2e2e2;
  -webkit-box-shadow: -10px 10px 0px 0px rgba(110, 110, 110, 0.7);
  -moz-box-shadow: -10px 10px 0px 0px rgba(110, 110, 110, 0.7);
  box-shadow: -10px 10px 0px 0px rgba(110, 110, 110, 0.7);
  width: 20vw;
  height: 10vh;
  @media (max-width: 600px) {
    width: 60vw;
    height: 20vh;
  }
  h3 {
    font-weight: bold;
    font-size: 30px;
  }
  h2 {
    font-size: 40px;
  }
}
</style>

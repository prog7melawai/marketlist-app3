<template>
  <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
  <sidebar-vue @swidth="setWidth"></sidebar-vue>

  <div class="container">
    <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
    <div :style="{ width: contentWidth }" class="content-body">
      <div class="content-wrapper">
        <div class="content-title">
          <h2>Receive {{ this.$route.params.no_karcis }}</h2>
          <span>
            {{ selectedReceive.tgl_karcis }}, {{ selectedReceive.no_sj }},
            {{ selectedReceive.kd_purch }}, {{ selectedReceive.user_lengkap }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Loader from "@/components/Loader.vue";
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
// import AlertConfirm from "@/components/AlertConfirm.vue";
import axios from "axios";
export default {
  name: "ReceivingDetailVue",
  components: {
    NavbarVue,
    SidebarVue,
    // Loader,
    // AlertConfirm,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      selectedReceive: {},
      authToken: null,
    };
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    if (!this.permission.includes("contract")) window.location.href = "/";
    this.isCreate = this.permission.includes("create-contract");
  },
  mounted() {
    this.getReceive();
  },
  methods: {
    async getReceive() {
      try {
        // const response = await axios.get(
        //   "http://172.30.14.208:9342/procurement/web/receiving/UV3aTZlbJAWZVASo3epau3BBr53nYhgLVlP33ircZg8xlPKpmrnCnB4Cs5NGiH8lm3dPlatRlD4bRwgiBHqmxGOnLUQTAWYy38d2"
        // );
        this.isLoading = true;
        const { data } = await axios.get(
          `http://172.30.14.208:9642/procurement/web/receiving/${this.$route.params.no_karcis}/${this.authToken}`
        );
        this.selectedReceive = data;
        console.log(this.selectedReceive);
      } catch (error) {
        console.error("Error fetching receive orders:", error);
      }
    },
  },
};
</script>

<!-- <script setup>
import { defineProps } from "vue";

const props = defineProps({
  purchaseOrders: [
    {
      type: Object,
      required: true,
    },
  ],
});
</script> -->

<template>
  <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
  <sidebar-vue @swidth="setWidth"></sidebar-vue>

  <div class="container">
    <div :style="{ width: sidebarWidth }" class="content-spacer"></div>

    <div :style="{ width: contentWidth }" class="content-body">
      <div class="content-wrapper">
        <div class="content-title">
          <h2>Details of {{ this.$route.params.no_karcis }}</h2>
          <span>
            Tanggal Karcis: {{ selectedReceive.tgl_karcis }}<br />
            No Surat Jalan:

            {{ selectedReceive.no_sj }}<br />
            Tanggal Surat Jalan: {{ selectedReceive.tgl_sj }}
          </span>
        </div>
        <!-- export file btn kanan atas -->

        <!-- content -->
        <div class="content">
          <loader v-if="isLoading"></loader>
          <div v-if="!isLoading" style="width: 100%; margin-top: 20px">
            <div class="po-header">
              <div class="po-logo">
                <img
                  src="/images/logo/movenpick.png"
                  :alt="selectedReceive.logo"
                  style="width: 100%; height: 100%; object-fit: contain" />
              </div>

              <span
                class="stamp-container"
                v-if="selectedReceive.statusacc == 'APPROVED'">
                <img
                  class="stamp-logo"
                  src="/images/logo/approved.png"
                  alt="" />
              </span>
              <span
                class="stamp-container"
                v-else-if="selectedReceive.statusacc == 'REJECTED'">
                <img
                  class="stamp-logo"
                  src="/images/logo/declined.png"
                  alt="" />
              </span>

              <!-- user view siapa -->
              <div style="width: 78%; display: flex; flex-direction: column">
                <span class="pr-supplier">{{ selectedReceive.dept_kd }}</span>
                <span class="pr-contact">{{ selectedReceive.subdiv_kd }}</span>
                <span class="pr-address">{{ selectedReceive.divisi_kd }} </span>

                <span class="pr-deliver">User Created:</span>
                <span class="pr-company">
                  <img
                    src="/images/user/user.png"
                    alt="logo"
                    style="width: 25px" />
                  <span class="pr-department">{{
                    selectedReceive.user_lengkap
                  }}</span>
                </span>
              </div>
            </div>
            <table class="table-responsive" aria-describedby="PR-items Data">
              <thead class="bg-dark">
                <tr>
                  <th style="width: 15%">No PO</th>
                  <th style="width: 15%">Kode Barang</th>
                  <th style="width: 25%">Nama Barang</th>
                  <th style="width: 12.5%">Qty</th>
                  <th style="width: 12.5%">Qty Bonus</th>
                  <th style="width: 20%">Satuan</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(po, idx) in purchaseOrders.items"
                  :key="po.no_po"
                  :class="{ 'bg-canvas': idx % 2 == 0 }">
                  <td>{{ po.no_po }}</td>
                  <td>{{ po.kd_barang }}</td>
                  <td>{{ po.nm_barang }}</td>
                  <td>{{ po.qty }}</td>
                  <td>{{ po.qty_bonus }}</td>
                  <td>{{ po.nmstn }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";

import axios from "axios";
import Loader from "@/components/Loader.vue";

export default {
  name: "ReceivingDetailVue",
  components: {
    NavbarVue,
    SidebarVue,
    Loader,
  },
  data() {
    return {
      purchaseOrders: {},
      sidebarWidth: "18%",
      contentWidth: "78%",
      selectedReceive: {},
      authToken: null,
      isLoading: false,
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
    this.fetchPurchaseOrders();
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    //jenis pr untuk table
    async fetchPurchaseOrders() {
      this.isLoading = true;
      const groupSize = this.perpage;
      const newPO = [];
      try {
        const { data } = await axios.get(
          `/receiving/${this.$route.params.no_karcis}/${this.authToken}`
        );

        this.purchaseOrders = data;

        this.prs = [];
        this.total_page = [];

        let j = 1;
        this.purchaseOrders.items.forEach((data) => {
          data.no = j;
          newPO.push(data);
          j++;
        });

        this.pagelength = this.purchaseOrders.length;
        for (let i = 0; i < newPO.length; i += groupSize) {
          this.prs.push(newPO.slice(i, i + groupSize));
        }

        for (let i = 0; i < this.prs.length; i++) {
          this.total_page?.push(i);
        }
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
      }
    },
    async postPurchaseOrders(purchaseOrders) {
      // Post the fetched data to another endpoint
      axios
        .post(
          `/receiving/${this.$route.params.no_karcis}/${this.authToken}`,
          purchaseOrders
        )
        .then((response) => {
          console.log("Data posted successfully:", response.data);
          // Handle response if needed
        })
        .catch((error) => {
          console.error("Error posting data:", error);
          // Handle error if needed
        });
    },
    // get receive api untuk data detail
    async getReceive() {
      try {
        this.isLoading = true;
        const { data } = await axios.get(
          `/receiving/${this.$route.params.no_karcis}/${this.authToken}`
        );
        this.selectedReceive = data;
        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching receive orders:", error);
      }
    },
    confirmReceive() {
      const body = {
        no_karcis: this.selectedReceive.no_karcis,
      };

      this.title = "Confirmation";
      this.deleteMessage = `Are you sure want to Approve this Transaction ?`;
      this.methods = "put";
      this.url = `/contractsupplier/${this.authToken}`;
      this.sheaders = null;
      this.item = body;
      this.showAlert = true;
    },
  },
};
</script>

<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-summary">
          <router-link
            :to="{ name: 'pr' }"
            class="summary-box"
            style="text-decoration: none">
            <img
              src="/images/icons/document.svg"
              alt="documentlogo"
              style="width: 70px; margin-left: 10px" />

            <div
              style="display: flex; flex-direction: column; margin-left: 10px">
              <span class="event-title">Purchase Requisition</span>
              <span
                style="
                  font-size: 20pt;
                  font-family: 'Lexed', sans-serif;
                  font-weight: bold;
                  color: var(--orange);
                ">
                <span id="countPR"></span>
              </span>
            </div>
          </router-link>

          <router-link
            :to="{ name: 'approved-pr' }"
            class="summary-box"
            style="text-decoration: none">
            <img
              src="/images/icons/event.svg"
              alt="eventlogo"
              style="width: 70px; margin-left: 10px" />

            <div
              style="display: flex; flex-direction: column; margin-left: 10px">
              <span class="event-title">Purchase Order</span>
              <span
                style="
                  font-size: 20pt;
                  font-family: 'Lexed', sans-serif;
                  font-weight: bold;
                  color: var(--orange);
                ">
                <span id="countPO"></span>
              </span>
            </div>
          </router-link>

          <a class="summary-box" style="text-decoration: none">
            <img
              src="/images/icons/mail-open.svg"
              alt="maillogo"
              style="width: 70px; margin-left: 10px" />

            <div
              style="display: flex; flex-direction: column; margin-left: 10px">
              <span class="event-title">Receiving</span>
              <span
                style="
                  font-size: 20pt;
                  font-family: 'Lexed', sans-serif;
                  font-weight: bold;
                  color: var(--orange);
                ">
                <span id="countReceive"></span>
              </span>
            </div>
          </a>
        </div>

        <div class="content-wrapper">
          <div class="content-title">
            <h2>Contract that will end soon</h2>
          </div>

          <br />
          <div
            class="content"
            v-for="item in contract"
            :key="item.no_kontrak"
            style="margin-top: 5px; margin-bottom: 0px">
            <a
              :href="`/contract-detail/${item.no_kontrak}`"
              class="warning-contract">
              <div class="warning-content">
                <span style="font-weight: 800">
                  Contract {{ item.no_kontrak }} will end at
                  {{ new Date(item.end_kontrak_date).getDate() }}
                  {{ getMonth(new Date(item.end_kontrak_date).getMonth()) }}
                  {{ new Date(item.end_kontrak_date).getFullYear() }}
                </span>
                <span style="font-size: 10pt">
                  {{ item.nm_supplier }}
                </span>
              </div>
            </a>
          </div>
          <div style="height: 30px"></div>
        </div>
      </div>
    </div>
  </div>

  <notification-contract
    v-if="contractNotif && notifikasiContract"
    :items="contract"
    @onClosed="onClosedContract">
  </notification-contract>

  <loading v-if="isLoading"></loading>
</template>

<script>
import NotificationContract from "@/components/NotificationContract.vue";
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import Loading from "@/components/Loading.vue";
import axios from "axios";

export default {
  name: "HomeView",
  components: {
    SidebarVue,
    NavbarVue,
    Loading,
    NotificationContract,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      filelist: [],
      selectedfile: null,
      contract: null,
      authToken: null,
      showAlertContract: false,
      contractNotif: false,
      countNotif: 0,
      isLoading: false,
      summary: null,
      perm: null,
      permission: null,
      notifikasiContract: null,
    };
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.contractNotif = this.$store.getters.GET_CONTRACT_NOTIF.is_open;
    this.countNotif = this.$store.getters.GET_CONTRACT_NOTIF.count;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    this.notifikasiContract = this.permission.includes("notifikasi-contract");
    if (this.notifikasiContract) {
      this.getContract();
    }
  },
  mounted() {
    this.sidebarWidth = this.$store.getters.GET_SIDEBAR_WIDTH.sidebarwidth;
    this.getSummary();
  },
  methods: {
    async getSummary() {
      try {
        const { data } = await axios.get(`/result/${this.authToken}`);
        this.summary = data;

        document.getElementById("countPO").innerText = this.summary.po;
        document.getElementById("countPR").innerText = this.summary.pr;
        document.getElementById("countReceive").innerText =
          this.summary.receive;
      } catch (error) {
        this.$toast.open({
          message: error.response.data.message,
          type: "error",
          duration: 1000,
          dismissible: true,
        });
      }
    },
    async getContract() {
      try {
        this.isLoading = true;
        const { data } = await axios.get(
          `/notifikasikontrak/${this.authToken}`
        );
        this.contract = data;
        if (this.countNotif <= 0 && this.contract.length > 0) {
          this.$store.commit("SET_CONTRACT_NOTIF", { is_open: true, count: 1 });
          this.contractNotif = this.$store.getters.GET_CONTRACT_NOTIF.is_open;
          this.countNotif = this.$store.getters.GET_CONTRACT_NOTIF.count;
        }

        this.isLoading = false;
      } catch (error) {
        if (error.response.status == 401) {
          this.$toast.open({
            message: "Invalid Credentials!",
            type: "error",
            duration: 1000,
          });
          this.$store
            .dispatch("LOGOUT")
            .then(() => {
              this.$router.push({ name: "login" });
            })
            .catch(() => {
              this.$router.push({ name: "login" });
            });
        }
      }
    },
    onClosedContract(value) {
      this.$store.commit("SET_CONTRACT_NOTIF", { is_open: value, count: 1 });
      this.contractNotif = this.$store.getters.GET_CONTRACT_NOTIF.is_open;
    },
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    dragover(event) {
      event.preventDefault();
      if (!event.currentTarget.classList.contains("bg-orange")) {
        event.currentTarget.classList.remove("bg-canvas");
        event.currentTarget.classList.add("bg-orange");
      }
    },
    dragleave(event) {
      event.currentTarget.classList.add("bg-canvas");
      event.currentTarget.classList.remove("bg-orange");
    },
    drop(event) {
      event.preventDefault();
      const fileArray = event.dataTransfer.files;
      for (let file of fileArray) {
        if (
          file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          alert("Invalid file input: " + file.name + "!");
        } else {
          this.filelist.push(file);
        }
      }

      this.selectedfile = this.filelist[0].name;
      console.log(this.filelist);
    },
    onChange() {
      this.filelist = [...this.$refs.file.files];
      this.selectedfile = this.filelist[0].name;
      document.getElementById("drop-box").classList.add("bg-orange");
    },
    removeFile() {
      this.filelist = [];
      this.selectedfile = null;
      document.getElementById("drop-box").classList.remove("bg-orange");
      document.getElementById("drop-box").classList.add("bg-canvas");
    },
    getMonth(gmonth) {
      let month;
      switch (gmonth) {
        case 0:
          month = "January";
          break;
        case 1:
          month = "February";
          break;
        case 2:
          month = "March";
          break;
        case 3:
          month = "April";
          break;
        case 4:
          month = "May";
          break;
        case 5:
          month = "June";
          break;
        case 6:
          month = "July";
          break;
        case 7:
          month = "August";
          break;
        case 8:
          month = "September";
          break;
        case 9:
          month = "October";
          break;
        case 10:
          month = "November";
          break;
        case 11:
          month = "December";
      }

      return month;
    },
  },
};
</script>

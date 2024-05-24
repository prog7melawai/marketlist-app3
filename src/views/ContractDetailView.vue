<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title pl-30">
            <i
              @click="$router.back()"
              class="ri-arrow-left-circle-fill"
              back-btn></i>
            <h2>
              Contract {{ this.$route.params.id }} -
              {{ selectedContract.sup_nm }}
            </h2>
            <span
              >{{
                getMonth(new Date(selectedContract.kontrak_date).getMonth())
              }},
              {{ new Date(selectedContract.kontrak_date).getDate() }}
              {{ new Date(selectedContract.kontrak_date).getFullYear() }}
            </span>
          </div>

          <div class="confirm-wrapper" v-if="selectedContract.kontrakno">
            <!-- <button class="export-btn">
              <i class="ri-file-pdf-2-fill" style="font-size: 18pt"></i>
            </button> -->

            <button
              class="btn-success"
              @click="confirmContract"
              v-if="
                isApproval &&
                !selectedContract.tglconf &&
                !selectedContract.tglbatal
              ">
              <i class="ri-check-line" style="font-size: 14pt"></i>
              <span style="position: relative; top: -2px"> Approve </span>
            </button>

            <button
              class="btn-danger"
              @click="declineContract"
              v-if="
                isDecliner &&
                !selectedContract.tglbatal &&
                !selectedContract.tglconf
              ">
              <i class="ri-check-line" style="font-size: 14pt"></i>
              <span style="position: relative; top: -2px"> Decline </span>
            </button>
          </div>

          <div class="content">
            <loader v-if="isLoading"></loader>
            <div v-if="!isLoading" style="width: 100%; margin-top: 20px">
              <div class="po-header">
                <div class="po-logo">
                  <img
                    src="/images/logo/movenpick.png"
                    :alt="selectedContract.logo"
                    style="width: 100%; height: 100%; object-fit: contain" />
                </div>

                <span class="stamp-container" v-if="selectedContract.tglconf">
                  <img
                    class="stamp-logo"
                    src="/images/logo/approved.png"
                    alt="" />
                </span>

                <span class="stamp-container" v-if="selectedContract.tglbatal">
                  <img
                    class="stamp-logo"
                    src="/images/logo/declined.png"
                    alt="" />
                </span>

                <div style="width: 78%; display: flex; flex-direction: column">
                  <span class="pr-supplier">{{
                    selectedContract.dept_kd
                  }}</span>
                  <span class="pr-contact">{{
                    selectedContract.subdiv_kd
                  }}</span>
                  <span class="pr-address">{{ selectedContract.div_kd }}</span>

                  <span class="pr-deliver">User Created:</span>
                  <span class="pr-company">
                    <img
                      src="/images/user/user.png"
                      alt="logo"
                      style="width: 25px" />
                    <span class="pr-department">{{
                      selectedContract.cruser
                    }}</span>
                  </span>
                </div>
              </div>

              <table class="table-responsive" aria-describedby="PR Items Data">
                <thead class="bg-dark">
                  <tr>
                    <th style="width: 5%">No</th>
                    <th style="width: 10%">Product ID</th>
                    <th style="width: 30%; text-align: left">Product Name</th>
                    <th style="width: 10%">Satuan</th>
                    <th style="width: 15%">Harga</th>
                    <th style="width: 15%">Disc</th>
                    <th style="width: 15%">Ppn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(pr, idx) in prs[selectedPage]"
                    :key="pr.kode_barang"
                    :class="{ 'bg-canvas': idx % 2 == 0 }"
                    style="height: 60px">
                    <td>{{ pr.no }}</td>
                    <td>{{ pr.kdbar }}</td>
                    <td style="text-align: left">{{ pr.nm_bar }}</td>
                    <td style="text-align: start">{{ pr.nm_satuan }}</td>
                    <td>Rp. {{ formatPrice(pr.harga) }}</td>
                    <td>Rp. {{ formatPrice(pr.disc_rp) }}</td>
                    <td>Rp. {{ formatPrice(pr.ppn_rp) }}</td>
                  </tr>
                </tbody>
              </table>

              <div class="page-wrapper" v-if="total_page.length > 0">
                <div style="width: 50%">
                  <span style="font-size: 10pt">
                    Showing {{ prs[selectedPage][0].no }} to
                    {{ prs[selectedPage][prs[selectedPage].length - 1].no }} of
                    {{ pagelength }} entries.
                  </span>
                </div>
                <div
                  style="
                    width: 50%;
                    display: flex;
                    flex-direction: row;
                    justify-content: end;
                  ">
                  <button
                    class="page-prev"
                    @click="prevPagination"
                    :class="{ 'paginate-active': start >= 5 }">
                    Previous
                  </button>
                  <div
                    class="page"
                    v-for="pg in total_page.slice(start, end)"
                    :key="pg"
                    :class="{
                      'page-active': selectedPage === pg,
                      'page-unactive': selectedPage !== pg,
                    }"
                    @click="selectedPage = pg">
                    {{ pg + 1 }}
                  </div>
                  <button
                    :class="{ 'paginate-active': total_page.length > end }"
                    class="page-next"
                    @click="nextPagination">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <notification-alert
    v-if="showNotifAlert"
    :success="success"
    :message="message"
    @onClosed="onClosedNotif">
  </notification-alert>

  <alert-confirm
    v-if="showAlert"
    :title="title"
    :message="deleteMessage"
    :methods="methods"
    :url="url"
    :header="sheaders"
    :data="item"
    @onClosed="onClosed"
    @onResolve="submitted"
    @onError="onError">
  </alert-confirm>
</template>

<script>
import Loader from "@/components/Loader.vue";
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import NotificationAlert from "@/components/NotificationAlert.vue";
import axios from "axios";

export default {
  name: "ContractDetailView",
  components: {
    SidebarVue,
    NavbarVue,
    AlertConfirm,
    NotificationAlert,
    Loader,
  },
  data() {
    return {
      title: null,
      confirmmessage: null,
      methods: null,
      url: null,
      sheader: null,
      item: null,
      sidebarWidth: "18%",
      contentWidth: "78%",
      allselected: false,
      showCreate: false,
      showEdit: false,
      pr: [],
      prs: [],
      total_page: [],
      selectedPage: 0,
      selectedContract: {},
      showNotif: false,
      showAlert: false,
      showNotifAlert: false,
      message: null,
      succes: false,
      start: 0,
      end: 8,
      pagelength: 0,
      isApproval: false,
      isApprove: false,
      isDecliner: false,
      isDecline: false,
      authToken: null,
      perm: null,
      permission: [],
      isLoading: false,
      jenisitems: "all",
      jenis: null,
    };
  },
  mounted() {
    this.getContract();
    this.getJenisPR();
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    if (!this.permission.includes("contract-detail")) this.$router.back();
    this.isApproval = this.permission.includes("approve-contract");
    this.isDecliner = this.permission.includes("decline-contract");
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    async getContract() {
      try {
        this.isLoading = true;
        const { data } = await axios.get(
          `/contractdetail/${this.$route.params.id}/${this.authToken}`
        );
        this.selectedContract = data;

        console.log(this.selectedContract);
        this.getItem(this.selectedContract.items);
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        if (error.response.status == 401) {
          this.$toast.open({
            message: "Session expired!",
            type: "error",
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
    async getJenisPR() {
      try {
        const { data } = await axios.get(
          `/jenispr/${this.$route.params.id}/${this.authToken}`
        );
        this.jenis = data;
      } catch (error) {
        console.log(error);
        if (error.response.status == 401) {
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
    getItem(items) {
      const groupSize = 10;
      const newPR = [];
      this.prs = [];
      this.total_page = [];
      this.pagelength = items.length;
      let nou = 1;
      items.forEach((data) => {
        data.no = nou;
        newPR.push(data);
        nou++;
      });

      for (let i = 0; i < newPR.length; i += groupSize) {
        this.prs.push(newPR.slice(i, i + groupSize));
      }

      for (let i = 0; i < this.prs.length; i++) {
        this.total_page.push(i);
      }
    },
    prevPagination() {
      if (this.start <= 0) return;
      this.start -= 5;
      this.end -= 5;
    },
    nextPagination() {
      if (this.end > this.total_page.length) {
        this.start = this.total_page.length - 5;
        this.end = this.total_page.length;
        return;
      }

      this.start += 5;
      this.end += 5;
    },
    getFoodImage(filename) {
      return "/images/foods/" + filename;
    },
    getSupImage(filename) {
      return "/images/supplier/" + filename;
    },
    setCategory(value) {
      if (value === 1) return "Marketlist";
      else return "Stock Finance";
    },
    onClosed(value) {
      this.showAlert = value;
    },
    onClosedNotif(value) {
      this.showNotifAlert = value;
    },
    confirmContract() {
      const body = {
        kontrakno: this.selectedContract.kontrakno,
      };

      console.log(body);
      this.title = "Confirmation";
      this.deleteMessage = `Are you sure want to Approve this Transaction ?`;
      this.methods = "put";
      this.url = `/contractsupplier/${this.authToken}`;
      this.sheaders = null;
      this.item = body;
      this.showAlert = true;
    },
    declineContract() {
      const body = {
        kontrakno: this.selectedContract.kontrakno,
      };

      console.log(body);
      this.title = "Confirmation";
      this.deleteMessage = `Are you sure want to Decline this Transaction ?`;
      this.methods = "delete";
      this.url = `/contractsupplier/${this.authToken}`;
      this.sheaders = null;
      this.item = body;
      this.showAlert = true;
    },
    onTypeNote(idbarang) {
      this.selectedContract.items.some((data) => {
        if (data.kode_barang === idbarang) {
          data.revise_note = document.getElementById(`note${idbarang}`).value;
        }
      });
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
    submitted(value) {
      this.showAlert = false;
      this.$toast.open({
        message: value.message,
        type: "info",
        duration: 1000,
      });

      setTimeout(() => {
        window.location.href = `/contract-detail/${this.$route.params.id}`;
      }, 1000);
    },
    onError(value) {
      this.showAlert = false;
      this.$toast.open({
        message: value.message,
        type: "error",
        duration: 1000,
      });
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
};
</script>

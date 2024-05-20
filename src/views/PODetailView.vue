<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title pl-30">
            <i @click="$router.back()" class="ri-arrow-left-circle-fill back-btn"></i>
            <h2>Detail for PO #{{ this.$route.params.id }}</h2>
            <span>
              {{ selectedPO.po_date }}
            </span>
          </div>

          <div class="confirm-wrapper">
            <!-- <button class="export-btn">
                  <i class="ri-file-pdf-2-fill" style="font-size: 18pt"></i>
                </button> -->

            <button
              class="btn-success"
              @click="confirmPO"
              v-if="
                isApproval &&
                !isComplete &&
                !isLoading
              ">
              <i class="ri-check-line" style="font-size: 14pt"></i>
              <span style="position: relative; top: -2px"> Approve </span>
            </button>

            <button
              class="btn-danger"
              @click="cancelPO"
              v-if="
                isRejector &&
                !isComplete &&
                !isLoading
              ">
              <i class="ri-close-line" style="font-size: 14pt"></i>
              <span style="position: relative; top: -2px"> Reject </span>
            </button>
          </div>

          <div class="content">
            <loader v-if="isLoading"></loader>
            <div v-if="!isLoading" style="width: 100%; margin-top: 20px">
              <div class="po-header">
                <div class="po-logo">
                  <img
                    src="/images/logo/movenpick.png"
                    :alt="selectedPO.logo"
                    style="width: 100%; height: 100%; object-fit: contain"
                  />
                </div>

                <span class="stamp-container">
                  <img
                    v-if="selectedPO.user_conf"
                    class="stamp-logo"
                    src="/images/logo/approved.png"
                    alt=""
                  />
                  <img
                    v-if="selectedPO.user_batal"
                    class="stamp-logo"
                    src="/images/logo/declined.png"
                    alt=""
                  />
                </span>

                <div style="width: 78%; display: flex; flex-direction: column">
                  <span class="pr-supplier">{{ selectedPO.sup_kd }}</span>
                  <span class="pr-contact">{{ selectedPO.sup_alamat }}</span>
                  <span class="pr-address">{{ selectedPO.sup_email }}</span>

                  <span class="pr-deliver">Deliver to:</span>
                  <span class="pr-company" style="display: flex;align-items: center;">
                    <span class="pr-department">{{ selectedPO.subdiv_nm }}</span>
                  </span>
                </div>
              </div>

              <!-- 
                <div class="progress-order">
                  <div class="progress-line"></div>
                  <div class="progress-line-completed">
                    <div class="side-step"></div>
                    <div class="center-step" v-if="selectedPO.step > 1"></div>
                    <div class="center-step" v-if="selectedPO.step > 2"></div>
                    <div class="side-step" v-if="selectedPO.step > 3"></div>
                  </div>
  
                  <div
                    class="circle"
                    :class="{
                      completed: !selectedPO.f_batal
                    }"
                  >
                    <i class="ri-check-line"></i>
                    <span class="circle-detail" v-if="selectedPO.step > 0">
                      <span>Create PR</span>
                      <span class="detail-date">24.11.2023</span>
                    </span>
                  </div>
  
                  <div
                    class="circle"
                    :class="{
                      completed: selectedPO.step > 1,
                      pending: selectedPO.step <= 1,
                    }"
                  >
                    <i class="ri-check-line"></i>
                    <span class="circle-detail" v-if="selectedPO.step > 1">
                      <span>Approved PR</span>
                      <span class="detail-date">24.11.2023</span>
                    </span>
                  </div>
  
                  <div
                    class="circle"
                    :class="{
                      completed: selectedPO.step > 2,
                      pending: selectedPO.step <= 2,
                    }"
                  >
                    <i class="ri-check-line"></i>
                    <span class="circle-detail" v-if="selectedPO.step > 2">
                      <span>Approved PO</span>
                      <span class="detail-date">24.11.2023</span>
                    </span>
                  </div>
  
                  <div
                    class="circle"
                    :class="{
                      completed: selectedPO.step > 3,
                      pending: selectedPO.step <= 3,
                    }"
                  >
                    <i class="ri-check-line"></i>
                    <span class="circle-detail" v-if="selectedPO.step > 3">
                      <span>Approved PR</span>
                      <span class="detail-date">24.11.2023</span>
                    </span>
                  </div>
                </div>
                -->

              <table class="table-responsive" aria-describedby="PR Items Data">
                <thead class="bg-dark">
                  <tr>
                    <th style="width: 5%">No</th>
                    <th style="width: 10%">Purchase No.</th>
                    <th style="width: 15%; text-align: left">
                      <select
                        class="select-jenis"
                        v-model="jenisitems"
                        @change="getPR"
                      >
                        <option value="all">Jenis</option>
                        <option
                          v-for="jns in jenis"
                          :key="jns.kd_jenis"
                          :value="jns.kd_jenis"
                        >
                          {{ jns.nm_jenis }}
                        </option>
                      </select>
                    </th>
                    <th style="width: 20%; text-align: left">Product Name</th>
                    <th style="width: 10%">Satuan Beli</th>
                    <th style="width: 5%">Qty</th>
                    <th style="width: 5%">Qty Terima</th>
                    <th
                      style="width: 35%"
                      v-if="
                        isRevise ||
                        selectedPO.f_revise ||
                        selectedPO.revised_user
                      "
                    >
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(pr, idx) in prs[selectedPage]"
                    :key="pr.kode_barang"
                    :class="{ 'bg-canvas': idx % 2 == 0 }"
                    style="height: 60px"
                  >
                    <td>{{ pr.no }}</td>
                    <td>{{ pr.po_no }}</td>
                    <td style="text-align: left">{{ pr.nmjns }}</td>
                    <td style="text-align: start">
                      <!-- <img
                          :src="getFoodImage(pr.image)"
                          :alt="pr.image"
                          style="width: 30px"
                        /> -->

                      <span style="position: relative; margin-left: 10px">
                        {{ pr.nmbar }}
                      </span>
                    </td>
                    <td>{{ pr.kdstn_nm }}</td>
                    <td>
                      {{ pr.qty }}
                    </td>
                    <td>{{ pr.qty_terima }}</td>
                    <!-- <td v-if="pr.qty > 0 && pr.qty_old > 0">{{ pr.qty_old }}</td>
                      <td v-if="pr.qty == 0 && pr.qty_old > 0">{{ pr.qty }}</td> -->
                    <td
                      v-if="
                        isRevise ||
                        selectedPO.f_revise ||
                        selectedPO.revised_user
                      "
                    >
                      <textarea
                        class="revise-note"
                        :class="{
                          'revise-note': !selectedPO.f_revise,
                          'revised-note': selectedPO.f_revise,
                        }"
                        :id="'note' + pr.kode_barang"
                        rows="3"
                        wrap="physical"
                        :value="pr.revise_note"
                        v-on:keyup="onTypeNote(pr.kode_barang)"
                        :readonly="
                          selectedPO.f_revise ||
                          selectedPO.f_approve ||
                          selectedPO.f_batal ||
                          !isRevise
                        "
                      >
                      </textarea>
                    </td>
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
                  "
                >
                  <button
                    class="page-prev"
                    @click="prevPagination"
                    :class="{ 'paginate-active': start >= 5 }"
                  >
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
                    @click="selectedPage = pg"
                  >
                    {{ pg + 1 }}
                  </div>
                  <button
                    :class="{ 'paginate-active': total_page.length > end }"
                    class="page-next"
                    @click="nextPagination"
                  >
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
    @onClosed="onClosedNotif"
  >
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
    @onError="onError"
  >
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
  name: "PRDetailView",
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
      selectedPO: {},
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
      isRejector: false,
      isReject: false,
      isRevisor: false,
      isRevise: false,
      authToken: null,
      perm: null,
      permission: [],
      isLoading: false,
      jenisitems: "all",
      jenis: null,
      isComplete: false,
    };
  },
  mounted() {
    this.getPO();
    this.getJenisPR();
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    if (!this.permission.includes("po-detail")) window.location.href = "/";
    this.isApproval = this.permission.includes("approve-po");
    this.isRejector = this.permission.includes("reject-po");
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    async getPO() {
      try {
        this.isLoading = true;
        const { data } = await axios.get(`/getpodetail/${this.$route.params.id}/${this.authToken}`);

        this.selectedPO = data;
        if(this.selectedPO.user_batal || this.selectedPO.user_conf){
          this.isComplete = true
        }

        this.getItem(this.selectedPO.items);

        this.isLoading = false;
      } catch (error) {
        console.log(error)
        if (error.response.status == 401) {
          this.$store
            .dispatch("LOGOUT")
            .then(() => {
              this.$router.push({ path: "/login" });
            })
            .catch(() => {
              this.$router.push({ path: "/login" });
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
        if (error.response.status == 401) {
          this.$store
            .dispatch("LOGOUT")
            .then(() => {
              this.$router.push({ path: "/login" });
            })
            .catch(() => {
              this.$router.push({ path: "/login" });
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
    cancelPO() {
      const body = {
        po_no: this.selectedPO.po_no,
        token: this.authToken,
      };

      console.log(body);
      this.title = "Confirmation";
      this.deleteMessage = `Are you sure want to Reject this Transaction ?`;
      this.methods = "delete";
      this.url = `/pobarang/${this.authToken}`;
      this.sheaders = null;
      this.item = body;
      this.showAlert = true;
    },
    confirmPO() {
      const body = {
        po_no: this.selectedPO.po_no,
        token: this.authToken,
      };

      console.log(body);
      this.title = "Confirmation";
      this.deleteMessage = `Are you sure want to Approve this Transaction ?`;
      this.methods = "put";
      this.url = `/pobarang/${this.authToken}`;
      this.sheaders = null;
      this.item = body;
      this.showAlert = true;
    },
    onTypeNote(idbarang) {
      this.selectedPO.items.some((data) => {
        if (data.kode_barang === idbarang) {
          data.revise_note = document.getElementById(`note${idbarang}`).value;
        }
      });
    },
    submitRevise() {
      try {
        if (!this.isRevise) return;
        this.selectedPO.items.forEach((data) => {
          if (!data.revise_note) {
            data.revise_note = "";
          }
        });

        const body = {
          pr_no: this.selectedPO.pr_no,
          items: this.selectedPO.items,
        };

        console.log(body);
        this.title = "Confirmation";
        this.deleteMessage = `Are you sure want to Revise this Transaction ?`;
        this.methods = "put";
        this.url = `/prbarang/${this.authToken}`;
        this.sheaders = null;
        this.item = body;
        this.showAlert = true;
      } catch (error) {
        console.log(error);
      }
    },
    getMonth(gmonth) {
      console.log(gmonth)
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
        window.location.href = `/po/${this.selectedPO.pr_no}`;
      }, 1000);
    },
    onError(value) {
      this.showAlert = false;
      this.message = value.message;
      this.success = false;
      this.showNotifAlert = true;
      this.alertMessage = null;
    },
    onClosedNotif(value) {
      this.showNotifAlert = value;
    },
  },
};
</script>

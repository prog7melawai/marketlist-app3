<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Detail for #{{ this.$route.params.id }}</h2>
            <span
              >{{ getMonth(new Date(selectedPR.pr_date).getMonth()) }},
              {{ new Date(selectedPR.pr_date).getDate() }}
              {{ new Date(selectedPR.pr_date).getFullYear() }}
            </span>
          </div>

          <button
            class="export-btn"
            style="
              position: absolute;
              top: 20px;
              right: 125px;
              border-radius: 3px;
            "
            @click="confirmPR"
          >
            <i class="ri-file-pdf-2-fill" style="font-size: 18pt"></i>
          </button>

          <!-- 
          <button
            class="btn-theme"
            style="position: absolute; top: 20px; right: 125px"
            @click="confirmPR"
          >
            <i class="ri-check-line" style="font-size: 14pt"></i>

            <span style="position: relative; top: -2px"> Approve </span>
          </button>
          -->

          <button
            class="btn-danger"
            style="position: absolute; top: 20px; right: 20px"
            @click="cancelPR"
          >
            <i class="ri-close-line" style="font-size: 14pt"></i>

            <span style="position: relative; top: -2px"> Denied </span>
          </button>

          <div class="content">
            <div style="width: 100%; margin-top: 20px">
              <div class="po-header">
                <div class="po-logo">
                  <img
                    src="/images/logo/movenpick.png"
                    :alt="selectedPR.logo"
                    style="width: 100%; height: 100%; object-fit: contain;"
                  />
                </div>

                <div style="width: 78%; display: flex; flex-direction: column">
                  <span class="pr-supplier">{{ selectedPR.dept_kd }}</span>
                  <span class="pr-contact">{{ selectedPR.div_kd }}</span>
                  <span class="pr-address">{{ selectedPR.subdiv_kd }}</span>

                  <span class="pr-deliver">Deliver to:</span>
                  <span class="pr-company">
                    <!-- <img
                      src="/images/logo/movenpick.png"
                      alt="logo"
                      style="width: 135px"
                    /> -->
                  </span>
                  <span class="pr-department">Departmen {{ selectedPR.dept_kd }}</span>
                </div>
              </div>

              <!-- 
              <div class="progress-order">
                <div class="progress-line"></div>
                <div class="progress-line-completed">
                  <div class="side-step"></div>
                  <div class="center-step" v-if="selectedPR.step > 1"></div>
                  <div class="center-step" v-if="selectedPR.step > 2"></div>
                  <div class="side-step" v-if="selectedPR.step > 3"></div>
                </div>

                <div
                  class="circle"
                  :class="{
                    completed: !selectedPR.f_batal
                  }"
                >
                  <i class="ri-check-line"></i>
                  <span class="circle-detail" v-if="selectedPR.step > 0">
                    <span>Create PR</span>
                    <span class="detail-date">24.11.2023</span>
                  </span>
                </div>

                <div
                  class="circle"
                  :class="{
                    completed: selectedPR.step > 1,
                    pending: selectedPR.step <= 1,
                  }"
                >
                  <i class="ri-check-line"></i>
                  <span class="circle-detail" v-if="selectedPR.step > 1">
                    <span>Approved PR</span>
                    <span class="detail-date">24.11.2023</span>
                  </span>
                </div>

                <div
                  class="circle"
                  :class="{
                    completed: selectedPR.step > 2,
                    pending: selectedPR.step <= 2,
                  }"
                >
                  <i class="ri-check-line"></i>
                  <span class="circle-detail" v-if="selectedPR.step > 2">
                    <span>Approved PO</span>
                    <span class="detail-date">24.11.2023</span>
                  </span>
                </div>

                <div
                  class="circle"
                  :class="{
                    completed: selectedPR.step > 3,
                    pending: selectedPR.step <= 3,
                  }"
                >
                  <i class="ri-check-line"></i>
                  <span class="circle-detail" v-if="selectedPR.step > 3">
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
                    <th style="width: 15%">Product ID</th>
                    <th style="width: 25%" colspan="2">Product Name</th>
                    <th style="width: 5%">Jenis</th>
                    <th style="width: 5%">Satuan Stock</th>
                    <th style="width: 10%">Satuan Kirim</th>
                    <th style="width: 10%">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(pr, idx) in prs[selectedPage]"
                    :key="pr.kode_barang"
                    :class="{ 'bg-canvas': idx % 2 == 0 }"
                    style="height: 60px;"
                  >
                    <td>{{ idx + 1 }}</td>
                    <td>{{ pr.kode_barang }}</td>
                    <td style="text-align: start" colspan="2">
                      <!-- <img
                        :src="getFoodImage(pr.image)"
                        :alt="pr.image"
                        style="width: 30px"
                      /> -->

                      <span
                        style="
                          position: relative;
                          margin-left: 10px;
                        "
                      >
                        {{ pr.nama_barang }}
                      </span>
                    </td>
                    <td>{{ pr.kd_jenis }}</td>
                    <td>{{ pr.kdstn_stock }}</td>
                    <td>{{ pr.kdstn_krm }}</td>
                    <td>{{ pr.qty }}</td>
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
                  <button class="page-prev" @click="prevPagination"
                    :class="{'paginate-active': start >= 5}">
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
                  <button :class="{'paginate-active': total_page.length > end}"
                  class="page-next" @click="nextPagination">
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

  <alert-confirm
    v-if="showAlert"
    :title="title"
    :message="message"
    @onClosed="onClosed"
  >
  </alert-confirm>
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import axios from "axios";

export default {
  name: "PRDetailView",
  components: {
    SidebarVue,
    NavbarVue,
    AlertConfirm,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      allselected: false,
      showCreate: false,
      showEdit: false,
      pr: [],
      prs: [],
      total_page: [],
      selectedPage: 0,
      selectedPR: {},
      showAlert: false,
      message: null,
      title: null,
      start: 0,
      end: 8,
      pagelength: 0,
    };
  },
  mounted() {
    this.getPR();
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    async getPR() {
      try {
        const { data } = await axios.get(`/prdetailbarang/${this.$route.params.id}/asdasdas`)
        this.selectedPR = data
        this.getItem(this.selectedPR.items);
      } catch(error){
        console.log(error);
      }
    },
    getItem(items) {
      const groupSize = 10;
      const newPR = [];
      this.prs = [];
      this.total_page = [];
      this.pagelength = items.length
      items.forEach((data) => {
        newPR.push(data);
      });

      for (let i = 0; i < newPR.length; i += groupSize) {
        this.prs.push(newPR.slice(i, i + groupSize));
      }

      for (let i = 0; i < this.prs.length; i++) {
        this.total_page.push(i);
      }
    },
    prevPagination(){
        if(this.start <= 0) return;
        this.start -= 5
        this.end -= 5
    },
    nextPagination(){
        if(this.end > this.total_page.length) {
            this.start = this.total_page.length - 5
            this.end = this.total_page.length
            return;
        }

        this.start += 5
        this.end += 5
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
    cancelPR() {
      this.title = "Confirm Cancel";
      this.message =
        "Are you sure want to cancel #" +
        this.$route.params.id +
        " ? This process cannot be reverted!";
      this.showAlert = true;
    },
    confirmPR() {
      this.title = "Confirm Submit";
      this.message =
        "Are you sure want to confirm #" + this.$route.params.id + " ?";
      this.showAlert = true;
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

<style>
.po-header {
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
}

.po-header .po-logo {
  width: 20%;
  height: 80%;
  border: 1px solid var(--canvas);
}
.pr-supplier {
  font-family: "Fonarto", sans-serif;
  font-size: 16pt;
  color: var(--light);
}

.pr-contact {
  font-family: "Lexend", sans-serif;
  color: var(--light);
  margin-bottom: 5px;
}

.pr-address {
  font-family: "Lexend", sans-serif;
  color: var(--light);
}

.pr-deliver {
  margin-top: 50px;
  font-size: 13pt;
  color: var(--light);
  font-weight: lighter;
  font-family: "Fonarto", sans-serif;
}

.pr-company {
  font-family: "Fonarto", sans-serif;
  font-size: 16pt;
  color: var(--light);
}

.pr-department {
  font-family: "Lexend", sans-serif;
  color: var(--light);
  margin-top: -6px;
}

.progress-order {
  position: relative;
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  margin-top: -60px;
  margin-bottom: 30px;
}

.progress-order .circle {
  position: relative;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18pt;
  z-index: 2;
}

.progress-order .circle .circle-detail {
  position: absolute;
  width: 120px;
  top: 45px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  text-align: center;
  font-size: 12pt;
  color: var(--dark);
  font-family: "Lexend", sans-serif;
  display: flex;
  flex-direction: column;
}

.progress-order .circle .circle-detail .detail-date {
  font-size: 9pt;
  color: var(--light);
}

.pending {
  background: var(--light);
  color: var(--white);
}

.completed {
  background: var(--themecolor);
  color: var(--white);
}

.progress-line {
  position: absolute;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  width: 90%;
  height: 5px;
  background: var(--light);
}

.progress-line-completed {
  position: absolute;
  width: 90%;
  height: 100%;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.side-step {
  width: 20%;
  height: 5px;
  background: var(--themecolor);
  z-index: 1;
}

.center-step {
  width: 30%;
  height: 5px;
  background: var(--themecolor);
  z-index: 1;
}
</style>

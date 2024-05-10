<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Create New PO</h2>
          </div>

          <div class="content">
            <div
              style="
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: start;
              "
            >
              <div class="form-group">
                <label
                  class="form-label"
                  :class="{'color-orange': po.pr_no }">
                  PR NUMBER
                </label>
                <select
                  style="width: 99%; 
                  height: 40px; 
                  border-radius: 5px"
                  v-model="po.pr_no"
                >
                  <option 
                    v-for="pr in prs" 
                    :key="pr.pr_no" 
                    :value="pr.pr_no">
                        {{ pr.pr_no }} - {{ pr.pr_date }} | {{ pr.dept_kd }}
                  </option>
                </select>
                <span>{{ error.sup_kd }}</span>
              </div>

              <div class="form-group">
                <label
                  class="form-label"
                  :class="{ 'color-orange': po.expected_date }"
                  >Expired Date</label
                >
                <VueDatePicker
                  style="width: 99%"
                  v-model="po.expected_date"
                  placeholder="Expected Date"
                  :enable-time-picker="false"
                  :format="format"
                />
                <span>{{ error.expected_date }}</span>
              </div>
              <div class="form-group">
                <label
                  class="form-label"
                  :class="{ 'color-orange': po.expired_date }"
                  >Expected Date</label
                >
                <VueDatePicker
                  v-model="po.expired_date"
                  placeholder="Expired Date"
                  :enable-time-picker="false"
                  :format="format"
                />
                <span>{{ error.expired_date }}</span>
              </div>
            </div>

            <button
              class="btn-block btn-success"
              style="margin-top: 20px"
              @click="submitPO"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <notification 
    v-if="showNotif" 
    :success="success" 
    :message="message">
  </notification>

  <alert-confirm
    v-if="showAlert"
    :title="title"
    :message="alertMessage"
    :methods="methods"
    :url="url"
    :header="sheaders"
    :data="item"
    @onClosed="onClosed"
    @onResolve="submitted"
  >
  </alert-confirm>
</template>

<script>
import Notification from "@/components/Notification.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import axios from "axios";

export default {
  name: "CreatePOView",
  components: {
    SidebarVue,
    NavbarVue,
    VueDatePicker,
    Notification,
    AlertConfirm,
  },
  data() {
    return {
      sidebarWidth: 0,
      contentwidth: 0,
      success: false,
      message: null,
      showNotif: false,
      showAlert: false,
      title: null,
      alertMessage: null,
      methods: null,
      sheaders: null,
      url: null,
      item: null,
      po: {
        pr_no: null,
        expired_date: null,
        expected_date: null,
      },
      error: {
        pr_no: null,
        expired_date: null,
        expected_date: null,
      },
      authToken: null,
      masterbarang: null,
      suppliers: null,
      masbars: [],
      pagelength: 0,
      perpage: 15,
      total_page: [],
      selectedPage: 0,
      start: 0,
      end: 8,
      isLoading: false,
      vat: 0,
      satuan: null,
      divisi: null,
      subdivisi: null,
      dept: null,
      prs: null,
    };
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
  },
  mounted(){
    this.getPR()
  },
  methods: {
    format(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    },
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    async getPR() {
      try {
        const { data } = await axios.get(`/prservice/approve/${this.authToken}`);
        this.prs = data;
        console.log(this.prs)
      } catch (error) {
        console.log(error);
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
    async submitPO() {
      try {
        this.title = "Confirmation";
        this.alertMessage = `Are you sure want to submit Transaction ?`;
        this.methods = "post";
        this.url = `/pobarang/${this.authToken}`;
        this.sheaders = null;
        this.item = this.po;
        this.showAlert = true;
      } catch (error) {
        console.log(error);
      }
    },
    submitted(value) {
      this.showAlert = false;
      this.message = value.message;
      this.success = true;
      this.showNotif = true;

      setTimeout(() => {
        this.message = null;
        this.succes = false;
        this.showNotif = false;
        window.location.href = "/po";
      }, 1300);
    },
    onClosed(value) {
      this.showAlert = value;
    },
  },
};
</script>
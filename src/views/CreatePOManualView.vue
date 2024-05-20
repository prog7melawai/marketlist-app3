<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Re-Create New PO</h2>
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
                <label class="form-label" :class="{ 'color-orange': po.pr_no }">
                  PR NUMBER
                </label>
                <input
                  style="margin-top: -3px"
                  type="text"
                  class="form-input"
                  v-model="po.pr_no"
                  readonly
                />
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
                  :min-date="new Date()"
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
                  :min-date="new Date()"
                  :format="format"
                />
                <span>{{ error.expired_date }}</span>
              </div>
              <div class="form-group">
                    <label class="form-label" :class="{ 'color-orange': po.sup_kd }">Supplier</label>
                    <select style="width: 99%;height: 40px;border-radius: 5px;" v-model="po.sup_kd">
                        <option v-for="supp in suppliers" :key="supp.sup_kd" :value="supp.sup_kd">{{ supp.sup_nm }}</option>
                    </select>
                    <span>{{ error.sup_kd }}</span>
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

  <notification-alert
      v-if="showNotifAlert" 
      :success="success" 
      :message="message"
      @onClosed="onClosedNotif">
  </notification-alert>

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
    @onError="onError"
  >
  </alert-confirm>
</template>

<script>
import NotificationAlert from '@/components/NotificationAlert.vue';
import AlertConfirm from "@/components/AlertConfirm.vue";
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import axios from "axios";

export default {
  name: "CreatePOManualView",
  components: {
    SidebarVue,
    NavbarVue,
    VueDatePicker,
    AlertConfirm,
    NotificationAlert,
  },
  data() {
    return {
      sidebarWidth: 0,
      contentwidth: 0,
      success: false,
      message: null,
      showNotif: false,
      showNotifAlert: false,
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
        sup_kd: null,
        po_no: null,
      },
      error: {
        pr_no: null,
        expired_date: null,
        expected_date: null,
        sup_kd: null,
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
      selectedPO: null,
      supplier: null,
    };
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.po.pr_no = this.$route.params.id;
  },
  mounted(){
    this.getPODetail();
  },
  methods: {
    async getPODetail(){
        try {
            const {data} = await axios.get(`/getpodetail/${this.$route.params.id}/${this.authToken}`)
            this.selectedPO = data;

            this.po.sup_kd = data.sup_kd
            this.po.pr_no = data.pr_no
            this.po.po_no = data.po_no
            this.po.expected_date = `${String(data.expected_date).substring(6, 10)}-${String(data.expected_date).substring(3, 5)}-${String(data.expected_date).substring(0, 2)}`
            this.po.expired_date = `${String(data.expired_date).substring(6, 10)}-${String(data.expired_date).substring(3, 5)}-${String(data.expired_date).substring(0, 2)}`
            this.getSuppliers();
        } catch(error){
            console.log(error)
        }
    },
    async getSuppliers(){
        try {
            const { data } = await axios.get(`/getsuppliercontract/${this.authToken}`)
            this.suppliers = data
        } catch(error){
            if(error.response.status == 401){
                this.$toast.open({
                    message: 'Session expired!',
                    type: 'error',
                });

                this.$store.dispatch("LOGOUT")
                .then(() => {
                    this.$router.push({ path : '/login'});
                }).catch(() => {
                    this.$router.push({ path : '/login'});
                });
            }
        }
    },
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
    async submitPO() {
      let counter = 0;
      if (!this.po.expected_date) {
        this.error.expected_date = "Please enter expected date!";
        counter += 1;
      }

      if (!this.po.expired_date) {
        this.error.expired_date = "Please enter expired date!";
        counter += 1;
      }

      if(!this.po.sup_kd){
        this.error.sup_kd = 'Please select supplier!'
        counter += 1
      }

      if (counter > 0) {
        return;
      }

      this.title = "Confirmation";
      this.alertMessage = `Are you sure want to submit Transaction ?`;
      this.methods = "post";
      this.url = `/pofindsupplier/${this.authToken}`;
      this.sheaders = null;
      this.item = this.po;
      this.showAlert = true;
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
      console.log(value)
      this.showAlert = false
      this.message = value.message
      this.success = false
      this.showNotifAlert = true
      this.alertMessage = null
    },
    onClosed(value) {
      this.showAlert = value;
    },
    onClosedNotif(value) {
      this.showNotifAlert = value;
    },
  },
};
</script>

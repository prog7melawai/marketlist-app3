<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Create New Receive</h2>
          </div>

          <div class="content">
            <div class="form-group">
              <label class="form-label">Nomor PO</label>
              <select
                style="width: 99%; height: 40px; border-radius: 5px"
                v-model="poNoCall"
                @change="getPoDetail">
                <option
                  v-for="poDrop in purchaseOrders"
                  :key="poDrop.po_no"
                  :selected="poDrop.po_no"
                  :value="poDrop.po_no">
                  {{ poDrop.po_no }}
                </option>
              </select>
              <span>{{ error.po_no }}</span>
            </div>

            <div style="position: relative; width: 100%; margin-top: 20px">
              <table class="table-responsive" style="width: 100%">
                <thead class="bg-dark">
                  <tr>
                    <th width="15%">NO PO</th>
                    <th width="30%">KD Product</th>
                    <th width="20%">Sisa PO Qty</th>
                    <th width="20%">Insert Qty Receiving</th>
                  </tr>
                </thead>

                <tbody v-if="isLoading">
                  <tr>
                    <td colspan="10">
                      <loader></loader>
                    </td>
                  </tr>
                </tbody>

                <tbody v-if="!isLoading">
                  <tr
                    v-for="(item, index) in poDetail.items"
                    :key="index"
                    :class="{ 'bg-canvas': index % 2 == 0 }">
                    <td>{{ item.po_no }}</td>
                    <td>{{ item.kdbar }}</td>
                    <td>{{ item.qty - item.qty_terima }}</td>
                    <td style="text-align: left">
                      <input
                        class="form-input"
                        type="number"
                        style="width: 85%"
                        :id="'qtyInput' + item.po_no"
                        :readonly="poDetail.readonly"
                        :value="items[index]?.qty"
                        @keydown.enter="
                          updateQty(
                            index,
                            $event.target.value,
                            item.po_no,
                            item.kdbar
                          )
                        "
                        @keydown.tab="
                          updateQty(
                            index,
                            $event.target.value,
                            item.po_no,
                            item.kdbar
                          )
                        " />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              :disabled="!isSubmit"
              class="btn-block btn-success"
              style="margin-top: 20px; width: 100%"
              @click="validateSubmit">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <notification v-if="showNotif" :success="success" :message="message">
  </notification>

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
    @onError="onError">
  </alert-confirm>
</template>

<script>
// import Spinner from "@/components/Spinner.vue";
import Notification from "@/components/Notification.vue";
import NotificationAlert from "@/components/NotificationAlert.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import Loader from "@/components/Loader.vue";
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import axios from "axios";

export default {
  name: "CreateReceiveView",
  components: {
    SidebarVue,
    NavbarVue,
    Loader,
    Notification,
    NotificationAlert,
    AlertConfirm,
    // Spinner,
  },
  data() {
    return {
      formSubmit: {
        no_po: "",
        qty: 0,
        kd_barang: "",
      },
      items: [],
      indexPoDtl: 0,
      qtyInput: 0,
      qtyValidator: 0,
      indexPO: 0,
      sidebarWidth: 0,
      contentwidth: 0,
      poNoCall: null,
      sheaders: null,
      item: null,
      showAlert: false,
      showNotif: false,
      contentWidth: 0,
      showNotifAlert: false,
      success: false,
      message: null,
      title: null,
      alertMessage: null,
      methods: null,
      url: null,
      isLoading: false,
      isSubmit: false,

      error: {
        po_no: null,
        po_date: null,
      },
      purchaseOrders: null,
      poDetail: {},
    };
  },
  mounted() {},

  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    // if (!this.permission.includes("create-receive")) window.location.href = "/";
    this.getPurchaseOrders();
    // this.getPoDetail();
  },
  computed: {
    sisaQty() {
      return (
        this.poDetail.items[this.indexPO].qty -
        this.poDetail.items[this.indexPO].qty_terima
      );
    },
  },
  watch: {},
  methods: {
    async getPoDetail() {
      // this.qty = {};
      this.isLoading = true;
      try {
        this.poDetail = {};
        const { data: poDetailData } = await axios.get(
          `/getpodetail/${this.poNoCall}/${this.authToken}`
        );
        this.poDetail = poDetailData;
        this.poDetail.items.forEach((data) => {
          this.qty = data.qty;
        });
        this.isLoading = false;
      } catch (error) {
        if (error.response.status == 401) {
          this.$toast.open({ message: "sesh exp", type: "err" });
        }
      }
    },

    async getPurchaseOrders() {
      try {
        const { data } = await axios.get(`/getpo/${this.authToken}`);
        this.purchaseOrders = data;
      } catch (error) {
        if (error.response.status == 401) {
          this.$toast.open({
            message: "sesh exp",
            type: "err",
          });
        }
      }
    },

    async submitReceiving() {
      try {
        const wrapped = {
          items: this.items,
        };
        this.title = "CONFIRMATION";
        this.alertMessage = `Are you sure want to submit Transaction?`;
        this.methods = "post";
        this.url = `/receiving/${this.authToken}`;
        this.sheaders = null;
        this.item = wrapped;
        this.showAlert = true;
      } catch (error) {
        if (error.response.status == 401) {
          this.$toast.open({
            message: "Session expired!",
            type: "error",
          });

          this.$store
            .dispatch("LOGOUT")
            .then(() => {
              this.$router.push({ path: "/login" });
            })
            .catch(() => {
              this.$router.push({ path: "/login" });
            });
        }
        console.log(error);
      }
    },

    validateSubmit() {
      if (this.isSubmit) {
        this.submitReceiving();
      }
    },

    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    updateQty(index, value, po_no, kdbar) {
      this.indexPO = index;
      this.isSubmit = false;
      if (value <= 0 || value > this.sisaQty) {
        this.isSubmit = false;
        if (value <= 0) {
          this.$toast.open({
            message: "Qty cannot be 0!",
            type: "error",
          });
        }
        if (value > this.sisaQty) {
          this.$toast.open({
            message: "Qty cannot exceed remaining PO qty!",
            type: "error",
          });
        }
      } else {
        if (this.items[index] != undefined) {
          this.items[index].qty = value;
          this.$toast.open({
            message: `Quantity added for receiving items ${index}`,
            type: "info",
            duration: 1000,
          });
        } else {
          this.formSubmit.no_po = po_no;
          this.formSubmit.kd_barang = kdbar;
          this.formSubmit.qty = parseInt(value);
          this.items.push({ ...this.formSubmit });
          this.formSubmit.no_po = "";
          this.formSubmit.kd_barang = "";
          this.formSubmit.qty = 0;
          this.$toast.open({
            message: `Quantity added for receiving items ${index}`,
            type: "info",
            duration: 1000,
          });
        }
        if (this.items.length == this.poDetail.items.length) {
          this.isSubmit = true;
        }
      }
    },

    submitted(value) {
      this.showAlert = false;
      this.$toast.open({
        message: value.message,
        type: "info",
        duration: 1000,
      });

      setTimeout(() => {
        // window.location.href = "/receiving";
      }, 1000);
    },
    onError(value) {
      this.showAlert = false;
      this.message = value.message;
      this.success = false;
      this.showNotifAlert = true;
      this.alertMessage = null;
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

<style></style>

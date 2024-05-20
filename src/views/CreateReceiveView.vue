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
              <label class="form-label">NO PO</label>
              <select
                v-model="poNoCall"
                style="width: 99%; height: 40px; border-radius: 5px"
                @change="getPoDetail">
                <option
                  v-for="poDrop in purchaseOrders"
                  :key="poDrop.po_no"
                  :selected="poDrop.po_no"
                  :value="poDrop.po_no">
                  {{ poDrop.po_no }}
                </option>
              </select>
              <!-- <span>{{ error.divisi_kd }}</span> -->
            </div>
            <!-- search ga dipake -->
            <!-- <div
              class="search-container"
              style="
                margin-right: 0px;
                width: 50%;
                height: 44px;
                position: relative;
              ">
              <input
                type="text"
                class="form-input"
                style="width: 99%; height: 46px; border-radius: 5px"
                placeholder="Search Nomor PO....."
                v-model="searchItem"
                @keyup.enter="searching" />
            </div> -->
            <div
              style="
                position: relative;
                width: 100%;
                margin-top: 20px;
                /* overflow-x: scroll; */
              ">
              <table class="table-responsive" style="width: 100%">
                <thead class="bg-dark">
                  <tr>
                    <th width="25%">NO PO</th>
                    <th width="40%">KD Product</th>
                    <th width="35%">Qty</th>
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
                    v-for="(el, index) in poDetail.items"
                    :key="index"
                    :class="{ 'bg-canvas': index % 2 == 0 }">
                    <!-- {{
                      el
                    }} -->
                    <td>{{ el.po_no }}</td>
                    <td>{{ el.kdbar }}</td>
                    <td style="text-align: left">
                      <input
                        class="form-input"
                        type="number"
                        style="width: 85%"
                        :id="'qtyInput' + poDetail.po_no"
                        :readonly="poDetail.readonly"
                        v-on:keydown.enter="addQty(poDetail.po_no)"
                        v-on:keydown.tab="addQty(poDetail.po_no)"
                        :value="poDetail.items.qty" />
                    </td>
                    <!-- <td>
                      <input
                        type="checkbox"
                        :id="'select' + el.kdbar"
                        :value="el.kdbar"
                        @change="selectItems"
                        :checked="el.checked" />
                    </td> -->
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- <div class="page-wrapper" v-if="total_page.length > 0">
              <div style="width: 50%">
                <span style="font-size: 10pt">
                  Showing {{ purchaseOrderss[selectedPage][0].no }} to
                  {{
                    purchaseOrderss[selectedPage][
                      purchaseOrderss[selectedPage].length - 1
                    ].no
                  }}
                  of {{ pagelength }} entries.
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
            </div> -->

            <button
              class="btn-block btn-success"
              style="margin-top: 20px; width: 100%"
              @click="submitReceiving">
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
      sidebarWidth: 0,
      contentwidth: 0,
      poNoCall: null,
      sheaders: null,
      item: null,
      showAlert: false,
      // po_h: {
      //   po_no: null,
      //   po_date: null,
      // pr_no: null,
      // pr_date: null,
      // sup_kd: null,
      // netto: null,
      // disc: null,
      // disc_type: null,
      // disc_rp: null,
      // tppn_rp: null,
      // grand_total: null,
      // crdate: null,
      // crtime: null,
      // cruser: null,
      // upddate: null,
      // upduser: null,
      // f_status: null,
      // user_batal: null,
      // tgl_batal: null,
      // expired_date: null,
      // expected_date: null,
      // dept_kd: null,
      // divisi_kd: null,
      // subdiv_kd: null,
      // kontrakno: null,
      // kontrak_date: null,
      // f_complete: null,
      //   items: [],
      // },
      receivingPost: {
        items: [],
      },
      // no_po: null,
      error: {
        po_no: null,
        po_date: null,
      },
      purchaseOrders: null,
      poDetail: {},
      // poDetails: [],
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
  methods: {
    async getPoDetail() {
      try {
        this.poDetail = {};

        const { data: poDetailData } = await axios.get(
          `/getpodetail/${this.poNoCall}/${this.authToken}`
        );
        this.poDetail = poDetailData;
        console.log(poDetailData);
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
        this.receivingPost.items = [];
        // this.no_po = po_no;
        this.poDetail.items.forEach((data) => {
          if (data.kdbar && data.qty) {
            data.vat = 0;
            this.receivingPost.items.push(data);
          }
        });
        //
        this.receivingPost.items.map(function (obj) {
          obj["no_po"] = obj["po_no"];
          delete obj["po_no"];

          obj["kd_barang"] = obj["kdbar"];
          delete obj["kdbar"];

          obj["nm_barang"] = obj["nmbar"];
          delete obj["nmbar"];
        });

        //

        this.title = "CONFIRMATION";
        this.alertMessage = `Are you sure want to submit Transaction ?`;
        this.methods = "post";
        this.url = `/receiving/${this.authToken}`;
        this.sheaders = null;
        this.item = this.receivingPost;
        this.showAlert = true;
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
              this.$router.push({ path: "/login" });
            })
            .catch(() => {
              this.$router.push({ path: "/login" });
            });
        }
      }
    },

    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },

    addQty(id) {
      this.poDetail.items.filter((item) => {
        if (item.po_no === id) {
          item.qty = parseFloat(document.getElementById(`qtyInput${id}`).value);
          this.$toast.open({
            message: `Qty added for Item in PO ${id}`,
            type: "info",
            duration: 1000,
          });
        }
      });

      // this.poDetail.items.filter((item) =>
      //   item.filter((obj) => {
      //     if (obj.po_no === id) {
      //       obj.qty = parseFloat(
      //         document.getElementById(`qtyInput${id}`).value
      //       );

      //       this.$toast.open({
      //         message: `Qty added for Item in PO ${id}`,
      //         type: "info",
      //         duration: 1000,
      //       });
      //     }
      //   })
      // );
    },
  },
};
</script>

<style></style>

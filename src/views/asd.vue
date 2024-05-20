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
            <div
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
            </div>
            <div style="position: relative; width: 100%; margin-top: 20px">
              <table class="table-responsive" style="width: 100%">
                <thead class="bg-dark">
                  <tr>
                    <th width="5%">NO PO</th>
                    <th width="10%">KD Product</th>
                    <th width="10%">Qty</th>
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
                    v-for="(masbar, index) in purchaseOrderss[selectedPage]"
                    :key="masbar.kdbar"
                    :class="{ 'bg-canvas': index % 2 == 0 }">
                    <td>
                      <input
                        type="checkbox"
                        :id="'select' + masbar.kdbar"
                        :value="masbar.kdbar"
                        @change="selectItems"
                        :checked="masbar.checked" />
                    </td>
                    <td>{{ masbar.no }}</td>
                    <td>{{ masbar.kdbar }}</td>
                    <td style="text-align: left">
                      {{ masbar.nm_jenis }}
                    </td>
                    <td style="text-align: left">
                      {{ masbar.nmbar }}
                    </td>
                    <td>{{ masbar.nm_stok }}</td>
                    <td>
                      <select
                        style="width: 99%; height: 40px; border-radius: 5px"
                        v-model="masbar.kdstn"
                        :id="`satuan${masbar.kdbar}`"
                        @change="addKdstn(masbar.kdbar)"
                        :disabled="masbar.readonly">
                        <spinner
                          style="position: absolute; top: 5px"
                          :id="`spinner${masbar.kdbar}`"></spinner>
                      </select>
                    </td>
                    <td>
                      <input
                        class="form-input"
                        type="number"
                        style="width: 80%"
                        :id="'price' + masbar.kdbar"
                        :readonly="masbar.readonly"
                        v-on:keydown.enter="addPrice(masbar.kdbar)"
                        :value="masbar.price" />
                    </td>
                    <td>
                      <input
                        class="form-input"
                        type="number"
                        style="width: 70%"
                        :id="'disc' + masbar.kdbar"
                        :readonly="masbar.readonly"
                        v-on:keydown.enter="addDisc(masbar.kdbar)"
                        :value="masbar.disc" />
                    </td>
                    <td>
                      <input
                        class="form-input"
                        type="number"
                        style="width: 70%"
                        :id="'ppn' + masbar.kdbar"
                        v-model="vat" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="page-wrapper" v-if="total_page.length > 0">
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
            </div>

            <button
              class="btn-block btn-success"
              style="margin-top: 20px; width: 100%"
              @click="submitContract">
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
import Spinner from "@/components/Spinner.vue";
import Notification from "@/components/Notification.vue";
import NotificationAlert from "@/components/NotificationAlert.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import Loader from "@/components/Loader.vue";
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import axios from "axios";

export default {
  name: "CreateContractView",
  components: {
    SidebarVue,
    NavbarVue,
    Loader,
    Notification,
    NotificationAlert,
    AlertConfirm,
    Spinner,
  },
  data() {
    return {
      sidebarWidth: 0,
      contentwidth: 0,
      success: false,
      message: null,
      showNotif: false,
      showAlert: false,
      showNotifAlert: false,
      title: null,
      alertMessage: null,
      methods: null,
      sheaders: null,
      url: null,
      item: null,
      contract: {
        sup_kd: null,
        currency: null,
        divisi_kd: null,
        subdiv_kd: null,
        rate: null,
        top: null,
        start_date: null,
        end_date: null,
        note: null,
        items: [],
      },
      error: {
        sup_kd: null,
        currency: null,
        divisi_kd: null,
        subdiv_kd: null,
        rate: null,
        top: null,
        start_date: null,
        end_date: null,
      },
      authToken: null,
      purchaseOrders: null,
      suppliers: null,
      purchaseOrderss: [],
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
      kdjns: "all",
      jenis: null,
    };
  },
  mounted() {
    this.getJenis();
    this.getVat();
    this.getDivisi();
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    if (!this.permission.includes("create-contract"))
      window.location.href = "/";
  },
  methods: {
    async getJenis() {
      try {
        const { data } = await axios.get(`/alljenis/${this.authToken}`);
        this.jenis = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getDivisi() {
      try {
        const { data } = await axios.get(`/divisi/${this.authToken}`);
        this.divisi = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getSubdiv() {
      try {
        const { data } = await axios.get(
          `/subdivisi/${this.contract.divisi_kd}/${this.authToken}`
        );
        this.subdivisi = data;
      } catch (error) {
        console.log(error);
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

    async getVat() {
      try {
        const { data } = await axios.get(`/tarif/${this.authToken}`);
        this.vat = data.tarif;
        this.getProduct();
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

    async getProduct() {
      try {
        this.purchaseOrders = [];
        const newPurchaseOrders = [];
        this.purchaseOrderss = [];
        this.total_page = [];

        this.isLoading = true;
        const url = `/receiving/${this.authToken}`;
        console.log(url);

        const { data } = await axios.get(url);
        this.purchaseOrders = data;
        this.total_page = [];
        const groupSize = this.perpage;

        let urut = 1;
        this.purchaseOrders.forEach((data) => {
          data.no = urut;
          data.checked = false;
          data.readonly = true;
          data.price = null;
          data.disc = null;
          data.ppn = this.vat;
          data.kdstn = null;
          newPurchaseOrders.push(data);
          urut++;
        });

        this.pagelength = this.purchaseOrders.length;
        for (let i = 0; i < newPurchaseOrders.length; i += groupSize) {
          this.purchaseOrderss.push(newPurchaseOrders.slice(i, i + groupSize));
        }

        for (let i = 0; i < this.purchaseOrderss.length; i++) {
          this.total_page.push(i);
        }

        this.isLoading = false;
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
    async selectItems(e) {
      if (e.target.checked === true) {
        this.purchaseOrderss.filter((data) =>
          data.filter(async (obj) => {
            if (obj.kdbar === e.target._value) {
              obj.readonly = false;
              obj.checked = true;

              document.getElementById(`spinner${obj.kdbar}`).style.display =
                "block";
              var select = document.getElementById(`satuan${obj.kdbar}`);
              if (select.length <= 0) {
                const { data } = await axios.get(
                  `/satuanbeli/${obj.kdbar}/${this.authToken}`
                );
                const msatuan = data;
                msatuan.forEach((data) => {
                  var option = document.createElement("option");
                  option.text = data.nm_stn;
                  option.value = data.kdstn;
                  select.appendChild(option);
                });
              }

              document.getElementById(`spinner${obj.kdbar}`).style.display =
                "none";
            }
          })
        );
      }

      if (e.target.checked === false) {
        this.purchaseOrderss.filter((data) =>
          data.filter((obj) => {
            if (obj.kdbar === e.target._value) {
              obj.readonly = true;
              obj.price = null;
              obj.disc = null;
              obj.kdstn = null;
              obj.checked = false;

              // var select = document.getElementById(`satuan${obj.kdbar}`);
              // var options = select.options;
              // console.log(options)
              // for (var i = 0; i <= select.length; i++) {
              //     options.remove(i);
              //     // select.removeChild(options[i]);
              // }
            }
          })
        );
      }
    },
    addPrice(id) {
      this.purchaseOrderss.filter((data) =>
        data.filter((obj) => {
          if (obj.kdbar === id) {
            obj.price = parseFloat(document.getElementById(`price${id}`).value);
            obj.disc = parseFloat(document.getElementById(`disc${id}`).value);
            this.success = true;
            this.message = `Price added for items ${id}`;
            this.showNotif = true;

            setTimeout(() => {
              this.showNotif = false;
              this.success = false;
              this.message = null;
            }, 1300);
          }
        })
      );
    },
    addDisc(id) {
      this.purchaseOrderss.filter((data) =>
        data.filter((obj) => {
          if (obj.kdbar === id) {
            obj.price = parseFloat(document.getElementById(`price${id}`).value);
            obj.disc = parseFloat(document.getElementById(`disc${id}`).value);
            this.success = true;
            this.message = `Disc added for items ${id}`;
            this.showNotif = true;

            setTimeout(() => {
              this.showNotif = false;
              this.success = false;
              this.message = null;
            }, 1300);
          }
        })
      );
    },
    addKdstn(id) {
      this.purchaseOrderss.filter((data) =>
        data.filter((obj) => {
          if (obj.kdbar === id) {
            console.log(obj.kdstn);
          }
        })
      );
    },
    async submitContract() {
      try {
        this.contract.items = [];
        this.purchaseOrderss.forEach((data) =>
          data.forEach((obj) => {
            if (obj.price && obj.kdstn) {
              this.contract.items.push(obj);
            }
          })
        );

        this.title = "Confirmation";
        this.alertMessage = `Are you sure want to submit Transaction ?`;
        this.methods = "post";
        this.url = `/contractsupplier/${this.authToken}`;
        this.sheaders = null;
        this.item = this.contract;
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
        window.location.href = "/contract";
      }, 1300);
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
    searching() {
      this.purchaseOrderss = [];
      this.total_page = [];
      this.start = 0;
      this.end = 8;
      this.perpage = 10;

      const searchTerm = "*" + this.searchItem + "*";
      const wildcardRegex = new RegExp(
        "^" + searchTerm.replace(/\*/g, ".*") + "$",
        "i"
      );
      const matchingObjects = this.purchaseOrders.filter((obj) =>
        Object.values(obj).some(
          (value) => typeof value === "string" && wildcardRegex.test(value)
        )
      );

      let j = 1;
      const newPurchaseOrders = [];
      this.pagelength = matchingObjects.length;
      matchingObjects.forEach((data) => {
        data.no = j;
        newPurchaseOrders.push(data);
        j++;
      });

      for (
        let i = 0;
        i < newPurchaseOrders.length;
        i += parseInt(this.perpage)
      ) {
        this.purchaseOrderss.push(
          newPurchaseOrders.slice(i, i + parseInt(this.perpage))
        );
      }

      for (let a = 0; a < this.purchaseOrderss.length; a++) {
        this.total_page.push(a);
      }
    },
  },
};
</script>

<style></style>

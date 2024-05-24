<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Master Jenis</h2>
          </div>

          <!-- <div style="
            position: absolute; 
            top: 20px; 
            right: 20px;
            width: 50%;
            display: flex;
            flex-direction: row;
            justify-content: end;
            gap: 10px">
              <button
                class="btn-theme" @click="createModal">
                Add New Units
              </button>
          </div> -->

          <div class="content">
            <div style="width: 100%; margin-top: 20px">
              <div class="table-navigation">
                <select
                  class="warehouse-input"
                  style="width: 80px"
                  v-model="perpage"
                  @change="getEvent">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                <!-- <div class="filter-wrapper">
                  <button class="export-btn">
                    <i class="ri-filter-3-fill"></i>
                    Filter
                  </button>

                  <button class="export-btn">
                    <i class="ri-sort-desc"></i>
                    Sort
                  </button>
                </div> -->
              </div>

              <table
                class="table-responsive"
                aria-describedby="Purchase Order Data">
                <thead class="bg-dark">
                  <tr>
                    <th style="width: 10%; border-top-left-radius: 5px">No</th>
                    <th style="width: 15%">Divisi</th>
                    <th style="width: 15%">Subdivisi</th>
                    <th style="width: 15%">Department</th>
                    <th style="width: 25%">Kode Jenis</th>
                    <th style="width: 30%">Name</th>
                    <!-- <th style="width: 20%; 
                    border-top-right-radius: 5px">
                      Action
                    </th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, idx) in masters[selectedPage]"
                    :key="item.no"
                    :class="{ 'bg-canvas': idx % 2 == 0 }"
                    style="height: 50px">
                    <td>{{ item.no }}</td>
                    <td>{{ item.div_nm }}</td>
                    <td>{{ item.subdiv_nm }}</td>
                    <td>{{ item.dept_nm }}</td>
                    <td>{{ item.kd_jenis }}</td>
                    <td>{{ item.nm_jenis }}</td>
                    <!-- <td>
                          <button class="btn-theme" 
                                  @click="editModal(item)">
                            Edit
                          </button>

                          <button class="btn-danger"
                                  style="margin-left: 10px"
                                  @click="showingAlert(item)">
                            Delete
                          </button>
                        </td> -->
                  </tr>
                </tbody>
              </table>

              <div class="page-wrapper" v-if="total_page.length > 0">
                <div style="width: 50%">
                  <span style="font-size: 10pt">
                    Showing {{ masters[selectedPage][0].no }} to
                    {{
                      masters[selectedPage][masters[selectedPage].length - 1].no
                    }}
                    of {{ arrlength }} entries.
                  </span>
                </div>
                <div
                  style="
                    width: 50%;
                    display: flex;
                    flex-direction: row;
                    justify-content: end;
                  ">
                  <div class="page-prev">Previous</div>
                  <div
                    class="page"
                    v-for="pg in total_page"
                    :key="pg"
                    :class="{
                      'page-active': selectedPage === pg,
                      'page-unactive': selectedPage !== pg,
                    }"
                    @click="selectedPage = pg">
                    {{ pg + 1 }}
                  </div>
                  <div class="page-next">Next</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <create-unit-modal
    v-if="showCreate"
    :tittle="tittle"
    :url="select"
    @closed="onClosedModal"
    @onResolve="resolveResponse">
  </create-unit-modal>

  <edit-unit-modal
    v-if="showEdit"
    :tittle="tittle"
    :url="select"
    :master="selectedUnit"
    @closed="onClosedModal"
    @onResolve="resolveResponse">
  </edit-unit-modal>

  <notification v-if="showNotification" :message="message" :success="succes">
  </notification>

  <alert-confirm
    v-if="showAlert"
    :title="tittle"
    :message="deleteMessage"
    :methods="methods"
    :url="url"
    :header="sheaders"
    :data="item"
    @onClosed="onClose"
    @onResolve="deleteItem">
  </alert-confirm>
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import CreateUnitModal from "@/components/CreateUnitModal.vue";
import EditUnitModal from "@/components/EditUnitModal.vue";
import Notification from "@/components/Notification.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import axios from "axios";

export default {
  name: "SatuanJenisView",
  components: {
    SidebarVue,
    NavbarVue,
    CreateUnitModal,
    EditUnitModal,
    Notification,
    AlertConfirm,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      allselected: false,
      showCreate: false,
      showEdit: false,
      showNotification: false,
      showAlert: false,
      master: [],
      masters: [],
      total_page: [],
      selectedPage: 0,
      selectedUnit: {},
      perpage: 10,
      select: "satuan",
      tittle: "",
      message: null,
      deleteMessage: null,
      succes: false,
      url: null,
      arrlength: 0,
      sheaders: {},
      item: {},
      authToken: null,
      perm: null,
      permission: [],
    };
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    if (!this.permission.includes("master-jenis")) this.$router.back();
  },
  mounted() {
    this.getMaster();
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    onClose(value) {
      this.showAlert = value;
      this.deleteMessage = null;
      this.title = false;
      this.url = null;
      this.methods = null;
    },
    showingAlert(data) {
      this.selectedID = data.kd_jenis;
      this.tittle = "Confirmation";

      this.item = { kd_jenis: data.kd_jenis };
      this.deleteMessage = `Are you sure want to delete ${data.nm_jenis} ?`;

      this.methods = "delete";
      this.url = `/masbarjenis/${this.authToken}`;
      this.sheaders = null;
      this.showAlert = true;
    },
    deleteItem(data) {
      this.showAlert = false;
      this.message = data.message;
      this.succes = true;
      this.showNotification = true;

      setTimeout(() => {
        this.message = null;
        this.succes = false;
        this.showNotification = false;
        window.location.reload();
      }, 1300);
    },
    async getMaster() {
      const groupSize = this.perpage;
      this.masters = [];
      this.total_page = [];

      const { data } = await axios.get(`/masbarjenis/${this.authToken}`);

      this.master = data;
      this.arrlength = this.master.length;
      this.master.forEach((data, index) => {
        data["no"] = index + 1;
      });

      for (let i = 0; i < this.master.length; i += groupSize) {
        this.masters.push(this.master.slice(i, i + groupSize));
      }

      for (let i = 0; i < this.masters.length; i++) {
        this.total_page.push(i);
      }
    },
    getFooImage(filename) {
      return "/images/foods/" + filename;
    },
    setStatus(value) {
      if (value) return "Active";
      else return "Not Active";
    },
    onClosedModal(value) {
      this.showCreate = value;
      this.showEdit = value;
    },
    editModal(item) {
      console.log(item);
      this.tittle = "Edit Master Jenis";
      this.selectedUnit = {
        kd_jenis: item.kd_jenis,
        nm_jenis: item.nm_jenis,
      };

      this.showEdit = true;
    },
    createModal() {
      if (this.select === "jenis") this.tittle = "Add New Master Jenis";
      else this.tittle = "Add New Master Satuan";

      this.showCreate = true;
    },
    resolveResponse(data) {
      this.showEdit = false;
      this.showCreate = false;

      this.message = data.message;
      this.succes = true;
      this.showNotification = true;

      setTimeout(() => {
        this.message = null;
        this.succes = false;
        this.showNotification = false;
        window.location.reload();
      }, 1300);
    },
  },
};
</script>

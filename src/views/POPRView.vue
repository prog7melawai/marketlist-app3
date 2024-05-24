<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title pl-30">
            <i @click="$router.back()" class="ri-arrow-left-circle-fill" back-btn></i>
            <h2>Data PO from PR Number {{ this.$route.params.id }}</h2>
          </div>

          <button
            class="btn-theme"
            v-if="isCreator"
            style="position: absolute; top: 20px; right: 20px"
            @click="createPO">
            Add New PO
          </button>

          <div class="content">
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
                <span class="pr-contact">{{ selectedPR.subdiv_kd }}</span>
                <span class="pr-address">{{ selectedPR.div_kd }}</span>

                <span class="pr-deliver">User Created:</span>
                <span class="pr-company">
                  <img
                    src="/images/user/user.png"
                    alt="logo"
                    style="width: 25px"
                  />
                  <span class="pr-department">{{ selectedPR.cruser }}</span>
                </span>
              </div>
            </div>

            <div style="width: 100%; margin-top: 20px">
              <div class="table-navigation">
                <select
                  class="warehouse-input"
                  style="width: 80px"
                  v-model="perpage"
                  @change="getEvent"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <table
                class="table-responsive"
                aria-describedby="Purchase Order Data"
              >
                <thead class="bg-dark">
                  <tr>
                    <th style="width: 5%; border-top-left-radius: 5px">No</th>
                    <th style="width: 15%">PO Number</th>
                    <th style="width: 10%">PO Date</th>
                    <th style="width: 10%">Divisi</th>
                    <th style="width: 10%">Subdivisi</th>
                    <th style="width: 15%">Department</th>
                    <th style="width: 15%">Supplier</th>
                    <th style="width: 15">Status</th>
                    <th style="width: 15%; border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(po, idx) in prs[selectedPage]"
                    :key="po.pr_no"
                    :class="{ 'bg-canvas': idx % 2 == 0}"
                    style="height: 50px"
                  >
                    <td>{{ po.no }}</td>
                    <td>{{ po.po_no }}</td>
                    <td>{{ po.po_date }}</td>
                    <td>{{ po.divisi_nm }}</td>
                    <td>{{ po.subdiv_nm }}</td>
                    <td>{{ po.dept_nm }}</td>
                    <td>{{ po.sup_nm }}</td>
                    <td>
                        <span
                          :class="{
                            'capsule-theme': po.user_conf,
                            'capsule-warning': !po.user_batal && !po.user_conf === true,
                            'capsule-danger': po.user_batal,
                          }"
                        >
                          <span v-if="po.user_conf">Approved</span>
                          <span v-if="!po.user_conf && !po.user_batal">Waiting</span>
                          <span v-if="po.user_batal">Decline</span>
                        </span>
                    </td>
                    <td
                      style="
                        display: flex;
                        flex-direction: row;
                        justify-content: start;
                        flex-wrap: wrap;
                        padding-left: 20px;
                        gap: 5px;
                      "
                    >
                      <button
                        class="btn-theme"
                        style="width: 80px"
                        @click="
                          this.$router.push({
                            name: 'po-detail',
                            params: { id: po.po_no },
                          })
                        "
                      >
                        Details
                      </button>

                      <button 
                        class="btn-success"
                        style="width: 80px"
                        v-if="po.user_batal && isCreator"
                        @click="this.$router.push(`/create-po-manual/${po.po_no}`)">
                        Create New
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="page-wrapper" v-if="total_page.length > 0">
                <div style="width: 50%">
                  <span style="font-size: 10pt">
                    Showing {{ prs[selectedPage][0].no }} to
                    {{ prs[selectedPage][prs[selectedPage].length - 1].no }} of
                    {{ pr.length }} entries.
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
                  <div class="page-prev">Previous</div>
                  <div
                    class="page"
                    v-for="pg in total_page"
                    :key="pg"
                    :class="{
                      'page-active': selectedPage === pg,
                      'page-unactive': selectedPage !== pg,
                    }"
                    @click="selectedPage = pg"
                  >
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

  <create-po-modal
    tittle="Create New PO"
    v-if="showCreate"
    :pr="prno"
    @onClosed="onClosedModal"
    @onSubmit="submitPO">
  </create-po-modal>

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
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import CreatePoModal from "@/components/CreatePOModal.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import axios from "axios";

export default {
  name: "POView",
  components: {
    SidebarVue,
    NavbarVue,
    CreatePoModal,
    AlertConfirm,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      allselected: false,
      showCreate: false,
      showEdit: false,
      showAlert: false,
      pr: [],
      prs: [],
      total_page: [],
      selectedPage: 0,
      selectedPR: {},
      perpage: 10,
      pr_no: null,
      prno: null,
      error: {
        pr_no: null,
      },
      authToken: null,
      isCreator: false,
    };
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission
    this.permission = this.perm.split(",")
    if(!this.permission.includes('pobypr')) this.$router.back()
    this.isCreator = this.permission.includes('create-po')
  },
  mounted() {
    this.getPO();
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
        const { data } = await axios.get(
          `/find-po/${this.$route.params.id}/${this.authToken}`
        );

        this.pr = data;

        const groupSize = this.perpage;
        const newPR = [];
        this.prs = [];
        this.total_page = [];

        let j = 1;
        this.pr.forEach((data) => {
          data.no = j;
          newPR.push(data);
          j++;
        });

        for (let i = 0; i < newPR.length; i += groupSize) {
          this.prs.push(newPR.slice(i, i + groupSize));
        }

        for (let i = 0; i < this.prs.length; i++) {
          this.total_page.push(i);
        }

        this.getPR();
      } catch (error) {
        console.log(error);
      }
    },
    async getPR() {
      try {
        const { data } = await axios.get(`/prdetail2/all/${this.$route.params.id}/${this.authToken}`)
        this.selectedPR = data
        this.isLoading = false;
      } catch(error){
        if(error.response.status == 401){
          this.$store.dispatch("LOGOUT")
          .then(() => {
              this.$router.push({ name: 'login'});
          }).catch(() => {
              this.$router.push({ name: 'login'});
          });
        }
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
    },
    createPO(){
      this.prno = this.$route.params.id
      this.showCreate = true
    },
    async submitPO(value) {
      this.showCreate = false;
      this.title = "Confirmation";
      this.alertMessage = `Are you sure want to submit Transaction ?`;
      this.methods = "post";
      this.url = `/pobarang/${this.authToken}`;
      this.sheaders = null;
      this.item = value;
      this.showAlert = true;
    },
    submitted(value) {
      this.showAlert = false;
      this.$toast.open({
          message: value.message,
          type: 'info',
          duration: 1000,
      });

      setTimeout(() => {
        window.location.href = `/po/${this.$route.params.id}`;
      }, 1000);
    },
    editModal(item) {
      this.showEdit = true;
      this.selectedFood = item;
    },
    onError(value){
      this.showAlert = false      
      this.$toast.open({
          message: value.message,
          type: 'error',
          duration: 1000,
      });   
    },
    onClosed(value) {
      this.showAlert = value;
    },
  },
};
</script>

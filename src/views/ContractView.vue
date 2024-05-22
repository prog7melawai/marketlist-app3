<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Contract</h2>
          </div>

          <button
            class="btn-theme"
            v-if="isCreate"
            style="position: absolute; top: 20px; right: 20px"
            @click="this.$router.push('/create-contract')">
            Add New Contract
          </button>

          <div class="content">
            <div style="width: 100%; margin-top: 20px">
              <div class="table-navigation">
                <select
                  class="warehouse-input"
                  style="width: 80px"
                  v-model="perpage"
                  @change="getContracts"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                <div class="filter-wrapper" style="top: 40px">
                  <div
                    class="filter-dialog"
                    style="margin-right: 60px"
                    v-if="showFilter"
                  >
                    <div
                      class="sort-item"
                      @click="setFilter('Pending')"
                      :class="{ 'sort-active': selectedFilter === 'Pending' }"
                    >
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedFilter === 'Pending'"
                        >
                        </i>
                      </div>

                      <span style="margin-top: -3px">Pending</span>
                    </div>

                    <div
                      class="sort-item"
                      @click="setFilter('Approved PR')"
                      :class="{
                        'sort-active': selectedFilter === 'Approved PR',
                      }"
                    >
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedFilter === 'Approved PR'"
                        >
                        </i>
                      </div>

                      <span style="margin-top: -3px">Approved PR</span>
                    </div>

                    <div
                      class="sort-item"
                      @click="setFilter('Approved PO')"
                      :class="{
                        'sort-active': selectedFilter === 'Approved PO',
                      }"
                    >
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedFilter === 'Approved PO'"
                        >
                        </i>
                      </div>

                      <span style="margin-top: -3px">Approved PO</span>
                    </div>

                    <div
                      class="sort-item"
                      @click="setFilter('Completed')"
                      :class="{ 'sort-active': selectedFilter === 'Completed' }"
                    >
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedFilter === 'Completed'"
                        >
                        </i>
                      </div>

                      <span style="margin-top: -3px">Completed</span>
                    </div>
                  </div>

                  <div class="filter-dialog" v-if="showSort">
                    <div
                      class="sort-item"
                      @click="setSort('date')"
                      :class="{ 'sort-active': selectedSort === 'date' }"
                    >
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedSort === 'date'"
                        >
                        </i>
                      </div>

                      <span style="margin-top: -3px">Sort by Date</span>
                    </div>

                    <div
                      class="sort-item"
                      @click="setSort('status')"
                      :class="{ 'sort-active': selectedSort === 'status' }"
                    >
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedSort === 'status'"
                        >
                        </i>
                      </div>

                      <span style="margin-top: -3px">Sort by Status</span>
                    </div>
                  </div>
                </div>

                <div
                  class="search-container"
                  style="margin-right: 0px; height: 38px"
                >
                  <input
                    type="text"
                    class="form-input"
                    style="width: 100%"
                    placeholder="Search Contract..."
                    v-model="searchItem"
                    @keyup.enter="searching"
                  />
                </div>
              </div>

              <table
                class="table-responsive"
                aria-describedby="Purchase Review Data"
              >
                <thead class="bg-dark">
                  <tr>
                    <th style="width: 5%; border-top-left-radius: 5px">No</th>
                    <th style="width: 15%">Contract Number</th>
                    <th style="width: 10%">Supplier</th>
                    <th style="width: 10%">Divisi</th>
                    <th style="width: 10%">Subdiv</th>
                    <th style="width: 10%">Dept</th>
                    <th style="width: 15">Status</th>
                    <th style="width: 15%; border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <loader v-if="isloading"></loader>
                <tbody v-if="!isLoading">
                  <tr
                    v-for="(contract, idx) in contracts[selectedPage]"
                    :key="contract.id"
                    :class="{ 'bg-canvas': idx % 2 == 0 }"
                  >
                    <td>{{ contract.no }}</td>
                    <td>{{ contract.kontrakno }}</td>
                    <td>{{ contract.sup_nm }}</td>
                    <td>{{ contract.div_nm }}</td>
                    <td>{{ contract.subdiv_nm }}</td>
                    <td>{{ contract.dept_nm }}</td>
                    <td>
                      <span
                        :class="{
                          'capsule-warning': !contract.tglconf && !contract.tglbatal,
                          'capsule-theme': contract.tglconf,
                          'capsule-danger': contract.tglbatal,
                        }"
                      >
                        <span v-if="!contract.tglconf && !contract.tglbatal">Waiting</span>
                        <span v-if="contract.tglconf">Approve</span>
                        <span v-if="contract.tglbatal">Decline</span>
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn-theme"
                        @click="
                          this.$router.push({
                            name: 'contract-detail',
                            params: { id: contract.kontrakno },
                          })
                        "
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="page-wrapper" v-if="total_page.length > 0">
                <div style="width: 50%">
                  <span style="font-size: 10pt">
                    Showing {{ contracts[selectedPage][0].no }} to
                    {{ contracts[selectedPage][contracts[selectedPage].length - 1].no }} of
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
                    :disabled="start < 5"
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
                    :disabled="total_page.length < end "
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
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import Loader from "@/components/Loader.vue";
import axios from "axios";

export default {
  name: "ContractView",
  components: {
    SidebarVue,
    NavbarVue,
    Loader,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      allselected: false,
      showCreate: false,
      showEdit: false,
      contract: [],
      contracts: [],
      total_page: [],
      selectedPage: 0,
      selectedPR: {},
      perpage: 10,
      showSort: false,
      showFilter: false,
      selectedSort: null,
      selectedFilter: null,
      start: 0,
      end: 8,
      searchItem: null,
      pagelength: 0,
      authToken: null,
      perm: null,
      permission: [],
      isDownload: false,
      isLoading: false,
      isCreate: false,
    };
  },
  mounted() {
    this.getContracts(); 
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    if (!this.permission.includes("contract")) this.$router.back()
    this.isCreate = this.permission.includes("create-contract")
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    async getContracts() {
      this.isLoading = true;
      const groupSize = this.perpage;
      const newPR = [];

      try {
        const { data } = await axios.get(`/contractsupplier/${this.authToken}`);
        this.contract = data;

        console.log(this.contract)
        this.total_page = [];
      
        let nou = 1;
        this.contract.forEach((data) => {
          data.no = nou
          newPR.push(data);
          nou++
        });

        this.pagelength = this.contract.length;
        for (let i = 0; i < newPR.length; i += groupSize) {
          this.contracts.push(newPR.slice(i, i + groupSize));
        }

        for (let i = 0; i < this.contracts.length; i++) {
          this.total_page.push(i);
        }

        this.isLoading = false;
      } catch (error) {
        if (error.response.status == 401) {
          this.$toast.open({
              message: error.response.data.message,
              type: 'error',
              duration: 1000,
          });

          this.$store
            .dispatch("LOGOUT")
            .then(() => {
              this.$router.push({ name : 'login' });
            })
            .catch(() => {
              this.$router.push({ name : 'login' });
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
      this.showEdit = value;
    },
    editModal(item) {
      this.showEdit = true;
      this.selectedFood = item;
    },
    showingSort() {
      this.showFilter = false;
      if (this.showSort) this.showSort = false;
      else this.showSort = true;
    },
    showingFilter() {
      this.showSort = false;
      if (this.showFilter) this.showFilter = false;
      else this.showFilter = true;
    },
    setSort(value) {
      this.selectedSort = value;
    },
    setFilter(value) {
      this.selectedFilter = value;
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
    searching() {
      this.contracts = [];
      this.total_page = [];
      this.start = 0;
      this.end = 8;

      const searchTerm = "*" + this.searchItem + "*";
      const wildcardRegex = new RegExp(
        "^" + searchTerm.replace(/\*/g, ".*") + "$",
        "i"
      );
      const matchingObjects = this.contract.filter((obj) =>
        Object.values(obj).some(
          (value) => typeof value === "string" && wildcardRegex.test(value)
        )
      );

      let j = 1;
      const newContract = [];
      this.pagelength = matchingObjects.length;
      matchingObjects.forEach((data) => {
        data.no = j;
        newContract.push(data);
        j++;
      });

      for (let i = 0; i < newContract.length; i += parseInt(this.perpage)) {
        this.contracts.push(newContract.slice(i, i + parseInt(this.perpage)));
      }

      for (let a = 0; a < this.contracts.length; a++) {
        this.total_page.push(a);
      }
    },
    changePerPage() {
      this.contracts = [];
      this.total_page = [];
      this.start = 0;
      this.end = 8;

      let j = 1;
      const newContract = [];
      this.pagelength = this.contract.length;
      this.contract.forEach((data) => {
        data.no = j;
        newContract.push(data);
        j++;
      });

      for (let i = 0; i < newContract.length; i += parseInt(this.perpage)) {
        this.contracts.push(newContract.slice(i, i + parseInt(this.perpage)));
      }

      for (let a = 0; a < this.contracts.length; a++) {
        this.total_page.push(a);
      }
    },
  },
};
</script>

<style>

</style>

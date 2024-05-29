<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Receiving</h2>
          </div>

          <button
            class="btn-theme"
            v-if="isCreate"
            style="position: absolute; top: 20px; right: 180px"
            @click="getSortedData">
            Sort Asc/Desc by Date
          </button>

          <button
            class="btn-theme"
            v-if="isCreate"
            style="position: absolute; top: 20px; right: 20px"
            @click="this.$router.push('/create-receive')">
            Add New Receiving
          </button>

          <div class="content">
            <div style="width: 100%; margin-top: 20px">
              <div class="table-navigation">
                <select
                  class="warehouse-input"
                  style="width: 80px"
                  v-model="perpage"
                  @change="changePerPage">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                <div class="filter-wrapper" style="top: 40px">
                  <div
                    class="filter-dialog"
                    style="margin-right: 60px"
                    v-if="showFilter">
                    <div
                      class="sort-item"
                      @click="setFilter('Pending')"
                      :class="{ 'sort-active': selectedFilter === 'Pending' }">
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedFilter === 'Pending'">
                        </i>
                      </div>

                      <span style="margin-top: -3px">Pending</span>
                    </div>

                    <div
                      class="sort-item"
                      @click="setFilter('Approved PR')"
                      :class="{
                        'sort-active': selectedFilter === 'Approved PR',
                      }">
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedFilter === 'Approved PR'">
                        </i>
                      </div>

                      <span style="margin-top: -3px">Approved PR</span>
                    </div>

                    <div
                      class="sort-item"
                      @click="setFilter('Approved PO')"
                      :class="{
                        'sort-active': selectedFilter === 'Approved PO',
                      }">
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedFilter === 'Approved PO'">
                        </i>
                      </div>

                      <span style="margin-top: -3px">Approved PO</span>
                    </div>

                    <div
                      class="sort-item"
                      @click="setFilter('Completed')"
                      :class="{
                        'sort-active': selectedFilter === 'Completed',
                      }">
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedFilter === 'Completed'">
                        </i>
                      </div>

                      <span style="margin-top: -3px">Completed</span>
                    </div>
                  </div>

                  <div class="filter-dialog" v-if="showSort">
                    <div
                      class="sort-item"
                      @click="setSort('date')"
                      :class="{ 'sort-active': selectedSort === 'date' }">
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedSort === 'date'">
                        </i>
                      </div>

                      <span style="margin-top: -3px">Sort by Date</span>
                    </div>

                    <div
                      class="sort-item"
                      @click="setSort('status')"
                      :class="{ 'sort-active': selectedSort === 'status' }">
                      <input type="radio" hidden />

                      <div style="width: 20px">
                        <i
                          class="ri-check-fill checkmark"
                          v-if="selectedSort === 'status'">
                        </i>
                      </div>

                      <span style="margin-top: -3px">Sort by Status</span>
                    </div>
                  </div>
                </div>

                <div
                  class="search-container"
                  style="margin-right: 0px; height: 38px; width: 327px">
                  <input
                    type="text"
                    class="form-input"
                    style="width: 100%"
                    placeholder="Search Receiving..."
                    v-model="searchItem"
                    @keyup.enter="searching" />
                </div>
              </div>

              <table
                class="table-responsive"
                aria-describedby="Purchase Review Data">
                <thead class="bg-dark">
                  <tr>
                    <th style="width: 10%">No Karcis</th>
                    <th style="width: 10%">Tanggal</th>
                    <th style="width: 16%">Divisi</th>
                    <th style="width: 16%">Subdivisi</th>
                    <th style="width: 16%">Department</th>
                    <th style="width: 16%">Status</th>
                    <th style="width: 16%; border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <loader v-if="isLoading"></loader>
                <tbody v-if="!isLoading">
                  <tr
                    v-for="(po, idx) in purchaseOrderss[selectedPage]"
                    :key="po.pr_no"
                    :class="{ 'bg-canvas': idx % 2 == 0 }">
                    <td>{{ po.no_karcis }}</td>
                    <td>{{ po.tgl_karcis }}</td>
                    <td>{{ po.divisi_kd }}</td>
                    <td>{{ po.subdiv_kd }}</td>
                    <td>{{ po.dept_kd }}</td>
                    <td>{{ po.statusacc }}</td>
                    <td>
                      <button
                        class="btn-theme"
                        style="width: 80px"
                        @click="
                          this.$router.push({
                            name: 'receivingdetails',
                            params: { no_karcis: po.no_karcis },
                          })
                        ">
                        Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="page-wrapper" v-if="total_page.length > 0">
                <div style="width: 50%">
                  <span style="font-size: 10pt">
                    Showing {{ purchaseOrderss[selectedPage]?.[0].no }} to
                    {{
                      purchaseOrderss[selectedPage][
                        purchaseOrderss[selectedPage]?.length - 1
                      ]?.no
                    }}
                    of {{ pagelength }} entries.
                  </span>
                </div>

                <!-- button next prev -->
                <div
                  style="
                    width: 50%;
                    display: flex;
                    flex-direction: row;
                    justify-content: end;
                  ">
                  <button
                    class="page-prev"
                    :disabled="start < 5"
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
                    :disabled="total_page.length < end"
                    :class="{ 'paginate-active': total_page.length > end }"
                    class="page-next"
                    @click="nextPagination">
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
      purchaseOrderss: [],
      purchaseOrders: [],
      showFilter: false,
      showSort: false,
      isLoading: false,
      end: 8,
      start: false,
      sidebarWidth: "18%",
      contentWidth: "78%",
      allselected: false,
      showCreate: false,
      showEdit: false,
      total_page: [],
      selectedPage: 0,
      selectedPR: {},
      perpage: 10,
      pr_no: null,
      error: {
        pr_no: null,
      },
      authToken: null,
      searchFood: null,
      searchItem: null,
      isCreate: false,
      pagelength: 0,
      sortUrl: null,
    };
  },
  mounted() {
    // Fetch data from your API when the component is mounted

    this.fetchPurchaseOrders();
  },
  methods: {
    searching() {
      this.purchaseOrderss = [];
      this.total_page = [];
      this.start = 0;
      this.end = 8;

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
    async fetchPurchaseOrders() {
      const groupSize = this.perpage;
      const newPO = [];
      this.purchaseOrders = [];
      this.purchaseOrderss = [];
      this.total_page = [];
      try {
        const { data } = await axios.get(
          `recv/${this.sortUrl}/${this.authToken}`
        );
        this.purchaseOrders = data;

        this.purchaseOrders.forEach((data) => {
          newPO.push(data);
        });

        this.pagelength = this.purchaseOrders.length;
        for (let i = 0; i < newPO.length; i += groupSize) {
          this.purchaseOrderss.push(newPO.slice(i, i + groupSize));
        }

        for (let i = 0; i < this.purchaseOrderss.length; i++) {
          this.total_page.push(i);
        }
        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
      }
    },
    // async postPurchaseOrders(purchaseOrders) {
    //   // Post the fetched data to another endpoint
    //   axios
    //     .post(`/recv/asdf/${this.authToken}`, purchaseOrders)
    //     .then((response) => {
    //       console.log("Data posted successfully:", response.data);
    //       // Handle response if needed
    //     })
    //     .catch((error) => {
    //       console.error("Error posting data:", error);
    //       // Handle error if needed
    //     });
    // },

    redirectToDetails(prNo) {
      this.$router.push({
        name: "pr-po",
        params: { id: prNo },
      });
    },

    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },

    changePerPage() {
      this.purchaseOrderss = [];
      this.total_page = [];
      this.start = 0;
      this.end = 8;

      let j = 1;
      const newPurchaseOrders = [];
      this.pagelength = this.purchaseOrders.length;
      this.purchaseOrders.forEach((data) => {
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

    getSortedData() {
      if (this.sortUrl === "ASC") {
        this.sortUrl = "DESC";

        this.fetchPurchaseOrders();
      } else {
        this.sortUrl = "ASC";

        this.fetchPurchaseOrders();
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
  },

  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    if (!this.permission.includes("contract")) window.location.href = "/";
    this.isCreate = this.permission.includes("create-contract");
    this.sortUrl = "DESC";
  },
};
</script>

<style></style>

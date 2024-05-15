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

                <div class="export-wrapper">
                  <button
                    class="export-btn"
                    style="
                      border-bottom-left-radius: 5px;
                      border-top-left-radius: 5px;
                    ">
                    CSV
                  </button>
                  <button class="export-btn">XLSX</button>
                  <button
                    class="export-btn"
                    style="
                      border-bottom-right-radius: 5px;
                      border-top-right-radius: 5px;
                    ">
                    PDF
                  </button>
                </div>

                <!-- 
                  <div class="filter-wrapper">
                    <button class="export-btn" @click="showingFilter">
                      <i class="ri-filter-3-fill"></i>
                      Filter
                    </button>
  
                    <button
                      class="export-btn"
                      @click="showingSort"
                      :class="{ 'bg-gradient-orange': showSort }"
                    >
                      <i class="ri-sort-desc"></i>
                      Sort
                    </button>
                  </div>
                  -->

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
                  style="margin-right: 0px; height: 38px">
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
                    <th style="width: 15%">No Karcis</th>
                    <th style="width: 16%">Divisi</th>
                    <th style="width: 16%">Subdivisi</th>
                    <th style="width: 16%">Department</th>
                    <th style="width: 16%">Status</th>
                    <th style="width: 16%; border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <loader v-if="isloading"></loader>
                <tbody v-if="!isLoading">
                  <tr
                    v-for="(po, idx) in purchaseOrders"
                    :key="po.pr_no"
                    :class="{ 'bg-canvas': idx % 2 == 0 }">
                    <td>{{ po.no_karcis }}</td>
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
                    Showing {{ prs[selectedPage]?.[0].no }} to
                    {{ prs[selectedPage][prs[selectedPage].length - 1].no }}
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
      purchaseOrders: [],
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
      perpage: 3,
      pr_no: null,
      error: {
        pr_no: null,
      },
      authToken: null,
      searchFood: null,
      isCreate: false,
    };
  },
  mounted() {
    // Fetch data from your API when the component is mounted

    this.fetchPurchaseOrders();
  },
  methods: {
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
      try {
        const { data } = await axios.get(
          `http://172.30.14.208:9642/procurement/web/receiving/${this.authToken}`
        );
        this.purchaseOrders = data;
        console.log(this.purchaseOrders);

        this.prs = [];
        this.total_page = [];

        let j = 1;
        this.purchaseOrders.forEach((data) => {
          data.no = j;
          newPO.push(data);
          j++;
        });
        console.log(newPO);
        this.pagelength = this.purchaseOrders.length;
        for (let i = 0; i < newPO.length; i += groupSize) {
          this.prs.push(newPO.slice(i, i + groupSize));
        }

        for (let i = 0; i < this.prs.length; i++) {
          this.total_page?.push(i);
        }
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
      }
    },
    async postPurchaseOrders(purchaseOrders) {
      // Post the fetched data to another endpoint
      axios
        .post(
          `http://172.30.14.208:9642/procurement/web/receiving/${this.authToken}`,
          purchaseOrders
        )
        .then((response) => {
          console.log("Data posted successfully:", response.data);
          // Handle response if needed
        })
        .catch((error) => {
          console.error("Error posting data:", error);
          // Handle error if needed
        });
    },

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
    // async getPO() {
    //   try {
    //     const { data } = await axios.get(
    //       `/prservice/approve/${this.authToken}`
    //     );
    //     this.pr = data;
    //     console.log("oke");

    //     const groupSize = this.perpage;
    //     const newPR = [];
    //     this.prs = [];
    //     this.total_page = [];

    //     let j = 1;
    //     this.pr.forEach((data) => {
    //       data.no = j;
    //       newPR.push(data);
    //       j++;
    //     });

    //     for (let i = 0; i < newPR.length; i += groupSize) {
    //       this.prs.push(newPR.slice(i, i + groupSize));
    //     }

    //     for (let i = 0; i < this.prs.length; i++) {
    //       this.total_page.push(i);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
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
  },
};
</script>

<style></style>

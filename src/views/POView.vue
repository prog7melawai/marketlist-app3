<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Purchase Order</h2>
          </div>

          <div class="content">
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

                <div class="export-wrapper">
                  <button
                    class="export-btn"
                    style="
                      border-bottom-left-radius: 5px;
                      border-top-left-radius: 5px;
                    "
                  >
                    CSV
                  </button>
                  <button class="export-btn">XLSX</button>
                  <button
                    class="export-btn"
                    style="
                      border-bottom-right-radius: 5px;
                      border-top-right-radius: 5px;
                    "
                  >
                    PDF
                  </button>
                </div>

                <div class="filter-wrapper">
                  <button class="export-btn">
                    <i class="ri-filter-3-fill"></i>
                    Filter
                  </button>

                  <button class="export-btn">
                    <i class="ri-sort-desc"></i>
                    Sort
                  </button>
                </div>

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

                <div class="search-container"
                     style="margin-right: 140px;
                     height: 38px;">
                      <input 
                          type="text" 
                          class="form-input"
                          style="width: 100%"
                          placeholder="Search PO..."
                          v-model="searchFood"
                          @keyup.enter="searching">
                </div>
              </div>

              <table
                class="table-responsive"
                aria-describedby="Purchase Order Data"
              >
                <thead class="bg-theme">
                  <tr>
                    <th style="width: 5%; 
                    border-top-left-radius: 5px">No</th>
                    <th style="width: 20%">PO Number</th>
                    <th style="width: 20%">PO Date</th>
                    <th style="width: 20%">Supplier</th>
                    <th style="width: 10">Status</th>
                    <th style="width: 15%; 
                    border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  
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
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";

export default {
  name: "POView",
  components: {
    SidebarVue,
    NavbarVue,
  },
  data() {
    return {
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
      perpage: 10,
    };
  },
  mounted() {
    this.pr = [...this.$store.state.pr];
    this.getPR();
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    getPR() {
      const groupSize = this.perpage;
      const newPR = [];
      this.prs = [];
      this.total_page = [];
      this.pr.forEach((data) => {
        newPR.push(data);
      });

      for (let i = 0; i < newPR.length; i += groupSize) {
        this.prs.push(newPR.slice(i, i + groupSize));
      }

      for (let i = 0; i < this.prs.length; i++) {
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
      this.showEdit = true;
      this.selectedFood = item;
    },
  },
};
</script>

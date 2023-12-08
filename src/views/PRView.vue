<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Purchase Review</h2>
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
                          placeholder="Search PR..."
                          v-model="searchItem"
                          @keyup.enter="searching">
                </div>
              </div>

              <table
                class="table-responsive"
                aria-describedby="Purchase Review Data"
              >
                <thead class="bg-theme">
                  <tr>
                    <th style="width: 5%; 
                    border-top-left-radius: 5px">No</th>
                    <th style="width: 20%">PR Number</th>
                    <th style="width: 20%">PR Date</th>
                    <th style="width: 20%">Supplier</th>
                    <th style="width: 10%">Total Item</th>
                    <th style="width: 10">Status</th>
                    <th style="width: 15%; 
                    border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(pr, idx) in prs[selectedPage]"
                    :key="pr.id"
                    :class="{ 'bg-canvas': idx % 2 == 0 }"
                  >
                    <td>{{ idx + 1 }}</td>
                    <td>{{ pr.id }}</td>
                    <td>{{ pr.date }}</td>
                    <td>{{ pr.supplier }}</td>
                    <td>{{ pr.total_item }}</td>
                    <td>
                      <span
                        :class="{
                          'capsule-theme': pr.status === 'Approved PO',
                          'capsule-warning':
                            pr.status === 'Pending' ||
                            pr.status === 'Approved PR',
                          'capsule-danger': pr.status === 'Rejected',
                        }"
                      >
                        {{ pr.status }}
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn-theme"
                        @click="
                          this.$router.push({
                            name: 'pr-detail',
                            params: { id: pr.id },
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
                    Showing {{ prs[selectedPage][0].no }} to
                    {{ prs[selectedPage][prs[selectedPage].length - 1].no }} of
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
                  <button class="page-prev" @click="prevPagination"
                    :class="{'paginate-active': start >= 5}">
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
                  <button :class="{'paginate-active': total_page.length > end}"
                  class="page-next" @click="nextPagination">
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

export default {
  name: "PRView",
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
      showSort: false,
      showFilter: false,
      selectedSort: null,
      selectedFilter: null,      
      start: 0,
      end: 8,
      searchItem: null,
      pagelength: 0,
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

      this.pagelength = this.pr.length
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
    prevPagination(){
        if(this.start <= 0) return;
        this.start -= 5
        this.end -= 5
    },
    nextPagination(){
        if(this.end > this.total_page.length) {
            this.start = this.total_page.length - 5
            this.end = this.total_page.length
            return;
        }

        this.start += 5
        this.end += 5
    },
    searching(){
      this.prs = []
      this.total_page = []
      this.start = 0
      this.end = 8
      this.perpage = 10

      const searchTerm = '*' + this.searchItem + '*';
      const wildcardRegex = new RegExp('^' + searchTerm.replace(/\*/g, '.*') + '$', 'i');
      const matchingObjects = this.pr.filter(obj =>
        Object.values(obj).some(value =>
          typeof value === 'string' && wildcardRegex.test(value)
        )
      )

      let j = 1
      const newPR = []
      this.pagelength = matchingObjects.length;
      matchingObjects.forEach((data) => {
        data.no = j;
        newPR.push(data);
        j++;
      })

      for (let i = 0; i < newPR.length; i += parseInt(this.perpage)) {
        this.prs.push(newPR.slice(i, i + parseInt(this.perpage)));
      }

      for (let a = 0; a < this.prs.length; a++) {
        this.total_page.push(a);
      }
    }
  },
};
</script>

<style>
.filter-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.sort-item {
  position: relative;
  width: 100%;
  height: 50px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  background: var(--canvas);
  gap: 5px;
}

.sort-item:hover {
  background: var(--orangelight);
}

.sort-active {
  background: var(--orangelight);
}

.filter-dialog {
  position: relative;
  width: 150px;
  height: auto;
  box-shadow: 0.5px 0.3px 0.3px rgba(0, 0, 0, 0.024),
    1.6px 1.1px 0.9px rgba(0, 0, 0, 0.032), 7px 5px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  font-size: 10pt;
}

.filter-dialog .checkmark {
  font-size: 13pt;
  font-weight: bold;
  margin-left: 5px;
  margin-top: -3px;
}
</style>

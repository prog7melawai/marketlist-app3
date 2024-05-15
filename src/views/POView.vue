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
<!-- 
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
                </div> -->

                <div class="search-container"
                     style="height: 38px;">
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
                <thead class="bg-dark">
                  <tr>
                    <th style="width: 5%; 
                    border-top-left-radius: 5px">No</th>
                    <th style="width: 15%">PR Number</th>
                    <th style="width: 10%">PR Date</th>
                    <th style="width: 15%">Divisi</th>
                    <th style="width: 15%">Subdivisi</th>
                    <th style="width: 15%">Department</th>
                    <th style="width: 15">Number of PO</th>
                    <th style="width: 15%; 
                    border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(po, idx) in prs[selectedPage]" :key="po.pr_no"
                    :class="{ 'bg-canvas': idx % 2 == 0 }"
                    style="height: 50px;">
                      <td>{{ po.no }}</td>
                      <td>{{ po.pr_no }}</td>
                      <td>{{ po.pr_date }}</td>
                      <td>{{ po.div_kd }}</td>
                      <td>{{ po.subdiv_kd }}</td>
                      <td>{{ po.dept_kd }}</td>
                      <td>{{ po.total_po }}</td>
                      <td style="display: flex;
                        flex-direction: row;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 5px;">
                        <button
                          class="btn-theme"
                          style="width: 80px"
                          @click="
                            this.$router.push({
                              name: 'pr-po',
                              params: { id: po.pr_no },
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
import axios from "axios";

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
      pr_no: null,
      error: {
        pr_no: null,
      },
      authToken: null,
      searchFood: null,
    };
  },
  created(){
    this.authToken = this.$store.getters.GET_AUTH_TOKEN
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
        const { data } = await axios.get(`/approvedpr/${this.authToken}`);
        this.pr = data

        const groupSize = this.perpage;
        const newPR = [];
        this.prs = [];
        this.total_page = [];

        let j = 1;
        this.pr.forEach((data) => {
          data.no = j
          newPR.push(data);
          j++
        });

        for (let i = 0; i < newPR.length; i += groupSize) {
          this.prs.push(newPR.slice(i, i + groupSize));
        }

        for (let i = 0; i < this.prs.length; i++) {
          this.total_page.push(i);
        }
      } catch(error){
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
    searching(){
      this.prs = []
      this.total_page = []
      this.start = 0
      this.end = 8
      this.perpage = 10

      const searchTerm = '*' + this.searchFood + '*';
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
    },
  },
};
</script>

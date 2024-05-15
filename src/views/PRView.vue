<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Purchase Requisition</h2>
          </div>

          <div class="content">
            <div style="width: 100%; margin-top: 20px">
              <div class="table-navigation">
                <select
                  class="warehouse-input"
                  style="width: 80px"
                  v-model="perpage"
                  @change="getPR"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                <select class="select-sort" v-model="status" @change="getPR">
                  <option value="uncompleted">Uncompleted</option>
                  <option value="pending">Pending</option>
                  <option value="approve">Approve</option>
                  <option value="reject">Reject</option>
                  <option value="revise">Revise</option>
                  <option value="all">All</option>
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

                <div class="search-container"
                     style="margin-right: 0px;
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
                <thead class="bg-dark">
                  <tr>
                    <th style="width: 5%; 
                    border-top-left-radius: 5px">No</th>
                    <th style="width: 15%">PR Number</th>
                    <th style="width: 10%">PR Date</th>
                    <th style="width: 10%">Divisi</th>
                    <th style="width: 15%">Subdiv</th>
                    <th style="width: 15%">Dept</th>
                    <th style="width: 15">Status</th>
                    <th style="width: 15%; 
                    border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <loader v-if="isloading"></loader>
                <tbody v-if="!isLoading">
                  <tr
                    v-for="(pr, idx) in prs[selectedPage]"
                    :key="pr.id"
                    :class="{ 'bg-canvas': idx % 2 == 0 }"
                  >
                    <td>{{ idx + 1 }}</td>
                    <td>{{ pr.pr_no }}</td>
                    <td>{{ pr.pr_date }}</td>
                    <td>{{ pr.div_kd }}</td>
                    <td>{{ pr.subdiv_kd }}</td>
                    <td>{{ pr.dept_kd }}</td>
                    <td>
                      <span
                        :class="{
                          'capsule-theme': pr.f_approve === true,
                          'capsule-success': pr.f_batal === false && pr.f_approve === false && pr.f_revise === false,
                          'capsule-warning': pr.f_revise === true,
                          'capsule-danger': pr.f_batal === true,
                        }"
                      >
                        <span v-if="!pr.f_batal && !pr.f_approve && !pr.f_revise">Waiting</span>
                        <span v-if="pr.f_revise">Revise</span>
                        <span v-if="pr.f_approve">Approve</span>
                        <span v-if="pr.f_batal">Cancel</span>
                      </span>
                    </td>
                    <td style="display: flex;flex-direction: row;gap: 5px;flex-wrap: wrap;">
                      <button
                        class="btn-theme"
                        style="width: 80px"
                        @click="
                          this.$router.push({
                            name: 'pr-detail',
                            params: { id: pr.pr_no },
                          })
                        ">
                        Details
                      </button>
                      <button
                        class="btn-success" 
                        style="width: 80px;overflow: hidden"
                        @click="downloadPR(pr.pr_no)"
                        v-if="pr.f_revise && isDownloader">
                        <spinner v-if="isDownload"></spinner>
                        <span v-if="!isDownload">Download</span>
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
                  <button class="page-prev" 
                    :disabled="start < 5"
                    @click="prevPagination"
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
                  <button 
                  :disabled="total_page.length < end "
                  :class="{'paginate-active': total_page.length > end}"
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
import Spinner from "@/components/Spinner.vue";
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import Loader from "@/components/Loader.vue";
import ExcelJS from "exceljs";
import axios from "axios";

export default {
  name: "PRView",
  components: {
    SidebarVue,
    NavbarVue,
    Spinner,
    Loader,
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
      authToken: null,
      perm: null,
      permission: [],
      isDownload: false,
      isLoading: false,
      isDownloader: false,
      status: 'uncompleted',
    };
  },
  created(){
    this.authToken = this.$store.getters.GET_AUTH_TOKEN
    this.perm = this.$store.getters.GET_AUTH_INFO.permission
    this.permission = this.perm.split(",")
    if(!this.permission.includes('pr')) window.location.href = '/'
    this.isDownloader = this.permission.includes('download-pr')
  },
  mounted() {
    this.getPR();
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    async getPR() {
      this.isLoading = true;
      const groupSize = this.perpage;
      const newPR = [];
      this.prs = [];
      this.total_page = [];
      this.selectedPage = 0;
      
      try {
        const { data } = await axios.get(`/prservice/${this.status}/${this.authToken}`);
        this.pr = data;

        this.total_page = [];
        this.pr.forEach((data) => {
          newPR.push(data);
        });

        this.pagelength = this.pr.length;
        for (let i = 0; i < newPR.length; i += groupSize) {
          this.prs.push(newPR.slice(i, i + groupSize));
        }

        for (let i = 0; i < this.prs.length; i++) {
          this.total_page.push(i);
        }

        this.isLoading = false;
      } catch(error){
        console.log(error);
        if(error.response.status == 401){
          this.$toast.open({
              message: error.response.data.message,
              type: 'error',
              duration: 1000,
          });

          this.$store.dispatch("LOGOUT")
          .then(() => {
              this.$router.push({ path : '/login'});
          }).catch(() => {
              this.$router.push({ path : '/login'});
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
    },
    async downloadPR(prno){
      try {
        if(this.isDownload) return;
        this.isDownload = true;
        const { data } = await axios.get(`/prdetail2/all/${prno}/${this.authToken}`);
        const barang = data.items;

        console.log(barang)
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        worksheet.columns = [
          { header: 'Kode Barang', key: 'kdbar', width: 15 },
          { header: 'Nama Barang', key: 'nmbar', width: 30 },
          { header: 'Nama Barang 2', key: 'nmbar2', width: 30 },
          { header: 'NO PR', key: 'nopr', width: 20 },
          { header: 'Kode Jenis', key: 'kode_jenis', width: 10 },
          { header: 'Nama Jenis', key: 'nama_jenis', width: 20 },
          { header: "Kdstn Kirim", key: "kdstn_krm", width: 10 },
          { header: 'Satuan Kirim', key: 'nama_krm', width: 20 },
          { header: "Kdstn Stok", key: "kdstn_stok", width: 10 },
          { header: "Satuann Stok", key: "nama_stok", width: 20 },
          { header: "Quantity", key: "qty", width: 15 },
          { header: "Qty Revise", key: "qty_revise", width: 15 },
          { header: "Revise Note", key: "revise_note", width: 40 },
        ];

        worksheet.getRow(1).height = 30;

        const startCell = 'A1';
        const endCell = 'N1';
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
            const cellAddress = cell.address;
            if (cellAddress >= startCell && cellAddress <= endCell) {
              console.log(rowNumber, colNumber)
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'F3F3F3' }
              };
              cell.alignment = {
                horizontal: 'center',
                vertical: 'middle'
              };
            }
          });
        });

        barang.forEach(async(data) => {
          worksheet.addRow({
            kdbar: data.kode_barang,
            nmbar: data.nama_barang,
            nmbar2: data.nama_barang2,
            nopr: prno,
            kode_jenis: data.kd_jenis,
            nama_jenis: data.nm_jenis,
            kdstn_stok: data.kdstn_stok,
            nama_stok: data.nm_stok,
            kdstn_krm: data.kdstn_kirim,
            nama_krm: data.nm_kirim,
            qty: data.qty,
            qty_revise: data.qty,
            revise_note: data.revise_note
          });
        });      
        
        // const startColumn = 'A';
        // const endColumn = 'I';
        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
          row.getCell(1).protection = {locked: true};
          row.getCell(2).protection = {locked: true};
          row.getCell(3).protection = {locked: true};
          row.getCell(4).protection = {locked: true};
          row.getCell(5).protection = {locked: true};
          row.getCell(6).protection = {locked: true};
          row.getCell(7).protection = {locked: true};
          row.getCell(8).protection = {locked: true};
          row.getCell(9).protection = {locked: true};
          row.getCell(10).protection = {locked: true};
          row.getCell(11).protection = {locked: true};
          row.getCell(12).protection = {locked: false};
          row.getCell(13).protection = {locked: true};

          row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
            const startCell = `A${rowNumber}`;
            const endCell = `N${rowNumber}`;
            const cellAddress = cell.address;
            if (cellAddress >= startCell && cellAddress <= endCell){
              console.log(rowNumber, colNumber)
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            }
          });
        });

        await worksheet.protect('faamelawai', {
          selectLockedCells: true,
          selectUnlockedCells: true,          
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'TemplatePR.xlsx';
        a.style = 'opacity: 0';
        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
        this.isDownload = false;
      } catch(error){
        console.log(error);
        if(error.response.status == 401){
          this.$store.dispatch("LOGOUT")
          .then(() => {
              this.$router.push({ path : '/login'});
          }).catch(() => {
              this.$router.push({ path : '/login'});
          });
        }
      }
    },
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

<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"> </navbar-vue>

    <sidebar-vue @swidth="setWidth"> </sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Master Barang</h2>
          </div>

          <button
            class="btn-theme"
            style="position: absolute; width: 150px; top: 20px; right: 20px"
            @click="downloadTemplate">
            <spinner v-if="isDownload"></spinner>
            <span v-if="!isDownload">Download Template</span>
          </button>

          <div class="content">
            <div style="width: 100%; margin-top: 20px">
              <div class="table-navigation">
                <select
                  class="warehouse-input"
                  style="width: 80px"
                  v-model="perpage"
                  @change="getMasterbarang">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                <div class="search-container">
                  <input
                    type="text"
                    class="form-input"
                    style="width: 100%"
                    placeholder="Search master barang item..."
                    v-model="searchItem"
                    @keyup.enter="searching" />
                </div>
              </div>

              <table
                class="table-responsive"
                aria-describedby="Marketlist items">
                <thead class="bg-dark">
                  <tr>
                    <th style="width: 3%; border-top-left-radius: 5px">No</th>
                    <th style="width: 12%">Image</th>
                    <th style="width: 10%">Product ID</th>
                    <th style="width: 15%">Product Name</th>
                    <th style="width: 10%">Type</th>
                    <th style="width: 7%">Satuan</th>
                    <th style="width: 18%; text-align: left">
                      <select
                        class="select-jenis"
                        style="width: 100%; text-align: center"
                        v-model="kdjns"
                        @change="getMasterbarang">
                        <option value="all">Jenis</option>
                        <option
                          v-for="jns in jenis"
                          :key="jns.kdjns"
                          :value="jns.kdjns">
                          {{ jns.nm_jenis }}
                        </option>
                      </select>
                    </th>
                    <th style="width: 5">Status</th>
                    <th style="width: 10%; border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(items, idx) in foods[selectedPage]"
                    :key="items.kd_barang"
                    :class="{ 'bg-canvas': idx % 2 == 0 }">
                    <td>{{ idx + 1 }}</td>
                    <td>
                      <img
                        :src="getFoodImage(items.image)"
                        :alt="items.image"
                        @click="showingPreview(items.image)"
                        style="
                          width: 60px;
                          height: 60px;
                          object-fit: cover;
                          cursor: pointer;
                        " />
                    </td>
                    <td>{{ items.kd_barang }}</td>
                    <td>{{ items.nm_barang }}</td>
                    <td>
                      <span v-if="items.f_stock">Marketlist</span>
                      <span v-if="!items.f_stock">Stock Finance</span>
                    </td>
                    <td>{{ items.nmstn_stok }}</td>
                    <td>{{ items.nm_jenis }}</td>
                    <td>
                      <span
                        :class="{
                          'capsule-theme': items.status,
                          'capsule-danger': !items.status,
                        }">
                        {{ setStatus(items.status) }}
                      </span>
                    </td>
                    <td>
                      <button class="btn-primary" @click="editModal(items)">
                        Edit
                      </button>

                      <!-- <button
                        class="btn-danger"
                        style="margin-left: 10px"
                        @click="showingAlert(items)"
                      >
                        Delete
                      </button> -->
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="page-wrapper" v-if="total_page.length > 0">
                <div style="width: 50%">
                  <span style="font-size: 10pt">
                    Showing {{ foods[selectedPage][0].no }} to
                    {{ foods[selectedPage][foods[selectedPage].length - 1].no }}
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

  <create-modal
    v-show="showCreate"
    tittle="Create New Item"
    jenis="m"
    @closed="onClosedModal"
    @onResolve="resolveResponse">
  </create-modal>

  <edit-modal
    v-show="showEdit"
    :food="selectedFood"
    tittle="Update Master Barang"
    jenis="K001"
    @closed="onClosedModal"
    @onResolve="resolveResponse">
  </edit-modal>

  <notification v-if="showNotification" :message="message" :success="succes">
  </notification>

  <alert-confirm
    v-if="showAlert"
    :title="title"
    :message="deleteMessage"
    :methods="methods"
    :url="url"
    :header="sheaders"
    :data="item"
    @onClosed="onClose"
    @onResolve="deleteItem">
  </alert-confirm>

  <preview-image
    v-if="selectedImage"
    :source="selectedImage"
    @onClosed="onClosedPreview">
  </preview-image>
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import EditModal from "@/components/EditItemModal.vue";
import CreateModal from "@/components/CreateItemModal.vue";
import Notification from "@/components/Notification.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import PreviewImage from "@/components/PreviewImage.vue";
import Spinner from "@/components/Spinner.vue";
import axios from "axios";
import ExcelJS from "exceljs";

export default {
  name: "MasterbarangView",
  components: {
    SidebarVue,
    NavbarVue,
    CreateModal,
    EditModal,
    AlertConfirm,
    Notification,
    PreviewImage,
    Spinner,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      allselected: false,
      showCreate: false,
      showEdit: false,
      food: [],
      foods: [],
      newFood: [],
      total_page: [],
      selectedPage: 0,
      selectedFood: {},
      perpage: 10,
      start: 0,
      end: 8,
      searchItem: null,
      pagelength: 0,
      showNotification: false,
      showAlert: false,
      title: null,
      deleteMessage: null,
      message: null,
      succes: false,
      url: null,
      redirect: null,
      methods: null,
      selectedID: null,
      item: {},
      sheaders: {},
      perm: null,
      permission: null,
      authToken: null,
      jenis: null,
      kdjns: "all",
      selectedImage: null,
      showPreview: false,
      isDownload: false,
    };
  },
  mounted() {
    this.getMasterbarang();
    this.getJenis();
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    if (!this.permission.includes("master-barang")) this.$router.back();
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
    showingPreview(src) {
      if (src === undefined) {
        this.selectedImage = `${this.base_url}/masbarimages/${this.authToken}/default.png`;
      } else {
        this.selectedImage = `${this.base_url}/masbarimages/${this.authToken}/${src}`;
      }

      this.showPreview = true;
    },
    onClosedPreview(value) {
      this.showPreview = value;
      this.selectedImage = null;
    },
    showingAlert(data) {
      this.selectedID = data.kd_barang;
      this.title = "Confirmation";
      this.deleteMessage = `Are you sure want to delete ${data.name} ?`;
      this.methods = "delete";
      this.url = "/masterbarang";
      this.sheaders = {
        Kode: data.kd_barang,
        Authorization: "asdasdasdasd",
      };
      this.item = { image: data.image };
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
    async getMasterbarang() {
      try {
        this.food = [];
        this.foods = [];
        this.total_page = [];

        const { data } = await axios.get(
          `/holdingmasbar/${this.kdjns}/${this.authToken}`
        );

        this.food = data;
        this.pagelength = this.food.length;
        for (let i = 0; i < this.food.length; i += parseInt(this.perpage)) {
          this.foods.push(this.food.slice(i, i + parseInt(this.perpage)));
        }

        for (let i = 0; i < this.foods.length; i++) {
          this.total_page.push(i);
        }
      } catch (error) {
        if (error.response.status == 401) {
          this.$toast.open({
            message: error.response.data.message,
            type: "error",
            duration: 1000,
          });

          this.$store
            .dispatch("LOGOUT")
            .then(() => {
              this.$router.push({ name: "login" });
            })
            .catch(() => {
              this.$router.push({ name: "login" });
            });
        }
      }
    },
    async getJenis() {
      try {
        const { data } = await axios.get(`/jenismasbar/${this.authToken}`);
        this.jenis = data;
      } catch (error) {
        console.log(error);
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
      FileList;
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
      this.foods = [];
      this.total_page = [];
      this.start = 0;
      this.end = 8;
      this.perpage = 10;

      const searchTerm = "*" + this.searchItem + "*";
      const wildcardRegex = new RegExp(
        "^" + searchTerm.replace(/\*/g, ".*") + "$",
        "i"
      );
      const matchingObjects = this.food.filter((obj) =>
        Object.values(obj).some(
          (value) => typeof value === "string" && wildcardRegex.test(value)
        )
      );

      let j = 1;
      const newFood = [];
      this.pagelength = matchingObjects.length;
      matchingObjects.forEach((data) => {
        data.no = j;
        newFood.push(data);
        j++;
      });

      for (let i = 0; i < newFood.length; i += parseInt(this.perpage)) {
        this.foods.push(newFood.slice(i, i + parseInt(this.perpage)));
      }

      console.log(this.foods);
      for (let a = 0; a < this.foods.length; a++) {
        this.total_page.push(a);
      }
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
    getFoodImage(filename) {
      if (filename === undefined) {
        return `${this.base_url}/masbarimages/${this.authToken}/default.png`;
      } else {
        return `${this.base_url}/masbarimages/${this.authToken}/${filename}`;
      }
    },
    async downloadTemplate() {
      try {
        this.isDownload = true;
        const { data } = await axios.get(`/masterbarang/all/${this.authToken}`);
        const barang = data;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        worksheet.columns = [
          { header: "Kode Barang", key: "kdbar", width: 15 },
          { header: "Nama Barang", key: "nmbar", width: 40 },
          { header: "Nama Barang2", key: "nmbar2", width: 30 },
          { header: "Nama Hotel", key: "nmbar_hotel", width: 40 },
          { header: "Kode Jenis", key: "kode_jenis", width: 10 },
          { header: "Nama Jenis", key: "nama_jenis", width: 30 },
          { header: "Kode Jenis Hotel", key: "kode_jenis_hotel", width: 20 },
          { header: "Nama Jenis Hotel", key: "nama_jenis_hotel", width: 30 },
          { header: "Kdstn Stok", key: "kdstn_stok", width: 15 },
          { header: "Satuann Stok", key: "nama_stok", width: 20 },
          { header: "Kdstn Kirim", key: "kdstn_kirim", width: 15 },
          { header: "Satuan Kirim", key: "nama_kirim", width: 20 },
        ];

        worksheet.getRow(1).height = 30;

        const startCell = "A1";
        const endCell = "N1";
        worksheet.eachRow({ includeEmpty: true }, function (row) {
          row.eachCell({ includeEmpty: true }, function (cell) {
            const cellAddress = cell.address;
            if (cellAddress >= startCell && cellAddress <= endCell) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F3F3F3" },
              };
              cell.alignment = {
                horizontal: "center",
                vertical: "middle",
              };
            }
          });
        });

        barang.forEach(async (data) => {
          if (data.nmbar !== "") {
            worksheet.addRow({
              kdbar: data.kdbar,
              nmbar: data.nmbar,
              nmbar2: data.nmbar2,
              nmbar_hotel: data.nmbar_sdiv,
              kode_jenis: data.kode_jenis,
              nama_jenis: data.nm_jenis,
              kode_jenis_hotel: data.kdjns_sdiv,
              nama_jenis_hotel: data.nmjns_sdiv,
              kdstn_stok: data.kdstn_stok,
              nama_stok: data.nm_stok,
              kdstn_kirim: data.kdstn_krm,
              nama_kirim: data.nm_kirim,
            });
          }
        });

        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          if (rowNumber == 1) {
            row.getCell(1).protection = { locked: true };
            row.getCell(2).protection = { locked: true };
            row.getCell(3).protection = { locked: true };
            row.getCell(4).protection = { locked: true };
            row.getCell(5).protection = { locked: true };
            row.getCell(6).protection = { locked: true };
            row.getCell(7).protection = { locked: true };
            row.getCell(8).protection = { locked: true };
            row.getCell(9).protection = { locked: true };
            row.getCell(10).protection = { locked: true };
            row.getCell(11).protection = { locked: true };
            row.getCell(12).protection = { locked: true };

            row.getCell(4).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFF66" },
            };

            row.getCell(7).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFF66" },
            };

            row.getCell(8).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFF66" },
            };
          }

          if (rowNumber > 1) {
            row.getCell(1).protection = { locked: true };
            row.getCell(2).protection = { locked: true };
            row.getCell(3).protection = { locked: true };
            if (row.getCell(4).value !== "") {
              row.getCell(4).protection = { locked: true };
              row.getCell(7).protection = { locked: true };
              row.getCell(8).protection = { locked: true };

              row.eachCell((cell) => {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFF66" },
                };
              });
            } else {
              row.getCell(4).protection = { locked: false };
              row.getCell(7).protection = { locked: false };
              row.getCell(8).protection = { locked: false };
            }
            row.getCell(5).protection = { locked: true };
            row.getCell(6).protection = { locked: true };
            row.getCell(9).protection = { locked: true };
            row.getCell(10).protection = { locked: true };
            row.getCell(11).protection = { locked: true };
            row.getCell(12).protection = { locked: true };
          }

          row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
            const startCell = `A${rowNumber}`;
            const endCell = `N${rowNumber}`;
            const cellAddress = cell.address;
            if (cellAddress >= startCell && cellAddress <= endCell) {
              console.log(rowNumber, colNumber);
              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            }
          });
        });

        await worksheet.protect("faamelawai", {
          selectLockedCells: true,
          selectUnlockedCells: true,
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `MasterBarang-${new Date().toLocaleDateString()}.xlsx`;
        a.style = "opacity: 0";
        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
        this.isDownload = false;
      } catch (error) {
        if (error.response.status == 401) {
          this.$toast.open({
            message: "Invalid Credentials!",
            type: "error",
            duration: 1000,
            dismissible: true,
          });

          this.$store
            .dispatch("LOGOUT")
            .then(() => {
              this.$router.push({ name: "login" });
            })
            .catch(() => {
              this.$router.push({ name: "login" });
            });
        }
      }
    },
  },
};
</script>

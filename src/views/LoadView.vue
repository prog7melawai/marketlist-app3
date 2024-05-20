<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Load Data PR</h2>
          </div>

          <div class="content">
            <div class="download-excel">
              <h3>Download Excel Template</h3>
              <div class="select-excel">
                <select class="select-box" v-model="jenis">
                  <option value="marketlist">Template Marketlist</option>
                  <option value="stockfinance">Template Stock Finance</option>
                </select>

                <select class="select-box" style="width: 30%">
                  <option value="">Sample Data</option>
                </select>

                <button
                  class="btn-primary"
                  style="width: 100px"
                  @click="downloadTemplate">
                  <spinner v-if="isDownload"></spinner>
                  <span v-if="!isDownload">Download</span>
                </button>
              </div>
            </div>

            <loader v-if="loading"></loader>

            <div class="load-wrapper">
              <div
                style="
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  flex-wrap: wrap;
                  justify-content: space-between;
                ">
                <div class="form-group">
                  <label
                    class="form-label"
                    :class="{ 'color-orange': selectedDivisi }"
                    >Division<span class="text-danger">*</span></label
                  >
                  <select
                    style="width: 99%; height: 40px; border-radius: 5px"
                    v-model="selectedDivisi"
                    @change="getSubdiv">
                    <option
                      v-for="div in divisi"
                      :key="div.divkd"
                      :value="div.divkd">
                      {{ div.divnm }}
                    </option>
                  </select>
                  <span>{{ error.divisi }}</span>
                </div>
                <div class="form-group">
                  <label
                    class="form-label"
                    :class="{ 'color-orange': selectedSubdiv }"
                    >Subdivision<span class="text-danger">*</span></label
                  >
                  <select
                    style="width: 99%; height: 40px; border-radius: 5px"
                    v-model="selectedSubdiv"
                    @change="getDept">
                    <option
                      v-for="sub in subdiv"
                      :key="sub.subdiv_kd"
                      :value="sub.subdiv_kd">
                      {{ sub.subdiv_nm }}
                    </option>
                  </select>
                  <span>{{ error.subdivisi }}</span>
                </div>
                <div class="form-group">
                  <label
                    class="form-label"
                    :class="{ 'color-orange': selectedDept }"
                    >Department<span class="text-danger">*</span></label
                  >
                  <select
                    style="width: 99%; height: 40px; border-radius: 5px"
                    v-model="selectedDept"
                    @change="getLocation">
                    <option
                      v-for="dep in dept"
                      :key="dep.dept_kd"
                      :value="dep.dept_kd">
                      {{ dep.dept_nm }}
                    </option>
                  </select>
                  <span>{{ error.department }}</span>
                </div>
                <div class="form-group">
                  <label
                    class="form-label"
                    :class="{ 'color-orange': selectedLocation }"
                    >Location<span class="text-danger">*</span></label
                  >
                  <select
                    style="width: 99%; height: 40px; border-radius: 5px"
                    v-model="selectedLocation"
                    @change="getLocation">
                    <option
                      v-for="lok in location"
                      :key="lok.lok_kd"
                      :value="lok.lok_kd">
                      {{ lok.lok_nm }}
                    </option>
                  </select>
                  <span>{{ error.lokasi }}</span>
                </div>
                <div class="form-group">
                  <label
                    class="form-label"
                    :class="{ 'color-orange': event_name }"
                    >Event Name
                    <span style="color: gray">(Optional)</span></label
                  >
                  <input
                    type="text"
                    style="
                      width: 99%;
                      padding: 0;
                      background: #fff;
                      height: 37px;
                    "
                    class="form-input"
                    v-model="event_name" />
                  <span>{{ error.event_name }}</span>
                </div>
                <div class="form-group">
                  <label
                    class="form-label"
                    :class="{ 'color-orange': expected_date }"
                    >Expected Date<span class="text-danger">*</span></label
                  >
                  <VueDatePicker
                    style="width: 99%"
                    v-model="expected_date"
                    placeholder="Input Expected Date"
                    :min-date="new Date()"
                    :enable-time-picker="false"
                    :format="format" />
                  <span>{{ error.expected_date }}</span>
                </div>
              </div>
              <div
                class="load-excel bg-canvas"
                @dragover="dragover"
                @dragleave="dragleave"
                @drop="drop"
                id="drop-box"
                v-if="!loading">
                <h3>Load Excel Template</h3>

                <span
                  style="
                    position: absolute;
                    top: 55px;
                    right: 10px;
                    color: red;
                    font-weight: 400;
                    font-size: 10pt;
                  "
                  v-if="errorDivisi"
                  >*{{ errorDivisi }}!</span
                >

                <img
                  src="/images/icons/cloud.svg"
                  alt="cloud"
                  class="cloud-icon" />
                <span class="drop-title" v-if="!selectedfile"
                  >Drag & Drop File Here</span
                >
                <span class="filename" v-if="selectedfile">{{
                  selectedfile
                }}</span>
                <button
                  class="btn-primary"
                  style="position: relative"
                  v-if="filelist.length == 0">
                  <input
                    type="file"
                    class="input-excel"
                    accept=".xlsx"
                    @change="onChange"
                    ref="file" />
                  Browse File
                </button>

                <button
                  class="btn-primary"
                  style="position: relative"
                  @click="removeFile"
                  v-if="filelist.length > 0">
                  Remove
                </button>
              </div>
            </div>
            <div
              class="table-prev-container"
              v-if="content.length > 0 && !loading">
              <table class="table-preview">
                <thead>
                  <th width="5%" style="text-align: center">No</th>
                  <th width="10%" style="text-align: center">Kode Barang</th>
                  <th width="25%" style="text-align: left">Nama Barang</th>
                  <th width="15%" style="text-align: left">NO PR</th>
                  <th width="20%" style="text-align: left">Jenis</th>
                  <th width="5%" style="text-align: center">Qty</th>
                  <th width="5%" style="text-align: center">Qty Revise</th>
                  <th width="15%" style="text-align: center">Revise Note</th>
                </thead>
                <tbody>
                  <tr v-for="item in content" :key="item.kode_barang">
                    <td style="text-align: center">{{ item.no }}</td>
                    <td style="text-align: center">{{ item.kode_barang }}</td>
                    <td style="text-align: left">{{ item.nama_barang }}</td>
                    <td style="text-align: left">{{ item.no_pr }}</td>
                    <td style="text-align: left">{{ item.nama_jenis }}</td>
                    <td style="text-align: center">{{ item.qty }}</td>
                    <td style="text-align: center">{{ item.qty_revise }}</td>
                    <td style="text-align: center">{{ item.revise_note }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              class="btn-block-theme"
              style="margin-top: 10px"
              v-if="selectedfile"
              @click="submitFile">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <alert-confirm
    v-if="showConfirm"
    title="Are You Sure ?"
    message="Want to delete this item."
    @onClosed="onClosed">
  </alert-confirm>

  <notification-alert
    v-if="showNotifAlert"
    :success="success"
    :message="message"
    @onClosed="onClosedNotif">
  </notification-alert>

  <alert-confirm
    v-if="showAlert"
    :title="title"
    :message="deleteMessage"
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
import Loader from "@/components/Loader.vue";
import Spinner from "@/components/Spinner.vue";
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import NotificationAlert from "@/components/NotificationAlert.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import ExcelJS from "exceljs";
import axios from "axios";

export default {
  name: "LoadView",
  components: {
    SidebarVue,
    NavbarVue,
    AlertConfirm,
    NotificationAlert,
    Loader,
    Spinner,
    VueDatePicker,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      filelist: [],
      selectedfile: null,
      exceltype: null,
      headers: [],
      content: [],
      showNotif: false,
      showNotifAlert: false,
      showAlert: false,
      success: false,
      message: null,
      loading: false,
      isDownload: false,
      title: null,
      deleteMessage: null,
      methods: null,
      url: null,
      sheaders: null,
      item: null,
      selectedDivisi: null,
      selectedSubdiv: null,
      selectedDept: null,
      selectedLocation: null,
      expected_date: null,
      event_name: null,
      authToken: null,
      perm: null,
      permission: [],
      divisi: null,
      subdiv: null,
      dept: null,
      location: null,
      errorDivisi: null,
      jenis: "marketlist",
      error: {
        divisi: null,
        subdivisi: null,
        department: null,
        lokasi: null,
        expected_date: null,
        event_name: null,
      },
    };
  },
  created() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    if (!this.permission.includes("loadpr")) window.location.href = "/";
    this.getDivisi();
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    dragover(event) {
      event.preventDefault();
      if (!event.currentTarget.classList.contains("bg-orange")) {
        event.currentTarget.classList.remove("bg-canvas");
        event.currentTarget.classList.add("bg-orange");
      }
    },
    dragleave(event) {
      event.currentTarget.classList.add("bg-canvas");
      event.currentTarget.classList.remove("bg-orange");
    },
    async getDivisi() {
      try {
        const { data } = await axios.get(`/divisi/${this.authToken}`);
        this.divisi = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getSubdiv() {
      try {
        const { data } = await axios.get(
          `/subdivisi/${this.selectedDivisi}/${this.authToken}`
        );
        this.subdiv = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getDept() {
      try {
        const { data } = await axios.get(
          `/department/${this.selectedDivisi}/${this.selectedSubdiv}/${this.authToken}`
        );
        this.dept = data;
      } catch (error) {
        console.log(error);
      }
    },
    async getLocation() {
      try {
        const { data } = await axios.get(
          `/location/${this.selectedDivisi}/${this.selectedSubdiv}/${this.selectedDept}/${this.authToken}`
        );
        this.location = data;
      } catch (error) {
        console.log(error);
      }
    },
    async downloadTemplate() {
      try {
        this.isDownload = true;
        const { data } = await axios.get(
          `/holdingmasbar/all/${this.authToken}`
        );
        const barang = data;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        worksheet.columns = [
          { header: "Kode Barang", key: "kdbar", width: 15 },
          { header: "Nama Barang", key: "nmbar", width: 30 },
          { header: "Nama Barang 2", key: "nmbar2", width: 30 },
          { header: "NO PR", key: "nopr", width: 20 },
          { header: "Kode Jenis", key: "kode_jenis", width: 10 },
          { header: "Nama Jenis", key: "nama_jenis", width: 20 },
          { header: "Kdstn Kirim", key: "kdstn_krm", width: 10 },
          { header: "Satuan Kirim", key: "nama_krm", width: 20 },
          { header: "Kdstn Stok", key: "kdstn_stok", width: 10 },
          { header: "Satuann Stok", key: "nama_stok", width: 20 },
          { header: "Quantity", key: "qty", width: 15 },
          { header: "Qty Revise", key: "qty_revise", width: 15 },
          { header: "Revise Note", key: "revise_note", width: 40 },
        ];

        worksheet.getRow(1).height = 30;

        const startCell = "A1";
        const endCell = "N1";
        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
          row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
            const cellAddress = cell.address;
            if (cellAddress >= startCell && cellAddress <= endCell) {
              console.log(rowNumber, colNumber);
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
          worksheet.addRow({
            kdbar: data.kdbar,
            nmbar: data.nmbar,
            nmbar2: data.nmbar2,
            nopr: "",
            kode_jenis: data.kode_jenis,
            nama_jenis: data.nm_jenis,
            kdstn_stok: data.kdstn_stok,
            nama_stok: data.nmstn_stok,
            qty: 0,
            qty_revise: 0,
            revise_note: "",
          });
        });

        // const startColumn = 'A';
        // const endColumn = 'I';
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
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
          row.getCell(11).protection = { locked: false };
          row.getCell(12).protection = { locked: true };
          row.getCell(13).protection = { locked: true };

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
        a.download = `TemplatePR-${
          this.jenis
        }-${new Date().toLocaleDateString()}.xlsx`;
        a.style = "opacity: 0";
        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
        this.isDownload = false;
      } catch (error) {
        console.log(error);
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
    async drop(event) {
      event.preventDefault();
      const fileArray = event.dataTransfer.files;
      for (let files of fileArray) {
        if (
          files.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          alert("Invalid file input: " + files.name + "!");
        } else {
          this.filelist.push(files);
        }
      }

      this.loading = true;
      await this.readMasterBarang();
      this.loading = false;
      this.selectedfile = this.filelist[0].name;
    },
    async onChange() {
      this.filelist = [...this.$refs.file.files];
      document.getElementById("drop-box").classList.add("bg-orange");

      this.loading = true;
      await this.readMasterBarang();
      this.loading = false;
      this.selectedfile = this.filelist[0].name;
    },
    removeFile() {
      this.filelist = [];
      this.content = [];
      this.headers = [];
      this.selectedfile = null;
      document.getElementById("drop-box").classList.remove("bg-orange");
      document.getElementById("drop-box").classList.add("bg-canvas");
    },
    async submitFile() {
      this.errorDivisi = null;

      if (!this.selectedDivisi) this.error.divisi = "Please select division!";
      if (!this.selectedSubdiv)
        this.error.subdivisi = "Please select subdivision!";
      if (!this.selectedDept)
        this.error.department = "Please select Department";
      if (!this.selectedLocation) this.error.lokasi = "Please select Location!";
      if (!this.expected_date)
        this.error.expected_date = "Please select Expected Date";

      if (
        !this.selectedDivisi ||
        !this.selectedSubdiv ||
        !this.selectedDept ||
        !this.selectedLocation ||
        !this.expected_date
      ) {
        return;
      }

      const items = this.content.filter((data) => {
        return data.qty > 0;
      });

      const body = {
        divkd: this.selectedDivisi,
        subdivkd: this.selectedSubdiv,
        deptkd: this.selectedDept,
        lokkd: this.selectedLocation,
        items: items,
      };

      console.log(body);
      this.title = "Confirmation";
      this.deleteMessage = `Are you sure want to submit Transaction ?`;
      this.methods = "post";
      this.url = `/pr/${this.authToken}`;
      this.sheaders = null;
      this.item = body;
      this.showAlert = true;
    },
    submitted(value) {
      this.showAlert = false;
      this.message = value.message;
      this.success = true;
      this.showNotif = true;

      setTimeout(() => {
        this.message = null;
        this.succes = false;
        this.showNotif = false;
        window.location.href = "/pr";
      }, 1300);
    },
    onError(value) {
      console.log(value.message);
      this.showAlert = false;
      this.message = value.message;
      this.success = false;
      this.showNotifAlert = true;
      this.alertMessage = null;
    },
    onClosed(value) {
      this.showAlert = value;
    },
    onClosedNotif(value) {
      this.showNotifAlert = value;
    },
    async readMasterBarang() {
      this.content = [];
      let nou = 1;
      const workbook = new ExcelJS.Workbook();
      const reader = new FileReader();

      const fileContentPromise = new Promise((resolve, reject) => {
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });

      reader.readAsArrayBuffer(this.filelist[0]);

      try {
        const fileContent = await fileContentPromise;
        const excelFile = await workbook.xlsx.load(fileContent);
        const worksheet = excelFile.getWorksheet(1);

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) {
            this.headers = row.values;
          } else if (rowNumber > 1) {
            const data = {
              no: nou,
              kode_barang: row.getCell(1).value,
              nama_barang: row.getCell(2).value,
              nama_barang2: row.getCell(3).value,
              pr_no: row.getCell(4).value,
              kd_jenis: row.getCell(5).value,
              nama_jenis: row.getCell(6).value,
              kdstn_krm: row.getCell(7).value,
              satuan_kirim: row.getCell(8).value,
              kdstn_stock: row.getCell(9).value,
              satuan_stock: row.getCell(10).value,
              qty: row.getCell(11).value,
              qty_revise: row.getCell(12).value,
              revise_note: row.getCell(13).value,
            };

            if (row.getCell(11).value > 0) {
              this.content.push(data);
              nou++;
            }
          }
        });
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
  },
};
</script>

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
                <select class="select-box">
                  <option value="">Template Marketlist</option>
                  <option value="">Template Stock Finance</option>
                </select>

                <select class="select-box" style="width: 30%">
                  <option value="">Empty</option>
                  <option value="">Sample Data</option>
                </select>

                <button class="btn-primary">Download</button>
              </div>
            </div>

            <div
              class="load-excel bg-canvas"
              @dragover="dragover"
              @dragleave="dragleave"
              @drop="drop"
              id="drop-box"
            >
              <h3>Load Excel Template</h3>

              <select class="select-excel-type" v-model="exceltype">
                <option value="Master Barang">Master Barang</option>
                <option value="Master Jenis">Master Jenis</option>
                <option value="Master Satuan">Master Satuan</option>
                <option value="Supplier">Supplier</option>
                <option value="BOM">Bill Of Material</option>
              </select>

              <img
                src="/images/icons/cloud.svg"
                alt="cloud"
                class="cloud-icon"
              />
              <span class="drop-title">Drag & Drop File Here</span>
              <button
                class="btn-primary"
                style="position: relative"
                v-if="filelist.length == 0"
              >
                <input
                  type="file"
                  class="input-excel"
                  accept=".xlsx"
                  @change="onChange"
                  ref="file"
                />
                Browse File
              </button>

              <button
                class="btn-primary"
                style="position: relative"
                @click="removeFile"
                v-if="filelist.length > 0"
              >
                Remove
              </button>

              <span class="filename">{{ selectedfile }}</span>
            </div>

            <button
              class="btn-block-theme"
              style="margin-top: 10px"
              v-if="filelist.length > 0"
              @click="submitFile"
            >
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
    @onClosed="onClosed"
  >
  </alert-confirm>

  <notification v-if="showNotif" :success="success" :message="message">
  </notification>
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import Notification from "@/components/Notification.vue";
import ExcelJS from "exceljs";

export default {
  name: "LoadView",
  components: {
    SidebarVue,
    NavbarVue,
    AlertConfirm,
    Notification,
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
      showConfirm: false,
      showNotif: false,
      success: false,
      message: null,
    };
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
    drop(event) {
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

      this.selectedfile = this.filelist[0].name;
    },
    onChange() {
      this.filelist = [...this.$refs.file.files];
      this.selectedfile = this.filelist[0].name;
      document.getElementById("drop-box").classList.add("bg-orange");
    },
    removeFile() {
      this.filelist = [];
      this.content = [];
      this.headers = [];
      this.selectedfile = null;
      document.getElementById("drop-box").classList.remove("bg-orange");
      document.getElementById("drop-box").classList.add("bg-canvas");
    },
    submitFile() {
      if (this.exceltype === null) {
        alert("Please select file type!");
        return;
      }

      let i = 1;
      let rm = 1;
      let wip = 1;
      this.content = [];
      const workbook = new ExcelJS.Workbook();
      const reader = new FileReader();
      reader.onload = async (event) => {
        this.fileContent = event.target.result;
        const excelFile = await workbook.xlsx.load(this.fileContent);
        const worksheet = excelFile.getWorksheet(1);

        this.content = [];
        worksheet.eachRow((row, rowNumber) => {
          // const rowData = row.values;
          // if(rowData.length !== 75 && row.getCell(1).value){
          //     alert('Document in wrong format!')
          //     this.filelist = []
          //     return;
          // }

          if (rowNumber === 1) {
            this.headers = row.values;
          } else {
            let kdbrg;
            let cnt;
            if (row.getCell(3).value == "RM") {
              if (rm <= 9) cnt = "0" + String(rm);
              else cnt = String(rm);

              kdbrg = "RM" + String(cnt);
              rm++;
            } else if (row.getCell(3).value == "WIP") {
              if (wip <= 9) cnt = "0" + String(wip);
              else cnt = String(wip);

              kdbrg = "WIP" + String(cnt);
              wip++;
            }

            const data = {
              no: i,
              kode_barang: kdbrg,
              nama_barang: row.getCell(2).value,
              tipe: row.getCell(3).value,
              satuan_stock: row.getCell(4).value,
              satuan_beli: row.getCell(5).value,
              konversi: row.getCell(6).value,
              kd_jenis: row.getCell(7).value,
              qty_minimum: row.getCell(8).value,
              qty_perhari: row.getCell(9).value,
            };

            this.content.push(data);
            i++;
          }
        });
      };

      reader.readAsArrayBuffer(this.filelist[0]);
    },
    onClosed(value) {
      this.showConfirm = value;
    },
  },
};
</script>
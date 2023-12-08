<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: this.$store.getters.GET_SIDEBAR_WIDTH.sidebarwidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Import Data Master</h2>
          </div>

          <div class="content">
            <div class="download-excel">
              <h3>Download Excel Template</h3>
              <div class="select-excel">
                <select class="select-box">
                  <option value="">Template Master Barang</option>
                  <option value="">Template Master Jenis</option>
                  <option value="">Template Master Satuan</option>
                  <option value="">Template Supplier</option>
                  <option value="">Template Bill Of Material</option>
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
                <option value="Barang">Master Barang</option>
                <option value="Jenis">Master Jenis</option>
                <option value="Satuan">Master Satuan</option>
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
              class="btn-theme btn-block"
              style="margin-top: 10px"
              v-if="filelist.length > 0"
              @click="submitFile">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <notification 
      v-if="showNotification"
      :message="message"
      :success="succes">
  </notification>
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import Notification from '@/components/Notification.vue'
import ExcelJS from "exceljs";
import axios from 'axios';

export default {
  name: "ImportView",
  components: {
    SidebarVue,
    NavbarVue,
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
      showNotification: false,
      message: null,
      succes: false,
    };
  },
  mounted(){
    this.setWidth()
  },
  methods: {
    setWidth() {
      if (this.$store.getters.GET_SIDEBAR_WIDTH.sidebarwidth === "18%") this.contentWidth = "78%";
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
      for (let file of fileArray) {
        if (
          file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          alert("Invalid file input: " + file.name + "!");
        } else {
          this.filelist.push(file);
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
    async submitFile() {
      if (!this.exceltype) {
        this.message = 'Please select document type!';
        this.succes = false;
        this.showNotification = true;  

        setTimeout(() => {
          this.message = null;
          this.succes = false;
          this.showNotification = false;
        }, 1300)

        return;
      }

      if(this.exceltype === 'Barang'){
        this.readMasterBarang(this.filelist[0])  
      } else if(this.exceltype === 'Satuan'){
        this.readMasterSatuan(this.filelist[0])
      } else if(this.exceltype === 'Jenis'){
        this.readMasterJenis(this.filelist[0])
      }
    },
    async readMasterBarang(file){
      try {
          let i = 1;
          this.content = [];
          const workbook = new ExcelJS.Workbook();
          const reader = new FileReader();
          reader.onload = async (event) => {
            this.fileContent = event.target.result;
            const excelFile = await workbook.xlsx.load(this.fileContent);
            const worksheet = excelFile.getWorksheet(1);

            this.content = [];
            const first = worksheet.getRow(1).values;
            if(first.length !== 10) {
              this.message = 'Document in wrong format';
              this.succes = false;
              this.showNotification = true;  

                this.filelist = []
                this.selectedfile = null
                document.getElementById("drop-box").classList.add("bg-canvas")
                document.getElementById("drop-box").classList.remove("bg-orange")
                setTimeout(() => {
                  this.message = null;
                  this.succes = false;
                  this.showNotification = false;
                }, 1300)

                return;
            }

            worksheet.eachRow((row, rowNumber) => {
              if (rowNumber === 1) {
                this.headers = row.values;
              } else {
                const data = {
                    no: i,
                    nama_barang: row.getCell(2).value,
                    tipe: row.getCell(3).value,
                    satuan_stock: row.getCell(4).value,
                    satuan_beli: row.getCell(5).value,
                    konversi: row.getCell(6).value,
                    kd_jenis: row.getCell(7).value,
                    qty_minimum: row.getCell(8).value,
                    qty_perhari: row.getCell(9).value,
                    image: 'default.png',
                };

                this.content.push(data);
                i++;
              }
            });

            const { data } = await axios.post('/masterbarang', this.content);

            console.log(data)
            this.message = data.message;
            this.succes = true;
            this.showNotification = true;

            setTimeout(() => {
              this.message = null;
              this.succes = false;
              this.showNotification = false;
              window.location.reload()
            }, 1300)
          };

          reader.readAsArrayBuffer(file)
      } catch(error){ 
        console.log(error)
        this.message = "Internal server error";
        this.succes = false;
        this.showNotification = true;

        setTimeout(() => {
          this.message = null;
          this.succes = false;
          this.showNotification = false;
        }, 1300)
      }
    },
    async readMasterSatuan(file){
      try { 
          let i = 1;
          this.content = [];
          const workbook = new ExcelJS.Workbook();
          const reader = new FileReader();
          reader.onload = async (event) => {
            this.fileContent = event.target.result;
            const excelFile = await workbook.xlsx.load(this.fileContent);
            const worksheet = excelFile.getWorksheet(1);

            this.content = [];
            const first = worksheet.getRow(1);
            if(first.getCell(2).value !== 'kd-satuan' || first.getCell(3).value !== 'nama-satuan') {
              this.message = 'Document in wrong format';
              this.succes = false;
              this.showNotification = true;  

              this.filelist = []
              this.selectedfile = null
              document.getElementById("drop-box").classList.add("bg-canvas")
              document.getElementById("drop-box").classList.remove("bg-orange")
              setTimeout(() => {
                this.message = null;
                this.succes = false;
                this.showNotification = false;
              }, 1300)

              return;
            }

            worksheet.eachRow((row, rowNumber) => {
              if (rowNumber === 1) {
                this.headers = row.values;
              } else {
                const data = {
                    no: i,
                    kode_satuan: row.getCell(2).value,
                    nama_satuan: row.getCell(3).value,
                };

                this.content.push(data);
                i++;
              }
            })

            const { data } = await axios.post('/mastersatuan', this.content, {
              headers: {
                Authorization: 'asdasdasdasdas'
              }
            });

            this.message = data.message;
            this.succes = true;
            this.showNotification = true;

            setTimeout(() => {
              this.message = null;
              this.succes = false;
              this.showNotification = false;
              window.location.reload()
            }, 1300)
          };

          reader.readAsArrayBuffer(file)
      } catch(error){
        console.log(error)
        this.message = "Internal server error";
        this.succes = false;
        this.showNotification = true;

        setTimeout(() => {
          this.message = null;
          this.succes = false;
          this.showNotification = false;
        }, 1300)
      }
    },
    async readMasterJenis(file){
      try { 
          let i = 1;
          this.content = [];
          const workbook = new ExcelJS.Workbook();
          const reader = new FileReader();
          reader.onload = async (event) => {
            this.fileContent = event.target.result;
            const excelFile = await workbook.xlsx.load(this.fileContent);
            const worksheet = excelFile.getWorksheet(1);

            this.content = [];
            const first = worksheet.getRow(1);
            if(first.getCell(2).value !== 'kd-jenis-barang' || first.getCell(3).value !== 'nama-jenis') {
              this.message = 'Document in wrong format';
              this.succes = false;
              this.showNotification = true;  

              this.filelist = []
              this.selectedfile = null
              document.getElementById("drop-box").classList.add("bg-canvas")
              document.getElementById("drop-box").classList.remove("bg-orange")
              setTimeout(() => {
                this.message = null;
                this.succes = false;
                this.showNotification = false;
              }, 1200)

              return;
            }

            worksheet.eachRow((row, rowNumber) => {
              if (rowNumber === 1) {
                this.headers = row.values;
              } else {
                const data = {
                    no: i,
                    kode_jenis: row.getCell(2).value,
                    nama_jenis: row.getCell(3).value,
                };

                this.content.push(data);
                i++;
              }
            })

            const { data } = await axios.post('/master-jenis', this.content);
            this.message = data.message;
            this.succes = true;
            this.showNotification = true;

            setTimeout(() => {
              this.message = null;
              this.succes = false;
              this.showNotification = false;
              window.location.reload()
            }, 1300)
          };

          reader.readAsArrayBuffer(file)
      } catch(error){
        console.log(error)
        this.message = "Internal server error";
        this.succes = false;
        this.showNotification = true;

        setTimeout(() => {
          this.message = null;
          this.succes = false;
          this.showNotification = false;
        }, 1300)
      }
    }
  }
};
</script>

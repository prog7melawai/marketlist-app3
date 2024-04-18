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
                  <option value="">Sample Data</option>
                </select>

                <button 
                  class="btn-primary"
                  @click="downloadTemplate">
                    <spinner v-if="isDownload"></spinner>
                    <span v-if="!isDownload">Download</span>
                </button>
              </div>
            </div>
            
            <loader v-if="loading"></loader>

            <div
              class="load-excel bg-canvas"
              @dragover="dragover"
              @dragleave="dragleave"
              @drop="drop"
              id="drop-box"
              v-if="!loading"
            >
              <h3>Load Excel Template</h3>

              <img
                src="/images/icons/cloud.svg"
                alt="cloud"
                class="cloud-icon"
              />
              <span class="drop-title" v-if="!selectedfile">Drag & Drop File Here</span>
              <span class="filename" v-if="selectedfile">{{ selectedfile }}</span>
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
            </div>

            <div class="table-prev-container" v-if="content.length> 0 && !loading">
                <table class="table-preview">
                    <thead>
                        <th width="5%" style="text-align: center;">No</th>
                        <th width="10%" style="text-align: center;">Kode Barang</th>
                        <th width="25%" style="text-align: left;">Nama Barang</th>
                        <th width="25%" style="text-align: left;">Nama Barang 2</th>
                        <th width="20%" style="text-align: left;">Jenis</th>
                        <th width="5%" style="text-align: center;">Stn Stok</th>
                        <th width="5%" style="text-align: center;">Stn Kirim</th>
                        <th width="5%" style="text-align: center;">Qty</th>
                    </thead>
                    <tbody>
                        <tr v-for="item in content" :key="item.kode_barang">
                          <td style="text-align: center;">{{ item.no }}</td>
                          <td style="text-align: center;">{{ item.kode_barang }}</td>
                          <td style="text-align: left;">{{ item.nama_barang }}</td>
                          <td style="text-align: left;">{{ item.nama_barang2 }}</td>
                          <td style="text-align: left;">{{ item.nama_jenis }}</td>
                          <td style="text-align: center;">{{ item.satuan_stock }}</td>
                          <td style="text-align: center;">{{ item.satuan_kirim }}</td>
                          <td style="text-align: center;">{{ item.qty }}</td>
                        </tr> 
                    </tbody>
                </table>
            </div>

            <button
              class="btn-block-theme"
              style="margin-top: 10px"
              v-if="selectedfile"
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

  <notification 
      v-if="showNotif" 
      :success="success" 
      :message="message">
  </notification>

  <alert-confirm 
      v-if="showAlert"
      :title="title" 
      :message="deleteMessage" 
      :methods="methods" 
      :url="url" 
      :header="sheaders"
      :data="item"
      @onClosed="onClosed"
      @onResolve="submitted">
  </alert-confirm>
</template>

<script>
import Loader from '@/components/Loader.vue';
import Spinner from '@/components/Spinner.vue';
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import Notification from "@/components/Notification.vue";
import ExcelJS from "exceljs";
import axios from 'axios';

export default {
  name: "LoadView",
  components: {
    SidebarVue,
    NavbarVue,
    AlertConfirm,
    Notification,
    Loader,
    Spinner,
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
    async downloadTemplate(){
      try {
        this.isDownload = true;
        const { data } = await axios.get('/pr/asjdhasdasd');
        const barang = data;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        worksheet.columns = [
          { header: 'Kode Barang', key: 'kdbar', width: 15 },
          { header: 'Nama Barang', key: 'nmbar', width: 30 },
          { header: 'Nama Barang 2', key: 'nmbar2', width: 30 },
          { header: 'Kode Jenis', key: 'kode_jenis', width: 10 },
          { header: 'Nama Jenis', key: 'nama_jenis', width: 20 },
          { header: "Kdstn Kirim", key: "kdstn_krm", width: 10 },
          { header: 'Satuan Kirim', key: 'nama_krm', width: 20 },
          { header: "Kdstn Stok", key: "kdstn_stok", width: 10 },
          { header: "Satuann Stok", key: "nama_stok", width: 20 },
          { header: "Quantity", key: "qty", width: 15 },
        ];

        worksheet.getRow(1).height = 30;

        const startCell = 'A1';
        const endCell = 'J1';
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
            kdbar: data.kdbar,
            nmbar: data.nmbar,
            nmbar2: data.nmbar2,
            kode_jenis: data.kode_jenis,
            nama_jenis: data.nm_jenis,
            kdstn_stok: data.kdstn_stok,
            nama_stok: data.nama_stok,
            kdstn_krm: data.kdstn_krm,
            nama_krm: data.nama_krm,
            qty: 0,
          });
        });      
        
        // const startColumn = 'A';
        // const endColumn = 'I';
        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
          row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
            const startCell = `A${rowNumber}`;
            const endCell = `J${rowNumber}`;
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

          // for (let col = startColumn.charCodeAt(0); col <= endColumn.charCodeAt(0); col++) {
          //   const cell = row.getCell(String.fromCharCode(col));
          //   cell.locked = true;
          // }
        });

        // worksheet.getColumn('J').eachCell(function(cell) {
        //   cell.locked = false;
        // });

        // worksheet.protect('faamelawai', {
        //   selectLockedCells: false,
        //   selectUnlockedCells: true,
        // });

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
      console.log(this.content)
    },
    async onChange() {
      this.filelist = [...this.$refs.file.files];
      document.getElementById("drop-box").classList.add("bg-orange");

      this.loading = true;
      await this.readMasterBarang();
      this.loading = false;
      this.selectedfile = this.filelist[0].name;
      console.log(this.content)
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
      this.title = 'Confirmation'
      this.deleteMessage = `Are you sure want to submit Transaction ?`
      this.methods = 'post'
      this.url = '/pr/askjdhaskjdhaksd'
      this.sheaders = {}
      this.item = this.content
      this.showAlert = true
    },
    submitted(value){
      this.showAlert = false
      this.message = value.message;
      this.success = true;
      this.showNotif = true;

      setTimeout(() => {
        this.message = null;
        this.succes = false;
        this.showNotif = false;
        window.location.href = '/pr'
      }, 1300)
    },
    onClosed(value) {
      this.showAlert = value;
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
                if (rowNumber === 3) {
                    this.headers = row.values;
                } else if (rowNumber > 3) {
                    const data = {
                        no: nou,
                        kode_barang: row.getCell(1).value,
                        nama_barang: row.getCell(2).value,
                        nama_barang2: row.getCell(3).value,
                        kd_jenis: row.getCell(4).value,
                        nama_jenis: row.getCell(5).value,
                        kdstn_stock: row.getCell(6).value,
                        satuan_stock: row.getCell(7).value,
                        kdstn_krm: row.getCell(8).value,
                        satuan_kirim: row.getCell(9).value,
                        qty: row.getCell(10).value,
                    };

                    this.content.push(data);
                    nou++
                }
            });
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
  },
};
</script>
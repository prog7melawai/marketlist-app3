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
                </select>

                <select class="select-box" style="width: 30%">
                  <option value="">Sample Data</option>
                </select>

                <button 
                  class="btn-primary" style="width: 100px"
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

              <div class="load-divisi-container">
                  <select class="select-excel-type" v-model="exceltype">
                    <option value="Barang">Master Barang</option>
                  </select>
              </div>              

              <img
                src="/images/icons/cloud.svg"
                alt="cloud"
                class="cloud-icon"
              />
              <span 
                class="drop-title"
                v-if="!selectedfile">
                Drag & Drop File Here
              </span>

              <button
                class="btn-primary"
                style="position: relative"
                v-if="filelist.length == 0">
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

              <span v-if="selectedfile" class="filename">{{ selectedfile }}</span>
            </div>

            <div class="table-prev-container" v-if="content.length> 0 && !loading">
                <table class="table-preview">
                    <thead>
                        <th width="10%" style="text-align: center;">No</th>
                        <th width="20%" style="text-align: center;">Kode Barang</th>
                        <th width="25%" style="text-align: left;">Nama Barang</th>
                        <th width="25%" style="text-align: left;">Nama Barang 2</th>
                        <th width="20%" style="text-align: left;">Tipe Barang</th>
                    </thead>
                    <tbody>
                        <tr v-for="item in content" :key="item.kode_barang">
                          <td style="text-align: center;">{{ item.no }}</td>
                          <td style="text-align: center;">{{ item.kode_barang }}</td>
                          <td style="text-align: left;">{{ item.nama_barang }}</td>
                          <td style="text-align: left;">{{ item.nama_barang2 }}</td>
                          <td style="text-align: left;">{{ item.type }}</td>
                        </tr> 
                    </tbody>
                </table>
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
      v-if="showNotif"
      :message="message"
      :success="succes">
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
import Notification from '@/components/Notification.vue'
import AlertConfirm from '@/components/AlertConfirm.vue';
import ExcelJS from "exceljs";
import axios from 'axios';

export default {
  name: "ImportView",
  components: {
    SidebarVue,
    NavbarVue,
    Notification,
    Loader,
    Spinner,
    AlertConfirm,
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
      authToken: false,
      perm: null,
      permission: null,
    };
  },
  mounted(){
    this.setWidth()
  },
  created(){
    this.authToken = this.$store.getters.GET_AUTH_INFO
    this.perm = this.$store.getters.GET_AUTH_INFO.permission
    this.permission = this.perm.split(",")
    if(!this.permission.includes('import')) window.location.href = '/'
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
    async drop(event) {
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

      this.loading = true;
      await this.readMasterBarang();
      console.log(this.content);
      this.loading = false;
      this.selectedfile = this.filelist[0].name;
    },
    async onChange() {
      this.filelist = [...this.$refs.file.files];
      document.getElementById("drop-box").classList.add("bg-orange");

      this.loading = true;
      await this.readMasterBarang();
      console.log(this.content);
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
    async downloadTemplate(){
      try {
        this.isDownload = true;
        const { data } = await axios.get(`/masterbarang/${this.authToken}`);
        const barang = data;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        worksheet.columns = [
          { header: 'Kode Barang', key: 'kdbar', width: 15 },
          { header: 'Nama Barang', key: 'nmbar', width: 30 },
          { header: 'Nama Barang 2', key: 'nmbar2', width: 30 },
          { header: 'Tipe Barang', key: 'type', width: 15},
          { header: 'Qmin', key: 'qmin', width: 10 },
          { header: 'Kode Jenis', key: 'kode_jenis', width: 10 },
          { header: 'Kode Resto', key: 'kode_resto', width: 10 },
          { header: 'F Kvrs', key: 'f_kvrs', width: 10 },
          { header: 'F Prod', key: 'f_prod', width: 10 },
          { header: "F stok", key: "f_stok", width: 10 },
          { header: "Stn Kirim", key: "kdstn_krm", width: 10 },
          { header: "Stn Stok", key: "kdstn_stok", width: 10 },
          { header: "kdstn_prod", key: "kdstn_prod", width: 10 },
          { header: "F Aktif", key: "f_aktif", width: 10 },
          { header: "Batas Exp", key: "batas_exp", width: 10 },
          { header: "Kd Gdg", key: "kdgdg", width: 10 },
          { header: "Lok Kd", key: "lok_kd", width: 10 },
          { header: "Qmax", key: "qmax", width: 10 },
          { header: "Old kdbar", key: "oldkdbar", width: 15 },
          { header: "kddiv", key: "kddiv", width: 10 },
          { header: "f_audit", key: "f_audit", width: 10 },
          { header: "f_pcab", key: "f_pcab", width: 10 },
          { header: "bufprod", key: "bufprod", width: 10 },
          { header: "gambar", key: "gambar", width: 20 },
          { header: "f_waste", key: "f_waste", width: 10 },
          { header: "subdiv_kd", key: "subdiv_kd", width: 10 },
          { header: "f_updhrg", key: "f_updhrg", width: 10 },
          { header: "f_updkvr", key: "f_updkvr", width: 10 },
          { header: "aliaskdbar", key: "aliaskdbar", width: 15 },
          { header: "kdktgr", key: "kdktgr", width: 10 },
          { header: "f_jual", key: "f_jual", width: 10 },
          { header: "perhjual", key: "perhjual", width: 10 },
        ];

        worksheet.getRow(1).height = 30;

        const startCell = 'A1';
        const endCell = 'AF1';
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
          const f_kvrs = data.f_kvrs || data.f_kvrs === 0 ? 'true' : 'false';
          const f_prod = data.f_prod || data.f_prod === 0 ? 'true' : 'false';
          const f_stok = data.f_stok || data.f_stok === 0 ? 'true' : 'false';
          const f_aktif = data. f_aktif || data. f_aktif === 0 ? 'true' : 'false';
          const f_audit =  data.f_audit || data.f_audit === 0 ? 'true' : 'false';
          const f_pcab =  data.f_pcab || data.f_pcab === 0 ? 'true' : 'false';
          const f_waste =  data.f_waste || data.f_waste === 0 ? 'true' : 'false';
          const f_updhrg =  data.f_updhrg || data.f_updhrg === 0 ? 'true' : 'false';
          const f_updkvr =  data.f_updkvr || data.f_updkvr === 0 ? 'true' : 'false';
          const f_jual =  data.f_jual || data.f_jual === 0 ? 'true' : 'false';
          
          worksheet.addRow({
            kdbar: data.kdbar,
            nmbar: data.nmbar,
            nmbar2: data.nmbar2,
            type: '',
            qmin: data.qmin,
            kode_jenis: data.kode_jenis,
            koderest: data.koderest,
            f_kvrs: f_kvrs,
            f_prod: f_prod,
            f_stok: f_stok,
            kdstn_krm: data.kdstn_krm,
            kdstn_stok: data.kdstn_stok,
            kdstn_prod: data.kdstn_prod,
            f_aktif: f_aktif,
            batas_exp: data.batas_exp,
            kdgdg: data.kdgdg,
            lok_kd: data.lok_kd,
            qmax: data.qmax,
            oldkdbar: data.oldkdbar,
            kddiv: data.kddiv,
            f_audit: f_audit,
            f_pcab: f_pcab,
            bufprod: data.bufprod,
            gambar: data.gambar,
            f_waste: f_waste,
            subdiv_kd: data.subdiv_kd,
            f_updhrg: f_updhrg,
            f_updkvr: f_updkvr,
            aliaskdbar: data.aliaskdbar,
            kdktgr: data.kdktgr,
            f_jual: f_jual,
            perhjual: data.perhjual,
          });
        });        

        const startColumn = 'A';
        const endColumn = 'AF';
        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
          for (let col = startColumn.charCodeAt(0); col <= endColumn.charCodeAt(0); col++) {
            const cell = row.getCell(String.fromCharCode(col));
            cell.locked = true;
            console.log(rowNumber)
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          }

          // row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
          //   const startCell = `A${rowNumber}`;
          //   const endCell = `AF${rowNumber}`;
          //   const cellAddress = cell.address;
          //   if (cellAddress >= startCell && cellAddress <= endCell){
          //     console.log(rowNumber, colNumber)
          //     cell.border = {
          //       top: { style: 'thin' },
          //       left: { style: 'thin' },
          //       bottom: { style: 'thin' },
          //       right: { style: 'thin' }
          //     };
          //   }
          // });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'MasterBarang.xlsx';
        a.style = 'opacity: 0';
        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
        this.isDownload = false;
      } catch(error){
        console.log(error)
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
    async submitFile() {
      if (!this.exceltype) {
        this.message = 'Please select document type!';
        this.succes = false;
        this.showNotif = true;  

        setTimeout(() => {
          this.message = null;
          this.succes = false;
          this.showNotif = false;
        }, 1300)

        return;
      }

      this.title = 'Confirmation'
      this.deleteMessage = `Are you sure want to submit Transaction ?`
      this.methods = 'post'
      this.url = `/marketlist/${this.authToken}`
      this.sheaders = {}
      this.item = this.content
      this.showAlert = true;
      // if(this.exceltype === 'Barang'){
      //   this.readMasterBarang(this.filelist[0])  
      // } else if(this.exceltype === 'Satuan'){
      //   this.readMasterSatuan(this.filelist[0])
      // } else if(this.exceltype === 'Jenis'){
      //   this.readMasterJenis(this.filelist[0])
      // }
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
        window.location.href = '/marketlist'
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
                        type: row.getCell(4).value,
                        qmin: row.getCell(5).value,
                        kd_jenis: row.getCell(6).value,
                        koderest: row.getCell(7).value,
                        f_kvrs: row.getCell(8).value,
                        f_prod: row.getCell(9).value,
                        f_stok: row.getCell(10).value,
                        kdstn_krm: row.getCell(11).value,
                        kdstn_stok: row.getCell(12).value,
                        kdstn_prod: row.getCell(13).value,
                        f_aktif: row.getCell(14).value,
                        batas_exp: row.getCell(15).value,
                        kdgdg: row.getCell(16).value,
                        lok_kd: row.getCell(17).value,
                        qmax: row.getCell(18).value,
                        oldkdbar: row.getCell(19).value,
                        kddiv: row.getCell(20).value,
                        f_audit: row.getCell(21).value,
                        f_pcab: row.getCell(22).value,
                        bufprod: row.getCell(23).value,
                        gambar: row.getCell(24).value,
                        f_waste: row.getCell(25).value,
                        subdiv_kd: row.getCell(26).value,
                        f_updhrg: row.getCell(27).value,
                        f_updkvr: row.getCell(28).value,
                        aliaskdbar: row.getCell(29).value,
                        kdktgr: row.getCell(30).value,
                        f_jual: row.getCell(31).value,
                        perhjual: row.getCell(32).value,
                    };

                    this.content.push(data);
                    nou++
                }
            });
        } catch (error) {
            console.error("An error occurred:", error);
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

<template>
  <div class="modal-container">
    <div class="overlay fade-in" id="overlay" @click="closeModal"></div>
    <div
      class="modal-dialog theme-scroll fade-in-down"
      id="modal-dialog"
      style="max-height: 500px;overflow: hidden;"
    >
      <div class="btn-close" @click="closeModal">
        <i class="ri-close-fill"></i>
      </div>

      <span class="modal-title">{{ tittle }}</span>

      <div class="modal-content">
        <div class="row" style="margin-top: 20px">
          <div
            style="
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 15px;
            "
          >
            <div style="display: flex;flex-direction: row;justify-content: center;gap: 20px;align-items: center;">
              <span style="margin-right: 5px;">Single</span>
              <div class="switch-container">
                <label class="switch">
                  <input class="togglesw" type="checkbox" @change="checkType">
                  <div class="indicator left"></div>
                  <div class="indicator right"></div>
                  <div class="switch-button"></div>
                </label>
              </div>
              <span>Bulk Create</span>
            </div>

            <div class="content-wrapper" style="margin-bottom: 0px;box-shadow: none;">
              <div v-if="!checkedType" style="position: relative;">
                
                <div style="position: relative; margin-top: 30px;">
                  <label 
                    class="input-placeholder" 
                    :class="{ 'color-orange': master.div_kd }">
                    Divisi
                  </label>

                  <select style="width: 99%;height: 40px;border-radius: 5px;" v-model="master.div_kd" @change="getSubdiv">
                      <option v-for="div in divisi" :key="div.divkd" :value="div.divkd">{{ div.divnm }}</option>
                  </select> 
                </div>

                <div style="position: relative; margin-top: 10px;">
                  <label 
                    class="input-placeholder" 
                    :class="{ 'color-orange': master.subdiv_kd }">
                    Subdivisi
                  </label>

                  <select style="width: 99%;height: 40px;border-radius: 5px;" v-model="master.subdiv_kd" @change="getDept">
                      <option v-for="sub in subdiv" :key="sub.subdiv_kd" :value="sub.subdiv_kd">{{ sub.subdiv_nm }}</option>
                  </select> 
                </div>

                <div style="position: relative; margin-top: 10px;">
                  <label 
                    class="input-placeholder" 
                    :class="{ 'color-orange': master.dept_kd }">
                    Department
                  </label>

                  <select style="width: 99%;height: 40px;border-radius: 5px;" v-model="master.dept_kd">
                      <option v-for="dept in department" :key="dept.dept_kd" :value="dept.dept_kd">{{ dept.dept_nm }}</option>
                  </select> 
                </div>

                <div style="position: relative;margin-top: 10px;">
                  <label
                    class="input-placeholder"
                    :class="{ 'color-orange': master.kode }">
                    Kode
                  </label>

                  <input
                    type="text"
                    class="form-input"
                    v-model="master.kode"
                    style="width: 96%"
                  />
                </div>

                <div style="position: relative;margin-top: 10px;">
                  <label 
                    class="input-placeholder" 
                    :class="{ 'color-orange': master.name }">
                    Name
                  </label>

                  <input
                    type="text"
                    class="form-input"
                    v-model="master.name"
                    style="width: 96%"
                  />
                </div>

                <button
                  class="btn-block btn-primary"
                  style="margin-top: 30px; margin-bottom: 10px"
                  @click="submitMasterSingle">
                  <spinner v-if="loading"></spinner>
                  <span v-if="!loading">Submit</span>
                </button>
              </div>

              <div v-if="checkedType" class="content">
                <div class="load-excel bg-canvas" 
                  @dragover="dragover" 
                  @dragleave="dragleave" 
                  @drop="drop" id="drop-box">
                  <h3>Load Master Jenis Template</h3>      

                  <img
                    src="/images/icons/cloud.svg"
                    alt="cloud"
                    class="cloud-icon" style="width: 100px;"
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

                <button
                  class="btn-block btn-primary"
                  style="margin-top: 30px; margin-bottom: 10px"
                  @click="submitMaster"
                  v-if="filelist.length > 0">
                  <spinner v-if="loading"></spinner>
                  <span v-if="!loading">Submit</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        <input type="text" :value="jenis" hidden />
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/Spinner.vue";
import ExcelJS from "exceljs";
import axios from 'axios';

export default {
  name: "CreateUnitModal",
  props: ["tittle", "url"],
  components: {
    Spinner,
  },
  data() {
    return {
      loading: false,
      body: {},
      master: {
        div_kd: null,
        subdiv_kd: null,
        dept_kd: null,
        kode: null,
        name: null,
      },
      selectedFile: null,
      filelist: [],
      jenis: [],
      authToken: null,
      checkedType: false,
      divisi: null,
      subdiv: null,
      department: null,
    };
  },
  created(){
    this.authToken = this.$store.getters.GET_AUTH_TOKEN
  },
  mounted(){
    this.getDivisi()
  },
  methods: {
    async getDivisi(){
      try {
        const { data } = await axios.get(`/divisi/${this.authToken}`);
        this.divisi = data
      } catch(error){
        console.log(error)
      }
    },
    async getSubdiv(){
      try {
        const { data } = await axios.get(`/subdivisi/${this.master.div_kd}/${this.authToken}`);
        this.subdiv = data
      } catch(error){
        console.log(error)
      }
    },
    async getDept(){
      try {
        const { data } = await axios.get(`/department/${this.master.div_kd}/${this.master.subdiv_kd}/${this.authToken}`);
        this.department = data
      } catch(error){
        console.log(error)
      }
    },
    checkType(){
      if(this.checkedType) {
        setTimeout(() => {
          this.checkedType = false
        }, 400)
      } else {
        setTimeout(() => {
          this.checkedType = true
        }, 400)
      }
    },
    closeModal() {
      document.getElementById("modal-dialog").classList.remove("fade-in-down");
      document.getElementById("modal-dialog").classList.add("fade-out-down");
      document.getElementById("overlay").classList.remove("fade-in");
      document.getElementById("overlay").classList.add("fade-out");
      setTimeout(() => {
        this.$emit("closed", false);
        document
          .getElementById("modal-dialog")
          .classList.remove("fade-out-down");
        document.getElementById("overlay").classList.remove("fade-out");
        document.getElementById("modal-dialog").classList.add("fade-in-down");
        document.getElementById("overlay").classList.add("fade-in");
      }, 500);
    },
    async submitMaster() {
      try {
        this.loading = true
        const { data } = await axios.post(`/masbarjenis/${this.authToken}`, this.jenis);

        console.log(data)
        this.$emit('onResolve', data)
        this.loading = false
      } catch (error) {
        console.log(error);
      }
    },
    async submitMasterSingle() {
      try {
        this.loading = true
        const body = [];
        body.push(this.master)

        const { data } = await axios.post(`/masbarjenis/${this.authToken}`, body);

        console.log(data)
        this.$emit('onResolve', data)
        this.loading = false
      } catch (error) {
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
      await this.readMasterJenis();
      this.loading = false;
      this.selectedfile = this.filelist[0].name;
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
    async onChange() {
      this.filelist = [...this.$refs.file.files];
      document.getElementById("drop-box").classList.add("bg-orange");

      this.loading = true;
      await this.readMasterJenis();
      this.loading = false;
      this.selectedfile = this.filelist[0].name;
    },
    async readMasterJenis() {
        this.jenis = [];
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
                        dept_kd: String(row.getCell(1).value),
                        div_kd: String(row.getCell(2).value),
                        subdiv_kd: String(row.getCell(3).value),
                        kd_jenis: String(row.getCell(4).value),
                        nm_jenis: row.getCell(5).value,
                        acc_no: String(row.getCell(6).value),
                    };

                    this.jenis.push(data);
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

<style>
.switch-container {
  display: flex;
  align-items: center;
  justify-content: center;
  --hue: 220deg;
  --width: 5rem;
  --accent-hue: 22deg;
  --duration: 0.4s;
  --easing: cubic-bezier(1, 0, 1, 1);
}

.togglesw {
  display: none;
}

.switch {
  --shadow-offset: calc(var(--width) / 20);
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: var(--width);
  height: calc(var(--width) / 2.5);
  border-radius: var(--width);
  box-shadow: inset 10px 10px 10px hsl(var(--hue) 20% 80%),
    inset -10px -10px 10px hsl(var(--hue) 20% 93%);
}

.indicator {
  content: '';
  position: absolute;
  width: 40%;
  height: 60%;
  transition: all var(--duration) var(--easing);
  box-shadow: inset 0 0 2px hsl(var(--hue) 20% 15% / 60%),
    inset 0 0 3px 2px hsl(var(--hue) 20% 15% / 60%),
    inset 0 0 5px 2px hsl(var(--hue) 20% 45% / 60%);
}

.indicator.left {
  --hue: var(--accent-hue);
  overflow: hidden;
  left: 10%;
  border-radius: 100px 0 0 100px;
  background: linear-gradient(180deg, hsl(calc(var(--accent-hue) + 20deg) 95% 80%) 10%, hsl(calc(var(--accent-hue) + 20deg) 100% 60%) 30%, hsl(var(--accent-hue) 90% 50%) 60%, hsl(var(--accent-hue) 90% 60%) 75%, hsl(var(--accent-hue) 90% 50%));
}

.indicator.left::after {
  content: '';
  position: absolute;
  opacity: 0.6;
  width: 100%;
  height: 100%;
}

.indicator.right {
  right: 10%;
  border-radius: 0 100px 100px 0;
  background-image: linear-gradient(180deg, hsl(var(--hue) 20% 95%), hsl(var(--hue) 20% 65%) 60%, hsl(var(--hue) 20% 70%) 70%, hsl(var(--hue) 20% 65%));
}

.switch-button {
  position: absolute;
  z-index: 1;
  width: 55%;
  height: 80%;
  left: 5%;
  border-radius: 100px;
  background-image: linear-gradient(160deg, hsl(var(--hue) 20% 95%) 40%, hsl(var(--hue) 20% 65%) 70%);
  transition: all var(--duration) var(--easing);
  /* box-shadow: 2px 2px 3px hsl(var(--hue) 18% 50% / 80%),
    2px 2px 6px hsl(var(--hue) 18% 50% / 40%),
    10px 20px 10px hsl(var(--hue) 18% 50% / 40%),
    20px 30px 30px hsl(var(--hue) 18% 50% / 60%); */
}

.switch-button::before, 
.switch-button::after {
  content: '';
  position: absolute;
  top: 10%;
  width: 41%;
  height: 80%;
  border-radius: 100%;
}

.switch-button::before {
  left: 5%;
  box-shadow: inset 1px 1px 2px hsl(var(--hue) 20% 85%);
  background-image: linear-gradient(-50deg, hsl(var(--hue) 20% 95%) 20%, hsl(var(--hue) 20% 85%) 80%);
}

.switch-button::after {
  right: 5%;
  box-shadow: inset 1px 1px 3px hsl(var(--hue) 20% 70%);
  background-image: linear-gradient(-50deg, hsl(var(--hue) 20% 95%) 20%, hsl(var(--hue) 20% 75%) 80%);
}

.togglesw:checked ~ .switch-button {
  left: 40%;
}

.togglesw:not(:checked) ~ .indicator.left,
.togglesw:checked ~ .indicator.right {
  box-shadow: inset 0 0 5px hsl(var(--hue) 20% 15% / 100%),
    inset 20px 20px 10px hsl(var(--hue) 20% 15% / 100%),
    inset 20px 20px 15px hsl(var(--hue) 20% 45% / 100%);
}
</style>

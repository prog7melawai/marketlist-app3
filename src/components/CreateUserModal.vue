<template>
    <div class="modal-container">
      <div class="overlay fade-in" id="overlay" @click="closeModal"></div>
      <div class="modal-dialog theme-scroll fade-in-down" id="modal-dialog">
        <div class="btn-close" @click="closeModal">
          <i class="ri-close-fill"></i>
        </div>
  
        <span class="modal-title">Create New User</span>
  
        <div class="modal-content">
          <div class="row" style="margin-top: 20px">
            <div style="width: 50%">
              <div class="image-input bg-gradient-gray" id="image-input">
                <i class="ri-image-add-fill" v-if="!selectedfile"></i>
                <div v-if="selectedfile" style="width: 100%">
                  <div v-for="img in images" :key="img">
                    <img :src="img" class="preview" alt="item" />
                  </div>
                </div>
  
                <span class="image-select-title" v-if="!selectedfile">
                  Select or Drop File Here
                </span>
  
                <input
                  type="file"
                  class="image-add"
                  ref="file"
                  @dragover="dragover"
                  @dragleave="dragleave"
                  @drop="drop"
                  @change="onChange"
                />
  
                <button
                  class="btn-danger btn-remove"
                  v-if="selectedfile !== null"
                  @click="removeFile"
                >
                  Remove
                </button>
  
                <span class="image-name">
                  {{ selectedfile }}
                </span>
              </div>
            </div>
            <div
              style="width: 50%; 
              display: flex; 
              flex-direction: column; 
              gap: 14px"
            >
              <input 
                type="text" 
                class="form-input" 
                placeholder="NIK" 
                v-model="employee.nik"
              />
              <span style="font-size: 9pt;color: red;margin-top: -10px;">{{ error.nik }}</span>

              <input 
                type="text" 
                class="form-input" 
                placeholder="Userid" 
                v-model="employee.userid"
              />

              <input 
                type="text" 
                class="form-input" 
                placeholder="Full Name" 
                v-model="employee.fullname"
              />

              <input 
                type="email" 
                class="form-input" 
                placeholder="Email" 
                v-model="employee.email"
              />

              <input 
                type="text" 
                class="form-input" 
                placeholder="Phone" 
                v-model="employee.phone"
              />

              <input 
                type="password" 
                class="form-input" 
                placeholder="Password" 
                v-model="employee.password"
              />
            </div>
            <span class="form-label">Select Divisi</span>
            <select name="" id="" class="select-input" v-model="selectedDivisi">
                <option 
                    v-for="item in divisi" 
                    :key="item.divkd" 
                    :value="item.divkd">
                        {{ item.divkd }} - {{ item.divnm }}
                </option>
            </select>
            <span class="form-label">Select Subdivisi</span>
            <select name="" id="" class="select-input" v-model="selectedSubdivisi">
                <option 
                    v-for="item in subdiv"
                    :key="item.subdiv_kd"
                    :value="item.subdiv_kd">
                        {{ item.subdiv_kd }} - {{ item.subdiv_nm }}
                </option>
            </select>
            <span class="form-label">Select Department</span>
            <select name="" id="" class="select-input" v-model="selectedDepartment">
                <option 
                    v-for="item in department"
                    :key="item.dept_kd"
                    :value="item.dept_kd">
                        {{ item.dept_kd }} - {{ item.dept_nm }}
                </option>
            </select>
          </div>
  
          <br/><br />
          <span style="margin-top: 10px;font-size: 11pt">
            Select menu for user :
          </span>
          <div
            class="items-box theme-scroll"
            style="
              height: 180px;
              overflow-y: scroll;
              border: 1px solid var(--light);
              border-radius: 5px;
              margin-bottom: 20px;
              width: 100%;
            "
          >
            <table class="table-items" aria-describedby="Master items data">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Menu</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody style="text-align: center">
                <tr v-for="(items, idx) in menu" :key="items.name">
                  <td>{{ idx + 1 }}</td>
                  <td>{{ items.name }}</td>
                  <td>
                    <input
                      type="checkbox"
                      class="select-box"
                      :checked="false"
                      :value="items.name"
                      @change="addToCart"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <button
            class="btn-block btn-primary"
            style="margin-top: 10px;width: 100%"
            @click="submitUser">
            <spinner v-if="loading"></spinner>
            <span v-if="!loading">Save</span>
          </button>
  
          <div style="width:100%;height: 30px;">
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import Spinner from './Spinner.vue';

  export default {
    name: "CreateUserModalVue",
    components: {
        Spinner,
    },
    data() {
      return {
        selectedfile: null,
        filelist: [],
        headers: [],
        content: [],
        images: [],
        permission: [],
        divisi: null,
        department: null,
        subdiv: null,        
        selectedDivisi: null,
        selectedSubdivisi: null,
        selectedDepartment: null,
        menu: null,
        loading: false,
        error: {
            nik: null,
            userid: null,
            fullname: null,
            phone: null,
            email: null,
            password: null,
            userimage: null,
            imagefile: null,
            divisi: null,
            subdivisi: null,
            department: null,
            permission: []
        },
        employee: {
            nik: null,
            userid: null,
            fullname: null,
            phone: null,
            email: null,
            password: null,
            userimage: null,
            imagefile: null,
            divisi: null,
            subdivisi: null,
            department: null,
            permission: []
        },
      };
    },
    watch: {
        selectedDivisi: function() {
            console.log(this.selectedDivisi)
            this.getSubdivisi(this.selectedDivisi);
        },
        selectedSubdivisi: function() {
            this.getDepartment(this.selectedSubdivisi);
        }
    },
    mounted() {
        this.menu =  [...this.$store.state.menu];
        this.getDivisi()
    },
    methods: {
      async getDivisi(){
        try {
          const { data } = await axios.get('/divisi/asdasdasd')
          this.divisi = data
        } catch(error){
          console.log(error)
        }
      },
      async getSubdivisi(divisi){
        try {
          const { data } = await axios.get(`/subdivisi/${divisi}/asdasdasd`)
          this.subdiv = data
        } catch(error){
          console.log(error)
        }
      },
      async getDepartment(subdivisi){
        try {
          const { data } = await axios.get(`/dept/${subdivisi}/asdasdasd`)
          this.department = data
        } catch(error){
          console.log(error)
        }
      },
      async getMenu(){
        try {
          const { data } = await axios.get(`/menu/asdasdasd`)
          this.menu = data
        } catch(error){
          console.log(error)
        }
      },
      closeModal() {
        this.receipe = []
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
      dragover() {
        if (
          !document.getElementById("image-input").classList.contains("bg-orange")
        ) {
          document
            .getElementById("image-input")
            .classList.remove("bg-gradient-gray");
          document.getElementById("image-input").classList.add("bg-orange");
        }
      },
      dragleave() {
        document.getElementById("image-input").classList.add("bg-gradient-gray");
        document.getElementById("image-input").classList.remove("bg-orange");
      },
      drop(event) {
        event.preventDefault();
        const fileArray = event.dataTransfer.files;
        if (
          fileArray[0].type === "image/png" ||
          fileArray[0].type === "image/jpg"
        ) {
          this.filelist.push(fileArray[0]);
        } else {
          alert("Invalid file input: " + fileArray[0].name + "!");
          return;
        }
  
        this.selectedfile = this.filelist[0].name;
        this.selectedfile = this.selectedfile.substring(0, 25);
      },
      onChange(e) {
        this.filelist.push(e.target.files[0]);
        if (e.target.files[0]) {
          this.selectedfile = e.target.files[0].name;
          this.selectedfile = this.selectedfile.substring(0, 25);
        }
  
        document.getElementById("image-input").classList.add("bg-orange");
        let files = Array.prototype.slice.call(e.target.files);
        files.forEach((f) => {
          if (!f.type.match("image.*")) {
            return;
          }
  
          let reader = new FileReader();
          let that = this;
  
          reader.onload = function (e) {
            that.images.push(e.target.result);
          };
          reader.readAsDataURL(f);
        });
      },
      removeFile() {
        this.filelist = [];
        this.content = [];
        this.headers = [];
        this.images = [];
        this.selectedfile = null;
        document.getElementById("image-input").classList.remove("bg-orange");
        document.getElementById("image-input").classList.add("bg-gradient-gray");
      },
      addToCart(e) {
        const id = e.srcElement._value;
        if (e.srcElement.checked) {
          const find = this.menu.filter((obj) => {
            return obj.name === id;
          });
  
          if (find) {
            this.employee.permission.push(find[0]);
          }
        } else if (!e.srcElement.checked) {
          const find = this.menu.filter((obj) => {
            return obj.name === id;
          });
  
          this.employee.permission.splice(this.menu.indexOf(find[0]), 1);
        }
      },
      async submitUser(){
        try {
            let cnt = 0;
            if(!this.employee.nik) {
                this.error.nik = 'NIK field is required!'
                cnt++
            }

            if(!this.employee.userid) {
                this.error.userid = 'Username field is required!'
                cnt++
            }

            if(!this.employee.fullname) {
                this.error.fullname = 'Fullname field is required!'
                cnt++
            }

            if(!this.employee.email) {
                this.error.email = 'Email field is required!'
                cnt++
            }

            if(!this.employee.phone) {
                this.error.phone = 'Phone field is required!'
                cnt++
            }

            if(!this.selectedDivisi) {
                this.error.divisi = 'Divisi field is required!'
                cnt++
            }

            if(!this.selectedSubdivisi) {
                this.error.subdivisi = 'Subdivisi field is required!'
                cnt++
            }

            if(!this.selectedDepartment) {
                this.error.department = 'Department field is required!'
                cnt++
            }

            if(cnt > 0) return;

            this.loading = true;
            this.employee.divisi = this.selectedDivisi
            this.employee.subdivisi = this.selectedSubdivisi
            this.employee.department = this.selectedDepartment

        //   const filename = String(this.employee.fullname).replace(" ", "_") + '.' + String(this.selectedfile).split('.').pop();
        
        //   const formData = new FormData()
        //   formData.append('nik', this.employee.nik)
        //   formData.append('username', this.employee.username)
        //   formData.append('fullname', this.employee.fullname)
        //   formData.append('imagefile', filename, this.filelist)
        //   formData.append('email', this.employee.email)
        //   formData.append('phone', this.employee.phone)
        //   formData.append('password', this.employee.password)
        //   formData.append('divisi', this.selectedDivisi)
        //   formData.append('subdivisi', this.selectedSubdivisi)
        //   formData.append('department', this.selectedDepartment)
        //   for (var i = 0; i < this.employee.permission.length; i++) {
        //     formData.append('permission[]', this.employee.permission[i]);
        //   }
  
        //   for (var pair of formData.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]); 
        //   }
  
          const { data } = await axios.post('/user/asdasdasda', this.employee)
          console.log(data)
          this.loading = false;
        } catch(error){
          console.log(error)
        }
      }
    },
  };
  </script>
  
  <style>
  
  </style>
  
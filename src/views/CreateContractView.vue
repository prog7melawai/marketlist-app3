<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper pl-30">
          <div class="content-title">
            <i @click="$router.back()" class="ri-arrow-left-circle-fill back-btn"></i>
            <h2>Create New Contract</h2>
          </div>

          <div class="content">
                <div style="width: 100%;display: flex;flex-direction: row;flex-wrap: wrap;justify-content: space-between;">
                    <div class="form-group">
                        <label class="form-label" :class="{ 'color-orange': contract.divisi_kd }">Divisi</label>
                        <select style="width: 99%;height: 40px;border-radius: 5px;" v-model="contract.divisi_kd" @change="getSubdiv">
                            <option v-for="div in divisi" :key="div.divkd" :value="div.divkd">{{ div.divnm }}</option>
                        </select>
                        <span>{{ error.divisi_kd }}</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label" :class="{ 'color-orange': contract.subdiv_kd }">Subdivisi</label>
                        <select style="width: 99%;height: 40px;border-radius: 5px;" v-model="contract.subdiv_kd" @change="getSuppliers">
                            <option v-for="subdiv in subdivisi" :key="subdiv.subdiv_kd" :value="subdiv.subdiv_kd">{{ subdiv.subdiv_nm }}</option>
                        </select>
                        <span>{{ error.subdiv_kd }}</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label" :class="{ 'color-orange': contract.sup_kd }">Supplier</label>
                        <select style="width: 99%;height: 40px;border-radius: 5px;" v-model="contract.sup_kd">
                            <option v-for="supp in suppliers" :key="supp.sup_kd" :value="supp.sup_kd">{{ supp.sup_nm }}</option>
                        </select>
                        <span>{{ error.sup_kd }}</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label" :class="{ 'color-orange': contract.currency }">Currency</label>
                        <input type="text" style="width: 99%;padding: 0" class="form-input" v-model="contract.currency" />
                        <span>{{ error.sup_kd }}</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label" :class="{ 'color-orange': contract.top }">Terms Of Payment</label>
                        <input type="number" style="width: 99%;padding: 0" class="form-input" v-model="contract.top" />
                        <span>{{ error.top }}</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label" :class="{ 'color-orange': contract.start_date }">Start Date</label>
                        <VueDatePicker 
                            style="width: 99%" 
                            v-model="contract.start_date"
                            placeholder="Start Contract Date"
                            :min-date="new Date()"
                            :enable-time-picker="false" 
                            :format="format"/>
                        <span>{{ error.start_date }}</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label" :class="{ 'color-orange': contract.end_date }">End Date</label>
                        <VueDatePicker 
                            v-model="contract.end_date" 
                            placeholder="End Contract Date" 
                            :min-date="new Date()"
                            :enable-time-picker="false" 
                            :format="format"/>
                        <span>{{ error.end_date }}</span>
                    </div>
                </div>

                <div style="width: 100%;margin: 0 auto">
                    <div class="form-group" style="width: 100%">
                        <label class="form-label" :class="{ 'color-orange': contract.note }">Notes</label>
                        <textarea style="width: 100%;border: 1px solid gray;" rows="7" v-model="contract.note"></textarea>
                    </div>
                </div>

                <div style="width: 100%;
                     display: flex;
                     justify-content: end;
                     margin-bottom: -10px;
                     margin-top: 30px;">
                    <div style="width: 300px">
                        <input 
                            type="text" 
                            class="form-input"
                            style="width: 93%"
                            placeholder="Search items..."
                            v-model="searchItem"
                            @keyup.enter="searching">
                    </div>
                </div>
                <div style="position: relative;width: 100%;margin-top: 20px;overflow-x: scroll;">
                    <table class="table-responsive" style="width: 120%">
                        <thead class="bg-dark">
                            <tr>
                                <th width="5%">Select</th>
                                <th width="5%">No</th>
                                <th width="5%">Image</th>
                                <th width="10%">KD Product</th>
                                <th style="width: 15%;text-align: left">
                                    <select class="select-jenis" v-model="kdjns" @change="getProduct">
                                        <option value="all">Jenis</option>
                                        <option v-for="jns in jenis" :key="jns.kdjns" :value="jns.kdjns">{{ jns.nm_jenis }}</option>
                                    </select>
                                </th>
                                <th style="width: 20%;text-align: left">Product Name</th>
                                <th width="5%">Stock Units</th>
                                <th width="5%">Purchase Units</th>
                                <th width="10%">Price</th>
                                <th width="5%">Disc%</th>
                            </tr>
                        </thead>

                        <tbody v-if="isLoading">
                            <tr>
                                <td colspan="10">
                                    <loader></loader>
                                </td>
                            </tr>
                        </tbody>
                        
                        <tbody v-if="!isLoading">
                            <tr v-for="(masbar, index) in masbars[selectedPage]" 
                                :key="masbar.kdbar"
                                :class="{ 'bg-canvas': index % 2 == 0 }">
                                <td>
                                    <input 
                                        type="checkbox" 
                                        :id="'select' + masbar.kdbar" 
                                        :value="masbar.kdbar"
                                        @change="selectItems"
                                        :checked="masbar.checked">
                                </td>
                                <td>{{ masbar.no }}</td>
                                <td>
                                    <img
                                        :src="getFoodImage(masbar.image)"
                                        :alt="masbar.image"
                                        @click="showingPreview(masbar.image)"
                                        style="width: 60px;
                                        height: 60px;
                                        object-fit: cover;
                                        cursor: pointer"
                                    />
                                </td>
                                <td>{{ masbar.kdbar }}</td>
                                <td style="text-align: left;">
                                    {{ masbar.nm_jenis }}
                                </td>
                                <td style="text-align: left;">
                                    {{ masbar.nmbar }}
                                </td>
                                <td>{{ masbar.nm_stok }}</td>
                                <td style="position: relative;">
                                    <select 
                                        style="width: 99%;
                                        height: 40px;
                                        border-radius: 5px;" 
                                        :id="`satuan${masbar.kdbar}`"
                                        @change="addKdstn(masbar.kdbar)" 
                                        :disabled="masbar.readonly"
                                        :value="`${masbar.kdstn}-${masbar.nmstn_beli}`">
                                        <!-- <option :value="null">Satuan</option> -->
                                        <spinner
                                            style="position: absolute;top: 5px"
                                            :id="`spinner${masbar.kdbar}`"></spinner>
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        class="form-input" 
                                        type="number" 
                                        style="width: 80%;"
                                        :id="'price' + masbar.kdbar"
                                        :readonly="masbar.readonly"
                                        v-on:keydown.enter="addPrice(masbar.kdbar)"
                                        v-on:keydown.tab="addPrice(masbar.kdbar)"
                                        :value="masbar.price">
                                </td>
                                <td>
                                    <input 
                                        class="form-input" 
                                        type="number" 
                                        style="width: 70%;"
                                        :id="'disc' + masbar.kdbar"
                                        :readonly="masbar.readonly"
                                        v-on:keydown.enter="addDisc(masbar.kdbar)"
                                        v-on:keydown.tab="addDisc(masbar.kdbar)"
                                        :value="masbar.disc">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="page-wrapper" v-if="total_page.length > 0">
                    <div style="width: 50%">
                    <span style="font-size: 10pt">
                        Showing {{ masbars[selectedPage][0].no }} to
                        {{ masbars[selectedPage][masbars[selectedPage].length - 1].no }} of 
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
                    <button
                        class="page-prev"
                        @click="prevPagination"
                        :class="{ 'paginate-active': start >= 5 }"
                    >
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
                        @click="selectPages(pg)"
                    >
                        {{ pg + 1 }}
                    </div>
                    <button
                        :class="{ 'paginate-active': total_page.length > end }"
                        class="page-next"
                        @click="nextPagination"
                    >
                        Next
                    </button>
                    </div>
                </div>

                <button 
                    class="btn-block btn-success" 
                    style="margin-top: 20px" 
                    @click="submitContract">
                        Submit
                </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <notification-alert 
      v-if="showNotifAlert" 
      :success="success" 
      :message="message"
      @onClosed="onClosedNotif">
  </notification-alert>

  <alert-confirm 
      v-if="showAlert"
      :title="title" 
      :message="alertMessage" 
      :methods="methods" 
      :url="url" 
      :header="sheaders"
      :data="item"
      @onClosed="onClosed"
      @onResolve="submitted"
      @onError="onError">
  </alert-confirm>

  <preview-image
    v-if="selectedImage"
    :source="selectedImage"
    @onClosed="onClosedPreview">
  </preview-image>
</template>

<script>
import Spinner from "@/components/Spinner.vue";
import NotificationAlert from "@/components/NotificationAlert.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import Loader from "@/components/Loader.vue";
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import PreviewImage from "@/components/PreviewImage.vue";
import axios from 'axios';

export default {
  name: "CreateContractView",
  components: {
    SidebarVue,
    NavbarVue,
    VueDatePicker,
    Loader,
    NotificationAlert,
    AlertConfirm,
    Spinner,
    PreviewImage,
  },
  data(){
    return {
        sidebarWidth: 0,
        contentwidth: 0,
        success: false,
        message: null,
        showNotif: false,
        showAlert: false,
        showNotifAlert: false,
        showMasbar: false,
        title: null,
        alertMessage: null,
        methods: null,
        sheaders: null,
        url: null,
        item: null,
        contract: {
            sup_kd: null,
            currency: null,
            divisi_kd: null,
            subdiv_kd: null,
            rate: null,
            top: null,
            start_date: null,
            end_date: null,
            note: null,
            items: [],
        },
        error: {
            sup_kd: null,
            currency: null,
            divisi_kd: null,
            subdiv_kd: null,
            rate: null,
            top: null,
            start_date: null,
            end_date: null,
        },
        authToken: null,
        masterbarang: null,
        suppliers: null,
        masbars: [],
        pagelength: 0,
        perpage: 15,
        total_page: [],
        selectedPage: 0,
        start: 0,
        end: 8,
        isLoading: false,
        vat: 0,      
        satuan: null,
        divisi: null,
        subdivisi: null,
        dept: null,
        kdjns: 'all',
        jenis: null,
        selectedImage: null,
        showPreview: false,
    }
  },
  mounted(){
    this.getJenis()
    this.getVat()
    this.getDivisi()
  },
  created(){
    this.authToken = this.$store.getters.GET_AUTH_TOKEN
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
    this.perm = this.$store.getters.GET_AUTH_INFO.permission;
    this.permission = this.perm.split(",");
    if (!this.permission.includes("create-contract")) window.location.href = "/";
  },
  methods: {
    async getJenis(){
      try {
        const { data } = await axios.get(`/jenismasbar/${this.authToken}`);
        this.jenis = data
      } catch(error){
        if (error.response.status == 401) {
            this.$toast.open({
              message: 'Session expired!',
              type: 'error',
            });

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
    async getDivisi(){
      try {
        const { data } = await axios.get(`/divisi/${this.authToken}`);
        this.divisi = data
      } catch(error){
        if (error.response.status == 401) {
         this.$toast.open({
              message: 'Session expired!',
              type: 'error',
          });

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
    async getSubdiv(){
      try {
        const { data } = await axios.get(`/subdivisi/${this.contract.divisi_kd}/${this.authToken}`);
        this.subdivisi = data
      } catch(error){
        if (error.response.status == 401) {
          this.$toast.open({
              message: 'Session expired!',
              type: 'error',
          });

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
    async getDept(){
      try {
        const { data } = await axios.get(`/department/${this.contract.divisi_kd}/${this.contract.subdiv_kd}/${this.authToken}`);
        this.dept = data
      } catch(error){
        if (error.response.status == 401) {
            this.$toast.open({
              message: 'Session expired!',
              type: 'error',
            });

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
    format(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    },
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    async getSatuan(){
        try {
            const { data } = await axios.get(`/satuan/${this.authToken}`)
            this.satuan = data
        } catch(error){
            if(error.response.status == 401){
                this.$toast.open({
                    message: 'Session expired!',
                    type: 'error',
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
    async getVat(){
        try {
            const { data } = await axios.get(`/tarif/${this.authToken}`)
            this.vat = data.tarif
            this.getProduct()
        } catch(error){
            if(error.response.status == 401){
                this.$toast.open({
                    message: 'Session expired!',
                    type: 'error',
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
    async getSuppliers(){
        try {
            const { data } = await axios.get(`/supplier/${this.contract.divisi_kd}/${this.contract.subdiv_kd}/${this.authToken}`)
            this.suppliers = data
        } catch(error){
            if(error.response.status == 401){
                this.$toast.open({
                    message: 'Session expired!',
                    type: 'error',
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
    async getProduct(){
        try {
            this.masterbarang = []
            const newMasbars = []
            this.masbars = []
            this.total_page = []

            this.isLoading = true;
            const url = `/holdingmasbar/${this.kdjns}/${this.authToken}`
            const { data } = await axios.get(url)

            this.masterbarang = data
            this.total_page = [];
            const groupSize = this.perpage;

            let urut = 1
            this.masterbarang.forEach((data) => {
                data.no = urut
                data.kdbar = data.kd_barang
                data.nmbar = data.nm_barang
                data.nm_stok = data.nmstn_stok                
                data.checked = false
                data.readonly = true
                data.price = null
                data.disc = null
                data.ppn = this.vat
                data.kdstn = null
                data.nmstn_beli = null
                newMasbars.push(data);
                urut++
            });
            
            this.pagelength = this.masterbarang.length;
            for (let i = 0; i < newMasbars.length; i += groupSize) {
                this.masbars.push(newMasbars.slice(i, i + groupSize));
            }

            for (let i = 0; i < this.masbars.length; i++) {
                this.total_page.push(i);
            }

            this.isLoading = false;
        } catch(error){
            if(error.response.status == 401){
                this.$toast.open({
                    message: 'Session expired!',
                    type: 'error',
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
    async selectItems(e){
        if(e.target.checked === true) {
            this.masbars.filter(data =>
                data.filter(async(obj) => {
                    if(obj.kdbar === e.target._value) {
                        obj.readonly = false
                        obj.checked = true

                        document.getElementById(`spinner${obj.kdbar}`).style.display = 'block';
                        var select = document.getElementById(`satuan${obj.kdbar}`);
                        if(select.length <= 0){
                            const { data } = await axios.get(`/satuanbeli/${obj.kdbar}/${this.authToken}`)
                            const msatuan = data
                            msatuan.forEach((data) => {    
                                var option = document.createElement("option");
                                option.text = data.nm_stn;
                                option.value = `${data.kdstn}-${data.nm_stn}`;
                                select.appendChild(option);
                            })
                        }

                        document.getElementById(`spinner${obj.kdbar}`).style.display = 'none';
                    }
                })
            )
        }

        if(e.target.checked === false) {
            this.masbars.filter(data =>
                data.filter(obj => {
                    if(obj.kdbar === e.target._value) {
                        obj.readonly = true
                        obj.price = null
                        obj.disc = null
                        obj.kdstn = null
                        obj.checked = false

                        // var select = document.getElementById(`satuan${obj.kdbar}`);
                        // var options = select.options;
                        // console.log(options)
                        // for (var i = 0; i <= select.length; i++) {
                        //     options.remove(i);
                        //     // select.removeChild(options[i]);
                        // }
                    }
                })
            )
        }
    },
    addPrice(id){
        this.masbars.filter(data =>
            data.filter(obj => {
                if(obj.kdbar === id) {
                    obj.price = parseFloat(document.getElementById(`price${id}`).value);
                    obj.disc = parseFloat(document.getElementById(`disc${id}`).value);

                    this.$toast.open({
                        message: `Price added for items ${id}`,
                        type: 'info',
                        duration: 1000,
                    });
                }
            })
        )
    },
    addDisc(id){
        this.masbars.filter(data =>
            data.filter(obj => {
                if(obj.kdbar === id) {
                    obj.price = parseFloat(document.getElementById(`price${id}`).value);
                    obj.disc = parseFloat(document.getElementById(`disc${id}`).value);

                    this.$toast.open({
                        message: `Disc added for items ${id}`,
                        type: 'info',
                        duration: 1000,
                    });
                }
            })
        )
    },
    addKdstn(id){
        this.masbars.filter(data =>
            data.filter(obj => {
                if(obj.kdbar === id) {
                    const selected = document.getElementById(`satuan${id}`).value;
                    obj.kdstn = selected.split("-")[0]
                    obj.nmstn_beli = selected.split("-")[1]
                }
            })
        )
    },
    async submitContract(){
        try {
            let errCnt = 0;
            if(!this.contract.divisi_kd) {
                this.error.divisi_kd = 'Field Divisi is required!';
                errCnt += 1
            }
            if(!this.contract.subdiv_kd) {
                this.error.subdiv_kd = 'Field Subdivisi is required!';
                errCnt += 1
            }

            if(!this.contract.sup_kd){
                this.error.sup_kd = 'Field Supplier is required!';
                errCnt += 1;
            }

            if(!this.contract.currency){
                this.error.currency = 'Field Currency is required!';
                errCnt += 1;
            }

            if(!this.contract.top){
                this.error.top = 'Terms of Payment is required!';
                errCnt += 1;
            }

            if(!this.contract.start_date){
                this.error.start_date = 'Please enter kontrak date!';
                errCnt += 1;
            }

            if(!this.contract.end_date){
                this.error.end_date = 'Please enter end kontrak date!';
                errCnt += 1;
            }

            if(errCnt > 0) return;

            this.contract.items = [];
            this.masbars.forEach(data =>
                data.forEach(obj => {
                    if(obj.price && obj.kdstn){
                        obj.vat = 0
                        this.contract.items.push(obj)
                    }        
                })
            )

            if(this.contract.items.length <= 0){
                this.$toast.open({
                    message: 'Please insert at least 1 items!',
                    type: 'error',
                    duration: 3000,
                    dismissible: true,
                });
                return;
            }
            
            this.title = 'Confirmation'
            this.alertMessage = `Are you sure want to submit Transaction ?`
            this.methods = 'post'
            this.url = `/contractsupplier/${this.authToken}`
            this.sheaders = null
            this.item = this.contract
            this.showAlert = true            
        } catch(error){
            if(error.response.status == 401){
                this.$toast.open({
                    message: 'Session expired!',
                    type: 'error',
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
    selectPages(pg){
        this.selectedPage = pg
        this.masbars[pg].forEach(async(msb) => {
            if(msb.checked){
                setTimeout(async() => {
                    const select = document.getElementById(`satuan${msb.kdbar}`);
                    const { data } = await axios.get(`/satuanbeli/${msb.kdbar}/${this.authToken}`)
                    const msatuan = data
                    msatuan.forEach((item) => {    
                        var option = document.createElement("option");
                        option.text = item.nm_stn;
                        option.value = `${item.kdstn}-${item.nmstn_beli}`;
                        select.appendChild(option);
                        if(item.kdstn === msb.kdstn){
                            option.selected = true;
                        }
                    })
                }, 1000);
            }
        })
    },
    submitted(value){
      this.showAlert = false
      this.$toast.open({
          message: value.message,
          type: 'info',
          duration: 1000,
      });

      setTimeout(() => {
        window.location.href = '/contract'
      }, 1000)
    },
    onError(value){
      this.showAlert = false
      this.message = value.message;
      this.success = false;
      this.showNotifAlert = true;
      this.alertMessage = null
    },
    onClosed(value) {
      this.showAlert = value;
    },
    onClosedNotif(value) {
      this.showNotifAlert = value;
    },
    searching(){
      this.masbars = []
      this.total_page = []
      this.start = 0
      this.end = 8
      this.perpage = 10

      const searchTerm = '*' + this.searchItem + '*';
      const wildcardRegex = new RegExp('^' + searchTerm.replace(/\*/g, '.*') + '$', 'i');
      const matchingObjects = this.masterbarang.filter(obj =>
        Object.values(obj).some(value =>
          typeof value === 'string' && wildcardRegex.test(value)
        )
      )

      let j = 1
      const newMasbars = []
      this.pagelength = matchingObjects.length;
      matchingObjects.forEach((data) => {
        data.no = j;
        newMasbars.push(data);
        j++;
      })

      for (let i = 0; i < newMasbars.length; i += parseInt(this.perpage)) {
        this.masbars.push(newMasbars.slice(i, i + parseInt(this.perpage)));
      }

      for (let a = 0; a < this.masbars.length; a++) {
        this.total_page.push(a);
      }
    },
    getFoodImage(filename) {
      if(filename === undefined){
        return `${this.base_url}/masbarimages/${this.authToken}/default.png`;
      } else {
        return `${this.base_url}/masbarimages/${this.authToken}/${filename}`;
      }
    },
    showingPreview(src){
      if(src === undefined){
        this.selectedImage = `${this.base_url}/masbarimages/${this.authToken}/default.png`;
      } else {
        this.selectedImage = `${this.base_url}/masbarimages/${this.authToken}/${src}`;
      }

      this.showPreview = true;
    },
    onClosedPreview(value){
      this.showPreview = value;
      this.selectedImage = null;
    },
  }
}
</script>

<style>
.addstn-btn{
    position: absolute;
    top: 21px;
    right: 6px;
    width: 30px;
    height: 30px;
    background: #f3f3f3;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dark);
    cursor: pointer;
}

.addstn-btn:hover{
    color: white;
    background: var(--themecolor);
}

.add-stn{
    font-size: 17pt;
}

.add-stn:hover{
    animation: hithere .7s ease;
}
</style>

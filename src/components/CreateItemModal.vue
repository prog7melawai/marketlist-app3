<template>
  <div class="modal-container">
    <div class="overlay fade-in" id="overlay" @click="closeModal"></div>
    <div
      class="modal-dialog theme-scroll fade-in-down"
      id="modal-dialog"
      style="max-height: 530px"
    >
      <div class="btn-close" @click="closeModal">
        <i class="ri-close-fill"></i>
      </div>

      <span class="modal-title">{{ tittle }}</span>

      <div class="modal-content">
        <div class="row" style="margin-top: 20px">
          <div style="width: 50%">
            <div class="image-input bg-gradient-gray" id="image-input">
              <i class="ri-image-add-fill" v-if="!selectedfile"></i>
              <div v-if="selectedfile" style="width: 100%">
                <div v-for="img in images" :key="img">
                  <img :src="img" class="preview" alt="items" />
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
                @change="onChange"/>

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
            style="width: 50%; display: flex; flex-direction: column; gap: 15px"
          >
            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': item.name }">
                Product Name
              </label>
              <input type="text" class="form-input" v-model="item.name" />
            </div>

            <select name="" id="" class="select-input" v-model="item.tipe">
              <option>Select Type</option>
              <option value="RM">Raw Material</option>
              <option value="WIP">Work In Progress</option>
            </select>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': item.stock }">
                Quantity Stock
              </label>
              <input type="number" class="form-input" v-model="item.stock" />
            </div>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': item.satuan_stock }">
                Stock Unit
              </label>
              <select name="" class="select-input" 
                v-model="item.satuan_stock">
                <option v-for="item in satuan" 
                        :key="item.kd_satuan"
                        :value="item.kd_satuan">
                    {{ item.nama_satuan }}
                </option>
              </select>
            </div>
            

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': item.satuan_beli }">
                Purchase Unit
              </label>
              <select name="" class="select-input" 
                v-model="item.satuan_beli">
                <option v-for="item in satuan" 
                        :key="item.kd_satuan"
                        :value="item.kd_satuan">
                    {{ item.nama_satuan }}
                </option>
              </select>
            </div>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': item.konversi }">
                Conversion
              </label>
              <input type="number" class="form-input" v-model="item.konversi" />
            </div>
          </div>
        </div>

        <br />
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          "
        >
          <div style="position: relative; width: 45%">
            <label
              class="input-placeholder"
              :class="{ 'color-orange': item.qtymin }"
              >Qty Minimum</label
            >
            <input
              type="number"
              class="form-input"
              placeholder="Qty Minimum"
              v-model="item.qtymin"
            />
          </div>

          <div style="position: relative; width: 50%">
            <label
              class="input-placeholder"
              :class="{ 'color-orange': item.qtyday }"
              >Qty Per Day</label
            >
            <input
              type="number"
              class="form-input"
              placeholder="Qty / Day"
              v-model="item.qtyday"
            />
          </div>
        </div>

        <button
          class="btn-block btn-primary"
          style="margin-top: 10px; 
          margin-bottom: 20px;"
          @click="submitItem">
          <spinner v-if="loading"></spinner>
          <span v-if="!loading">Save</span>
        </button>

        <input type="text" :value="jenis" hidden />
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import axios from 'axios';

export default {
  name: "CreateItemModal",
  props: ["tittle", "jenis"],
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
      satuan: [],
      receipe: [],
      loading: false,
      item: {
        name: null,
        tipe: null,
        stock: 0,
        satuan_stock: null,
        satuan_beli: null,
        konversi: null,
        qtymin: 0,
        qtyday: 0,
        image: null,
      },
    };
  },
  mounted() {
    this.getSatuan()
  },
  methods: {
    async getSatuan(){
      try {
        const { data } = await axios.get('/mastersatuan', {
          headers: {
            Authorization: 'asdasdasdasdas'
          }
        })

        this.satuan = data
      } catch(error){
        console.log(error)
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
    async submitItem(){
      try {
        this.loading = true
        let image = this.selectedfile ?? 'default.png';
        const formData = new FormData()        
        formData.append('name', this.item.name)
        formData.append('tipe', this.item.tipe)
        formData.append('satuan_stock', this.item.satuan_stock)
        formData.append('satuan_beli', this.item.satuan_beli)
        formData.append('konversi', this.item.konversi)
        formData.append('factive', true)
        formData.append('kd_jenis', this.jenis)
        formData.append('qtymin', this.item.qtymin)
        formData.append('qtyday', this.item.qtyday)
        formData.append('image', image)
        formData.append('stock', this.item.stock)
        if(this.filelist.length > 0) formData.append('file', this.filelist[0])

        const { data } = await axios.post('/master-barang', formData, {
            headers: { Authorization: 'asdasdasdasdasda' }
        })

        this.$emit('onResolve', data)
        this.loading = false
      } catch(error){
        console.log(error)
      }
    }
  },
};
</script>
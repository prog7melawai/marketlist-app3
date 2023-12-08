<template>
  <div class="modal-container">
    <div class="overlay fade-in" id="overlay-edit" @click="closeModal"></div>
    <div
      class="modal-dialog theme-scroll fade-in-down"
      id="modal-edit"
      style="max-height: 530px"
    >
      <div class="btn-close" @click="closeModal">
        <i class="ri-close-fill"></i>
      </div>

      <span class="modal-title">{{ tittle }}</span>

      <div class="modal-content">
        <div class="row" style="margin-top: 20px">
          <div style="width: 50%">
            <div class="image-input bg-gradient-gray" id="image-edit">
              <i
                class="ri-image-add-fill"
                v-if="!selectedfile && !food.image"
              ></i>
              <div v-if="selectedfile" style="width: 100%">
                <div v-for="img in images" :key="img">
                  <img :src="img" class="preview" alt="item" />
                </div>
              </div>

              <div v-if="!selectedfile && food.image">
                <img :src="getImage(food.image)" class="preview" alt="item" />
              </div>

              <span
                class="image-select-title"
                v-if="!selectedfile && !food.image"
              >
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
            style="width: 50%; display: flex; flex-direction: column; gap: 15px"
          >
            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': food.name }"
                >Product Name</label
              >
              <input
                type="text"
                class="form-input"
                placeholder="Product Name"
                id="food-name"
                :value="food.name"
              />
            </div>
            <select id="food-tipe" class="select-input" :value="food.tipe">
              <option>Select Type</option>
              <option value="RM">Raw Material</option>
              <option value="WIP">Work In Progress</option>
            </select>
            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': food.stock }"
                >Quantity Stock</label
              >
              <input
                type="number"
                class="form-input"
                placeholder="Quantity Stock"
                id="food-stock"
                :value="food.stock"
              />
            </div>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': food.satuan_stock }"
                >Stock Unit</label
              >
              <input
                type="text"
                class="form-input"
                placeholder="Stock Unit"
                id="stock-unit"
                :value="food.satuan_stock"
              />
            </div>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': food.satuan_beli }"
                >Purchase Unit</label
              >
              <input
                type="text"
                class="form-input"
                placeholder="Purchase Unit"
                id="purchase-unit"
                :value="food.satuan_beli"
              />
            </div>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': food.konversi }"
                >Conversion</label
              >
              <input
                type="number"
                class="form-input"
                placeholder="Conversion"
                id="conversion"
                :value="food.konversi"
              />
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
              :class="{ 'color-orange': food.qtymin }"
              >Qty Minimum</label
            >
            <input
              type="number"
              class="form-input"
              placeholder="Qty Minimum"
              id="qty-min"
              :value="food.qtymin"
            />
          </div>

          <div style="position: relative; width: 50%">
            <label
              class="input-placeholder"
              :class="{ 'color-orange': food.qtymin }">
              Qty Per Day
            </label>
            <input
              type="number"
              class="form-input"
              placeholder="Qty / Day"
              id="qty-day"
              :value="food.qtyday"/>
          </div>
        </div>

        <button
          class="btn-block btn-primary"
          style="margin-top: 10px;margin-bottom: 20px"
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
import axios from 'axios'

export default {
  name: "EditItemModal",
  props: ["tittle", "jenis", "food"],
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
      product: [],
      receipe: [],
      loading: false,
    };
  },
  mounted() {
    this.product = [...this.$store.state.products];
  },
  methods: {
    closeModal() {
      document.getElementById("modal-edit").classList.remove("fade-in-down");
      document.getElementById("modal-edit").classList.add("fade-out-down");
      document.getElementById("overlay-edit").classList.remove("fade-in");
      document.getElementById("overlay-edit").classList.add("fade-out");
      setTimeout(() => {
        this.$emit("closed", false);
        document.getElementById("modal-edit").classList.remove("fade-out-down");
        document.getElementById("overlay-edit").classList.remove("fade-out");
        document.getElementById("modal-edit").classList.add("fade-in-down");
        document.getElementById("overlay-edit").classList.add("fade-in");
      }, 500);
    },
    dragover() {
      if (
        !document.getElementById("image-edit").classList.contains("bg-orange")
      ) {
        document
          .getElementById("image-edit")
          .classList.remove("bg-gradient-gray");
        document.getElementById("image-edit").classList.add("bg-orange");
      }
    },
    dragleave() {
      document.getElementById("image-edit").classList.add("bg-gradient-gray");
      document.getElementById("image-edit").classList.remove("bg-orange");
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
    getImage(filename) {
      return "https://reservasi.tamani-pos.online/files/images/" + filename;
    },
    async submitItem(){
      try {
        this.loading = true
        let image = this.selectedfile ?? this.food.image;
        const formData = new FormData()
        formData.append('kd_barang', this.food.kd_barang);
        formData.append('name', document.getElementById('food-name').value);
        formData.append('tipe', document.getElementById('food-tipe').value);
        formData.append('satuan_stock', document.getElementById('stock-unit').value);
        formData.append('satuan_beli', document.getElementById('purchase-unit').value);
        formData.append('konversi', parseInt(document.getElementById('conversion').value));
        formData.append('factive', true)
        formData.append('kd_jenis', this.food.kd_jenis);
        formData.append('qtymin', parseInt(document.getElementById('qty-min').value))
        formData.append('qtyday', parseInt(document.getElementById('qty-day').value))
        formData.append('image', image)
        formData.append('stock', parseInt(document.getElementById('food-stock').value))
        if(this.filelist.length > 0) formData.append('file', this.filelist[0])

        const { data } = await axios.put('/masterbarang', formData, {
            headers: {
              Authorization: 'asdasdasdasdasda'
            }
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

<style>
.input-placeholder {
  position: absolute;
  bottom: 3px;
  right: 15px;
  font-size: 8pt;
}
</style>

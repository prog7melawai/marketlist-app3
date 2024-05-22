<template>
  <div class="modal-container">
    <div class="overlay fade-in" id="overlay-edit" @click="closeModal"></div>
    <div
      class="modal-dialog theme-scroll fade-in-down"
      id="modal-edit"
      style="max-height: 500px;
      overflow: hidden;"
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
                <div style="position: absolute;
                  top: 40%;
                  left: 50%;
                  -webkit-transform: translateX(-50%);
                  transform: translateX(-50%);
                  font-size: 50pt;
                  color: var(--red);">
                  <i class="ri-restart-line"></i>
                </div>
                
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
                :class="{ 'color-orange': food.kd_barang }"
                >Product ID</label
              >
              <input
                type="text"
                class="form-input"
                placeholder="Product Name"
                id="food-name"
                :value="food.kd_barang"
                readonly
              />
            </div>
            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': food.nm_barang }"
                >Product Name</label
              >
              <input
                type="text"
                class="form-input"
                placeholder="Product Name"
                id="food-name"
                :value="food.nm_barang"
                readonly
              />
            </div>
            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': food.nm_jenis }"
                >Product Types</label
              >
              <input
                type="text"
                class="form-input"
                placeholder="Quantity Stock"
                id="food-stock"
                :value="food.nm_jenis"
                readonly
              />
            </div>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': food.nmstn_stok }"
                >Stock Unit</label
              >
              <input
                type="text"
                class="form-input"
                placeholder="Stock Unit"
                id="stock-unit"
                :value="food.nmstn_stok"
                readonly
              />
            </div>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': food.f_prod }"
                >Finnish Good</label
              >
              <input
                type="text"
                class="form-input"
                placeholder="Purchase Unit"
                id="purchase-unit"
                :value="food.f_prod"
                readonly
              />
            </div>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': food.lok_kd }"
                >Conversion</label
              >
              <input
                type="number"
                class="form-input"
                placeholder="Conversion"
                id="conversion"
                :value="food.lok_kd"
                readonly
              />
            </div>
          </div>
        </div>

        <br />

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
      authToken: null,
    };
  },
  mounted() {
    this.authToken = this.$store.getters.GET_AUTH_TOKEN;
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
        document.getElementById("image-edit").classList.add("bg-gradient-gray");
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

      document.getElementById("image-edit").classList.add("bg-orange");
      let files = Array.prototype.slice.call(e.target.files);
      files.forEach((f) => {
        if (!f.type.match("image.*")) {
          document.getElementById("image-edit").classList.add("bg-gradient-gray");
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
      document.getElementById("image-edit").classList.remove("bg-orange");
      document.getElementById("image-edit").classList.add("bg-gradient-gray");
    },
    getImage(filename) {
      return `https://procurement-api.saritirta-group.com/procurement/web/masbarimages/${this.authToken}/${filename}`;
    },
    async submitItem(){
      try {
        this.loading = true

        const file = this.filelist[0];
        const myblob = new Blob([file], { type: file.type });
        const myFile = new File([myblob], file.name, { type: file.type });

        const filename = file.name;
        const lastDot = filename.lastIndexOf('.');
        const ext = filename.substring(lastDot + 1);
        const formData = new FormData();
        formData.append('filename', myFile, `${this.food.kd_barang}.${ext}`);

        const {data} = await axios.post(`/postimage/${this.food.div_kd}/${this.food.subdiv_kd}/${this.food.dept_kd}/${this.authToken}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        this.$emit('onResolve', data)
        this.loading = false
      } catch(error){
        this.loading = false
        if (error.response.status == 401) {
            this.$toast.open({
              message: 'Session expired!',
              type: 'error',
            });

          this.$store
            .dispatch("LOGOUT")
            .then(() => {
              this.$router.push({ name : 'login' });
            })
            .catch(() => {
              this.$router.push({ name : 'login' });
            });
        }
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

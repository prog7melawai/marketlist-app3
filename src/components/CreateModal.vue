<template>
  <div class="modal-container">
    <div class="overlay fade-in" id="overlay" @click="closeModal"></div>
    <div class="modal-dialog theme-scroll fade-in-down" id="modal-dialog">
      <div class="btn-close" @click="closeModal">
        <i class="ri-close-fill"></i>
      </div>

      <span class="modal-title">Create New Food</span>

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
            style="width: 50%; display: flex; flex-direction: column; gap: 15px"
          >
            <input 
              type="text" 
              class="form-input" 
              placeholder="Food Name" 
              v-model="food.foodname"
            />

            <select name="" id="" class="select-input" v-model="food.category">
              <option>Select Category</option>
              <option value="Western">Western</option>
              <option value="Asia">Asia</option>
              <option value="Soup & Salad">Soup & Salad</option>
            </select>

            <input
              type="number"
              class="form-input"
              placeholder="Quantity Stock"
              v-model="food.foodstock"
            />

            <input 
              type="number" 
              class="form-input" 
              placeholder="Food Price"
              v-model="food.price"
            />

            <input
              type="number"
              class="form-input"
              placeholder="Discount Price"
              v-model="food.ndisc"
            />

            <input
              type="number"
              class="form-input"
              placeholder="Service Charge"
              v-model="food.scharge"
            />

          </div>
        </div>

        <br />
        <label 
          for="description" 
          style="margin-top: 10px;
          font-size: 11pt">
          Description :
        </label>

        <textarea
          name="description"
          id=""
          class="text-input"
          style="margin-top: 5px"
          v-model="food.fooddesc"
        ></textarea>

        <br /><br />
        <span style="margin-top: 10px; font-size: 11pt">
          Select food items for receipe :
        </span>
        <div
          class="items-box theme-scroll"
          style="
            height: 180px;
            overflow-y: scroll;
            border: 1px solid var(--light);
            border-radius: 5px;
          "
        >
          <table class="table-items" aria-describedby="Master items data">
            <thead>
              <tr>
                <th>No</th>
                <th>Food ID</th>
                <th>Food Name</th>
                <th>Type</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody style="text-align: center">
              <tr v-for="(items, idx) in product" :key="items.kd_barang">
                <td>{{ idx + 1 }}</td>
                <td>{{ items.kd_barang }}</td>
                <td>{{ items.name }}</td>
                <td>{{ items.tipe }}</td>
                <td>
                  <input
                    type="checkbox"
                    class="select-box"
                    :checked="false"
                    :value="items.kd_barang"
                    @change="addToCart"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="receipe-box">
          <table
            class="table-responsive"
            aria-describedby="Selected items data"
          >
            <thead class="bg-theme">
              <tr>
                <th style="width: 5%">No</th>
                <th style="width: 45%">Food Name</th>
                <th style="width: 15%">Type</th>
                <th style="width: 15%">Qty</th>
                <th style="width: 20%">Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(items, idx) in receipe" :key="items.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ items.name }}</td>
                <td>{{ items.tipe }}</td>
                <td>
                  <input 
                    type="number"
                    class="form-input"
                    :id="'qty-' + items.kd_barang"
                  />
                </td>
                <td>
                  <select 
                    style="width: 60%;height: 40px;border-radius: 5px;"
                    :id="`satuan-${items.kd_barang}`"
                    >
                    <option 
                      :value="st.kd_satuan" 
                      v-for="st in satuan" 
                      :key="st.kd_satuan">
                      {{ st.kd_satuan }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          class="btn-block btn-primary"
          style="margin-top: 10px"
          @click="submitFood">
          <span>Save</span>
        </button>

        <div style="width:100%;
        height: 30px;">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "CreateModalVue",
  data() {
    return {
      selectedfile: null,
      filelist: [],
      headers: [],
      content: [],
      images: [],
      product: [],
      receipe: [],
      satuan: [],
      food: {
        category: null,
        foodname: null,
        foodimage: null,
        imagefile: null,
        foodstock: 0,
        fooddesc: null,
        userid: null,
        price: null,
        ndisc: null,
        scharge: null,
        ntax: null,
      }
    };
  },
  mounted() {
    this.getSatuan()
    this.getFood()
  },
  methods: {
    async getSatuan(){
      try {
        const { data } = await axios.get('/mastersatuan', {
          headers: { Authorization: 'asdasdasdasdas' }
        })

        this.satuan = data
      } catch(error){
        console.log(error)
      }
    },
    async getFood() {
      const { data } = await axios.get('/masterbarang', {
          headers: {
            Filter: 'all',
            Authorization: 'asdasdasdasdasda'
          }
      })

      this.product = data
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
        const find = this.product.filter((obj) => {
          return obj.kd_barang === id;
        });

        if (find) {
          this.receipe.push(find[0]);
        }
      } else if (!e.srcElement.checked) {
        const find = this.product.filter((obj) => {
          return obj.kd_barang === id;
        });

        this.receipe.splice(this.receipe.indexOf(find[0]), 1);
      }
    },
    async submitFood(){
      try {
        const item = {
          itemid: '',
          itemqty: '',
          itemunit: ''
        }

        const items = []
        this.receipe.forEach((data) => {
          item.itemid = data.kd_barang
          item.itemqty = document.getElementById(`qty-${data.kd_barang}`).value
          item.itemunit = document.getElementById(`satuan-${data.kd_barang}`).value
          items.push(item)
        })

        const formData = new FormData()
        formData.append('category', this.food.category)
        formData.append('foodname', this.food.foodname)
        formData.append('foodimage', this.selectedfile)
        formData.append('imagefile', this.filelist)
        formData.append('fooddesc', this.food.fooddesc)
        formData.append('userid', 'admin')
        formData.append('price', this.food.price)
        formData.append('ndisc', this.food.ndisc)
        formData.append('scharge', this.food.scharge)
        formData.append('ntax', this.food.ntax)
        for (var i = 0; i < items.length; i++) {
          formData.append('items[]', items[i]);
        }

        // for (var pair of formData.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]); 
        // }

        const { data } = await axios.post('/mastermenu', formData, {
          headers: { Authorization: 'asdasdasdasd' }
        })

        console.log(data)
      } catch(error){
        console.log(error)
      }
    }
  },
};
</script>

<style>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-dialog {
  position: relative;
  width: 90%;
  max-width: 800px;
  height: 90%;
  max-height: 850px;
  background: var(--white);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  overflow-x: hidden;
  overflow-y: scroll;
}

.theme-scroll {
  --sb-track-color: #e5e5e5;
  --sb-thumb-color: #0da487;
  --sb-size: 9px;
  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
}

.theme-scroll::-webkit-scrollbar {
  width: var(--sb-size);
}

.theme-scroll::-webkit-scrollbar-track {
  background: var(--sb-track-color);
  border-radius: 10px;
}

.theme-scroll::-webkit-scrollbar-thumb {
  background: var(--sb-thumb-color);
  border-radius: 10px;
}

.modal-title {
  font-size: 20pt;
  margin-top: 20px;
  font-weight: bold;
  color: var(--dark);
}

.modal-content {
  width: 90%;
}

.form-input {
  width: 90%;
  height: 40px;
  border-radius: 5px;
  border: 1.5px solid var(--canvas);
  background: #f9f9f6;
  padding: 0 10px;
}

.text-input {
  width: 96%;
  height: 10%;
  border-radius: 5px;
  border: none;
  border: 1.5px solid var(--canvas);
  background: #f9f9f6;
  padding: 10px 2%;
}

.select-input {
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid var(--canvas);
  border: none;
  padding: 0 5%;
}

.image-input {
  position: relative;
  width: 90%;
  height: 320px;
  border-radius: 5px;
  color: var(--light);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 80pt;
}

.image-input .image-add {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.image-input .image-select-title {
  font-size: 18pt;
  font-family: "Costpretty", sans-serif;
  font-weight: bold;
}

.image-input .image-name {
  position: absolute;
  bottom: 20px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  width: 90%;
  text-align: center;
  font-size: 10pt;
  margin-top: 100px;
}

.image-input .preview {
  width: 100%;
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.btn-remove {
  position: absolute;
  bottom: 40px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: 1001;
}

.receipe-box {
  width: 100%;
  max-height: 300px;
  margin-top: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.btn-close {
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 26pt;
  cursor: pointer;
  transition: all 0.5s ease;
}

.btn-close:hover {
  font-size: 29pt;
}
</style>

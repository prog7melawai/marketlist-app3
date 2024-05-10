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

        const filename = String(this.food.foodname).replace(" ", "_") + '.' + String(this.selectedfile).split('.').pop();
        const formData = new FormData()
        formData.append('category', this.food.category)
        formData.append('foodname', this.food.foodname)
        formData.append('foodimage', filename)
        formData.append('imagefile', this.filelist, filename)
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

</style>

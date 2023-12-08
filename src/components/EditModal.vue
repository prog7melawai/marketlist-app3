<template>
  <div class="modal-container">
    <div class="overlay fade-in" id="overlay-edit" @click="closeModal"></div>
    <div class="modal-dialog theme-scroll fade-in-down" id="modal-edit">
      <div class="btn-close" @click="closeModal">
        <i class="ri-close-fill"></i>
      </div>

      <span class="modal-title">Update Food</span>
      <div class="modal-content">
        <div class="row" style="margin-top: 20px">
          <div style="width: 50%">
            <div class="image-input bg-gradient-gray" id="image-edit">
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
              :value="food.name"
            />
            <select name="" id="" class="select-input" :value="food.category">
              <option>Select Category</option>
              <option value="Western">Western</option>
              <option value="Asia">Asia</option>
              <option value="Soup & Salad"></option>
            </select>
            <input
              type="number"
              class="form-input"
              placeholder="Quantity Stock"
              :value="food.stock"
            />
            <input
              type="number"
              class="form-input"
              placeholder="Food Price"
              :value="food.price"
            />
            <input
              type="number"
              class="form-input"
              placeholder="Discount Price"
            />
            <input
              type="number"
              class="form-input"
              placeholder="Service Charge"
            />
          </div>
        </div>

        <br />
        <label for="description" style="margin-top: 10px; font-size: 11pt">
          Description :
        </label>
        <textarea
          name="description"
          id=""
          class="text-input"
          style="margin-top: 5px"
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
              <tr v-for="items in product" :key="items.id">
                <td>{{ items.id }}</td>
                <td>{{ items.kdbrg }}</td>
                <td>{{ items.name }}</td>
                <td>{{ items.tipe }}</td>
                <td>
                  <input
                    type="checkbox"
                    class="select-box"
                    :value="items.id"
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
                <th style="width: 10%">No</th>
                <th style="width: 45%">Food Name</th>
                <th style="width: 15%">Type</th>
                <th style="width: 20%">Quantity</th>
                <th style="width: 20%">Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="items in receipe" :key="items.id">
                <td>{{ items.no }}</td>
                <td>{{ items.name }}</td>
                <td>{{ items.tipe }}</td>
                <td>
                  <input type="number" class="form-input" />
                </td>
                <td>
                  {{ items.satuan }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          class="btn-block btn-primary"
          style="margin-top: 10px; margin-bottom: 20px"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditModalVue",
  props: ["food"],
  data() {
    return {
      selectedfile: null,
      filelist: [],
      headers: [],
      content: [],
      images: [],
      product: [],
      receipe: [],
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
    addToCart(e) {
      const id = e.srcElement._value;
      if (e.srcElement.checked) {
        const find = this.product.filter((obj) => {
          return obj.id === id;
        });

        if (find) {
          this.receipe.push(find[0]);
        }

        let j = 1;
        this.receipe.forEach((data) => {
          data.no = j;
          j++;
        });
      } else if (!e.srcElement.checked) {
        const find = this.product.filter((obj) => {
          return obj.id === id;
        });

        this.cart.splice(this.cart.indexOf(find[0]), 1);

        let j = 1;
        this.receipe.forEach((data) => {
          data.no = j;
          j++;
        });
      }
    },
  },
};
</script>

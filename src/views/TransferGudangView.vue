<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Transfer Items</h2>
          </div>

          <div class="items-box">
            <div
              style="
                width: 40%;
                margin-top: 20px;
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: start;
                gap: 20px;
              "
            >
              <select name="" id="" class="warehouse-input">
                <option value="">From Warehouse</option>
              </select>

              <select name="" id="" class="warehouse-input">
                <option value="">To Warehouse</option>
              </select>

              <div
                style="
                  width: 90%;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                "
              >
                <button class="btn-primary" style="width: 40%">Submit</button>

                <button class="btn-theme" style="width: 40%">Reset</button>
              </div>
            </div>
            <div class="items-box-right">
              <table class="table-items" aria-describedby="All items data">
                <thead>
                  <tr>
                    <th class="text-center" scope="col">No</th>
                    <th class="text-left" scope="col">Kode Barang</th>
                    <th class="text-left" scope="col">Nama Barang</th>
                    <th class="text-left" scope="col">Type</th>
                    <th class="text-left" scope="col">Satuan</th>
                    <th class="text-center" scope="col">Stock</th>
                    <th class="text-center" scope="col">Jenis Barang</th>
                    <th class="text-center">
                      All
                      <input
                        type="checkbox"
                        v-model="allselected"
                        @click="selectAll"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="items in product" :key="items.id">
                    <td class="text-center">{{ items.id }}</td>
                    <td class="text-left">{{ items.kdbrg }}</td>
                    <td class="text-left">{{ items.name }}</td>
                    <td class="text-left">{{ items.tipe }}</td>
                    <td class="text-left">{{ items.satuan }}</td>
                    <td class="text-center">{{ items.stock }}</td>
                    <td class="text-center">{{ items.kdjenis }}</td>
                    <td class="table-action">
                      <input
                        type="checkbox"
                        :id="'check' + String(items.id)"
                        style="margin-top: 5px"
                        :value="items.id"
                        @change="addToCart"
                        class="select-box"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="content">
            <span>Selected Items</span>
            <div style="width: 100%; margin-top: 20px">
              <table
                class="table-responsive"
                aria-describedby="Seelcted items data"
              >
                <thead class="bg-theme">
                  <tr>
                    <th style="width: 5%; border-top-left-radius: 10px">No</th>
                    <th style="width: 20%">Kode Barang</th>
                    <th style="width: 30%">Nama Barang</th>
                    <th style="width: 5%">Type</th>
                    <th style="width: 10%">Satuan Stock</th>
                    <th style="width: 5%">Stock</th>
                    <th style="width: 15%; border-top-right-radius: 10px">
                      Quantity Out
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="crt in carts[selectedPage]"
                    :key="crt.id"
                    :class="{ 'bg-canvas': crt.no % 2 == 0 }"
                  >
                    <td style="color: black">{{ crt.no }}</td>
                    <td>{{ crt.kdbrg }}</td>
                    <td>{{ crt.name }}</td>
                    <td>{{ crt.tipe }}</td>
                    <td>{{ crt.satuan }}</td>
                    <td>{{ crt.stock }}</td>
                    <td>
                      <input type="number" class="stock-out" />
                      <button class="btn-primary">Save</button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="page-wrapper" v-if="total_page.length > 0">
                <div style="width: 50%">
                  <span style="font-size: 10pt">
                    Showing {{ carts[selectedPage][0].no }} to
                    {{
                      carts[selectedPage][carts[selectedPage].length - 1].no
                    }}
                    of {{ cart.length }} entries.
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
                  <div class="page-prev">Previous</div>
                  <div
                    class="page"
                    v-for="pg in total_page"
                    :key="pg"
                    :class="{
                      'page-active': selectedPage === pg,
                      'page-unactive': selectedPage !== pg,
                    }"
                    @click="selectedPage = pg"
                  >
                    {{ pg + 1 }}
                  </div>
                  <div class="page-next">Next</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";

export default {
  name: "TransferView",
  components: {
    SidebarVue,
    NavbarVue,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      allselected: false,
      product: [],
      cart: [],
      carts: [],
      total_page: [],
      selectedPage: 0,
    };
  },
  mounted() {
    this.product = [...this.$store.state.products];
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    addToCart(e) {
      this.allselected = false;
      this.carts = [];
      this.total_page = [];
      const id = e.srcElement._value;
      if (e.srcElement.checked == true) {
        const find = this.product.filter((obj) => {
          return obj.id === id;
        });

        if (find) {
          this.cart.push(find[0]);
        }

        let j = 1;
        const groupSize = 10;
        const newCart = [];
        this.cart.forEach((data) => {
          data.no = j;
          newCart.push(data);
          j++;
        });

        for (let i = 0; i < newCart.length; i += groupSize) {
          this.carts.push(newCart.slice(i, i + groupSize));
        }

        for (let i = 0; i < this.carts.length; i++) {
          this.total_page.push(i);
        }
      } else if (e.srcElement.checked == false) {
        const find = this.product.filter((obj) => {
          return obj.id === id;
        });

        this.cart.splice(this.cart.indexOf(find[0]), 1);

        let j = 1;
        const groupSize = 10;
        const newCart = [];
        this.cart.forEach((data) => {
          data.no = j;
          newCart.push(data);
          j++;
        });

        for (let i = 0; i < newCart.length; i += groupSize) {
          this.carts.push(newCart.slice(i, i + groupSize));
        }

        for (let i = 0; i < this.carts.length; i++) {
          this.total_page.push(i);
        }
      }
    },
    selectAll() {
      this.cart = [];
      this.carts = [];
      this.total_page = [];
      if (!this.allselected) {
        this.allselected = true;
        this.product.forEach((data) => {
          document.getElementById("check" + String(data.id)).checked = true;
          this.cart.push(data);
        });

        let j = 1;
        const groupSize = 10;
        const newCart = [];
        this.cart.forEach((data) => {
          data.no = j;
          newCart.push(data);
          j++;
        });

        for (let i = 0; i < newCart.length; i += groupSize) {
          this.carts.push(newCart.slice(i, i + groupSize));
        }

        for (let i = 0; i < this.carts.length; i++) {
          this.total_page.push(i);
        }
      } else {
        this.allselected = false;
        this.product.forEach((data) => {
          document.getElementById("check" + String(data.id)).checked = false;
        });
      }
    },
  },
};
</script>

<style>
.items-box {
  position: relative;
  width: 97%;
  margin: 0 auto;
  height: 185px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0;
}

.items-box-right {
  position: relative;
  width: 60%;
  margin-top: 20px;
  overflow-y: scroll;
  border: 1px solid var(--light);
  border-radius: 5px;
  --sb-track-color: #c3c3c3;
  --sb-thumb-color: #0da487;
  --sb-size: 9px;
  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
}

.items-box-right::-webkit-scrollbar {
  width: var(--sb-size);
}

.items-box-right::-webkit-scrollbar-track {
  background: var(--sb-track-color);
  border-radius: 10px;
}

.items-box-right::-webkit-scrollbar-thumb {
  background: var(--sb-thumb-color);
  border-radius: 10px;
}

.table-items {
  position: relative;
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  font-size: 10pt;
}

.table-items thead {
  background: transparent;
  border-bottom: 1px solid var(--light);
  height: 30px;
}

.table-items tbody tr {
  background: transparent;
  border-bottom: 1px solid var(--light);
  height: 25px;
}

.table-responsive {
  width: 100%;
  border-collapse: collapse;
}

.table-responsive thead {
  height: 45px;
  text-align: center;
}

.table-responsive thead,
.table-responsive tr,
.table-responsive th {
  border: none;
  color: var(--white);
}

.table-responsive tbody,
.table-responsive tbody tr,
.table-responsive tbody td {
  /* border: 1px solid var(--light); */
  padding: 5px 0;
  text-align: center;
  font-size: 10pt;
  color: var(--dark);
}

.table-action {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.stock-out {
  width: 70px;
  height: 35px;
  border-radius: 5px;
  border: 1px solid #d1d1d1;
  background: var(--canvas);
}

.warehouse-input {
  width: 90%;
  height: 40px;
  border-radius: 5px;
}

.page-wrapper {
  position: relative;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.page-wrapper .page {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10pt;
  cursor: pointer;
  color: var(--dark);
  border: 1px solid #cacaca;
}

.page-wrapper .page:hover {
  background: var(--themecolor);
}

.page-unactive {
  background: -moz-linear-gradient(#ffffff, #e3e3e3);
  background: -webkit-linear-gradient(#ffffff, #e3e3e3);
  background: -o-linear-gradient(#ffffff, #e3e3e3);
  background: linear-gradient(#ffffff, #e3e3e3);
}

.page-active {
  background: #02aab0;
  background: -webkit-linear-gradient(to bottom, #00cdac, #02aab0);
  background: linear-gradient(to bottom, #00cdac, #02aab0);
  border: 1px solid #cacaca;
}

.page-prev {
  width: 80px;
  height: 31px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  color: #dedede;
  font-weight: bold;
  text-shadow: 1px 1px 0 #ffffff, -1px -1px 0 #a1a1a1;
  border: 1px solid #cacaca;
  background: -moz-linear-gradient(#ffffff, #e3e3e3);
  background: -webkit-linear-gradient(#ffffff, #e3e3e3);
  background: -o-linear-gradient(#ffffff, #e3e3e3);
  background: linear-gradient(#ffffff, #e3e3e3);
  font-size: 10pt;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.page-next {
  width: 80px;
  height: 31px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  color: #dedede;
  font-weight: bold;
  text-shadow: 1px 1px 0 #ffffff, -1px -1px 0 #a1a1a1;
  border: 1px solid #cacaca;
  background: -moz-linear-gradient(#ffffff, #e3e3e3);
  background: -webkit-linear-gradient(#ffffff, #e3e3e3);
  background: -o-linear-gradient(#ffffff, #e3e3e3);
  background: linear-gradient(#ffffff, #e3e3e3);
  font-size: 10pt;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.select-box {
  width: 15px;
  height: 15px;
}
</style>

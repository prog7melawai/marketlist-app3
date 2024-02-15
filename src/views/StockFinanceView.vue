<template>
  <div>
    <navbar-vue 
        :swidth="sidebarWidth" 
        :cwidth="contentWidth">
    </navbar-vue>

    <sidebar-vue 
        @swidth="setWidth">
    </sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Stock Finance</h2>
          </div>

          <button
            class="btn-theme"
            style="position: absolute; top: 20px; right: 20px"
            @click="showCreate = true">
            Add New Item
          </button>

          <div class="content">
            <div style="width: 100%; margin-top: 20px">
              <div class="table-navigation">
                <select
                  class="warehouse-input"
                  style="width: 80px"
                  v-model="perpage"
                  @change="getFood"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                <div class="export-wrapper">
                  <button
                    class="export-btn"
                    style="
                      border-bottom-left-radius: 5px;
                      border-top-left-radius: 5px;
                    "
                  >
                    CSV
                  </button>
                  <button class="export-btn">XLSX</button>
                  <button
                    class="export-btn"
                    style="
                      border-bottom-right-radius: 5px;
                      border-top-right-radius: 5px;
                    "
                  >
                    PDF
                  </button>
                </div>

                <div class="search-container">
                      <input 
                          type="text" 
                          class="form-input"
                          style="width: 100%"
                          placeholder="Search stock item..."
                          v-model="searchItem"
                          @keyup.enter="searching">
                </div>
              </div>

              <table
                class="table-responsive"
                aria-describedby="Stock Finance Items"
              >
                <thead class="bg-theme">
                  <tr>
                    <th style="width: 5%; 
                    border-top-left-radius: 5px">No</th>
                    <th style="width: 10%">Image</th>
                    <th style="width: 20%">Product Name</th>
                    <th style="width: 5%">Type</th>
                    <th style="width: 5%">Stock</th>
                    <th style="width: 10%">Unit</th>
                    <th style="width: 5%">Qty Min</th>
                    <th style="width: 5">Qty/Day</th>
                    <th style="width: 10">Status</th>
                    <th style="width: 15%; 
                    border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(items, idx) in foods[selectedPage]"
                    :key="items.kd_barang"
                    :class="{ 'bg-canvas': items.no % 2 == 0 }">
                    <td>{{ idx + 1 }}</td>
                    <td>
                      <img
                        :src="getFooImage(items.image)"
                        :alt="items.iamge"
                        style="width: 80px"/>
                    </td>
                    <td>{{ items.name }}</td>
                    <td>{{ items.tipe }}</td>
                    <td>{{ items.stock }}</td>
                    <td>{{ items.satuan_stock }}</td>
                    <td>{{ items.qtymin }}</td>
                    <td>{{ items.qtyday }}</td>
                    <td>
                      <span
                        :class="{
                          'capsule-theme': items.stock >= items.qtymin,
                          'capsule-danger': items.stock < items.qtymin,
                        }"
                      >
                        {{ setStatus(items.stock, items.qtymin) }}
                      </span>
                    </td>
                    <td>
                      <button class="btn-primary" @click="editModal(items)">
                        Edit
                      </button>

                      <button class="btn-danger"
                      style="margin-left: 10px"
                      @click="showingAlert(items)">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="page-wrapper" v-if="total_page.length > 0">
                <div style="width: 50%">
                  <span style="font-size: 10pt">
                    Showing {{ foods[selectedPage][0].no }} to
                    {{
                      foods[selectedPage][foods[selectedPage].length - 1].no
                    }}
                    of {{ pagelength }} entries.
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
                  <button class="page-prev" @click="prevPagination"
                    :class="{'paginate-active': start >= 5}">
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
                    @click="selectedPage = pg"
                  >
                    {{ pg + 1 }}
                  </div>
                  <button :class="{'paginate-active': total_page.length > end}"
                  class="page-next" @click="nextPagination">
                  Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <create-modal
    v-show="showCreate"
    tittle="Create New Item"
    jenis="K002"
    @closed="onClosedModal"
    @onResolve="resolveResponse">
  </create-modal>

  <edit-modal
    v-show="showEdit"
    :food="selectedFood"
    tittle="Update Stock Item"
    jenis="K002"
    @closed="onClosedModal"
    @onResolve="resolveResponse">
  </edit-modal>

  <notification 
      v-if="showNotification"
      :message="message"
      :success="succes">
  </notification>

  <alert-confirm 
      v-if="showAlert"
      :title="title" 
      :message="deleteMessage" 
      :methods="methods" 
      :url="url" 
      :header="sheaders"
      :data="item"
      @onClosed="onClose"
      @onResolve="deleteItem">
  </alert-confirm>
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import EditModal from "@/components/EditItemModal.vue";
import CreateModal from "@/components/CreateItemModal.vue";
import AlertConfirm from "@/components/AlertConfirm.vue";
import Notification from '@/components/Notification.vue'
import axios from 'axios';

export default {
  name: "StockFinanceView",
  components: {
    SidebarVue,
    NavbarVue,
    CreateModal,
    EditModal,
    AlertConfirm,
    Notification,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      allselected: false,
      showCreate: false,
      showEdit: false,
      food: [],
      foods: [],
      newFood: [],
      total_page: [],
      selectedPage: 0,
      selectedFood: {},
      perpage: 10,
      start: 0,
      end: 8,
      searchItem: null,
      pagelength: 0,
      showNotification: false,
      showAlert: false,
      title: null,
      deleteMessage: null,
      message: null,
      succes: false,
      url: null,
      redirect: null,
      methods: null,
      selectedID: null,
      item: {},
      sheaders: {},
    };
  },
  mounted() {
    this.getFood();
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    onClose(value){
      this.showAlert = value
      this.deleteMessage = null
      this.title = false
      this.url = null
      this.methods = null
    },
    showingAlert(data){
      this.selectedID = data.kd_barang
      this.title = 'Confirmation'
      this.deleteMessage = `Are you sure want to delete ${data.name} ?`
      this.methods = 'delete'
      this.url = '/masterbarang'
      this.sheaders = {
        Kode: data.kd_barang,
        Authorization: 'asdasdasdasd'
      }
      this.item = { image: data.image }
      this.showAlert = true
    },
    deleteItem(data){
      this.showAlert = false      
      this.message = data.message;
      this.succes = true;
      this.showNotification = true;

      setTimeout(() => {
        this.message = null;
        this.succes = false;
        this.showNotification = false;
        window.location.reload()
      }, 1300)
    },
    async getFood() {
      this.foods = [];
      this.total_page = [];
      
      const { data } = await axios.get('/masterbarang', {
          headers: {
            Filter: 'K002',
            Authorization: 'asdasdasdasdasda'
          }
      })

      this.food = data
      this.pagelength = this.food.length
      for (let i = 0; i < this.food.length; i += parseInt(this.perpage)) {
        this.foods.push(this.food.slice(i, i + parseInt(this.perpage)));
      }

      for (let i = 0; i < this.foods.length; i++) {
        this.total_page.push(i);
      }
    },
    getFooImage(filename) {
      return "/images/foods/" + filename;
    },
    setStatus(stock, min) {
      if (stock < min) return "Running Out";
      else if (stock === 0) return "Out Of Stock";
      else return "Ready";
    },
    onClosedModal(value) {
      this.showCreate = value;
      this.showEdit = value;
    },
    editModal(item) {
      this.showEdit = true;
      this.selectedFood = item;
    },
    prevPagination(){
        if(this.start <= 0) return;
        this.start -= 5
        this.end -= 5
    },
    nextPagination(){
        if(this.end > this.total_page.length) {
            this.start = this.total_page.length - 5
            this.end = this.total_page.length
            return;
        }

        this.start += 5
        this.end += 5
    },
    searching(){
      this.foods = []
      this.total_page = []
      this.start = 0
      this.end = 8
      this.perpage = 10

      const searchTerm = '*' + this.searchItem + '*';
      const wildcardRegex = new RegExp('^' + searchTerm.replace(/\*/g, '.*') + '$', 'i');
      const matchingObjects = this.food.filter(obj =>
        Object.values(obj).some(value =>
          typeof value === 'string' && wildcardRegex.test(value)
        )
      )

      let j = 1
      const newFood = []
      this.pagelength = matchingObjects.length;
      matchingObjects.forEach((data) => {
        data.no = j;
        newFood.push(data);
        j++;
      })

      for (let i = 0; i < newFood.length; i += parseInt(this.perpage)) {
        this.foods.push(newFood.slice(i, i + parseInt(this.perpage)));
      }

      console.log(this.foods);
      for (let a = 0; a < this.foods.length; a++) {
        this.total_page.push(a);
      }
    },
    resolveResponse(data){
      this.showEdit = false
      this.showCreate = false

      this.message = data.message;
      this.succes = true;
      this.showNotification = true;

      setTimeout(() => {
        this.message = null;
        this.succes = false;
        this.showNotification = false;
        window.location.reload()
      }, 1300)
    }
  },
};
</script>

<style>
.table-navigation {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 10px;
}

.export-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.export-btn {
  padding: 0 10px;
  height: 39px;
  color: #404040;
  font-weight: bold;
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

.export-btn:hover {
  border: 1px solid #cacaca;
  background: var(--orange);
  background: -webkit-linear-gradient(
    bottom,
    var(--orange),
    var(--orangehover)
  );
  background: linear-gradient(to bottom, var(--orange), var(--orangehover));
  color: #ffffff;
}
</style>

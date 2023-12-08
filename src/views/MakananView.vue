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
            <h2>Food Menu</h2>
          </div>

          <button
            class="btn-theme"
            style="position: absolute; top: 20px; right: 20px"
            @click="showCreate = true">
            Add New Food
          </button>

          <div class="content">
            <div style="width: 100%; margin-top: 20px">
              <div class="table-navigation">
                <select
                  class="warehouse-input"
                  style="width: 80px"
                  v-model="perpage"
                  @change="getFood">
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
                        placeholder="Search food item..."
                        v-model="searchFood"
                        @keyup.enter="searching">
                </div>
              </div>

              <table class="table-responsive" aria-describedby="Food data">
                <thead class="bg-theme">
                  <tr>
                    <th style="width: 5%; 
                    border-top-left-radius: 5px">No</th>
                    <th style="width: 15%">Image</th>
                    <th style="width: 20%">Food Name</th>
                    <th style="width: 10%">Category</th>
                    <th style="width: 5%">Stock</th>
                    <th style="width: 10%">Price</th>
                    <th style="width: 10">Status</th>
                    <th style="width: 15%; 
                    border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="items in foods[selectedPage]"
                    :key="items.id"
                    :class="{ 'bg-canvas': items.no % 2 == 0 }">
                    <td>{{ items.no }}</td>
                    <td>
                      <img
                        :src="getFooImage(items.image)"
                        :alt="items.iamge"
                        style="width: 120px"
                      />
                    </td>
                    <td>{{ items.name }}</td>
                    <td>{{ items.category }}</td>
                    <td>{{ items.stock }}</td>
                    <td>{{ items.price }}</td>
                    <td>
                      <span
                        :class="{
                          'capsule-theme': items.active,
                          'capsule-danger': !items.active,
                        }">
                        {{ setStatus(items.active) }}
                      </span>
                    </td>
                    <td>
                      <button class="btn-primary" @click="editModal(items)">
                        Edit
                      </button>

                      <button class="btn-danger" style="margin-left: 10px">
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
                    of {{ foodlength }} entries.
                  </span>
                </div>
                <div
                  style="
                    width: 50%;
                    display: flex;
                    flex-direction: row;
                    justify-content: end;
                  ">
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
                  class="page-next" @click="nextPagination"
                  :disabled="total_page.length <= end">
                    Next {{ end }}
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
      @closed="onClosedModal"> 
  </create-modal>

  <edit-modal 
      v-show="showEdit" 
      :food="selectedFood" 
      @closed="onClosedModal">
  </edit-modal>
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
import CreateModal from "@/components/CreateModal.vue";
import EditModal from "@/components/EditModal.vue";

export default {
  name: "MakananView",
  components: {
    SidebarVue,
    NavbarVue,
    CreateModal,
    EditModal,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      allselected: false,
      showCreate: false,
      showEdit: false,
      food: [],
      foodlength: 0,
      foods: [],
      total_page: [],
      selectedPage: 0,
      selectedFood: {},
      perpage: 10,
      start: 0,
      end: 8,
      searchFood: null,
    };
  },
  mounted() {
    this.food = [...this.$store.state.food];
    this.getFood();
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    getFood() {
      let j = 1;
      const newFood = [];
      this.foods = [];
      this.total_page = [];
      this.foodlength = this.food.length;
      this.food.forEach((data) => {
        data.no = j;
        newFood.push(data);
        j++;
      });

      for (let i = 0; i < newFood.length; i += parseInt(this.perpage)) {
        this.foods.push(newFood.slice(i, i + parseInt(this.perpage)));
      }

      console.log(this.foods);
      for (let a = 0; a < this.foods.length; a++) {
        this.total_page.push(a);
      }
    },
    getFooImage(filename) {
      return "/images/foods/" + filename;
    },
    setStatus(value) {
      if (value) return "Active";
      else return "Not Active";
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

      const searchTerm = '*' + this.searchFood + '*';
      const wildcardRegex = new RegExp('^' + searchTerm.replace(/\*/g, '.*') + '$', 'i');
      const matchingObjects = this.food.filter(obj =>
        Object.values(obj).some(value =>
          typeof value === 'string' && wildcardRegex.test(value)
        )
      )

      let j = 1
      const newFood = []
      this.foodlength = matchingObjects.length;
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
    }
  },
};
</script>

<style>
.capsule-theme {
  padding: 5px 15px;
  background: var(--themecolor);
  border-radius: 50px;
  color: var(--white);
}

.capsule-danger {
  padding: 5px 15px;
  background: var(--red);
  border-radius: 50px;
  color: var(--white);
}

.capsule-warning {
  padding: 5px 15px;
  background: var(--orange);
  border-radius: 50px;
  color: var(--white);
}

.paginate-active{
  color: var(--dark);
}

.search-container{
  position: absolute;
  top: 0;
  right: 0px;
  width: 250px;
  height: 100%;
  border: 1px solid var(--light);
  border-radius: 5px;
  padding: 0;
  overflow: hidden;
}
</style>

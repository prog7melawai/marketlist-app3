<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-wrapper">
          <div class="content-title">
            <h2>Event</h2>
          </div>

          <button
            class="btn-primary"
            style="position: absolute; top: 20px; right: 20px">
            <i class="ri-refresh-line" style="font-size: 14pt"></i>

            <span style="position: relative; top: -2px"> Synchronize </span>
          </button>

          <div class="content">
            <div style="width: 100%; margin-top: 20px">
              <div class="table-navigation">
                <select
                  class="warehouse-input"
                  style="width: 80px"
                  v-model="perpage"
                  @change="getEvent"
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
                          placeholder="Search event..."
                          v-model="searchItem"
                          @keyup.enter="searching">
                </div>
              </div>

              <table
                class="table-responsive"
                aria-describedby="Upcoming Event data"
              >
                <thead class="bg-theme">
                  <tr>
                    <th style="width: 5%; 
                    border-top-left-radius: 5px">No</th>
                    <th style="width: 30%">Event Name</th>
                    <th style="width: 10%">Event Date</th>
                    <th style="width: 20%">Customer</th>
                    <th style="width: 10%">Person</th>
                    <th style="width: 10">Status</th>
                    <th style="width: 15%; 
                    border-top-right-radius: 5px">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="ev in events[selectedPage]"
                    :key="ev.id"
                    :class="{ 'bg-canvas': ev.no % 2 == 0 }"
                  >
                    <td>{{ ev.no }}</td>
                    <td>{{ ev.name }}</td>
                    <td>{{ ev.date }}</td>
                    <td>{{ ev.customer }}</td>
                    <td>{{ ev.person }}</td>
                    <td>{{ ev.status }}</td>
                    <td>
                      <button
                        class="btn-primary"
                        @click="
                          this.$router.push({
                            name: 'event-detail',
                            params: { id: ev.id },
                          })
                        "
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="page-wrapper" v-if="total_page.length > 0">
                <div style="width: 50%">
                  <span style="font-size: 10pt">
                    Showing {{ events[selectedPage][0].no }} to
                    {{
                      events[selectedPage][events[selectedPage].length - 1].no
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
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";

export default {
  name: "EventView",
  components: {
    SidebarVue,
    NavbarVue,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      allselected: false,
      showCreate: false,
      showEdit: false,
      event: [],
      events: [],
      total_page: [],
      selectedPage: 0,
      selectedEvent: {},
      perpage: 10,
      start: 0,
      end: 8,
      searchItem: null,
      pagelength: 0,
    };
  },
  mounted() {
    this.event = [...this.$store.state.event];
    this.getEvent();
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    getEvent() {
      let j = 1;
      const newEvent = [];
      this.events = [];
      this.total_page = [];
      this.event.forEach((data) => {
        data.no = j;
        newEvent.push(data);
        j++;
      });

      this.pagelength = this.event.length
      for (let i = 0; i < newEvent.length; i += parseInt(this.perpage)) {
        this.events.push(newEvent.slice(i, i + parseInt(this.perpage)));
      }

      for (let i = 0; i < this.events.length; i++) {
        this.total_page.push(i);
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
      this.events = []
      this.total_page = []
      this.start = 0
      this.end = 8
      this.perpage = 10

      const searchTerm = '*' + this.searchItem + '*';
      const wildcardRegex = new RegExp('^' + searchTerm.replace(/\*/g, '.*') + '$', 'i');
      const matchingObjects = this.event.filter(obj =>
        Object.values(obj).some(value =>
          typeof value === 'string' && wildcardRegex.test(value)
        )
      )

      let j = 1
      const newEvent = []
      this.pagelength = matchingObjects.length;
      matchingObjects.forEach((data) => {
        data.no = j;
        newEvent.push(data);
        j++;
      })

      for (let i = 0; i < newEvent.length; i += parseInt(this.perpage)) {
        this.events.push(newEvent.slice(i, i + parseInt(this.perpage)));
      }

      for (let a = 0; a < this.events.length; a++) {
        this.total_page.push(a);
      }
    }
  },
};
</script>

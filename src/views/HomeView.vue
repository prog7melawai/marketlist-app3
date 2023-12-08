<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">
        <div class="content-summary">
          <div class="summary-box">
            <img
              src="/images/icons/document.svg"
              alt="documentlogo"
              style="width: 70px; margin-left: 10px"
            />

            <div
              style="display: flex; flex-direction: column; margin-left: 10px"
            >
              <span class="event-title">Purchase Review</span>
              <span
                style="
                  font-size: 20pt;
                  font-family: 'Lexed', sans-serif;
                  font-weight: bold;
                  color: var(--orange);
                "
              >
                17
              </span>
            </div>
          </div>

          <div class="summary-box">
            <img
              src="/images/icons/event.svg"
              alt="eventlogo"
              style="width: 70px; margin-left: 10px"
            />

            <div
              style="display: flex; flex-direction: column; margin-left: 10px"
            >
              <span class="event-title">Upcoming Event</span>
              <span
                style="
                  font-size: 20pt;
                  font-family: 'Lexed', sans-serif;
                  font-weight: bold;
                  color: var(--orange);
                "
              >
                18
              </span>
            </div>
          </div>

          <div class="summary-box">
            <img
              src="/images/icons/mail-open.svg"
              alt="maillogo"
              style="width: 70px; margin-left: 10px"
            />

            <div
              style="display: flex; flex-direction: column; margin-left: 10px"
            >
              <span class="event-title">Running Out</span>
              <span
                style="
                  font-size: 20pt;
                  font-family: 'Lexed', sans-serif;
                  font-weight: bold;
                  color: var(--orange);
                "
              >
                20
              </span>
            </div>
          </div>
        </div>

        <div class="content-wrapper">
          <div class="content-title">
            <h2>Dashboard</h2>
          </div>

          <div class="content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarVue from "@/components/Sidebar.vue";
import NavbarVue from "@/components/Navbar.vue";
export default {
  name: "HomeView",
  components: {
    SidebarVue,
    NavbarVue,
  },
  data() {
    return {
      sidebarWidth: "18%",
      contentWidth: "78%",
      filelist: [],
      selectedfile: null,
    };
  },
  mounted(){
    this.sidebarWidth = this.$store.getters.GET_SIDEBAR_WIDTH.sidebarwidth
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
    dragover(event) {
      event.preventDefault();
      if (!event.currentTarget.classList.contains("bg-orange")) {
        event.currentTarget.classList.remove("bg-canvas");
        event.currentTarget.classList.add("bg-orange");
      }
    },
    dragleave(event) {
      event.currentTarget.classList.add("bg-canvas");
      event.currentTarget.classList.remove("bg-orange");
    },
    drop(event) {
      event.preventDefault();
      const fileArray = event.dataTransfer.files;
      for (let file of fileArray) {
        if (
          file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          alert("Invalid file input: " + file.name + "!");
        } else {
          this.filelist.push(file);
        }
      }

      this.selectedfile = this.filelist[0].name;
      console.log(this.filelist);
    },
    onChange() {
      this.filelist = [...this.$refs.file.files];
      this.selectedfile = this.filelist[0].name;
      document.getElementById("drop-box").classList.add("bg-orange");
    },
    removeFile() {
      this.filelist = [];
      this.selectedfile = null;
      document.getElementById("drop-box").classList.remove("bg-orange");
      document.getElementById("drop-box").classList.add("bg-canvas");
    },
  },
};
</script>

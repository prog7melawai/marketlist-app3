<template>
  <div>
    <navbar-vue :swidth="sidebarWidth" :cwidth="contentWidth"></navbar-vue>
    <sidebar-vue @swidth="setWidth"></sidebar-vue>

    <div class="container">
      <div :style="{ width: sidebarWidth }" class="content-spacer"></div>
      <div :style="{ width: contentWidth }" class="content-body">

        <div class="content-wrapper">
          <div class="content-title">
            <h2>Profile Setting</h2>
          </div>

          <div class="content">
            <div class="profile-split">
                <div class="profile-left">
                    <div class="profile-input">
                        <span style="width: 200px;">Name</span>
                        <input type="text" class="form-input" :value="name.charAt(0).toUpperCase() + name.slice(1)" placeholder="Enter Your Full Name" readonly>
                    </div>

                    <div class="profile-input">
                        <span style="width: 200px;">NIK</span>
                        <input type="text" class="form-input" placeholder="" readonly>
                    </div>

                    <div class="profile-input">
                        <span style="width: 200px;">Company</span>
                        <input type="text" class="form-input" :value="subdivision" placeholder="Enter Your Company" readonly>
                    </div>

                    <div class="profile-input">
                        <span style="width: 200px;">Department</span>
                        <input type="text" class="form-input" :value="department" placeholder="Enter Your Department" readonly>
                    </div>
                </div>
                <div class="profile-right">
                    <div class="profile-img">
                      <div class="image-input bg-gradient-gray" 
                        style="height: 100%;width: 100%;overflow: hidden;" 
                        id="image-edit">
                        <i class="ri-image-add-fill"
                          v-if="!selectedfile && !profileimage"
                        ></i>

                        <div v-if="selectedfile" style="width: 100%">
                          <div v-for="img in images" :key="img">
                            <img :src="img" class="preview" alt="item" />
                          </div>
                        </div>

                        <div v-if="!selectedfile && profileimage">
                          <div style="position: absolute;
                            top: 40%;
                            left: 50%;
                            -webkit-transform: translateX(-50%);
                            transform: translateX(-50%);
                            font-size: 50pt;
                            color: var(--red);">
                            <i class="ri-restart-line"></i>
                          </div>
                          
                          <img :src="getImage(profileimage)" class="preview" alt="item" />
                        </div>

                        <span
                          class="image-select-title"
                          v-if="!selectedfile && !profileimage"
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
                </div>
            </div>

            <div class="profile-input" style="margin-top: 20px;">
                <span style="width: 190px;">Email Address</span>
                <input type="password" class="form-input" :value="email" readonly>
            </div>

            <div class="profile-input" style="margin-top: 20px;">
                <span style="width: 190px;">Password</span>
                <input type="password" class="form-input" placeholder="Enter New Password">
            </div>

            <div class="profile-input" style="margin-top: 20px;">
                <span style="width: 190px;">Confirm Password</span>
                <input type="password" class="form-input" placeholder="Enter Your Confirm Password">
            </div>
          </div>

          <div style="width: 98%;
                      margin: 0 auto;
                      margin-top: 30px;
                      margin-bottom: 30px;
                      display: flex;
                      flex-direction: row;
                      justify-content: end;
                      gap: 20px;">
                <button class="btn-primary"
                    style="width: 200px">
                    Submit
                </button>
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
  name: "ProfileView",
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
      name: null,
      department: null,
      subdivision: null,
      division: null,
      email: null,
      images: [],
      profileimage: null,
    };
  },
  created(){
    this.name = this.$store.getters.GET_AUTH_INFO.id
    this.department = this.$store.getters.GET_AUTH_INFO.department
    this.subdivision = this.$store.getters.GET_AUTH_INFO.subdivision
    this.division = this.$store.getters.GET_AUTH_INFO.division
    this.email = this.$store.getters.GET_AUTH_INFO.email
    this.profileimage = this.$store.getters.GET_AUTH_INFO.image
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
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
  },
};
</script>

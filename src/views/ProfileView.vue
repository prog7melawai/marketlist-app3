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
                        <span style="width: 200px;">Full Name</span>
                        <input type="text" class="form-input" placeholder="Enter Your Full Name">
                    </div>

                    <div class="profile-input">
                        <span style="width: 200px;">NIK</span>
                        <input type="text" class="form-input" placeholder="Enter Your NIK">
                    </div>

                    <div class="profile-input">
                        <span style="width: 200px;">Company</span>
                        <input type="text" class="form-input" placeholder="Enter Your Company">
                    </div>

                    <div class="profile-input">
                        <span style="width: 200px;">Department</span>
                        <input type="text" class="form-input" placeholder="Enter Your Department">
                    </div>
                </div>
                <div class="profile-right">
                    <div class="profile-img"></div>
                </div>
            </div>

            <div class="profile-input" style="margin-top: 20px;">
                <span style="width: 190px;">Email Address</span>
                <input type="password" class="form-input" placeholder="Enter Your Email Address">
            </div>

            <div class="profile-input" style="margin-top: 20px;">
                <span style="width: 190px;">Password</span>
                <input type="password" class="form-input" placeholder="Enter Your Password">
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
    };
  },
  methods: {
    setWidth(value) {
      this.sidebarWidth = value;
      if (value === "18%") this.contentWidth = "78%";
      else this.contentWidth = "92%";
    },
  },
};
</script>


<style>
.profile-split{
    width: 100%;
    display: flex;
    flex-direction: row;
}

.profile-left{
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: 20px
}

.profile-input{
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 40px;
    font-size: 12pt;
    color: var(--light);
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.profile-right{
    width: 20%;
    display: flex;
    flex-direction: column;
}

.profile-img{
    width: 90%;
    height: 220px;
    margin: 0 auto;
    background: var(--canvas);
    border-radius: 5px;
}
</style>

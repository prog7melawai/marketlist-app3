<template>
  <div class="navbar-wrapper">
    <div
      :style="{ width: swidth }"
      class="content-spacer slide-transition"
    ></div>
    <div :style="{ width: cwidth }" class="navbar-right slide-transition">
      <!-- <div class="navbar-search">
        <div class="search-box">
          <input type="text" class="search" placeholder="Search Item" />
          <button class="search-btn">
            <i class="ri-search-line"></i>
          </button>
        </div>
      </div> -->
      <div class="navbar-content">
        <!-- 
        <div class="navbar-link" style="position: relative" @click="showNotif">
          <div class="notif">4</div>
          <i class="ri-notification-2-fill"></i>
        </div>
        <div class="navbar-link">
          <i class="ri-moon-fill"></i>
        </div>
        -->
        <div class="user-detail">
          <div class="user-image">
            <img class="profile-image" src="/images/user/user.png" alt="user" />
          </div>
          <div class="username" @click="showUsrDrp">
            <h4>{{ username.charAt(0).toUpperCase() + username.slice(1) }}</h4>
            <h5>
              {{ deptkd }}
              <i class="ri-arrow-down-s-fill"></i>
            </h5>
          </div>
        </div>
      </div>

      <!-- 
      <div class="dropdown-wrapper" v-if="showNotification">
        <div class="dropdown-overlay" @click="showNotification = false"></div>
        <div class="notification-dropdown">
          <a class="dropdown-link">
            <i class="ri-mail-unread-fill"></i>
            <span>1 item running out of stock (RM001)</span>
          </a>
          <a class="dropdown-link">
            <i class="ri-mail-unread-fill"></i>
            <span>1 item running out of stock (WIP001)</span>
          </a>
        </div>
      </div>
      -->
      
      <div class="dropdown-wrapper" v-if="showUserDropdown">
        <div class="dropdown-overlay" @click="showUserDropdown = false"></div>
        <div class="user-dropdown">
          <router-link :to="{name: 'profile'}" class="dropdown-link">
            <i class="ri-user-fill"></i>
            <span>Profile</span>
          </router-link>
          <div class="line"></div>
          <a @click="logout" class="logout-link">
            <i class="ri-logout-circle-r-line"></i>
            <span>Logout</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavbarVue",
  props: ["swidth", "cwidth"],
  data() {
    return {
      showUserDropdown: false,
      showNotification: false,
      username: null,
      deptkd: null,
    };
  },
  created(){
    this.username = this.$store.getters.GET_AUTH_INFO.id
    this.deptkd = this.$store.getters.GET_AUTH_INFO.position
  },
  methods: {
    showUsrDrp() {
      if (this.showUserDropdown) this.showUserDropdown = false;
      else this.showUserDropdown = true;
    },
    showNotif() {
      if (this.showNotification) this.showNotification = false;
      else this.showNotification = true;
    },
    logout(){
      this.$store.dispatch("LOGOUT")
      .then(() => {
          this.$store.commit('SET_CONTRACT_NOTIF', {is_open: false, count: 0})
          this.$router.push({ name : 'login'});
      }).catch(() => {
          this.$store.commit('SET_CONTRACT_NOTIF', {is_open: false, count: 0})
          this.$router.push({ name : 'login'});
      });
    }
  },
};
</script>

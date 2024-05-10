<template>
  <div class="sidebar-wrapper" :style="{ width: this.$store.getters.GET_SIDEBAR_WIDTH.sidebarwidth }">
    <div class="sidebar-logo" id="sidebar-logo">
      <img
        id="logo"
        class="logo"
        src="/images/logo/movenpick_white.png"
        alt="logo"/>

      <!-- 
      <i class="ri-menu-line sidebar-expand"
        @click="showSidebar"
        id="menu-button">
      </i>
      -->

      <div class="sidebar-expand">
        <input 
          type="checkbox" 
          id="checkbox" 
          :checked="isHide" 
          @change="showSidebar">
        <label for="checkbox" class="toggle" id="menu-button">
          <div class="bar bar--top"></div>
          <div class="bar bar--middle"></div>
          <div class="bar bar--bottom"></div>
        </label>
      </div>
    </div>

    <div class="sidebar-menu">
      <div style="margin-top: 80px"></div>
      <!-- <div class="menu-link" style="margin-top: 80px">
        <router-link
          :to="{ name: 'home' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'home',
            'link-unactive': this.$route.name !== 'home',
          }">
          <i class="ri-home-smile-fill"></i>
          <h3 v-if="!isHide">Dashboard</h3>
        </router-link>
      </div> -->
      <div class="menu-link" v-if="permission.includes('import')">
        <router-link
          :to="{ name: 'import' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'import',
            'link-unactive': this.$route.name !== 'import',
          }">
          <i class="ri-file-excel-2-fill"></i>
          <h3 v-if="!isHide">Import Data</h3>
        </router-link>
      </div>
      <!-- 
      <div class="menu-link">
        <router-link
          :to="{ name: 'transfer' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'transfer',
            'link-unactive': this.$route.name !== 'transfer',
          }">
          <i class="ri-folder-transfer-fill"></i>
          <h3 v-if="!isHide">Transfer Item</h3>
        </router-link>
      </div>
      <div class="menu-link">
        <router-link
          :to="{ name: 'manage-warehouse' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'manage-warehouse',
            'link-unactive': this.$route.name !== 'manage-warehouse',
          }">
          <i class="ri-home-8-fill"></i>
          <h3 v-if="!isHide">Manage Warehouse</h3>
        </router-link>
      </div>
      -->
      <div class="menu-link" v-if="permission.includes('master-jenis')">
        <router-link
          :to="{ name: 'jenis' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'jenis',
            'link-unactive': this.$route.name !== 'jenis',
          }">
          <i class="ri-box-3-fill"></i>
          <h3 v-if="!isHide">Product Types</h3>
        </router-link>
      </div>
      <!--
      <div class="menu-link">
        <router-link
          :to="{ name: 'food' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'food',
            'link-unactive': this.$route.name !== 'food',
          }">
          <i class="ri-cake-3-fill"></i>
          <h3 v-if="!isHide">Menu Makanan</h3>
        </router-link>
      </div> -->
      <div class="menu-link" v-if="permission.includes('marketlist')">
        <router-link
          :to="{ name: 'marketlist' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'marketlist',
            'link-unactive': this.$route.name !== 'marketlist',
          }">
          <i class="ri-leaf-fill"></i>
          <h3 v-if="!isHide">Marketlist</h3>
        </router-link>
      </div>
      <div class="menu-link" v-if="permission.includes('stockfinance')">
        <router-link
          :to="{ name: 'stockfinance' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'stockfinance',
            'link-unactive': this.$route.name !== 'stockfinance',
          }">
          <i class="ri-scales-2-fill"></i>
          <h3 v-if="!isHide">Stock Finance</h3>
        </router-link>
      </div>
      <!-- 
      <div class="menu-link">
        <router-link
          :to="{ name: 'event' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'event',
            'link-unactive': this.$route.name !== 'event',
          }">
          <i class="ri-calendar-event-fill"></i>
          <h3 v-if="!isHide">Event</h3>
        </router-link>
      </div> -->
      <div class="menu-link" v-if="permission.includes('contract')">
        <router-link
          :to="{ name: 'contract' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'contract',
            'link-unactive': this.$route.name !== 'contract',
          }">
          <i class="ri-draft-fill"></i>
          <h3 v-if="!isHide">Contract</h3>
        </router-link>
      </div>
      <div class="menu-link" v-if="permission.includes('loadpr')">
        <router-link
          :to="{ name: 'load' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'load',
            'link-unactive': this.$route.name !== 'load',
          }">
          <i class="ri-upload-cloud-2-fill"></i>
          <h3 v-if="!isHide">Upload PR</h3>
        </router-link>
      </div>
      <div class="menu-link" v-if="permission.includes('pr')">
        <router-link
          :to="{ name: 'pr' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'pr',
            'link-unactive': this.$route.name !== 'pr',
          }">
          <i class="ri-article-fill"></i>
          <h3 v-if="!isHide">Purchase Requisition</h3>
        </router-link>
      </div>
      <div class="menu-link" v-if="permission.includes('po')">
        <router-link
          :to="{ name: 'po' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'po',
            'link-unactive': this.$route.name !== 'po',
          }">
          <i class="ri-luggage-cart-fill"></i>
          <h3 v-if="!isHide">Purchase Order</h3>
        </router-link>
      </div>
      <div class="menu-link" v-if="permission.includes('receiving')">
        <router-link
          :to="{ name: 'receiving' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'receiving',
            'link-unactive': this.$route.name !== 'receiving',
          }">
          <i class="ri-folder-received-fill"></i>
          <h3 v-if="!isHide">Receiving</h3>
        </router-link>
      </div>
      <!-- 
      <div class="menu-link">
        <router-link
          :to="{ name: 'manage-user' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'manage-user',
            'link-unactive': this.$route.name !== 'manage-user',
          }">
          <i class="ri-user-settings-fill"></i>
          <h3 v-if="!isHide">Manage User</h3>
        </router-link>
      </div>
      <div class="menu-link" style="margin-bottom: 50px;">
        <router-link
          :to="{ name: 'manage-menu' }"
          class="nav-link"
          :class="{
            'link-active': this.$route.name === 'manage-menu',
            'link-unactive': this.$route.name !== 'manage-menu',
          }">
          <i class="ri-menu-add-line"></i>
          <h3 v-if="!isHide">Manage Menu</h3>
        </router-link>
      </div>
      -->
    </div>

    <div class="area" :style="{width: this.$store.getters.GET_SIDEBAR_WIDTH.bgsidebar}">
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "SidebarVue",
  data() {
    return {
      sidebarWidth: null,
      bgsideWidth: null,
      isHide: false,
      perm: null,
      permissions: [],
    };
  },
  mounted(){
    if (this.$store.getters.GET_SIDEBAR_WIDTH.sidebarwidth === "18%") {
        this.isHide = false;
        this.$emit("swidth", this.$store.getters.GET_SIDEBAR_WIDTH.sidebarwidth);
        document.getElementById("logo").style.display = 'block';
        let navlink = document.getElementsByClassName("nav-link");
        for (let nav of navlink) {
          nav.style.justifyContent = "start";
          nav.style.padding = "0 10px";
        }
    } else {
        this.isHide = true;
        this.$emit("swidth", this.$store.getters.GET_SIDEBAR_WIDTH.sidebarwidth);
        document.getElementById("logo").style.display = 'none';
        let navlink = document.getElementsByClassName("nav-link");
        for (let nav of navlink) {
          nav.style.justifyContent = "center";
          nav.style.padding = "0";
        }
    }
  },
  created(){
    this.perm = this.$store.getters.GET_AUTH_INFO.permission
    this.permission = this.perm.split(",")
  },
  methods: {
    showSidebar() {
      if (this.isHide) {
        this.isHide = false;
        this.$store.commit('SET_SIDEBAR_WIDTH', {sidebar: "18%", bg: "17.2%", exp: false})
        this.$emit("swidth", this.$store.getters.GET_SIDEBAR_WIDTH.sidebarwidth);
        document.getElementById("logo").style.display = 'block';
        let navlink = document.getElementsByClassName("nav-link");
        for (let nav of navlink) {
          nav.style.justifyContent = "start";
          nav.style.padding = "0 10px";
        }
      } else {
        this.isHide = true;
        this.$store.commit('SET_SIDEBAR_WIDTH', {sidebar: "4%", bg: "4%", exp: true})
        this.$emit("swidth", this.$store.getters.GET_SIDEBAR_WIDTH.sidebarwidth);
        document.getElementById("logo").style.display = 'none';
        let navlink = document.getElementsByClassName("nav-link");
        for (let nav of navlink) {
          nav.style.justifyContent = "center";
          nav.style.padding = "0";
        }
      }
    },
  },
};
</script>

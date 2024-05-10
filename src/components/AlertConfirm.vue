<template>
  <div class="modal-container">
    <div class="overlay"></div>
    <div class="alert-dialog shake-r">
      <div class="btn-close" @click="closed" style="top: 0px; z-index: 10">
        <i class="ri-close-fill"></i>
      </div>

      <div
        style="
          position: relative;
          width: 100%;
          height: 50px;
          border-bottom: 2px solid var(--canvas);
        "
      >
        <span class="alert-title">{{ title }}</span>
      </div>

      <div
        style="
          position: relative;
          width: 100%;
          height: 85px;
          border-bottom: 2px solid var(--canvas);
          display: flex;
          align-items: center;
        "
      >
        <span class="alert-message">{{ message }}</span>
      </div>

      <div class="alert-button">
        <button 
            class="btn-theme" 
            @click="callServices">
            <spinner v-if="loading"></spinner>
            <span v-if="!loading">Confirm</span>
        </button>

        <button 
            class="btn-danger" 
            @click="closed">
            Cancel
        </button>
      </div>
    </div>
  </div>  
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import axios from "axios";

export default {
  name: "AlertConfirm",
  props: ["title", "message", "methods", "url", "data", "header"],
  components: {
    Spinner,
  },
  data(){
    return {
      loading: false,
    }
  },
  methods: {
    closed() {
      this.$emit("onClosed", false);
    },
    async callServices() {
      try {
        this.loading = true
        const response = await axios(this.url, {
          method: this.methods,          
          data: this.data,
        });

        this.$emit("onResolve", response.data);
        this.loading = false
      } catch (error) {
        console.log(error);
        this.$emit("onError", error.response.data);
        if(error.response.status == 401){
          this.$store.dispatch("LOGOUT")
          .then(() => {
              this.$router.push({ path : '/login'});
          }).catch(() => {
              this.$router.push({ path : '/login'});
          });
        }
      }
    },
  },
};
</script>

<style>
.alert-dialog {
  position: relative;
  width: 90%;
  max-width: 400px;
  height: 200px;
  background: var(--white);
  border-radius: 10px;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.alert-title {
  position: relative;
  top: 15px;
  left: 20px;
  font-size: 16pt;
  font-family: "Lexend", sans-serif;
  color: var(--light);
}

.alert-message {
  position: relative;
  width: 90%;
  margin: 0 auto;
  font-size: 11pt;
  color: var(--dark);
}

.alert-button {
  position: absolute;
  bottom: 10px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 10px;
}
</style>

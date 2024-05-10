<template>
  <div class="login-container">
    <img src="/images/logo/movenpick.png" alt="logo" class="login-logo" />

    <carousel :items-to-show="1" :autoplay="5000" :wrap-around="true">
      <slide v-for="slide in backgrounds" :key="slide.id">
        <img :src="slide.image" alt="bg" class="login-bg" />
      </slide>

      <template #addons>
        <pagination />
      </template>
    </carousel>
    
    <div class="login-wrapper">
      <span class="login-title">Welcome Back!</span>

      <div style="position: relative; width: 70%; margin-left: -15px">
        <input
          type="text"
          style="
            width: 100%;
            height: 40px;
            border-radius: 50px;
            border: 1px solid #106168;
            padding-left: 15px;
          "
          v-model="username"
          placeholder="Username"
        />
      </div>
      <span 
        class="error-validation" 
        v-if="errorUser">
        {{ errorUser }}
      </span>

      <div style="position: relative; width: 70%; margin-left: -15px">
        <input
          type="password"
          style="
            width: 100%;
            height: 40px;
            border-radius: 50px;
            border: 1px solid #106168;
            padding-left: 15px;
          "
          id="password"
          v-model="password"
          placeholder="Password"
          v-on:keydown.enter="login"
        />
        <span 
          class="error-validation" 
          v-if="errorPass">
          {{ errorPass }}
        </span>

        <div 
          style="position: absolute;
            top: 12px;
            right: 10px;
            font-size: 15pt;
            cursor: pointer;
            color: var(--light)"
          @click="showPass">
            <i v-if="!showPassword" class="ri-eye-close-line"></i>
            <i v-if="showPassword" class="ri-eye-line"></i>
        </div>
      </div>

      <div
        style="
          margin-top: -10px;
          width: 70%;
          display: flex;
          justify-content: end;
          font-family: 'Ubahn', sans-serif;
          font-size: 13pt;
          color: var(--white);
        "
      >
        <span>
          Forgot our password ?
          <a href="" style="text-decoration: none; color: var(--orange)"
            >Reset</a
          >
        </span>
      </div>

      <button 
        class="login-btn" 
        @click="login">
        <spinner v-if="is_proccess"></spinner>
        <span v-if="!is_proccess">Log In</span>
      </button>
    </div>
  </div>
</template>

<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination } from 'vue3-carousel'
import Spinner from '@/components/Spinner.vue';

export default {
  name: "LoginView",
  components: {
      Spinner,
      Carousel,
      Slide,
      Pagination,
  },
  data(){
    return {
      username: null,
      password: null,
      errorUser: null,
      errorPass: null,
      is_proccess: false,
      showPassword: false,
      backgrounds: [
        {id: 1, image: '/images/background/bg-movenpick.jpg'},
        {id: 2, image: '/images/background/bg-movenpick1.jpg'},
        {id: 3, image: '/images/background/bg-movenpick2.jpg'},
        {id: 4, image: '/images/background/bg-movenpick3.jpg'},
        {id: 5, image: '/images/background/bg-movenpick4.jpg'},
        {id: 6, image: '/images/background/bg-movenpick5.jpg'},
      ]
    }
  },
  methods: {
    login(){
        if(!this.username) this.errorUser = "Field Username is required!";
        if(!this.password) this.errorPass = "Field Password is required!";
        if(!this.username || !this.password) return;

        this.is_proccess = true

        const data = {
          username: this.username,
          password: this.password,
        }

        if(this.username && this.password){
          this.$store.dispatch("LOGIN", data)
          .then(() => {
              this.is_proccess = false
              this.$router.push({ name : 'import'});
          }).catch((error) => {
              console.log(error)
              alert(error.response.data.message);
          });
        }

        setTimeout(() => {
            this.errorNik = null;
            this.errorPass = null;
        }, 5000);
    },
    showPass(){
      if(this.showPassword === false) {
          this.showPassword = true;
          document.getElementById("password").type = 'text';
      } else {
          this.showPassword = false;
          document.getElementById("password").type = 'password';
      }
    },
  },
};
</script>

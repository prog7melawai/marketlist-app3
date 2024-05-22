<template>
  <div>
    <video class="bg-video" preload="true" autoplay="true" muted loop>
        <source src="../assets/bg-movenpick.mp4" type="video/mp4">
    </video>

    <div class="bg-login-container">
        <div class="login-logo" v-if="!isMobile">
            <img class="lg-logo" src="/images/logo/movenpick.png" alt="">
        </div>

        <div class="login-divider" v-if="!isMobile">
        </div>

        <div class="login-forms">
            <div class="login-card">
                <span class="login-title" 
                    style="margin-top: 10px;
                    margin-bottom: 3svh;
                    color: var(--paper);">
                    Welcome Back!
                </span>
                <div style="width: 80%;display: flex;flex-direction: column;margin-top: -10px;">
                    <div class="form-login-group">
                    <label class="login-form-labels"
                    style="color: var(--paper)">Userid</label>
                    <input 
                        type="text" 
                        class="login-form2" 
                        placeholder="Enter your userid" 
                        v-model="username"
                        @keyup.enter="login">
                    <span class="error-input">{{ errorUser }}</span>
                    </div>

                    <div class="form-login-group" style="margin-top: -1%;">
                    <label class="login-form-labels"
                    style="color: var(--paper)">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        class="login-form2"
                        placeholder="Enter your password" 
                        v-model="password"
                        @keyup.enter="login">
                    <div class="show-passwords" @click="showPass">
                        <i v-if="!showPassword" class="ri-eye-close-line"></i>
                        <i v-if="showPassword" class="ri-eye-line"></i>
                    </div>
                    <span class="error-input">{{ errorPass }}</span>
                    </div>
                    
                    <div style="display: flex;gap: 10px;margin-top: -10px;">
                    <input type="checkbox" class="remember-me" 
                    style="background: transparent;
                    border: 1px solid var(--paper);" 
                    v-model="remember">
                    <span style="color: var(--paper)">Keep me signed in</span>
                    </div>

                    <button class="login-button2" @click="login">
                    <spinner v-if="is_proccess"></spinner>
                    <span v-if="!is_proccess">Log In</span>
                    </button>

                    <div class="forgot-wrapper" 
                    style="margin-top: 30px;">
                        <span style="color: var(--paper)">Forgot your password ? 
                            <a href="" class="reset-link2">Reset</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue';

export default {
    name: 'SignInView',
    components: {
      Spinner,
  },
  data(){
    return {
      username: null,
      password: null,
      remember: false,
      errorUser: null,
      errorPass: null,
      is_proccess: false,
      showPassword: false,
      isMobile: false,
    }
  },
  created(){
    if(window.screen.width < 768){
        this.isMobile = true
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
          remember: this.remember,
        }

        if(this.username && this.password){
          this.$store.dispatch("LOGIN", data)
          .then(() => {
              this.is_proccess = false
              this.$router.push({ name : 'home'});
          }).catch((error) => {
              this.is_proccess = false
              if(error.response.status === 401){
                this.$toast.open({
                    message: 'Invalid Credentials!',
                    type: 'error',
                    duration: 2000,
                    dismissible: true,
                });
              } else {
                this.$toast.open({
                    message: 'Internal server error',
                    type: 'error',
                    duration: 2000,
                    dismissible: true,
                });
              }
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
}
</script>

<style scoped>
.login-logo{
    width: 30%;
    overflow: hidden;
}

.login-divider{
    height: 480px;
    width: 1px;
    background: var(--paper);
}

.login-forms{
    width: 40%;
    height: 500px;
}

@media(max-width: 768px){
    .login-forms{
        width: 100%;
    }
}

.login-logo img{
    width: 90%;
    margin: 0 auto;
    object-fit: contain;
}

.bg-video{
    position: absolute;
    top: 0;
    left: 0;
    width: 100svw;
    height: 100svh;
    margin: 0 auto;
    object-fit: fill;
    z-index: 1;
}

@media(max-width: 768px){
    .bg-video{
        object-fit: cover;
    }
}

.bg-video source{
    position: fixed;
    width: 100%;
    margin: 0 auto;
    z-index: 1;
}

.bg-login-container{
    position: fixed;
    top: 0;
    left: 0;
    width: 100svw;
    height: 100svh;
    /* background: #0000009a; */
    background-image: linear-gradient(to top, #000000df, #0000005a);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    z-index: 10;
}
.login-card {
    width: 100%;
    max-width: 650px;
    height: 80%;
    max-height: 500px;
    background: transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 0px;
}

.login-form2 {
    width: 96%;
    height: 50px;
    border: 1px solid var(--light);
    background: transparent;
    font-size: 12pt;
    padding: 0px 10px;
    color: var(--paper);
    margin-bottom: 21px;
    border-radius: 3px;
}

.login-form2::placeholder {
    color: var(--canvas);
    font-size: 12pt;
}

@media(max-width: 768px) {
    .login-form2 {
        width: 93%;
    }
}

@media(max-width: 1366px) {
    .login-form2 {
        width: 94%;
    }
}

.login-form2:focus{
    outline: 2px solid var(--red);
    border: none;
}

.error-input {
    position: absolute;
    color: red;
    bottom: 0;
    font-size: 11pt;
}

.forgot-wrapper {
    position: relative;
    margin-top: 15px;
    display: flex;
    justify-content: end;
    align-items: center;
}

.forgot-wrapper span {
    color: var(--paper);
    font-family: 'Noto Sans Lao', sans-serif;
}

.line-breaks {
    position: absolute;
    width: 100%;
    height: 1px;
    background: var(--canvas);
    z-index: 1;
}

.reset-link2 {
    font-size: 12pt;
    font-family: Arial, Helvetica, sans-serif;
    color: var(--red);
    text-decoration: underline;
}

.login-button2 {
    width: 100%;
    height: 60px;
    background: var(--themehover);
    color: #fff;
    cursor: pointer;
    border: none;
    margin-top: 30px;
    font-family: 'Noto Sans Lao', sans-serif;
    font-size: 16pt;
    border-radius: 3px;
}

.login-button2:hover {
    background: var(--themecolor);
}

.show-passwords {
    position: absolute;
    top: 40px;
    right: 3%;
    font-size: 18pt;
    cursor: pointer;
    color: var(--paper)
}

@media(max-width: 1366px){
    .show-passwords {
        top: 60px;
    }
}

.login-form-labels {
    font-weight: 400;
    margin-bottom: -5px;
    font-family: 'Noto Sans Lao', sans-serif;
    font-size: 12pt;
}
</style>
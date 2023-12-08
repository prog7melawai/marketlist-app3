<template>
  <div class="login-container">
    <img src="/images/logo/movenpick.png" alt="logo" class="login-logo" />

    <img src="/images/background/food.jpg" alt="bg" class="login-bg" />

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
          placeholder="Username"
        />
      </div>

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
          placeholder="Password"
        />

        <i
          class="ri-eye-close-line"
          style="
            position: absolute;
            top: 12px;
            right: 10px;
            font-size: 15pt;
            cursor: pointer;
            color: var(--light);
          "
        ></i>
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

      <button class="login-btn" @click="login">Log In</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  methods: {
    login() {
      this.$router.push({ name: "import" });
    },
  },
};
</script>

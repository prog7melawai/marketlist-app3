<template>
  <div class="page-notfound">
    <img src="/images/logo/movenpick.png" 
        alt="logo" style="width: 200px;z-index: 9;"/>
    
    <div class="notfound-image">
      <img
        style="width: 100%; object-fit: contain"
        src="/images/background/404.png"
        alt=""
      />
      <img class="propeller" src="/images/background/propeller.png" alt="" />
    </div>

    <button class="notfound-btn mt-2" @click="this.$router.back()">Back</button>

  </div>
  <div class="wind-frame">
        <div class="circle"></div>
        <div class="wind-center">
        <svg
            stroke="#fff"
            width="100svw"
            height="100svh"
            viewBox="0 0 400 400"
            version="1.1"
            class="line"
        >
            <path
            class="st0"
            d="M-34.8,166.8c51.6,1.9,70.9,16.4,78.4,30.3c10.9,20.1-3.6,37.5,6.9,75c3.9,14,11.8,42.2,33.7,50.9
            c25.7,10.2,65.3-8.7,76.4-36.5c13.8-34.4-26.4-57.5-19.3-110.1c3.3-24.1,17.1-58.7,44.7-67.4c34.9-10.9,84.3,21.7,90.8,65.4
            c5.3,36-20.6,66.1-42.6,79.8c-39.5,24.5-95.7,14.9-108-7.6c-0.5-0.9-7.9-14.7-2.1-22.7c3.7-5,10.9-5.4,13.1-5.5
            c15.4-0.8,28.1,12.1,33,17.2c46.5,48.5,53.9,63.9,72.2,75.7c24.1,15.6,66.1,24.2,90.8,6.9c36.4-25.5,7.6-88,49.5-130.7
            c17.6-17.9,40-24.6,56.4-27.5"
            />
        </svg>
        </div>
  </div>

    <div id="background-wrap">
        <div class="x1">
            <div class="cloud"></div>
        </div>

        <div class="x2">
            <div class="cloud"></div>
        </div>

        <div class="x3">
            <div class="cloud"></div>
        </div>

        <div class="x4">
            <div class="cloud"></div>
        </div>

        <div class="x5">
            <div class="cloud"></div>
        </div>

        <div class="x6">
            <div class="cloud"></div>
        </div>

        <div class="x7">
            <div class="cloud"></div>
        </div>

        <div class="x8">
            <div class="cloud"></div>
        </div>

        <div class="x9">
            <div class="cloud"></div>
        </div>

        <div class="x10">
            <div class="cloud"></div>
        </div>

        <div class="x11">
            <div class="cloud"></div>
        </div>

        <div class="x12">
            <div class="cloud"></div>
        </div>

        <div class="x13">
            <div class="cloud"></div>
        </div>

        <div class="x14">
            <div class="cloud"></div>
        </div>

        <div class="x15">
            <div class="cloud"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: "PageNotFound",
  created(){
    if(this.$route.name !== "not-found"){
      this.$router.push({name: 'not-found'});
    }
  }
};
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Open+Sans:700,300);

.wind-frame {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100svw;
  height: 100svh;
  border-radius: 2px;
  overflow: hidden;
  color: #333;
  font-family: "Open Sans", Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  z-index: 11;
}

.wind-center {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.line {
  fill: none;
  stroke-width: 1.5px;
  stroke-linecap: round;
  -webkit-animation: line 3s linear infinite;
  animation: line 3s linear infinite;
  z-index: 11;
}

.circle {
  z-index: 10;
  position: absolute;
  border: 5px solid #fff;
  width: 150px;
  top: 310px;
  left: 50%;
  margin-left: -80px;
  -webkit-transform: translateX(-50%);
  transform: translate(-50%);
  height: 150px;
  border-radius: 50%;
  -webkit-animation: circle 2.5s ease-out infinite both;
  animation: circle 2.5s ease-out infinite both;
}

@-webkit-keyframes line {
  from {
    stroke-dasharray: 100 660;
    stroke-dashoffset: 780;
  }
  to {
    stroke-dasharray: 100 660;
    stroke-dashoffset: 70;
  }
}

@keyframes line {
  from {
    stroke-dasharray: 100 1200;
    stroke-dashoffset: 1300;
  }
  to {
    stroke-dasharray: 100 1200;
    stroke-dashoffset: 10;
  }
}

@-webkit-keyframes circle {
  0%,
  50% {
    opacity: 1;
    transform: scale(0);
  }
  70%,
  100% {
    opacity: 0;
    transform: scale(0.2);
  }
}

@keyframes circle {
  0%,
  50% {
    opacity: 1;
    transform: scale(0);
  }
  70%,
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

/*  */
.page-notfound {
  position: absolute;
  top: 0;
  left: 0;
  width: 100svw;
  height: 100svh;
  background: #ffd7a3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.notfound-image {
  position: relative;
  width: 400px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.propeller {
  position: absolute;
  top: 70px;
  margin-left: -10px;
  width: 120px;
  height: 120px;
  z-index: 100;
  animation: putar 3s ease infinite;
}

@keyframes putar {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.notfound-btn {
  width: 100px;
  height: 45px;
  border-radius: 10px;
  background: transparent;
  border: 2px solid var(--red);
  cursor: pointer;
  font-size: 16pt;
  font-family: "Black Freeday", sans-serif;
  z-index: 100;
}

.notfound-btn:hover {
  background: var(--redhover);
  border: 2px solid var(--redhover);
  color: #fff;
}

.mt-2 {
  margin-top: 2%;
}

/*  */
#background-wrap {
    bottom: 0;
	left: 0;
	padding-top: 50px;
	position: fixed;
	right: 0;
	top: 0;
}

/* KEYFRAMES */

@-webkit-keyframes animateCloud {
    0% {
        margin-left: -1000px;
    }
    100% {
        margin-left: 100%;
    }
}

@-moz-keyframes animateCloud {
    0% {
        margin-left: -1000px;
    }
    100% {
        margin-left: 100%;
    }
}

@keyframes animateCloud {
    0% {
        margin-left: -1000px;
    }
    100% {
        margin-left: 100%;
    }
}

/* ANIMATIONS */

.x1 {
	-webkit-animation: animateCloud 35s linear infinite;
	-moz-animation: animateCloud 35s linear infinite;
	animation: animateCloud 35s linear infinite;
	
	-webkit-transform: scale(0.65);
	-moz-transform: scale(0.65);
	transform: scale(0.65);
}

.x2 {
	-webkit-animation: animateCloud 20s linear infinite;
	-moz-animation: animateCloud 20s linear infinite;
	animation: animateCloud 20s linear infinite;
	
	-webkit-transform: scale(0.3);
	-moz-transform: scale(0.3);
	transform: scale(0.3);
}

.x3 {
	-webkit-animation: animateCloud 30s linear infinite;
	-moz-animation: animateCloud 30s linear infinite;
	animation: animateCloud 30s linear infinite;
	
	-webkit-transform: scale(0.5);
	-moz-transform: scale(0.5);
	transform: scale(0.5);
}

.x4 {
	-webkit-animation: animateCloud 18s linear infinite;
	-moz-animation: animateCloud 18s linear infinite;
	animation: animateCloud 18s linear infinite;
	
	-webkit-transform: scale(0.4);
	-moz-transform: scale(0.4);
	transform: scale(0.4);
}

.x5 {
	-webkit-animation: animateCloud 15s linear infinite;
	-moz-animation: animateCloud 15s linear infinite;
	animation: animateCloud 15s linear infinite;
	
	-webkit-transform: scale(0.55);
	-moz-transform: scale(0.55);
	transform: scale(0.55);
}

.x6 {
	-webkit-animation: animateCloud 25s linear infinite;
	-moz-animation: animateCloud 25s linear infinite;
	animation: animateCloud 25s linear infinite;
	
	-webkit-transform: scale(0.35);
	-moz-transform: scale(0.35);
	transform: scale(0.35);
}

.x7 {
	-webkit-animation: animateCloud 12s linear infinite;
	-moz-animation: animateCloud 12s linear infinite;
	animation: animateCloud 12s linear infinite;
	
	-webkit-transform: scale(0.30);
	-moz-transform: scale(0.30);
	transform: scale(0.30);
}

.x8 {
	-webkit-animation: animateCloud 18s linear infinite;
	-moz-animation: animateCloud 18s linear infinite;
	animation: animateCloud 18s linear infinite;
	
	-webkit-transform: scale(0.45);
	-moz-transform: scale(0.45);
	transform: scale(0.45);
    z-index: 11;
}

.x9 {
	-webkit-animation: animateCloud 30s linear infinite;
	-moz-animation: animateCloud 30s linear infinite;
	animation: animateCloud 30s linear infinite;
	
	-webkit-transform: scale(0.75);
	-moz-transform: scale(0.75);
	transform: scale(0.75);
}

.x10 {
	-webkit-animation: animateCloud 12s linear infinite;
	-moz-animation: animateCloud 12s linear infinite;
	animation: animateCloud 12s linear infinite;
	
	-webkit-transform: scale(0.60);
	-moz-transform: scale(0.60);
	transform: scale(0.50);
    z-index: 1;
}

.x11 {
	-webkit-animation: animateCloud 10s linear infinite;
	-moz-animation: animateCloud 10s linear infinite;
	animation: animateCloud 10s linear infinite;
	
	-webkit-transform: scale(0.28);
	-moz-transform: scale(0.28);
	transform: scale(0.28);
    z-index: 1;
}

.x12 {
	-webkit-animation: animateCloud 15s linear infinite;
	-moz-animation: animateCloud 15s linear infinite;
	animation: animateCloud 15s linear infinite;
	
	-webkit-transform: scale(0.70);
	-moz-transform: scale(0.70);
	transform: scale(0.70);
    z-index: 1;
}

.x13 {
	-webkit-animation: animateCloud 22s linear infinite;
	-moz-animation: animateCloud 22s linear infinite;
	animation: animateCloud 22s linear infinite;
	
	-webkit-transform: scale(0.55);
	-moz-transform: scale(0.55);
	transform: scale(0.55);
    z-index: 1;
}

.x14 {
	-webkit-animation: animateCloud 26s linear infinite;
	-moz-animation: animateCloud 26s linear infinite;
	animation: animateCloud 26s linear infinite;
	
	-webkit-transform: scale(0.53);
	-moz-transform: scale(0.53);
	transform: scale(0.53);
    z-index: 1;
}

.x15 {
	-webkit-animation: animateCloud 27s linear infinite;
	-moz-animation: animateCloud 27s linear infinite;
	animation: animateCloud 27s linear infinite;
	
	-webkit-transform: scale(0.33);
	-moz-transform: scale(0.33);
	transform: scale(0.33);
    z-index: 1;
}

/* OBJECTS */

.cloud {
	background: #fff;
	background: -moz-linear-gradient(top,  #fff 5%, #f1f1f1 100%);
	background: -webkit-gradient(linear, left top, left bottom, color-stop(5%,#fff), color-stop(100%,#f1f1f1));
	background: -webkit-linear-gradient(top,  #fff 5%,#f1f1f1 100%);
	background: -o-linear-gradient(top,  #fff 5%,#f1f1f1 100%);
	background: -ms-linear-gradient(top,  #fff 5%,#f1f1f1 100%);
	background: linear-gradient(top,  #fff 5%,#f1f1f1 100%);
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fff', endColorstr='#f1f1f1',GradientType=0 );
	
	-webkit-border-radius: 100px;
	-moz-border-radius: 100px;
	border-radius: 100px;
	
	-webkit-box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
	-moz-box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);
	box-shadow: 0 8px 5px rgba(0, 0, 0, 0.1);

	height: 120px;
	position: relative;
	width: 350px;
}

.cloud:after, .cloud:before {
    background: #fff;
	content: '';
	position: absolute;
	z-indeX: -1;
}

.cloud:after {
	-webkit-border-radius: 100px;
	-moz-border-radius: 100px;
	border-radius: 100px;

	height: 100px;
	left: 50px;
	top: -50px;
	width: 100px;
}

.cloud:before {
	-webkit-border-radius: 200px;
	-moz-border-radius: 200px;
	border-radius: 200px;

	width: 180px;
	height: 180px;
	right: 50px;
	top: -90px;
}
</style>

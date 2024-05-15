<template>
<div style="position: fixed;top: 0;left:0;width: 100svw;height: 100svh;z-index: 100;">
    <div id="loading">
        <div class="inner">
            <div class="loading_effect3">
                <div class="object" id="object_four"></div>
                <div class="object" id="object_three"></div>
                <div class="object" id="object_two"></div>
                <div class="object" id="object_one"></div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'LoadingVue',
}
</script>

<style>
#loading {
    background-color: #fff;
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 9999;
    left: 0;
}

#loading .inner {
    width: 100%;
    height: 100%;
    position: relative;
}

.loading_effect {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 150px;
    margin-top: -80px;
    margin-left: -50px;
}

.loading_effect .object {
    width: 20px;
    height: 20px;
    background-color: #deb666;
    float: left;
    margin-right: 20px;
    margin-top: 65px;
    border-radius: 50% 50% 50% 50%;
}

.loading_effect #object_one {
    -webkit-animation: object_one 1.5s infinite;
    animation: object_one 1.5s infinite;
}

.loading_effect #object_two {
    -webkit-animation: object_two 1.5s infinite;
    animation: object_two 1.5s infinite;
    -webkit-animation-delay: 0.25s;
    animation-delay: 0.25s;
}

.loading_effect #object_three {
    -webkit-animation: object_three 1.5s infinite;
    animation: object_three 1.5s infinite;
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
}

@-webkit-keyframes object_one {
    75% {
        -webkit-transform: scale(0);
    }
}

@keyframes object_one {
    75% {
        transform: scale(0);
        -webkit-transform: scale(0);
    }
}

@-webkit-keyframes object_two {
    75% {
        -webkit-transform: scale(0);
    }
}

@keyframes object_two {
    75% {
        transform: scale(0);
        -webkit-transform: scale(0);
    }
}

@-webkit-keyframes object_three {
    75% {
        -webkit-transform: scale(0);
    }
}

@keyframes object_three {
    75% {
        transform: scale(0);
        -webkit-transform: scale(0);
    }
}

.loading_effect2 {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 50px;
    width: 300px;
    margin-top: -25px;
    margin-left: -150px;
}

.loading_effect2 .object {
    width: 18px;
    height: 18px;
    background: #deb666;
    float: left;
    margin-top: 15px;
    margin-right: 15px;
    border-radius: 50% 50% 50% 50%;
    -webkit-animation: loading_effect2 1s infinite;
    animation: loading_effect2 1s infinite;
}

.loading_effect2 .object:last-child {
    margin-right: 0px;
}

.loading_effect2 .object:nth-child(9) {
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
}

.loading_effect2 .object:nth-child(8) {
    -webkit-animation-delay: 0.8s;
    animation-delay: 0.8s;
}

.loading_effect2 .object:nth-child(7) {
    -webkit-animation-delay: 0.7s;
    animation-delay: 0.7s;
}

.loading_effect2 .object:nth-child(6) {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
}

.loading_effect2 .object:nth-child(5) {
    -webkit-animation-delay: 0.5s;
    animation-delay: 0.5s;
}

.loading_effect2 .object:nth-child(4) {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
}

.loading_effect2 .object:nth-child(3) {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
}

.loading_effect2 .object:nth-child(2) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
}

@-webkit-keyframes loading_effect2 {
    50% {
        -webkit-transform: translate(0, -50px);
        transform: translate(0, -50px);
    }
}

@keyframes loading_effect2 {
    50% {
        -webkit-transform: translate(0, -50px);
        transform: translate(0, -50px);
    }
}

.loading_effect3 {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 200px;
    width: 200px;
    margin-top: -100px;
    margin-left: -100px;
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
}

.loading_effect3 .object {
    border-radius: 50% 50% 50% 50%;
    position: absolute;
    border-top: 5px solid #deb666;
    border-bottom: 5px solid transparent;
    border-left: 5px solid #deb666;
    border-right: 5px solid transparent;
    -webkit-animation: loading_effect3 2s infinite;
    animation: loading_effect3 2s infinite;
}

.loading_effect3 #object_one {
    left: 75px;
    top: 75px;
    width: 50px;
    height: 50px;
}

.loading_effect3 #object_two {
    left: 65px;
    top: 65px;
    width: 70px;
    height: 70px;
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
}

.loading_effect3 #object_three {
    left: 55px;
    top: 55px;
    width: 90px;
    height: 90px;
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
}

.loading_effect3 #object_four {
    left: 45px;
    top: 45px;
    width: 110px;
    height: 110px;
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
}

@-webkit-keyframes loading_effect3 {
    50% {
        -webkit-transform: rotate(360deg) scale(0.8);
        transform: rotate(360deg) scale(0.8);
    }
}

@keyframes loading_effect3 {
    50% {
        -webkit-transform: rotate(360deg) scale(0.8);
        transform: rotate(360deg) scale(0.8);
    }
}
</style>
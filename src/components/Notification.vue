<template>
    <div class="modal-container fade-in">
        <div class="notification-dialog fade-in-down"
             :class="{'bg-success': success, 'bg-gradient-orange': !success}">
            <div class="notification-body">
                <span class="notification-message color-white">
                    {{ message }}
                </span>

                <div class="white-bar" v-if="!success"></div>
                <div class="white-bar" v-if="success"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotificationVue',
    props: ['message', 'success']
}
</script>

<style>
.notification-dialog{
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 90%;
    max-width: 300px;
    height: 100px;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 1.3px 0.5px 3.1px rgba(0, 0, 0, 0.024),
    4.2px 1.6px 10.5px rgba(0, 0, 0, 0.032),
    19px 7px 47px rgba(0, 0, 0, 0.05);
}

.notification-body{
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.notification-message{
    position: relative;
    width: 90%;
    margin: 0 auto;
    text-align: center;
    font-size: 11pt;
    font-family: 'Lexend', sans-serif;
}

.orange-bar{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 5px;
    background: var(--orange);
    z-index: 1;
    animation: progress 1s ease;
}

.white-bar{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 5px;
    background: var(--white);
    z-index: 1;
    animation: progress 1.3s ease;
}

@keyframes progress{
    0%{width: 100%;}
    100%{width: 0%;}
}
</style>
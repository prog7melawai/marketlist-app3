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
        <span class="alert-title" style="color: var(--red);">Reminder</span>
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
            :class="{'btn-danger': !success, 'btn-success': success}" 
            @click="closed">
            OK
        </button>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
    name: 'NotificationReminderVue',
    props: ['message', 'success'],
    methods: {
        closed(){
            this.$emit("onClosed", false);
        }
    }
}
</script>
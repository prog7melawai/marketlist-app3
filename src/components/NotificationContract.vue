<template>
  <div
    style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100svw;
      height: 100svh;
      z-index: 100;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    <div
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #00000039;
        z-index: 1;
      "
      @click="closePreview"
    ></div>

    <div
      style="
        position: relative;
        width: 50%;
        height: auto;
        max-height: 600px;
        background: #fff;
        border-radius: 10px;
        z-index: 10;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      "
      class="bounce-in"
    >
        <div class="notif-title">
            <div style="position: relative;height: 50px;display: flex;align-items: center;">
                <i class="ri-error-warning-fill warning-sign"></i>
                <span style="margin-left: 5px;">Warning</span>
            </div>            
        </div>

        <div class="notif-content">
            <span><span style="font-weight: 800;">We would like to bring to your attention that our contract : </span><br>
                
                <ul style="margin-top: 20px;line-height: 20px;">
                    <li style="color: var(--red);" v-for="itm in items" :key="itm.no_kontrak">
                        Contract {{ itm.no_kontrak }}, dated {{ new Date(itm.end_kontrak_date).getDate() }} {{ getMonths(new Date(itm.end_kontrak_date).getMonth()) }} {{ new Date(itm.end_kontrak_date).getFullYear() }}. Is set to expire on 
                        {{ new Date(itm.end_kontrak_date).getDate() }} {{ getMonths(new Date(itm.end_kontrak_date).getMonth()) }} {{ new Date(itm.end_kontrak_date).getFullYear() }}.
                    </li>
                </ul>

                <p style="line-height: 20px;margin-top: 20px;">As the expiration date approaches, we would like to discuss the potential for renewal or any other actions that may be necessary.</p>
            </span>
        </div>

        <i class="ri-close-line close-preview" @click="closePreview"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationContract",
  props: ["items"],
  methods: {
    closePreview() {
      this.$emit("onClosed", false);
    },
    getMonths(gmonth) {
      let month;
      switch (gmonth) {
        case 0:
          month = "January";
          break;
        case 1:
          month = "February";
          break;
        case 2:
          month = "March";
          break;
        case 3:
          month = "April";
          break;
        case 4:
          month = "May";
          break;
        case 5:
          month = "June";
          break;
        case 6:
          month = "July";
          break;
        case 7:
          month = "August";
          break;
        case 8:
          month = "September";
          break;
        case 9:
          month = "October";
          break;
        case 10:
          month = "November";
          break;
        case 11:
          month = "December";
      }

      return month;
    },
  },
};
</script>

<style>
.close-preview {
  position: absolute;
  top: 10px;
  right: 10px;
  color: var(--red);
  z-index: 20;
  font-size: 40pt;
  cursor: pointer;
}

.close-preview:hover {
  animation: wobble 0.5s ease;
}

.notif-content{
    width: 90%;
    margin: 50px 0px 20px 0px;
    font-family: 'Noto Sans Lao', sans-serif;
}

.notif-title{
    position: absolute;
    top: 5px; 
    left: 15px;
    font-size: 18pt;
    color: var(--dark);
}

.warning-sign{
    font-size: 27pt;
    color: var(--yellow);
    animation: blinking 1s ease infinite;
}


@keyframes blinking {
    0%{
        color: var(--yellow);
    }
    50%{
        color: var(--canvas);
    }
    100%{
        color: var(--yellow);
    }
}
</style>

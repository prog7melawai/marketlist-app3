<template>
  <div class="modal-container">
    <div class="overlay fade-in" id="overlay" @click="closeModal"></div>
    <div
      class="modal-dialog theme-scroll fade-in-down"
      id="modal-dialog"
      style="max-height: 330px;overflow: visible;"
    >
      <div class="btn-close" @click="closeModal">
        <i class="ri-close-fill"></i>
      </div>

      <span class="modal-title">{{ tittle }}</span>

      <div class="modal-content">
        <div class="row" style="margin-top: 20px">
          <div style="width: 100%; display: flex; flex-direction: column; gap: 15px">
            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': po.pr_no }"
              >
                PR Number
              </label>
              <input type="text" 
                style="width: 100%;
                padding: 0;"
                class="form-input" 
                v-model="po.pr_no" 
                readonly />
            </div>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': po.expired_date }"
              >
                Expired Date
              </label>
              <VueDatePicker
                  v-model="po.expired_date"
                  placeholder="Expired Date"
                  :enable-time-picker="false"
                  :min-date="new Date()"
                  :format="format"
                />
                <span class="error-form">{{ error.expired_date }}</span>
            </div>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': po.expected_date }"
              >
                Expected Date
              </label>
              <VueDatePicker
                    v-model="po.expected_date"
                    placeholder="Expected Date"
                    :enable-time-picker="false"
                    :min-date="new Date()"
                    :format="format"
                />
                <span class="error-form">{{ error.expected_date }}</span>
            </div>
          </div>
        </div>

        <button
          class="btn-block btn-success"
          style="margin-top: 10px; margin-bottom: 20px"
          @click="submitItem"
        >
          <spinner v-if="loading"></spinner>
          <span v-if="!loading">Submit</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/Spinner.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  name: "CreatePOModal",
  props: ["pr", "tittle"],
  components: {
    Spinner,
    VueDatePicker,
  },
  data() {
    return {
      loading: false,
      po: {
        pr_no: null,
        expected_date: null,
        expired_date: null,
      },
      error: {
        expected_date: null,
        expired_date: null,
      }
    };
  },
  created(){
    this.po.pr_no = this.pr
  },
  methods: {
    format(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    },
    closeModal() {
      document.getElementById("modal-dialog").classList.remove("fade-in-down");
      document.getElementById("modal-dialog").classList.add("fade-out-down");
      document.getElementById("overlay").classList.remove("fade-in");
      document.getElementById("overlay").classList.add("fade-out");
      setTimeout(() => {
        this.$emit("onClosed", false);
        document
          .getElementById("modal-dialog")
          .classList.remove("fade-out-down");
        document.getElementById("overlay").classList.remove("fade-out");
        document.getElementById("modal-dialog").classList.add("fade-in-down");
        document.getElementById("overlay").classList.add("fade-in");
      }, 500);
    },
    async submitItem() {
      let counter = 0;
      if(!this.po.expected_date) {
        this.error.expected_date = 'Please enter expected date!'
        counter += 1
      }

      if(!this.po.expired_date){
        this.error.expired_date = 'Please enter expired date!'
        counter += 1
      }

      if(counter > 0){
        return;
      }

      this.$emit("onSubmit", this.po);
    },
  },
};
</script>

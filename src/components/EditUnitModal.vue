<template>
  <div class="modal-container">
    <div class="overlay fade-in" id="overlay" @click="closeModal"></div>
    <div
      class="modal-dialog theme-scroll fade-in-down"
      id="modal-dialog"
      style="max-height: 250px"
    >
      <div class="btn-close" @click="closeModal">
        <i class="ri-close-fill"></i>
      </div>

      <span class="modal-title">{{ tittle }}</span>

      <div class="modal-content">
        <div class="row" style="margin-top: 20px">
          <div
            style="
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 15px;
            "
          >
            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': master.kd_jenis }">
                Kode
              </label>

              <input
                type="text"
                class="form-input"
                id="master-kode"
                v-model="kode_jenis"
                style="width: 96%"
                readonly />
            </div>

            <div style="position: relative">
              <label
                class="input-placeholder"
                :class="{ 'color-orange': master.nm_jenis }">
                Name
              </label>

              <input
                type="text"
                class="form-input"
                id="master-nama"
                v-model="nama_jenis"
                style="width: 96%" />
            </div>
          </div>
        </div>

        <button
          class="btn-block btn-primary"
          style="margin-top: 10px; margin-bottom: 20px"
          @click="submitMaster">
          <spinner v-if="loading"></spinner>
          <span v-if="!loading">Save</span>
        </button>

        <input type="text" :value="jenis" hidden />
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/Spinner.vue";
import axios from 'axios';

export default {
  name: "EditUnitModal",
  props: ["tittle", "url", "master"],
  components: {
    Spinner,
  },
  data() {
    return {
      loading: false,
      body: {},
      authToken: null,
      nama_jenis: null,
      kode_jenis: null,
    };
  },
  created(){
    this.kode_jenis = this.master.kd_jenis
    this.nama_jenis = this.master.nm_jenis
    this.authToken = this.$store.getters.GET_AUTH_TOKEN
  },
  methods: {
    closeModal() {
      document.getElementById("modal-dialog").classList.remove("fade-in-down");
      document.getElementById("modal-dialog").classList.add("fade-out-down");
      document.getElementById("overlay").classList.remove("fade-in");
      document.getElementById("overlay").classList.add("fade-out");
      setTimeout(() => {
        this.$emit("closed", false);
        document
          .getElementById("modal-dialog")
          .classList.remove("fade-out-down");
        document.getElementById("overlay").classList.remove("fade-out");
        document.getElementById("modal-dialog").classList.add("fade-in-down");
        document.getElementById("overlay").classList.add("fade-in");
      }, 500);
    },
    async submitMaster() {
      try {
        this.loading = true
        this.body = {
          kd_jenis: this.kode_jenis,
          nm_jenis: this.nama_jenis
        }

        console.log()
        const { data } = await axios.put(`/masbarjenis/${this.authToken}`, this.body);

        this.$emit('onResolve', data)
        this.loading = false
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

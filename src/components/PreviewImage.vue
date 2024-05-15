<template>
  <div style="position: fixed;top: 0;left: 0;width: 100svw;height: 100svh;z-index: 100;display: flex;justify-content: center;align-items: center;">
    <div style="position: absolute;top:0;left: 0;width: 100%;height: 100%;background: #00000039;z-index: 1;" @click="closePreview"></div>

    <div style="position: relative;width: 50%;height: 80%;background: #fff;border-radius: 10px;z-index: 10;overflow: hidden;" class="bounce-in">
        <i class="ri-close-line close-preview" @click="closePreview"></i>
        <img :src="source" :alt="src" style="width: 100%;height: 100%;object-fit: contain;z-index: 11;">
    </div>
  </div>
</template>

<script>
export default {
    name: 'ImagePreview',
    props: ['source'],
    methods: {
        closePreview(){
            this.$emit('onClosed', false);
        }
    }
}
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

.close-preview:hover{
    animation: wobble .5s ease;
}
</style>
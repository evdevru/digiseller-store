<template>
  <t-modal ref="modal" name="video" @before-open="onBeforeOpen">
    <div class="video-container">
      <iframe
        class="video-iframe"
        :src="`https://www.youtube.com/embed/${youtube}`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </t-modal>
</template>

<script>
export default {
  data() {
    return {
      youtube: '',
    }
  },
  methods: {
    onBeforeOpen({ params }) {
      this.youtube = params.video
    },
  },
}
</script>

<style>
.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
}
.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>

<template>
  <client-only placeholder="Await loading">
    <FilePond
      ref="filepond"
      v-model="files"
      name="file"
      :class="{ 'filepond--grid': maxFiles > 1 }"
      :max-files="maxFiles"
      :allow-multiple="maxFiles > 1"
      :label-idle="placeholder"
      :accepted-file-types="acceptedFiles"
      :server="{
        fetch: null,
        process: null,
        revert: null,
        restore: null,
        load: null,
      }"
      @init="handleFilePondInit"
      @updatefiles="handleFilePondUpdate"
    />
  </client-only>
</template>

<script>
import vueFilePond from 'vue-filepond'
// Import FilePond styles
import 'filepond/dist/filepond.min.css'
// Import FilePond plugins
// Please note that you need to install these plugins separately
// Import image preview plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
)
export default {
  name: 'Filepond',
  components: { FilePond },
  props: {
    maxFiles: {
      type: Number,
      default: 1,
    },
    placeholder: {
      type: String,
      default: () => 'Выберите иконку или перенесите',
    },
    acceptedFiles: {
      type: String,
      default: () => 'image/*',
    },
    initFiles: {
      required: false,
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Array],
      default: null,
    },
  },
  data() {
    return {
      files: this.value,
    }
  },
  methods: {
    handleFilePondInit() {
      if (this.initFiles.length && this.initFiles[0]) {
        this.initFiles.forEach((file) => {
          this.$refs.filepond.addFile(file)
        })
      }
    },
    handleFilePondUpdate(files) {
      const sendFiles = files.length
        ? files.map((file) => new File([file.file], file.file.name))
        : {}
      this.$emit('input', sendFiles.length ? sendFiles : null)
    },
    addFile(url) {
      this.$refs.filepond.addFile(url)
    },
    reset() {
      if (!this.value) return
      const len = this.value.length
      for (let i = 0; i < len; i++) {
        this.$refs.filepond.removeFile(i)
      }
    },
  },
}
</script>

<style lang="scss">
.filepond {
  &--drip {
    opacity: 1 !important;
    cursor: pointer;
    @apply rounded-xl shadow bg-gray-100;
  }
  &--credits {
    display: none;
  }
  &--root {
    margin-bottom: 0 !important;
    font-family: 'Gilroy' !important;
  }
  &--drop-label {
    cursor: pointer;
  }
  &--panel-root {
    background: transparent !important;
  }
}

.filepond--grid {
  @media (min-width: 30em) {
    .filepond--item {
      width: calc(50% - 0.5em);
    }
  }

  @media (min-width: 50em) {
    .filepond--item {
      width: calc(33.33% - 0.5em);
    }
  }
}
</style>

<template>
  <client-only>
    <div class="text-black">
      <ckeditor
        v-model="text"
        :value="editorContent"
        :editor="editor"
        :config="editorConfig"
        @input="$emit('input', $event)"
      />
    </div>
  </client-only>
</template>

<script>
let CkEditor
let Editor
if (process.client) {
  require('@ckeditor/ckeditor5-build-classic/build/translations/ru')
  CkEditor = require('@ckeditor/ckeditor5-vue2')
  Editor = require('@ckeditor/ckeditor5-build-classic')
} else {
  // eslint-disable-next-line no-unused-vars
  CkEditor = { component: { template: '<div></div>' } }
}
export default {
  components: {
    ckeditor: CkEditor.component,
  },
  props: {
    value: {
      type: String,
      default: () => '',
    },
    placeholder: {
      type: String,
      default: 'Заполните описание',
    },
  },
  data() {
    return {
      text: '',
      editor: null,
      editorConfig: {
        language: 'ru',
        placeholder: this.placeholder,
        extraAllowedContent: 'attention(*) delivery(*)',
      },
      editorContent: '',
    }
  },
  watch: {
    value(val) {
      this.text = val
    },
  },
  beforeMount() {
    this.editor = Editor
    this.text = this.value
  },
}
</script>

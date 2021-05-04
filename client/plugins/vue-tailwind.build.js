import Vue from 'vue'
import VueTailwind from 'vue-tailwind'

import {
  TInput,
  TButton,
  TRadio,
  TTable,
  TCheckbox,
  TDropdown,
  TModal,
  TTextarea,
  TPagination,
} from 'vue-tailwind/dist/components'

const settings = {
  // Use the following syntax
  // {component-name}: {
  //   component: {importedComponentObject},
  //   props: {
  //     {propToOverride}: {newDefaultValue}
  //     {propToOverride2}: {newDefaultValue2}
  //   }
  // }
  't-input': {
    component: TInput,
    props: {
      fixedClasses:
        'block w-full px-3 py-2 transition duration-300 ease-in-out rounded-full focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
      classes:
        'text-black placeholder-gray-200 bg-gray-100 focus:border-blue-200 ',
      variants: {
        danger: 'border-red-300 bg-red-50 placeholder-red-200 text-red-900',
        success:
          'border-green-300 bg-green-50 placeholder-gray-400 text-green-900',
      },
    },
  },
  't-text': {
    component: TInput,
    props: {
      fixedClasses:
        'block w-full px-3 py-2 transition duration-300 ease-in-out rounded-full focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
      classes:
        'text-black placeholder-gray-200 bg-gray-100 focus:border-blue-200 ',
      variants: {
        danger: 'border-red-300 bg-red-50 placeholder-red-200 text-red-900',
        success:
          'border-green-300 bg-green-50 placeholder-gray-400 text-green-900',
      },
    },
  },
  't-button': {
    component: TButton,
    props: {
      fixedClasses:
        'block px-4 py-1.5 transition duration-300 ease-in-out focus:border-blue-200 rounded-full focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
      classes:
        'text-white font-semibold bg-gradient-to-b from-blue-100 to-blue-200',
      variants: {
        secondary:
          'text-gray-800 bg-white border border-gray-300 shadow-sm hover:text-gray-600',
        error:
          'text-white bg-red-500 border border-transparent rounded shadow-sm hover:bg-red-600',
        success:
          'text-white font-semibold bg-gradient-to-b from-green-100 to-green-200',
        link: 'text-blue-200 underline hover:text-blue-600',
      },
    },
  },
  't-radio': {
    component: TRadio,
    props: {
      fixedClasses:
        'transition appearance-none border-1 flex-5 border-gray-200 border-opacity-20 w-5 h-5 rounded-full shadow checked:bg-gradient-to-b checked:from-blue-100 checked:to-blue-200 checked:text-white duration-300 ease-in-out focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0  disabled:opacity-50 disabled:cursor-not-allowed',
      classes: 'text-blue-200 border-gray-300',
      variants: {
        error: 'text-red-500 border-red-300',
        success: 'text-green-500 border-green-300',
      },
    },
  },
  't-checkbox': {
    component: TCheckbox,
    props: {
      fixedClasses:
        'transition appearance-none border-1 flex-5 border-gray-200 border-opacity-20 w-5 h-5 duration-300 ease-in-out rounded shadow checked:bg-gradient-to-b checked:from-blue-100 checked:to-blue-200 checked:text-white focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed',
      classes: 'text-blue-200 border-gray-300 ',
      variants: {
        error: 'text-red-500 border-red-300',
        success: 'text-green-500 border-green-300',
      },
    },
  },
  't-textarea': {
    component: TTextarea,
    props: {
      fixedClasses:
        'block w-full px-3 py-2 transition duration-300 ease-in-out rounded focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
      classes:
        'text-black placeholder-gray-200 bg-gray-100 focus:border-blue-200',
      variants: {
        error: 'text-red-500 border-red-300',
        success: 'text-green-500 border-green-300',
      },
    },
  },
  't-table': {
    component: TTable,
    props: {
      classes: {
        table:
          'min-w-full divide-y divide-gray-100 rounded-xl overflow-hidden shadow',
        thead: '',
        theadTr: '',
        theadTh: 'px-3 py-2 font-semibold text-left bg-gray-100',
        tbody: 'bg-white divide-y divide-gray-100',
        tr: '',
        td: 'px-3 py-2 whitespace-no-wrap',
        tfoot: '',
        tfootTr: '',
        tfootTd: '',
      },
      variants: {
        thin: {
          td: 'p-1 whitespace-no-wrap text-sm',
          theadTh: 'p-1 font-semibold text-left bg-gray-100 border-b text-sm',
        },
      },
    },
  },
  't-dropdown': {
    component: TDropdown,
    props: {
      fixedClasses: {
        button:
          'flex items-center font-semibold text-white block px-4 py-1 transition duration-300 ease-in-out border border-transparent rounded-2xl shadow focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
        wrapper: 'inline-flex flex-col',
        dropdownWrapper: 'relative z-10',
        dropdown:
          'origin-top-left absolute left-0 w-full rounded-2xl shadow mt-1.5',
        enterClass: 'opacity-0 scale-95',
        enterActiveClass: 'transition transform ease-out duration-300',
        enterToClass: 'opacity-100 scale-100',
        leaveClass: 'opacity-100 scale-100',
        leaveActiveClass: 'transition transform ease-in duration-75',
        leaveToClass: 'opacity-0 scale-95',
      },
      classes: {
        button: 'bg-gradient-to-b from-blue-100 to-blue-200',
        dropdown: 'bg-white',
      },
      variants: {
        danger: {
          button: 'bg-red-500 hover:bg-red-600',
          dropdown: 'bg-red-50',
        },
      },
    },
  },
  't-modal': {
    component: TModal,
    props: {
      fixedClasses: {
        overlay:
          'z-40  overflow-auto scrolling-touch left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-opacity-50',
        wrapper: 'relative mx-auto w-full z-50 max-w-3xl px-3 py-12',
        modal: 'overflow-visible relative  rounded-2xl',
        body: 'p-3',
        header: 'border-b p-3 rounded-t',
        footer: ' p-3 rounded-b-2xl',
        close:
          'flex items-center justify-center rounded-full absolute right-0 top-0 -m-3 h-8 w-8 transition duration-300 ease-in-out focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50',
      },
      classes: {
        overlay: 'bg-black',
        wrapper: '',
        modal: 'bg-white shadow',
        body: 'p-3',
        header: 'border-gray-100',
        footer: 'bg-gray-100',
        close: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        closeIcon: 'fill-current h-4 w-4',
        overlayEnterClass: 'opacity-0',
        overlayEnterActiveClass: 'transition ease-out duration-300',
        overlayEnterToClass: 'opacity-100',
        overlayLeaveClass: 'opacity-100',
        overlayLeaveActiveClass: 'transition ease-in duration-75',
        overlayLeaveToClass: 'opacity-0',
        enterClass: '',
        enterActiveClass: '',
        enterToClass: '',
        leaveClass: '',
        leaveActiveClass: '',
        leaveToClass: '',
      },
      variants: {
        danger: {
          overlay: 'bg-red-100',
          header: 'border-red-50 text-red-700',
          close:
            'bg-red-50 text-red-700 hover:bg-red-200 border-red-100 border',
          modal: 'bg-white border border-red-100 shadow-lg',
          footer: 'bg-red-50',
        },
      },
    },
  },
  't-pagination': {
    component: TPagination,
    props: {
      classes: {
        wrapper: 'table border-collapse text-center',
        element:
          'w-8 h-8 border border-gray-200 table-cell hover:border-blue-100',
        activeElement:
          'w-8 h-8 border border-gray-200 border-blue-200 table-cell hover:border-blue-100',
        disabledElement: 'w-8 h-8 border border-gray-200 table-cell',
        ellipsisElement: 'w-8 h-8 border border-gray-200 hidden md:table-cell',
        activeButton:
          'bg-blue-200 w-full h-full text-white hover:bg-blue-600 transition duration-300 ease-in-out focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50',
        disabledButton:
          'opacity-25 w-full h-full cursor-not-allowed transition duration-300 ease-in-out',
        button:
          'hover:bg-blue-100 w-full h-full transition duration-300 ease-in-out focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50',
        ellipsis: '',
      },
      variants: {
        rounded: {
          wrapper: 'text-center flex space-x-1',
          element: 'w-8 h-8 rounded-full',
          activeElement: 'w-8 h-8 rounded-full',
          disabledElement: 'w-8 h-8 rounded-full',
          ellipsisElement: 'w-8 h-8 rounded-full hidden md:inline',
          activeButton:
            'border border-blue-200 bg-gradient-to-tr from-blue-200 to-blue-100 w-full h-full rounded-full text-white hover:bg-blue-100 transition duration-300 ease-in-out focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50',
          disabledButton:
            'border border-gray-200  opacity-25 w-full h-full rounded-full cursor-not-allowed transition duration-300 ease-in-out',
          button:
            'border border-gray-200 border-opacity-30 hover:bg-blue-100 hover:text-white hover:border-blue-100 rounded-full w-full h-full transition duration-300 ease-in-out focus:ring-2 focus:ring-blue-200 focus:outline-none focus:ring-opacity-50',
          ellipsis: '',
        },
      },
    },
  },
}

Vue.use(VueTailwind, settings)

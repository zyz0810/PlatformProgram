Component({
  data: {
    show: false
  },
  methods: {
    close() {
      this.setData({
        show: false
      })
    },
    show() {
      this.setData({
        show: true
      })
    },
    toggle() {
      this.setData({
        show: !this.data.show
      })
    }
  }
})

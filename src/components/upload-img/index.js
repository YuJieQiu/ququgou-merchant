Component({
  properties: {
    maxLength: {
      type: Int32Array,
      value: 3
    },
    listData: {
      type: Array,
      value: []
    },
    requesting: Boolean,
    end: Boolean,
    emptyUrl: {
      type: String,
      value: '/assets/images/empty/empty.svg'
    },
    emptyText: {
      type: String,
      value: '暂时啥都没有哦~'
    }
  },
  created() {}
})

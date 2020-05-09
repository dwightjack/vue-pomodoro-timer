<script lang="ts">
import Vue from 'vue';
import VueTypes from 'vue-types';

export default Vue.extend({
  functional: true,
  props: {
    tag: VueTypes.string.def('div'),
    centered: VueTypes.bool.def(false),
    space: VueTypes.oneOfType([String, Number]).def(4),
  },
  render(h, { props, data, children }) {
    const classes = [
      'c-layout-inline',
      data.class,
      {
        'justify-center': props.centered,
        [`gap-${props.space}`]: props.space,
      },
    ];
    return h(
      props.tag,
      {
        ...data,
        class: classes,
      },
      children,
    );
  },
});
</script>
<style scoped>
.c-layout-inline {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  grid-auto-rows: auto;
  justify-items: start;
}
</style>

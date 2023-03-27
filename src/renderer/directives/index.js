import MouseDragDirective from "./mouseDrag";

export default {
  install(Vue) {
    Vue.directive("mouse-drag", MouseDragDirective);
  },
};

<template>
  <div class="el-picture-preview" :id="id" @mouseout="mouseOutOrUp" :style="{width: width, height: height}">
    <div class="el-picture-preview__content" @mousemove="mousemove" @mouseup="mouseOutOrUp" @mousewheel="mouseScale" :style="{backgroundColor: backgroundColor}">
      <div class="el-picture-preview__img" ref="handleImg" :style="styleData">
          <img @mousedown="mousedown" :src="url" draggable="false">
      </div>
      <div class="el-picture-preview__button" :style="{textAlign: buttonAlign, bottom: fixed ? '0px' : '-30px'}">
          <i
            v-for="(btn, key) in btnList"
            :key="id + '__button' + key"
            @click="btn.fun(btn.param)"
            :class="['el-picture-preview__btns', btn.class]"
            :style="{color: buttonColor, borderColor: buttonColor}"
            ></i>
      </div>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css';
export default {
  name: 'el-picture-preview',
  props: {
    url: String,
    height: {
      type: String,
      default: '400px'
    },
    width: {
      type: String,
      default: '100%'
    },
    buttonAlign: {
      type: String,
      default: 'center'
    },
    buttonColor: {
      type: String,
      default: '#606266'
    },
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    fixed: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: 'enlarge, lessen, reset, left, right'
    },
    step: {
      type: String,
      default: '20'
    },
    mousewheel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      styleData: {
        width: 100 + '%',
        height: 100 + '%',
        marginLeft: '0',
        marginTop: '0',
        transform: 'translate(-50%,-50%) rotate(0deg)',
        backgroundColor: this.backgroundColor,
        position: 'absolute',
        top: 50 + '%',
        left: 50 + '%',
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.1s linear',
      },
      startXY: {
        x: 0,
        y: 0,
        flag: false
      },
      initial: 100,
      lastOne: { x: 0, y: 0 },
      saveOne: { x: 0, y: 0 },
      rotated: 0,
      btnList: []
    };
  },
  computed: {
    id() {
      return `el-picture-preview-${Math.floor(Math.random() * 10000)}`;
    }
  },
  mounted() {
    // 配置按钮列表
    var layout = this.layout;
    const TEMPLATE_MAP = {
      enlarge: {
        class: 'el-icon-zoom-in',
        fun: this.enlarge,
        param: Number(this.step)
      },
      lessen: {
        class: 'el-icon-zoom-out',
        fun: this.lessen,
        param: Number(this.step)
      },
      reset: {
        class: 'el-icon-refresh',
        fun: this.reset,
        param: null
      },
      left: {
        class: 'el-icon-refresh-left',
        fun: this.rotating,
        param: -90
      },
      right: {
        class: 'el-icon-refresh-right',
        fun: this.rotating,
        param: 90
      }
    };
    var components = layout.split(',').map((item) => item.trim());
    this.btnList = this.btnList || [];
    components.forEach(compo => {
      this.btnList.push(TEMPLATE_MAP[compo]);
    });

    if (this.mousewheel) {
      var dom = document.getElementById(this.id);
      // 防止滚轮事件在放大缩小图片时滚动页面
      navigator.userAgent.indexOf('Firefox') !== -1 ? dom.addEventListener('DOMMouseScroll', MouseWheel, false) : (dom.onmousewheel = MouseWheel);
    }

    // 防止冒泡与默认行为
    function MouseWheel(e) {
      e = e || window.event;
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      };
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      };
    }
  },
  // template: `
  // <div class="el-picture-preview" :id="id" @mouseout="mouseOutOrUp" :style="{width: width, height: height}">
  //   <div class="el-picture-preview__content" @mousemove="mousemove" @mouseup="mouseOutOrUp" @mousewheel="mouseScale" :style="{backgroundColor: backgroundColor, position: relative, width: 100%, height: 100%, overflow: hidden}">
  //     <div class="el-picture-preview__img" ref="handleImg" :style="styleData">
  //         <img @mousedown="mousedown" :src="url" draggable="false" :style="{margin: 0 auto, width: auto, display: block, cursor: pointer, height: 100%, line-height: 0, font-size: 0}">
  //     </div>
  //     <div class="el-picture-preview__button" :style="{textAlign: buttonAlign, bottom: -30px, width: 100%, position: absolute, height: 30px, background-color: rgba(255, 255, 255, .5), line-height: 30px, transition: all 0.3s linear, padding: 0 10px, box-sizing: border-box, vertical-align: middle, z-index: 999999}">
  //         <i
  //           v-for="(btn, key) in btnList"
  //           :key="id + '__button' + key"
  //           @click="btn.fun(btn.param)"
  //           :class="['el-picture-preview__btns', btn.class]"
  //           :style="{color: buttonColor, borderColor: buttonColor, font-size: 16px, cursor: pointer, height: 22px, margin: 4px 4px, line-height: 20px, width: 22px, border: 1px solid, border-radius: 50%, text-align: center}"
  //           ></i>
  //     </div>
  //   </div>
  // </div>
  // `,
  methods: {
    // 放大
    enlarge(step) {
      this.initial = this.initial + step;
      this.styleData.width = this.initial + '%';
      this.styleData.height = this.initial + '%';
    },
    // 缩小
    lessen(step) {
      this.initial = this.initial - step;
      if (this.initial < 20) {
        this.initial = 20;
      }
      this.styleData.width = this.initial + '%';
      this.styleData.height = this.initial + '%';
    },
    // 滚轮放大缩小
    mouseScale(e) {
      if (!this.mousewheel) return;
      if (e.wheelDeltaY > 0) {
        this.enlarge(10);
      } else if (e.wheelDeltaY < 0) {
        this.lessen(10);
      }
    },
    // 旋转
    rotating(deg) {
      this.rotated = this.rotated + deg;
      this.styleData.transform = 'translate(-50%,-50%) rotate(' + this.rotated + 'deg)';
    },
    // 拖动开始
    mousedown(e) {
      let xy = {};
      xy.x = e.clientX;
      xy.y = e.clientY;
      this.startXY = xy;
      this.startXY.flag = true;
    },
    // 拖动
    mousemove(e) {
      if (this.startXY.flag) {
        let midX = e.clientX - this.startXY.x;
        let midY = e.clientY - this.startXY.y;
        this.styleData.marginLeft = this.saveOne.x + midX + 'px';
        this.styleData.marginTop = this.saveOne.y + midY + 'px';
        this.lastOne = {
          x: e.clientX,
          y: e.clientY,
          endX: this.saveOne.x + midX || 0,
          endY: this.saveOne.y + midY || 0
        };
      }
    },
    // 拖动结束
    mouseOutOrUp(e) {
      if (this.startXY.flag) {
        this.styleData.marginLeft = this.lastOne.endX + 'px';
        this.styleData.marginTop = this.lastOne.endY + 'px';
        this.saveOne.x = this.lastOne.endX;
        this.saveOne.y = this.lastOne.endY;
      }
      this.startXY.flag = false;
    },
    // 复位
    reset() {
      let sty = {
        width: 100 + '%',
        height: 100 + '%',
        marginLeft: '0',
        marginTop: '0',
        transform: 'translate(-50%,-50%) rotate(0deg)'
      };
      this.styleData = sty;
      this.saveOne.x = 0;
      this.saveOne.y = 0;
      this.lastOne.endX = 0;
      this.lastOne.endY = 0;
      this.initial = 100;
      this.rotated = 0;
    }
  },
};
</script>
<style>
.el-picture-preview__content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.el-picture-preview__img {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.1s linear;
    -moz-transition: transform 0.1s linear;
    -webkit-transition: transform 0.1s linear;
    -o-transition: transform 0.1s linear;
}
img {
    margin: 0 auto;
    width: auto;
    display: block;
    cursor: pointer;
    height: 100%;
    line-height: 0;
    font-size: 0;
}
.el-picture-preview__button {
    width: 100%;
    position: absolute;
    bottom: -30px;
    height: 30px;
    background-color: rgba(255, 255, 255, .5);
    line-height: 30px;
    transition: all 0.3s linear;
    padding: 0 10px;
    box-sizing: border-box;
    vertical-align: middle;
    z-index: 999999;
    
}
.el-picture-preview__btns {
    font-size: 16px;
    cursor: pointer;
    height: 22px;
    margin: 4px 4px;
    line-height: 20px;
    width: 22px;
    border: 1px solid;
    border-radius: 50%;
    text-align: center;
}
.el-picture-preview__content:hover .el-picture-preview__button {
    bottom: 0px !important;
}
</style>
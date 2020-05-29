import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import MyButton from './MyButton';
import ElPicturePreview from './PicturePreview';

export default {
  title: 'Button',
  component: MyButton,
};

export const Text = () => ({
  components: { MyButton },
  template: '<my-button @click="action">Hello Button</my-button>',
  methods: { action: action('clicked') },
});

export const Jsx = () => ({
  components: { MyButton },
  render(h) {
    return <my-button onClick={this.action}>With JSX</my-button>;
  },
  methods: { action: linkTo('clicked') },
});

export const Emoji = () => ({
  components: { MyButton },
  template: '<my-button @click="action">😀 😎 👍 💯</my-button>',
  methods: { action: action('clicked') },
});

export const PicturePreview = () => ({
  components: { ElPicturePreview },
  template: '<el-picture-preview url="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg"></el-picture-preview>',
});

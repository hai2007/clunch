# [clunch - 🎨 渐进的前端交互式图形框架](https://hai2007.gitee.io/clunch/)

<p align="center"><a href="https://hai2007.gitee.io/clunch/" target="_blank">
<img width="400" src="https://hai2007.gitee.io/clunch/src/assets/clunch.png" alt="clunch logo"></a></p>

<p align="center">
  <a href="https://hai2007.gitee.io/npm-downloads?interval=7&packages=clunch"><img src="https://img.shields.io/npm/dm/clunch.svg" alt="downloads"></a>
  <a href="https://packagephobia.now.sh/result?p=clunch"><img src="https://packagephobia.now.sh/badge?p=clunch" alt="install size"></a>
  <a href="https://www.jsdelivr.com/package/npm/clunch"><img src="https://data.jsdelivr.com/v1/package/npm/clunch/badge" alt="CDN"></a>
  <a href="https://www.npmjs.com/package/clunch"><img src="https://img.shields.io/npm/v/clunch.svg" alt="Version"></a>
  <a href="https://github.com/hai2007/clunch/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/clunch.svg" alt="License"></a>
    <a href="https://github.com/hai2007/clunch" target='_blank'><img alt="GitHub repo stars" src="https://img.shields.io/github/stars/hai2007/clunch?style=social"></a>
</p>

<h2 align="center" style='padding:10px 0 20px 0;color:red;'>🚀 数据驱动绘图</h2>

如果你可以正确的对业务数据进行修改，你就可以编辑一个交互的拖拽web应用。数据驱动绘图的设计，使得你只需把精力放在你的业务数据处理上，它负责绘图等比较难搞的部分。

<p align="center"><a href="https://hai2007.gitee.io/clunch/#/examples/Data-Driven-Drawing" target="_blank">
<img width="400" src="https://hai2007.gitee.io/clunch/dist/Data-Driven-Drawing.png"></a></p>

上面是一个流程图，通过给每个节点和连线添加交互事件获取用户意图后，直接修改数据页面实时更新，就实现了一个简单的流程图编辑器。

<h2 align="center" style='padding:10px 0 20px 0;color:red;'>🚀 复杂图形的区域管理</h2>

只要你可以对普通标签添加交互事件，就可以处理几乎任意图形的交互事件。通过对单一标签的画布进行抽象，我们提供了区域和子区域的概念，你可以像操作标签一样操作canvas画布中的具体图形。

<p align="center"><a href="https://hai2007.gitee.io/clunch/#/examples/Regional-Management" target="_blank">
<img width="400" src="https://hai2007.gitee.io/clunch/dist/Regional-Management.png"></a></p>

上面是一份中国地图（未包括海洋等部分区域），通过c-on指令就可以给某个省添加点击事件，点击以后提示你点击了谁。

<h2 align="center" style='padding:10px 0 20px 0;color:red;'>🚀 内置差异对比和过渡动画</h2>

如果图形改变过于僵硬需要添加动画效果怎么办？clunch.js会自动启动数据改变前后差异分析，然后给出合适的过渡方案，启动过渡动画。

<p align="center"><a href="https://hai2007.gitee.io/clunch/#/examples/Transition-Animation" target="_blank">
<img width="400" src="https://hai2007.gitee.io/clunch/dist/Transition-Animation.png"></a></p>

上面的树图，点击某个结点后删除对应结点的孩子以后，树图会自动过渡成删除后的树图而不是突然改变。

<h2 align="center" style='padding:10px 0 20px 0;color:red;'>🚀 加入我们</h2>

目前clunch主要由 [你好2007](https://hai2007.gitee.io/sweethome/) 维护，当然也有来自一些使用者的 [意见](https://github.com/hai2007/clunch/issues) 和 [Pull requests](https://github.com/hai2007/clunch/pulls) 在帮忙我们不断改进和完善，在此我们表示由衷的感谢，我们会带着初心矢志不渝的坚持维护，并永远保持自由、开源、讨论和进步，期待你的加入。

## 新任务如何产生？

主要来自 [issue](https://github.com/hai2007/clunch/issues) 和前端本身的发展（可能一些新的技术等原因，催促一些改变是有意义的），如果你对未来版本有什么期望，也可以告诉我们。

当前，这也包括 [接口文档](https://hai2007.gitee.io/clunch) 和 [教程](https://hai2007.gitee.io/clunch/#/course) 等，甚至包括 [开发者社区](https://clunch-contrib.github.io/community/) ，一切围绕或和clunch相关的都可以提。

## 为什么要加入我们？

虽然通过提 [issue](https://github.com/hai2007/clunch/issues) 和 [Pull requests](https://github.com/hai2007/clunch/pulls) 也可以很好的参与贡献，不过你无法完全的融入进来，无法更全面的把控clunch的发展规划。通过加入我们成为长期稳定的贡献者，和我们保持密切的联系，这非常利于你，因为你有了一定的主动权。

加入我们并不意味着就是代码的维护，你可以选择下列一项或多项进行参与：

- 代码维护：由于新功能或一些BUG的出现，对代码进行维护和升级。
- 文档编辑：主要是接口文档和教程需要编辑，这很重要。
- 用例开发和测试：在项目的test文件夹下有一些测试，而在examples项目中维护了一些用例。
- 参与讨论：主要是讨论clunch未来如何发展，改造的方向等。

如果有意向加入我们，你可以通过提 [issue](https://github.com/hai2007/clunch/issues) 和我们取到联系，请简单说明一下情况，我们会尽快回复。

你可以查看[AUTHORS.txt](https://github.com/hai2007/clunch/blob/master/AUTHORS.txt)了解所有的贡献者。

开源协议
---------------------------------------
[MIT](https://github.com/hai2007/clunch/blob/master/LICENSE)

Copyright (c) 2018-2021 [hai2007](https://hai2007.gitee.io/sweethome/) 走一步，再走一步。

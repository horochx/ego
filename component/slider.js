// 轮播图组件
(function () {
    var template = '<div class="m-slider">\n' +
        '    <div class="slider"></div>\n' +
        '    <div class="slider"></div>\n' +
        '    <div class="slider"></div>\n' +
        '</div>';

    /**
     * 组件构造函数
     * @param {Object} option 组件配置参数
     * @param {Object} option.container 组件容器DOM节点
     * @param {Number} [option.pageIndex] 初始显示的图片下标，默认为0
     * @param {Boolean} [option.autoFlag] 是否自动播放，默认为是
     * @param {Boolean} [option.flipperFlag] 是否初始化翻页器，默认为是
     * @param {Boolean} [option.dragFlag] 是否允许拖拽，默认为是
     * @param {Array} [option.bgc] 切换图片时容器的背景色，默认为透明色
     * @constructor
     */
    function Slider(option) {
        // 将输入参数添加到对象
        App.Extend(this, option);
        // 缓存节点
        this.node = this.html2node(this._template, this.container);
        this.conveyor = this.node.getElementsByTagName('div')[0];
        this.slider = this.conveyor.getElementsByTagName('div');
        // 图片下标
        this.pageIndex = this.pageIndex || 0;
        // slider下标
        this.sliderIndex = 1;
        // 传送带相对于视口容器的下标
        this.offsetAll = this.pageIndex;
        // 自动播放开关
        this.autoFlag = this.autoFlag || true;
        // 翻页器开关
        this.flipperFlag = this.flipperFlag || true;
        // 拖拽开关
        this.dragFlag = this.dragFlag || true;
    }

    // 依据下标对坐标进行变换
    function _indexTransform() {
        this.pageIndex = this._normalIndex(this.pageIndex, this.images.length);
        var sliderIndex = this.sliderIndex = this._normalIndex(this.sliderIndex, 3);
        var offsetAll = this.offsetAll;
        var preSliderIndex = this._normalIndex(sliderIndex - 1, 3);
        var nextSliderIndex = this._normalIndex(sliderIndex + 1, 3);
        // slider 坐标变换
        this.slider[sliderIndex].style.left = (offsetAll) * 100 + '%';
        this.slider[preSliderIndex].style.left = (offsetAll - 1) * 100 + '%';
        this.slider[nextSliderIndex].style.left = (offsetAll + 1) * 100 + '%';
        // 传送带坐标变换
        this.conveyor.style.transform = 'translateX(' + (-offsetAll * 100) + '%) translateZ(0)';
        // 图片变换
        this._changeImages();
        // 添加样式标记当前展示的 slider 和图片
        this._markActive();
    }

    /**
     * 标准化下标
     * @param {Number} index 当前下标
     * @param {Number} length 下标长度
     * @returns {number}
     * @private
     */
    function _normalIndex(index, length) {
        return (index + length) % length;
    }

    // 修改slider中的图片
    function _changeImages() {
        for (var i = -1; i <= 1; i++) {
            var index = this._normalIndex(this.sliderIndex + i, 3);
            var img = this.slider[index].getElementsByTagName('img')[0];
            if (!img) {
                img = document.createElement('img');
                this.slider[index].appendChild(img);
            }
            img.src = this.images[this._normalIndex(this.pageIndex + i, this.images.length)];
        }
    }

    // 标记当前展示的slider
    function _markActive() {
        for (var i = 2; i >= 0; i--) {
            this.removeClass.call(this.slider[i], 'z-active');
        }
        this.addClass.call(this.slider[this.sliderIndex], 'z-active');
        if (this.flipperFlag) {
            for (var i = this.images.length - 1; i >= 0; i--) {
                this.removeClass.call(this.li[i], 'z-active');
            }
            this.addClass.call(this.li[this.pageIndex], 'z-active');
        }
        if (this.bgc) {
            this.node.parentNode.style.backgroundColor = this.bgc[this.pageIndex];
        }
    }

    /**
     * 启用/取消自动播放
     * @param {Boolean} flag 启用/取消
     */
    function autoPlay(flag) {
        if (flag) {
            clearInterval(this._timeID);
            this._timeID = setInterval(this.step.bind(this), 5000);
            // 鼠标进入时暂停动画，鼠标移开时恢复动画
            this.conveyor.addEventListener('mouseenter', this.autoPlay.bind(this, false));
            this.conveyor.addEventListener('mouseleave', this._dragEnd.bind(this));
        } else {
            clearInterval(this._timeID);
        }
    }

    /**
     * 顺序翻页
     * @param {Number} [num] 翻动的页码，可为1/-1，表示向后、向前翻页。默认为向后翻页
     */
    function step(num) {
        num = num || 1;
        this.pageIndex += num;
        this.sliderIndex += num;
        this.offsetAll += num;
        // 启用传送带动画
        this.conveyor.style.transitionDuration = '.5s';
        this._indexTransform();
    }

    /**
     * 图片跳转
     * @param {Number} pageIndex 待跳转的图片下标
     */
    function jump(pageIndex) {
        this.pageIndex = pageIndex;
        this.sliderIndex = this._normalIndex(pageIndex + 1, 3);
        this.offsetAll = pageIndex;
        // 传送带禁用动画
        this.conveyor.style.transitionDuration = '0s';
        this._indexTransform();
        // 清空自动播放计时
        this.autoPlay(false);
        this.autoPlay(true);
    }

    // 初始化翻页器
    function _initFlipper() {
        if (!this.flipperFlag) {
            return;
        }
        // 缓存节点
        this.ul = document.createElement('ul');
        this.node.appendChild(this.ul);
        // 添加翻页按钮
        for (var i = this.images.length - 1; i >= 0; i--) {
            var li = document.createElement('li');
            this.ul.appendChild(li);
        }
        // 缓存节点
        this.li = this.ul.getElementsByTagName('li');
        // 为组件容器添加相对定位
        this.node.style.position = 'relative';
        // 为翻页器绑定鼠标事件
        for (var i = this.li.length - 1; i >= 0; i--) {
            this.li[i].addEventListener('click', this.jump.bind(this, i));
        }
    }

    // 初始化拖拽事件
    function _initDrag() {
        if (!this.dragFlag) {
            return;
        }
        this._dragInfo = {};
        this.conveyor.addEventListener('mousedown', this._dragStart.bind(this));
        this.conveyor.addEventListener('mousemove', this._dragMove.bind(this));
        this.conveyor.addEventListener('mouseup', this._dragEnd.bind(this));
        this.conveyor.addEventListener('mouseleave', this._dragEnd.bind(this));
    }

    // 鼠标按下，拖拽开始
    function _dragStart(event) {
        // 缓存当前鼠标位置
        this._dragInfo.start = event.pageX;
    }

    // 鼠标拖动，拖拽过程
    function _dragMove(event) {
        // 如果鼠标未按下，不做任何处理
        if (!this._dragInfo.start) {
            return;
        }
        event.preventDefault();
        // 禁用动画
        this.conveyor.style.transitionDuration = '0s';
        // 修改传送带坐标
        this._dragInfo.end = event.pageX;
        this.conveyor.style.transform = 'translateX(' + ((-this.offsetAll + (this._dragInfo.end - this._dragInfo.start) / this.conveyor.offsetWidth) * 100) + '%) translateZ(0)';
    }

    // 鼠标松开，拖拽结束
    function _dragEnd(event) {
        // 如果未进行拖拽，不做任何处理
        if (!this._dragInfo.start) {
            // 恢复自动播放
            this.autoPlay(true);
            return;
        }
        event.preventDefault();
        // 缓存鼠标移动距离
        var tmp = this._dragInfo.start - this._dragInfo.end;
        // 如果移动距离大于100px，则切换图片
        if (tmp >= 100) {
            this.step();
        }
        else if (tmp <= -100) {
            this.step(-1);
        }
        else {
            this.conveyor.style.transitionDuration = '.2s';
            this._indexTransform();
        }
        // 清空缓存坐标
        this._dragInfo.start = null;
    }

    // 初始化组件，绑定鼠标事件
    function init() {
        // 初始化翻页器
        this._initFlipper();
        // 修改组件容器样式，隐藏多余视图
        this.node.style.overflow = 'hidden';
        // 初始化自动播放
        this._indexTransform();
        this.autoPlay(this.autoFlag);
        // 初始化拖拽
        this._initDrag();
    }

    // 扩展Slider原型
    App.Extend(Slider.prototype, App.ChangeClass, App.HTML2Node, {
        _template: template,
        _indexTransform: _indexTransform,
        _normalIndex: _normalIndex,
        _changeImages: _changeImages,
        _markActive: _markActive,
        _initFlipper: _initFlipper,
        _initDrag: _initDrag,
        _dragStart: _dragStart,
        _dragMove: _dragMove,
        _dragEnd: _dragEnd,
        autoPlay: autoPlay,
        step: step,
        jump: jump,
        init: init
    });
    // 暴露接口
    window.App.Slider = Slider;
})();
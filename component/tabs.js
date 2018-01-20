// tabs导航栏组件
(function () {
    'use strict';
    // html 模板
    var TEMPLATE = '<div class="m-tabs">\n' +
        '    <ul>\n' +
        '<%for(var i = 0;i<this.length;i++){%>' +
        '        <li><a href="<%this[i].url%>" data-index="<%i%>"><%this[i].item%></a></li>\n' +
        '<%}%>' +
        '    </ul>\n' +
        '    <div class="track">\n' +
        '        <div class="slider"></div>\n' +
        '    </div>\n' +
        '</div>';

    /**
     * 组件构造函数
     * @param {Object} option 组件配置参数
     * @param {Array} option.data 导航栏选项
     * @param {Object} option.container 组件容器DOM节点
     * @param {String} [option.template] HTML模板
     * @constructor
     */
    function Tabs(option) {
        // 将输入参数添加到对象
        App.Extend(this, option);
        // 缓存节点
        // 将模板转换为文档片段,并添加到容器
        var tmp = App.sTemplate(TEMPLATE, this.data, true);
        this.container.appendChild(tmp);
        this.ul = this.container.getElementsByTagName('ul')[0];
        this.li = this.ul.getElementsByTagName('li');
        // 滑块节点
        this.slider = this.container.getElementsByClassName('slider')[0];
    }

    /**
     * 初始化组件,绑定鼠标事件
     * @param {Number} [num] 初始选中的标签项下标，缺省值是0
     */
    function init(num) {
        // 初始化滑块下标
        this.index = num || 0;
        this._setCurrent(this.index);
        // 绑定鼠标事件
        for (var i = this.li.length - 1; i >= 0; i--) {
            var tmpnode = this.li[i].getElementsByTagName('a')[0];
            tmpnode.addEventListener('mouseenter', this._highlight.bind(this, i));
            tmpnode.addEventListener('click', this._setCurrent.bind(this, i));
            tmpnode.addEventListener('mouseleave', this._highlight.bind(this, null));
        }
    }

    /**
     * 滑块高亮
     * @param {Number} [index] 滑块对应的标签下标,缺省值是this.index
     */
    function _highlight(index) {
        var tab = this.li[index || this.index];
        this.slider.style.width = tab.offsetWidth + 'px';
        this.slider.style.left = tab.offsetLeft + 'px';
    }

    /**
     * 切换选中标签
     * @param {Number}[index] 待选中标签的下标
     */
    function _setCurrent(index) {
        this.removeClass.call(this.li[this.index], 'z-active');
        this.index = index;
        this.addClass.call(this.li[this.index], 'z-active');
        this._highlight(index);
    }

    // 扩展 Tabs 原型
    App.Extend(Tabs.prototype, App.ChangeClass, {
        init: init,
        _highlight: _highlight,
        _setCurrent: _setCurrent,
    });
    // 暴露接口
    window.App.Tabs = Tabs;
})();
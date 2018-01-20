// 搜索框组件
(function () {
    'use strict';
    // HTML模板
    var TEMPLATE = '<form class="m-search" action="/search" id="search" method="GET">\
    <input type="text" id="keyword" name="keyword" placeholder="输入搜索内容">\
    <button type="submit" class="u-button"></button>\
</form>';

    /**
     * 组件构造函数
     * @param {Object} option 组件配置参数
     * @param {Object} option.container 组件容器DOM节点
     * @constructor
     */
    function Search(option) {
        // 将输入参数添加到对象
        App.Extend(this, option);
        // 缓存节点
        var tmp = App.sTemplate(TEMPLATE, null, true);
        this.container.appendChild(tmp);
        this.form = this.container.getElementsByTagName('form')[0];
        this.input = this.form.getElementsByTagName('input')[0];
    }

    // 初始化对象、绑定事件函数
    function init() {
        this.form.addEventListener('submit', this.go.bind(this));
    }

    /**
     * 提交搜索事件函数
     * @param event
     */
    function go(event) {
        // 数据为空则取消提交
        if (this.input.value === '') {
            event.preventDefault();
        }
    }

    // 扩展Search原型
    App.Extend(Search.prototype, App.HTML2Node, {
        init: init,
        go: go,
    });
    // 暴露接口
    window.App.Search = Search;
})();
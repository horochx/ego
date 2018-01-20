// 翻页器
(function () {
    /**
     * 组件构造函数
     * @param option
     * @param option.limit 每页作品的数量
     * @param option.offset 翻页器页码的数量
     * @constructor
     */
    function Flipper(option) {
        App.Extend(this, option);
        // 缓存节点
        this.node = {};
        this.node.home = this.container.getElementsByTagName('span')[0];
        this.node.previous = this.container.getElementsByTagName('span')[1];
        this.node.next = this.container.getElementsByTagName('span')[2];
        this.node.end = this.container.getElementsByTagName('span')[3];
        this.node.ul = this.container.getElementsByTagName('ul')[0];
    }

    // 初始化组件
    function init() {
        // 初始化作品列表及翻页器
        this.index = 1;
        this.getData(1, 0, this.limit);
        // 添加鼠标点击事件
        this.container.addEventListener('click', function (ev) {
            ev.preventDefault();
            var node = ev.target;
            // 对应节点执行对应方法
            var keys = Object.keys(this.node);
            var method;
            for (var i = 0; i < keys.length; i++) {
                node === this.node[keys[i]] ? method = this.method[keys[i]] : method;
            }
            node.tagName === 'LI' ? method = this.method['li'] : method;
            if (method) {
                method.call(this, node, ev);
            }
        }.bind(this));
    }

    // 跳转至页码
    function jumpIndex(index) {
        var offset = (index - 1) * this.limit;
        this.getData(0, offset, this.limit);
    }

    // 创建节点对应方法
    function method() {
        var o = {};
        o['home'] = function () {
            if (this.total === 0) {
                return;
            }
            this.index = 1;
            this.jumpIndex(this.index);
            this.renderFlipper();
        };
        o['previous'] = function () {
            if (this.index === 1) {
                return;
            }
            this.index--;
            this.jumpIndex(this.index);
            this.renderFlipper();
        };
        o['next'] = function () {
            if (this.index === Math.ceil(this.total / this.limit)) {
                return;
            }
            this.index++;
            this.jumpIndex(this.index);
            this.renderFlipper();
        };
        o['end'] = function () {
            if (this.index === 0) {
                return;
            }
            this.index = Math.ceil(this.total / this.limit);
            this.jumpIndex(this.index);
            this.renderFlipper();
        };
        o['li'] = function (node) {
            this.index = node.textContent - 0;
            this.jumpIndex(this.index);
            this.renderFlipper();
        };
        return o;
    }

    // 渲染页码列表
    function renderFlipper() {
        var start = Math.floor((this.index - 1) / this.offset) * this.offset + 1;
        var end = (start + this.offset - 1) > Math.ceil(this.total / this.limit) ? Math.ceil(this.total / this.limit) : (start + this.offset - 1);
        var html = '';
        var tmp = '';
        for (var i = start; i <= end; i++) {
            tmp = (i === this.index) ? '<li class="z-active">' + i + '</li>\n' : '<li>' + i + '</li>\n';
            html += tmp;
        }
        this.html2node(html, this.node.ul);
        this.index === 1 ? this.addClass.call(this.node.previous, 'z-disable') : this.removeClass.call(this.node.previous, 'z-disable');
        (this.total === 0 || this.index === Math.ceil(this.total / this.limit)) ? this.addClass.call(this.node.next, 'z-disable') : this.removeClass.call(this.node.next, 'z-disable');
    }

    // 获取data数据
    function getData(total, offset, limit, event) {
        event = event || 'renderWorksList';
        var url = this.url + '?total=' + total + '&offset=' + offset + '&limit=' + limit;
        if (total === 0) {
            var success = function (data) {
                this.emit(event, data);
            }.bind(this);
        }
        else {
            var success = function (data) {
                this.emit(event, data);
                this.emit('getTotal', data);
            }.bind(this);
        }
        var setting = {url: url, method: 'get', success: success,};
        // 加载gif
        this.emit('loading');
        App.Ajax(setting);
    }

    // 扩展原型
    App.Extend(Flipper.prototype, App.Emitter, App.ChangeClass, App.HTML2Node, {
        init: init,
        jumpIndex: jumpIndex,
        method: method(),
        renderFlipper: renderFlipper,
        getData: getData,
    });
    // 暴露接口
    App.Flipper = Flipper;
})();
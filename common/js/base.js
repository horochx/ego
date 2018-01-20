/**
 * @file 此文件用于存放公用的对象方法
 */
(function () {
    /**
     * window.App 用做全局的自定义组件、方法的命名空间
     * @global
     * @namespace App
     */
    window.App = {};
})();

// 事件发射器
(function () {

    /**
     * 注册事件函数
     * @param {String} event 事件名称
     * @param {Function} func 执行函数
     * @returns {Object} _events 返回已注册的事件
     */
    function on(event, func) {
        var _events = this._events || (this._events = {});
        var calls = _events[event] || (this._events[event] = []);
        calls.unshift(func);
        return this._events;
    }

    /**
     * 取消事件函数
     * @param {String} event 事件名称
     * @param {Function} func 执行函数
     * @returns {Object} _events 返回已注册事件
     */
    function off(event, func) {
        if (!event || !this._events || !this._events[event]) {
            return this._events;
        }
        else if (!func) {
            return this._events;
        }
        else {
            var calls = this._events[event];
            for (var i = calls.length - 1; i >= 0; i--) {
                if (calls[i] === func) {
                    calls.splice(i, 1);
                    return this._events;
                }
            }
        }
    }

    /**
     * 取消所有事件函数
     * @param {String} event 要取消的事件名称
     * @returns {Object} _events 返回已注册事件
     */
    function offAll(event) {
        if (event && this._events && this._events[event]) {
            delete this._events[event];
        }
        return this._events;
    }

    /**
     * 发射事件
     * @param {String} event 触发的事件名称
     * @returns {Array|Object} result|_events 返回已注册事件/函数执行结果
     */
    function emit(event) {
        if (!event || !this._events) {
            return this._events;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        var calls = this._events[event];
        var result = [];
        for (var i = calls.length - 1; i >= 0; i--) {
            result.push(calls[i].apply(this, args));
        }
        return result;
    }

    // 暴露接口到全局
    window.App.Emitter = {
        on: on,
        off: off,
        offAll: offAll,
        emit: emit,
    };
})();

// 复制属性
// extend({a:1}, {b:1, a:2}) -> {a:1, b:1}
(function () {
    /**
     * 复制对象属性
     * @param {Object} o1 主体对象
     * @returns {*}
     */
    function extend(o1) {
        for (var i = 1; i < arguments.length; i++) {
            var o2 = arguments[i];
            for (var j in o2) {
                if (typeof o1[j] === 'undefined') {
                    o1[j] = o2[j];
                }
            }
        }
        return o1;
    }

    //暴露接口到全局
    window.App.Extend = extend;
})();

// 将HTML转换为节点
(function () {
    /**
     * 将html转换为节点对象
     * @param {String} str HTML模板字符串
     * @param {Object} container 父容器DOM对象
     * @returns {*|HTMLDivElement}
     */
    function html2node(str, container) {
        container = container || document.createElement('div');
        container.innerHTML = str;
        return container;
    }

    // 暴露接口到全局
    window.App.HTML2Node = {
        html2node: html2node,
    }
})();

// 添加、删除DOM类选择器
(function () {
    /**
     * 添加样式
     * @param {String} clazz 待添加样式的类选择器
     */
    function addClass(clazz) {
        if (this.className.indexOf(clazz) !== -1) {
            return;
        }
        clazz = " " + clazz;
        this.className += clazz;
        this.className = this.className.replace('  ', ' ');
    }

    /**
     * 删除样式
     * @param {String} clazz 待删除样式的类选择器
     */
    function removeClass(clazz) {
        if (clazz === ' ') {
            return;
        }
        this.className = this.className.replace(clazz, '');
    }

    // 暴露接口到全局
    window.App.ChangeClass = {
        addClass: addClass,
        removeClass: removeClass,
    }
})();

// 模拟 include ,可以有多个输入参数，必须为js的路径的字符串
(function () {
    var count = 0;

    function include() {
        var path = arguments;
        var body = document.getElementsByTagName('body')[0];
        var script = document.getElementsByTagName('script');
        for (var i = 0; i < path.length; i++) {
            count++;
            var tmp = document.createElement('script');
            tmp.src = path[i];
            tmp.addEventListener('load', function () {
                count--;
                if (!count) {
                    include.end();
                }
            });
            body.insertBefore(tmp, script[script.length - 1]);
        }
    }

    include.end = function () {

    };
    // 暴露接口到全局
    window.App.Include = include;
})();

// Ajax 封装
(function () {
    /**
     * Ajax封装
     * @param {Object} option Ajax配置参数
     * @param {String} option.method 方法
     * @param {String} option.url 地址
     * @param {Boolean} [option.withCredentials] 跨域请求附带证书信息，默认为是
     * @param {Function} [option.success] 请求成功执行的函数，默认是打印请求结果
     * @param {Function} [option.fail] 请求失败执行的函数，默认是打印请求结果
     * @param {Boolean} [option.async] 是否异步，默认为是
     * @param {Object} [option.data] 需要提交的数据, 默认为 null
     * @param {Object} [option.head] 需要修改的 HTTP 头部信息
     */
    function Ajax(option) {
        var xhr = new XMLHttpRequest();
        var method = option.method;
        var url = 'http://59.111.103.100' + option.url;
        var withCredentials = option.withCredentials || true;
        var success = option.success || console.log;
        var fail = option.fail || console.log;
        var async = option.async || true;
        var data = option.data || null;
        var head = option.head || {"content-type": "application/json"};
        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    success(xhr.responseText, xhr.status);
                }
                else {
                    fail(xhr.status);
                }
            }
        });
        xhr.withCredentials = withCredentials;
        xhr.open(method, url, async);
        if (head) {
            var name = Object.keys(head);
            for (var i = name.length - 1; i >= 0; i--) {
                xhr.setRequestHeader(name[i], head[name[i]]);
            }
        }
        xhr.send(data);
    }

    // 暴露接口到全局
    window.App.Ajax = Ajax;
})();
// 获取用户登录信息
(function () {
    var user = {};

    // ajax锁，同一时间仅允许一个ajax请求
    user.ajaxLock = 1;

    function success(res) {
        res = JSON.parse(res);
        if (res.code >= 200 && res.code < 300 || res.code === 304) {
            user.data = res.result;
            user.emit('login');
        }
        else {
            user.data = null;
            user.emit('logout');
        }
        user.ajaxLock++;
    }

    // 如果请求失败，当作未登录处理
    function fail() {
        user.data = null;
        user.emit('logout');
        user.ajaxLock++;
    }

    user.getDate = function () {
        if (!user.ajaxLock) {
            return;
        }
        user.ajaxLock--;
        App.Ajax({method: 'get', url: '/api/users?getloginuser', success: success, fail: fail,});
    }
    // 扩展user的原型
    App.Extend(user, App.Emitter);
    // 暴露接口到全局
    window.App.user = user;
})();
// 渲染模板字符串
(function () {
    function TemplateRender(tmplate, data) {
        var exp = /{{(.*?)}}/g;
        return tmplate.replace(exp, function () {
            return data[arguments[1]];
        });
    }

    window.App.TemplateRender = TemplateRender;
})();
// js模板引擎
(function () {
    'use strict';

    /**
     * 模板引擎
     * @param str
     * @param data
     * @param toNode
     * @returns {*}
     */
    function sTemplate(str, data, toNode) {
        var match,
            html = '',
            arr = [],
            code = 'var result = [];\n',
            index = 0,
            addStr = function (str, flag) {
                str = str.replace(/('|")/g, "\$1");
                flag = flag || false;
                if (!flag) {
                    return "result.push('" + str + "');\n";
                } else {
                    if (/^\s*(?:for|if|else|while|})/.test(str)) {
                        return str + "\n";
                    } else {
                        return "result.push(" + str + ");\n";
                    }
                }
            },
            exp = /<%([\w\W]+?)%>/g;
        str = str.replace(/\n/g, '\\n');
        while (match = exp.exec(str)) {
            arr.push(match);
        }
        for (var i = 0; i < arr.length; i++) {
            code += addStr(str.slice(index, arr[i].index));
            code += addStr(arr[i][1], true);
            index = arr[i].index + arr[i][0].length;
        }
        code += addStr(str.slice(index));
        code += "return result.join('');";
        html = (new Function(code)).call(data);
        if (!toNode) {
            return html;
        } else {
            var node = document.createElement('div');
            node.innerHTML = html;
            if (node.children.length === 1) {
                return node.firstElementChild;
            }
            else {
                var fragment = document.createDocumentFragment();
                while (node.childNodes.length) {
                    fragment.appendChild(node.childNodes[0]);
                }
                return fragment;
            }
        }
    }

    window.App.sTemplate = sTemplate;
})();
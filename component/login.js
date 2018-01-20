// 登录组件
(function () {
    var TEMPLATE = '    <div class="m-modal">\n' +
        '        <div class="m-login">\n' +
        '            <i class="quit"></i>\n' +
        '            <div>\n' +
        '                <span class="tt">欢迎回来</span><span class="ct register">立即注册</span><span class="ct">还没有账号？</span>\n' +
        '            </div>\n' +
        '            <form>\n' +
        '                <input type="tel" name="username" placeholder="手机号">\n' +
        '                <input type="password" name="password" placeholder="密码">\n' +
        '                <div class="wrap">\n' +
        '                    <label><input type="checkbox" name="remember" style="display:none"><i class="unchecked"></i><i class="checked"></i><span class="ct">保持登录</span></label>\n' +
        '                    <a href="" class="ct">忘记密码？</a>\n' +
        '                </div>\n' +
        '                <div class="error z-hidden">\n' +
        '                    <i></i><span class="ct"></span>\n' +
        '                </div>\n' +
        '                <button type="submit" class="btn">登 录</button>\n' +
        '            </form>\n' +
        '        </div>\n' +
        '    </div>';

    /**
     * 组件构造函数
     * @param {object} option 组件配置参数
     * @constructor
     */
    function Login(option) {
        // 将输入参数添加到对象
        App.Extend(this, option);
        // 缓存节点
        this.node = App.sTemplate(TEMPLATE,null,true);
        this.form = this.node.querySelector('form');
        this.button = this.node.querySelector('button');
        this.quit = this.node.querySelector('.quit');
        this.error = this.node.querySelector('.error');
        this.register = this.node.querySelector('.register');
        this.errorContent = this.error.querySelector('.ct');
    }

    // 退出登陆框
    function exit() {
        this.form.reset();
        this.clear();
        document.body.removeChild(this.node);
    }

    /**
     * 显示错误信息提示
     * @param {string} str 待显示的错误信息
     */
    function showError(str) {
        this.errorContent.textContent = str;
        this.removeClass.call(this.error, 'z-hidden');
    }

    /**
     * Ajax提交表单
     * @param {object} ev 提交事件对象
     */
    function submit(ev) {
        ev.preventDefault();
        // 获取表单数据
        this.getData();
        // 如果表单数据验证通过,则发送 Ajax 请求
        if (this.emit('checkData')[0]) {
            App.Ajax({
                method: this.method,
                url: this.url,
                success: this.emit.bind(this, 'success'),
                fail: this.emit.bind(this, 'fail'),
                data: JSON.stringify(this.data),
            });
        }
        // 验证未通过，显示错误信息
        else {
            this.showError('请输入正确的手机号');
        }
    }

    // 获取表单数据
    function getData() {
        var data = {};
        var tmp = this.form.elements;
        for (var i = tmp.length - 1; i >= 0; i--) {
            if (tmp[i].name !== '') {
                if (tmp[i].name === 'remember') {
                    data[tmp[i].name] = tmp[i].checked;
                }
                else {
                    data[tmp[i].name] = tmp[i].value;
                }
            }
        }
        // 对密码进行 md5 计算
        data.password = hex_md5(data.password);
        this.data = data;
    }

    // 清除错误信息提示
    function clear() {
        if (this.error.className.indexOf('z-hidden') === -1) {
            this.addClass.call(this.error, 'z-hidden');
        }
    }

    // 显示登陆框
    function showModal() {
        document.body.appendChild(this.node);
    }

    // 初始化
    function init() {
        // 添加鼠标点击事件
        this.quit.addEventListener('click', this.exit.bind(this));
        this.register.addEventListener('click', function () {
            this.exit();
            this.emit('register');
        }.bind(this));
        this.form.addEventListener('submit', this.submit.bind(this));
        this.form.addEventListener('input', this.clear.bind(this));
    }

    // 扩展 Login 原型
    App.Extend(Login.prototype, App.Emitter,App.ChangeClass, {
        init: init,
        exit: exit,
        submit: submit,
        getData: getData,
        clear: clear,
        showError: showError,
        showModal:showModal,
    });
    App.Login = Login;
})();
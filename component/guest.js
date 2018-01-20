// 登录、注册按钮组件
// TODO 使用事件发射器优化事件
(function () {
    'use strict';
    var btnTemplate = '<div class="m-guest">\
    <button class="button button-1"><i></i>登录</button>\
    <button class="button button-2">注册</button>\
</div>';
    var userInfoTemplate = '<div class="m-userinfo">\n' +
        '                    <img class="avatar" src="../res/img/avatar.jpg" alt="头像">\n' +
        '                    <span class="name"></span><i class="sex"></i><i class="btn u-icon"></i>\n' +
        '                    <ul class="menu">\n' +
        '                        <li><a href="">个人中心</a></li>\n' +
        '                        <li><a href="">信息</a></li>\n' +
        '                        <li><a href="">设置</a></li>\n' +
        '                        <li><a href="">退出账号</a></li></ul>\n' +
        '                </div>';

    /**
     * 组件构造函数
     * @param {Object} option 组件配置参数
     * @param {Object} option.container 组件容器DOM节点
     * @constructor
     */
    function Guest(option) {
        // 将输入参数添加到对象
        App.Extend(this, option);
        // 缓存节点
        this.btnNode = App.sTemplate(btnTemplate, null, true);
        this.btnLogin = this.btnNode.querySelector('.button');
        this.btnRegister = this.btnNode.querySelectorAll('.button')[1];
        this.userInfoNode = App.sTemplate(userInfoTemplate, null, true);
        this.userName = this.userInfoNode.querySelector('.name');
        this.userSex = this.userInfoNode.querySelector('.sex');
        this.userMenu = this.userInfoNode.querySelectorAll('li');
    }

    // 显示用户信息
    function _showUserInfo() {
        var user = this.user;
        this.userName.innerHTML = user.data.nickname;
        this.userName.title = user.data.nickname;
        this.removeClass.call(this.userSex, 'sex-0');
        this.removeClass.call(this.userSex, 'sex-1');
        this.addClass.call(this.userSex, 'sex-' + user.data.sex);
        // 为退出登录按钮添加事件
        this.userMenu[3].addEventListener('click', this._logout.bind(this));
        // 显示登录信息
        this.container.innerHTML = null;
        this.container.appendChild(this.userInfoNode);
    }

    // 退出登录
    function _logout() {
        var setting = {
            method: 'post',
            url: '/api/logout',
            success: function (data) {
                data = JSON.parse(data);
                if (data.code === 200) {
                    window.location.href = '/index';
                    // 无刷新更新网页内容
                    this.user.getDate();
                }
            },
            fail: function (code) {
                alert('退出失败，请重新尝试！错误代码： ' + code);
            }
        };
        App.Ajax(setting);
    }

    // 显示登录、注册按钮
    function _showBtn() {
        this.btnLogin.addEventListener('click', this.emit.bind(this, 'login'));
        this.btnRegister.addEventListener('click', this.emit.bind(this, 'register'));
        this.container.innerHTML = null;
        this.container.appendChild(this.btnNode);
    }

    // 初始化组件
    function init() {
        var user = this.user;
        user.on('login', this._showUserInfo.bind(this));
        user.on('logout', this._showBtn.bind(this));
        if (user.data === undefined) {
            user.getDate();
        }
        else if (user.data === null) {
            this._showBtn();
        }
        else {
            this._showUserInfo();
        }
    }

    // 扩展 Guest 原型
    App.Extend(Guest.prototype, App.Emitter, App.ChangeClass, {
        init: init,
        _showUserInfo: _showUserInfo,
        _showBtn: _showBtn,
        _logout: _logout,
    });
    // 暴露接口
    window.App.Guest = Guest;
})();
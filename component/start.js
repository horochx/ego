// 更新明日之星列表
(function () {
    function Start(option) {
        App.Extend(this, option);
        this.btn = [];
        this.followCoutn = [];
    }

    function getData(success) {
        success = success || function () {

        };
        App.Ajax({
            method: 'get',
            url: this.url,
            success: function (success, data) {
                this.data = JSON.parse(data);
                success();
            }.bind(this, success),
        });
    }

    function render() {
        if (this.data.code >= 200 && this.data.code < 300 || this.data.code === 304) {
            var result = this.data.result;
            this.html = '';
            for (var i = 0; i < result.length; i++) {
                var tmp = '<li><img src="../res/img/avatar1.jpg">\n' +
                    '    <div>\n' +
                    '        <p>' + result[i].nickname + '</p>\n' +
                    '        <p></p>\n' +
                    '    </div>\n' +
                    '    <span></span></li>\n';
                this.html += tmp;
            }
            this.node = this.html2node(this.html, this.container);
            this.li = this.node.getElementsByTagName('li');

            for (var i = 0; i < this.li.length; i++) {
                this.btn[i] = this.li[i].getElementsByTagName('span')[0];
                this.followCoutn[i] = this.li[i].getElementsByTagName('p')[1];
                this.updateItem(i);
            }
            if (App.user.data) {
                this.followEvent();
            }
            else {
                this.loginEvent();
            }
        }
    }

    function loginEvent() {
        this._login = this.emit.bind(this, 'login');
        for (var i = 0; i < this.btn.length; i++) {
            this.btn[i].addEventListener('click', this._login);
        }
    }

    function followEvent() {
        for (var i = 0; i < this.btn.length; i++) {
            this.btn[i].removeEventListener('click', this._login);
            this.btn[i].addEventListener('click', function (i) {
                var followSetting = {
                    method: 'post',
                    url: '/api/users?follow',
                    data: JSON.stringify({id: this.data.result[i].id}),
                    success: this.getData.bind(this, this.updateItem.bind(this, i)),
                };
                var unfollowSetting = {
                    method: 'post',
                    url: '/api/users?unfollow',
                    data: JSON.stringify({id: this.data.result[i].id}),
                    success: this.getData.bind(this, this.updateItem.bind(this, i)),
                };
                if (this.data.result[i].isFollow) {
                    App.Ajax(unfollowSetting);
                }
                else {
                    App.Ajax(followSetting);
                }
            }.bind(this, i));
        }
    }

    function init() {
        this.getData(this.render.bind(this));
        var user = App.user;
        user.on('login', this.followEvent.bind(this));
        user.on('logout', this.loginEvent.bind(this));
        if (user.data === undefined) {
            user.getDate();
        }
        else if (user.data === null) {
            this.loginEvent();
        }
        else {
            this.followEvent();
        }
    }

    function updateItem(i) {
        var data = this.data.result[i];
        if (data.isFollow) {
            this.btn[i].innerHTML = '<i class="u-icon"></i>&nbsp;已关注';
            this.addClass.call(this.btn[i], 'z-follow');
            this.followCoutn[i].innerHTML = '作品 ' + data.workCount + '&nbsp;&nbsp;&nbsp;&nbsp;粉丝数 ' + data.followCount;
        }
        else {
            this.btn[i].textContent = '+ 关 注';
            this.removeClass.call(this.btn[i], 'z-follow');
            this.followCoutn[i].innerHTML = '作品 ' + data.workCount + '&nbsp;&nbsp;&nbsp;&nbsp;粉丝数 ' + data.followCount;
        }
    }

    App.Extend(Start.prototype, App.Emitter, App.ChangeClass, App.HTML2Node, {
        getData: getData,
        render: render,
        init: init,
        updateItem: updateItem,
        loginEvent: loginEvent,
        followEvent: followEvent,
    });
    // 暴露接口到全局
    App.Start = Start;
})();
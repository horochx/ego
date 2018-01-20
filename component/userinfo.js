// 渲染用户信息
(function () {
    function UserInfo(option) {
        App.Extend(this, option);
        // 缓存节点
        this.node = {};
        this.node.name = this.container.querySelector('.name');
        this.node.sex = this.container.querySelector('.name+i');
        this.node.age = this.container.querySelector('.age');
        this.node.constellation = this.container.querySelector('.constellation');
        this.node.location = this.container.querySelector('.location');
    }

    function init() {
        var user = App.user;
        user.on('login', this.renderUserInfo.bind(this));
        if (user.data === undefined) {
            user.getDate();
        }
        else if (user.data !== null) {
            this.renderUserInfo();
        }
    }

    function renderUserInfo() {
        var data = this.getUserInfo();
        var o = Object.keys(this.node);
        for (var i = o.length - 1; i >= 0; i--) {
            o[i] !== 'sex' ? this.node[o[i]].textContent = data[o[i]] : this.node.sex.className = data.sex;
        }
    }

    function getUserInfo() {
        var result = {};
        var data = App.user.data;
        result.name = data.nickname;
        result.age = (function () {
            var birth = data.birthday.split('-')[0];
            var today = (new Date()).getFullYear();
            return today - birth;
        })();
        result.constellation = (function () {
            var month = data.birthday.split('-')[1] - 0;
            var day = data.birthday.split('-')[2] - 0;
            var constellation = ['摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座'];
            return constellation[month + (day > [19, 18, 20, 20, 20, 21, 22, 22, 22, 22, 21, 21][month - 1]) - 1];
        })();
        result.location = (function () {
            for (var i = ADDRESS_CODES.length - 1; i >= 0; i--) {
                if (data.province === ADDRESS_CODES[i][0] - 0) {
                    for (var j = ADDRESS_CODES[i][2].length - 1; j >= 0; j--) {
                        if (data.city === ADDRESS_CODES[i][2][j][0] - 0) {
                            return ADDRESS_CODES[i][2][j][1];
                        }
                    }
                }
            }
        })();
        result.sex = 'sex-' + data.sex;
        return result;
    }

    App.Extend(UserInfo.prototype, {
        init: init,
        renderUserInfo: renderUserInfo,
        getUserInfo: getUserInfo,
    });
    App.UserInfo = UserInfo;
})();
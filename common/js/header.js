// 初始化组件
(function () {
    // 获取容器节点
    var tabs_c = document.querySelector('.g-header-c .g-tabs');
    var search_c = document.querySelector('.g-header-c .g-search');
    var guest_c = document.querySelector('.g-header-c .g-guest');
    // 初始化组件
    var tabs = new App.Tabs({container: tabs_c});
    tabs.init(0);
    var search = new App.Search({container: search_c});
    search.init();
    var register = new App.Register();
    register.init();
    login = new App.Login({
        url: '/api/login',
        method: 'post',
    });
    login.init();
    login.on('checkData', function () {
        return /^[\d]{11}$/.test(this.data.username);
    });
    login.on('success', function (response) {
        response = JSON.parse(response);
        if (response.code === 200) {
            App.user.data = response.result;
            App.user.emit('login');
            this.exit();
        }
        else {
            this.showError('账号或密码不正确，请重新输入');
        }
    });
    login.on('fail', function (num) {
        this.showError('连接发生错误，请重新尝试。错误代码：' + num);
    });
    login.on('register', function () {
        register.showModal.bind(register));
    });
    var guest = new App.Guest({container: guest_c});
    guest.on('login', login.showModal.bind(login));
    guest.on('register', register.showModal.bind(register));
    guest.init();
})();
// 载入组件
App.Include('../../component/tabs.js', '../../component/search.js', '../../component/guest.js', '../../component/login.js', '../../component/register.js', '../../component/userinfo.js', '../../component/workslist.js', '../../component/Modal.js', '../../component/flipper.js');
// 初始化组件
App.Include.end = function () {
    // App.Include('../common/js/header.js');
    // 初始化顶栏组件
    // 获取容器节点
    var tabs_c = document.querySelector('.g-header-c .g-tabs');
    var search_c = document.querySelector('.g-header-c .g-search');
    var guest_c = document.querySelector('.g-header-c .g-guest');
    // 初始化组件
    var tabs = new App.Tabs({
        container: tabs_c,
        data: [{item: '首页', url: '/html/index.html'},
            {item: '作品', url: '/html/works/list.html'},
            {item: '圈子', url: '/html/index.html'},
            {item: '奇思妙想', url: '/html/index.html'}]
    });
    tabs.init(1);
    var search = new App.Search({container: search_c});
    search.init();
    var register = new App.Register({
        url: '/api/register',
        method: 'post',
    });
    register.init();
    var login = new App.Login({
        url: '/api/login',
        method: 'post',
    });
    register.on('success', login.showModal.bind(login));
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
    login.on('register', register.showModal.bind(register));
    var guest = new App.Guest({container: guest_c, user: App.user,});
    guest.on('login', login.showModal.bind(login));
    guest.on('register', register.showModal.bind(register));
    guest.init();
    // 初始化其它
    // 初始化用户信息
    var userInfo_c = document.querySelector('.m-user');
    var userInfo = new App.UserInfo({
        container: userInfo_c,
    });
    userInfo.init();
    // 初始化作品列表
    var worksList_c = document.querySelector('.m-work_list');
    var worksList = new App.WorkList({
        container: worksList_c,
        // url: 'http://localhost:8002/api/works?total=0&offset=0&limit=15',
    });
    worksList.on('refresh', function () {
        flipper.jumpIndex(flipper.index);
    });
    worksList.init();
    // 初始化翻页器
    var flipper_c = document.querySelector('.m-flipper');
    var flipper = new App.Flipper({
        container: flipper_c,
        limit: 15,
        offset: 8,
        url: '/api/works',
    });
    flipper.on('loading', function () {
        worksList.loading();
    });
    flipper.on('renderWorksList', function (data) {
        data = JSON.parse(data);
        worksList.renderList(data.result.data);
    });
    flipper.on('getTotal', function (data) {
        data = JSON.parse(data);
        this.total = data.result.total;
        this.renderFlipper();
    });
    flipper.init();
}
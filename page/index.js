// 载入组件
App.Include('../component/tabs.js', '../component/search.js', '../component/guest.js', '../component/login.js', '../component/slider.js', '../component/start.js', '../component/register.js');
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
    tabs.init(0);
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
    // 初始化轮播图
    var slider_c = document.querySelector('.g-banner .g-slider');
    var slider = new App.Slider({
        container: slider_c,
        images: [
            '../res/img/banner0.jpg',
            '../res/img/banner1.jpg',
            '../res/img/banner2.jpg',
            '../res/img/banner3.jpg',
        ],
        bgc: [
            '#ffe0bf',
            '#6b4459',
            '#33294c',
            '#fcfdf7',
        ],
    });
    document.getElementsByTagName('a')
    slider.init();
    // 初始化明日之星
    var start_c = document.querySelector('.m-section .content-2 ul');
    window.start = new App.Start({
        container: start_c,
        url: '/api/users?getstarlist',
    });
    start.on('login', login.showModal.bind(login));
    start.init();
    // 初始化排行榜tabs
    var tabs_c = document.querySelector('.m-ranking .nav');
    var tabs = new App.Tabs({
        container: tabs_c,
        data: [{item: '原创', url: '/html/index.html'},
            {item: '同人', url: '/html/index.html'},
            {item: '临摹', url: '/html/index.html'}],
    });
    tabs.init(0);
};


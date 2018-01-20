// 注册模块
(function () {
    var TEMPLATE = '<div class="m-modal">\n' +
        '    <div class="m-register">\n' +
        '        <i class="quit"></i>\n' +
        '        <div class="tt"></div>\n' +
        '        <form>\n' +
        '            <label class="row"><span>手机号</span><input type="tel" name="username"></label>\n' +
        '            <label class="row"><span>昵 称</span><input type="text" name="nickname" placeholder="中英文均可，至少8个字符"></label>\n' +
        '            <label class="row"><span>密 码</span><input type="password" name="password" placeholder="长度6-16个字符，不包含空格"></label>\n' +
        '            <label class="row"><span>确认密码</span><input type="password" name="repassword"></label>\n' +
        '            <div class="row"><span>性 别</span>\n' +
        '                <label><input class="z-hidden" type="radio" name="sex" value="0" checked="checked"><i></i><span>少男</span></label>\n' +
        '                <label><input class="z-hidden" type="radio" name="sex" value="1"><i></i><span>少女</span></label>\n' +
        '            </div>\n' +
        '            <div class="row"><span>生 日</span>\n' +
        '                <div class="f-justify">\n' +
        '                    <div class="m-select"><span>年</span>\n' +
        '                        <ul class="z-hidden"></ul>\n' +
        '                    </div>\n' +
        '                    <div class="m-select"><span>月</span>\n' +
        '                        <ul class="z-hidden"></ul>\n' +
        '                    </div>\n' +
        '                    <div class="m-select"><span>日</span>\n' +
        '                        <ul class="z-hidden"></ul>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="row"><span>所在地</span>\n' +
        '                <div class="f-justify">\n' +
        '                    <div class="m-select"><span>省</span>\n' +
        '                        <ul class="z-hidden"></ul>\n' +
        '                    </div>\n' +
        '                    <div class="m-select"><span>市</span>\n' +
        '                        <ul class="z-hidden"></ul>\n' +
        '                    </div>\n' +
        '                    <div class="m-select"><span>区</span>\n' +
        '                        <ul class="z-hidden"></ul>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <label class="row row-1"><span>验证码</span><input type="text" name="captcha"><img src="/captcha" alt="验证码"></label>\n' +
        '            <div class="rule"><label><input class="z-hidden" type="checkbox" name="rule"><i></i></label><a>我已经阅读并同意相关条款</a></div>\n' +
        '            <button class="u-button btn" type="submit">注 册</button>\n' +
        '        </form>\n' +
        '    </div>\n' +
        '</div>';

    /**
     * 组件构造函数
     * @param option
     * @constructor
     */
    function Register(option) {
        // 将输入参数添加到对象
        App.Extend(this, option);
        // 缓存节点
        this.node = App.sTemplate(TEMPLATE, null, true);
        // 表单
        this.form = this.node.querySelector('form');
        // 退出按钮
        this.quit = this.node.querySelector('.quit');
        // 生日、地区级联选择器
        var selectionsTmp = this.form.querySelectorAll('ul');
        this.selections = {
            birthday: [
                selectionsTmp[0],
                selectionsTmp[1],
                selectionsTmp[2],
            ],
            location: [
                selectionsTmp[3],
                selectionsTmp[4],
                selectionsTmp[5],
            ],
        };
        // 选项
        this.options = {};
        // 选项值
        this.optionValue = {};
        // 遍历级联选择器节点，缓存选项与选项值节点
        var name = Object.keys(this.selections);
        for (var i = 0; i < name.length; i++) {
            var item = name[i];
            this.options[item] = [];
            this.optionValue[item] = [];
            for (var j = this.selections[item].length - 1; j >= 0; j--) {
                // 通过 getElementsByTagName 获取动态的li集合
                this.options[item][j] = this.selections[item][j].getElementsByTagName('li');
                // 获取选择器的前一个节点（用于保存选择器的选中值）
                this.optionValue[item][j] = this.selections[item][j].previousElementSibling;
            }
        }
        // 验证码
        this.captchaImg = this.form.querySelector('img');
        // 缓存数据
        // 今天的日期，用于限制出生日期的选择。
        this._today = (function () {
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth() + 1;
            var day = today.getDate();
            return [year, month, day];
        })();
        // 可供选择的年份,由 this._today[0] 限制，前推100年
        this._year = (function (maxYear) {
            var result = [];
            for (var i = 0; i <= 100; i++) {
                var item = [];
                item[0] = item[1] = maxYear - i;
                result.push(item);
            }
            return result;
        })(this._today[0]);
        // 可供选择的月份，由this._today[1] 限制，{normal:[12个月]，limit:[当月]}
        this._month = (function (maxMonth) {
            var result = {normal: [], limit: []};
            for (var i = 1; i <= 12; i++) {
                var item = [];
                item[0] = item[1] = i;
                result.normal.push(item);
                if (i <= maxMonth) {
                    result.limit.push(item);
                }
            }
            return result;
        })(this._today[1]);
        // 可供选择的日期，由this._today[2]限制，{'28':[28天],'29':[29天],'30':[30天],'31':[31天],limit:[当天]}
        this._day = (function (maxDay) {
            var result = {28: [], 29: [], 30: [], 31: [], limit: []};
            for (var i = 1; i <= 31; i++) {
                var item = [];
                item[0] = item[1] = i;
                i <= 28 ? result[28].push(item) : i;
                i <= 29 ? result[29].push(item) : i;
                i <= 30 ? result[30].push(item) : i;
                i <= maxDay ? result.limit.push(item) : i;
                result[31].push(item);
            }
            return result;
        })(this._today[2]);
    }

    // 显示注册框
    function showModal() {
        document.body.appendChild(this.node);
    }

    /**
     * 填充下拉选项
     * @param {array} data 待填充的数据
     * @param {object} node 待填充的节点
     */
    function _renderList(data, node) {
        if (data.length === 0) {
            node.innerHTML = '';
            return;
        }
        // 创建模板
        var html = '<%for(var i = 0; i < this.length ; i++){%>\n' +
            '<li data-index="<%i%>" data-code="<%this[i][0]%>"><%this[i][1]%></li>\n' +
            '<%}%>';
        // 渲染模板
        var fragment = App.sTemplate(html, data, true);
        // 插入节点
        node.innerHTML = '';
        node.appendChild(fragment);
    }

    // 初始化组件,添加鼠标事件
    function init() {
        // 退出按钮
        this.quit.addEventListener('click', this.exit.bind(this));
        // 预填充级联选择器的第一项
        this._renderList(ADDRESS_CODES, this.selections.location[0]);
        this._renderList(this._year, this.selections.birthday[0]);
        // 为选择器添加事件
        var p = Object.keys(this.selections);
        for (var i = 0; i < p.length; i++) {
            var name = p[i];
            // 遍历级联选择器节点
            for (var j = this.selections[name].length - 1; j >= 0; j--) {
                // 在选择器的父元素添加点击切换显示状态事件
                this.selections[name][j].parentNode.addEventListener('click', this._toggleOptionsList.bind(this, name, j));
                // 点击选项后更新当前选中的值
                this.selections[name][j].addEventListener('click', this._updateOptionValue.bind(this, name, j));
                // 点击选项后渲染下一选项
                this.selections[name][j].addEventListener('click', function (name, j) {
                    // 渲染下一个地址
                    if (name === 'location') {
                        this._updateNextLocation(j);
                    }
                    // 渲染下一个日期
                    else if (name === 'birthday') {
                        this._updateNextBirthday(j);
                    }
                    else {
                        return;
                    }
                }.bind(this, name, j));
            }
        }
        // 点击图片刷新验证码
        this.captchaImg.addEventListener('click', this._updateCaptchaImg.bind(this));
        // 提交表单
        this.form.addEventListener('submit', this.submit.bind(this));
    }

    // 更新验证码图片
    function _updateCaptchaImg() {
        // 为图片url添加时间戳
        this.captchaImg.src = '/captcha?' + (new Date()).getTime();
    }

    /**
     * 更新当前选中选项
     * @param {string} p1 选择器类别，如：'location'、'birthday'
     * @param {number} p2 选择器级数，如：1、2、3
     * @param {object} event 事件对象
     */
    function _updateOptionValue(p1, p2, event) {
        // 获取当前选项值
        var optionnValue = this.optionValue[p1][p2];
        // 如果不是DOM事件调用这个函数，会清除当前已选中的值
        if (event === undefined) {
            optionnValue.textContent = '';
            optionnValue.setAttribute('data-code', '');
            optionnValue.setAttribute('data-index', '');
            return;
        }
        // 获取当前点击的选项的值
        var option = event.target;
        var name = option.textContent;
        var value = option.getAttribute('data-code');
        var index = option.getAttribute('data-index');
        // 更新当前选项值为上面获取到的值
        optionnValue.textContent = name;
        optionnValue.setAttribute('data-code', value);
        optionnValue.setAttribute('data-index', index);
    }

    // 退出注册框
    function exit() {
        // 重置表单
        this.form.reset();
        // 移除节点
        document.body.removeChild(this.node);
    }


    // 上一次点击的选择器节点
    var lastClickOptionsList = null;

    /**
     * 切换选择器显示状态
     * @param {string} name 选择器类别，如：'location'、'birthday'
     * @param {number} i 选择器级数，如：1、2、3
     */
    function _toggleOptionsList(name, i) {
        // 获取当前点击的选择器
        var currentClickOptionsList = this.selections[name][i];
        // 获取当前点击选择器的显示状态，true为隐藏，false为可见
        var isHidden = (currentClickOptionsList.className.indexOf('z-hidden') !== -1);
        // 如果是隐藏状态
        if (isHidden) {
            // 隐藏上一次点击的选择器节点（保存在闭包中）
            App.ChangeClass.addClass.call(lastClickOptionsList || currentClickOptionsList, 'z-hidden');
            // 将当前选择器节点置为显示
            App.ChangeClass.removeClass.call(currentClickOptionsList, 'z-hidden');
            // 更新上一次点击的选择器节点
            lastClickOptionsList = currentClickOptionsList;
        }
        // 如果是隐藏状态
        else {
            // 将当前点击选择器置为隐藏
            App.ChangeClass.addClass.call(currentClickOptionsList, 'z-hidden');
        }
    }

    /**
     * 渲染下一个地址
     * @param {number} i 当前点击的级联选择器的级数
     */
    function _updateNextLocation(i) {
        // 获取待渲染数据
        var tmpData = ADDRESS_CODES;
        // 遍历地址级联选择器
        for (var j = 0; j <= this.selections.location.length - 1; j++) {
            // 获取当前级数之前的选择器的选中值
            if (j <= i) {
                var index = this.optionValue.location[j].getAttribute('data-index');
                // 更新待渲染数据
                tmpData = tmpData[index][2];
            }
            // 清除当前级数之后的选择器的选项及选项值
            else {
                this._updateOptionValue('location', j);
                this._renderList([], this.selections.location[j]);
            }
        }
        // 渲染下一级选择器的选项
        this._renderList(tmpData, this.selections.location[i + 1]);
    }

    /**
     * 渲染下一个生日日期
     * @param {number} i 当前点击的级联选择器的级数
     */
    function _updateNextBirthday(i) {
        // 获取选中的年
        var year = this.optionValue.birthday[0].getAttribute('data-code') - 0;
        // 待提交的数据
        var tmpData;
        // 如果点击的是年，获取月份的数据
        if (i === 0) {
            year === this._today[0] ? tmpData = this._month.limit : tmpData = this._month.normal;
        }
        // 否则，获取日期数据
        else {
            var month = this.optionValue.birthday[1].getAttribute('data-code') - 0;
            // 获取对应年月的最后一天
            var lastDay = (new Date(year, month, 0)).getDate();
            // 获取日期数据
            year === this._today[0] && month === this._today[1] ? tmpData = this._day.limit : tmpData = this._day[lastDay];

        }
        // 清除当前级数之后的选择器的选项及选项值
        for (var j = i + 1; j <= this.selections.birthday.length - 1; j++) {
            this._updateOptionValue('birthday', j);
            this._renderList([], this.selections.birthday[j]);
        }
        // 渲染下一个级联选择器的选项
        this._renderList(tmpData, this.selections.birthday[i + 1]);
    }

    // 提交表单
    function submit(event) {
        event.preventDefault();
        // 获取表单数据
        this._getFormData();
        // 检测表单数据
        var testResult = this._testData();
        // 如果检测通过
        if (testResult[0]) {
            // 提交表单
            var data = this._formatData();
            var setting = {
                method: this.method,
                url: this.url,
                data: data,
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.code === 200) {
                        this.exit();
                        this.emit('success');
                    }
                }.bind(this),
            };
            App.Ajax(setting);
        }
        // 如果检测不通过
        else {
            // 遍历有错误的节点
            for (var i = 0; i < testResult[1].length; i++) {
                var node = testResult[1][i];
                // 添加错误样式
                this.addClass.call(node, 'error');
                // 点击时清除错误样式
                node.addEventListener('click', this.removeClass.bind(node, 'error'));
            }
        }
    }

    // 格式化待提交的表单数据
    function _formatData() {
        var o = {};
        // 遍历获取到的表单数据
        var p = Object.keys(this.data);
        for (var i = p.length - 1; i >= 0; i--) {
            var name = p[i];
            // 属性名被正则匹配的数据，不做处理
            if (!/^(year|month|day|password|repassword|rule)$/.test(name)) {
                o[name] = this.data[name].value;
            }
        }
        // 对密码做MD5加密
        o.password = hex_md5(this.data.password.value);
        // 拼接生日字符串
        o.birthday = this.data.year.value + '-' + this.data.month.value + '-' + this.data.day.value;
        o = JSON.stringify(o);
        return o;
    }


    // 检查表单数据
    function _testData() {
        // 检查结果，通过为true
        var flag = true;
        // 内容填写有错误的节点集合
        var errorList = [];
        // 对表单数据进行校验
        /^[\d]{11}$/.test(this.data.username.value) ? flag : (flag = false, errorList.push(this.data.username.node));
        /^[\u4e00-\u9fa5a-zA-Z]{8,}$/.test(this.data.nickname.value) ? flag : (flag = false, errorList.push(this.data.nickname.node));
        /^[\S\d\w]{6,16}$/.test(this.data.password.value) ? flag : (flag = false, errorList.push(this.data.password.node));
        this.data.repassword.value === this.data.password.value ? flag : (flag = false, errorList.push(this.data.repassword.node));
        var tmp = ['year', 'month', 'day', 'province', 'city', 'district'];
        for (var i = 0; i <= tmp.length - 1; i++) {
            var name = tmp[i];
            this.data[name].value !== 0 ? flag : (flag = false, errorList.push(this.data[name].node));
        }
        /^[\w]{6}$/.test(this.data.captcha.value) ? flag : (flag = false, errorList.push(this.data.captcha.node));
        this.data.rule.value ? flag : (flag = false, errorList.push(this.data.rule.node));
        // 返回校验结果
        return [flag, errorList];
    }

    // 获取表单数据
    function _getFormData() {
        // 创建this.data用以保存数据
        this.data = this.data || {};
        // 创建需要获取的属性名
        var keys = {
            formElements: ['username', 'nickname', 'password', 'repassword', 'sex', 'captcha'],
            selections: ['year', 'month', 'day', 'province', 'city', 'district'],
            rule: ['rule'],
        };
        // 遍历需要获取的属性名
        var p = Object.keys(keys);
        for (var i = 0; i < p.length; i++) {
            var type = p[i];
            for (var j = 0; j < keys[type].length; j++) {
                // 获取当前遍历到的属性名
                var name = keys[type][j];
                // 依据属性的类型获取节点和属性值，仅获取一次this.data[name].node,重复获取this.data[name].value
                this.data[name] = this.data[name] || {};
                if (type === 'formElements') {
                    this.data[name].node = this.data[name].node || this.form[name];
                    this.data[name].value = name === 'sex' ? this.data[name].node.value - 0 : this.data[name].node.value;
                }
                else if (type === 'selections') {
                    this.data[name].node = this.data[name].node || this.form.querySelectorAll('.m-select')[j];
                    this.data[name].value = this.data[name].node.querySelector('span').getAttribute('data-code') - 0;
                }
                else if (type === 'rule') {
                    this.data[name].node = this.data[name].node || this.form[name].nextElementSibling;
                    this.data[name].value = this.form[name].checked;
                }
                else {
                    return;
                }
            }
        }
    }

    // 扩展Register原型
    App.Extend(Register.prototype, App.ChangeClass, App.Emitter, {
        showModal: showModal,
        init: init,
        _renderList: _renderList,
        exit: exit,
        _toggleOptionsList: _toggleOptionsList,
        _updateOptionValue: _updateOptionValue,
        _updateNextLocation: _updateNextLocation,
        _updateNextBirthday: _updateNextBirthday,
        submit: submit,
        _getFormData: _getFormData,
        _testData: _testData,
        _formatData: _formatData,
        _updateCaptchaImg: _updateCaptchaImg,
    });
    // 暴露接口到全局
    App.Register = Register;
})();
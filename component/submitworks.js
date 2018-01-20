// 提交作品组件
(function () {
        /**
         * 组件构造函数
         * @param options
         * @param options.files
         * @param options.tags
         * @param options.form
         * @constructor
         */
        function SubmitWorks(options) {
            App.Extend(this, options);
            // 获取节点
            this.node = {};
            this.node.select = this.form.querySelector('.authorization');
            this.node.options = this.node.select.getElementsByTagName('ul')[0];
            this.node.optionValue = this.node.select.getElementsByTagName('span')[0];
            this.node.errorList = {
                pictures: [this.form.querySelectorAll('.error')[0], '你还没有上传作品哦'],
                name: [this.form.querySelectorAll('.error')[1], '你的作品还没有取名字哦'],
            };
        }

        function init() {
            // 初始化作品授权下拉选项
            // 点击打开、关闭下拉选项
            this.node.select.addEventListener('click', toggleOptionsList.bind(this));
            // 点击改变下拉选项选中的值
            this.node.options.addEventListener('click', updateOptionValue.bind(this));
            // 添加提交事件
            this.form.addEventListener('submit', submitHandles.bind(this));
            // 添加清除错误提示事件
            this.form.addEventListener('click', function (event) {
                var target = event.target;
                if (target.tagName !== 'BUTTON') {
                    this.showError(this.node.errorList.pictures[0], "");
                    this.showError(this.node.errorList.name[0], "");
                }
            }.bind(this));
        }

        // 提交表单
        function submitHandles(event) {
            event.preventDefault();
            this.getFormData();
            var checkResult = this.checkData();
            // 检测通过，提交表单
            if (checkResult[0]) {
                // 提交表单
                var setting = {
                    method: "post",
                    url: this.url,
                    data: JSON.stringify(this.data),
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data.code === 200) {
                            location.href = "/works/";
                        }
                    }.bind(this)
                };
                App.Ajax(setting);
            }
            // 检测未通过，显示错误提示
            else {
                // 遍历有误的数据，显示错误提示
                for (var i = checkResult[1].length - 1; i >= 0; i--) {
                    var item = checkResult[1][i];
                    this.showError(this.node.errorList[item][0], this.node.errorList[item][1]);
                }
            }
        }

        // 开启、关闭选项菜单
        function toggleOptionsList() {
            var isHidden = (this.node.options.className.indexOf('z-hidden') !== -1);
            if (isHidden) {
                this.removeClass.call(this.node.options, 'z-hidden');
            }
            else {
                this.addClass.call(this.node.options, 'z-hidden');
            }
        }

        // 更新被选中选项
        function updateOptionValue(ev) {
            var option = ev.target;
            var name = option.textContent;
            var value = option.getAttribute('data-value');
            this.node.optionValue.textContent = name;
            this.node.optionValue.setAttribute('data-value', value);
        }

        // 获取表单数据
        function getFormData() {
            var data = {};
            var formValue = ['name', 'category', 'description', 'privilege'];
            var cover = this.files[this.files.length - 1]();
            for (var i = 0; i < formValue.length; i++) {
                var name = formValue[i];
                var value = this.form[name].value;
                data[name] = value !== "" && !isNaN(value) ? value - 0 : value;
            }
            data['tag'] = (function (tags) {
                var tagList = tags.getElementsByTagName('span');
                var tags = [];
                for (var i = tagList.length - 2; i >= 0; i--) {
                    tags.push(tagList[i].textContent);
                }
                return tags.join(',');
            })(this.tags);
            data["authorization"] = this.node.optionValue.getAttribute('data-value') - 0;
            data["coverId"] = cover ? cover.id : cover;
            data["coverUrl"] = cover ? cover.url : cover;
            data["pictures"] = (function (filesList) {
                var result = [];
                for (i = filesList.length - 2; i >= 0; i--) {
                    filesList[i] ? result.push(filesList[i][1]) : i;
                }
                return result;
            })(this.files);
            this.data = data;
        }

        // 检查表单数据
        function checkData() {
            var flag = true;
            var errorList = [];
            var p = ['name', 'pictures'];
            for (var i = 0; i < p.length; i++) {
                var name = p[i];
                var value = this.data[name];
                if (value === "" || Array.isArray(value) && value.length === 0) {
                    flag = false;
                    errorList.push(name);
                }
            }
            return [flag, errorList];
        }

        // 显示错误提示
        function showError(node, msg) {
            node.textContent = msg;
        }

        // 扩展原型
        App.Extend(SubmitWorks.prototype, App.ChangeClass, {
            init: init,
            getFormData: getFormData,
            checkData: checkData,
            showError: showError,
        });
        // 暴露接口
        App.SubmitWorks = SubmitWorks;
    }

)();
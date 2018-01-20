// 作品列表组件
(function () {
    function WorkList(option) {
        App.Extend(this, option);
        // 缓存节点
    }

    function renderList(data) {
        if(data.length === 0){
            this.container.innerHTML = '<span class="empty">你还没有上传任何作品呢~</span>';
            return;
        }
        var html = '';
        var tmplate = '<li>\n' +
            '                <a class="item" data-id="{{id}}" style="background:#eee url({{coverUrl}}) 50% 0/auto 100%;">\n' +
            '                    <span class="name">{{name}}</span>\n' +
            '                    <div class="menu">\n' +
            '                        <i class="edit"></i>\n' +
            '                        <i class="delete"></i>\n' +
            '                    </div>\n' +
            '                </a>\n' +
            '            </li>\n';
        for (var i = 0; i < data.length; i++) {
            html += App.TemplateRender(tmplate, data[i]);
        }
        App.HTML2Node.html2node(html, this.container);
    }

    // 初始化组件
    function init() {
        // 渲染列表
        // this.getWorksList(this.renderList.bind(this));
        // 添加鼠标事件
        this.container.addEventListener('click', function (ev) {
            var node = ev.target;
            // 对应节点执行对应方法
            var method = this.method[node.className];
            if (method) {
                ev.preventDefault();
                method.call(this, node, ev);
            }
        }.bind(this));
    }

    // 获取作品列表
    // function getWorksList(callback) {
    //     var setting = {
    //         method: 'get',
    //         url: this.url,
    //         success: function (callback, data) {
    //             data = JSON.parse(data);
    //             if (data.code == 200) {
    //                 callback(data.result.data);
    //             }
    //
    //         }.bind(this, callback),
    //     };
    //     App.Ajax(setting);
    // }

    // 创建节点对应方法,method的属性名为节点className属性
    function method() {
        var o = {};
        o['delete'] = function (node) {
            var id = node.parentNode.parentNode.getAttribute('data-id');
            var name = node.parentNode.previousElementSibling;
            var data = {
                title: '提示消息：',
                content: '确认要删除<span class="hl">"' + name.textContent + '"</span>吗？'
            };
            var modal = new App.Modal(data);
            modal.on('confirm', function () {
                this.deleteWork(id, name);
                modal.exit();
                modal = null;
            }.bind(this));
            modal.on('cancel', function () {
                modal.exit();
                modal = null;
            }.bind(this));
            modal.init();
            modal.showModal();
        };
        o['edit'] = function (node) {
            var id = node.parentNode.parentNode.getAttribute('data-id');
            var name = node.parentNode.previousElementSibling;
            var data = {
                title: '提示消息：',
                content: '请输入新的作品名称：<input>',
            };
            var modal = new App.Modal(data);
            modal.on('confirm', function () {
                // 获取输入内容
                var inputContent = modal.node.container.getElementsByTagName('input')[0].value;
                if (name.textContent !== inputContent) {
                    this.editWork(id, name, inputContent);
                }
                modal.exit();
                modal = null;
            }.bind(this));
            modal.on('cancel', function () {
                modal.exit();
                modal = null;
            }.bind(this));
            modal.init();
            modal.showModal();
        };
        return o;
    }

    // 删除作品
    function deleteWork(id) {
        var setting = {
            method: "delete",
            url: 'http://localhost:8002/api/works/' + id,
            success: function (data) {
                data = JSON.parse(data);
                if (data.code === 200) {
                    this.emit('refresh');
                }
            }.bind(this)
        };
        App.Ajax(setting);
    }

    // 编辑作品
    function editWork(id, name, inputContent) {
        var setting = {
            method: "PATCH",
            url: 'http://localhost:8002/api/works/' + id,
            data: JSON.stringify({"name": inputContent}),
            success: function (name, data) {
                data = JSON.parse(data);
                if (data.code === 200) {
                    name.textContent = data.result.name;
                }
            }.bind(this, name)
        };
        App.Ajax(setting);
    }

    // 加载中gif
    function loading() {
        var img = '<img class="loading" src="/res/img/loading.gif">';
        this.container.innerHTML = img;
    }

    // 扩展原型
    App.Extend(WorkList.prototype, App.Emitter, {
        renderList: renderList,
        init: init,
        // getWorksList: getWorksList,
        deleteWork: deleteWork,
        method: method(),
        editWork: editWork,
        loading: loading,
    });
    // 暴露接口
    App.WorkList = WorkList;
})();
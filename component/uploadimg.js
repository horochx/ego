// 上传图片组件
(function () {
    /**
     * 组件构造函数
     * @param options
     * @param options.upload
     * @param options.preview
     * @param options.countLimit
     * @param options.sizeLimit
     * @constructor
     */
    function UploadImg(options) {
        App.Extend(this, options);
        // // 测试用数据
        // this.countLimit = this.countLimit || 10;
        // this.sizeLimit = this.sizeLimit || 10;
        // 缓存数据
        this.files = [];
        this.files.length = this.countLimit + 1;//this.files的最后一个键值用于获取首个li节点(作为封面的节点)的信息
        this.files[this.files.length - 1] = function () {
            var tmpNode = this.preview.firstElementChild;
            var index = tmpNode ? tmpNode.getAttribute('data-index') : null;
            if (index) {
                return this.files[index][1];
            }
            else {
                return null;
            }
        }.bind(this);
    }

    // 初始化组件
    function init() {
        // 自动上传图片
        this.upload.addEventListener('change', function () {
            var filesList = this.upload.files;
            if (!this.checkFileList(filesList)) {
                return;
            }
            // 禁用上传按钮
            this.addClass.call(this.upload, 'z-disable');
            this.upload.disable = true;
            // 依次遍历文件列表
            filesList = Array.prototype.slice.call(filesList, 0);
            this.renderList(filesList);
        }.bind(this));
        // 添加删除图片、设置封面的交互
        this.preview.addEventListener('click', function (event) {
            var target = event.target;
            // 删除图片交互
            if (target.tagName === 'I') {
                // 获取li节点
                var tmpNode = target.parentNode.parentNode.parentNode;
                var index = tmpNode.getAttribute('data-index');
                // 中断xhr请求
                if (this.files[index][1].abort) {
                    this.files[index][1].abort();
                }
                // 删除DOM节点
                this.preview.removeChild(tmpNode);
                // 删除图片记录
                this.files[index] = undefined;
            }
            // 设置封面交互
            else if (target.tagName === "SPAN") {
                // 获取li节点
                var tmpNode = target.parentNode.parentNode;
                var index = tmpNode.getAttribute('data-index');
                // 插入空白节点
                var white = document.createTextNode('\n');
                this.preview.insertBefore(white, this.preview.firstElementChild);
                // 将点击的节点放置到首位
                this.preview.insertBefore(tmpNode, this.preview.firstChild);
            }
            else {
                return;
            }
        }.bind(this));
        // 允许拖拽上传
        this.preview.parentNode.addEventListener('dragover', function (event) {
            event.preventDefault();
            // 添加文件拖拽悬浮时的样式
            this.addClass.call(this.preview.parentNode, 'z-target');
        }.bind(this));
        this.preview.parentNode.addEventListener('drop', function (event) {
            event.preventDefault();
            // 删除文件拖拽悬浮时的样式
            this.removeClass.call(this.preview.parentNode, 'z-target');
            // 如果当前上传按钮是禁用状态，拖动上传无效
            if (this.upload.disabel === true) {
                return;
            }
            var filesList = event.dataTransfer.files;
            if (!this.checkFileList(filesList)) {
                return;
            }
            // 禁用上传按钮
            this.addClass.call(this.upload, 'z-disable');
            this.upload.disable = true;
            // 依次遍历文件列表
            filesList = Array.prototype.slice.call(filesList, 0);
            this.renderList(filesList);
        }.bind(this));
        this.preview.parentNode.addEventListener('dragleave', function (event) {
            event.preventDefault();
            // 删除文件拖拽悬浮时的样式
            this.removeClass.call(this.preview.parentNode, 'z-target');
        }.bind(this));
    }

    // 测试文件是否符合规范
    function checkFileList(filesList) {
        // 判断上传的文件数量是否超过限制值
        var length = 0;
        for (var i = 0; i < this.files.length - 1; i++) {
            if (this.files[i] !== undefined) {
                length++;
            }
        }
        if (filesList.length + length > this.countLimit) {
            // alert('图片数量超过限制，请删除部分图片后重试');
            displayErrorInfo('图片数量超过限制，请删除部分图片后重试');
            return false;
        }
        // 判断是否包含非图片文件、文件大小是否超过限制
        for (var i = 0; i < filesList.length; i++) {
            if (!/^image\//.test(filesList[i].type)) {
                // alert('抱歉，您上传的文件中包含非图片文件');
                displayErrorInfo('抱歉，您上传的文件中包含非图片文件');
                return false;
            }
            if (filesList[i].size > (1024 * 1024 * this.sizeLimit)) {
                // alert('抱歉，您上传的文件大小超过了限制');
                displayErrorInfo('抱歉，您上传的文件大小超过了限制');
                return false;
            }
        }
        // 通过检测
        return true;
    }

    // 输出错误信息
    function displayErrorInfo(content) {
        var modal = new App.Modal({
            title: '提示消息',
            content: content,
        });
        modal.on('confirm', function () {
            modal.exit();
            modal = null;
        }.bind(this));
        modal.on('cancel', function () {
            modal.exit();
            modal = null;
        }.bind(this));
        modal.init();
        modal.showModal();
    }

    // 依次遍历文件列表
    function renderList(filesList) {
        // 文件列表为空时重置上传按钮
        if (filesList.length === 0) {
            // 重置上传按钮
            this.upload.value = null;
            this.removeClass.call(this.upload, 'z-disable');
            this.upload.disable = false;
            return;
        }
        // 创建图片信息记录
        for (var index = 0; this.files[index] !== undefined; index++) {
        }
        this.files[index] = [];
        // 渲染本地预览图片
        var fileReader = new FileReader();
        var item = filesList.shift();
        fileReader.addEventListener('load', function (index, item, filesList, ev) {
            // 获取图片url
            var imgUrl = ev.target.result;
            // 在preview节点中渲染图片
            this.renderImg(imgUrl, index);
            // 上传图片
            this.uploadFile(index, item);
            // 渲染下一张图片
            this.renderList(filesList);
        }.bind(this, index, item, filesList));
        fileReader.readAsDataURL(item);
    }

    // 图片上传
    function uploadFile(index, item) {
        var data = new FormData();
        data.append('file', item, item.name);
        // 创建Ajax请求
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        // 监听进度
        xhr.upload.addEventListener('progress', function (index, ev) {
            var percentComplete = ev.loaded / ev.total;
            // 刷新进度条
            var progress = this.files[index][0].getElementsByTagName('progress')[0];
            progress.value = percentComplete;
        }.bind(this, index));
        xhr.addEventListener('readystatechange', function (index, ev) {
            var target = ev.currentTarget;
            if (target.readyState === target.DONE) {
                var tmpData = JSON.parse(target.responseText);
                // 缓存返回数据
                this.files[index][1] = tmpData.result;
                // 清除上传动画
                this.removeClass.call(this.files[index][0], 'z-uploading')
            }
        }.bind(this, index));
        xhr.open('post', '/api/works?upload');
        // 缓存xhr对象用于中断请求
        this.files[index][1] = xhr;
        // 发送请求
        xhr.send(data);
    }

    // 渲染单张图片
    function renderImg(url, index) {
        var html = '<li class="z-uploading" data-index="' + index + '">\n' +
            '                    <div class="img"\n' +
            '                         style="background:#eee url(' + url + ') 50% 0/auto 100%;">\n' +
            '                        <div class="menu"><i class="delete"></i><progress class="progress" max="1"></progress></div>\n' +
            '                    </div>\n' +
            '                    <div class="wrap"><span class="btn btn-4">设为封面</span></div>\n' +
            '                </li>';
        var tmpNode = this.html2node(html).firstElementChild;
        var white = document.createTextNode('\n');
        this.preview.appendChild(white);
        // 记录节点到this.files
        this.files[index][0] = tmpNode;
        // 将节点插入DOM树
        this.preview.appendChild(tmpNode);
    }

    // 扩展原型
    App.Extend(UploadImg.prototype, App.HTML2Node, App.ChangeClass, {
        init: init,
        renderImg: renderImg,
        renderList: renderList,
        uploadFile: uploadFile,
        checkFileList: checkFileList,
    });
    // 暴露接口
    App.UploadImg = UploadImg;
})();
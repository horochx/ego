// 推荐标签组件
(function () {
    /**
     * 组件构造函数
     * @param {object} options
     * @param {object} options.tags 选中的标签列表
     * @param {object} options.item 推荐的标签列表
     * @constructor
     */
    function Tags(options) {
        App.Extend(this, options);
        // 缓存节点
        this.node = {};
        this.node.input = this.tags.querySelector('.tag_input');
    }

    function getDataAndRender(Render) {
        var setting = {
            url: '/api/tags?recommend',
            method: 'get',
            data: null,
            success: function (data) {
                data = JSON.parse(data);
                if (data.code === 200) {
                    Render(data.result);
                }
            },
        };
        App.Ajax(setting);
    }

    function Render(data) {
        data = data.split(',');
        var html = '';
        for (var i = 0; i < data.length; i++) {
            var tmp = '<span>+' + data[i] + '</span>\n';
            html += tmp;
        }
        this.html2node(html, this.item);
    }

    function init() {
        // 渲染推荐标签
        this.getDataAndRender(this.Render.bind(this));
        // 将推荐标签添加到标签列表
        this.item.addEventListener('click', function (event) {
            var item = event.target;
            if (item.tagName === 'SPAN') {
                var itemContent = item.innerText.slice(1);
                this.addTag(itemContent);
            }
        }.bind(this));
        // 删除标签
        this.tags.addEventListener('click', function (event) {
            var item = event.target;
            if (item.tagName === 'SPAN') {
                this.removeTag(item);
            }
        }.bind(this));
        // 创建自定义标签
        this.node.input.addEventListener('blur', function (event) {
            var itemContent = event.target.value;
            event.target.value = null;
            // 清除开头和结尾的空格、合并连续的空格
            itemContent = itemContent.replace(/^\s*(.*?)\s*$/, function () {
                return arguments[1].replace(/\s{2,}/g, " ");
            });
            if (itemContent !== "") {
                this.addTag(itemContent);
            }
        }.bind(this));
        // 回车完成自定义标签
        this.node.input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.blur();
            }
        })
    }

    function removeTag(item) {
        this.tags.removeChild(item);
        var itemContent = item.innerText;
        var index = this.tagsContent.indexOf(itemContent);
        if (index !== -1) {
            this.tagsContent.splice(index);
        }
    }

    function addTag(itemContent) {
        this.tagsContent = this.tagsContent || [];
        if (this.tagsContent.indexOf(itemContent) === -1) {
            this.tagsContent.push(itemContent);
            var tmpNode = document.createElement('span');
            tmpNode.innerText = itemContent;
            this.tags.insertBefore(tmpNode, this.tags.lastElementChild);
        }
    }

    // 扩展原型
    App.Extend(Tags.prototype, App.HTML2Node, {
        getDataAndRender: getDataAndRender,
        init: init,
        Render: Render,
        addTag: addTag,
        removeTag: removeTag,
    });
    // 暴露接口
    App.Tags = Tags;
})();
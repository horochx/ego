// 普通弹窗
(function () {
    var TEMPLATE = '<div class="m-modal">\n' +
        '    <div class="m-normal">\n' +
        '        <span class="tt hl">{{title}}</span><i class="exit"></i>\n' +
        '        <div class="hr"></div>\n' +
        '        <div class="content">{{content}}</div>\n' +
        '        <div class="btn  f-center-x">\n' +
        '            <span class="confirm">确认</span>\n' +
        '            <span class="cancel">取消</span>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';

    function Modal(option) {
        var template = App.TemplateRender(TEMPLATE, option);
        // 缓存节点
        this.node = {};
        this.node.container = this.html2node(template);
        this.node.exit = this.node.container.querySelector('.exit');
        this.node.confirm = this.node.container.querySelector('.confirm');
        this.node.cancel = this.node.container.querySelector('.cancel');
    }

    function init() {
        // 绑定鼠标事件
        this.node.container.addEventListener('click', function (ev) {
            var node = ev.target;
            node === this.node.exit ? this.exit() : node;
            node === this.node.confirm ? this.emit('confirm') : node;
            node === this.node.cancel ? this.emit('cancel') : node;
        }.bind(this));
    }

    function showModal() {
        document.body.appendChild(this.node.container);
    }

    function exit() {
        document.body.removeChild(this.node.container);
    }

    App.Extend(Modal.prototype, App.HTML2Node, App.Emitter, {
        init: init,
        showModal: showModal,
        exit: exit,
    })
    App.Modal = Modal;
})();
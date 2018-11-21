$(function () {
    var letao = function () {};
    letao.prototype = {
        /* 更新逻辑 */
        refresh: function () {
            if (localStorage.getItem('key')) {
                var json = localStorage.getItem('key');
                arr = JSON.parse(json);
            } else {
                arr = [];
            };
            var html = template('searchTpl', {
                list: arr
            });
            $('.search-bottom').html(html);
            return this;
        },
        /* 搜索逻辑 */
        search: function () {
            $('.btn-search').on('tap', function () {
                var text = $.trim($('.search-text').val());
                if (text == '') {
                    alert('内容不能为空');
                    return;
                }
                if (localStorage.getItem('key')) {
                    var json = localStorage.getItem('key');
                    arr = JSON.parse(json);
                } else {
                    arr = [];
                }
                if (arr.indexOf($('.search-text').val()) != -1) {
                    arr.splice(arr.indexOf($('.search-text').val()), 1);
                }
                arr.unshift($('.search-text').val());
                localStorage.setItem('key', JSON.stringify(arr));
                $('.search-text').val('');
                var html = template('searchTpl', {
                    list: arr
                });
                $('.search-bottom').html(html);
            });
            return this;
        },
        /* 清空逻辑 */
        clear: function () {
            $('.search-remove').on('tap', () => {
                if (localStorage.getItem('key')) {
                    localStorage.removeItem('key');
                    this.refresh();
                }
            })
            return this;
        },
        /* 单行删除逻辑 */
        del: function () {
            $('.search-bottom').on('tap', '.btn-del', () => {
                var id = $(this).data('id');
                var json = localStorage.getItem('key');
                var arr = JSON.parse(json);
                arr.splice(id, 1);
                localStorage.setItem('key', JSON.stringify(arr));
                this.refresh();
            });
            return this;
        }
    };
    var Letao = new letao();
    Letao.refresh().search().clear().del();
})
$(function () {
    var Letao = new letao();
    Letao.selectUser();
    Letao.selectPaginator();
    Letao.status();
});
var letao = function () {};
letao.prototype = {
    page: 1,
    pageSize: 7,
    totalPage: 1,
    /* 查询用户 */
    selectUser: function () {
        var that = this;
        $.ajax({
            url: '/user/queryUser',
            data: {
                page: that.page,
                pageSize: that.pageSize
            },
            success: function (obj) {
                console.log(obj);
                var html = template('tableTpl', obj);
                $('.tb').html(html);
                that.totalPage = Math.ceil(obj.total / that.pageSize);
                // console.log(that.totalPage);
                that.selectPaginator();
            }
        })
    },
    /* 分页功能 */
    selectPaginator: function () {
        var that = this;
        $("#page").bootstrapPaginator({
            bootstrapMajorVersion: 3, //对应的bootstrap版本
            currentPage: that.page, //当前页数
            numberOfPages: that.pageSize, //每次显示页数
            totalPages: that.totalPage, //总页数
            shouldShowPage: true, //是否显示该按钮
            useBootstrapTooltip: true,
            //点击事件
            onPageClicked: function (event, originalEvent, type, page) {
                // console.log(page);
                that.page = page;
                that.selectUser();
            }
        });
    },
    /* 禁用及启用 */
    status: function () {
        var that = this;
        $('.right').on('click', '.btn-status', function () {
            var id = $(this).data('id');
            var Delete = $(this).data('delete');
            Delete = Delete == 1 ? 0 : 1;
            $(this).data('delete', Delete);
            // console.log(Delete);
            $.ajax({
                url: '/user/updateUser',
                type: 'post',
                data: {
                    id: id,
                    isDelete: Delete
                },
                success: function (obj) {
                    if (obj.success) {
                        that.selectUser();
                    }
                }
            })
        })
    }
}
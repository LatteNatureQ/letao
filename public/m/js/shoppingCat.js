$(function () {
    $.ajax({
        url: '/user/queryUserMessage',
        success: function (obj) {
            // console.log(obj);
            if (obj.error == 400) {
                location = '/m/login.html';
            }
        }
    })
    var page = 1;
    var pageSize = 5;
    var num = 0;
    /* 渲染数据 */
    refresh();
    /* 下拉刷新,上拉加载 */
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            up: {
                height: 50, //可选.默认50.触发上拉加载拖动距离
                auto: false, //可选,默认false.自动上拉加载一次
                contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {
                    page++;
                    $.ajax({
                        url: '/cart/queryCartPaging',
                        dataType: 'json',
                        data: {
                            page: page,
                            pageSize: pageSize
                        },
                        success: function (obj) {
                            console.log(obj);
                            if (Array.isArray(obj)) {
                                obj = {
                                    data: []
                                }
                            }
                            var html = template('shoppingTpl', obj);
                            $('.uul').append(html);
                            if (obj.data.length > 0) {
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                            } else {
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                            }
                        }
                    });
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });
    /* 订单总额 */
    $('#main').on('tap', '.shopping-check', function () {
        if (!$(this).prop('checked')) {
            num += $(this).val() * $(this).data('num');
        } else {
            num -= $(this).val() * $(this).data('num');
        }
        $('.price').text(num.toFixed(2));
    });
    /* 删除购物车记录 */
    $('#main').on('tap', '.btn-del', function () {
        var id = $(this).data('id');
        var elem = this;
        var li = elem.parentNode.parentNode;
        mui.confirm('是否删除', '温馨提示', ['确定', '取消'], function (e) {
            if (e.index == 0) {
                $.ajax({
                    url: '/cart/deleteCart',
                    data: {
                        id: id
                    },
                    success: function () {
                        refresh();
                    }
                })
            } else {
                mui.swipeoutClose(li);
            }
        })
    });
    /* 编辑购物车 */
    $('#main').on('tap', '.btn-edit', function () {
        var elem = this;
        var li = elem.parentNode.parentNode;
        var obj = $(this).data('info');
        var id = $(this).data('id');
        console.log(obj);
        console.log(id);
        var num = obj.productSize.split('-');
        var arr = [];
        console.log(num);
        for (var i = num[0] - 0; i <= num[1] - 0; i++) {
            arr.push(i);
        };
        obj.num1 = arr;
        var html = template('infoTpl', obj);
        html = html.replace(/\r|\n/g, '');
        mui.confirm(html, '编辑商品标题', ['确定', '取消'], function (e) {
            console.log(e);
            if (e.index == 0) {
                var num = $('.btn-num').val();
                var size = $('.btn-active.active').data('num');
                $.ajax({
                    url: '/cart/updateCart',
                    type: 'post',
                    data: {
                        id: id,
                        size: size,
                        num: num
                    },
                    success: function (obj) {
                        if (obj.success) {
                            refresh();
                        }
                    }
                })
            } else {
                mui.swipeoutClose(li);
            }
        })
        mui('.mui-numbox').numbox();
        /* 按钮点击排它逻辑 */
        $('.mui-popup').on('tap', '.btn-active', function () {
            console.log(this);
            $(this).addClass('active').siblings().removeClass('active');
        });
    })
})

/* 渲染购物车数据封装 */
function refresh() {
    page = 1;
    pageSize = 5;
    $.ajax({
        url: '/cart/queryCartPaging',
        dataType: 'json',
        data: {
            page: page,
            pageSize: pageSize
        },
        success: function (obj) {
            console.log(obj);
            var html = template('shoppingTpl', obj);
            $('.uul').html(html);
        }
    });
}
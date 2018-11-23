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
            $('.mui-card').html(html);
        }
    });
    /* 下拉刷新,上拉加载 */
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            // down: {
            //     height: 50, //可选,默认50.触发下拉刷新拖动距离,
            //     auto: false, //可选,默认false.首次加载自动下拉刷新一次
            //     contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            //     contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            //     contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            //     callback: function () {
            //         page = 1;
            //         $.ajax({
            //             url: '/cart/queryCartPaging',
            //             dataType: 'json',
            //             data: {
            //                 page: page,
            //                 pageSize: pageSize,
            //             },
            //             success: function (obj) {
            //                 var html = template('shoppingTpl', obj);
            //                 $('.mui-card').html(html);
            //                 mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            //                 mui('#refreshContainer').pullRefresh().refresh(true);
            //             }
            //         });
            //     } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            // },
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
                            var html = template('shoppingTpl', obj);
                            $('.mui-card').append(html);
                            if (page * pageSize >= obj.count) {
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                return false;
                            }
                            if (obj.data.length > 0) {
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                            };
                        }
                    });
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });
    /* 订单总额 */
    $('#main').on('tap', '.shopping-check', function () {
        // console.log($(this).val());
        if (!$(this).prop('checked')) {
            num += $(this).val() * $(this).data('num') - 0;
        } else {
            num -= $(this).val() * $(this).data('num') - 0;
        }
        $('.price').text(num.toFixed(2));
    });

})
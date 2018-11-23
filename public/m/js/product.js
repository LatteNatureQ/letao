$(function () {
    refresh(productName);
    /* 搜索逻辑 */
    $('.btn-search').on('tap', function () {
        var text = $('.search-text').val().trim();
        if (text == '') {
            alert('文本框不能为空');
            return false;
        };
        $('.search-text').val('');
        refresh(text);
    });
    /* 排序逻辑 */
    $('.order').on('tap', function () {
        var price = $(this).data('price');
        var num = $(this).data('num');
        price = price == 2 ? 1 : 2;
        if ($(this).data('price')) {
            $(this).data('price', price);
            refresh(productName, price, '');
        }
        num = num == 2 ? 1 : 2;
        if ($(this).data('num')) {
            $(this).data('num', num);
            refresh(productName, '', num);
        }
    });
    /* 跳转到详情页 */
    $('.product-Pay').on('tap', '.product-buy', function () {
        var id = $(this).data('id');
        // console.log(id);
        location = '/m/detail.html?id=' + id;
    })
})
var page = 1;
/* 查询url参数的封装 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
var productName = getQueryString('search');

/* ajax查询数据的封装 */
function refresh(name, price, num, page, add) {
    // console.log(page);
    var up = add || '';
    $.ajax({
        url: '/product/queryProduct',
        data: {
            proName: name,
            page: page || 1,
            pageSize: 2,
            price: price || '',
            num: num || '',
        },
        dataType: 'json',
        success: function (data) {
            callback(data, up);
        }
    })
};

/* 封装模板 */
function callback(data, add) {
    var html = template('productTpl', data);
    if (!add) {
        $('.product-Pay').html(html);
    }
    if (add == 'add') {
        $('.product-Pay').append(html);
        // console.log(page);
    }
}
/* 下拉上拉刷新 */
muiRefresh();

function muiRefresh() {
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                height: 50, //可选,默认50.触发下拉刷新拖动距离,
                auto: false, //可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    page = 1;
                    setTimeout(() => {
                        $.ajax({
                            url: '/product/queryProduct',
                            data: {
                                proName: productName,
                                page: page,
                                pageSize: 2,
                            },
                            dataType: 'json',
                            success: function (data) {
                                callback(data, '');
                                mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                                mui('#refreshContainer').pullRefresh().refresh(true);
                            }
                        })
                        // mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                    }, 1000);
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            up: {
                contentrefresh: "哥正在拼命加载中...",
                contentnomore: '我是有底线的',
                callback: function () {
                    page++;
                    setTimeout(() => {
                        $.ajax({
                            url: '/product/queryProduct',
                            data: {
                                proName: productName,
                                page: page,
                                pageSize: 2,
                            },
                            dataType: 'json',
                            success: function (data) {
                                callback(data, 'add');
                                // mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                            }
                        })
                        // mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                    }, 1000);
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });
}
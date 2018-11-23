$(function () {
    var productId = getQueryString('id');
    /* 渲染图片 */
    $.ajax({
        url: '/product/queryProductDetail',
        data: {
            id: productId
        },
        dataType: 'json',
        success: function (obj) {
            // console.log(obj);
            var html = template('imgTpl', obj);
            // console.log(html);
            $('#slide').html(html);
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 3000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
        }
    });
    /* 渲染信息 */
    $.ajax({
        url: '/product/queryProductDetail',
        data: {
            id: productId
        },
        dataType: 'json',
        success: function (obj) {
            var num = obj.size.split('-');
            var arr = [];
            console.log(num);
            for (var i = num[0] - 0; i <= num[1] - 0; i++) {
                arr.push(i);
            }
            obj.num1 = arr;
            var html = template('infoTpl', obj);
            $('.detail-info').html(html);
            mui('.mui-numbox').numbox()
        }
    });
    /* 按钮点击排它逻辑 */
    $('.detail-info').on('tap', '.btn-active', function () {
        $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
    });
    /* 下拉加载和下拉刷新初始化 */
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            // down: {
            //     height: 0, //可选,默认50.触发下拉刷新拖动距离,
            //     auto: false, //可选,默认false.首次加载自动下拉刷新一次
            //     contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            //     contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            //     contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            //     callback: function () {
            //         console.log(111);
            //     } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            // }
        }
    });
    /* 加入购物逻辑 */
    $('.btn-add-cart').on('tap', function () {
        if ($('.btn-active.mui-btn-warning').length > 0) {
            var size = $('.btn-active.mui-btn-warning').text();
        } else {
            mui.alert('请输入尺寸', '温馨提示', '确定');
            return false;
        };
        var num = $('.btn-num').val();
        if (num == 0) {
            mui.alert('请输入商品数量', '温馨提示', '确定');
            return false;
        }
        /* 判断用户是否已经登录 */
        $.ajax({
            url: '/user/queryUserMessage',
            success: function (obj) {
                if (obj.error == 400) {
                    location = '/m/login.html';
                    return false;
                } else {
                    mui.confirm('是否跳转到购物车查看', '温馨提示', ['yes', 'no'], function (e) {
                        $.ajax({
                            url: '/cart/updateCart',
                            type: 'post',
                            data: {
                                id: productId,
                                size: size,
                                num: num
                            },
                            success: function (obj) {
                                console.log(obj);
                            }
                        });
                        if (e.index == 0) {
                            location = '/m/shoppingCat.html';
                        }
                    })
                }
            }
        });
    });
})
/* 查询url参数的封装 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
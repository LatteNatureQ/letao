$(function () {
    /* 获取用户信息 */
    $.ajax({
        url: '/user/queryUserMessage',
        success: function (obj) {
            if (obj.error == 400) {
                location = '/m/login.html';
                return false;
            }
            var html = template('userTpl', obj);
            $('.mui-card-header').html(html);
        }
    });
    /* 登出 */
    $('.loginOut').on('tap', function () {
        $.ajax({
            url: '/user/logout',
            success: function (obj) {
                console.log(obj);
                if (obj.success) {
                    location = '/m/login.html';
                }
            }
        });
    })
})
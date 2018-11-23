$(function () {
    /* 登录逻辑 */
    $('.btn-login').on('tap', function () {
        if (!$('.user-name').val()) {
            mui.alert('用户名不能为空', '温馨提示', '确定');
            return false;
        };
        if (!$('.user-password').val()) {
            mui.alert('用户密码', '温馨提示', '确定');
            return false;
        };
        var userName = $('.user-name').val();
        var userPassword = $('.user-password').val();
        $.ajax({
            url: '/user/login',
            type: 'post',
            data: {
                username: userName,
                password: userPassword,
            },
            success: function (obj) {
                if (obj.success == true) {
                    sessionStorage.setItem('userName', userName);
                    sessionStorage.setItem('passWord', userPassword);
                    history.back();
                } else if (obj.error == 403) {
                    mui.alert('用户名或密码错误', '温馨提示', '确定');
                };
            }
        })
    });
    /* 注册逻辑 */
    $('.btn-register').on('tap',function(){
        location = '/m/register.html';
    })
})
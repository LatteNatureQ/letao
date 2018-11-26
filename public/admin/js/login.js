$(function () {
    var Letao = new letao();
    Letao.doLogin();
});
var letao = function () {};
letao.prototype = {
    /* 查询逻辑 */
    doLogin: function () {
        $('.btn-login').on('click', function () {
            if ($('.user-name').val() == '' || $('.user-password').val() == '') {
                alert('账号或密码不能为空');
                return false;
            };
            var userName = $('.user-name').val();
            var userPassword = $('.user-password').val();
            $.ajax({
                url: '/employee/employeeLogin',
                type: 'post',
                data: {
                    username: userName,
                    password: userPassword
                },
                success: function (obj) {
                    if (obj.error) {
                        alert(obj.message);
                    };
                    if (obj.success) {
                        location = '/admin/index.html';
                    }
                }
            })
        })
    }
}
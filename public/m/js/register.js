$(function () {
    /* 获取验证码逻辑 */
    var vCode;
    $('.btn-getvCode').on('tap', function () {
        if (!$('.user-tel').val()) {
            mui.alert('请先输入手机号码', '温馨提示', '确定');
        } else {
            $.ajax({
                url: '/user/vCode',
                success: function (obj) {
                    vCode = obj.vCode;
                    console.log(vCode);
                }
            })
        }
    });
    /* 注册逻辑 */
    $('.btn-register').on('tap', function () {
        var check = true;
        mui(".mui-input-group input").each(function () {
            //若当前input为空，则alert提醒 
            if (!this.value || this.value.trim() == "") {
                var label = this.previousElementSibling;
                mui.alert(label.innerText + "不允许为空");
                check = false;
                return false;
            }
        });
        //校验通过，继续执行业务逻辑 
        if (check) {
            var userName = $('.user-name').val();
            var userTel = $('.user-tel').val();
            var firstPassword = $('.user-password1').val();
            var secondPassword = $('.user-password2').val();
            /* 手机号码正则判断 */
            if (!(/^1[3,4,5,6,7,8,9]\d{9}$/.test(userTel))) {
                mui.alert('请输入正确的手机号码', '温馨提示', '确定');
                return false;
            }
            /* 密码判断 */
            if (firstPassword != secondPassword) {
                mui.alert('两次密码输入不一致', '温馨提示', '确定');
                return false;
            }
            /* 校验注册逻辑 */
            $.ajax({
                url: '/user/register',
                type: 'post',
                data: {
                    username: userName,
                    password: firstPassword,
                    mobile: userTel,
                    vCode: vCode,
                },
                success: function (obj) {
                    if (obj.success) {
                        history.back();
                        sessionStorage.setItem('user', userName);
                        sessionStorage.setItem('pwd', firstPassword);
                    } else {
                        mui.alert('注册失败', '温馨提示', '确定');
                    }
                }
            })
        }
    });
})
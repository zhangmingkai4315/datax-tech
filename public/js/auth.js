const validEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const signupValidation = () => {
  $('#error_msg').text('');
  const emailVal = $.trim($('#email').val())
  const password = $.trim($('#password').val())
  const password2 = $.trim($('#password2').val())
  const username = $.trim($('#username').val())
  if (emailVal === '' || password === '' || password2 === '') {
    $('#error_msg').text('输入信息不能为空');
    return false;
  }
  if (!validEmail(emailVal)) {
    $('#error_msg').text('邮箱格式输入无法验证');
    return false;
  }
  if (username === '') {
    $('#error_msg').text('用户名不能为空');
    return false;
  }
  if (password !== password2) {
    $('#error_msg').text('两次输入密码不一致');
    return false;
  }
  if (password.length < 6) {
    $('#error_msg').text('密码长度不能小于6位');
    return false;
  }
  return true;
};

const loginValidation = () => {
  $('#error_msg').text('');
  const emailVal = $.trim($('#email').val())
  const password = $.trim($('#password').val())

  if (emailVal === '' || password === '') {
    $('#error_msg').text('输入信息不能为空');
    return false;
  }
  if (!validEmail(emailVal)) {
    $('#error_msg').text('邮箱格式输入无法验证');
    return false;
  }
  if (password.length < 6) {
    $('#error_msg').text('密码长度不能小于6位');
    return false;
  }
  return true;
};

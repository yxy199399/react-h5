const Validator = {};

// 匹配手机号码格式
Validator.isMobilePhone = s => /^\d+$/.test(s);

// 匹配短信验证码
Validator.isSmsCaptcha = s => /^\d{6}$/.test(s);

// 匹配图片验证码
Validator.isImgCaptcha = s => /^[0-9a-zA-Z]{4}$/.test(s);

export default Validator;

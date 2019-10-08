const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const strMapToObj = strMap => {
  let obj = Object.create(null)
  for (let [k, v] of strMap) {
    obj[k] = v
  }
  return obj
}


//验证方法
const appValidate = {
  isNullOrEmpty: function (value) {
    if (value === null || value === undefined) {
      return true;
    } else {
      return value.constructor === String && value === "";
    }
  },
  checkIdentityCode: function (code) {
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var tip = "";
    var pass = true;

    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
      tip = "身份证号格式错误";
      pass = false;
    }

    else if (!city[code.substr(0, 2)]) {
      tip = "地址编码错误";
      pass = false;
    }
    else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        var last = parity[sum % 11];
        if (parity[sum % 11] != code[17]) {
          tip = "校验位错误";
          pass = false;
        }
      }
    }
    //if (!pass) alert(tip);
    return pass;
  },
  checkNotNumber: function (value, tag) {//检验是否不是数字
    if (tag == 'required') {
      if (this.checkEmpty(value)) {
        return true;
      } else {
        return isNaN(value) || value < 1;
      }
    } else {
      if (this.checkEmpty(value)) {
        return false;
      } else {
        return isNaN(value) || value < 1;
      }
    }
  },
  checkDateIsOld: function (value) {//检验格式为'2017-01-02'的日期是否大于等于今天
    if (this.checkEmpty(value)) {
      return true;
    } else {
      var nowTime = new Date();
      var time1 = new Date(parseInt(value.substr(0, 4)), parseInt(value.substr(5, 2)) - 1, parseInt(value.substr(8, 2)), 0, 0, 0);
      var time2 = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), 0, 0, 0);
      if (time2.getTime() > time1.getTime()) {
        return true;
      } else {
        return false;
      }
    }
  },
  checkNotEmail: function (value) {
    if (!value || !(value.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)) {
      return true;
    } else {
      return false;
    }
  }
}


module.exports = {
  formatTime: formatTime,
  strMapToObj: strMapToObj,
  appValidate: appValidate
}

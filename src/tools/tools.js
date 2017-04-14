/**
 * Created by focus on 2017/4/13.
 */

export default {
    phoneReg: /^0?1[3|4|5|7|8][0-9]\d{8}$/,

    objToUrl: function (obj) {
        let strAry = [];
        for (let k in obj) {
            strAry.push(k + "=" + obj[k]);
        }
        return strAry.join("&");
    },
    createForm: function (form) {
        let dlform = document.createElement('form');
        dlform.style = "display:none;";
        dlform.method = form.method;
        dlform.action = form.action;
        for (let k in form.data) {
            let hdnFilePath = document.createElement('input');
            hdnFilePath.type = 'hidden';
            hdnFilePath.name = k;
            hdnFilePath.value = form.data[k];
            dlform.appendChild(hdnFilePath);
        }
        document.body.appendChild(dlform);
        dlform.submit();
        document.body.removeChild(dlform);
    },
    versions: function () {
        let u = navigator.userAgent;
        let c = navigator.userAgent.toLowerCase();
        return {         //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weChat: c.match(/MicroMessenger/i) == "micromessenger" ? true : false
        };
    }
}
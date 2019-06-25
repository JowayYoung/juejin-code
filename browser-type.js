export default function BrowserType() {
	// 权重：系统 + 系统版本 > 平台 > 内核 + 载体 + 内核版本 + 载体版本 > 外壳 + 外壳版本
	const ua = navigator.userAgent.toLowerCase();
	const testUa = regexp => regexp.test(ua);
	const testVs = regexp => (ua.match(regexp) + "")
		.replace(/[^0-9|_.]/ig, "")
		.replace(/_/ig, ".");
	// 系统
	let system = "unknown";
	if (testUa(/windows|win32|win64|wow32|wow64/ig)) {
		system = "windows"; // window系统
	} else if (testUa(/macintosh|macintel/ig)) {
		system = "osx"; // osx系统
	} else if (testUa(/x11/ig)) {
		system = "linux"; // linux系统
	} else if (testUa(/android|adr/ig)) {
		system = "android"; // android系统
	} else if (testUa(/ios|iphone|ipad|ipod|iwatch/ig)) {
		system = "ios"; // ios系统
	}
	// 系统版本
	let systemVs = "unknown";
	if (system === "windows") {
		if (testUa(/windows nt 5.0|windows 2000/ig)) {
			systemVs = "2000";
		} else if (testUa(/windows nt 5.1|windows xp/ig)) {
			systemVs = "xp";
		} else if (testUa(/windows nt 5.2|windows 2003/ig)) {
			systemVs = "2003";
		} else if (testUa(/windows nt 6.0|windows vista/ig)) {
			systemVs = "vista";
		} else if (testUa(/windows nt 6.1|windows 7/ig)) {
			systemVs = "7";
		} else if (testUa(/windows nt 6.2|windows 8/ig)) {
			systemVs = "8";
		} else if (testUa(/windows nt 6.3|windows 8.1/ig)) {
			systemVs = "8.1";
		} else if (testUa(/windows nt 10.0|windows 10/ig)) {
			systemVs = "10";
		}
	} else if (system === "osx") {
		systemVs = testVs(/os x [\d._]+/ig);
	} else if (system === "android") {
		systemVs = testVs(/android [\d._]+/ig);
	} else if (system === "ios") {
		systemVs = testVs(/os [\d._]+/ig);
	}
	// 平台
	let platform = "unknow";
	if (system === "windows" || system === "osx" || system === "linux") {
		platform = "desktop"; // 桌面端
	} else if (system === "android" || system === "ios" || testUa(/mobile/ig)) {
		platform = "mobile"; // 移动端
	}
	// 内核和载体
	let engine = "unknow";
	let supporter = "unknow";
	if (testUa(/applewebkit/ig) && testUa(/safari/ig)) {
		engine = "webkit"; // webkit内核
		if (testUa(/edge/ig)) {
			supporter = "edge"; // edge浏览器
		} else if (testUa(/opr/ig)) {
			supporter = "opera"; // opera浏览器
		} else if (testUa(/chrome/ig)) {
			supporter = "chrome"; // chrome浏览器
		} else {
			supporter = "safari"; // safari浏览器
		}
	} else if (testUa(/gecko/ig) && testUa(/firefox/ig)) {
		engine = "gecko"; // gecko内核
		supporter = "firefox"; // firefox浏览器
	} else if (testUa(/presto/ig)) {
		engine = "presto"; // presto内核
		supporter = "opera"; // opera浏览器
	} else if (testUa(/trident|compatible|msie/ig)) {
		engine = "trident"; // trident内核
		supporter = "iexplore"; // iexplore浏览器
	}
	// 内核版本
	let engineVs = "unknow";
	if (engine === "webkit") {
		engineVs = testVs(/applewebkit\/[\d.]+/ig);
	} else if (engine === "gecko") {
		engineVs = testVs(/gecko\/[\d.]+/ig);
	} else if (engine === "presto") {
		engineVs = testVs(/presto\/[\d.]+/ig);
	} else if (engine === "trident") {
		engineVs = testVs(/trident\/[\d.]+/ig);
	}
	// 载体版本
	let supporterVs = "unknow";
	if (supporter === "chrome") {
		supporterVs = testVs(/chrome\/[\d.]+/ig);
	} else if (supporter === "safari") {
		supporterVs = testVs(/version\/[\d.]+/ig);
	} else if (supporter === "firefox") {
		supporterVs = testVs(/firefox\/[\d.]+/ig);
	} else if (supporter === "opera") {
		supporterVs = testVs(/opr\/[\d.]+/ig);
	} else if (supporter === "iexplore") {
		supporterVs = testVs(/(msie [\d.]+)|(rv:[\d.]+)/ig);
	} else if (supporter === "edge") {
		supporterVs = testVs(/edge\/[\d.]+/ig);
	}
	// 外壳和外壳版本
	let shell = "none";
	let shellVs = "unknow";
	if (testUa(/micromessenger/ig)) {
		shell = "wechat"; // 微信浏览器
		shellVs = testVs(/micromessenger\/[\d.]+/ig);
	} else if (testUa(/qqbrowser/ig)) {
		shell = "qq"; // QQ浏览器
		shellVs = testVs(/qqbrowser\/[\d.]+/ig);
	} else if (testUa(/ubrowser/ig)) {
		shell = "uc"; // UC浏览器
		shellVs = testVs(/ubrowser\/[\d.]+/ig);
	} else if (testUa(/2345explorer/ig)) {
		shell = "2345"; // 2345浏览器
		shellVs = testVs(/2345explorer\/[\d.]+/ig);
	} else if (testUa(/metasr/ig)) {
		shell = "sougou"; // 搜狗浏览器
	} else if (testUa(/lbbrowser/ig)) {
		shell = "liebao"; // 猎豹浏览器
	} else if (testUa(/maxthon/ig)) {
		shell = "maxthon"; // 遨游浏览器
		shellVs = testVs(/maxthon\/[\d.]+/ig);
	} else if (testUa(/bidubrowser/ig)) {
		shell = "baidu"; // 百度浏览器
		shellVs = testVs(/bidubrowser [\d.]+/ig);
	}
	return Object.assign({
		engine, // webkit gecko presto trident
		engineVs,
		platform, // desktop mobile
		supporter, // chrome safari firefox opera iexplore edge
		supporterVs,
		system, // windows osx linux android ios
		systemVs
	}, shell === "none" ? {} : {
		shell, // wechat qq uc 2345 sougou liebao maxthon baidu
		shellVs
	});
}
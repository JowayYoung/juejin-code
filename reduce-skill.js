// 获取近半年的月份
function HalfYear(date = null) {
	return [...new Array((date ? new Date(date) : new Date()).getMonth() + 1).keys()].reduceRight((t, v, i, a) => {
		if (a.length >= 6 && t.length < 6) {
			t.unshift(v + 1);
		} else if (a.length < 6) {
			t.unshift(v + 1);
			if (i === 0 && t.length < 6) {
				const n = 6 - t.length;
				for (let j = 1; j <= n; j++) t.unshift(13 - j);
			}
		}
		return t;
	}, []).map(v => v + "月");
}
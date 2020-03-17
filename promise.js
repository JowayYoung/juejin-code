function RecursionPromise(nextPromise, x, resolve, reject) {
	if (nextPromise === x) return false;
	let flag;
	if (x !== null && (typeof x === "object" || typeof x === "function")) {
		try {
			let then = x.then;
			if (typeof then === "function") {
				then.call(x, y => {
					if (flag) return false;
					flag = true;
					// 这里说明Promise对象resolve之后的结果仍然是Promise，那么继续递归解析
					RecursionPromise(nextPromise, y, resolve, reject);
				}, error => {
					if (flag) return false;
					flag = true;
					reject(error);
				});
			} else {
				resolve(x);
			}
		} catch (e) {
			if (flag) return false;
			flag = true;
			reject(e);
		}
	} else {
		resolve(x);
	}
}

class MyPromise {
	constructor(implement) {
		this.status = "pending";
		this.res = null;
		this.error = null;
		this.resolveCallbacks = []; // 成功时回调的处理函数
		this.rejectCallbacks = []; // 失败时回调的处理函数
		const resolve = res => {
			if (this.status === "pending") {
				this.status = "fulfilled";
				this.res = res;
				this.resolveCallbacks.forEach(fn => fn()); // 循环执行成功处理函数
			}
		};
		const reject = error => {
			if (this.status === "pending") {
				this.status = "rejected";
				this.error = error;
				this.rejectCallbacks.forEach(fn => fn()); // 循环执行失败处理函数
			}
		};
		try {
			implement(resolve, reject);
		} catch (err) {
			reject(err);
		}
	}
	then(onFulfilled, onRejected) {
		// 如果onRejected不是函数，就直接抛出错误
		onFulfilled = typeof onFulfilled === "function" ? onFulfilled : res => res;
		onRejected = typeof onRejected === "function" ? onRejected : err => { throw err; };
		const nextPromise = new MyPromise((resolve, reject) => {
			if (this.status === "fulfilled") {
				// 解决异步问题
				setTimeout(() => {
					const x = onFulfilled(this.res);
					RecursionPromise(nextPromise, x, resolve, reject);
				}, 0);
			}
			if (this.status === "rejected") {
				setTimeout(() => {
					const x = onRejected(this.error);
					RecursionPromise(nextPromise, x, resolve, reject);
				}, 0);
			}
			if (this.status === "pending") {
				this.resolveCallbacks.push(() => {
					setTimeout(() => {
						const x = onFulfilled(this.res);
						RecursionPromise(nextPromise, x, resolve, reject);
					}, 0);
				});
				this.rejectCallbacks.push(() => {
					setTimeout(() => {
						const x = onRejected(this.error);
						RecursionPromise(nextPromise, x, resolve, reject);
					}, 0);
				});
			}
		});
		return nextPromise;
	}
}

export default MyPromise;
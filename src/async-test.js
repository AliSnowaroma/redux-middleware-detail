export function A(){
	return setTimeout(() => {
		return 3
	},9000)
}

export function B(){
    return 6
}

export default function c(a,b){
	if(a>0 && b>0){
		console.log('函数等待测试')
	}
}

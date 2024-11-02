import { uniqueId } from 'lodash-es'

const datas = [
	{
		id: '',
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//4bbc14ed83cf7c6e93d2856d06c1194c'
	},
	{
		id: '',
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//1e95d563c83418ec9e349fe2d00f68dd'
	},
	{
		id: '',
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//b716298a03337703057a6e320d37efd7'
	},
	{
		id: '',
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//7b50b48344e5be6fb8ca6b789dda8641'
	},
	{
		id: '',
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//911a4ebf43020b16bb3f9f8b7d91f4e9'
	},
	{
		id: '',
		src: 'https://lf3-effectcdn-tos.byteeffecttos.com/obj/ies.fe.effect//cc54ef6365c268587c8f19347a772a24'
	}
]

datas.forEach(item => {
	item.id = uniqueId()
})

export { datas }

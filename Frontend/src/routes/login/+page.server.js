import { goto } from "$app/navigation";
import {login} from "$lib/service/authentication.js"

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({cookies, request}) => {

		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		try {
			const userToken = await login(username, password);
			cookies.set('jwt', userToken, {path: '/'});
		  } catch (error) {
			console.log(error);
		  }
		  return { success: true };
	}
};
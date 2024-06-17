import { login } from '$lib/service/authentication';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request }) => {
	  const data = await request.formData();
	  const username = data.get('username');
	  const password = data.get('password');
		const userTokenResponse = await login(username, password);
		if(userTokenResponse.token){
			cookies.set('jwt', userTokenResponse.token, { path: '/' });
			return true;
		}
		return false;// Include the userToken in the return
	}
  };
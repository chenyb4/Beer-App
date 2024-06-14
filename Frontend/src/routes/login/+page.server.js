import { login } from '$lib/service/authentication';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request }) => {
	  const data = await request.formData();
	  const username = data.get('username');
	  const password = data.get('password');
	  try {
		const userToken = await login(username, password);
		cookies.set('jwt', userToken, { path: '/' });
		return true;// Include the userToken in the return
	  } catch (error) {
		console.log(error);
		return { success: false, error: error.message }; // Return error information
	  }
	}
  };
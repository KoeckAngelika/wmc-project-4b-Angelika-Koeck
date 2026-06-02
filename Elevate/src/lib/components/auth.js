export function saveUser(user) {

	localStorage.setItem(
		'user',
		JSON.stringify(user)
	);

}


export function getUser() {

	const user = localStorage.getItem('user');

	if(!user) {
		return null;
	}

	return JSON.parse(user);

}


export function getUserId() {

	const user = getUser();

	return user?.id;

}


export function getUserLanguage() {

	const user = getUser();

	return user?.language || 'de';

}


export function updateUserLanguage(language) {

	const user = getUser();

	if(!user) {
		return;
	}


	user.language = language;


	localStorage.setItem(
		'user',
		JSON.stringify(user)
	);

}


export function logout() {

	localStorage.removeItem('user');

}
import { getUserLanguage } from '$lib/components/auth';


class LanguageState {

	language = $state('de');


	loadLanguage(){

		this.language = getUserLanguage();

		console.log("SPRACHE GELADEN:", this.language);

	}


	setLanguage(lang){

		this.language = lang;

	}

}


export const languageState = new LanguageState();
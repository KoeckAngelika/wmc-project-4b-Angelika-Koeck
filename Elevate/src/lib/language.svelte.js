class LanguageState {
	language = $state("de");

	setLanguage(lang) {
		this.language = lang;
		localStorage.setItem("language", lang);
	}

	loadLanguage() {
		this.language =
			localStorage.getItem("language") || "de";
	}
}

export const languageState = new LanguageState();
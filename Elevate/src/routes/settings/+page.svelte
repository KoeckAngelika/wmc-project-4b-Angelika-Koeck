<script>
	let language = 'de';

	import './settings.css';
    import { goto } from '$app/navigation';
	import {
		getUser,
		getUserId,
		updateUserLanguage
	} from '$lib/components/auth';
	import { translations } from '$lib/i18n';
	import { languageState } from '$lib/language.svelte.js';

	let t = $derived(translations[languageState.language]);

	async function setLanguage(lang) {

	
		languageState.setLanguage(lang);


		// localStorage User ändern
		updateUserLanguage(lang);


		// Datenbank ändern
		await fetch(
			`http://localhost:3000/users/language/${userId}`,
			{
				method: "PATCH",

				headers: {
					"Content-Type": "application/json"
				},

				body: JSON.stringify({
					language: lang
				})
			}
		);

	}

	let userId = $state(null);
	let user = $state(null);

	$effect(() => {

		user = getUser();

		userId = getUserId();

		languageState.loadLanguage();

	});

	
	function goToChat(){
		goto('/chat');
	}
	
	function gotToStatistik(){
		goto('/statistik');
	}
	
	function goToDashboard(){
		goto('/dashboard');
	}

    function goToLogin(){
		goto('/login');
	}


	function logout() {
		console.log('logout');
	}

	let mobileMenu = $state(false);
</script>

<div class="page">

	<!-- NAVBAR -->
	<nav class="navbar">
			
		<img
			src="/logo.png"
			alt="Elevate Logo"
			class="logo"
		/>

		<div class="mobile-actions">

			<button
				class="burger"
				onclick={() => mobileMenu = !mobileMenu}
			>
				☰
			</button>

		</div>

		<div class:open={mobileMenu} class="nav-links">

			<button
				onclick={() => {
					goToDashboard();
					mobileMenu = false;
				}}
			>
				{t.dashboard}
			</button>

			<button
				onclick={() => {
					goToChat()
					mobileMenu = false;
				}}
			>
				{t.chat}
			</button>

			<button
				onclick={() => {
					gotToStatistik();
					mobileMenu = false;
				}}
			>
				{t.statistics}
			</button>

			<button 
				class="mobile-settings-link active"
				onclick={() => {
					mobileMenu = false;
				}}
			>
				{t.settings}
			</button>

		</div>

		<div class="nav-right">
			<div onclick={goToSettings} class="settings">⚙</div>
			<div class="profile">{user?.username.charAt(0).toUpperCase() || 'U'}</div>
		</div>

	</nav>

	<!-- SETTINGS CARD -->
	<div class="settings-card">

		<!-- LEFT -->
		<div class="left">

			<!-- Sprache -->
			<div class="section">
				<h2>{t.language}</h2>
				<p>{t.selectLanguage}</p>

				<div class="language-buttons">

					<button
						class:active-language={languageState.language === 'de'}
						onclick={() => setLanguage('de')}
					>
						{t.german}
					</button>

					<button
						class:active-language={languageState.language === 'en'}
						onclick={() => setLanguage('en')}
					>
						{t.english}
					</button>

				</div>
			</div>

			<!-- Account -->
			<div class="section account-section">
				<h2>{t.account}</h2>
				<p>{t.manageAccount}</p>
				<button
					class="logout-btn"
					onclick={goToLogin}
				>
					{t.logout}
				</button>
			</div>

		</div>

		<!-- RIGHT -->
		<div class="profile-card">

			<div class="big-circle">
				{user?.username.charAt(0).toUpperCase() || 'U'}
			</div>

			<h3>{user?.username}</h3>

			<p>{t.premium}</p>
		</div>

	</div>

</div>


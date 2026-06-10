<script>
	import './login.css';
	import { goto } from '$app/navigation';
	import { saveUser  } from '$lib/components/auth';

	import { translations } from '$lib/i18n';
	import { languageState } from '$lib/language.svelte.js';

	let t = $derived(translations[languageState.language]);

	let loginLanguage = $state(languageState.language);
	let errorMessage = $state('');

	function changeLanguage(lang){

		languageState.setLanguage(lang);

		loginLanguage = lang;

	}

	let username = $state('');
	let password = $state('');
	let showPassword = $state(false);

	async function goTodashboard(){

		const response = await fetch(
			"http://localhost:3000/auth/login", 
			{
				method: "POST",
				headers: { "Content-Type": "application/json"},
				body: JSON.stringify({
					username: username,
					password: password
				})
			}
		);

		const data = await response.json();


		if(!response.ok || !data.userId){

			showError(t.invalidLogin);

			username = '';
			password = '';

			return;

		}


		saveUser({
			id: data.userId,
			username: data.username
		});


		goto('/dashboard');

	}

	function showError(message){

		errorMessage = message;


		setTimeout(() => {

			errorMessage = '';

		},3000);

	}
</script>

<div class="page">
    <div class="card">

		<img
			src="/logo.png"
			alt="Elevate Logo"
			class="logo"
		/>

		<div class="language-buttons">

			<button
				class:active-language={loginLanguage === 'de'}
				onclick={() => changeLanguage('de')}
			>
				DE
			</button>


			<button
				class:active-language={loginLanguage === 'en'}
				onclick={() => changeLanguage('en')}
			>
				EN
			</button>

		</div>

        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>{t.username}</label>
            <input bind:value={username} type="text" placeholder={t.username}>
        </div>

        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>{t.password}</label>
            <input bind:value={password} type="password" placeholder="*******">
			
			<p class="passwort-text">
				{t.passwordHint}
			</p>       
		</div>

        <p class="forgot">
			<a href="/passwort-ändern">
            	{t.forgotPassword}
			</a>
        </p>

        <button onclick={goTodashboard}>
            {t.login}
        </button>

		<p class="register-text">
			{t.noAccount}

			<a href="/register">
				{t.register}
			</a>
		</p>

    </div>
	{#if errorMessage}
		<div class="error-toast">
			{errorMessage}
		</div>
	{/if}
</div>


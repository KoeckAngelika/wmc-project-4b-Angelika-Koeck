<script>

	import './register.css';
	import { goto } from '$app/navigation';

	import { translations } from '$lib/i18n';
	import { languageState } from '$lib/language.svelte.js';

	let t = $derived(translations[languageState.language]);
	let errorMessage = $state('');


	let registerLanguage = $state(languageState.language);

	function changeLanguage(lang){

		languageState.setLanguage(lang);

		registerLanguage = lang;

	}

	let email = $state('');
	let username = $state('');
	let password = $state('');
	let birthdate = $state('');
	let size = $state('');
	let weight = $state('');

	async function goToLogin(){

		if(
			email == '' ||
			username == '' ||
			password == '' ||
			birthdate == '' ||
			size == '' ||
			weight == ''
		){

			showError(t.invalidFields);			
			return;

		}


		const passwordCheck = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;


		if(!passwordCheck.test(password)){

			showError(t.invalidPassword);			
			return;

		}


		const parsedHeight = parseInt(size);
		const parsedWeight = parseFloat(weight);


		const response = await fetch(
			"http://localhost:3000/auth/register",
			{
				method: "POST",

				headers: {
					"Content-Type": "application/json"
				},

				body: JSON.stringify({
					email,
					username,
					password,
					birthdate,
					height_cm: parsedHeight,
					weight_kg: parsedWeight
				})
			}
		);


		const data = await response.json();


		if(data.message === "Benutzername existiert bereits"){

			showError(t.usernameTaken);			
			return;

		}


		goto('/login');

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
				class:active-language={registerLanguage === 'de'}
				onclick={() => changeLanguage('de')}
			>
				Deutsch
			</button>


			<button
				class:active-language={registerLanguage === 'en'}
				onclick={() => changeLanguage('en')}
			>
				English
			</button>

		</div>

        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>{t.email}</label>
            <input bind:value={email} type="text" placeholder="test@user">
        </div>

        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>{t.username}</label>
            <input bind:value={username} type="text" placeholder="User1234">
        </div>

        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>{t.password}</label>
            <input bind:value={password} type="password" placeholder="*******">
            <p class="passwort-text">
				{t.passwordHint}
			</p>
        </div>

        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>{t.personalData}</label>
            <div class="personal-data">
                <input bind:value={birthdate} type="date" placeholder={t.age} />
                <input bind:value={size} min="30" max="300" type="number" placeholder={t.height} />
                <input bind:value={weight} min="10" type="number" placeholder={t.weight} />
            </div>
        </div>

        <button onclick={goToLogin}>
            {t.register}
        </button>

    </div>
	{#if errorMessage}

		<div class="error-toast">
			{errorMessage}
		</div>

	{/if}
</div>


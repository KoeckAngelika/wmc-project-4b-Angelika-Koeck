<script>
	let language = 'de';
    import { goto } from '$app/navigation';
	import {
		getUser,
		getUserId
	} from '$lib/components/auth';
	import { translations } from '$lib/i18n';
	import { languageState } from '$lib/language.svelte.js';

	let t = $derived(translations[languageState.language]);

	function setLanguage(lang) {
		languageState.setLanguage(lang);
	}

	let userId = $state(null);
	let user = $state(null);

	$effect(() => {

		user = getUser();

		userId = getUserId();


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

<style>

	:global(body) {
		margin: 0;
		font-family: Inter, sans-serif;
		background: #f5f5f7;
		color: #111827;
	}

	.page {
		padding: 32px 64px;
	}

	.mobile-actions {
		display: none;
		align-items: center;
		gap: 10px;
	}

	.mobile-settings-link {
		display: none;
	}

	/* NAVBAR */

	.navbar {
		height: 80px;

		background: white;

		border-radius: 28px;

		display: flex;
		align-items: center;
		justify-content: space-between;

		padding: 0 28px;

		border: 1px solid #e5e7eb;
	}

	.logo {
        width: 220px;
        object-fit: contain;
        display: block;
    }

	.nav-links {
		display: flex;
		align-items: center;
		gap: 18px;

		margin-left: 60px;
	}

	.nav-links button {
		border: none;
		background: transparent;

		padding: 12px 22px;
		border-radius: 16px;

		font-size: 15px;
		font-weight: 500;
		color: #6b7280;

		cursor: pointer;
		transition: 0.2s;
	}

	.nav-links button:hover {
		background: #eef2ff;
		color: #4f46e5;
	}

	.nav-links .active {
		background: #dfe3ff;
		padding: 14px 36px;
		border-radius: 16px;
		font-weight: 600;
		color: #4f46e5;
	}

	.nav-right {
		display: flex;
		align-items: center;
		gap: 14px;

		margin-left: auto;
	}

	 .settings,
    .profile {
        width: 46px;
        height: 46px;

        border-radius: 16px;

        display: flex;
        align-items: center;
        justify-content: center;

        font-weight: 700;

        cursor: pointer;
        transition: 0.2s;
    }

    .profile {
        background: #c7d2fe;
        color: #3730a3;
    }

    .profile:hover {
        transform: scale(1.05);
    }

	.settings,
	.chat-profile {
		width: 46px;
		height: 46px;

		border-radius: 16px;

		display: flex;
		align-items: center;
		justify-content: center;

		font-weight: 700;

		cursor: pointer;
		transition: 0.2s;

		font-size: 18px;
	}

	.settings {
		background: #f3f4f6;
		border: none;
	}

	.settings:hover {
		background: #e5e7eb;
	}

	.chat-profile {
		background: #c7d2fe;
		color: #3730a3;
	}

	.chat-profile:hover {
		transform: scale(1.05);
	}

	.profile-circle {
		width: 44px;
		height: 44px;

		border-radius: 50%;

		background: #c7d2fe;

		display: flex;
		align-items: center;
		justify-content: center;

		font-weight: 700;
		color: #4338ca;
	}

	/* HEADER */

	.header {
		margin-top: 42px;
	}

	.header h1 {
		font-size: 62px;
		margin: 0;
	}

	.header p {
		color: #6b7280;
		margin-top: 12px;
	}

	/* CARD */

	.settings-card {
		margin-top: 48px;

		background: white;

		border-radius: 36px;

		padding: 60px;

		border: 1px solid #e5e7eb;

		display: flex;
		justify-content: space-between;
		gap: 60px;
	}

	.left {
		flex: 1;
	}

	.section {
		margin-bottom: 70px;
	}

	.section h2 {
		font-size: 28px;
		margin-bottom: 10px;
	}

	.section p {
		color: #6b7280;
		margin-bottom: 32px;
	}

	.language-buttons {
		display: flex;
		gap: 24px;
	}

	.language-buttons button {
		width: 220px;
		height: 64px;

		border: none;

		border-radius: 20px;

		background: #f3f4f6;

		font-size: 18px;

		cursor: pointer;

		transition: 0.2s;
	}

	.active-language {
		background: #dfe3ff !important;
		color: #4f46e5;
		font-weight: 700;
	}

	.logout-btn {
		width: 260px;
		height: 64px;

		border: none;

		border-radius: 20px;

		background: #f7caca;

		color: #b91c1c;

		font-size: 18px;
		font-weight: 700;

		cursor: pointer;

		transition: 0.2s;
	}

	.logout-btn:hover {
		transform: translateY(-2px);
	}

	/* PROFILE CARD */

	.profile-card {
		width: 320px;

		background: #f8f8f8;

		border-radius: 30px;

		padding: 40px 30px;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.big-circle {
		width: 120px;
		height: 120px;

		border-radius: 50%;

		background: #c7d2fe;

		display: flex;
		align-items: center;
		justify-content: center;

		font-size: 52px;
		font-weight: 700;

		color: #4338ca;

		margin-bottom: 30px;
	}

	.profile-card h3 {
		font-size: 38px;
		margin: 0;
	}

	.profile-card p {
		color: #6b7280;
		margin-top: 12px;
	}

	/* RESPONSIVE */

	@media (max-width: 1100px) {

		.settings-card {
			flex-direction: column;
		}

		.profile-card {
			width: 100%;
			box-sizing: border-box;
		}

	}

	.burger {
		display: none;
	}

	@media (max-width: 700px) {

		.page {
			padding: 20px;
		}

		.navbar {
			position: relative;
			z-index: 10000;
		}

		.logo {
			width: 150px;
		}

		.burger {
			display: flex;
			align-items: center;
			justify-content: center;

			width: 46px;
			height: 46px;

			border: none;
			border-radius: 16px;

			background: #eef2ff;

			color: #4f46e5;
			font-size: 24px;

			cursor: pointer;
		}

		.nav-links {
			position: absolute;

			top: 82px;
			right: 0;

			left: auto;

			width: 210px;

			background: rgba(255,255,255,0.98);
			backdrop-filter: blur(18px);

			border: 1px solid #e5e7eb;
			border-radius: 24px;

			padding: 14px;

			display: none;
			flex-direction: column;
			gap: 10px;

			box-shadow: 0 12px 30px rgba(0,0,0,0.12);

			z-index: 99999;
		}

		.nav-links.open {
			display: flex;
		}

		.nav-links button {
			width: 100%;

			text-align: left;

			padding: 14px;

			border-radius: 16px;
		}

		.nav-right {
			display: none;
		}

		.sidebar,
		.chat-box {
			width: 100%;
			min-height: auto;
		}

		.content {
			grid-template-columns: 1fr;
		}

		.input-area {
			flex-direction: column;
		}

		.input-area input,
		.input-area button {
			width: 100%;
		}
	}

	@media (max-width: 950px) {

		.mobile-settings-link {
			display: block;
		}

		.page {
			padding: 20px;
		}

		.navbar {
			position: relative;
			z-index: 10000;
		}

		.logo {
			width: 180px;
		}

		.mobile-actions {
			display: flex;
			margin-left: auto;
		}

		.burger {
			display: flex;
			align-items: center;
			justify-content: center;

			width: 46px;
			height: 46px;

			border: none;
			border-radius: 16px;

			background: #f3f4f6;

			color: #4f46e5;
			font-size: 20px;
			font-weight: 700;

			cursor: pointer;

			transition: 0.2s;
		}

		.burger:hover {
			background: #e0e7ff;
		}

		.nav-links {
			position: absolute;

			top: 82px;
			right: 0;

			left: auto;

			width: 210px;

			background: rgba(255,255,255,0.98);
			backdrop-filter: blur(18px);

			border: 1px solid #e5e7eb;
			border-radius: 24px;

			padding: 14px;

			display: none;
			flex-direction: column;
			gap: 10px;

			box-shadow: 0 12px 30px rgba(0,0,0,0.12);

			z-index: 99999;

			margin-left: 0;
		}

		.nav-links.open {
			display: flex;
		}

		.nav-links button {
			width: 100%;
			text-align: left;
			padding: 14px;
			border-radius: 16px;
		}

		.nav-right {
			display: none;
		}

		.settings-card {
			flex-direction: column;
			padding: 30px;
		}

		.profile-card {
			width: 100%;
			box-sizing: border-box;
		}

		.language-buttons {
			flex-direction: column;
		}

		.language-buttons button,
		.logout-btn {
			width: 100%;
		}
	}

</style>
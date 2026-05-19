<script>
	let language = 'de';
    import { goto } from '$app/navigation';

	
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

	function setLanguage(lang) {
		language = lang;
	}

	function logout() {
		console.log('logout');
	}
</script>

<div class="page">

	<!-- NAVBAR -->
	<nav class="navbar">

		<img
			src="/logo.png"
			alt="Elevate Logo"
			class="logo"
		/>

		<div class="nav-links">
			<a onclick={goToDashboard}>Dashboard</a>
			<a onclick={goToChat}>Chat</a>
			<a onclick={gotToStatistik}>Statistik</a>

			<a href="/settings" class="active">
				Settings
			</a>
		</div>

		<div class="profile-circle">
			A
		</div>

	</nav>


	<!-- SETTINGS CARD -->
	<div class="settings-card">

		<!-- LEFT -->
		<div class="left">

			<!-- Sprache -->
			<div class="section">
				<h2>Sprache</h2>
				<p>wähle deine bevorzugte Sprache</p>

				<div class="language-buttons">

					<button
						class:active-language={language === 'de'}
						onclick={() => setLanguage('de')}
					>
						Deutsch
					</button>

					<button
						class:active-language={language === 'en'}
						onclick={() => setLanguage('en')}
					>
						English
					</button>

				</div>
			</div>

			<!-- Account -->
			<div class="section account-section">
				<h2>Account</h2>
				<p>verwalte deinen Account</p>

				<button
					class="logout-btn"
					onclick={goToLogin}
				>
					Ausloggen
				</button>
			</div>

		</div>

		<!-- RIGHT -->
		<div class="profile-card">

			<div class="big-circle">
				A
			</div>

			<h3>Angelika</h3>

			<p>Premium Mitglied</p>

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
		gap: 50px;
		align-items: center;
	}

	.nav-links a {
        text-decoration: none;
        color: #374151;
        font-size: 15px;

        padding: 14px 24px;
        border-radius: 16px;

        transition: 0.2s;
    }

    .nav-links a:hover {
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

	@media (max-width: 800px) {

		.page {
			padding: 20px;
		}

		.nav-links {
			display: none;
		}

		.header h1 {
			font-size: 42px;
		}

		.settings-card {
			padding: 30px;
		}

		.language-buttons {
			flex-direction: column;
		}

		.language-buttons button {
			width: 100%;
		}

		.logout-btn {
			width: 100%;
		}

	}

</style>
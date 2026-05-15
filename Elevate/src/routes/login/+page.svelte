<script>

</script>

<div class="page">
    <div class="card">

		<img
			src="/logo.png"
			alt="Elevate Logo"
			class="logo"
		/>

        <div class="input-group">
            <label>Benutzername</label>
            <input type="text" placeholder="Username">
        </div>

        <div class="input-group">
            <label>Passwort</label>
            <input type="password" placeholder="*******">
        </div>

        <p class="forgot">
            Passwort vergessen?
        </p>

        <button>
            Anmelden
        </button>

		<p class="register-text">
			Noch kein Konto?

			<a href="/register">
				Registrieren
			</a>
		</p>

    </div>
</div>

<style>

	:global(body) {
		margin: 0;
		font-family: Inter, sans-serif;
		background: #f5f5f7;
		overflow: hidden;
	}

	.page {
		width: 100%;
		min-height: 100vh;

		display: flex;
		justify-content: center;
		align-items: center;

		position: relative;

		padding: 20px;
		box-sizing: border-box;
	}

	.background-circle {
		position: absolute;
		border-radius: 999px;
		filter: blur(60px);
		z-index: 0;
	}

	.background-circle.top {
		width: 320px;
		height: 320px;

		background: rgba(165,180,252,0.35);

		top: -100px;
		right: -100px;
	}

	.background-circle.bottom {
		width: 420px;
		height: 420px;

		background: rgba(221,214,254,0.3);

		bottom: -180px;
		left: -140px;
	}

	.card {
		width: 100%;
		max-width: 700px;

		padding: 25px 40px;

		background: rgba(255,255,255,0.9);

		backdrop-filter: blur(12px);

		border-radius: 32px;

		border: 1px solid #e5e7eb;

		box-shadow:
			0 10px 30px rgba(0,0,0,0.05);

		display: flex;
		flex-direction: column;

		position: relative;
		z-index: 2;

		box-sizing: border-box;
	}

	.logo {
		width: 100%;

		margin: -70px auto -70px auto;
		display: block;

		object-fit: contain;
	}

	.input-group {
		display: flex;
		flex-direction: column;

		margin-bottom: 18px;
	}

	label {
		margin-bottom: 10px;

		font-size: 15px;
		font-weight: 600;

		color: #374151;
	}

	input {
		height: 58px;

		border: none;
		outline: none;

		border-radius: 18px;

		background: #f3f4f6;

		padding: 0 22px;

		font-size: 15px;

		color: #111827;

		box-sizing: border-box;

		transition: 0.2s;
	}

	input:focus {
		background: #eef2ff;

		box-shadow:
			0 0 0 3px rgba(165,180,252,0.35);
	}

	input::placeholder {
		color: #9ca3af;
	}

	.forgot {
		margin-top: -2px;
		margin-bottom: 20px;

		text-align: right;

		font-size: 14px;

		color: #818cf8;

		font-weight: 600;

		cursor: pointer;
	}

	button {
		height: 62px;

		border: none;

		border-radius: 18px;

		background: #a5b4fc;

		color: #111827;

		font-size: 17px;
		font-weight: 700;

		cursor: pointer;

		transition: 0.2s;
	}

	button:hover {
		transform: translateY(-2px);

		background: #8b9cf7;
	}

	button:active {
		transform: scale(0.98);
	}

	.register-text {
		margin-top: 16px;

		text-align: center;

		font-size: 14px;

		color: #6b7280;
	}

	.register-text a {
		color: #818cf8;

		font-weight: 700;

		text-decoration: none;

		margin-left: 4px;
	}

	.register-text a:hover {
		text-decoration: underline;
	}

	/* Tablet */

	@media (max-width: 768px) {

		.card {
			max-width: 560px;
			padding: 28px 28px;
		}

		.logo {
			margin-bottom: 18px;
		}

	}

	/* Mobile */

	@media (max-width: 480px) {

		.page {
			padding: 16px;
		}

		.card {
			padding: 24px 18px;
			border-radius: 26px;
		}

		label {
			font-size: 14px;
		}

		input {
			height: 54px;
			font-size: 14px;
			padding: 0 18px;
		}

		button {
			height: 56px;
			font-size: 15px;
		}

		.forgot {
			font-size: 13px;
		}

		.logo {
			margin-bottom: 18px;
		}

	}

</style>
<script>

	import { goto } from '$app/navigation';

	let email = $state('');
	let username = $state('');
	let password = $state('');
	let birthdate = $state('');
	let size = $state('');
	let weight = $state('');

	async function goToLogin(){

		if(email != '' || username != '' || password != '' || birthdate != '' || size != 0 || weight != 0){

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

			goto('/login');
		}

	}
	
</script>

<div class="page">
    <div class="card">

		<img
			src="/logo.png"
			alt="Elevate Logo"
			class="logo"
		/>

        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>E-Mail</label>
            <input bind:value={email} type="text" placeholder="test@user">
        </div>

        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>E-Benutzername</label>
            <input bind:value={username} type="text" placeholder="User1234">
        </div>

        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>Passwort</label>
            <input bind:value={password} type="password" placeholder="*******">
            <p class="passwort-text">Mindestens 8 Zeichen, inklusive Zahlen und Sonderzeichen</p>
        </div>

        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>Persöhnliche Daten</label>
            <div class="personal-data">
                <input bind:value={birthdate} type="date" placeholder="Alter" />
                <input bind:value={size} min="30" max="300" type="number" placeholder="Größe in cm" />
                <input bind:value={weight} min="10" type="number" placeholder="Gewicht in kg" />
            </div>
        </div>

        <button onclick={goToLogin}>
            Registrieren
        </button>

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
		width: 70%;

		margin: 20px auto 25px auto;	
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

    .personal-data {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 18px;
        width: 100%;
    }

    .personal-data input {
        width: 100%;
        box-sizing: border-box;
    }

    .passwort-text{
        margin-top: 16px;

		text-align: left;

		font-size: 14px;

		color: #6b7280;
    }

	/* Tablet */

	@media (max-width: 768px) {

        .personal-data {
            grid-template-columns: 1fr;
        }

		.card {
			max-width: 560px;
			padding: 28px 28px;
		}

		.logo {
			margin-bottom: 16px;
		}

	}

	/* Mobile */

	@media (max-width: 480px) {

        .personal-data {
			grid-template-columns: 1fr;
		}

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

		.logo {
			margin-bottom: 16px;
		}

	}

</style>
<script>
	import './passwort-ändern.css';

	let username = $state("");
	let newPassword = $state("");
	let repeatPassword = $state("");


	async function changePassword(){


		if(newPassword !== repeatPassword){

			alert("Passwörter stimmen nicht überein");
			return;

		}


		if(newPassword.length < 8){

			alert("Passwort muss mindestens 8 Zeichen haben");
			return;

		}


		const response = await fetch(
			"http://localhost:3000/auth/reset-password",
			{
				method:"PATCH",

				headers:{
					"Content-Type":"application/json"
				},

				body:JSON.stringify({
					username,
					newPassword
				})
			}
		);


		const data = await response.json();


		if(data.success){


			window.location.href="/login";

		}
		else{

			alert(data.message);

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
            <label>Username</label>
            <input bind:value={username} type="text" placeholder="E-Mail">
        </div>

        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>Neues Passwort</label>
            <input bind:value={newPassword} type="password" placeholder="*******">
            <p class="passwort-text">Mindestens 8 Zeichen, inklusive Zahlen und Sonderzeichen</p>
        </div>
        
        <div class="input-group">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label>Neues Passwort wiederholen</label>
            <input bind:value={repeatPassword} type="password" placeholder="*******">
        </div>

        <button onclick={changePassword}>
            Passwort ändern
        </button>

		<p class="register-text">
			<a href="/register">
				Zurück zum Anmelden
			</a>
		</p>

    </div>
</div>


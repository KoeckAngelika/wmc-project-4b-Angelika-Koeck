<script>
	let activity = '';
	let duration = '';
	let repeat = '';

	let unit = 'Minuten';

	const preview = $derived(
		`${duration || '30'} ${unit} ${activity || 'Joggen'} · ${repeat || '10 mal'}`
	);

	function addActivity() {
		console.log({
			activity,
			duration,
			repeat,
			unit
		});
	}

	function cancel() {
		activity = '';
		duration = '';
		repeat = '';
	}
</script>

<div class="overlay">

	<div class="modal">

		<img
			src="/logo.png"
			alt="Elevate Logo"
			class="logo"
		/>

		<!-- Aktivität -->
		<div class="input-group">

			<label>Aktivität</label>

			<input
				bind:value={activity}
				type="text"
				placeholder="z.B. Joggen"
			/>

		</div>

		<!-- Dauer -->
		<div class="input-group">

			<label>Dauer</label>

			<div class="duration-row">

				<input
					bind:value={duration}
					type="number"
					placeholder="30"
				/>

				<button
					class="unit-btn"
					type="button"
				>
					{unit}
				</button>

			</div>

		</div>

		<!-- Wiederholung -->
		<div class="input-group">

			<label>Wiederholung</label>

			<input
				bind:value={repeat}
				type="text"
				placeholder="z.B. 10 mal"
			/>

		</div>

		<!-- Vorschau -->
		<div class="input-group">

			<label>Vorschau</label>

			<div class="preview">
				{preview}
			</div>

		</div>

		<!-- Buttons -->
		<div class="buttons">

			<button
				class="cancel-btn"
				on:click={cancel}
			>
				Abbrechen
			</button>

			<button
				class="add-btn"
				on:click={addActivity}
			>
				Hinzufügen
			</button>

		</div>

	</div>

</div>

<style>

	:global(body) {
		margin: 0;
		font-family: Inter, sans-serif;
		background: #f5f5f7;
	}

	.overlay {
		min-height: 100vh;

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 30px;
	}

	.modal {
		width: 100%;
		max-width: 640px;

		background: white;

		border-radius: 38px;

		padding: 58px 58px 46px;

		border: 1px solid #ececec;

		box-sizing: border-box;
	}

	.logo {
        width: 400px;
        object-fit: contain;

        display: block;

        margin:
            0 auto 12px auto;
    }

	.input-group {
		display: flex;
		flex-direction: column;

		margin-top: 34px;
	}

	label {
		font-size: 16px;
		font-weight: 700;

		color: #1e3a5f;

		margin-bottom: 14px;
	}

	input {
		height: 62px;

		border: none;
		outline: none;

		border-radius: 20px;

		background: #f3f4f6;

		padding: 0 24px;

		font-size: 15px;

		box-sizing: border-box;

		color: #374151;

		transition: 0.2s;
	}

	input::placeholder {
		color: #6b7280;
	}

	input:focus {
		background: #eef2ff;

		box-shadow:
			0 0 0 2px #c7d2fe;
	}

	.duration-row {
		display: flex;
		gap: 20px;
	}

	.duration-row input {
		flex: 1;
	}

	.unit-btn {
		width: 220px;
		height: 62px;

		border: none;

		border-radius: 20px;

		background: #e5e9ff;

		color: #4f46e5;

		font-size: 15px;
		font-weight: 700;

		cursor: pointer;

		transition: 0.2s;
	}

	.unit-btn:hover {
		transform: translateY(-2px);
	}

	.preview {
		height: 78px;

		background: #e5e9ff;

		border-radius: 22px;

		display: flex;
		align-items: center;

		padding: 0 34px;

		font-size: 18px;
		font-weight: 700;

		color: #111827;

		box-sizing: border-box;
	}

	.buttons {
		display: flex;
		gap: 24px;

		margin-top: 44px;
	}

	.buttons button {
		flex: 1;

		height: 62px;

		border: none;

		border-radius: 20px;

		font-size: 16px;
		font-weight: 700;

		cursor: pointer;

		transition: 0.2s;
	}

	.cancel-btn {
		background: #f3f4f6;
		color: #6b7280;
	}

	.add-btn {
		background: #9aa7f4;
		color: #111827;
	}

	.buttons button:hover {
		transform: translateY(-2px);
	}

	@media (max-width: 700px) {

		.modal {
			padding: 30px;
		}

		.logo {
			width: 180px;
		}

		.duration-row {
			flex-direction: column;
		}

		.unit-btn {
			width: 100%;
		}

		.buttons {
			flex-direction: column;
		}

	}

</style>
<script>
	let activity = '';
	let duration = '';
	let repeat = '';

	let unit = 'Minuten';

    const preview = $derived(
        `${duration || '30'} ${unit} ${activity || 'Joggen'} · ${repeat || '10 mal'}`
    );
</script>

<div class="overlay">

	<div class="modal">

		<h1>Aktivität hinzufügen</h1>

		<p class="subtitle">
			erstelle eine neue Aufgabe
		</p>

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

				<button class="unit-btn">
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

			<button class="cancel-btn">
				Abbrechen
			</button>

			<button class="add-btn">
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

		padding: 40px 20px;
	}

	.modal {
		width: 100%;
		max-width: 600px;

		background: white;

		border-radius: 36px;

		padding: 60px;

		border: 1px solid #e5e7eb;

		box-sizing: border-box;
	}

	h1 {
		text-align: center;

		font-size: 42px;

		margin: 0;

		color: #111827;
	}

	.subtitle {
		text-align: center;

		color: #6b7280;

		margin-top: 14px;
		margin-bottom: 60px;
	}

	.input-group {
		display: flex;
		flex-direction: column;

		margin-bottom: 42px;
	}

	label {
		font-size: 15px;
		font-weight: 600;

		margin-bottom: 16px;

		color: #374151;
	}

	input {
		height: 60px;

		border: none;
		outline: none;

		border-radius: 18px;

		background: #f3f4f6;

		padding: 0 24px;

		font-size: 15px;

		box-sizing: border-box;
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
		height: 60px;

		border: none;

		border-radius: 18px;

		background: #eef2ff;

		color: #4f46e5;

		font-size: 15px;
		font-weight: 600;
	}

	.preview {
		height: 80px;

		background: #eef2ff;

		border-radius: 22px;

		display: flex;
		align-items: center;

		padding: 0 40px;

		font-size: 20px;
		font-weight: 600;

		color: #111827;

		box-sizing: border-box;
	}

	.buttons {
		display: flex;
		justify-content: space-between;

		gap: 24px;

		margin-top: 20px;
	}

	.buttons button {
		flex: 1;

		height: 58px;

		border: none;

		border-radius: 18px;

		font-size: 15px;
		font-weight: 700;

		cursor: pointer;

		transition: 0.2s;
	}

	.cancel-btn {
		background: #f3f4f6;
		color: #6b7280;
	}

	.add-btn {
		background: #a5b4fc;
		color: #111827;
	}

	.buttons button:hover {
		transform: translateY(-2px);
	}

	@media (max-width: 700px) {

		.modal {
			padding: 32px;
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
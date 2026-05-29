<script>

	import { page } from '$app/state';

	import { goto } from '$app/navigation';
	
	import {
		getUser,
		getUserId
	} from '$lib/components/auth';
	import { translations } from '$lib/i18n';
	import { languageState } from '$lib/language.svelte.js';

let t = $derived(translations[languageState.language]);

	let userId = $state(null);
	let user = $state(null);

	function gotToDashboard(){
		goto('/dashboard');
	}


	let activity = $state('');
	let duration = $state('');
	let repeat = $state('');

	let unit = 'Minuten';

	const taskId = $derived.by(() => {

		if(!page.url) {
			return null;
		}

		return page.url.searchParams.get('id');

	});

	$effect(() => {

		if(taskId) {
			loadTask();
		}

	});


	async function loadTask() {

		try {

			const response = await fetch(
				`http://localhost:3000/tasks/single/${taskId}`
			);

			const data = await response.json();

			console.log(data);

			activity = data.title;
			duration = data.duration_min;
			repeat = data.description;

		} catch(error) {

			console.log(error);

		}

	}

	const selectedDate = $derived.by(() => {

		if(!page.url) {
			return '';
		}

		return page.url.searchParams.get('date');

	});

	let preview = $derived.by(() => {

		const value = Number(duration || 0);

		let timeText = `${value} ${t.minutes}`;
		if(unit === 'Minuten' && value >= 60) {

			const hours = (value / 60).toFixed(1);

			timeText = `${hours} ${t.hours}`;;

		}

		return `${timeText} ${activity || t.jogging} · ${repeat || `10 ${t.times}`}`;
	});
	

	async function addActivity() {

		const userId = getUserId();

		if(taskId) {
			updateTask();
			return;
		}
		try {

			const response = await fetch(
				'http://localhost:3000/tasks',
				{
					method: 'POST',

					headers: {
						'Content-Type': 'application/json'
					},

					body: JSON.stringify({
						name: activity,
						duration,
						repeat,
						unit,
						date: selectedDate,
						user_id: userId
					})
				}
			);

			const data = await response.json();

			console.log(data);

		} catch(error) {

			console.log(error);

		}

		gotToDashboard();

	}

	async function updateTask() {

		try {

			const response = await fetch(
				`http://localhost:3000/tasks/${taskId}`,
				{
					method: 'PUT',

					headers: {
						'Content-Type': 'application/json'
					},

					body: JSON.stringify({
						name: activity,
						duration,
						repeat
					})
				}
			);

			const data = await response.json();

			console.log(data);

			goto('/dashboard');

		} catch(error) {

			console.log(error);

		}

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

			<label>{t.activity}</label>

			<input
				bind:value={activity}
				type="text"
				placeholder={t.exampleJogging}
			/>

		</div>

		<!-- Dauer -->
		<div class="input-group">

			<label>{t.duration}</label>

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
					{t.minutes}
				</button>

			</div>

		</div>

		<!-- Wiederholung -->
		<div class="input-group">

			<label>{t.repeat}</label>

			<input
				bind:value={repeat}
				type="text"
				placeholder={t.exampleRepeat}
			/>

		</div>

		<!-- Vorschau -->
		<div class="input-group">

			<label>{t.preview}</label>

			<div class="preview">
				{preview}
			</div>

		</div>

		<!-- Buttons -->
		<div class="buttons">

			<button
				class="cancel-btn"
				onclick={cancel}
			>
				{t.cancel}
			</button>

			<button
				class="add-btn"
				onclick={addActivity}
			>
				{#if taskId}
					{t.save}
				{:else}
					{t.add}
				{/if}
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
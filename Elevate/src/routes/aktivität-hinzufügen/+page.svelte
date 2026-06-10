<script>
	import './activity.css';

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

	$effect(() => {

		user = getUser();

		userId = getUserId();

		languageState.loadLanguage();

	});

	function gotToDashboard(){
		goto(`/dashboard?date=${selectedDate}`);
	}


	let activity = $state('');
	let duration = $state('');
	let repeat = $state('');
	let steps = $state('');
	let calories = $state('');

	let unit = $derived(t.minutes);

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

			console.log("GELADENE TASK DATEN:");
			console.log(data);

			activity = data.title;
			duration = data.duration_min;
			repeat = data.description;

			steps = data.steps;
			calories = data.calories_burned;

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


		if(value >= 60) {

			const hours = (value / 60).toFixed(1);

			timeText = `${hours} ${t.hours}`;

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
						user_id: userId,
						steps: steps || 0,
						calories: calories || 0
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
						repeat,
						steps: steps || 0,
						calories: calories || 0
					})
				}
			);

			const data = await response.json();

			console.log(data);

			goto(`/dashboard?date=${selectedDate}`);

		} catch(error) {

			console.log(error);

		}

	}

	function cancel() {

		activity = '';
		duration = '';
		repeat = '';
		steps = '';
		calories = '';

		goto('/dashboard');

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
				placeholder="Laufen"
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

		<!-- Schritte -->
		<div class="input-group">

			<label>Schritte</label>

			<input
				bind:value={steps}
				type="number"
				placeholder="5000"
			/>

		</div>


		<!-- Kalorien -->
		<div class="input-group">

			<label>Kalorien</label>

			<input
				bind:value={calories}
				type="number"
				placeholder="300"
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


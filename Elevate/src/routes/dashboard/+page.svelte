<script>
	import './dashboard.css'
	import { goto } from '$app/navigation';
	import {
		getUser,
		getUserId
	} from '$lib/components/auth';
	import { page } from '$app/state';

	import { translations } from '$lib/i18n';
	import { languageState } from '$lib/language.svelte.js';

	let t = $derived(translations[languageState.language]);

		
	let userId = $state(null);
	let user = $state(null);

	$effect(() => {

		user = getUser();

		userId = getUserId();

		languageState.loadLanguage();

		if(userId) {
			loadTasks();
		}

	});

	function goToChat(){
		goto('/chat');
	}
	
	function gotToStatistik(){
		goto('/statistik');
	}
	
	function goToSettings(){
		goto('/settings');
	}

	function formatDate(date) {
		return date.toISOString().split('T')[0];
	}

	function goToCreateActivity(){

		goto(
			`/aktivität-hinzufügen?date=${formatDate(selectedDate)}`
		);

	}
	function editTask(id) {

		goto(
			`/aktivität-hinzufügen?id=${id}&date=${formatDate(selectedDate)}`
		);

	}

	
	let tasks = $state([]);

	let selectedDate = $state(
		page.url.searchParams.get('date')
			? new Date(page.url.searchParams.get('date'))
			: new Date()
	);
	let mobileMenu = $state(false);

	let progress = $derived.by(() => {

		if(tasks.length === 0) {
			return 0;
		}

		const completedTasks = tasks.filter(task => task.completed).length;

		return Math.round(
			(completedTasks / tasks.length) * 100
		);

	});


	async function loadTasks() {

		try {

			const response = await fetch(
				`http://localhost:3000/tasks/${userId}/${formatDate(selectedDate)}`
			);
			const data = await response.json();

			tasks = data;

		} catch (error) {

			console.log(error);

		}

	}

	

	function previousDay() {

		const newDate = new Date(selectedDate);

		newDate.setDate(newDate.getDate() - 1);

		selectedDate = newDate;

	}

	function nextDay() {

		const newDate = new Date(selectedDate);

		newDate.setDate(newDate.getDate() + 1);

		selectedDate = newDate;

	}

	async function toggleTask(id) {

		try {

			const response = await fetch(
				`http://localhost:3000/tasks/${id}/toggle`,
				{
					method: 'PATCH'
				}
			);

			const data = await response.json();

			console.log(data);

			loadTasks();

		} catch(error) {

			console.log(error);

		}

	}

	async function deleteTask(id) {

		try {

			const response = await fetch(
				`http://localhost:3000/tasks/${id}`,
				{
					method: 'DELETE'
				}
			);

			const data = await response.json();

			console.log(data);

			loadTasks();

		} catch(error) {

			console.log(error);

		}

	}

</script>

<div class="page">
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
				class="active"
				onclick={() => {
					mobileMenu = false;
				}}
			>
				{t.dashboard}
			</button>

			<button
				onclick={() => {
					goToChat();
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
				class="mobile-settings-link"
				onclick={() => {
					goToSettings();
					mobileMenu = false;
				}}
			>
				{t.settings}
			</button>

		</div>

		<div class="nav-right">
			<button onclick={goToSettings} class="settings">⚙</button>			
			<div class="profile">{user?.username.charAt(0).toUpperCase() || 'U'}</div>
		</div>
	</nav>


	<section class="hero">
		<h1>{t.goodMorning}, {user?.username || 'User'}</h1>
		<p>{t.todayOverview}</p>
	</section>

	<div class="content">
		<div class="main-card">
			<div class="top-row">

				<button onclick={previousDay}>
					←
				</button>

				<h2>
					{selectedDate.toLocaleDateString('de-DE', {
						day: '2-digit',
						month: 'long'
					})}
				</h2>

				<button onclick={nextDay}>
					→
				</button>

			</div>

			<div class="tasks">

				{#each tasks as task}

					<div class="task">

						<div class="task-left">

							<button
								class:done={task.completed}
								class="checkbox"
								onclick={() => toggleTask(task.id)}
							></button>

							<div class="task-content">

								<h3>{task.title}</h3>

								<p>
									{task.duration_min} {t.minutes}
								</p>

							</div>

						</div>

						<div class="task-right">

						<div class:done-pill={task.completed} class="status-pill">

							{#if task.completed}
								{t.completed}
							{:else}
								{t.pending}
							{/if}

						</div>

						<button
							class="delete-task"
							onclick={() => deleteTask(task.id)}
						>
							🗑
						</button>

						<button
							class="edit-task"
							onclick={() => editTask(task.id)}
						>
							✏️
						</button>

					</div>

				</div>

				{/each}

			</div>

			<div class="progress-section">
				<div class="progress-head">
					<p>{t.dailyProgress}</p>
					<span>{progress}%</span>				
				</div>

				<div class="progress-bar">
					<div
						class="progress-fill"
						style={`width:${progress}%`}
					></div>
				</div>
			</div>

			<div class="buttons">
				<button onclick={goToCreateActivity} class="add">{t.add}</button>
			</div>
		</div>

		<div class="side-card">
			<h3>{t.yourGoal}</h3>
			<p>{t.goalDescription}</p>

			<div class="circle">
				{progress}%
			</div>

			<button class="motivation">
				{t.viewMotivation}
			</button>
		</div>
	</div>
</div>


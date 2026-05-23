<script>
	import { goto } from '$app/navigation';

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

	let tasks = $state([]);

	let selectedDate = $state(new Date());
	let mobileMenu = $state(false);


	async function loadTasks() {

		try {

			const response = await fetch(
				`http://localhost:3000/tasks/${formatDate(selectedDate)}`
			);
			const data = await response.json();

			tasks = data;

		} catch (error) {

			console.log(error);

		}

	}

	$effect(() => {
		loadTasks();
	});

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
				Dashboard
			</button>

			<button
				onclick={() => {
					goToChat();
					mobileMenu = false;
				}}
			>
				Chat
			</button>

			<button
				onclick={() => {
					gotToStatistik();
					mobileMenu = false;
				}}
			>
				Statistik
			</button>

			<button
				class="mobile-settings-link"
				onclick={() => {
					goToSettings();
					mobileMenu = false;
				}}
			>
				Einstellungen
			</button>

		</div>

		<div class="nav-right">
			<button onclick={goToSettings} class="settings">⚙</button>			<div class="profile">A</div>
		</div>
	</nav>


	<section class="hero">
		<h1>Guten Morgen, Angelika</h1>
		<p>dein Überblick für heute</p>
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
									{task.duration_min} Minuten
								</p>

							</div>

						</div>

						<div class:done-pill={task.completed} class="status-pill">

							{#if task.completed}
								Erledigt
							{:else}
								Offen
							{/if}

						</div>

					</div>

				{/each}

			</div>

			<div class="progress-section">
				<div class="progress-head">
					<p>Tagesfortschritt</p>
					<span>72%</span>
				</div>

				<div class="progress-bar">
					<div class="progress-fill"></div>
				</div>
			</div>

			<div class="buttons">
				<button onclick={goToCreateActivity} class="add">Hinzufügen</button>
				<button class="edit">Bearbeiten</button>
				<button class="delete">Löschen</button>
			</div>
		</div>

		<div class="side-card">
			<h3>Dein Ziel</h3>
			<p>Bleibe diese Woche aktiv und erreiche deine tägliche Routine.</p>

			<div class="circle">
				72%
			</div>

			<button class="motivation">
				Motivation ansehen
			</button>
		</div>
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(html, body) {
		margin: 0;
		padding: 0;

		width: 100%;
		min-height: 100%;

		overflow-y: auto;
		overflow-x: hidden;
	}

	.page {
		padding: 40px 70px;
		min-height: 100vh;
		box-sizing: border-box;

		width: 100%;
		max-width: 100%;

		overflow-x: hidden;
	}

	.mobile-actions {
		display: none;
		align-items: center;
		gap: 10px;
	}

	.navbar {
		height: 90px;

		background: rgba(255,255,255,0.75);
		backdrop-filter: blur(16px);

		border: 1px solid #e5e7eb;
		border-radius: 30px;

		padding: 0 30px;

		display: flex;
		align-items: center;

		box-shadow: 0 10px 30px rgba(0,0,0,0.04);
	}

	.mobile-settings-link {
		display: none;
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

	.nav-right {
		display: flex;
		align-items: center;
		gap: 14px;

		margin-left: auto;
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
	background: #f3f4f6;
	color: #111827;
}

.active {
	background: #e0e7ff;
	color: #4f46e5 !important;
	font-weight: 700 !important;
}

.nav-right {
	display: flex;
	align-items: center;
	gap: 10px;
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

.settings {
	background: #f3f4f6;
	border: none;
}

.settings:hover {
	background: #e5e7eb;
}

.profile {
	background: #c7d2fe;
	color: #3730a3;
}

.profile:hover {
	transform: scale(1.05);
}

	.hero {
		margin-top: 55px;
	}

	.hero h1 {
		margin: 0;
		font-size: 46px;
		color: #111827;
	}

	.hero p {
		margin-top: 10px;
		color: #6b7280;
		font-size: 16px;
	}

	.content {
		margin-top: 35px;

		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 30px;

		width: 100%;
	}

	.main-card,
	.side-card {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 34px;
		padding: 40px;
		box-sizing: border-box;
	}

	.top-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.top-row h2 {
		margin: 0;
		font-size: 20px;
		color: #111827;
	}

	.top-row button {
		width: 44px;
		height: 38px;
		border: none;
		border-radius: 12px;
		background: #eef2ff;
		color: #4f46e5;
		font-size: 18px;
		cursor: pointer;
	}

	.tasks {

		margin-top: 35px;

		display: flex;
		flex-direction: column;

		gap: 18px;

	}

	.task {

		min-height: 84px;

		background: white;

		border: 1px solid #e5e7eb;

		border-radius: 24px;

		padding: 20px 24px;

		display: flex;
		align-items: center;
		justify-content: space-between;

		transition: 0.2s;

		box-shadow:
			0 4px 14px rgba(0,0,0,0.03);

	}

	.task:hover {

		transform: translateY(-2px);

		box-shadow:
			0 10px 24px rgba(0,0,0,0.06);

	}

	.task-left {

		display: flex;
		align-items: center;

		gap: 18px;

	}

	.checkbox {

		width: 26px;
		height: 26px;

		border-radius: 50%;

		border: 2px solid #6366f1;

		background: white;

		cursor: pointer;

		transition: 0.2s;

		flex-shrink: 0;

		padding: 0;

	}

	.checkbox:hover {

		transform: scale(1.08);

	}

	.checkbox.done {

		background: #6366f1;

		box-shadow:
			0 0 0 5px #e0e7ff;

	}

	.task-content h3 {

		margin: 0;

		font-size: 17px;

		color: #111827;

	}

	.task-content p {

		margin-top: 6px;

		font-size: 14px;

		color: #6b7280;

	}

	.status-pill {

		padding: 10px 16px;

		border-radius: 999px;

		background: #f3f4f6;

		color: #6b7280;

		font-size: 13px;
		font-weight: 700;

	}

	.done-pill {

		background: #dcfce7;

		color: #166534;

	}

	.checkbox {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 3px solid;
		background: white;
	}

	.checkbox.done {
		border-radius: 6px;
		border: none;
	}

	.task span {
		font-size: 16px;
		color: #111827;
	}

	.progress-section {
		margin-top: 50px;
	}

	.progress-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.progress-head p {
		margin: 0;
		color: #6b7280;
	}

	.progress-head span {
		color: #22c55e;
		font-weight: 700;
	}

	.progress-bar {
		margin-top: 14px;
		height: 12px;
		background: #e5e7eb;
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-fill {
		width: 72%;
		height: 100%;
		background: #22c55e;
		border-radius: 999px;
	}

	.buttons {
		margin-top: 50px;
		display: flex;
		gap: 18px;
		flex-wrap: wrap;
	}

	.buttons button {
		height: 56px;
		padding: 0 28px;
		border: none;
		border-radius: 18px;
		font-weight: 600;
		cursor: pointer;
	}

	.add {
		background: #c7d2fe;
		color: #3730a3;
	}

	.edit {
		background: #bbf7d0;
		color: #166534;
	}

	.delete {
		background: #fecaca;
		color: #991b1b;
	}

	.side-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.side-card h3 {
		margin: 0;
		font-size: 28px;
		color: #111827;
	}

	.side-card p {
		margin-top: 14px;
		color: #6b7280;
		line-height: 1.6;
	}

	.circle {
		margin-top: 35px;
		width: 180px;
		height: 180px;
		border-radius: 50%;
		background: #e0e7ff;
		color: #4338ca;
		font-size: 36px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.motivation {
		margin-top: 35px;
		height: 56px;
		padding: 0 28px;
		border: none;
		border-radius: 18px;
		background: #6366f1;
		color: white;
		font-weight: 600;
		cursor: pointer;
	}

	@media (max-width: 1100px) {
		.content {
			grid-template-columns: 1fr;
		}
	}

	.burger {
		display: none;
	}

	@media (max-width: 700px) {

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

			width: 190px;

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
		}

		.nav-right {
			display: none;
		}

		.content {
			grid-template-columns: 1fr;
		}

		.main-card,
		.side-card {
			width: 100%;
			padding: 25px;
		}

		.buttons {
			flex-direction: column;
		}

		.buttons button {
			width: 100%;
		}
	}

	@media (max-width: 950px) {

		.nav-links {
			position: absolute;

			top: 82px;
			right: 0;

			left: auto;

			width: 190px;

			background: rgba(255,255,255,0.98);
			backdrop-filter: blur(18px);

			border: 1px solid #e5e7eb;
			border-radius: 24px;

			padding: 14px;

			flex-direction: column;
			gap: 10px;

			box-shadow: 0 12px 30px rgba(0,0,0,0.12);

			z-index: 99999;

			margin-left: 0;
		}

		.nav-links.open {
			display: flex;
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

			background: #eef2ff;

			color: #4f46e5;
			font-size: 24px;

			cursor: pointer;
		}

		.nav-right {
			display: none;
		}
	}
</style>
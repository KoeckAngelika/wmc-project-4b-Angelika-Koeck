<script>
	import { goto } from '$app/navigation';

	const tasks = [
		{
			name: '20 Minuten Joggen',
			color: '#EEF2FF',
			accent: '#6366F1',
			done: false
		},
		{
			name: '2 Liter Wasser trinken',
			color: '#ECFDF5',
			accent: '#22C55E',
			done: true
		},
		{
			name: '10 Minuten Dehnen',
			color: '#FFFBEB',
			accent: '#F59E0B',
			done: false
		}
	];
</script>

<div class="page">
	<nav class="navbar">
		
		<img
			src="/logo.png"
			alt="Elevate Logo"
			class="logo"
		/>

		<div class="nav-links">
			<div class="active">Dashboard</div>
			<div>Chat</div>
			<div>Statistik</div>
		</div>

		<div class="nav-right">
			<div class="settings">⚙</div>
			<div class="profile">A</div>
		</div>
	</nav>

	<section class="hero">
		<h1>Guten Morgen, Angelika</h1>
		<p>dein Überblick für heute</p>
	</section>

	<div class="content">
		<div class="main-card">
			<div class="top-row">
				<button>←</button>
				<h2>Heute</h2>
				<button>→</button>
			</div>

			<div class="tasks">
				{#each tasks as task}
					<div class="task" style={`background:${task.color}`}>
						{#if task.done}
							<div
								class="checkbox done"
								style={`background:${task.accent}`}
							></div>
						{:else}
							<div
								class="checkbox"
								style={`border-color:${task.accent}`}
							></div>
						{/if}

						<span>{task.name}</span>
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
				<button class="add">Hinzufügen</button>
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
	:global(body) {
		margin: 0;
		font-family: Inter, sans-serif;
		background: #f5f5f7;
	}

	.page {
		padding: 40px 70px;
		min-height: 100vh;
		box-sizing: border-box;
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
	justify-content: space-between;

	box-shadow: 0 10px 30px rgba(0,0,0,0.04);
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

	margin-left: 40px;
}

.nav-links div {
	padding: 12px 22px;
	border-radius: 16px;

	font-size: 15px;
	font-weight: 500;
	color: #6b7280;

	cursor: pointer;
	transition: 0.2s;
}

.nav-links div:hover {
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
	gap: 14px;

	margin-left: auto;
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
		margin-top: 40px;
		display: flex;
		flex-direction: column;
		gap: 22px;
	}

	.task {
		height: 72px;
		border-radius: 20px;
		padding: 0 28px;
		display: flex;
		align-items: center;
		gap: 22px;
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

	@media (max-width: 700px) {
		.page {
			padding: 20px;
		}

		.nav-links {
			display: none;
		}

		.hero h1 {
			font-size: 34px;
		}

		.main-card,
		.side-card {
			padding: 25px;
		}

		.buttons {
			flex-direction: column;
		}

		.buttons button {
			width: 100%;
		}
	}
</style>
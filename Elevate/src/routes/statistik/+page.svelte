<script>

	import { goto } from '$app/navigation';

	function goToDashboard(){
		goto('/dashboard');
	}
	
	function gotToChat(){
		goto('/chat');
	}
    
	
	function goToSettings(){
		goto('/settings');
	}

    //Dummy Daten vom Chat
    const messages = [
        {
            user: 'Coach',
            text: 'Hey Jonas 👋 Wie läuft dein Training heute?',
            ai: true
        },
        {
            user: 'Du',
            text: 'Ganz gut, aber meine Motivation ist gerade low 😅',
            ai: false
        },
        {
            user: 'Coach',
            text: 'Das ist normal. Versuch heute einfach klein anzufangen 💪',
            ai: true
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
			<div onclick={goToDashboard}>Dashboard</div>
			<div onclick={gotToChat}>Chat</div>
			<div class="active">Statistik</div>
		</div>

		<div class="nav-right">
			<div class="settings">⚙</div>
			<div class="chat-profile">A</div>
		</div>
	</nav>
<!-- 
    <h1>Deine Statistik</h1>
    <p class="passwort-text">Analysiere deinen Fortschritt</p> -->

    <div class="content">

        <div class="sidebar">
            <h2>Kategorien</h2>

            <div class="chat-item active-chat">
                <div class="avatar">C</div>
                <div>
                    <h3>Kalorien</h3>
                </div>
            </div>

            <div class="chat-item">
                <div class="avatar gray">M</div>
                <div>
                    <h3>Gewicht</h3>
                </div>
            </div>

            <div class="chat-item">
                <div class="avatar gray">M</div>
                <div>
                    <h3>Trainingszeit</h3>
                </div>
            </div>

            <div class="chat-item">
                <div class="avatar gray">M</div>
                <div>
                    <h3>Fitness Score</h3>
                </div>
            </div>
        </div>

        <!-- STATISTIK -->
        <div class="stats-box">

            <div class="stats-header">
                <div>
                    <h2>Kalorien</h2>
                    <p>deine letzten 10 Tage</p>
                </div>
            </div>

            <div class="stats-main">
                <div class="stats-left">
                    <h1>2.340</h1>
                    <span>+12% mehr als letzte Woche</span>
                </div>

                <div class="graph">

                    <svg viewBox="0 0 900 320" class="chart">

                        <path
                            d="M60 240 
                            C140 180, 220 210, 300 150
                            S460 120, 520 90
                            S700 80, 820 20"
                            fill="none"
                            stroke="#7c83ff"
                            stroke-width="10"
                            stroke-linecap="round"
                        />

                        <circle cx="60" cy="240" r="10" fill="#7c83ff"/>
                        <circle cx="300" cy="150" r="10" fill="#7c83ff"/>
                        <circle cx="520" cy="90" r="10" fill="#7c83ff"/>
                        <circle cx="820" cy="20" r="10" fill="#7c83ff"/>

                    </svg>

                </div>
            </div>

            <div class="bottom-cards">

                <div class="mini-card blue">
                    Ø 2.1k täglich
                </div>

                <div class="mini-card green">
                    5 Tage aktiv
                </div>

                <div class="mini-card red">
                    -340 kcal
                </div>

            </div>

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

    
    .passwort-text{
        margin-top: 16px;

		text-align: left;

		font-size: 14px;

		color: #6b7280;
    }

    .settings,
    .chat-profile {
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

    .chat-profile {
        background: #c7d2fe;
        color: #3730a3;
    }

    .chat-profile:hover {
        transform: scale(1.05);
    }


    .content {
        margin-top: 35px;

        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 28px;
    }

    .sidebar {
        background: rgba(255,255,255,0.82);
        backdrop-filter: blur(18px);

        border: 1px solid #e5e7eb;
        border-radius: 34px;

        padding: 28px;

        min-height: 760px;
        box-sizing: border-box;

        box-shadow: 0 12px 30px rgba(0,0,0,0.04);
    }

    .sidebar h2 {
        margin-top: 0;
        margin-bottom: 28px;

        font-size: 24px;
        color: #111827;
    }

    .chat-item {
        display: flex;
        align-items: center;
        gap: 16px;

        padding: 16px;
        border-radius: 22px;

        cursor: pointer;
        transition: 0.2s;

        margin-bottom: 14px;
    }

    .chat-item:hover {
        background: #f3f4f6;
        transform: translateY(-2px);
    }

    .active-chat {
        background: #eef2ff;
    }

    .chat-item h3 {
        margin: 0;
        font-size: 15px;
        color: #111827;
    }

    .avatar {
        display: flex;
        align-items: center;
        justify-content: center;

        font-weight: 700;
    }

    .avatar {
        width: 52px;
        height: 52px;

        border-radius: 18px;

        background: #c7d2fe;
        color: #3730a3;
    }

    .gray {
        background: #e5e7eb;
        color: #374151;
    }


    @media (max-width: 1100px) {
        .content {
            grid-template-columns: 1fr;
        }

        .sidebar {
            height: auto;
        }

    }

    @media (max-width: 700px) {
        .page {
            padding: 20px;
        }

        .nav-links {
            display: none;
        }

        .content {
            gap: 20px;
        }

    }

    /* STATISTIK */

.stats-box {
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(18px);

    border: 1px solid #e5e7eb;
    border-radius: 34px;

    padding: 40px;

    min-height: 760px;
    box-sizing: border-box;

    box-shadow: 0 12px 30px rgba(0,0,0,0.04);

    display: flex;
    flex-direction: column;
}

.stats-header h2 {
    margin: 0;

    font-size: 48px;
    font-weight: 700;

    color: #111827;
}

.stats-header p {
    margin-top: 10px;

    color: #6b7280;
    font-size: 16px;
}

.stats-main {
    margin-top: 40px;
}

.stats-left h1 {
    margin: 0;

    font-size: 88px;
    font-weight: 700;

    color: #111827;
}

.stats-left span {
    display: block;
    margin-top: 10px;

    color: #22c55e;
    font-size: 24px;
    font-weight: 500;
}

.graph {
    margin-top: 60px;

    width: 100%;
    height: 320px;

    border-radius: 32px;

    background: #f5f5f7;

    padding: 30px;

    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: center;
}

.chart {
    width: 100%;
    height: 100%;
}



    /* BOTTOM */

    .bottom-cards {
        margin-top: 40px;

        display: flex;
        gap: 24px;
    }

    .mini-card {
        width: 220px;
        height: 90px;

        border-radius: 24px;

        display: flex;
        align-items: center;
        justify-content: center;

        font-weight: 700;
        font-size: 20px;
    }

    .blue {
        background: #eef2ff;
        color: #4f46e5;
    }

    .green {
        background: #ecfdf5;
        color: #166534;
    }

    .red {
        background: #fee2e2;
        color: #b91c1c;
    }
</style>
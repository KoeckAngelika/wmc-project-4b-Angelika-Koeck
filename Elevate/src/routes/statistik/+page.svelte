<script>

	import { goto } from '$app/navigation';
    import { getUserId } from '$lib/components/auth';

	function goToDashboard(){
		goto('/dashboard');
	}
	
	function gotToChat(){
		goto('/chat');
	}
    
	function goToSettings(){
		goto('/settings');
	}

    let mobileMenu = $state(false);

    let stats = $state([]);
    let selectedStat = $state(null);

    async function loadStats(){

        try{

            const userId = getUserId();

            const res = await fetch(
                `http://localhost:3000/statistics/${userId}`
            );

            const data = await res.json();

            if(data.length > 0){

                const latest = data[data.length - 1];

                stats = [

                    {
                        id: "steps",
                        title: "Schritte",
                        short: "S",
                        color: "#4f46e5",
                        value: latest.steps,
                        percent: "+12%",
                        days: `${latest.steps} Schritte`,
                        active: "Heute aktiv",
                        extra: "Workout"
                    },

                    {
                        id: "calories",
                        title: "Kalorien",
                        short: "K",
                        color: "#22c55e",
                        value: latest.calories_burned,
                        percent: "+8%",
                        days: `${latest.calories_burned} kcal`,
                        active: "Verbrannt",
                        extra: "Sehr gut"
                    },

                    {
                        id: "weight",
                        title: "Gewicht",
                        short: "G",
                        color: "#ef4444",
                        value: latest.weight_kg || 0,
                        percent: "0%",
                        days: `${latest.weight_kg || 0} kg`,
                        active: "Aktuelles Gewicht",
                        extra: "Stabil"
                    }

                ];

                selectedStat = stats[0];

            }

        }catch(err){
            console.log(err);
        }

    }

    loadStats();

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
                onclick={() => {
                    goToDashboard();
                    mobileMenu = false;
                }}
            >
                Dashboard
            </button>

            <button
                onclick={() => {
                    gotToChat();
                    mobileMenu = false;
                }}
            >
                Chat
            </button>

            <button
                class="active"
                onclick={() => {
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
            <div onclick={goToSettings} class="settings">⚙</div>
            <div class="chat-profile">A</div>
        </div>
    </nav>
    <div class="content">

        <div class="sidebar">

            <h2>Kategorien</h2>

            {#each stats as stat}

                <div
                    class:selected-card={selectedStat?.id === stat.id}
                    class="chat-item"
                    onclick={() => selectedStat = stat}
                >

                    <div
                        class="avatar"
                        style={`background:${stat.color}20; color:${stat.color}`}
                    >
                        {stat.short}
                    </div>

                    <div>
                        <h3>{stat.title}</h3>
                    </div>

                </div>

            {/each}

        </div>

        <!-- STATISTIK -->
        <div class="stats-box">

            <div class="stats-header">
                <div>
                    <h2>{selectedStat?.title}</h2>                   
                    <p>deine letzten 10 Tage</p>
                </div>
            </div>

            <div class="stats-main">
                <div class="stats-left">
                    <h1>{selectedStat?.value}</h1>
                    <span>{selectedStat?.percent}</span>
                </div>

                <div class="graph">

                    <svg viewBox="0 0 900 320" class="chart">

                        <path
                            d="M60 240 L300 150 L520 90 L820 20"
                            fill="none"
                            stroke={selectedStat?.color}
                            stroke-width="8"
                            stroke-linecap="round"
                        />

                        <circle cx="60" cy="240" r="10" fill={selectedStat?.color}/>
                        <circle cx="300" cy="150" r="10" fill={selectedStat?.color}/>
                        <circle cx="520" cy="90" r="10" fill={selectedStat?.color}/>
                        <circle cx="820" cy="20" r="10" fill={selectedStat?.color}/>

                    </svg>

                </div>
            </div>

            <div class="bottom-cards">

                <div class="mini-card blue">
                    {selectedStat?.days}
                </div>

                <div class="mini-card green">
                    {selectedStat?.active}
                </div>

                <div class="mini-card red">
                    {selectedStat?.extra}
                </div>

            </div>

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

        font-family: Inter, sans-serif;
        background: #f5f5f7;
    }

	.page {
        padding: 40px 70px;
        min-height: 100vh;

        width: 100%;
        max-width: 100%;

        box-sizing: border-box;

        overflow-x: hidden;
    }

    .mobile-actions {
        display: none;
        align-items: center;
        gap: 10px;
    }

    .mobile-settings-link {
        display: none;
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

    .selected-card{
        background:#eef2ff;
        border:2px solid #c7d2fe;
    }

    .selected-card:hover{
        background:#eef2ff;
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

        width: 100%;
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

    .burger {
        display: none;
    }

    @media (max-width: 700px) {

        .page {
            padding: 20px;
        }

        .navbar {
            position: relative;
            z-index: 10000;
        }

        .logo {
            width: 150px;
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
            gap: 20px;
        }

        .sidebar,
        .stats-box {
            width: 100%;
            min-height: auto;
            padding: 24px;
        }

        .bottom-cards {
            flex-direction: column;
        }

        .mini-card {
            width: 100%;
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

        flex-wrap: wrap;
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

    @media (max-width: 950px) {

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

            background: #f3f4f6;

            color: #4f46e5;
            font-size: 20px;
            font-weight: 700;

            cursor: pointer;

            transition: 0.2s;
        }

        .burger:hover {
            background: #e0e7ff;
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
            gap: 20px;
        }

        .sidebar,
        .stats-box {
            width: 100%;
            min-height: auto;
            padding: 24px;
        }

        .bottom-cards {
            flex-direction: column;
        }

        .mini-card {
            width: 100%;
        }
    }
</style>
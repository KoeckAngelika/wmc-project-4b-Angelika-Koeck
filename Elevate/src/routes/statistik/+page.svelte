<script>

    import './statistik.css';
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

    $effect(() => {

        if(userId){
            loadStats();
        }

    });

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

    let stats = $state([

        {
            id: "steps",
            title: "Schritte",
            short: "S",
            color: "#4f46e5",

            value: 0,

            graphValues: Array.from({ length: 10 }, (_, i) => ({
                value: 0,
                date: `Tag ${i + 1}`
            })),

            days: "0/10 Tage",
            active: "0 aktiv",
            extra: "10 nicht aktiv"
        },

        {
            id: "calories",
            title: "Kalorien",
            short: "K",
            color: "#22c55e",

            value: 0,

            graphValues: Array.from({ length: 10 }, (_, i) => ({
                value: 0,
                date: `Tag ${i + 1}`
            })),

            days: "0/10 Tage",
            active: "0 aktiv",
            extra: "10 nicht aktiv"
        },

        {
            id: "weight",
            title: "Gewicht",
            short: "G",
            color: "#ef4444",

            value: 0,

            graphValues: Array.from({ length: 10 }, (_, i) => ({
                value: 0,
                date: `Tag ${i + 1}`
            })),

            days: "0/10 Tage",
            active: "0 aktiv",
            extra: "10 nicht aktiv"
        }

    ]);

    let selectedStat = $state(stats[0]);
    let graphPoints = $state('');
    let hoverPoint = $state(null);

    async function loadStats(){

        try{

            const userId = getUserId();

            const res = await fetch(
                `http://localhost:3000/statistics/${userId}`
            );

            const data = await res.json();

            console.log("ALLE STATISTIK DATEN:");
            console.log(data);

            if(!Array.isArray(data)){

                console.log("Keine Statistik vorhanden");

                return;

            }


            if(data.length === 0){

                const emptyGraph = Array.from({ length: 10 }, (_, i) => ({
                    value: 0,
                    date: `Tag ${i + 1}`
                }));

                stats = [

                    {
                        id: "steps",
                        title: t.steps,
                        short: "S",
                        color: "#4f46e5",

                        value: 0,
                        graphValues: emptyGraph,

                        days: "0/10 Tage",
                        active: "0 aktiv",
                        extra: "10 nicht aktiv"
                    },

                    {
                        id: "calories",
                        title: "Kalorien",
                        short: "K",
                        color: "#22c55e",

                        value: 0,
                        graphValues: emptyGraph,

                        days: "0/10 Tage",
                        active: "0 aktiv",
                        extra: "10 nicht aktiv"
                    },

                    {
                        id: "weight",
                        title: t.weight,
                        short: "G",
                        color: "#ef4444",

                        value: 0,
                        graphValues: emptyGraph,

                        days: "0/10 Tage",
                        active: "0 aktiv",
                        extra: "10 nicht aktiv"
                    }

                ];

                const current = selectedStat?.id || "steps";

                selectedStat = stats.find(
                    x => x.id === current
                );

                return;
            }

            const sortedData = data.sort(
                (a,b) => new Date(a.stat_date) - new Date(b.stat_date)
            );

            const latest = sortedData[sortedData.length - 1];

            const last10Days = sortedData.slice(-10);


            const totalSteps = last10Days.reduce(
                (sum, x) => sum + Number(x.steps || 0),
                0
            );

            const totalCalories = last10Days.reduce(
                (sum, x) => sum + Number(x.calories_burned || 0),
                0
            );

            const lostWeight = Math.round(
                (totalCalories / 7700) * 1000
            );


            const activeDays =
	            last10Days.length;
            const inactiveDays = 10 - activeDays;


            stats = [

                {
                    id: "steps",
                    title: t.steps,
                    short: "S",
                    color: "#4f46e5",

                    value: totalSteps,

                    graphValues: last10Days.map((x,index) => ({

                        value: last10Days
                            .slice(0,index + 1)
                            .reduce(
                                (sum,item) => sum + Number(item.steps || 0),
                                0
                            ),

                        date: x.stat_date

                    })),

                    days: `${last10Days.length}/10 Tage`,
                    active: `${activeDays} aktiv`,
                    extra: `${inactiveDays} nicht aktiv`
                },


                {
                    id: "calories",
                    title: "Kalorien",
                    short: "K",
                    color: "#22c55e",

                    value: totalCalories,
                    graphValues: last10Days.map((x,index) => ({

                        value: last10Days
                            .slice(0,index + 1)
                            .reduce(
                                (sum,item) => 
                                    sum + Number(item.calories_burned || 0),
                                0
                            ),

                        date: x.stat_date

                    })),

                    days: `${last10Days.length}/10 Tage`,
                    active: `${activeDays} aktiv`,
                    extra: `${inactiveDays} nicht aktiv`
                },


                {
                    id: "weight",
                    title: t.weight,
                    short: "G",
                    color: "#ef4444",

                    value: `${lostWeight} g`,

                    graphValues: last10Days.map((x,index) => {

                        const caloriesUntilDay =
                            last10Days
                                .slice(0,index + 1)
                                .reduce(
                                    (sum,item) =>
                                        sum + Number(item.calories_burned || 0),
                                    0
                                );


                        return {

                            value: Math.round(
                                (caloriesUntilDay / 7700) * 1000
                            ),

                            date: x.stat_date

                        };

                    }),

                    days: `${last10Days.length}/10 Tage`,
                    active: `${activeDays} aktiv`,
                    extra: `${inactiveDays} nicht aktiv`
                }

            ];


            selectedStat = stats[0];


        }catch(err){

            console.log(err);

        }

    }

    function createGraph(values){


        if(!values || values.length === 0){
            return [];
        }


        if(values.every(x => Number(x.value) === 0)){
            return [];
        }


        let max = 10000;


        if(selectedStat?.id === "steps"){
            max = 20000;
        }

        if(selectedStat?.id === "calories"){
            max = 2000;
        }

        if(selectedStat?.id === "weight"){
            max = 500;
        }


        return values.map((item,index) => {

            return {

                x: 60 + index * 80,

                y: 260 - (item.value / max) * 220,

                value: item.value,

                date: item.date

            };

        });

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
                onclick={() => {
                    goToDashboard();
                    mobileMenu = false;
                }}
            >
                {t.dashboard}
            </button>

            <button
                onclick={() => {
                    gotToChat();
                    mobileMenu = false;
                }}
            >
                {t.chat}
            </button>

            <button
                class="active"
                onclick={() => {
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
            <div onclick={goToSettings} class="settings">⚙</div>
			<div class="profile">{user?.username.charAt(0).toUpperCase() || 'U'}</div>
        </div>
    </nav>
    <div class="content">

        <div class="sidebar">

            <h2>{t.categories}</h2>

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
                    <p>{t.last10Days}</p>
                </div>
            </div>

            <div class="stats-main">
                <div class="stats-left">
                    <h1>{selectedStat?.value}</h1>
                    <span>{selectedStat?.percent}</span>
                </div>

                <div class="graph">

                    <svg viewBox="0 0 900 320" class="chart">


                        <polyline
                            points={createGraph(selectedStat?.graphValues)
                                .map(p => `${p.x},${p.y}`)
                                .join(" ")}
                            fill="none"
                            stroke={selectedStat?.color}
                            stroke-width="8"
                            stroke-linecap="round"
                        />


                        {#each createGraph(selectedStat?.graphValues) as point}

                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="10"
                                fill={selectedStat?.color}

                                onmouseenter={() => hoverPoint = point}
                                onmouseleave={() => hoverPoint = null}

                                style="cursor:pointer"
                            />

                        {/each}


                        {#if hoverPoint}

                            <g>

                                <rect
                                    x={hoverPoint.x - 80}
                                    y={hoverPoint.y - 80}
                                    width="160"
                                    height="60"
                                    rx="14"
                                    fill="white"
                                />


                                <text
                                    x={hoverPoint.x}
                                    y={hoverPoint.y - 55}
                                    text-anchor="middle"
                                    font-size="14"
                                    fill="#6b7280"
                                >
                                    {hoverPoint.date}
                                </text>


                                <text
                                    x={hoverPoint.x}
                                    y={hoverPoint.y - 32}
                                    text-anchor="middle"
                                    font-size="18"
                                    font-weight="700"
                                    fill="#111827"
                                >
                                    {hoverPoint.value}
                                </text>


                            </g>

                        {/if}


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



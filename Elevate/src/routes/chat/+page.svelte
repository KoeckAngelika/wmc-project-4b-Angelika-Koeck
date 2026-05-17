<script>

	import { goto } from '$app/navigation';

	function goToDashboard(){
		goto('/dashboard');
	}
	
	function gotToStatistik(){
		goto('/statistik');
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
			<div class="active">Chat</div>
			<div onclick={gotToStatistik}>Statistik</div>
		</div>

		<div class="nav-right">
			<div class="settings">⚙</div>
			<div class="chat-profile">A</div>
		</div>
	</nav>

    <div class="content">

        <div class="sidebar">
            <h2>Chats</h2>

            <div class="chat-item active-chat">
                <div class="avatar">C</div>
                <div>
                    <h3>Coach</h3>
                    <p>Online</p>
                </div>
            </div>

            <div class="chat-item">
                <div class="avatar gray">M</div>
                <div>
                    <h3>Max</h3>
                    <p>Zuletzt aktiv</p>
                </div>
            </div>
        </div>

        <!-- CHAT -->
        <div class="chat-box">

            <div class="chat-header">
                <div class="chat-user">
                    <div class="big-avatar">C</div>

                    <div>
                        <h3>Coach</h3>
                        <p>Fitness Assistent</p>
                    </div>
                </div>
            </div>

            <div class="messages">
                {#each messages as msg}
                    <div class:my-message={!msg.ai} class="message">
                        <div class="bubble">
                            <strong>{msg.user}</strong>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                {/each}
            </div>

            <div class="input-area">
                <input
                    type="text"
                    placeholder="Nachricht schreiben..."
                />

                <button>Senden</button>
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

    /* SIDEBAR */

    .sidebar {
        background: rgba(255,255,255,0.82);
        backdrop-filter: blur(18px);

        border: 1px solid #e5e7eb;
        border-radius: 34px;

        padding: 28px;

        height: 760px;
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

    .chat-item p {
        margin: 5px 0 0;
        font-size: 13px;
        color: #6b7280;
    }

    .avatar,
    .big-avatar {
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

    .big-avatar {
        width: 60px;
        height: 60px;

        border-radius: 20px;

        background: #c7d2fe;
        color: #3730a3;
        font-size: 18px;
    }

    .gray {
        background: #e5e7eb;
        color: #374151;
    }

    /* CHAT */

    .chat-box {
        background: rgba(255,255,255,0.82);
        backdrop-filter: blur(18px);

        border: 1px solid #e5e7eb;
        border-radius: 34px;

        height: 760px;

        display: flex;
        flex-direction: column;

        box-shadow: 0 12px 30px rgba(0,0,0,0.04);
    }

    .chat-header {
        padding: 28px 34px;

        border-bottom: 1px solid #f1f5f9;
    }

    .chat-user {
        display: flex;
        align-items: center;
        gap: 18px;
    }

    .chat-user h3 {
        margin: 0;
        font-size: 20px;
        color: #111827;
    }

    .chat-user p {
        margin: 5px 0 0;
        font-size: 14px;
        color: #6b7280;
    }

    .messages {
        flex: 1;

        padding: 32px;

        overflow-y: auto;

        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    .message {
        display: flex;
    }

    .my-message {
        justify-content: flex-end;
    }

    .bubble {
        max-width: 420px;

        padding: 18px 22px;

        border-radius: 24px;

        background: #f3f4f6;

        box-shadow: 0 4px 14px rgba(0,0,0,0.03);
    }

    .my-message .bubble {
        background: #c7d2fe;
    }

    .bubble strong {
        font-size: 14px;
        color: #111827;
    }

    .bubble p {
        margin-top: 8px;
        margin-bottom: 0;

        line-height: 1.6;
        color: #374151;
    }

    /* INPUT */

    .input-area {
        padding: 24px;

        border-top: 1px solid #f1f5f9;

        display: flex;
        align-items: center;
        gap: 14px;
    }

    .input-area input {
        flex: 1;

        height: 60px;

        border: none;
        outline: none;

        border-radius: 20px;

        background: #f3f4f6;

        padding: 0 22px;

        font-size: 15px;
        color: #111827;
    }

    .input-area input::placeholder {
        color: #9ca3af;
    }

    .input-area button {
        height: 60px;

        padding: 0 30px;

        border: none;
        border-radius: 20px;

        background: #a5b4fc;
        color: #111827;

        font-weight: 700;
        font-size: 15px;

        cursor: pointer;
        transition: 0.2s;
    }

    .input-area button:hover {
        transform: translateY(-2px);
        background: #818cf8;
        color: white;
    }

    /* SCROLLBAR */

    .messages::-webkit-scrollbar {
        width: 8px;
    }

    .messages::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 999px;
    }

    /* RESPONSIVE */

    @media (max-width: 1100px) {
        .content {
            grid-template-columns: 1fr;
        }

        .sidebar {
            height: auto;
        }

        .chat-box {
            height: 680px;
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

        .sidebar,
        .chat-box {
            border-radius: 28px;
        }

        .messages {
            padding: 22px;
        }

        .chat-header {
            padding: 22px;
        }

        .input-area {
            padding: 18px;
        }

        .bubble {
            max-width: 100%;
        }
    }
</style>
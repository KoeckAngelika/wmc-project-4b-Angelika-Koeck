<script>

	import { goto } from '$app/navigation';
    import { io } from 'socket.io-client';
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


	});

    const socket = io('http://localhost:3000');

	function goToDashboard(){
		goto('/dashboard');
	}
	
	function gotToStatistik(){
		goto('/statistik');
	}
    
	
	function goToSettings(){
		goto('/settings');
	}

    let messages = $state([]);

    let requests = $state([]);  

    let mobileMenu = $state(false);
    let newMessage = $state('');
    let selectedFriend = $state(null);

    let search = $state('');
    let users = $state([]);
    let friends = $state([]);

    let tab = $state('contacts');

    $effect(() => {

        socket.on('receive_message', (message) => {

            messages = [...messages, message];

        });

    });

    $effect(() => {

        loadRequests();
	    loadFriends();

        socket.on('receive_message', (message) => {

            messages = [...messages, message];

        });

    });

    async function searchUsers() {

        if(!search.trim()) {
            users = [];
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:3000/users/search/${search}?userId=${getUserId()}`
            );

            const data = await response.json();

            users = data;

        } catch(error) {

            console.log(error);

        }

    }

    async function loadRequests() {

        try {

            const userId = getUserId();

            const response = await fetch(
                `http://localhost:3000/users/requests/${userId}`
            );

            const data = await response.json();

            requests = data;

        } catch(error) {

            console.log(error);

        }

    }

    async function loadMessages(friendId) {

        try {

            const userId = getUserId();

            const response = await fetch(
                `http://localhost:3000/chat/load-messages/${userId}/${friendId}`
            );

            const data = await response.json();

            messages = data.map(msg => ({
                user: msg.sender_id == userId ? t.you : t.friend,                
                text: msg.message,
                ai: msg.sender_id != userId
            }));

        } catch(error) {

            console.log(error);

        }

    }

    async function loadFriends() {

        try {

            const userId = getUserId();

            const response = await fetch(
                `http://localhost:3000/users/friends/${userId}`
            );

            const data = await response.json();

            friends = data;

        } catch(error) {

            console.log(error);

        }

    }

    async function sendFriendRequest(receiverId) {

        try {

            const senderId = getUserId();

            console.log('sender', senderId);
            console.log('receiver', receiverId);

            const response = await fetch(
                'http://localhost:3000/users/request',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        sender_id: senderId,
                        receiver_id: receiverId
                    })
                }
            );

            const data = await response.json();

            console.log(data);

        } catch(error) {

            console.log(error);

        }

    }

    async function acceptRequest(request) {

        try {

            const userId = getUserId();

            const response = await fetch(
                'http://localhost:3000/users/accept',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        request_id: request.id,
                        user_id: userId,
                        friend_id: request.user_id
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            loadRequests();
	        loadFriends();

        } catch(error) {

            console.log(error);

        }

    }

    async function sendMessage() {

        if(!newMessage.trim()) {
            return;
        }

        if(!selectedFriend) {
            alert(t.selectChat);
            return;
        }

        try {

            const senderId = getUserId();

            const messageData = {
                sender_id: senderId,
                receiver_id: selectedFriend.id,
                message: newMessage
            };

            await fetch(
                'http://localhost:3000/chat/save-message',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(messageData)
                }
            );

            messages = [
                ...messages,
                {
                    user: t.you,
                    text: newMessage,
                    ai: false
                }
            ];


            newMessage = '';

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
                onclick={() => {
                    goToDashboard();
                    mobileMenu = false;
                }}
            >
                {t.dashboard}
            </button>

            <button
                class="active"
                onclick={() => {
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
            <div onclick={goToSettings} class="settings">⚙</div>
			<div class="profile">{user?.username.charAt(0).toUpperCase() || 'U'}</div>
        </div>

    </nav>

    <div class="content">

        <div class="sidebar">
            <h2>{t.chats}</h2>
            <div class="chat-tabs">

                <button
                    class:active-tab={tab === 'contacts'}
                    onclick={() => tab = 'contacts'}
                >
                    {t.contacts}
                </button>

                <button
                    class:active-tab={tab === 'add'}
                    onclick={() => tab = 'add'}
                >
                    {t.add}
                        {#if requests.length > 0}
                            (+{requests.length})
                        {/if}
                </button>

            </div>

            {#if tab === 'contacts'}

                {#if friends.length === 0}

                <div class="empty-chats">

                    <div class="empty-icon">
                        💬
                    </div>

                    <h3>{t.noContacts}</h3>

                    <p>
                        {t.addUsersToStartChat}
                    </p>

                </div>

            {:else}

                {#each friends as friend}

                    <div
                        class:active-chat={selectedFriend?.id === friend.id}
                        class="chat-item"
                        role="button"
                        tabindex="0"
                        onclick={() => {

                            selectedFriend = friend;

                            loadMessages(friend.id);

                        }}
                    >

                        <div class="avatar">
                            {friend.username[0]}
                        </div>

                        <div class="chat-info">

                            <h3>{friend.username}</h3>

                            <p>{t.contact}</p>

                        </div>

                    </div>

                {/each}

            {/if}

            {:else}

                {#if requests.length > 0}

                    <div class="request-section">

                        <h4>{t.requests}</h4>

                        {#each requests as request}

                            <div class="chat-item">

                                <div class="avatar">
                                    {request.username[0]}
                                </div>

                                <div class="chat-info">

                                    <h3>{request.username}</h3>

                                    <p>{t.wantsToAddYou}</p>

                                </div>

                                <button
                                    class="add-user"
                                    onclick={() => acceptRequest(request)}
                                >
                                    ✓
                                </button>

                            </div>

                        {/each}

                    </div>

                    <div class="divider"></div>

                {/if}

                <div class="search-box">

                    <input
                        bind:value={search}
                        type="text"
                        placeholder={t.searchUsers}
                        oninput={searchUsers}
                    />

                </div>

                {#each users as user}

                    <div class="chat-item">

                        <div class="avatar">
                            {user.username[0]}
                        </div>

                        <div class="chat-info">

                            <h3>{user.username}</h3>

                            <p>{t.userFound}</p>

                        </div>

                        {#if user.is_friend || user.requested}

                            <div class="added-user">
                                ✓
                            </div>

                        {:else}

                            <button
                                class="add-user"
                                onclick={() => sendFriendRequest(user.id)}
                            >
                                +
                            </button>

                        {/if}

                    </div>

                {/each}

            {/if}
        </div>

        <!-- CHAT -->
        <div class="chat-box">

            {#if !selectedFriend}

                <div class="empty-chat">

                    <div class="empty-chat-icon">
                        💬
                    </div>

                    <h2>{t.noChatSelected}</h2>

                    <p>
                        {t.selectContact}                    
                    </p>

                </div>
            {/if}

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
                    bind:value={newMessage}
                    type="text"
                    placeholder={t.writeMessage}                    
                    onkeydown={(e) => {
                        if(e.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                />

                <button onclick={sendMessage}>
                    {t.send}
                </button>
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

        box-shadow: 0 10px 30px rgba(0,0,0,0.04);
    }

    .request-section h4 {

        margin-bottom: 18px;

        color: #6b7280;

        font-size: 13px;

        text-transform: uppercase;

        letter-spacing: 1px;

    }

    .divider {

        height: 1px;

        background: #e5e7eb;

        margin: 20px 0;

    }

    .empty-chat {

        flex: 1;

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        text-align: center;

        padding: 40px;

    }

    .empty-chat-icon {

        width: 120px;
        height: 120px;

        border-radius: 36px;

        background: #eef2ff;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 52px;

        margin-bottom: 30px;

    }

    .empty-chat h2 {

        margin: 0;

        font-size: 30px;

        color: #111827;

    }

    .empty-chat p {

        margin-top: 14px;

        font-size: 16px;

        line-height: 1.7;

        color: #6b7280;

        max-width: 320px;

    }

    .empty-chats {

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        text-align: center;

        padding-top: 80px;

    }

    .empty-icon {

        width: 80px;
        height: 80px;

        border-radius: 26px;

        background: #eef2ff;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 34px;

        margin-bottom: 24px;

    }

    .empty-chats h3 {

        margin: 0;

        font-size: 20px;

        color: #111827;

    }

    .empty-chats p {

        margin-top: 12px;

        font-size: 14px;

        line-height: 1.6;

        color: #6b7280;

        max-width: 220px;

    }

    .chat-tabs {

        display: flex;

        gap: 10px;

        margin-bottom: 24px;

    }

    .chat-tabs button {

        flex: 1;

        height: 48px;

        border: none;

        border-radius: 16px;

        background: #f3f4f6;

        color: #6b7280;

        font-size: 14px;
        font-weight: 700;

        cursor: pointer;

        transition: 0.2s;

    }

    .chat-tabs button:hover {

        background: #e5e7eb;

    }

    .active-tab {

        background: #e0e7ff !important;

        color: #4f46e5 !important;

    }

    .search-box {

        margin-bottom: 22px;

    }

    .search-box input {

        width: 100%;

        height: 54px;

        border: none;
        outline: none;

        border-radius: 18px;

        background: #f3f4f6;

        padding: 0 20px;

        font-size: 14px;

    }

    .chat-info {

        flex: 1;

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

    .profile {
        background: #c7d2fe;
        color: #3730a3;
    }

    .profile:hover {
        transform: scale(1.05);
    }

    .add-user {

        width: 38px;
        height: 38px;

        border: none;

        border-radius: 14px;

        background: #e0e7ff;

        color: #4f46e5;

        font-size: 22px;

        cursor: pointer;

        transition: 0.2s;

    }

    .add-user:hover {

        transform: scale(1.08);

        background: #c7d2fe;

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

    .nav-links.open {
        display: flex;
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

    /* SIDEBAR */

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

        min-height: 760px;

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
        }

        .nav-links.open {
            display: flex;
        }

        .nav-links button {
            width: 100%;
            text-align: center;
        }

        .nav-right {
            display: none;
        }

        .sidebar,
        .chat-box {
            width: 100%;
            min-height: auto;
        }

        .content {
            grid-template-columns: 1fr;
        }

        .input-area {
            flex-direction: column;
        }

        .input-area input,
        .input-area button {
            width: 100%;
        }
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

        .sidebar,
        .chat-box {
            width: 100%;
            min-height: auto;
        }

        .content {
            grid-template-columns: 1fr;
        }

        .input-area {
            flex-direction: column;
        }

        .input-area input,
        .input-area button {
            width: 100%;
        }
    }
</style>
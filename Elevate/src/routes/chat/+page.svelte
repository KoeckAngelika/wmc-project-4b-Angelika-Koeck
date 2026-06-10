<script>

    import './chat.css';
	import { goto } from '$app/navigation';
    import { io } from 'socket.io-client';
    import {
		getUser,
		getUserId
	} from '$lib/components/auth';

    import { translations } from '$lib/i18n';
    import { languageState } from '$lib/language.svelte.js';

    let t = $derived(translations[languageState.language]);
    let sentRequests = $state([]);

	let userId = $state(null);
	let user = $state(null);

	$effect(() => {

        user = getUser();

        userId = getUserId();

        languageState.loadLanguage();

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

        if(userId){

            loadRequests();
            loadFriends();

        }

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


            // Button direkt von + auf ✓ ändern
            if(response.ok) {

                sentRequests = [
                    ...sentRequests,
                    receiverId
                ];

            }

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

                        {#if user.is_friend || user.requested || sentRequests.includes(user.id)}
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



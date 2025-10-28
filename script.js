// --- Get HTML elements ---
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const joinBtn = document.getElementById('join-btn');
const nameInput = document.getElementById('name-input');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const userList = document.getElementById('user-list');
const scrollToBottomBtn = document.getElementById('scroll-to-bottom');

// --- File Elements ---
const fileInput = document.getElementById('file-input');
const sendFileBtn = document.getElementById('send-file-btn');
const fileStatus = document.getElementById('file-status');
// --- END ---

const socket = io("https://code-share-backend-vwwx.onrender.com");
const BACKEND_URL = "https://code-share-backend-vwwx.onrender.com"; // Store backend URL
let myName = '';
const ADMIN_KEY_STORAGE = 'codeShareAdminKey';

// --- (Copy Helper Function) ---
function fallbackCopyTextToClipboard(text, buttonElement) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful && buttonElement) {
            buttonElement.textContent = 'Copied!';
            setTimeout(() => { buttonElement.textContent = 'Copy'; }, 2000);
        }
    } catch (err) { console.error('Fallback copy failed: ', err); }
    document.body.removeChild(textArea);
}

// --- (Smart Scrolling Function) ---
function scrollToBottom(force = false) {
    const isScrolledUp = messages.scrollHeight - messages.scrollTop > messages.clientHeight + 100;
    if (force || !isScrolledUp) {
        messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
    }
}

// --- (Scroll Button Logic) ---
messages.addEventListener('scroll', () => {
    const isAtBottom = messages.scrollHeight - messages.scrollTop <= messages.clientHeight + 20;
    if (isAtBottom) {
        scrollToBottomBtn.style.display = 'none';
    } else {
        scrollToBottomBtn.style.display = 'block';
    }
});
scrollToBottomBtn.addEventListener('click', () => {
    scrollToBottom(true);
});


// --- Main Message Display Function ---
function displayMessage(data) {
    const item = document.createElement('li');
    item.dataset.id = data.id;
    
    if (data.isDeleted) {
        item.classList.add('is-deleted');
    }
    
    // Add Name
    const nameSpan = document.createElement('strong');
    nameSpan.textContent = data.name;
    item.appendChild(nameSpan);

    // --- Check message type ---
    if (data.type === 'file') {
        // --- Render a File Message ---
        item.classList.add('file-message');
        
        const fileLink = document.createElement('a');
        fileLink.href = `${BACKEND_URL}${data.url}`; // Build full URL
        fileLink.textContent = data.fileName || 'Download File';
        fileLink.target = '_blank'; // Open in new tab
        fileLink.download = data.fileName; // Suggest original filename
        
        item.appendChild(fileLink);

    } else {
        // --- Render a Code Message (existing logic) ---
        const displayContainer = document.createElement('div');
        displayContainer.className = 'display-container';

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = data.content; // Use 'content'
        
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.className = 'btn copy-btn';
        copyBtn.onclick = () => {
            fallbackCopyTextToClipboard(data.content, copyBtn);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'btn admin-btn delete-btn';
        deleteBtn.onclick = () => {
            if (confirm('Are you sure you want to delete this message?')) {
                socket.emit('deleteMessage', data.id);
            }
        };
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'btn admin-btn edit-btn';

        pre.appendChild(code);
        pre.appendChild(copyBtn);
        pre.appendChild(deleteBtn);
        pre.appendChild(editBtn);
        displayContainer.appendChild(pre);
        item.appendChild(displayContainer);
        
        const editContainer = document.createElement('div');
        editContainer.className = 'edit-container';
        
        const editTextArea = document.createElement('textarea');
        editTextArea.className = 'edit-textarea';
        editTextArea.value = data.content;
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'btn save-btn';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'btn cancel-btn';

        editContainer.appendChild(editTextArea);
        editContainer.appendChild(saveBtn);
        editContainer.appendChild(cancelBtn);
        item.appendChild(editContainer);

        editBtn.onclick = () => { item.classList.add('is-editing'); };
        cancelBtn.onclick = () => { item.classList.remove('is-editing'); editTextArea.value = data.content; };
        saveBtn.onclick = () => {
            socket.emit('editMessage', {
                messageId: data.id,
                newCode: editTextArea.value
            });
        };

        if (typeof hljs !== 'undefined') {
            hljs.highlightElement(code);
        }
    }
    
    messages.appendChild(item);
}

// --- (Notification Helper Function) ---
function showNotification(msg) {
    const item = document.createElement('li');
    item.className = 'notification';
    item.textContent = msg;
    messages.appendChild(item);
    scrollToBottom();
}

// --- (Join Chat Helper Function) ---
function joinChat(name) {
    myName = name;
    localStorage.setItem('codeShareName', myName);
    let adminKey = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (!adminKey) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('admin')) {
            adminKey = prompt("Enter Admin Key:");
            if (adminKey) {
                localStorage.setItem(ADMIN_KEY_STORAGE, adminKey);
            }
        }
    }
    socket.emit('join', { name: myName, adminKey: adminKey });
    loginScreen.style.display = 'none';
    chatScreen.style.display = 'block';
    input.focus();
}

// --- Page Load Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem('codeShareName');
    if (savedName) {
        nameInput.value = savedName;
        joinChat(savedName);
    } else {
        loginScreen.style.display = 'block';
    }
});

// --- Send Code Message ---
function sendCodeMessage() {
    if (input.value) {
        socket.emit('sendMessage', { content: input.value });
        input.value = '';
    }
}

// --- Event Listeners (Sending data) ---
joinBtn.onclick = () => {
    const name = nameInput.value.trim();
    if (name) {
        joinChat(name);
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendCodeMessage();
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendCodeMessage();
    }
});

// --- File Send Logic ---
sendFileBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
        fileStatus.textContent = 'No file selected!';
        return;
    }
    
    // Size limit
    if (file.size > 1e8) { // 100MB
        fileStatus.textContent = 'File is too large (max 100MB)';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const buffer = e.target.result;
        socket.emit('sendFile', {
            fileName: file.name,
            buffer: buffer
        });
        fileStatus.textContent = `Uploading ${file.name}...`;
    };
    
    // Handle successful upload confirmation
    socket.once('newMessage', (data) => {
        if (data.type === 'file' && data.name === myName) {
             fileStatus.textContent = `Upload complete!`;
             fileInput.value = ''; // Clear the file input
             setTimeout(() => fileStatus.textContent = '', 3000);
        }
    });

    reader.readAsArrayBuffer(file);
});


// --- Socket Listeners (Receiving data) ---
socket.on('loadHistory', (history) => {
    messages.innerHTML = '';
    history.forEach(data => displayMessage(data)); // Use displayMessage
    setTimeout(() => messages.scrollTop = messages.scrollHeight, 100); 
});

socket.on('newMessage', (data) => {
    displayMessage(data); // Use displayMessage
    scrollToBottom();
});

socket.on('adminStatus', (data) => {
    if (data.isAdmin) {
        console.log('Admin status confirmed.');
        document.body.classList.add('is-admin');
    } else {
        localStorage.removeItem(ADMIN_KEY_STORAGE);
    }
});

socket.on('userJoined', (msg) => {
    showNotification(msg);
});

socket.on('userLeft', (msg) => {
    showNotification(msg);
});

socket.on('updateUserList', (users) => {
    userList.innerHTML = '';
    users.forEach(name => {
        const item = document.createElement('li');
        item.textContent = name;
        userList.appendChild(item);
    });
});

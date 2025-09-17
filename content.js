// Content script for mouse simulator extension
let movementInterval = 0;
let mouseFollower = 0;
let isMoving = false;

// Create visual mouse follower
function createMouseFollower() {
  if (mouseFollower) return;
  
  mouseFollower = document.createElement('div');
  mouseFollower.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(255, 0, 0, 0.6);
    border: 2px solid red;
    pointer-events: none;
    z-index: 10000;
    transition: all 0.1s ease;
  `;
  document.body.appendChild(mouseFollower);
}

// Remove visual mouse follower
function removeMouseFollower() {
  if (mouseFollower) {
    mouseFollower.remove();
    mouseFollower = null;
  }
}

// Simulate mouse movement to coordinates
function simulateMouseMovement(x, y) {
  const event = new MouseEvent('mousemove', {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    screenX: x,
    screenY: y
  });
  
  document.dispatchEvent(event);
  
  // Update visual follower
  if (mouseFollower) {
    mouseFollower.style.left = x + 'px';
    mouseFollower.style.top = y + 'px';
  }
}

// Start movement
function startMovement() {
    if (isMoving)  {
        return;
    }
    createMouseFollower();

    isMoving = true;
  movementInterval = setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    simulateMouseMovement(x, y);
  }, 2000);
}

// Stop all movement
function stopMovement() {
    if (!isMoving)  {
        return;
    }
  if (movementInterval) {
    clearInterval(movementInterval);
    movementInterval = null;
  }
  removeMouseFollower();
  isMoving = false;
}

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    switch (request.action) {
      case 'startMovement':
        startMovement();
        sendResponse({ success: true });
        break;
        
      case 'stopMovement':
        stopMovement();
        sendResponse({ success: true });
        break;
        
      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Content script error:', error);
    sendResponse({ success: false, error: error.message });
  }
  
  return true; // Keep message channel open for async response
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  stopMovement();
});

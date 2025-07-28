import socketio
import pyperclip
import pyautogui
import time
import threading

sio = socketio.Client()
last_clipboard = ""

# --- Socket.IO Event Handlers ---

@sio.event(namespace='/ws_clipboard')
def connect():
    print("[✓ Connected to WebSocket Server]")

@sio.event(namespace='/ws_clipboard')
def disconnect():
    print("[✗ Disconnected from Server]")

@sio.on('prediction', namespace='/ws_clipboard')
def on_prediction(data):
    try:
        label = data.get("status")
        original = data.get("raw_input")
        if label and original:
            result_text = f"[{label}] {original}"
            pyperclip.copy(result_text)
            time.sleep(0.4)
            pyautogui.hotkey('ctrl', 'v')
            print(f"[✓ Auto-pasted prediction]: {result_text}")
    except Exception as e:
        print(f"[!] Error during paste: {e}")

# --- Clipboard Monitor ---

def monitor_clipboard():
    global last_clipboard
    print("[📋 Clipboard monitoring started...]")
    while True:
        try:
            current = pyperclip.paste()
            if current != last_clipboard and len(current.strip()) > 4:
                last_clipboard = current
                print(f"[📎 Copied] {current}")
                sio.emit('clipboard', {"clipboard": current}, namespace="/ws_clipboard")
            time.sleep(0.5)
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"[!] Clipboard monitor error: {e}")
            time.sleep(1)

# --- Main ---

if __name__ == "__main__":
    print("[Paysafe Laptop Clipboard Client - Auto Scanner Enabled]")
    try:
        sio.connect('http://localhost:5001', namespaces=['/ws_clipboard'])
        threading.Thread(target=monitor_clipboard, daemon=True).start()
        sio.wait()
    except KeyboardInterrupt:
        print("\n[Exiting]")
        sio.disconnect()
    except Exception as e:
        print(f"[!] Connection failed: {e}")

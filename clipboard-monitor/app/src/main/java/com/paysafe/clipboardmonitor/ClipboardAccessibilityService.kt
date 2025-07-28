package com.paysafe.clipboardmonitor

import android.accessibilityservice.AccessibilityService
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class ClipboardAccessService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event?.eventType == AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED) {
            val rootNode = rootInActiveWindow
            traverseNode(rootNode)
        }
    }

    override fun onInterrupt() {}

    private fun traverseNode(node: AccessibilityNodeInfo?) {
        if (node == null) return

        val text = node.text?.toString()
        if (!text.isNullOrEmpty()) {
            // Replace with your actual scam detection
            if (text.contains("gcash") || text.contains("urgent") || text.contains("free load")) {
                Log.d("Scan", "⚠️ Detected scam-like text: $text")
                // Broadcast or notify MainActivity, or send to your model
            }
        }

        for (i in 0 until node.childCount) {
            traverseNode(node.getChild(i))
        }
    }
}

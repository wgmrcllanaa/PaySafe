package com.paysafe.clipboardmonitor

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread
import org.json.JSONObject

class ClipboardMonitorService : Service() {
    private lateinit var clipboardManager: ClipboardManager
    private var lastClip: String? = null
    private val channelId = "ClipboardMonitorChannel"

    override fun onCreate() {
        super.onCreate()
        clipboardManager = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        clipboardManager.addPrimaryClipChangedListener(clipboardListener)
        createNotificationChannel()
        startForeground(1, createNotification())

    }
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(1, createNotification())
        return START_STICKY
    }


    private val clipboardListener = ClipboardManager.OnPrimaryClipChangedListener {
        val clip = clipboardManager.primaryClip
        val item = clip?.getItemAt(0)?.text?.toString()
        if (!item.isNullOrBlank() && item != lastClip) {
            lastClip = item
            sendToBackend(item)
        }
    }

    private fun sendToBackend(text: String) {
        thread {
            try {
                val prefs = getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
                val backendUrl = prefs.getString("backend_url", null) ?: return@thread
                println("Sending to backend: $backendUrl")
                println("Text: $text")
                
                val url = URL(backendUrl)
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.doOutput = true
                conn.setRequestProperty("Content-Type", "application/json")
                val json = "{\"clipboard\":\"${text.replace("\"", "\\\"")}\"}"
                println("JSON payload: $json")
                
                conn.outputStream.use { it.write(json.toByteArray()) }
                val response = conn.inputStream.bufferedReader().use { it.readText() }
                println("Response: $response")
                conn.disconnect()

                val jsonObj = JSONObject(response)
                val status = jsonObj.optString("status", "?")
                val probability = jsonObj.optDouble("probability", -1.0)
                println("Parsed status: $status, probability: $probability")
                
                if (probability >= 0) {
                    val resultString = "$status: $probability%"
                    showResultNotification(status, probability)

                    val intent = Intent("com.paysafe.clipboardmonitor.SCAN_RESULT")
                    intent.putExtra("result", resultString)
                    sendBroadcast(intent)
                }
            } catch (e: Exception) {
                e.printStackTrace()
                println("Error: ${e.message}")
                val toastIntent = Intent("com.paysafe.clipboardmonitor.ERROR")
                toastIntent.putExtra("error", "Failed to connect to server: ${e.message}")
                sendBroadcast(toastIntent)
            }
        }
    }


    private fun showResultNotification(status: String, probability: Double) {
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val resultText = "$status: $probability%"
        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Scan Result")
            .setContentText(resultText)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setAutoCancel(true)
            .build()
        notificationManager.notify(2, notification)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Clipboard Monitor Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("Clipboard Monitor Running")
            .setContentText("Monitoring clipboard for changes...")
            .setSmallIcon(android.R.drawable.ic_menu_info_details)
            .build()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        clipboardManager.removePrimaryClipChangedListener(clipboardListener)
        super.onDestroy()
    }
}
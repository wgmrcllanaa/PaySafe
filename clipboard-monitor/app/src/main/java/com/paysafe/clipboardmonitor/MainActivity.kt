package com.paysafe.clipboardmonitor

import android.Manifest
import android.annotation.SuppressLint
import android.content.*
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.paysafe.clipboardmonitor.ui.theme.ClipboardMonitorTheme
import android.content.Intent
import android.provider.Settings
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable

class MainActivity : ComponentActivity() {
    private val isMonitoringState = mutableStateOf(false)
    private val lastResultState = mutableStateOf("")
    private var isMonitoring = false
    private var lastResult = ""
    private lateinit var errorReceiver: BroadcastReceiver
    private lateinit var resultReceiver: BroadcastReceiver

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Ask for notification permission on Android 13+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED
            ) {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                    1001
                )
            }
        }


        // ✅ Set your UI content once
        setContent {
            val navController = rememberNavController()

            ClipboardMonitorTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    NavHost(navController = navController, startDestination = "monitor") {
                        composable("monitor") {
                            MonitorScreen(
                                isMonitoring = isMonitoringState.value,
                                lastResult = lastResultState.value,
                                onToggle = { toggle ->
                                    isMonitoringState.value = toggle
                                    if (toggle) {
                                        requestAccessibilityPermission()
                                        startMonitoring()
                                    } else {
                                        stopMonitoring()
                                    }
                                },
                                navController = navController
                            )
                        }
                        composable("scannedMessages") {
                            ScannedMessagesScreen(navController, listOf("SCAM: 92%", "LEGIT: 8%", "SCAM: 85%"))
                        }
                    }
                }
            }
        }

        // Setup result receiver
        resultReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                val result = intent?.getStringExtra("result") ?: ""
                lastResultState.value = result
            }
        }

        // Setup error receiver
        errorReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                val error = intent?.getStringExtra("error") ?: return
                Toast.makeText(context, error, Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun requestAccessibilityPermission() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        startActivity(intent)
    }

    @SuppressLint("UnspecifiedRegisterReceiverFlag")
    override fun onResume() {
        super.onResume()
        val errorFilter = IntentFilter("com.paysafe.clipboardmonitor.ERROR")
        val resultFilter = IntentFilter("com.paysafe.clipboardmonitor.SCAN_RESULT")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.registerReceiver(
                this,
                errorReceiver,
                errorFilter,
                ContextCompat.RECEIVER_NOT_EXPORTED
            )
            ContextCompat.registerReceiver(
                this,
                resultReceiver,
                resultFilter,
                ContextCompat.RECEIVER_NOT_EXPORTED
            )
        } else {
            registerReceiver(errorReceiver, errorFilter)
            registerReceiver(resultReceiver, resultFilter)
        }
    }

    override fun onPause() {
        super.onPause()
        unregisterReceiver(errorReceiver)
        unregisterReceiver(resultReceiver)
    }

    private fun startMonitoring() {
        val serviceIntent = Intent(this, ClipboardMonitorService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ContextCompat.startForegroundService(this, serviceIntent)
        } else {
            startService(serviceIntent)
        }
    }

    private fun stopMonitoring() {
        val serviceIntent = Intent(this, ClipboardMonitorService::class.java)
        stopService(serviceIntent)
    }
}

// ✅ Updated to accept navController
@Composable
fun MonitorScreen(
    isMonitoring: Boolean,
    lastResult: String,
    onToggle: (Boolean) -> Unit,
    navController: NavHostController
) {
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = "Clipboard Monitoring", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(24.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(text = if (isMonitoring) "ON" else "OFF", style = MaterialTheme.typography.bodyLarge)
            Spacer(modifier = Modifier.width(12.dp))
            Switch(checked = isMonitoring, onCheckedChange = { onToggle(it) })
        }

        Spacer(modifier = Modifier.height(32.dp))
        Text(text = "Last Scan Result:", style = MaterialTheme.typography.bodyMedium)
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = lastResult.ifBlank { "No scan yet." }, style = MaterialTheme.typography.bodyLarge)

        Button(onClick = {
            val intent = Intent(context, SettingsActivity::class.java)
            context.startActivity(intent)
        }) {
            Text("Go to Settings")
        }

    }
}

// ✅ Updated Preview to mock NavController
@Preview(showBackground = true)
@Composable
fun MonitorScreenPreview() {
    val navController = rememberNavController()
    ClipboardMonitorTheme {
        MonitorScreen(
            isMonitoring = true,
            lastResult = "SCAM: 90%",
            onToggle = {},
            navController = navController
        )
    }
}

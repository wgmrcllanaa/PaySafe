package com.paysafe.clipboardmonitor

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp

class SettingsActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    SettingsScreen()
                }
            }
        }
    }
}

@Composable
fun SettingsScreen() {
    val context = LocalContext.current
    val prefs = remember {
        context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
    }

    var backendUrl by remember {
        mutableStateOf(
            prefs.getString("backend_url", "http://192.168.254.121:5001/predict") ?: ""
        )
    }

    Column(modifier = Modifier
        .fillMaxSize()
        .padding(24.dp)) {

        Text(
            text = "Settings",
            style = MaterialTheme.typography.headlineMedium
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = backendUrl,
            onValueChange = {
                backendUrl = it
                prefs.edit().putString("backend_url", it).apply()
            },
            label = { Text("Backend URL") },
            modifier = Modifier.fillMaxWidth()
        )
    }
}

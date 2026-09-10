package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.Crossfade
import androidx.compose.animation.core.tween
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.data.TransitDatabase
import com.example.data.TransitRepository
import com.example.ui.components.TransitBottomBar
import com.example.ui.components.TransitTopBar
import com.example.ui.screens.BookTicketDialog
import com.example.ui.screens.DailyTraversDialog
import com.example.ui.screens.FareEnquiryDialog
import com.example.ui.screens.HelpBotDialog
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.MapScreen
import com.example.ui.screens.PassScreen
import com.example.ui.screens.ProfileWalletDialog
import com.example.ui.screens.TicketScreen
import com.example.ui.screens.TimetableDialog
import com.example.ui.screens.TripPlannerDialog
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.viewmodel.AppNavTab
import com.example.ui.viewmodel.TransitViewModel
import com.example.ui.viewmodel.TransitViewModelFactory

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val context = LocalContext.current
            val database = remember { TransitDatabase.getDatabase(context.applicationContext) }
            val repository = remember { TransitRepository(database.transitDao()) }
            val viewModel: TransitViewModel = viewModel(factory = TransitViewModelFactory(repository))
            val uiState by viewModel.uiState.collectAsState()

            val isDark = uiState.isDarkMode || (isSystemInDarkTheme() && !uiState.isDarkMode)

            MyApplicationTheme(darkTheme = uiState.isDarkMode) {
                TransitApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun TransitApp(viewModel: TransitViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(uiState.snackbarMessage) {
        uiState.snackbarMessage?.let { message ->
            snackbarHostState.showSnackbar(message)
            viewModel.clearSnackbar()
        }
    }

    val currentWalletBalance = uiState.cards.firstOrNull()?.balance ?: 1210.0

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        topBar = {
            TransitTopBar(
                walletBalance = 1210.0,
                userName = uiState.userName,
                onProfileClick = { viewModel.setProfileWalletVisible(true) }
            )
        },
        bottomBar = {
            TransitBottomBar(
                currentTab = uiState.currentTab,
                onTabSelected = { tab -> viewModel.setNavTab(tab) }
            )
        },
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            Crossfade(
                targetState = uiState.currentTab,
                animationSpec = tween(durationMillis = 220),
                label = "nav_tab_crossfade"
            ) { tab ->
                when (tab) {
                    AppNavTab.HOME -> HomeScreen(viewModel = viewModel, uiState = uiState)
                    AppNavTab.MAP -> MapScreen(viewModel = viewModel, uiState = uiState)
                    AppNavTab.PASS -> PassScreen(viewModel = viewModel, uiState = uiState)
                    AppNavTab.TICKET -> TicketScreen(viewModel = viewModel, uiState = uiState)
                }
            }
        }
    }

    // Modal: Profile & Wallet
    if (uiState.showProfileWallet) {
        ProfileWalletDialog(
            viewModel = viewModel,
            uiState = uiState,
            onDismiss = { viewModel.setProfileWalletVisible(false) }
        )
    }

    // Modal: Book Ticket Dialog
    if (uiState.showBookModal) {
        BookTicketDialog(
            initialOrigin = uiState.bookingOrigin,
            initialDestination = uiState.bookingDestination,
            initialMode = uiState.bookingMode,
            initialIsFamily = uiState.isFamilyBooking,
            walletBalance = 1210.0,
            onDismiss = { viewModel.setBookModalVisible(false) },
            onConfirmBooking = { origin, dest, mode, isFamily, count ->
                viewModel.confirmBookTicket(origin, dest, mode, isFamily, count)
            }
        )
    }

    // Modal: Fare Enquiry Dialog
    if (uiState.showFareEnquiryModal) {
        FareEnquiryDialog(
            onDismiss = { viewModel.setFareEnquiryVisible(false) },
            onBookNow = { origin, dest, mode ->
                viewModel.setBookingOrigin(origin)
                viewModel.setBookingDestination(dest)
                viewModel.setBookingMode(mode)
                viewModel.setBookModalVisible(true)
            }
        )
    }

    // Modal: Trip Planner Dialog
    if (uiState.showTripPlannerModal) {
        TripPlannerDialog(
            onDismiss = { viewModel.setTripPlannerVisible(false) },
            onBookItinerary = { origin, dest, mode ->
                viewModel.setBookingOrigin(origin)
                viewModel.setBookingDestination(dest)
                viewModel.setBookingMode(mode)
                viewModel.setBookModalVisible(true)
            }
        )
    }

    // Modal: Timetable Dialog
    if (uiState.showTimetableModal) {
        TimetableDialog(
            alerts = uiState.alerts,
            onDismiss = { viewModel.setTimetableVisible(false) }
        )
    }

    // Modal: Help / OneBot Dialog
    if (uiState.showHelpBotModal) {
        HelpBotDialog(
            onDismiss = { viewModel.setHelpBotVisible(false) }
        )
    }

    // Modal: Daily Travers Analytics Dialog
    if (uiState.showDailyTraversModal) {
        DailyTraversDialog(
            records = uiState.travelRecords,
            onDismiss = { viewModel.setDailyTraversVisible(false) }
        )
    }
}

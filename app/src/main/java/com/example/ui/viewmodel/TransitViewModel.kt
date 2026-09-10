package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.data.TicketEntity
import com.example.data.TransitAlertEntity
import com.example.data.TransitCardEntity
import com.example.data.TransitData
import com.example.data.TransitRepository
import com.example.data.TransitStation
import com.example.data.TravelRecordEntity
import com.example.data.WalletTransactionEntity
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class AppNavTab {
    HOME,
    MAP,
    PASS,
    TICKET
}

data class TransitUiState(
    val tickets: List<TicketEntity> = emptyList(),
    val activeTicket: TicketEntity? = null,
    val cards: List<TransitCardEntity> = emptyList(),
    val transactions: List<WalletTransactionEntity> = emptyList(),
    val travelRecords: List<TravelRecordEntity> = emptyList(),
    val alerts: List<TransitAlertEntity> = emptyList(),
    val currentTab: AppNavTab = AppNavTab.HOME,
    // Booking inputs on Hero card
    val bookingOrigin: String = "Thaltej Gam",
    val bookingDestination: String = "Rabari Colony",
    val bookingMode: String = "Metro", // "Metro", "BRTS", "AMTS", "Combo"
    val isFamilyBooking: Boolean = false,
    val passengerCount: Int = 1,
    // Active Modals
    val showProfileWallet: Boolean = false,
    val showBookModal: Boolean = false,
    val showFareEnquiryModal: Boolean = false,
    val showTripPlannerModal: Boolean = false,
    val showTimetableModal: Boolean = false,
    val showHelpBotModal: Boolean = false,
    val showDailyTraversModal: Boolean = false,
    val showRechargeCardModal: Boolean = false,
    val showApplyPassModal: Boolean = false,
    val selectedCardForRecharge: TransitCardEntity? = null,
    // Map State
    val selectedMapStation: TransitStation? = null,
    val mapLineFilter: String = "All", // "All", "Metro", "BRTS", "Interchanges"
    // User Settings
    val userName: String = "Arjun Yah",
    val userEmail: String = "arjun.yah@ahmedabadone.in",
    val userPhone: String = "+91 98765 43210",
    val userCityZone: String = "Ahmedabad West (Thaltej)",
    val userLanguage: String = "English", // "English", "Hindi", "Gujarati"
    val isDarkMode: Boolean = false,
    val notificationsEnabled: Boolean = true,
    val snackbarMessage: String? = null
)

class TransitViewModel(private val repository: TransitRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(TransitUiState())
    val uiState: StateFlow<TransitUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            repository.allTickets.collect { tickets ->
                _uiState.value = _uiState.value.copy(
                    tickets = tickets,
                    activeTicket = tickets.firstOrNull { it.status == "Active" } ?: tickets.firstOrNull()
                )
            }
        }
        viewModelScope.launch {
            repository.allCards.collect { cards ->
                _uiState.value = _uiState.value.copy(cards = cards)
            }
        }
        viewModelScope.launch {
            repository.allTransactions.collect { txs ->
                _uiState.value = _uiState.value.copy(transactions = txs)
            }
        }
        viewModelScope.launch {
            repository.allTravelRecords.collect { records ->
                _uiState.value = _uiState.value.copy(travelRecords = records)
            }
        }
        viewModelScope.launch {
            repository.allAlerts.collect { alerts ->
                _uiState.value = _uiState.value.copy(alerts = alerts)
            }
        }
    }

    fun setNavTab(tab: AppNavTab) {
        _uiState.value = _uiState.value.copy(currentTab = tab)
    }

    fun setBookingOrigin(origin: String) {
        _uiState.value = _uiState.value.copy(bookingOrigin = origin)
    }

    fun setBookingDestination(dest: String) {
        _uiState.value = _uiState.value.copy(bookingDestination = dest)
    }

    fun swapBookingStations() {
        val currentOrigin = _uiState.value.bookingOrigin
        val currentDest = _uiState.value.bookingDestination
        _uiState.value = _uiState.value.copy(
            bookingOrigin = currentDest,
            bookingDestination = currentOrigin
        )
    }

    fun setBookingMode(mode: String) {
        _uiState.value = _uiState.value.copy(bookingMode = mode)
    }

    fun setIsFamilyBooking(isFamily: Boolean) {
        val count = if (isFamily && _uiState.value.passengerCount < 2) 2 else if (!isFamily) 1 else _uiState.value.passengerCount
        _uiState.value = _uiState.value.copy(isFamilyBooking = isFamily, passengerCount = count)
    }

    fun setPassengerCount(count: Int) {
        _uiState.value = _uiState.value.copy(passengerCount = count.coerceIn(1, 8))
    }

    // Modal Visibility Toggles
    fun setProfileWalletVisible(visible: Boolean) {
        _uiState.value = _uiState.value.copy(showProfileWallet = visible)
    }

    fun setBookModalVisible(visible: Boolean) {
        _uiState.value = _uiState.value.copy(showBookModal = visible)
    }

    fun setFareEnquiryVisible(visible: Boolean) {
        _uiState.value = _uiState.value.copy(showFareEnquiryModal = visible)
    }

    fun setTripPlannerVisible(visible: Boolean) {
        _uiState.value = _uiState.value.copy(showTripPlannerModal = visible)
    }

    fun setTimetableVisible(visible: Boolean) {
        _uiState.value = _uiState.value.copy(showTimetableModal = visible)
    }

    fun setHelpBotVisible(visible: Boolean) {
        _uiState.value = _uiState.value.copy(showHelpBotModal = visible)
    }

    fun setDailyTraversVisible(visible: Boolean) {
        _uiState.value = _uiState.value.copy(showDailyTraversModal = visible)
    }

    fun setRechargeModalVisible(visible: Boolean, card: TransitCardEntity? = null) {
        _uiState.value = _uiState.value.copy(
            showRechargeCardModal = visible,
            selectedCardForRecharge = card ?: _uiState.value.cards.firstOrNull()
        )
    }

    fun setApplyPassModalVisible(visible: Boolean) {
        _uiState.value = _uiState.value.copy(showApplyPassModal = visible)
    }

    fun setSelectedMapStation(station: TransitStation?) {
        _uiState.value = _uiState.value.copy(selectedMapStation = station)
    }

    fun setMapLineFilter(filter: String) {
        _uiState.value = _uiState.value.copy(mapLineFilter = filter)
    }

    fun toggleDarkMode() {
        _uiState.value = _uiState.value.copy(isDarkMode = !_uiState.value.isDarkMode)
    }

    fun updateProfile(name: String, email: String, phone: String, zone: String) {
        _uiState.value = _uiState.value.copy(
            userName = name.trim().ifEmpty { "Arjun Yah" },
            userEmail = email.trim().ifEmpty { "arjun.yah@ahmedabadone.in" },
            userPhone = phone.trim().ifEmpty { "+91 98765 43210" },
            userCityZone = zone.trim().ifEmpty { "Ahmedabad West (Thaltej)" },
            snackbarMessage = "Profile details updated successfully!"
        )
    }

    fun setUserLanguage(language: String) {
        _uiState.value = _uiState.value.copy(userLanguage = language)
    }

    fun toggleNotifications() {
        _uiState.value = _uiState.value.copy(notificationsEnabled = !_uiState.value.notificationsEnabled)
    }

    fun clearSnackbar() {
        _uiState.value = _uiState.value.copy(snackbarMessage = null)
    }

    // Business Actions
    fun confirmBookTicket(
        origin: String = _uiState.value.bookingOrigin,
        destination: String = _uiState.value.bookingDestination,
        mode: String = _uiState.value.bookingMode,
        isFamily: Boolean = _uiState.value.isFamilyBooking,
        count: Int = _uiState.value.passengerCount
    ) {
        val fare = TransitData.calculateFare(origin, destination, mode, isFamily, count)
        viewModelScope.launch {
            repository.bookTicket(origin, destination, mode, if (isFamily) "Family" else "Single", count, fare)
            _uiState.value = _uiState.value.copy(
                showBookModal = false,
                currentTab = AppNavTab.TICKET,
                snackbarMessage = "Ticket booked successfully! QR code ready for gate scan."
            )
        }
    }

    fun rechargeSelectedCard(amount: Double) {
        val card = _uiState.value.selectedCardForRecharge ?: return
        viewModelScope.launch {
            repository.rechargeCard(card, amount)
            _uiState.value = _uiState.value.copy(
                showRechargeCardModal = false,
                snackbarMessage = "Recharged ₹${amount.toInt()} for Card ${card.cardNumber}"
            )
        }
    }

    fun addWalletFunds(amount: Double, method: String) {
        viewModelScope.launch {
            repository.topUpWallet(amount, method)
            _uiState.value = _uiState.value.copy(
                snackbarMessage = "Added ₹${amount.toInt()} to Ahmedabad One Wallet via $method"
            )
        }
    }

    fun applyForNewPass(holderName: String, cardType: String, mode: String, category: String, amount: Double) {
        viewModelScope.launch {
            repository.applyForCard(holderName, cardType, mode, category, amount)
            _uiState.value = _uiState.value.copy(
                showApplyPassModal = false,
                snackbarMessage = "New $cardType issued successfully!"
            )
        }
    }
}

class TransitViewModelFactory(private val repository: TransitRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(TransitViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return TransitViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

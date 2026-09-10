package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "tickets")
data class TicketEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val ticketNumber: String,
    val originStation: String,
    val destinationStation: String,
    val transitMode: String, // "Metro", "BRTS", "AMTS", "Combo"
    val passengerType: String, // "Single", "Family"
    val passengerCount: Int,
    val totalFare: Double,
    val purchaseDate: String,
    val validUntil: String,
    val status: String, // "Active", "Completed", "Expired"
    val platform: String,
    val routeLine: String,
    val qrCodePayload: String
)

@Entity(tableName = "transit_cards")
data class TransitCardEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val cardNumber: String,
    val holderName: String,
    val cardType: String, // "Ahmedabad Metro", "BRTS Janmarg", "AMTS Pass", "Unified 3-in-1"
    val mode: String, // "Metro", "Bus", "Combo"
    val balance: Double,
    val expiryDate: String,
    val status: String, // "Active", "Renewal Needed", "Pending"
    val passCategory: String // "Daily Travers", "Student Pass", "General Pass", "Senior Citizen"
)

@Entity(tableName = "wallet_transactions")
data class WalletTransactionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String,
    val subtitle: String,
    val amount: Double,
    val isCredit: Boolean,
    val timestamp: Long,
    val paymentMethod: String
)

@Entity(tableName = "travel_records")
data class TravelRecordEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val origin: String,
    val destination: String,
    val mode: String,
    val distanceKm: Double,
    val farePaid: Double,
    val dateStr: String,
    val co2SavedKg: Double
)

@Entity(tableName = "transit_alerts")
data class TransitAlertEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val routeCode: String,
    val lineName: String,
    val title: String,
    val message: String,
    val severity: String, // "Warning", "Info", "Delayed"
    val timeAgo: String
)

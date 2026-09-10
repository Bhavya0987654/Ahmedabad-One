package com.example.data

import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class TransitRepository(private val transitDao: TransitDao) {

    val allTickets: Flow<List<TicketEntity>> = transitDao.getAllTickets()
    val activeTicket: Flow<TicketEntity?> = transitDao.getActiveTicket()
    val allCards: Flow<List<TransitCardEntity>> = transitDao.getAllCards()
    val allTransactions: Flow<List<WalletTransactionEntity>> = transitDao.getAllTransactions()
    val allTravelRecords: Flow<List<TravelRecordEntity>> = transitDao.getAllTravelRecords()
    val allAlerts: Flow<List<TransitAlertEntity>> = transitDao.getAllAlerts()

    suspend fun bookTicket(
        origin: String,
        destination: String,
        mode: String,
        passengerType: String,
        count: Int,
        fare: Double
    ): Long {
        val now = System.currentTimeMillis()
        val dateFormat = SimpleDateFormat("dd MMM, yyyy • HH:mm", Locale.getDefault())
        val purchaseStr = dateFormat.format(Date(now))
        val validStr = dateFormat.format(Date(now + 3 * 3600 * 1000L)) // 3 hours validity

        val ticketNumber = "TKT-AHM-${(1000..9999).random()}-${(100..999).random()}"
        val platform = if (origin.contains("Thaltej", ignoreCase = true) || origin.contains("Motera", ignoreCase = true)) "02" else "01"
        val line = when (mode) {
            "Metro" -> "East-West / North-South Line (Platform $platform)"
            "BRTS" -> "BRTS Janmarg Dedicated Corridor"
            "AMTS" -> "AMTS City Link Bus"
            else -> "Unified 3-in-1 Metro & Bus Link"
        }
        val qrPayload = "AHM1-QR-$ticketNumber-$origin-$destination-$count"

        val ticket = TicketEntity(
            ticketNumber = ticketNumber,
            originStation = origin.uppercase(Locale.getDefault()),
            destinationStation = destination.uppercase(Locale.getDefault()),
            transitMode = mode,
            passengerType = passengerType,
            passengerCount = count,
            totalFare = fare,
            purchaseDate = purchaseStr,
            validUntil = validStr,
            status = "Active",
            platform = platform,
            routeLine = line,
            qrCodePayload = qrPayload
        )

        val id = transitDao.insertTicket(ticket)

        // Deduct from wallet/record transaction
        transitDao.insertTransaction(
            WalletTransactionEntity(
                title = "$mode Ticket Booking",
                subtitle = "$origin -> $destination ($passengerType x$count)",
                amount = fare,
                isCredit = false,
                timestamp = now,
                paymentMethod = "Ahmedabad One Wallet"
            )
        )

        // Record in travel records
        val distTime = TransitData.calculateDistanceAndTime(origin, destination)
        transitDao.insertTravelRecord(
            TravelRecordEntity(
                origin = origin,
                destination = destination,
                mode = mode,
                distanceKm = distTime.first,
                farePaid = fare,
                dateStr = SimpleDateFormat("dd MMM, yyyy", Locale.getDefault()).format(Date(now)),
                co2SavedKg = Math.round(distTime.first * 0.14 * 10.0) / 10.0
            )
        )

        return id
    }

    suspend fun rechargeCard(card: TransitCardEntity, amount: Double) {
        val updated = card.copy(balance = card.balance + amount)
        transitDao.updateCard(updated)

        transitDao.insertTransaction(
            WalletTransactionEntity(
                title = "Smart Card Recharge (${card.cardType})",
                subtitle = "Card: ${card.cardNumber}",
                amount = amount,
                isCredit = false,
                timestamp = System.currentTimeMillis(),
                paymentMethod = "UPI / Net Banking"
            )
        )
    }

    suspend fun topUpWallet(amount: Double, method: String) {
        transitDao.insertTransaction(
            WalletTransactionEntity(
                title = "Wallet Balance Top-up",
                subtitle = "$method • Instant Credit",
                amount = amount,
                isCredit = true,
                timestamp = System.currentTimeMillis(),
                paymentMethod = method
            )
        )
    }

    suspend fun applyForCard(
        holderName: String,
        cardType: String,
        mode: String,
        passCategory: String,
        initialAmount: Double
    ): Long {
        val randomDigits = (1000..9999).random()
        val prefix = when (mode) {
            "Metro" -> "AM"
            "Bus" -> "IPASS"
            else -> "AHM-UNI"
        }
        val cardNumber = "$prefix-$randomDigits-${(1000..9999).random()}"

        val card = TransitCardEntity(
            cardNumber = cardNumber,
            holderName = holderName,
            cardType = cardType,
            mode = mode,
            balance = initialAmount,
            expiryDate = "09/2028",
            status = "Active",
            passCategory = passCategory
        )

        val id = transitDao.insertCard(card)

        transitDao.insertTransaction(
            WalletTransactionEntity(
                title = "New Pass Issuance: $cardType",
                subtitle = "Pass No: $cardNumber",
                amount = initialAmount,
                isCredit = false,
                timestamp = System.currentTimeMillis(),
                paymentMethod = "Online Payment"
            )
        )

        return id
    }
}
